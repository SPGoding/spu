/*export default*/ class CharReader {
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
/*export*/ function isWhiteSpace(char) {
    return char === ' ' || char === '\t';
}
