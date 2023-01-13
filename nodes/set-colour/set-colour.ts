// -----------------------------------------------------------------------------
// set-brightness node
// Allows you to set the brightness of a Twinkly light
// -----------------------------------------------------------------------------

// imports
import Colour from "colorjs.io";
import { NodeInitializer, Node, NodeDef, NodeMessageInFlow } from "node-red";
import { xledServerNode } from "../xled-server/xled-server.js";

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
		let fade = (node.override && node.fade) || msg.fade || node.fade;
		let colour =
			(node.override && assignColour(node, node)) ||
			assignColour(msg, node) ||
			assignColour(node, node);

		if (colour === undefined) throw new Error("No colour specified");
		colour.to("hsv");
		await node.server.light.ensureLoggedIn();
		let currentBrightness = await node.server.light.getBrightness();
		await node.server.light.setHSVColour(
			colour.hsv.h,
			colour.hsv.s,
			currentBrightness
		);
		node.debug(
			`Set colour to (h:${colour.hsv.h}, s:${colour.hsv.s}, v:${colour.hsv.v}`
		);
	} catch (err: any) {
		done(err);
	}
	done();
}
function assignColour(source: any, node: any) {
	if (typeof source.red == "number") {
		return new Colour(
			"srgb",
			[source.red / 255, source.green / 255, source.blue / 255],
			0
		);
	} else if (typeof source.hue == "number") {
		return new Colour(
			"hsv",
			[source.hue, source.saturation, source.brightness],
			1
		);
	} else if (source.hex.length > 0) {
		return new Colour(source.hex);
	}
	return undefined;
}
