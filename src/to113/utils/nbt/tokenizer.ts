import { isWhiteSpace, isNumeric, NbtFormat } from '../../../utils/utils'

/**
 * Provides methods to tokenize a nbt string.
 *
 * @author SPGoding
 */
export class Tokenizer {
    public tokenize(nbt: string, version: NbtFormat = 'after 1.12') {
        const tokens: Token[] = []

        let result = this.readAToken(nbt, 0, version, 0)
        tokens.push(result.token)
        while (result.token.type !== 'EndOfDocument') {
            if (result.token.type === 'Colon') {
                result = this.readAToken(nbt, result.pos, version, 1)
            } else if (['BeginByteArray', 'BeginIntArray', 'BeginLongArray', 'BeginList'].indexOf(result.token.type) !== -1) {
                result = this.readAToken(nbt, result.pos, version, 2)
            } else {
                result = this.readAToken(nbt, result.pos, version, 0)
            }
            tokens.push(result.token)
        }

        return tokens
    }

    private readAToken(nbt: string, pos: number, version: NbtFormat, unquotedDealingWay: number): ReadTokenResult {
        pos = this.skipWhiteSpace(nbt, pos)
        switch (nbt.charAt(pos)) {
            case '{':
                return { token: { type: 'BeginCompound', value: '{' }, pos: pos + 1 }
            case '}':
                return { token: { type: 'EndCompound', value: '}' }, pos: pos + 1 }
            case '[':
                switch (nbt.slice(pos, pos + 3)) {
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
            case '':
                return { token: { type: 'EndOfDocument', value: '' }, pos: pos + 1 }
            case '"': {
                // Quoted
                const readResult = this.readQuotedString(nbt, pos)
                return { token: { type: 'String', value: readResult.str }, pos: readResult.pos + 1 }
            }
            default: {
                // Unquoted.
                const readResult = this.readUnquoted(nbt, pos, version, unquotedDealingWay)
                return {
                    token: { type: 'Thing', value: readResult.str },
                    pos: readResult.pos + 1
                }
            }
        }
    }

    private skipWhiteSpace(nbt: string, pos: number) {
        while (isWhiteSpace(nbt.charAt(pos))) {
            if (nbt.charAt(pos) === '') {
                return pos
            }
            pos += 1
        }
        return pos
    }

    private readQuotedString(nbt: string, pos: number): ReadStringResult {
        let str = ''
        let flag = false

        pos += 1 // Skip the first quote.

        while (nbt.charAt(pos) !== '"' || flag) {
            if (nbt.charAt(pos) === '\\' && !flag) {
                flag = true
            } else if (nbt.charAt(pos) === '') {
                throw `Expected '"' but got EOF for a quoted string.`
            } else {
                str += nbt.charAt(pos)
                flag = false
            }
            pos += 1
        }

        return { str: str, pos: pos }
    }

    /**
     * 
     * @param nbt 
     * @param pos 
     * @param version 
     * @param unquotedDealingWay 0 - Doesn't allow colon
     * 
     * 1 - Allow colon
     * 
     * 2 - Allow colon after none numbers
     */
    private readUnquoted(nbt: string, pos: number, version: NbtFormat, unquotedDealingWay: number): ReadStringResult {
        let str = ''
        let metNonNumber = false

        while ([',', ']', '}', ''].indexOf(nbt.charAt(pos)) === -1 &&
            (unquotedDealingWay === 1 || nbt[pos] !== ':' || (unquotedDealingWay === 2 && metNonNumber))) {
            const char = nbt.charAt(pos)
            if (!isNumeric(char)) {
                metNonNumber = true
            }
            if (version === 'before 1.12') {
                str += char
            } else if (version === 'after 1.12' && /[a-zA-Z0-9\._+\-\s]/.test(char)) {
                str += char
            } else {
                throw `Illegal unquoted char at ${pos} in '${nbt}'.`
            }
            pos += 1
        }

        pos -= 1 // Return to the char before ',', ']', '}', ' ' or ''.

        return { str: str, pos: pos }
    }
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
    | 'Thing'
    | 'String'
    | 'EndOfDocument'

export interface Token {
    type: TokenType
    value: string
}

export interface ReadTokenResult {
    token: Token
    pos: number
}

export interface ReadStringResult {
    str: string
    pos: number
}
