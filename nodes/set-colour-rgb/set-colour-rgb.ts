// -----------------------------------------------------------------------------
// set-brightness node
// Allows you to set the brightness of a Twinkly light
// -----------------------------------------------------------------------------

// imports
import {
	setColourNode,
	setColourIf,
	colourNodeDef,
} from "../../lib/general-nodes.js";

// create node
export default function (RED: any): void {
	RED.nodes.registerType("set-colour-rgb", rgb);
	function rgb(this: Node, config: colourNodeDef) {
		return setColourNode(this, config, RED, setColourRGB);
	}
}

// deal with the actual setting
async function setColourRGB(state: setColourIf) {
	state.colour.to("srgb"); // unsure if this is entirely needed but best to check

	let r = Math.round(state.colour.srgb.r * 255);
	let g = Math.round(state.colour.srgb.g * 255);
	let b = Math.round(state.colour.srgb.b * 255);

	await state.node.server.light.setRGBColour(r, g, b);

	state.node.debug(`Set colour to (r:${r}, g:${g}, b:${b})`);
}
