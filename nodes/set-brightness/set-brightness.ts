// -----------------------------------------------------------------------------
// set-brightness node
// Allows you to set the brightness of a Twinkly light
// -----------------------------------------------------------------------------

// imports
import { Node, NodeDef } from "node-red";
import { xledServerNode } from "../xled-server/xled-server.js";

// interfaces
interface setBrightnessConfig {
	server: xledServerNode | string;
	brightness: number;
	override: boolean;
}
export interface setBrightnessNodeDef extends NodeDef, setBrightnessConfig {}

// create node

export default function (RED: any): void {
	RED.nodes.registerType("set-brightness", brightness);
	function brightness(this: Node, config: setBrightnessNodeDef) {
		return setBrightnessNode(this, config, RED);
	}
}

function setBrightnessNode(
	node: any,
	config: setBrightnessNodeDef,
	RED: any
): void {
	// Create the node
	RED.nodes.createNode(node, config);
	// Check server exists
	try {
		node.server = RED.nodes.getNode(config.server);
	} catch (err) {
		node.error("XLED Server not found");
		return;
	}
	node.on("input", async function (msg: any, send: any, done: any) {
		try {
			await node.server.light.ensureLoggedIn();
			let brightness: number = Number(
				config.override
					? config.brightness
					: msg.brightness || config.brightness
			);
			if (brightness > 100 || brightness < 0)
				throw new RangeError("Brightness must be between 0 and 100 inclusive");

			await node.server.light.setBrightness(brightness);
			node.debug(`Set brightness to ${brightness}`);
		} catch (err: any) {
			done(err);
		}
		done();
	});
}
