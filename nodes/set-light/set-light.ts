import { NodeInitializer, Node, NodeDef, NodeMessageInFlow } from "node-red";
import * as xled from "../../lib/xled";

interface initOptions {
	ipaddr: string;
}
interface rgbColour {
	red: number;
	green: number;
	blue: number;
}
function isRGBColour(colour: any): colour is rgbColour {
	return colour != undefined && colour.red != undefined;
}
const hexToRGB = (hex: string) => {
	hex = hex.startsWith("#") ? hex.slice(1) : hex;
	if (hex.length === 3) {
		hex = Array.from(hex).reduce((str, x) => str + x + x, ""); // 123 -> 112233
	}
	const values = hex
		.split(/([a-z0-9]{2,2})/)
		.filter(Boolean)
		.map((x) => parseInt(x, 16));
	return [values[0], values[1], values[2]];
};
interface initNodeDef extends NodeDef, initOptions {}

const nodeInit: NodeInitializer = (RED): void => {
	function setNodeConstructor(this: Node, config: initNodeDef): void {
		RED.nodes.createNode(this, config);
		if (!config.ipaddr) throw new Error("No IP Address included in config");
		let light = new xled.Light(config.ipaddr);
		this.on("input", async function (msg: any, send, done) {
			try {
				await light.login();
				if (msg.brightness != undefined) {
					if (msg.brightness > 100 || msg.brightness < 0) {
						throw new RangeError(
							"Brightness must be between 0 and 100 inclusive"
						);
					}
					await light.setBrightness(msg.brightness);
					this.debug(`Set brightness to ${msg.brightness}`);
				}
				if (msg.colour != undefined) {
					this.debug("Trying to set colour");
					let r, g, b: number;
					if (isRGBColour(msg.colour)) {
						r = msg.colour.red;
						g = msg.colour.green;
						b = msg.colour.blue;
					} else {
						[r, g, b] = hexToRGB(msg.colour);
						// assume it's a hex code
					}
					if (!b == null) {
						await light.setRGBColour(r, g, b);
						this.debug(`Set colour to (${r}, ${g}, ${b})`);
					}
				}
			} catch (err: any) {
				done(err);
			}
			done();
		});
	}

	RED.nodes.registerType("set-light", setNodeConstructor);
};
export = nodeInit;
