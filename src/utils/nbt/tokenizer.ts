import { isWhiteSpace, isNumeric } from '../utils'

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

    private readAToken(nbt: string, pos: number): ReadTokenResult {
        pos = this.skipWhiteSpace(nbt, pos)
        switch (nbt.substr(pos, 1)) {
            case '{':
                return { token: { type: 'BeginCompound', value: '{' }, pos: pos + 1 }
            case '}':
                return { token: { type: 'EndCompound', value: '}' }, pos: pos + 1 }
            case '[':
                switch (nbt.substr(pos, 3)) {
                    case '[I;':
                        return {
                            token: { type: 'BeginIntArray', value: '[I;' },
                            pos: pos + 3
                        }
                    case '[B;':
                        return {
                            token: { type: 'BeginByteArray', value: '[B;' },
                            pos: pos + 3
                        }
                    case '[L;':
                        return {
                            token: { type: 'BeginLongArray', value: '[L;' },
                            pos: pos + 3
                        }
                    default:
                        return { token: { type: 'BeginList', value: '[' }, pos: pos + 1 }
                }
            case ']':
                return { token: { type: 'EndListOrArray', value: ']' }, pos: pos + 1 }
            case ':':
                return { token: { type: 'Colon', value: ':' }, pos: pos + 1 }
            case ',':
                return { token: { type: 'Comma', value: ',' }, pos: pos + 1 }
            case '"': {
                const result = this.readQuotedString(nbt, pos)
                return { token: { type: 'String', value: result.str }, pos: result.pos + 1 }
            }
            case '':
                return { token: { type: 'EndOfDocument', value: '' }, pos: pos + 1 }
            default: {
                // Unquoted.
                const result = this.readUnquoted(nbt, pos)
                let num: number

                if (isNumeric(result.str.slice(0, -1))) {
                    switch (result.str.slice(-1)) {
                        case 'b':
                        case 'B':
                            // [Byte]
                            num = parseInt(result.str)
                            if (num >= -128 && num <= 127) {
                                return {
                                    token: { type: 'Byte', value: num },
                                    pos: result.pos + 1
                                }
                            } else {
                                throw `Byte ${num} out of range.`
                            }
                        case 's':
                        case 'S':
                            // Short
                            num = parseInt(result.str)
                            if (num >= -32768 && num <= 32767) {
                                return {
                                    token: { type: 'Short', value: num },
                                    pos: result.pos + 1
                                }
                            } else {
                                throw `Short ${num} out of range.`
                            }
                        case 'l':
                        case 'L':
                            // Long
                            num = parseInt(result.str)
                            if (num >= -9223372036854775808 && num <= 9223372036854775807) {
                                return {
                                    token: { type: 'Long', value: num },
                                    pos: result.pos + 1
                                }
                            } else {
                                throw `Long ${num} out of range.`
                            }
                        case 'f':
                        case 'F':
                            // Float
                            num = parseFloat(result.str)
                            if (num >= -3.4e38 && num <= 3.4e38) {
                                return {
                                    token: { type: 'Float', value: num },
                                    pos: result.pos + 1
                                }
                            } else {
                                throw `Float ${num} out of range.`
                            }
                        case 'd':
                        case 'D':
                            // [Double]
                            num = parseFloat(result.str)
                            if (num >= -1.79e308 && num <= 1.79e308) {
                                return {
                                    token: { type: 'Double', value: num },
                                    pos: result.pos + 1
                                }
                            } else {
                                throw `Double ${num} out of range.`
                            }
                        default:
                            // Int, [Double], [Unquoted String]
                            if (/[0-9\.]/.test(result.str.slice(-1))) {
                                // Int, [Double]
                                if (parseInt(result.str) === parseFloat(result.str) && result.str.slice(-1) !== '.') {
                                    // Int
                                    return {
                                        token: { type: 'Int', value: parseInt(result.str) },
                                        pos: result.pos + 1
                                    }
                                } else {
                                    // [Double]
                                    return {
                                        token: {
                                            type: 'Double',
                                            value: parseFloat(result.str)
                                        },
                                        pos: result.pos + 1
                                    }
                                }
                            } else {
                                // [Unquoted String]
                                return {
                                    token: { type: 'String', value: result.str },
                                    pos: result.pos + 1
                                }
                            }
                    }
                } else {
                    // [Byte], [Unquoted String]
                    if (result.str === 'false') {
                        return { token: { type: 'Byte', value: 0 }, pos: result.pos + 1 }
                    } else if (result.str === 'true') {
                        return { token: { type: 'Byte', value: 1 }, pos: result.pos + 1 }
                    } else {
                        return {
                            token: { type: 'String', value: result.str },
                            pos: result.pos + 1
                        }
                    }
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

    private readQuotedString(nbt: string, pos: number): ReadStringResult {
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

    private readUnquoted(nbt: string, pos: number): ReadStringResult {
        let str = ''

        while ([',', ']', '}', ' ', ''].indexOf(nbt.substr(pos, 1)) === -1) {
            const char = nbt.substr(pos, 1)
            if (this.charPattern.test(char)) {
                str += char
            } else {
                throw `Illegal unquoted char at ${pos} in '${nbt}'.`
            }
            pos += 1
        }

        pos -= 1 // Return to the char before ',', ']', '}', ' ' or ''.

        return { str: str, pos: pos }
    }

    private charPattern = /[a-zA-Z0-9\._+\-]/
}

export type TokenType =
    | 'BeginCompound'
    | 'EndCompound'
    | 'BeginList'
    | 'BeginByteArray'
    | 'BeginIntArray'
    | 'BeginLongArray'
    | 'EndListOrArray'
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

export interface Token {
    type: TokenType
    value: string | number
}

export interface ReadTokenResult {
    token: Token
    pos: number
}

export interface ReadStringResult {
    str: string
    pos: number
}
