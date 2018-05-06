(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A reader that provides methods to read a command argument by argument.
 */
class ArgumentReader {
    constructor(str) {
        this.arg = str.split(' ');
        this.pos = 0;
        this.length = this.arg.length;
    }
    peek() {
        if (this.pos - 1 >= this.length) {
            return '';
        }
        return this.arg[this.pos];
    }
    next() {
        if (!this.hasMore()) {
            return '';
        }
        return this.arg[this.pos++];
    }
    back() {
        this.pos = Math.max(0, --this.pos);
    }
    hasMore() {
        return this.pos < this.length;
    }
}
exports.default = ArgumentReader;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A reader that provides methods to read a string char by char.
 */
class CharReader {
    constructor(str) {
        this.str = str;
        this.pos = 0;
        this.length = str.length;
    }
    peek() {
        if (this.pos - 1 >= this.length) {
            return '';
        }
        return this.str.charAt(this.pos);
    }
    next() {
        if (!this.hasMore()) {
            return '';
        }
        return this.str.charAt(this.pos++);
    }
    back() {
        this.pos = Math.max(0, --this.pos);
    }
    hasMore() {
        return this.pos < this.length;
    }
}
exports.default = CharReader;
function isWhiteSpace(char) {
    return char === ' ' || char === '\t';
}
exports.isWhiteSpace = isWhiteSpace;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argument_reader_1 = require("./argument_reader");
const spuses_1 = require("./spuses");
const selector_1 = require("./selector");
const sweet_pragmatics_updater_script_1 = require("./sweet_pragmatics_updater_script");
/**
 * Provides methods to convert commands in a mcf file from minecraft 1.12 to 1.13.
 * @author SPGoding
 */
class Converter {
    /**
     * Returns an result map from an old command and an old spus.
     * @param cmd An old minecraft command.
     * @param spus An old spus defined in spuses.ts.
     * @returns NULLABLE. A map filled with converted value. Like {%n: converted value}.
     */
    static getResultMap(cmd, spus) {
        let spusReader = new argument_reader_1.default(spus);
        let spusArg = spusReader.next();
        let cmdReader = new argument_reader_1.default(cmd);
        let cmdArg = cmdReader.next();
        let map = new Map();
        let cnt = 0;
        while (spusArg !== '') {
            while (!Converter.isArgumentMatch(cmdArg, spusArg)) {
                if (cmdReader.hasMore()) {
                    cmdArg += ' ' + cmdReader.next();
                }
                else {
                    // Can't match this spus.
                    return null;
                }
            }
            if (spusArg.charAt(0) === '%') {
                map.set(`%${cnt}`, Converter.cvtArgument(cmdArg, spusArg));
                cnt++;
            }
            spusArg = spusReader.next();
            cmdArg = cmdReader.next();
        }
        if (cmdArg === '') {
            // Match successfully.
            return map;
        }
        else {
            return null;
        }
    }
    static isArgumentMatch(cmdArg, spusArg) {
        if (spusArg.charAt(0) === '%') {
            switch (spusArg.slice(1)) {
                case 'entity':
                    return Converter.isEntity(cmdArg);
                case 'string':
                    return Converter.isString(cmdArg);
                case 'number':
                    return Converter.isNumber(cmdArg);
                case 'selector':
                    return Converter.isTargetSelector(cmdArg);
                case 'uuid':
                    return Converter.isUuid(cmdArg);
                default:
                    throw `Unknown argument type: ${spusArg.slice(1)}`;
                // TODO
            }
        }
        else {
            return cmdArg === spusArg;
        }
    }
    static cvtArgument(cmd, spus) {
        switch (spus.slice(1)) {
            case 'entity':
                return Converter.cvtEntity(cmd);
            default:
                return cmd;
        }
    }
    static isEntity(input) {
        return Converter.isTargetSelector(input) || Converter.isString(input) || Converter.isUuid(input);
    }
    static isString(input) {
        return /^\w*$/.test(input);
    }
    static isUuid(input) {
        return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/.test(input);
    }
    static isNumber(input) {
        return /^[+-]?[0-9]+\.?[0-9]*$/.test(input);
    }
    static isTargetSelector(input) {
        return selector_1.default.isValid(input);
    }
    static cvtLine(input) {
        if (input.charAt(0) === '#') {
            return input;
        }
        else {
            for (const spusOld of spuses_1.default.pairs.keys()) {
                let map = Converter.getResultMap(input, spusOld);
                if (map) {
                    let spusNew = spuses_1.default.pairs.get(spusOld);
                    let spus = new sweet_pragmatics_updater_script_1.default(spusNew);
                    let result = spus.compileWith(map);
                    return `execute positioned 0.0 0.0 0.0 run ${result}`;
                }
            }
            throw `Unknown line: ${input}`;
        }
    }
    static cvtGamemode(input) {
        switch (input) {
            case '0':
            case 's':
            case 'survival':
                return 'survival';
            case '1':
            case 'c':
            case 'creative':
                return 'creative';
            case '2':
            case 'a':
            case 'adventure':
                return 'adventure';
            case '3':
            case 'sp':
            case 'spectator':
                return 'spectator';
            default:
                throw `Unknown gamemode: ${input}`;
        }
    }
    static cvtTargetSelector(input) {
        let sel = new selector_1.default();
        sel.parse112(input);
        return sel.get113();
    }
    static cvtEntity(input) {
        if (Converter.isTargetSelector(input)) {
            return Converter.cvtTargetSelector(input);
        }
        else {
            return input;
        }
    }
}
exports.default = Converter;

},{"./argument_reader":1,"./selector":5,"./spuses":6,"./sweet_pragmatics_updater_script":7}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("./converter");
$(document).ready(function () {
    $('#button').click(function () {
        let result = '';
        let lines = $('#input').val().toString().split('\n');
        for (let line of lines) {
            line = converter_1.default.cvtLine(line);
            result += line + '<br>';
        }
        $('#output').html(result);
    });
});

},{"./converter":3}],5:[function(require,module,exports){
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

},{"./char_reader":2,"./converter":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Store a map providing old command spus and new command spus.
 */
class Spuses {
}
Spuses.pairs = new Map([
    [
        'advancement grant %entity only %string',
        'advancement grant %0 only %1'
    ], [
        'advancement grant %entity only %string %string',
        'advancement grant %0 only %1 %2'
    ], [
        'advancement revoke %entity only %string',
        'advancement revoke %0 only %1'
    ], [
        'advancement revoke %entity only %string %string',
        'advancement revoke %0 only %1 %2'
    ], [
        'advancement grant %entity until %string',
        'advancement grant %0 until %1'
    ], [
        'advancement grant %entity from %string',
        'advancement grant %0 from %1'
    ], [
        'advancement grant %entity through %string',
        'advancement grant %0 through %1'
    ], [
        'advancement revoke %entity until %string',
        'advancement revoke %0 until %1'
    ], [
        'advancement revoke %entity from %string',
        'advancement revoke %0 from %1'
    ], [
        'advancement revoke %entity through %string',
        'advancement revoke %0 through %1'
    ], [
        'advancement grant %entity everything',
        'advancement grant %0 everything'
    ], [
        'advancement revoke %entity everything',
        'advancement revoke %0 everything'
    ], [
        'advancement test %entity %string',
        'execute if entity %0$adv%1'
    ], [
        'advancement test %entity %string %string',
        'execute if entity %0$adv%1%2'
    ]
]);
exports.default = Spuses;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const char_reader_1 = require("./char_reader");
const argument_reader_1 = require("./argument_reader");
class SweetPragmaticsUpdaterScript {
    /**
     * Constructs this spus object from a format.
     * @param spus A new minecraft command format.
     */
    constructor(spus) {
        this.spus = spus;
    }
    /**
     * Compile this spus from an result map.
     * @param map An result map.
     */
    compileWith(map) {
        let argReader = new argument_reader_1.default(this.spus);
        let arg = argReader.next();
        let result = '';
        while (arg) {
            if (arg.slice(0, 1) === '%') {
                arg = this.compileArgument(arg);
            }
            result += arg + ' ';
            arg = argReader.next();
        }
        // Remove extra space.
        result = result.slice(0, -1);
        return result;
    }
    compileArgument(arg) {
        let result = '';
        let charReader = new char_reader_1.default(arg);
        let char = charReader.next();
        let id = '';
        if (char === '%') {
            char = charReader.next();
        }
        else {
            throw `Unexpected token: ${char} in ${arg}`;
        }
        while (char) {
            if (char !== '$') {
                id += char;
            }
            else {
                char = charReader.next();
                break;
            }
            char = charReader.next();
        }
        return result;
    }
}
exports.default = SweetPragmaticsUpdaterScript;

},{"./argument_reader":1,"./char_reader":2}]},{},[4]);
