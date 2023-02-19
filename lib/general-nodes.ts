import Colour from "colorjs.io";
import xledServer, { xledServerNode } from "../nodes/xled-server/xled-server";
import { Node, NodeDef } from "node-red";
// -----------------------------------------------------------------------------
// assignColour
// take a object and returns a colour it if contains valid attributes
// -----------------------------------------------------------------------------
function assignColour(source: any, node: any) {
	if (source?.red && !(source.red == "")) {
		return new Colour(
			"srgb",
			[source.red / 255, source.green / 255, source.blue / 255],
			0
		);
	} else if (source?.hue && !(source.hue == "")) {
		return new Colour(
			"hsv",
			[source.hue, source.saturation, source.brightness],
			1
		);
	} else if (source?.hex && !(source.hex == "")) {
		return new Colour(source.hex);
	}
	throw new Error("No Colour Defined (assignColour)");
}
// -----------------------------------------------------------------------------
// selectColour
// takes the config and msg and covers determining the colour to output
// using assignColour
// -----------------------------------------------------------------------------
export function selectColour(
	node: xledNode,
	config: colourNodeConfig,
	msg: any
) {
	if (config?.override) {
		try {
			return assignColour(config, node);
		} catch {}
	}
	try {
		return assignColour(msg, node);
	} catch {}
	try {
		return assignColour(config, node);
	} catch {}
	console.log(msg);
	throw new Error("No colour is available");
}
// -----------------------------------------------------------------------------
// setColourNode
// node generator function
// -----------------------------------------------------------------------------
export function setColourNode(
	node: any,
	config: colourNodeDef,
	RED: any,
	returnFn: Function
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
			let colour: Colour = selectColour(node, config, msg);
			await node.server.light.ensureLoggedIn();
			await returnFn(<setColourIf>{
				node: node,
				config: config,
				msg: msg,
				colour: colour,
			});
		} catch (err: any) {
			done(err);
		}
		done();
	});
}
// -----------------------------------------------------------------------------
// Interfaces
// -----------------------------------------------------------------------------
export interface xledNode extends Node {
	server: xledServerNode;
}
export interface colourNodeDef extends NodeDef, colourNodeConfig {
	server: xledServerNode;
}
export interface colourNodeConfig {
	server: xledServerNode | string;
	override: boolean;
	red?: number;
	green?: number;
	blue?: number;
	hue?: number;
	saturation?: number;
	brightness?: number;
	hex?: string;
}
export interface setColourIf {
	node: xledNode;
	config: colourNodeDef;
	msg: any;
	colour: Colour;
}
