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
Object.defineProperty(exports, "__esModule", { value: true });
// create node
function default_1(RED) {
    function setBrightnessNode(config) {
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
        this.brightness = config.brightness;
        this.override = config.override;
        var node = this; // makes typescript happy when using it inside node.on()
        node.on("input", function (msg, send, done) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    setBrightness(node, msg, done);
                    return [2 /*return*/];
                });
            });
        });
    }
    RED.nodes.registerType("set-brightness", setBrightnessNode);
}
exports.default = default_1;
function setBrightness(node, msg, done) {
    return __awaiter(this, void 0, void 0, function () {
        var brightness, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    brightness = node.override
                        ? node.brightness
                        : msg.brightness || node.brightness;
                    if (brightness > 100 || brightness < 0)
                        throw new RangeError("Brightness must be between 0 and 100 inclusive");
                    return [4 /*yield*/, node.server.light.ensureLoggedIn()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, node.server.light.setBrightness(brightness)];
                case 2:
                    _a.sent();
                    node.debug("Set brightness to ".concat(brightness));
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    done(err_1);
                    return [3 /*break*/, 4];
                case 4:
                    done();
                    return [2 /*return*/];
            }
        });
    });
}
