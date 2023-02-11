# node-red-xled

A set of (typescript) nodes for node-red to allow you to control Twinkly lights. _I might update this with more features in the future, but will probably focus on making a general xled library for TS/JS_

## Features

- Set brightness
- Set colour using:
  - RGB
  - HSV (HSB)

## Installation

- From NPM: `npm install node-red-xled`
- From source:
  - Clone the repository
  - Compile the typescript to JS (run `tsc`)
  - In the node-red folder run `npm install [path-to-folder]`

## How to use it

- Setup a configuration node with the IP address of you're Twinkly install - you can work that out using your router, or other network search
- Choose your node from the sidebar
- All nodes (RGB/HSV/Brightness) work in the following way:
  - If the Override attribute is set, check the node for a valid colour/brightness
  - If an attribute is available in the `msg` object, that will be used
  - If no colour/brightness exists in the `msg` object, it'll revert to the defaults of the node (or error if no set param is available)

## Nodes

### set-brightness

- Accepts brightness (0-100) in `msg.brightness`

### set-colour-rgb

- Accepts one of
  - `msg.red` (0-1), `msg.blue` (0-1) AND `msg.green` (0-1) _or_
  - `msg.hex` (in the form `#ff00ff`, including `#`)

### set-colour-hsv

- Accepts:
  - `msg.hue` (0-359)
  - `msg.saturation` (0-100)
  - `msg.brightness` (0-100)
