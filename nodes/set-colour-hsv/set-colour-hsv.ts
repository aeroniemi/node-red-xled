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
	RED.nodes.registerType("set-colour-hsv", hsv);
	function hsv(this: Node, config: colourNodeDef) {
		return setColourNode(this, config, RED, setColourHSV);
	}
}

// deal with the actual setting
async function setColourHSV(state: setColourIf) {
	let h = Math.round(state.colour.hsv.h || 0);
	let s = Math.round(state.colour.hsv.s * 255);
	let v = Math.round(state.colour.hsv.v * 255);

	await state.node.server.light.setHSVColour(h, s, v);

	state.node.debug(`Set colour to (h:${h}, s:${s}, v:${v})`);
}
