// -----------------------------------------------------------------------------
// set-brightness node
// Allows you to set the brightness of a Twinkly light
// -----------------------------------------------------------------------------

// imports
import { hsvColour } from "xled2";
import {
	setColourNode,
	setColourIf,
	colourNodeDef,
} from "../../lib/general-nodes.js";

// create node
export default function (RED: any): void {
	RED.nodes.registerType("set-colour-hsv", hsv);
	function hsv(this: Node, config: colourNodeDef) {
		return setColourNode(this, config, RED, setColourHSV);
	}
}

// deal with the actual setting
async function setColourHSV(state: setColourIf) {
	let hsv: hsvColour = {
		hue: Math.round(state.colour.hsv.h || 0),
		saturation: Math.round(state.colour.hsv.s * 255),
		value: Math.round(state.colour.hsv.v * 255),
	};

	await state.node.server.light.setHSVColour(hsv);

	state.node.debug(`Set colour to ${JSON.stringify(hsv)}`);
}
