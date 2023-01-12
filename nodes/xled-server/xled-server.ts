import { NodeInitializer, Node, NodeDef, NodeMessageInFlow } from "node-red";
import * as xled from "../../lib/xled";

interface initOptions {
	host: string;
}

interface initNodeDef extends NodeDef, initOptions {}

const nodeInit: NodeInitializer = (RED): void => {
	function initNodeConstructor(this: any, config: initNodeDef): void {
		RED.nodes.createNode(this, config);
		if (!config.host)
			throw new Error("No Hostname/IP Address included in config");
		this.host = config.host;
		this.light = new xled.Light(config.host);
	}
	RED.nodes.registerType("xled-server", initNodeConstructor);
};
export = nodeInit;
