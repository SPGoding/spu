"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const char_reader_1 = require("../utils/char_reader");
const updater_1 = require("../to113/updater");
const nbt_1 = require("../utils/nbt/nbt");
const entities_1 = require("../to113/mappings/entities");
class TargetSelector {
    constructor() {
        this.tag = [];
        this.team = [];
        this.name = [];
        this.type = [];
        this.gamemode = [];
        this.level = new Range(null, null);
        this.distance = new Range(null, null);
        this.x_rotation = new Range(null, null);
        this.y_rotation = new Range(null, null);
        this.scores = new Map();
        this.advancements = new Map();
        this.nbt = new nbt_1.NbtCompound();
    }
    parse(str) {
        let charReader = new char_reader_1.CharReader(str);
        let char;
        char = charReader.next();
        if (char !== '@') {
            throw `First char should be '@': ${str}`;
        }
        char = charReader.next();
        this.parseVariable(char, str);
        char = charReader.next();
        this.parseProperties(char, charReader, str);
    }
    to113() {
        let result = `@${this.variable}`;
        result += '[';
        result = this.getProperties(result);
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + ']';
        }
        else if (result.slice(-1) === '[') {
            result = result.slice(0, -1);
        }
        return result;
    }
    static isValid(input) {
        try {
            if (['a', 'e', 'p', 'r', 's', ']'].indexOf(input.slice(-1)) === -1) {
                return false;
            }
            let sel = new TargetSelector();
            sel.parse(input);
        }
        catch (ignored) {
            return false;
        }
        return true;
    }
    parseVariable(char, str) {
        switch (char) {
            case 'a':
            case 'e':
            case 'p':
            case 'r':
            case 's':
                this.variable = char;
                break;
            default:
                throw `Unknown variable: ${char} in ${str}`;
        }
    }
    parseProperties(char, charReader, str) {
        if (!char) {
            return;
        }
        if (char === '[') {
            let key;
            let val;
            while (char) {
                char = charReader.next();
                key = charReader.readUntil(['=']);
                char = charReader.next();
                val = charReader.readUntil([',', ']']);
                if (key.length > 6 && key.slice(0, 6) === 'score_') {
                    this.parseScore(key, val);
                }
                else {
                    switch (key) {
                        case 'dx':
                            this.dx = Number(val);
                            break;
                        case 'dy':
                            this.dy = Number(val);
                            break;
                        case 'dz':
                            this.dz = Number(val);
                            break;
                        case 'tag':
                            this.tag.push(val);
                            break;
                        case 'team':
                            this.team.push(val);
                            break;
                        case 'name':
                            this.name.push(val);
                            break;
                        case 'type':
                            if (this.variable === 'r') {
                                this.variable = 'e';
                                this.sort = 'random';
                                if (this.limit === undefined) {
                                    this.limit = 1;
                                }
                            }
                            this.type.push(entities_1.default.to113(val));
                            break;
                        case 'c':
                            if (Number(val) >= 0) {
                                if (this.sort !== 'random' && this.variable !== 'r') {
                                    this.sort = 'nearest';
                                }
                                this.limit = Number(val);
                            }
                            else {
                                if (this.sort !== 'random' && this.variable !== 'r') {
                                    this.sort = 'furthest';
                                }
                                this.limit = -Number(val);
                            }
                            break;
                        case 'm':
                            if (val.slice(0, 1) !== '!') {
                                this.gamemode.push(new updater_1.UpdaterTo113().upSpgodingGamemode(val));
                            }
                            else {
                                this.gamemode.push('!' + new updater_1.UpdaterTo113().upSpgodingGamemode(val.slice(1)));
                            }
                            break;
                        case 'l':
                            this.level.setMax(Number(val));
                            break;
                        case 'lm':
                            this.level.setMin(Number(val));
                            break;
                        case 'r':
                            this.distance.setMax(Number(val));
                            break;
                        case 'rm':
                            this.distance.setMin(Number(val));
                            break;
                        case 'rx':
                            this.x_rotation.setMax(Number(val));
                            break;
                        case 'rxm':
                            this.x_rotation.setMin(Number(val));
                            break;
                        case 'ry':
                            this.y_rotation.setMax(Number(val));
                            break;
                        case 'rym':
                            this.y_rotation.setMin(Number(val));
                            break;
                        case 'x':
                        case 'y':
                        case 'z':
                            if (val.indexOf('.') === -1) {
                                val += '.5';
                            }
                            switch (key) {
                                case 'x':
                                    this.x = Number(val);
                                    break;
                                case 'y':
                                    this.y = Number(val);
                                    break;
                                case 'z':
                                    this.z = Number(val);
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case '':
                            return;
                        default:
                            throw `Unknown selector key: ${key}`;
                    }
                }
            }
        }
        else {
            throw `Unexpected token: ${str}`;
        }
    }
    getProperties(result) {
        if (this.dx !== undefined) {
            result += `dx=${this.dx},`;
        }
        if (this.dy !== undefined) {
            result += `dy=${this.dy},`;
        }
        if (this.dz !== undefined) {
            result += `dz=${this.dz},`;
        }
        if (this.limit !== undefined) {
            result += `limit=${this.limit},`;
        }
        if (this.x !== undefined) {
            result += `x=${this.x},`;
        }
        if (this.y !== undefined) {
            result += `y=${this.y},`;
        }
        if (this.z !== undefined) {
            result += `z=${this.z},`;
        }
        if (this.sort !== undefined) {
            result += `sort=${this.sort},`;
        }
        for (const i of this.tag) {
            result += `tag=${i},`;
        }
        for (const i of this.team) {
            result += `team=${i},`;
        }
        for (const i of this.name) {
            result += `name=${i},`;
        }
        for (const i of this.type) {
            result += `type=${i},`;
        }
        for (const i of this.gamemode) {
            result += `gamemode=${i},`;
        }
        let tmp;
        if ((tmp = this.level.get1_13())) {
            result += `level=${tmp},`;
        }
        if ((tmp = this.distance.get1_13())) {
            result += `distance=${this.distance.get1_13()},`;
        }
        if ((tmp = this.x_rotation.get1_13())) {
            result += `x_rotation=${tmp},`;
        }
        if ((tmp = this.y_rotation.get1_13())) {
            result += `y_rotation=${tmp},`;
        }
        if ((tmp = this.getScores())) {
            result += `scores=${tmp},`;
        }
        if ((tmp = this.getAdvancements())) {
            result += `advancements=${tmp},`;
        }
        if ((tmp = this.nbt.toString()) !== '{}') {
            result += `nbt=${tmp},`;
        }
        return result;
    }
    setScore(objective, value, type) {
        let range = this.scores.get(objective);
        switch (type) {
            case 'max':
                if (range) {
                    range.setMax(Number(value));
                }
                else {
                    range = new Range(null, Number(value));
                    this.scores.set(objective, range);
                }
                break;
            case 'min':
            default:
                if (range) {
                    range.setMin(Number(value));
                }
                else {
                    range = new Range(Number(value), null);
                    this.scores.set(objective, range);
                }
                break;
        }
    }
    parseScore(key, val) {
        let objective;
        if (key.slice(-4) === '_min') {
            objective = key.slice(6, -4);
            this.setScore(objective, val, 'min');
        }
        else {
            objective = key.slice(6);
            this.setScore(objective, val, 'max');
        }
    }
    getScores() {
        let result = '{';
        for (const i of this.scores.keys()) {
            let score = this.scores.get(i);
            if (score) {
                result += `${i}=${score.get1_13()},`;
            }
        }
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + '}';
        }
        else if (result.slice(-1) === '{') {
            result = result.slice(0, -1);
        }
        return result;
    }
    getAdvancements() {
        let result = '{';
        for (const i of this.advancements.keys()) {
            const val = this.advancements.get(i);
            if (typeof val === 'boolean') {
                result += `${i}=${val},`;
            }
            else if (val && typeof val === 'object') {
                result += `${i}={`;
                for (const j of val.keys()) {
                    result += `${j}=${val.get(j)},`;
                }
                result = result.slice(0, -1) + '},';
            }
        }
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + '}';
        }
        else if (result.slice(-1) === '{') {
            result = result.slice(0, -1);
        }
        return result;
    }
}
exports.TargetSelector = TargetSelector;
class Range {
    getMin() {
        return this.min;
    }
    setMin(min) {
        this.min = min;
    }
    getMax() {
        return this.max;
    }
    setMax(max) {
        this.max = max;
    }
    constructor(min, max) {
        this.max = max;
        this.min = min;
    }
    parse1_13(str) {
        let arr = str.split('..');
        if (arr.length === 2) {
            this.min = arr[0] ? Number(arr[0]) : null;
            this.max = arr[1] ? Number(arr[1]) : null;
        }
        else {
            this.min = this.max = Number(arr[0]);
        }
    }
    get1_13() {
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
