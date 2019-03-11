"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils/utils");
class Tokenizer {
    tokenize(nbt, version = 'after 1.12') {
        const tokens = [];
        let result = this.readAToken(nbt, 0, version, 0);
        tokens.push(result.token);
        while (result.token.type !== 'EndOfDocument') {
            if (result.token.type === 'Colon') {
                result = this.readAToken(nbt, result.pos, version, 1);
            }
            else if (['BeginByteArray', 'BeginIntArray', 'BeginLongArray', 'BeginList'].indexOf(result.token.type) !== -1) {
                result = this.readAToken(nbt, result.pos, version, 2);
            }
            else {
                result = this.readAToken(nbt, result.pos, version, 0);
            }
            tokens.push(result.token);
        }
        return tokens;
    }
    readAToken(nbt, pos, version, unquotedDealingWay) {
        pos = this.skipWhiteSpace(nbt, pos);
        switch (nbt.charAt(pos)) {
            case '{':
                return { token: { type: 'BeginCompound', value: '{' }, pos: pos + 1 };
            case '}':
                return { token: { type: 'EndCompound', value: '}' }, pos: pos + 1 };
            case '[':
                switch (nbt.slice(pos, pos + 3)) {
                    case '[I;':
                        return {
                            token: { type: 'BeginIntArray', value: '[I;' },
                            pos: pos + 3
                        };
                    case '[B;':
                        return {
                            token: { type: 'BeginByteArray', value: '[B;' },
                            pos: pos + 3
                        };
                    case '[L;':
                        return {
                            token: { type: 'BeginLongArray', value: '[L;' },
                            pos: pos + 3
                        };
                    default:
                        return { token: { type: 'BeginList', value: '[' }, pos: pos + 1 };
                }
            case ']':
                return { token: { type: 'EndListOrArray', value: ']' }, pos: pos + 1 };
            case ':':
                return { token: { type: 'Colon', value: ':' }, pos: pos + 1 };
            case ',':
                return { token: { type: 'Comma', value: ',' }, pos: pos + 1 };
            case '':
                return { token: { type: 'EndOfDocument', value: '' }, pos: pos + 1 };
            case '"': {
                const readResult = this.readQuotedString(nbt, pos);
                return { token: { type: 'String', value: readResult.str }, pos: readResult.pos + 1 };
            }
            default: {
                const readResult = this.readUnquoted(nbt, pos, version, unquotedDealingWay);
                return {
                    token: { type: 'Thing', value: readResult.str },
                    pos: readResult.pos + 1
                };
            }
        }
    }
    skipWhiteSpace(nbt, pos) {
        while (utils_1.isWhiteSpace(nbt.charAt(pos))) {
            if (nbt.charAt(pos) === '') {
                return pos;
            }
            pos += 1;
        }
        return pos;
    }
    readQuotedString(nbt, pos) {
        let str = '';
        let flag = false;
        pos += 1;
        while (nbt.charAt(pos) !== '"' || flag) {
            if (nbt.charAt(pos) === '\\' && !flag) {
                flag = true;
            }
            else if (nbt.charAt(pos) === '') {
                throw `Expected '"' but got EOF for a quoted string.`;
            }
            else {
                str += nbt.charAt(pos);
                flag = false;
            }
            pos += 1;
        }
        return { str: str, pos: pos };
    }
    readUnquoted(nbt, pos, version, unquotedDealingWay) {
        let str = '';
        let metNonNumber = false;
        while ([',', ']', '}', ''].indexOf(nbt.charAt(pos)) === -1 &&
            (unquotedDealingWay === 1 || nbt[pos] !== ':' || (unquotedDealingWay === 2 && metNonNumber))) {
            const char = nbt.charAt(pos);
            if (!utils_1.isNumeric(char)) {
                metNonNumber = true;
            }
            if (version === 'before 1.12') {
                str += char;
            }
            else if (version === 'after 1.12' && /[a-zA-Z0-9\._+\-\s]/.test(char)) {
                str += char;
            }
            else {
                throw `Illegal unquoted char at ${pos} in '${nbt}'.`;
            }
            pos += 1;
        }
        pos -= 1;
        return { str: str, pos: pos };
    }
}
exports.Tokenizer = Tokenizer;
