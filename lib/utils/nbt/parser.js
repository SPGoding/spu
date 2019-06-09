"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const nbt_1 = require("./nbt");
/**
 * Provides methods to parse a NBT tokens list.
 *
 * @author SPGoding
 */
class Parser {
    parseCompounds(tokens, version = 'after 1.12') {
        let result;
        if (tokens[0].type === 'BeginCompound') {
            result = this.parseCompound(tokens, 0, version);
        }
        else {
            throw `Unexpected start token: '${tokens[0].type}'`;
        }
        if (tokens[result.pos + 1].type === 'EndOfDocument') {
            return result.value;
        }
        else {
            throw 'Unsymmetrical squares.';
        }
    }
    parseLists(tokens, version = 'after 1.12') {
        let result;
        if (tokens[0].type === 'BeginList') {
            result = this.parseList(tokens, 0, version);
        }
        else {
            throw `Unexpected start token: '${tokens[0].type}'`;
        }
        if (tokens[result.pos + 1].type === 'EndOfDocument') {
            return result.value;
        }
        else {
            throw 'Unsymmetrical squares.';
        }
    }
    /**
     * @returns {pos: the index of the closed square, value: parsed Value object}
     */
    parseCompound(tokens, pos, version) {
        let expectedTypes;
        let state = 'key';
        let key = '';
        let val;
        const result = new nbt_1.NbtCompound();
        expectedTypes = ['BeginCompound'];
        for (; pos < tokens.length; pos++) {
            const token = tokens[pos];
            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginCompound':
                        if (state === 'key') {
                            expectedTypes = ['EndCompound', 'Thing', 'String'];
                        }
                        else if (state === 'val') {
                            expectedTypes = ['Comma', 'EndCompound'];
                            const parseResult = this.parseCompound(tokens, pos, version);
                            val = parseResult.value;
                            pos = parseResult.pos;
                            result.set(key, val);
                            state = 'key';
                        }
                        break;
                    case 'EndCompound':
                        return { value: result, pos: pos };
                    case 'Thing':
                    case 'String':
                        if (token.type === 'Thing') {
                            val = this.parseThing(token);
                        }
                        else {
                            val = new nbt_1.NbtString();
                            val.set(token.value.toString());
                        }
                        if (state === 'key') {
                            expectedTypes = ['Colon'];
                            key = token.value;
                            state = 'val';
                        }
                        else if (state === 'val') {
                            expectedTypes = ['Comma', 'EndCompound'];
                            if (val) {
                                result.set(key, val);
                            }
                            state = 'key';
                        }
                        break;
                    case 'BeginByteArray':
                    case 'BeginIntArray':
                    case 'BeginList':
                    case 'BeginLongArray':
                        expectedTypes = ['Comma', 'EndCompound'];
                        const parseResult = this.parseValue(tokens, pos, version);
                        val = parseResult.value;
                        pos = parseResult.pos;
                        result.set(key, val);
                        state = 'key';
                        break;
                    case 'Colon':
                        expectedTypes = [
                            'Thing',
                            'String',
                            'BeginByteArray',
                            'BeginCompound',
                            'BeginIntArray',
                            'BeginList',
                            'BeginLongArray'
                        ];
                        break;
                    case 'Comma':
                        expectedTypes = ['EndCompound', 'Thing', 'String'];
                        break;
                    default:
                        break;
                }
            }
            else {
                throw `Expect '${expectedTypes}' but got '${token.type}' at pos '${pos}'.`;
            }
        }
        throw 'Parsing compound error!';
    }
    parseList(tokens, pos, version) {
        let expectedTypes;
        const resultValue = new nbt_1.NbtList();
        let state = 'begin';
        let val;
        expectedTypes = ['BeginList'];
        for (; pos < tokens.length; pos++) {
            const token = tokens[pos];
            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginList':
                        if (state === 'begin') {
                            expectedTypes = [
                                'EndListOrArray',
                                'Thing',
                                'String',
                                'BeginByteArray',
                                'BeginCompound',
                                'BeginIntArray',
                                'BeginList',
                                'BeginLongArray'
                            ];
                            state = 'item';
                        }
                        else if (state === 'item') {
                            expectedTypes = ['Comma', 'EndListOrArray'];
                            const parseResult = this.parseList(tokens, pos, version);
                            val = parseResult.value;
                            pos = parseResult.pos;
                            resultValue.add(val);
                        }
                        break;
                    case 'EndListOrArray':
                        return { value: resultValue, pos: pos };
                    case 'Thing': {
                        if (this.parseThing(token) instanceof nbt_1.NbtInt) {
                            if (tokens[pos + 1].type === 'Colon') {
                                if (version === 'before 1.12') {
                                    pos += 1;
                                    continue;
                                }
                                else {
                                    throw `Unexpected token in ${tokens}.`;
                                }
                            }
                        }
                        expectedTypes = ['Comma', 'EndListOrArray'];
                        const parseResult = this.parseValue(tokens, pos, version);
                        val = parseResult.value;
                        pos = parseResult.pos;
                        resultValue.add(val);
                        break;
                    }
                    case 'String':
                    case 'BeginByteArray':
                    case 'BeginIntArray':
                    case 'BeginList':
                    case 'BeginLongArray':
                    case 'BeginCompound': {
                        expectedTypes = ['Comma', 'EndListOrArray'];
                        const parseResult = this.parseValue(tokens, pos, version);
                        val = parseResult.value;
                        pos = parseResult.pos;
                        resultValue.add(val);
                        break;
                    }
                    case 'Comma':
                        expectedTypes = [
                            'EndListOrArray',
                            'Thing',
                            'String',
                            'BeginByteArray',
                            'BeginCompound',
                            'BeginIntArray',
                            'BeginList',
                            'BeginLongArray'
                        ];
                        break;
                    default:
                        break;
                }
            }
            else {
                throw `Expect '${expectedTypes}' but got '${token.type}' at pos '${pos}'.`;
            }
        }
        throw 'Parsing list error!';
    }
    parseByteArray(tokens, pos) {
        let expectedTypes;
        const resultValue = new nbt_1.NbtByteArray();
        let val;
        expectedTypes = ['BeginByteArray'];
        for (; pos < tokens.length; pos++) {
            const token = tokens[pos];
            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginByteArray':
                        expectedTypes = ['EndListOrArray', 'Thing'];
                        break;
                    case 'EndListOrArray':
                        return { value: resultValue, pos: pos };
                    case 'Thing':
                        expectedTypes = ['Comma', 'EndListOrArray'];
                        if ((val = this.parseByte(token)) !== null) {
                            resultValue.add(val);
                        }
                        else {
                            throw `Get a token at '${pos}' whoose type isn't 'Byte' when parsing byte array!`;
                        }
                        break;
                    case 'Comma':
                        expectedTypes = ['EndListOrArray', 'Thing'];
                        break;
                    default:
                        break;
                }
            }
            else {
                throw `Expect '${expectedTypes}' but got '${token.type}' at pos '${pos}'.`;
            }
        }
        throw 'Parsing byte array error!';
    }
    parseIntArray(tokens, pos) {
        let expectedTypes;
        const resultValue = new nbt_1.NbtIntArray();
        let val;
        expectedTypes = ['BeginIntArray'];
        for (; pos < tokens.length; pos++) {
            const token = tokens[pos];
            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginIntArray':
                        expectedTypes = ['EndListOrArray', 'Thing'];
                        break;
                    case 'EndListOrArray':
                        return { value: resultValue, pos: pos };
                    case 'Thing':
                        expectedTypes = ['Comma', 'EndListOrArray'];
                        if ((val = this.parseInt(token)) !== null) {
                            resultValue.add(val);
                        }
                        else {
                            throw `Get a token at '${pos}' whoose type isn't 'Int' when parsing int array!`;
                        }
                        break;
                    case 'Comma':
                        expectedTypes = ['EndListOrArray', 'Thing'];
                        break;
                    default:
                        break;
                }
            }
            else {
                throw `Expect '${expectedTypes}' but got '${token.type}' at pos '${pos}'.`;
            }
        }
        throw 'Parsing int array error!';
    }
    parseLongArray(tokens, pos) {
        let expectedTypes;
        const resultValue = new nbt_1.NbtLongArray();
        let val;
        expectedTypes = ['BeginLongArray'];
        for (; pos < tokens.length; pos++) {
            const token = tokens[pos];
            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginLongArray':
                        expectedTypes = ['EndListOrArray', 'Thing'];
                        break;
                    case 'EndListOrArray':
                        return { value: resultValue, pos: pos };
                    case 'Thing':
                        expectedTypes = ['Comma', 'EndListOrArray'];
                        if ((val = this.parseLong(token)) !== null) {
                            resultValue.add(val);
                        }
                        else {
                            throw `Get a token at '${pos}' whoose type isn't 'Long' when parsing long array!`;
                        }
                        break;
                    case 'Comma':
                        expectedTypes = ['EndListOrArray', 'Thing'];
                        break;
                    default:
                        break;
                }
            }
            else {
                throw `Expect '${expectedTypes}' but got '${token.type}' at pos '${pos}'.`;
            }
        }
        throw 'Parsing long array error!';
    }
    /**
     * Parses a set of tokens of a value object.
     * Supports Thing, String, BeginCompound, BeginByteArray, BeginIntArray, BeginList and BeginLongArray.
     * @param tokens A list of tokens.
     * @param pos The beginning index.
     */
    parseValue(tokens, pos, version) {
        const token = tokens[pos];
        let val;
        let parseResult;
        switch (token.type) {
            case 'Thing':
            case 'String':
                if (token.type === 'Thing') {
                    val = this.parseThing(token);
                }
                else {
                    val = new nbt_1.NbtString();
                    val.set(token.value.toString());
                }
                return { value: val, pos: pos };
            case 'BeginCompound':
                parseResult = this.parseCompound(tokens, pos, version);
                break;
            case 'BeginByteArray':
                parseResult = this.parseByteArray(tokens, pos);
                break;
            case 'BeginIntArray':
                parseResult = this.parseIntArray(tokens, pos);
                break;
            case 'BeginList':
                parseResult = this.parseList(tokens, pos, version);
                break;
            case 'BeginLongArray':
                parseResult = this.parseLongArray(tokens, pos);
                break;
            default:
                throw `Token '${token.type}' is not a value!`;
        }
        val = parseResult.value;
        pos = parseResult.pos;
        return { value: val, pos: pos };
    }
    parseThing(token) {
        let result;
        if ((result = this.parseByte(token)) !== null) {
            return result;
        }
        else if ((result = this.parseShort(token)) !== null) {
            return result;
        }
        else if ((result = this.parseInt(token)) !== null) {
            return result;
        }
        else if ((result = this.parseLong(token)) !== null) {
            return result;
        }
        else if ((result = this.parseFloat(token)) !== null) {
            return result;
        }
        else if ((result = this.parseDouble(token)) !== null) {
            return result;
        }
        else {
            return this.parseString(token);
        }
    }
    parseString(token) {
        const result = new nbt_1.NbtString();
        result.set(token.value);
        return result;
    }
    parseByte(token) {
        let num;
        const result = new nbt_1.NbtByte();
        if (token.value === 'true') {
            num = 1;
        }
        else if (token.value === 'false') {
            num = 0;
        }
        else if (utils_1.isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'b') {
            num = parseInt(token.value);
        }
        else {
            return null;
        }
        result.set(num);
        return result;
    }
    parseShort(token) {
        let num;
        const result = new nbt_1.NbtShort();
        if (utils_1.isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 's') {
            num = parseInt(token.value);
        }
        else {
            return null;
        }
        result.set(num);
        return result;
    }
    parseInt(token) {
        let num;
        const result = new nbt_1.NbtInt();
        if (utils_1.isNumeric(token.value)) {
            if (token.value.indexOf('.') === -1) {
                num = parseFloat(token.value);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
        result.set(num);
        return result;
    }
    parseLong(token) {
        let num;
        const result = new nbt_1.NbtLong();
        if (utils_1.isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'l') {
            num = parseInt(token.value);
        }
        else {
            return null;
        }
        result.set(num);
        return result;
    }
    parseFloat(token) {
        let num;
        const result = new nbt_1.NbtFloat();
        if (utils_1.isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'f') {
            num = parseFloat(token.value);
        }
        else {
            return null;
        }
        result.set(num);
        return result;
    }
    parseDouble(token) {
        let num;
        const result = new nbt_1.NbtDouble();
        if (utils_1.isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'd') {
            num = parseFloat(token.value);
        }
        else if (utils_1.isNumeric(token.value)) {
            if (token.value.indexOf('.') !== -1) {
                num = parseFloat(token.value);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
        result.set(num);
        return result;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map