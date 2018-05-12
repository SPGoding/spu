"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=argument_reader.js.map