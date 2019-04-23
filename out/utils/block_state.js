"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class BlockState {
    constructor(input) {
        this.states = {};
        let index = 0;
        index = this.parseName(input, index) + 1;
        index = this.parseStates(input, index) + 1;
        this.parseNbt(input, index);
    }
    toString() {
        let result = this.name;
        let states = JSON.stringify(this.states).replace(/"/g, '').replace(/:/g, '=').replace(/\{/g, '[').replace(/\}/g, ']');
        if (states !== '[]') {
            result += states;
        }
        if (this.nbt !== undefined) {
            result += this.nbt.toString();
        }
        return result;
    }
    parseName(input, index) {
        let name = '';
        while (input.charAt(index) !== '' && input.charAt(index) !== '[' && input.charAt(index) !== '{') {
            name += input.charAt(index);
            index += 1;
        }
        name = utils_1.completeNamespace(name);
        this.name = name;
        return index - 1;
    }
    parseStates(input, index) {
        if (input.charAt(index) === '[') {
            index += 1;
            index = this.skipSpaces(input, index);
            if (input.charAt(index) !== ']') {
                index = this.parseAState(input, index);
            }
        }
        else {
            index -= 1;
        }
        return index;
    }
    parseAState(input, index) {
        let stateKey = '';
        while (input.charAt(index) !== '=') {
            if (input.charAt(index) === '') {
                throw `Expected '=' but got EOF.`;
            }
            else if (input.charAt(index) === ' ') {
                index = this.skipSpaces(input, index);
                if (input.charAt(index) !== '=') {
                    throw `Expected '=' but got '${input.charAt(index)}' after several spaces.`;
                }
            }
            else if (/\w+/.test(input.charAt(index))) {
                stateKey += input.charAt(index);
                index += 1;
            }
            else {
                throw `Expected /\\w+/ but got '${input[index]}'.`;
            }
        }
        index += 1;
        let value = '';
        index = this.skipSpaces(input, index);
        while (input.charAt(index) !== ']' && input.charAt(index) !== ',') {
            if (input.charAt(index) === '') {
                throw `Expected ']' or ',' but got EOF.`;
            }
            else if (input.charAt(index) === ' ') {
                index = this.skipSpaces(input, index);
                if (input.charAt(index) !== ']' && input.charAt(index) !== ',') {
                    throw `Expected ']' or ',' but got '${input.charAt(index)}' after several spaces.`;
                }
            }
            else if (/\w+/.test(input.charAt(index))) {
                value += input.charAt(index);
                index += 1;
            }
            else {
                throw `Expected /\\w+/ but got '${input[index]}'.`;
            }
        }
        if (input.charAt(index) === ',') {
            if (input[index + 1] !== ']') {
                index = this.parseAState(input, index + 1);
            }
            else {
                index += 1;
            }
        }
        this.states[stateKey] = value;
        return index;
    }
    skipSpaces(input, index) {
        while (input.charAt(index) === ' ') {
            index += 1;
        }
        return index;
    }
    parseNbt(input, index) {
        if (input.charAt(index) === '{') {
            this.nbt = utils_1.getNbtCompound(input.slice(index));
        }
        else if (input.charAt(index) !== '') {
            throw `Expected EOF but got '${input[index]}'.`;
        }
        return index;
    }
}
exports.BlockState = BlockState;
//# sourceMappingURL=block_state.js.map