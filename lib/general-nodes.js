"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setColourNode = exports.selectColour = void 0;
var colorjs_io_1 = __importDefault(require("colorjs.io"));
// -----------------------------------------------------------------------------
// assignColour
// take a object and returns a colour it if contains valid attributes
// -----------------------------------------------------------------------------
function assignColour(source, node) {
    if ((source === null || source === void 0 ? void 0 : source.red) > 0) {
        return new colorjs_io_1.default("srgb", [source.red / 255, source.green / 255, source.blue / 255], 0);
    }
    else if ((source === null || source === void 0 ? void 0 : source.hue) > 0) {
        return new colorjs_io_1.default("hsv", [source.hue, source.saturation, source.brightness], 1);
    }
    else if (source === null || source === void 0 ? void 0 : source.hex) {
        return new colorjs_io_1.default(source.hex);
    }
    throw new Error("No Colour Defined (assignColour)");
}
// -----------------------------------------------------------------------------
// selectColour
// takes the config and msg and covers determining the colour to output
// using assignColour
// -----------------------------------------------------------------------------
function selectColour(node, config, msg) {
    if (config === null || config === void 0 ? void 0 : config.override) {
        try {
            return assignColour(config, node);
        }
        catch (_a) { }
    }
    try {
        return assignColour(msg, node);
    }
    catch (_b) { }
    try {
        return assignColour(config, node);
    }
    catch (_c) { }
    console.log(msg);
    throw new Error("No colour is available");
}
exports.selectColour = selectColour;
// -----------------------------------------------------------------------------
// setColourNode
// node generator function
// -----------------------------------------------------------------------------
function setColourNode(node, config, RED, returnFn) {
    // Create the node
    RED.nodes.createNode(node, config);
    // Check server exists
    try {
        node.server = RED.nodes.getNode(config.server);
    }
    catch (err) {
        node.error("XLED Server not found");
        return;
    }
    node.on("input", function (msg, send, done) {
        return __awaiter(this, void 0, void 0, function () {
            var colour, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        colour = selectColour(node, config, msg);
                        return [4 /*yield*/, node.server.light.ensureLoggedIn()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, returnFn({
                                node: node,
                                config: config,
                                msg: msg,
                                colour: colour,
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        done(err_1);
                        return [3 /*break*/, 5];
                    case 5:
                        done();
                        return [2 /*return*/];
                }
            });
        });
    });
}
exports.setColourNode = setColourNode;
