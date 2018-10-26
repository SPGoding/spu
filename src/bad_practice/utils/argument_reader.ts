/**
 * A reader that provides methods to read a command argument by argument.
 */
export default class ArgumentReader {
    private arg: string[]
    private pos: number
    private length: number

    constructor(str: string) {
        this.arg = str.split(' ')
        this.pos = 0
        this.length = this.arg.length
    }

    peek() {
        if (this.pos - 1 >= this.length) {
            return ''
        }

        return this.arg[this.pos]
    }

    next() {
        if (!this.hasMore()) {
            return ''
        }
        return this.arg[this.pos++]
    }

    back() {
        this.pos = Math.max(0, --this.pos)
    }

    hasMore() {
        return this.pos < this.length
    }
}
