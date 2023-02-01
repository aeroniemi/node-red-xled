// -----------------------------------------------------------------------------
// set-brightness node
// Allows you to set the brightness of a Twinkly light
// -----------------------------------------------------------------------------

// imports
import Colour from "colorjs.io";
import { NodeInitializer, Node, NodeDef, NodeMessageInFlow } from "node-red";
import { xledServerNode } from "../xled-server/xled-server.js";
import delay from "delay";
// interfaces
interface colourNodeConfig {
	server: xledServerNode | string;
	override: boolean;
	red: number;
	green: number;
	blue: number;
	hue: number;
	saturation: number;
	brightness: number;
	hex: string;
	fade: number;
	mb: boolean;
}
export interface colourNode extends Node, colourNodeConfig {
	server: xledServerNode;
}
export interface colourNodeDef extends NodeDef, colourNodeConfig {
	server: xledServerNode;
}

// create node
export default function (RED: any): void {
	function setColourNode(this: colourNode, config: colourNodeDef): void {
		RED.nodes.createNode(this, config);
		// check server exists
		try {
			this.server = RED.nodes.getNode(config.server);
		} catch (err) {
			this.error("XLED Server not found");
			return;
		}
		// set config
		this.red = config.red;
		this.green = config.green;
		this.blue = config.blue;
		this.hue = config.hue;
		this.saturation = config.saturation;
		this.brightness = config.brightness;
		this.hex = config.hex;
		this.override = config.override;
		this.mb = config.mb;
		this.fade = config.fade;
		const node = this; // makes typescript happy when using it inside node.on()
		node.on("input", async function (msg: any, send, done) {
			await setColour(node, msg, done);
		});
	}
	RED.nodes.registerType("set-colour", setColourNode);
}

async function setColour(node: colourNode, msg: any, done: any) {
	try {
		node.debug(`Fade: ${[node.fade, msg.fade]}`);
		let fade = (node.override && node.fade) || msg.fade || node.fade || 0;
		let colour =
			(node.override && assignColour(node, node)) ||
			assignColour(msg, node) ||
			assignColour(node, node);
		if (colour === undefined) throw new Error("No colour specified");
		colour.to("hsv");
		await node.server.light.ensureLoggedIn();
		let currentBrightness = await node.server.light.getBrightness();

		if (fade == 0) {
			if (node.mb) {
				await node.server.light.setHSVColour(
					colour.hsv.h,
					colour.hsv.s,
					node.mb ? currentBrightness : colour.hsv.v
				);
				node.debug(
					`Set colour to (h:${colour.hsv.h}, s:${colour.hsv.s}, v:${colour.hsv.v})`
				);
			} else {
				colour.to("srgb");
				await node.server.light.setRGBColour(
					Math.round(colour.srgb.r * 255),
					Math.round(colour.srgb.g * 255),
					Math.round(colour.srgb.b * 255)
				);
				node.debug(
					`Set colour to (r:${Math.round(colour.srgb.r)}, g:${Math.round(
						colour.srgb.g
					)}, b:${Math.round(colour.srgb.b)})`
				);
			}
		} else {
			let currentColour = new Colour(
				"hsv",
				await node.server.light.getHSVColour(),
				1
			);
			if (node.mb) {
				currentColour.hsv.v = currentBrightness;
				colour.hsv.v = currentBrightness;
			}
			// @ts-expect-error
			let steps: any = currentColour.steps(colour, {
				space: "srgb",
				outputSpace: "hsv",
				maxDeltaE: 2.65, // max deltaE between consecutive steps (optional)
				maxSteps: Math.floor(15 * fade), // min number of steps
				steps: 3,
				method: "JzCzhz",
			});
			if (steps?.length > 1) {
				node.debug(`steps: ${steps.length}`);
				for (let step of steps) {
					node.debug(
						`Set colour to (h:${step.hsv.h}, s:${step.hsv.s}, v:${step.hsv.v})`
					);
					await Promise.all([
						node.server.light.setHSVColour(step.hsv.h, step.hsv.s, step.hsv.v),
						delay((fade * 1000) / steps.length),
					]);
				}
			}
		}
	} catch (err: any) {
		done(err);
	}
	done();
}
function assignColour(source: any, node: any) {
	if (source?.red > 0) {
		return new Colour(
			"srgb",
			[source.red / 255, source.green / 255, source.blue / 255],
			0
		);
	} else if (source?.hue > 0) {
		return new Colour(
			"hsv",
			[source.hue, source.saturation, source.brightness],
			1
		);
	} else if (source?.hex) {
		return new Colour(source.hex);
	}
	return undefined;
}
