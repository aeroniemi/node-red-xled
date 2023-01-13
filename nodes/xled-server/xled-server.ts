// -----------------------------------------------------------------------------
// xled-server config node
// The "host" twinkly light, required for all other nodes
// -----------------------------------------------------------------------------

// imports
import { NodeInitializer, Node, NodeDef, NodeMessageInFlow } from "node-red";
import { Light } from "../../lib/xled";

// interfaces
interface xledServerConfig extends NodeDef {
	host: string;
}
export interface xledServerNode extends Node {
	host: string;
	light: Light;
}

// create node
export default function (RED: any): void {
	function initNodeConstructor(
		this: xledServerNode,
		config: xledServerConfig
	): void {
		RED.nodes.createNode(this, config);
		if (!config.host)
			throw new Error("No Hostname/IP Address included in config");
		this.host = config.host;
		this.light = new Light(config.host);
	}
	RED.nodes.registerType("xled-server", initNodeConstructor);
}
