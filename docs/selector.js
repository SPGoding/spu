"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const char_reader_1 = require("./char_reader");
const converter_1 = require("./converter");
const char_reader_2 = require("./char_reader");
/**
 * Represent a target selector.
 * Provides methods to operate it.
 * @author SPGoding
 */
class TargetSelector {
    constructor() { }
    /**
     * Parse this selector according to a string in 1.12.
     * @param str An string representing a target selector..
     */
    parse112(str) {
        let charReader = new char_reader_1.default(str);
        let char;
        this.properties = new Map();
        this.scores = new Map();
        this.advancements = new Map();
        this.ranges = new Map();
        char = charReader.next();
        if (char !== '@') {
            throw `First char should be '@': ${str}`;
        }
        char = charReader.next();
        switch (char) {
            case 'a':
                this.type = SelectorType.A;
                this.properties.set('sort', 'nearest');
                break;
            case 'e':
                this.type = SelectorType.E;
                this.properties.set('sort', 'nearest');
                break;
            case 'p':
                this.type = SelectorType.P;
                break;
            case 'r':
                this.type = SelectorType.R;
                break;
            case 's':
                this.type = SelectorType.S;
                break;
            default:
                throw `Unknown type: ${char} in ${str}`;
        }
        char = charReader.next();
        if (char === '') {
            return;
        }
        else if (char === '[') {
            let key;
            let val;
            while (char !== ']') {
                key = '';
                val = '';
                char = charReader.next();
                while (char !== '=') {
                    // Read key.
                    if (char_reader_2.isWhiteSpace(char)) {
                        continue;
                    }
                    key += char;
                    char = charReader.next();
                }
                char = charReader.next();
                while (char !== ',' && char !== ']') {
                    // Read value.
                    if (char_reader_2.isWhiteSpace(char)) {
                        continue;
                    }
                    val += char;
                    char = charReader.next();
                }
                if (key.length > 6 && key.slice(0, 6) === 'score_') {
                    // Deal with scores.
                    let objective;
                    if (key.slice(-4) === '_min') {
                        // The min.
                        objective = key.slice(6, -4);
                        this.setScoreMin(objective, val);
                    }
                    else {
                        // The max.
                        objective = key.slice(6);
                        this.setScoreMax(objective, val);
                    }
                }
                else {
                    // Deal with normal properties.
                    switch (key) {
                        // These are properties that don't need to change.
                        case 'dx':
                        case 'dy':
                        case 'dz':
                        case 'tag':
                        case 'team':
                        case 'name':
                        case 'type':
                            this.properties.set(key, val);
                            break;
                        // These are properties that need to rename.
                        case 'c':
                            if (Number(val) >= 0) {
                                this.properties.set('limit', val);
                            }
                            else {
                                this.properties.set('sort', 'furthest');
                                this.properties.set('limit', (-Number(val)).toString());
                            }
                            break;
                        case 'm':
                            this.properties.set('gamemode', converter_1.default.cvtGamemode(val));
                            break;
                        // These are properties that need to change to range and rename.
                        case 'l':
                            this.setRangeMax('level', val);
                            break;
                        case 'lm':
                            this.setRangeMin('level', val);
                            break;
                        case 'r':
                            this.setRangeMax('distance', val);
                            break;
                        case 'rm':
                            this.setRangeMin('distance', val);
                            break;
                        case 'rx':
                            this.setRangeMax('x_rotation', val);
                            break;
                        case 'rxm':
                            this.setRangeMin('x_rotation', val);
                            break;
                        case 'ry':
                            this.setRangeMax('y_rotation', val);
                            break;
                        case 'rym':
                            this.setRangeMin('y_rotation', val);
                            break;
                        // These are properties that need to center correct.
                        case 'x':
                        case 'y':
                        case 'z':
                            if (val.indexOf('.') === -1) {
                                val += '.5';
                            }
                            this.properties.set(key, val);
                            break;
                    }
                }
            }
        }
        else {
            throw `Unexpected token: ${str}`;
        }
    }
    /**
     * Get a string that can represent this target selector in 1.13.
     */
    get113() {
        let result = '@';
        switch (this.type) {
            case SelectorType.A:
                result += 'a';
                break;
            case SelectorType.E:
                result += 'e';
                break;
            case SelectorType.P:
                result += 'p';
                break;
            case SelectorType.R:
                result += 'r';
                break;
            case SelectorType.S:
                result += 's';
                break;
        }
        result += '[';
        if (this.properties.size !== 0) {
            // Deal with normal properties.
            for (const key of this.properties.keys()) {
                let val = this.properties.get(key);
                result += `${key}=${val},`;
            }
        }
        if (this.ranges.size !== 0) {
            // Deal with ranges.
            for (const key of this.ranges.keys()) {
                let range = this.ranges.get(key);
                result += `${key}=${range.toString()},`;
            }
        }
        if (this.scores.size !== 0) {
            result += 'scores={';
            // Deal with scores
            for (const objective of this.scores.keys()) {
                let range = this.scores.get(objective);
                result += `${objective}=${range.toString()},`;
            }
            result = result.slice(0, -1) + '},';
        }
        if (this.advancements.size !== 0) {
            // Deal with advancements.
            // TODO
        }
        // Deal with NBT.
        // TODO
        // Close the square brackets.
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + ']';
        }
        else if (result.slice(-1) === '[') {
            result = result.slice(0, -1);
        }
        return result;
    }
    /**
     * Returns if a target selector is valid.
     * @param input a target selector.
     */
    static isValid(input) {
        try {
            let sel = new TargetSelector();
            sel.parse112(input);
        }
        catch (ignored) {
            return false;
        }
        return true;
    }
    setRangeMin(key, min) {
        if (this.ranges.has(key)) {
            // The 'ranges' map has this objective, so complete it.
            this.ranges.get(key).setMin(Number(min));
        }
        else {
            // The 'ranges' map doesn't have this objective, so create it.
            this.ranges.set(key, new Range(Number(min), null));
        }
    }
    setRangeMax(key, max) {
        if (this.ranges.has(key)) {
            // The 'ranges' map has this objective, so complete it.
            this.ranges.get(key).setMax(Number(max));
        }
        else {
            // The 'ranges' map doesn't have this objective, so create it.
            this.ranges.set(key, new Range(null, Number(max)));
        }
    }
    setScoreMin(objective, min) {
        if (this.scores.has(objective)) {
            // The 'scores' map has this objective, so complete it.
            this.scores.get(objective).setMin(Number(min));
        }
        else {
            // The 'scores' map doesn't have this objective, so create it.
            this.scores.set(objective, new Range(Number(min), null));
        }
    }
    setScoreMax(objective, max) {
        if (this.scores.has(objective)) {
            // The 'scores' map has this objective, so complete it.
            this.scores.get(objective).setMax(Number(max));
        }
        else {
            // The 'scores' map doesn't have this objective, so create it.
            this.scores.set(objective, new Range(null, Number(max)));
        }
    }
}
exports.default = TargetSelector;
var SelectorType;
(function (SelectorType) {
    SelectorType[SelectorType["A"] = 0] = "A";
    SelectorType[SelectorType["E"] = 1] = "E";
    SelectorType[SelectorType["P"] = 2] = "P";
    SelectorType[SelectorType["R"] = 3] = "R";
    SelectorType[SelectorType["S"] = 4] = "S";
})(SelectorType || (SelectorType = {}));
/**
 * Represents a range in a target selector.
 */
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
    parse113(str) {
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
        if (min && max) {
            if (min !== max) {
                return `${min}..${max}`;
            }
            else {
                return `${min}`;
            }
        }
        else if (min) {
            return `${min}..`;
        }
        else if (max) {
            return `..${max}`;
        }
        else {
            throw `NullPointerException at Range: ${this}`;
        }
    }
}
//# sourceMappingURL=selector.js.map