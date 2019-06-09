"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class CharReader {
    getPos() {
        return this.pos;
    }
    setPos(pos) {
        this.pos = pos;
    }
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
    readUntil(until) {
        let result = '';
        let char = this.str.charAt(this.pos - 1);
        while (this.hasMore() && until.indexOf(char) === -1) {
            if (utils_1.isWhiteSpace(char)) {
                char = this.next();
                continue;
            }
            result += char;
            char = this.next();
        }
        return result;
    }
}
exports.CharReader = CharReader;
//# sourceMappingURL=char_reader.js.map