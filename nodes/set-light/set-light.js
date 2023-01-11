"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var xled = __importStar(require("../../lib/xled"));
function isRGBColour(colour) {
    return colour != undefined && colour.red != undefined;
}
var hexToRGB = function (hex) {
    hex = hex.startsWith("#") ? hex.slice(1) : hex;
    if (hex.length === 3) {
        hex = Array.from(hex).reduce(function (str, x) { return str + x + x; }, ""); // 123 -> 112233
    }
    var values = hex
        .split(/([a-z0-9]{2,2})/)
        .filter(Boolean)
        .map(function (x) { return parseInt(x, 16); });
    return [values[0], values[1], values[2]];
};
var nodeInit = function (RED) {
    function setNodeConstructor(config) {
        RED.nodes.createNode(this, config);
        if (!config.ipaddr)
            throw new Error("No IP Address included in config");
        var light = new xled.Light(config.ipaddr);
        this.on("input", function (msg, send, done) {
            return __awaiter(this, void 0, void 0, function () {
                var r, g, b, err_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 6, , 7]);
                            return [4 /*yield*/, light.login()];
                        case 1:
                            _b.sent();
                            if (!(msg.brightness != undefined)) return [3 /*break*/, 3];
                            if (msg.brightness > 100 || msg.brightness < 0) {
                                throw new RangeError("Brightness must be between 0 and 100 inclusive");
                            }
                            return [4 /*yield*/, light.setBrightness(msg.brightness)];
                        case 2:
                            _b.sent();
                            this.debug("Set brightness to ".concat(msg.brightness));
                            _b.label = 3;
                        case 3:
                            if (!(msg.colour != undefined)) return [3 /*break*/, 5];
                            this.debug("Trying to set colour");
                            r = void 0, g = void 0, b = void 0;
                            if (isRGBColour(msg.colour)) {
                                r = msg.colour.red;
                                g = msg.colour.green;
                                b = msg.colour.blue;
                            }
                            else {
                                _a = hexToRGB(msg.colour), r = _a[0], g = _a[1], b = _a[2];
                                // assume it's a hex code
                            }
                            if (!(!b == null)) return [3 /*break*/, 5];
                            return [4 /*yield*/, light.setRGBColour(r, g, b)];
                        case 4:
                            _b.sent();
                            this.debug("Set colour to (".concat(r, ", ").concat(g, ", ").concat(b, ")"));
                            _b.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            err_1 = _b.sent();
                            done(err_1);
                            return [3 /*break*/, 7];
                        case 7:
                            done();
                            return [2 /*return*/];
                    }
                });
            });
        });
    }
    RED.nodes.registerType("set-light", setNodeConstructor);
};
module.exports = nodeInit;
