"use strict";
// -----------------------------------------------------------------------------
// set-brightness node
// Allows you to set the brightness of a Twinkly light
// -----------------------------------------------------------------------------
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
// imports
var colorjs_io_1 = __importDefault(require("colorjs.io"));
// create node
function default_1(RED) {
    function setColourNode(config) {
        RED.nodes.createNode(this, config);
        // check server exists
        try {
            this.server = RED.nodes.getNode(config.server);
        }
        catch (err) {
            this.error("XLED Server not found");
            return;
        }
        // set config
        this.red = config.red;
        this.green = config.green;
        this.blue = config.blue;
        this.hue = config.hue;
        this.saturation = config.saturation;
        this.brightness = config.brightness;
        this.hex = config.hex;
        this.override = config.override;
        this.fade = config.fade;
        var node = this; // makes typescript happy when using it inside node.on()
        node.on("input", function (msg, send, done) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setColour(node, msg, done)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
    }
    RED.nodes.registerType("set-colour", setColourNode);
}
exports.default = default_1;
function setColour(node, msg, done) {
    return __awaiter(this, void 0, void 0, function () {
        var fade, colour, currentBrightness, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    fade = (node.override && node.fade) || msg.fade || node.fade;
                    colour = (node.override && assignColour(node, node)) ||
                        assignColour(msg, node) ||
                        assignColour(node, node);
                    if (colour === undefined)
                        throw new Error("No colour specified");
                    colour.to("hsv");
                    return [4 /*yield*/, node.server.light.ensureLoggedIn()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, node.server.light.getBrightness()];
                case 2:
                    currentBrightness = _a.sent();
                    return [4 /*yield*/, node.server.light.setHSVColour(colour.hsv.h, colour.hsv.s, currentBrightness)];
                case 3:
                    _a.sent();
                    node.debug("Set colour to (h:".concat(colour.hsv.h, ", s:").concat(colour.hsv.s, ", v:").concat(colour.hsv.v));
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
}
function assignColour(source, node) {
    if (typeof source.red == "number") {
        return new colorjs_io_1.default("srgb", [source.red / 255, source.green / 255, source.blue / 255], 0);
    }
    else if (typeof source.hue == "number") {
        return new colorjs_io_1.default("hsv", [source.hue, source.saturation, source.brightness], 1);
    }
    else if (source.hex.length > 0) {
        return new colorjs_io_1.default(source.hex);
    }
    return undefined;
}
