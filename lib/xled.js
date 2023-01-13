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
exports.Light = void 0;
var node_crypto_1 = require("node:crypto");
var axios_1 = __importDefault(require("axios"));
// import delay from "delay";
var errNoToken = Error("No valid token");
var Light = /** @class */ (function () {
    function Light(ipaddr) {
        this.ipaddr = ipaddr;
        this.challenge = (0, node_crypto_1.randomBytes)(256).toString("hex");
        this.net = axios_1.default.create({
            baseURL: "http://".concat(this.ipaddr, "/xled/v1/"),
            timeout: 1000,
        });
    }
    Light.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.net.post("/login", {
                                challenge: this.challenge,
                            })];
                    case 1:
                        res = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        throw err_1;
                    case 3:
                        this.token = new AuthenticationToken(res);
                        this.net.defaults.headers["X-Auth-Token"] = this.token.getToken();
                        if (res.data.code != 1000) {
                            throw Error("Login request failed");
                        }
                        console.log("Login request successful");
                        try {
                            this.verify();
                        }
                        catch (err) {
                            throw err;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Light.prototype.verify = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.token === undefined)
                            throw Error("No token defined");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.net.post("/verify", {
                                "challenge-response": this.token.getChallengeResponse(),
                            })];
                    case 2:
                        res = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        throw err_2;
                    case 4:
                        if (res.data.code != 1000) {
                            throw errNoToken;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Light.prototype.ensureLoggedIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.verify();
                }
                catch (err) {
                    if (err != errNoToken) {
                        throw err;
                    }
                    this.login();
                }
                return [2 /*return*/];
            });
        });
    };
    Light.prototype.setOff = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.setMode("off")];
            });
        });
    };
    Light.prototype.setState = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.setMode(state ? "on" : "off")];
            });
        });
    };
    Light.prototype.setBrightness = function (value, mode, type) {
        if (mode === void 0) { mode = "enabled"; }
        if (type === void 0) { type = "A"; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/led/out/brightness", {
                            mode: mode,
                            type: type,
                            value: value,
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Light.prototype.setRGBColour = function (red, green, blue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/led/color", {
                            red: red,
                            green: green,
                            blue: blue,
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Light.prototype.setMode = function (mode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendPostRequest("/led/mode", { mode: mode })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Light.prototype.sendPostRequest = function (url, params) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.token)
                            throw errNoToken;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.net.post(url, params)];
                    case 2:
                        res = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        throw err_3;
                    case 4:
                        if (res.data.code != 1000) {
                            throw Error("Mode set failed");
                        }
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    return Light;
}());
exports.Light = Light;
var AuthenticationToken = /** @class */ (function () {
    function AuthenticationToken(res) {
        this.token = res.data.authentication_token;
        this.expiry = new Date(Date.now() + res.data.authentication_token_expires_in * 1000);
        this.challengeResponse = res.data.challenge_response;
    }
    AuthenticationToken.prototype.getToken = function () {
        return this.token;
    };
    AuthenticationToken.prototype.getChallengeResponse = function () {
        return this.challengeResponse;
    };
    return AuthenticationToken;
}());
// async function main() {
// 	let sabrina = new Light("192.168.0.26");
// 	await sabrina.login();
// 	// await sabrina.setOff();
// 	// await delay(5000);
// 	// await sabrina.setMode("color");
// 	await sabrina.setBrightness(100);
// 	while (true) {
// 		// await delay(2000);
// 		await sabrina.setRGBColour(
// 			Math.floor(Math.random() * 255),
// 			Math.floor(Math.random() * 255),
// 			Math.floor(Math.random() * 255)
// 		);
// 	}
// 	// await delay(2000);
// 	// await sabrina.setBrightness(5);
// 	// console.log(sabrina);
// }
// main();
