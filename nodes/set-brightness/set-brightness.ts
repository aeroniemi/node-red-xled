import { NodeInitializer, Node, NodeDef, NodeMessageInFlow } from "node-red";

const nodeInit: NodeInitializer = (RED): void => {
	function setBrightnessNode(node: any, config: any): void {
		RED.nodes.createNode(node, config);
		// this.override = config.override;
		// this.overrideType = config.overrideType;
		node.server = RED.nodes.getNode(config.server);
		// this.brightness = config.brightness;
		node.log(node.server);
		if (node.server) {
			node.on("input", async function (msg: any, send: any, done) {
				node.log(config.override);
				try {
					let brightness: number = config.brightness || 100;
					let override: boolean = config.override || false;
					node.log(config.override);
					if (msg.brightness != undefined && override === false) {
						brightness = msg.brightness;
					}
					if (brightness > 100 || brightness < 0) {
						throw new RangeError(
							"Brightness must be between 0 and 100 inclusive"
						);
					}
					await node.server.light.setBrightness(msg.brightness);
					node.debug(`Set brightness to ${msg.brightness}`);
				} catch (err: any) {
					done(err);
				}
				done();
			});
		}
	}

	RED.nodes.registerType("set-brightness", setBrightnessNode);
};
export = nodeInit;
