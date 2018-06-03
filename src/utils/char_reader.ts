import { isWhiteSpace } from './utils'

/**
 * A reader that provides methods to read a string char by char.
 */
export default class CharReader {
    private str: string
    private pos: number
    private length: number

    getPos() {
        return this.pos
    }

    setPos(pos: number) {
        this.pos = pos
    }

    constructor(str: string) {
        this.str = str
        this.pos = 0
        this.length = str.length
    }

    peek() {
        if (this.pos - 1 >= this.length) {
            return ''
        }

        return this.str.charAt(this.pos)
    }

    next() {
        if (!this.hasMore()) {
            return ''
        }
        return this.str.charAt(this.pos++)
    }

    back() {
        this.pos = Math.max(0, --this.pos)
    }

    hasMore() {
        return this.pos < this.length
    }

    readUntil(until: string[]) {
        let result = ''
        let char = this.str.charAt(this.pos - 1)

        while (this.hasMore() && until.indexOf(char) === -1) {
            if (isWhiteSpace(char)) {
                char = this.next()
                continue
            }
            result += char
            char = this.next()
        }

        return result
    }
}
