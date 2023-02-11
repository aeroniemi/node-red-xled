// imports
import { randomBytes } from "node:crypto";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import delay from "delay";

// create error
let errNoToken = Error("No valid token");

// the important class
export class Light {
	ipaddr: string;
	challenge: string;
	net: AxiosInstance;
	token: AuthenticationToken | undefined;
	activeLoginCall: boolean;

	constructor(ipaddr: string) {
		this.ipaddr = ipaddr;
		this.challenge = randomBytes(256).toString("hex");
		this.net = axios.create({
			baseURL: `http://${this.ipaddr}/xled/v1/`,
			timeout: 1000,
		});
		this.activeLoginCall = false;
	}
	async autoEndLoginCall() {
		await delay(1000);
		this.activeLoginCall = false;
	}
	async login() {
		this.activeLoginCall = true;
		this.autoEndLoginCall();
		let res: AxiosResponse;
		try {
			res = await this.net.post("/login", {
				challenge: this.challenge,
			});
		} catch (err) {
			throw err;
		}
		this.token = new AuthenticationToken(res);
		this.net.defaults.headers["X-Auth-Token"] = this.token.getToken();
		if (res.data.code != 1000) {
			throw Error("Login request failed");
		}
		console.log("Login request successful");
		try {
			this.verify();
		} catch (err) {
			throw err;
		}
		this.activeLoginCall = false;
	}
	async verify() {
		let res: AxiosResponse;
		if (this.token === undefined) throw errNoToken;
		try {
			res = await this.net.post("/verify", {
				"challenge-response": this.token.getChallengeResponse(),
			});
		} catch (err) {
			throw err;
		}
		if (res.data.code != 1000) {
			throw errNoToken;
		}
	}
	async ensureLoggedIn() {
		try {
			await this.verify();
		} catch (err) {
			if (err != errNoToken) {
				throw err;
			}
			let i = 0;
			while (this.activeLoginCall && i < 5) {
				await delay(1200);
				i++;
			}
			await this.login();
		}
	}
	async setOff() {
		return this.setMode("off");
	}
	async setState(state: boolean) {
		return this.setMode(state ? "on" : "off");
	}
	async setBrightness(
		value: number,
		mode: string = "enabled",
		type: string = "A"
	) {
		return await this.sendPostRequest("/led/out/brightness", {
			mode: mode,
			type: type,
			value: value,
		});
	}
	async getBrightness() {
		let data = await this.sendGetRequest("/led/out/brightness", {});
		return data.value;
	}

	async getHSVColour() {
		let data = await this.sendGetRequest("/led/color", {});
		let res: [number, number, number] = [
			data.hue,
			data.saturation / 2.55,
			data.value / 2.55,
		];
		return res;
	}
	async getRGBColour() {
		let data = await this.sendGetRequest("/led/color", {});
		return [data.red / 2.55, data.green / 2.55, data.blue / 2.55];
	}
	async setRGBColour(red: number, green: number, blue: number) {
		return await this.sendPostRequest("/led/color", {
			red: red,
			green: green,
			blue: blue,
		});
	}
	async setHSVColour(hue: number, saturation: number, value: number) {
		return await this.sendPostRequest("/led/color", {
			hue: Math.floor(hue),
			saturation: Math.floor(saturation * 2.55),
			value: Math.floor(value * 2.55),
		});
	}
	async setMode(mode: string) {
		return await this.sendPostRequest("/led/mode", { mode: mode });
	}
	async sendPostRequest(url: string, params: object) {
		if (!this.token) throw errNoToken;
		let res: AxiosResponse;
		try {
			res = await this.net.post(url, params);
		} catch (err) {
			throw err;
		}
		if (res.data.code != 1000) {
			throw Error("Mode set failed");
		}
		return res.data;
	}
	async sendGetRequest(url: string, params: object) {
		if (!this.token) throw errNoToken;
		let res: AxiosResponse;
		try {
			res = await this.net.get(url, params);
		} catch (err) {
			throw err;
		}
		if (res.data.code != 1000) {
			throw Error("Get Request failed");
		}
		return res.data;
	}
}
class AuthenticationToken {
	token: string;
	expiry: Date;
	challengeResponse: string;

	constructor(res: AxiosResponse) {
		this.token = res.data.authentication_token;
		this.expiry = new Date(
			Date.now() + res.data.authentication_token_expires_in * 1000
		);
		this.challengeResponse = res.data.challenge_response;
	}
	getToken() {
		return this.token;
	}
	getChallengeResponse() {
		return this.challengeResponse;
	}
}