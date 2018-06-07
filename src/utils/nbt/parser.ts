import { Token, TokenType } from './tokenizer'
import { isNumeric } from '../utils'
import {
    NbtValue,
    NbtCompound,
    NbtList,
    NbtByteArray,
    NbtIntArray,
    NbtLongArray,
    NbtByte,
    NbtShort,
    NbtInt,
    NbtLong,
    NbtFloat,
    NbtDouble,
    NbtString
} from './nbt'

/**
 * Provides methods to parse a NBT tokens list.
 *
 * @author SPGoding
 */
export class Parser {
    public parse(tokens: Token[]) {
        const result = this.parseCompound(tokens, 0)

        if (tokens[result.pos + 1].type === 'EndOfDocument') {
            return result.value
        } else {
            throw `Unsymmetrical squares.`
        }
    }

    /**
     * @returns {pos: the index of the closed square, value: parsed Value object}
     */
    private parseCompound(tokens: Token[], pos: number): ParseResult {
        let expectedTypes: TokenType[]
        let state: 'key' | 'val' = 'key'
        let key = ''
        let val: NbtValue | undefined
        let result = new NbtCompound()

        expectedTypes = ['BeginCompound']

        for (; pos < tokens.length; pos++) {
            const token = tokens[pos]

            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginCompound':
                        if (state === 'key') {
                            expectedTypes = ['EndCompound', 'Thing', 'String']
                        } else if (state === 'val') {
                            const parseResult = this.parseCompound(tokens, pos)
                            val = parseResult.value
                            pos = parseResult.pos + 1
                        }
                        break
                    case 'EndCompound':
                        return { value: result, pos: pos }
                    case 'Thing':
                    case 'String':
                        switch (token.type) {
                            case 'Thing':
                                val = this.parseThing(token, val)
                                break
                            case 'String':
                            default:
                                val = new NbtString()
                                val.set(token.value.toString())
                                break
                        }
                        if (state === 'key') {
                            expectedTypes = ['Comma']
                            key = token.value
                            state = 'val'
                        } else if (state === 'val') {
                            expectedTypes = ['Colon', 'EndCompound']

                            if (val) {
                                result.set(key, val)
                            }
                            state = 'key'
                        }
                        break
                    case 'BeginByteArray':
                        // TODO: val = this.parseByteArray
                        break
                    case 'BeginIntArray':
                        // TODO: val = this.parseIntArray
                        break
                    case 'BeginList':
                        // TODO: val = this.parseList
                        break
                    case 'BeginLongArray':
                        // TODO: val = this.parseLongArray
                        break
                    case 'Comma':
                        expectedTypes = [
                            'Thing',
                            'String',
                            'BeginByteArray',
                            'BeginCompound',
                            'BeginIntArray',
                            'BeginList',
                            'BeginLongArray'
                        ]
                        break
                    case 'Colon':
                        expectedTypes = ['EndCompound', 'Thing', 'String']
                        break
                    default:
                        break
                }
            } else {
                throw `Expect '${expectedTypes}' but get '${token.type}' when parsing '${tokens}[${pos}]'.`
            }
        }

        throw 'Parsing compound error!'
    }

    private parseThing(token: Token, val: NbtValue | undefined) {
        let num: number | null

        if ((num = this.parseByte(token)) !== null) {
            val = new NbtByte()
            val.set(num)
        } else if ((num = this.getShort(token)) !== null) {
            val = new NbtShort()
            val.set(num)
        } else if ((num = this.getInt(token)) !== null) {
            val = new NbtInt()
            val.set(num)
        } else if ((num = this.getLong(token)) !== null) {
            val = new NbtLong()
            val.set(num)
        } else if ((num = this.getFloat(token)) !== null) {
            val = new NbtFloat()
            val.set(num)
        } else if ((num = this.getDouble(token)) !== null) {
            val = new NbtDouble()
            val.set(num)
        } else {
            val = new NbtString()
            val.set(token.value.toString())
        }

        return val
    }

    private parseByte(token: Token) {
        if (token.value === 'true') {
            return 1
        } else if (token.value === 'false') {
            return 0
        } else if (isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'b') {
            return parseInt(token.value)
        } else {
            return null
        }
    }

    private getShort(token: Token) {
        if (isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 's') {
            return parseInt(token.value)
        } else {
            return null
        }
    }

    private getInt(token: Token) {
        if (isNumeric(token.value)) {
            if (token.value.indexOf('.') === -1) {
                return parseFloat(token.value)
            } else {
                return null
            }
        } else {
            return null
        }
    }

    private getLong(token: Token) {
        if (isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'l') {
            return parseInt(token.value)
        } else {
            return null
        }
    }

    private getFloat(token: Token) {
        if (isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'l') {
            return parseFloat(token.value)
        } else {
            return null
        }
    }

    private getDouble(token: Token) {
        if (isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'd') {
            return parseFloat(token.value)
        } else if (isNumeric(token.value)) {
            if (token.value.indexOf('.') !== -1) {
                return parseFloat(token.value)
            } else {
                return null
            }
        } else {
            return null
        }
    }
}

interface ParseResult {
    value: NbtValue
    pos: number
}
