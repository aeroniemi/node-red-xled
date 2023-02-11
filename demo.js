var Color = Color2.default;
let pos = msg.hours_since_midnight / 24;

let colours = [
	{ time: 2, colour: new Color("#302200") },
	{ time: 5, colour: new Color("#00B00E") },
	{ time: 7, colour: new Color("#00B00F") },
	{ time: 9, colour: new Color("#00E0FF") },
	{ time: 11, colour: new Color("#00FFA2") },
	{ time: 15, colour: new Color("#FF2575") },
	{ time: 18, colour: new Color("#BFFA00") },
	{ time: 20, colour: new Color("#FFCB00") },
	{ time: 22, colour: new Color("#FA7700") },
	{ time: 23.9, colour: new Color("#FA005C") },
];
let lower = [...colours].reverse().find(({ time }) => time < pos);
let upper = colours.find(({ time }) => time >= pos);
if (!lower) {
	lower = [...colours].reverse().find(({ time }) => time < pos + 24);
}
if (!upper) {
	upper = colours.find(({ time }) => time >= pos - 24);
}
console.log(`Lower: ${lower.colour}, Upper: ${upper.colour}`);
if (!lower || !upper) {
	throw new Error("Colours not defined properly");
}
let timeDiff = upper.time - lower.time;
if (timeDiff < 0) timeDiff += 24;
let through = pos - lower.time;
if (through < 0) through += 24;
let throughPerc = through / timeDiff;
console.log(`${throughPerc}%; ${through} of ${timeDiff}`);

let range = lower.colour.range(upper.colour, {
	space: "hsv",
	outputSpace: "hsv",
});
let output = range(throughPerc);

msg.hue = output.hsv.hue;
msg.saturation = output.hsv.saturation;
msg.brightness = output.hsv.value;
msg.payload.hsv = output.toString();
return msg;
