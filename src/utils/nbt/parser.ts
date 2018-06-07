import { Token, TokenType } from './tokenizer'
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
                            expectedTypes = ['EndCompound', 'Byte', 'Double', 'Float', 'Int', 'Long', 'Short', 'String']
                        } else if (state === 'val') {
                            const parseResult = this.parseCompound(tokens, pos)
                            val = parseResult.value
                            pos = parseResult.pos + 1
                        }
                        break
                    case 'EndCompound':
                        return { value: result, pos: pos }
                    case 'Byte':
                    case 'Double':
                    case 'Float':
                    case 'Int':
                    case 'Long':
                    case 'Short':
                    case 'String':
                        switch (token.type) {
                            case 'Byte':
                                val = new NbtByte()
                                val.set(Number(token.value))
                                break
                            case 'Double':
                                val = new NbtDouble()
                                val.set(Number(token.value))
                                break
                            case 'Float':
                                val = new NbtFloat()
                                val.set(Number(token.value))
                                break
                            case 'Int':
                                val = new NbtInt()
                                val.set(Number(token.value))
                                break
                            case 'Long':
                                val = new NbtLong()
                                val.set(Number(token.value))
                                break
                            case 'Short':
                                val = new NbtShort()
                                val.set(Number(token.value))
                                break
                            case 'String':
                            default:
                                val = new NbtString()
                                val.set(token.value.toString())
                                break
                        }
                        if (state === 'key') {
                            expectedTypes = ['Comma']
                            key = val.toString()
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
                            'Byte',
                            'Double',
                            'Float',
                            'Int',
                            'Long',
                            'Short',
                            'String',
                            'BeginByteArray',
                            'BeginCompound',
                            'BeginIntArray',
                            'BeginList',
                            'BeginLongArray'
                        ]
                        break
                    case 'Colon':
                        expectedTypes = ['EndCompound', 'Byte', 'Double', 'Float', 'Int', 'Long', 'Short', 'String']
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
}

interface ParseResult {
    value: NbtValue
    pos: number
}
