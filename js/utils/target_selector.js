"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nbt_1 = require("./nbt/nbt");
const utils_1 = require("./utils");
class TargetSelector {
    constructor(input) {
        this.tag = [];
        this.team = [];
        this.gamemode = [];
        this.name = [];
        this.type = [];
        this.advancements = new Map();
        this.scores = new Map();
        this.parseHead(input);
        this.parseArgument(input, 3);
    }
    toString() {
        let result = `@${this.variable}[`;
        ['tag', 'team', 'gamemode', 'name', 'type'].forEach((key) => {
            if (this[key].length > 0) {
                for (const i of this[key]) {
                    result += `${key}=${i},`;
                }
            }
        });
        ['distance', 'level', 'x_rotation', 'y_rotation', 'limit', 'x', 'y', 'z', 'dx', 'dy', 'dz', 'sort'].forEach((key) => {
            if (this[key] !== undefined) {
                result += `${key}=${this[key].toString()},`;
            }
        });
        if (this.nbt !== undefined) {
            result += `nbt=${this.nbt.toString()},`;
        }
        if (this.scores.size > 0) {
            result += `scores={`;
            for (const [objective, value] of this.scores) {
                result += `${objective}=${value.toString()},`;
            }
            result = result.slice(0, -1);
            result += `},`;
        }
        if (this.advancements.size > 0) {
            result += `advancements={`;
            for (const [advancement, value] of this.advancements) {
                if (typeof value === 'string') {
                    result += `${advancement}=${value},`;
                }
                else {
                    result += `${advancement}=${JSON.stringify(value).replace(/"/g, '').replace(/:/g, '=')},`;
                }
            }
            result = result.slice(0, -1);
            result += `},`;
        }
        result = result.slice(0, -1);
        if (result.length > 2) {
            result += ']';
        }
        return result;
    }
    parseHead(input) {
        if (input.charAt(0) !== '@') {
            throw `Expected '@' at [0] but got '${input.charAt(0)}'.`;
        }
        if (/^[aeprs]$/.test(input.charAt(1))) {
            this.variable = input.charAt(1);
        }
        else {
            throw `Expected '/^[aeprs]$/' at [1] but got '${input.charAt(1)}'.`;
        }
        if (!/^$|^\[$/.test(input.charAt(2))) {
            throw `Expected '/^$|^\[$/' at [2] but got '${input.charAt(2)}'.`;
        }
    }
    parseArgument(input, index) {
        if (/^$|^\]$/.test(input.charAt(index))) {
            return;
        }
        let key = '';
        while (input.charAt(index) !== '=') {
            key += input.charAt(index);
            index += 1;
        }
        index += 1;
        switch (key) {
            case 'scores':
                index = this.parseScores(input, index);
                break;
            case 'advancements':
                index = this.parseAdvancements(input, index);
                break;
            case 'nbt':
                index = this.parseNbt(input, index);
                break;
            default:
                let value = '';
                while (!/^[\]|,]$/.test(input.charAt(index))) {
                    value += input.charAt(index);
                    index += 1;
                }
                switch (key) {
                    case 'tag':
                    case 'team':
                    case 'gamemode':
                    case 'name':
                    case 'type':
                        this[key].push(value);
                        break;
                    case 'distance':
                    case 'level':
                    case 'x_rotation':
                    case 'y_rotation':
                        this[key] = new Range(value);
                        break;
                    case 'limit':
                    case 'x':
                    case 'y':
                    case 'z':
                    case 'dx':
                    case 'dy':
                    case 'dz':
                    case 'sort':
                        this[key] = value;
                        break;
                    default:
                        throw `Unknown argument key: '${key}'.`;
                }
                break;
        }
        this.parseArgument(input, index + 1);
    }
    parseScores(input, index) {
        if (input.charAt(index) !== '{') {
            throw `Expected '{' but got '${input.charAt(index)}'.`;
        }
        index += 1;
        if (input.charAt(index) === '}') {
            return index;
        }
        return this.parseScore(input, index);
    }
    parseScore(input, index) {
        if (input.charAt(index) === '') {
            return index;
        }
        let objective = '';
        while (input.charAt(index) !== '=') {
            objective += input.charAt(index);
            index += 1;
        }
        index += 1;
        let value = '';
        let end = false;
        while (!/^[}|,]$/.test(input.charAt(index))) {
            value += input.charAt(index);
            index += 1;
            if (input.charAt(index) === '}') {
                end = true;
            }
        }
        this.scores.set(objective, new Range(value));
        if (!end) {
            index = this.parseScore(input, index + 1);
        }
        return index;
    }
    parseAdvancements(input, index) {
        if (input.charAt(index) !== '{') {
            throw `Expected '{' but got '${input.charAt(index)}'.`;
        }
        index += 1;
        if (input.charAt(index) === '}') {
            return index;
        }
        return this.parseAdvancement(input, index);
    }
    parseAdvancement(input, index) {
        if (input.charAt(index) === '') {
            return index;
        }
        let advancement = '';
        while (input.charAt(index) !== '=') {
            if (input.charAt(index) === '') {
                throw `Expected '=' but got EOF.`;
            }
            advancement += input.charAt(index);
            index += 1;
        }
        index += 1;
        if (input.charAt(index) === '{') {
            const result = {};
            index = this.parseAdvancementCriterias(input, index, result);
            index += 1;
            this.advancements.set(advancement, result);
        }
        else {
            let value = '';
            while (!/^[}|,]$/.test(input.charAt(index))) {
                value += input.charAt(index);
                index += 1;
            }
            this.advancements.set(advancement, value);
        }
        if (input.charAt(index) !== '}') {
            index = this.parseAdvancement(input, index + 1);
        }
        return index;
    }
    parseAdvancementCriterias(input, index, result) {
        if (input.charAt(index) !== '{') {
            throw `Expected '{' but got '${input.charAt(index)}'.`;
        }
        index += 1;
        if (input.charAt(index) === '}') {
            return index;
        }
        return this.parseAdvancementCriteria(input, index, result);
    }
    parseAdvancementCriteria(input, index, result) {
        if (input.charAt(index) === '') {
            return index;
        }
        let criteria = '';
        while (input.charAt(index) !== '=') {
            criteria += input.charAt(index);
            index += 1;
        }
        index += 1;
        let value = '';
        let end = false;
        while (!/^[}|,]$/.test(input.charAt(index))) {
            value += input.charAt(index);
            index += 1;
            if (input.charAt(index) === '}') {
                end = true;
            }
        }
        result[criteria] = value;
        if (!end) {
            index = this.parseAdvancementCriteria(input, index + 1, result);
        }
        return index;
    }
    parseNbt(input, index) {
        let endIndex = index + 1;
        while (input.charAt(endIndex) !== '') {
            let nbt = new nbt_1.NbtCompound();
            try {
                nbt = utils_1.getNbtCompound(input.slice(index, endIndex));
            }
            catch (_a) {
                endIndex += 1;
                continue;
            }
            this.nbt = nbt;
            return endIndex;
        }
        throw `Can't parse as nbt argument: '${input}'[${index}].`;
    }
}
exports.TargetSelector = TargetSelector;
class Range {
    constructor(str) {
        let arr = str.split('..');
        if (arr.length === 2) {
            this.min = arr[0] ? Number(arr[0]) : null;
            this.max = arr[1] ? Number(arr[1]) : null;
        }
        else {
            this.min = this.max = Number(arr[0]);
        }
    }
    toString() {
        let min = this.min;
        let max = this.max;
        if (min !== null && max !== null) {
            if (min !== max) {
                return `${min}..${max}`;
            }
            else {
                return `${min}`;
            }
        }
        else if (min !== null) {
            return `${min}..`;
        }
        else if (max !== null) {
            return `..${max}`;
        }
        else {
            return '';
        }
    }
}
