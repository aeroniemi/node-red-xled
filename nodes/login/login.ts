import { NodeInitializer, Node, NodeDef, NodeMessageInFlow } from "node-red";
import * as xled from "../../lib/xled";

const nodeInit: NodeInitializer = (RED): void => {
	function setNodeConstructor(this: Node, config: NodeDef): void {
		RED.nodes.createNode(this, config);
		this.server = RED.nodes.getNode(config.server);

		if (this.server) {
			this.on("input", async function (msg: any, send, done) {
				try {
					await this.server.light.login();
					this.debug(`Login successful`);
				} catch (err: any) {
					done(err);
				}
				done();
			});
		}
	}

	RED.nodes.registerType("login", setNodeConstructor);
};
export = nodeInit;
