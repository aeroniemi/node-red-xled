"use strict";
// -----------------------------------------------------------------------------
// xled-server config node
// The "host" twinkly light, required for all other nodes
// -----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
var xled_1 = require("../../lib/xled");
// create node
function default_1(RED) {
    function initNodeConstructor(config) {
        RED.nodes.createNode(this, config);
        if (!config.host)
            throw new Error("No Hostname/IP Address included in config");
        this.host = config.host;
        this.light = new xled_1.Light(config.host);
    }
    RED.nodes.registerType("xled-server", initNodeConstructor);
}
exports.default = default_1;
