// -----------------------------------------------------------------------------
// set-brightness node
// Allows you to set the brightness of a Twinkly light
// -----------------------------------------------------------------------------

// imports
import { NodeInitializer, Node, NodeDef, NodeMessageInFlow } from "node-red";
import { xledServerNode } from "../xled-server/xled-server.js";

// interfaces
interface setBrightnessConfig {
	server: xledServerNode | string;
	brightness: number;
	override: boolean;
}
export interface setBrightnessNode extends Node, setBrightnessConfig {
	server: xledServerNode;
}
export interface setBrightnessNodeDef extends NodeDef, setBrightnessConfig {}

// create node
export default function (RED: any): void {
	function setBrightnessNode(
		this: setBrightnessNode,
		config: setBrightnessNodeDef
	): void {
		RED.nodes.createNode(this, config);
		// check server exists
		try {
			this.server = RED.nodes.getNode(config.server);
		} catch (err) {
			this.error("XLED Server not found");
			return;
		}
		// set config
		this.brightness = config.brightness;
		this.override = config.override;
		const node = this; // makes typescript happy when using it inside node.on()
		node.on("input", async function (msg: any, send, done) {
			setBrightness(node, msg, done);
		});
	}
	RED.nodes.registerType("set-brightness", setBrightnessNode);
}
async function setBrightness(node: setBrightnessNode, msg: any, done: any) {
	try {
		let brightness: number = node.override
			? node.brightness
			: msg.brightness || node.brightness;

		if (brightness > 100 || brightness < 0)
			throw new RangeError("Brightness must be between 0 and 100 inclusive");

		await node.server.light.ensureLoggedIn();
		await node.server.light.setBrightness(brightness);
		node.debug(`Set brightness to ${brightness}`);
	} catch (err: any) {
		done(err);
	}
	done();
}
