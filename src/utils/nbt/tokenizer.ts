import CharReader, { isWhiteSpace } from '../char_reader'

/**
 * Provides methods to tokenize a nbt string.
 *
 * @author SPGoding
 */
export class Tokenizer {
    public tokenize(nbt: string) {
        let tokens: Token[] = []

        let result = this.readAToken(nbt, 0)
        tokens.push(result.token)
        while (result.token.type !== 'EndOfDocument') {
            result = this.readAToken(nbt, result.pos)
            tokens.push(result.token)
        }

        return tokens
    }

    private readAToken(nbt: string, pos: number): Result {
        pos = this.skipWhiteSpace(nbt, pos)
        switch (nbt.substr(pos, 1)) {
            case '{':
                return { token: { type: 'BeginCompound', value: '{' }, pos: pos + 1 }
            case '}':
                return { token: { type: 'EndCompound', value: '}' }, pos: pos + 1 }
            case '[':
                switch (nbt.substr(pos, 3)) {
                    case '[I;':
                        return { token: { type: 'BeginIntArray', value: '[I;' }, pos: pos + 3 }
                    case '[B;':
                        return { token: { type: 'BeginByteArray', value: '[B;' }, pos: pos + 3 }
                    case '[L;':
                        return { token: { type: 'BeginLongArray', value: '[L;' }, pos: pos + 3 }
                    default:
                        return { token: { type: 'BeginList', value: '[' }, pos: pos + 1 }
                }
            case ']':
                return { token: { type: 'EndListArray', value: ']' }, pos: pos + 1 }
            case ':':
                return { token: { type: 'Colon', value: ':' }, pos: pos + 1 }
            case ',':
                return { token: { type: 'Comma', value: ',' }, pos: pos + 1 }
            case '"':
                let result = this.readQuotedString(nbt, pos)
                return { token: { type: 'String', value: result.str }, pos: result.pos + 1 }
            case '':
                return { token: { type: 'EndOfDocument', value: '' }, pos: pos + 1 }
            default:
                // Unquoted.
                let result = this.readUnquotedString(nbt, pos)
                let str = result.str
                let pos = result.pos
                let num: number
                switch (str.slice(-1)) {
                    case 'b':
                    case 'B':
                        num = parseInt(str)
                        if (num >= -128 && num <= 127) {
                            return { token: { type: 'Byte', value: num }, pos: pos + 1}
                        } else {
                            throw `Byte ${num} out of range.`
                        }
                    case 's':
                    case 'S':
                        num = parseInt(str)
                        if (num >= -32768 && num <= 32767) {
                            return { token: { type: 'Short', value: num }, pos: pos + 1}
                        } else {
                            throw `Short ${num} out of range.`
                        }
                }
        }
    }

    private skipWhiteSpace(nbt: string, pos: number) {
        while (isWhiteSpace(nbt.substr(pos, 1))) {
            pos += 1
        }
        return pos
    }

    private readQuotedString(nbt: string, pos: number): ReadQuotedStringResult {
        let str = ''
        let flag = false

        pos += 1 // Skip the first quote.

        while (nbt.substr(pos, 1) !== '"' || flag) {
            if (nbt.substr(pos, 1) === '\\' && !flag) {
                flag = true
            } else {
                str += nbt.substr(pos, 1)
                flag = false
            }
            pos += 1
        }

        return { str: str, pos: pos }
    }

    private readUnquotedString(nbt: string, pos: number): ReadQuotedStringResult {
        let str = ''

        while (![',', ']', '}', ' '].indexOf(nbt.substr(pos, 1))) {
            if (charPattern.test(nbt.substr(pos, 1))) {
                str += nbt.
            } else {
                throw `Illegal unquoted char at ${pos} in '${nbt}'.`
            }
            pos += 1
        }

        pos -= 1 // Return to the char before ',', ']', '}' or ' '.

        return { str: str, pos: pos }
    }

    private charPattern = /[a-zA-Z\._+\-]/
}

export interface Token {
    type:
        | 'BeginCompound'
        | 'EndCompound'
        | 'BeginList'
        | 'BeginByteArray'
        | 'BeginIntArray'
        | 'BeginLongArray'
        | 'EndListArray'
        | 'Colon'
        | 'Comma'
        | 'Byte'
        | 'Short'
        | 'Int'
        | 'Long'
        | 'Float'
        | 'Double'
        | 'String'
        | 'EndOfDocument'
    value: string | number
}

export interface Result {
    token: Token
    pos: number
}

export interface ReadQuotedStringResult {
    str: string
    pos: number
}

