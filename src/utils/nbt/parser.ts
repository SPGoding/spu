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
            return <NbtCompound>result.value
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
                            expectedTypes = ['Comma', 'EndCompound']
                            const parseResult = this.parseCompound(tokens, pos)
                            val = parseResult.value
                            pos = parseResult.pos

                            result.set(key, val)
                            state = 'key'
                        }
                        break
                    case 'EndCompound':
                        return { value: result, pos: pos }
                    case 'Thing':
                    case 'String':
                        if (token.type === 'Thing') {
                            val = this.parseThing(token)
                        } else {
                            val = new NbtString()
                            val.set(token.value.toString())
                        }
                        if (state === 'key') {
                            expectedTypes = ['Colon']
                            key = token.value
                            state = 'val'
                        } else if (state === 'val') {
                            expectedTypes = ['Comma', 'EndCompound']

                            if (val) {
                                result.set(key, val)
                            }
                            state = 'key'
                        }
                        break
                    case 'BeginByteArray':
                    case 'BeginIntArray':
                    case 'BeginList':
                    case 'BeginLongArray':
                        expectedTypes = ['Comma', 'EndCompound']
                        const parseResult = this.parseValue(tokens, pos)
                        val = parseResult.value
                        pos = parseResult.pos
                        result.set(key, val)
                        state = 'key'
                        break
                    case 'Colon':
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
                    case 'Comma':
                        expectedTypes = ['EndCompound', 'Thing', 'String']
                        break
                    default:
                        break
                }
            } else {
                throw `Expect '${expectedTypes}' but get '${token.type}' at pos '${pos}'.`
            }
        }

        throw 'Parsing compound error!'
    }

    private parseList(tokens: Token[], pos: number): ParseResult {
        let expectedTypes: TokenType[]
        let resultValue = new NbtList()
        let state: 'begin' | 'value' = 'begin'
        let val: NbtValue

        expectedTypes = ['BeginList']

        for (; pos < tokens.length; pos++) {
            const token = tokens[pos]

            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginList':
                        if (state === 'begin') {
                            expectedTypes = [
                                'EndListOrArray',
                                'Thing',
                                'String',
                                'BeginByteArray',
                                'BeginCompound',
                                'BeginIntArray',
                                'BeginList',
                                'BeginLongArray'
                            ]
                            state = 'value'
                        } else if (state === 'value') {
                            expectedTypes = ['Comma', 'EndListOrArray']
                            const parseResult = this.parseList(tokens, pos)
                            val = parseResult.value
                            pos = parseResult.pos

                            resultValue.add(val)
                        }
                        break
                    case 'EndListOrArray':
                        return { value: resultValue, pos: pos }
                    case 'Thing':
                    case 'String':
                    case 'BeginByteArray':
                    case 'BeginIntArray':
                    case 'BeginList':
                    case 'BeginLongArray':
                    case 'BeginCompound':
                        expectedTypes = ['Comma', 'EndListOrArray']
                        const parseResult = this.parseValue(tokens, pos)
                        val = parseResult.value
                        pos = parseResult.pos
                        resultValue.add(val)
                        break
                    case 'Comma':
                        expectedTypes = [
                            'EndListOrArray',
                            'Thing',
                            'String',
                            'BeginByteArray',
                            'BeginCompound',
                            'BeginIntArray',
                            'BeginList',
                            'BeginLongArray'
                        ]
                        break
                    default:
                        break
                }
            } else {
                throw `Expect '${expectedTypes}' but get '${token.type}' at pos '${pos}'.`
            }
        }

        throw 'Parsing list error!'
    }

    private parseByteArray(tokens: Token[], pos: number): ParseResult {
        let expectedTypes: TokenType[]
        let resultValue = new NbtByteArray()
        let val: NbtByte | null

        expectedTypes = ['BeginByteArray']

        for (; pos < tokens.length; pos++) {
            const token = tokens[pos]

            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginByteArray':
                        expectedTypes = ['EndListOrArray', 'Thing']
                        break
                    case 'EndListOrArray':
                        return { value: resultValue, pos: pos }
                    case 'Thing':
                        expectedTypes = ['Comma', 'EndListOrArray']
                        if ((val = this.parseByte(token)) !== null) {
                            resultValue.add(val)
                        } else {
                            throw `Get a token at '${pos}' whoose type isn't 'Byte' when parsing byte array!`
                        }
                        break
                    case 'Comma':
                        expectedTypes = ['EndListOrArray', 'Thing']
                        break
                    default:
                        break
                }
            } else {
                throw `Expect '${expectedTypes}' but get '${token.type}' at pos '${pos}'.`
            }
        }

        throw 'Parsing byte array error!'
    }

    private parseIntArray(tokens: Token[], pos: number): ParseResult {
        let expectedTypes: TokenType[]
        let resultValue = new NbtIntArray()
        let val: NbtInt | null

        expectedTypes = ['BeginIntArray']

        for (; pos < tokens.length; pos++) {
            const token = tokens[pos]

            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginIntArray':
                        expectedTypes = ['EndListOrArray', 'Thing']
                        break
                    case 'EndListOrArray':
                        return { value: resultValue, pos: pos }
                    case 'Thing':
                        expectedTypes = ['Comma', 'EndListOrArray']
                        if ((val = this.parseInt(token)) !== null) {
                            resultValue.add(val)
                        } else {
                            throw `Get a token at '${pos}' whoose type isn't 'Int' when parsing int array!`
                        }
                        break
                    case 'Comma':
                        expectedTypes = ['EndListOrArray', 'Thing']
                        break
                    default:
                        break
                }
            } else {
                throw `Expect '${expectedTypes}' but get '${token.type}' at pos '${pos}'.`
            }
        }

        throw 'Parsing int array error!'
    }

    private parseLongArray(tokens: Token[], pos: number): ParseResult {
        let expectedTypes: TokenType[]
        let resultValue = new NbtLongArray()
        let val: NbtLong | null

        expectedTypes = ['BeginLongArray']

        for (; pos < tokens.length; pos++) {
            const token = tokens[pos]

            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginLongArray':
                        expectedTypes = ['EndListOrArray', 'Thing']
                        break
                    case 'EndListOrArray':
                        return { value: resultValue, pos: pos }
                    case 'Thing':
                        expectedTypes = ['Comma', 'EndListOrArray']
                        if ((val = this.parseLong(token)) !== null) {
                            resultValue.add(val)
                        } else {
                            throw `Get a token at '${pos}' whoose type isn't 'Long' when parsing long array!`
                        }
                        break
                    case 'Comma':
                        expectedTypes = ['EndListOrArray', 'Thing']
                        break
                    default:
                        break
                }
            } else {
                throw `Expect '${expectedTypes}' but get '${token.type}' at pos '${pos}'.`
            }
        }

        throw 'Parsing long array error!'
    }

    /**
     * Parses a set of tokens of a value object.
     * Supports Thing, String, BeginCompound, BeginByteArray, BeginIntArray, BeginList and BeginLongArray.
     * @param tokens A list of tokens.
     * @param pos The beginning index.
     */
    private parseValue(tokens: Token[], pos: number): ParseResult {
        let token = tokens[pos]
        let val: NbtValue
        let parseResult: ParseResult

        switch (token.type) {
            case 'Thing':
            case 'String':
                if (token.type === 'Thing') {
                    val = this.parseThing(token)
                } else {
                    val = new NbtString()
                    val.set(token.value.toString())
                }
                return { value: val, pos: pos }
            case 'BeginCompound':
                parseResult = this.parseCompound(tokens, pos)
                break
            case 'BeginByteArray':
                parseResult = this.parseByteArray(tokens, pos)
                break
            case 'BeginIntArray':
                parseResult = this.parseIntArray(tokens, pos)
                break
            case 'BeginList':
                parseResult = this.parseList(tokens, pos)
                break
            case 'BeginLongArray':
                parseResult = this.parseLongArray(tokens, pos)
                break
            default:
                throw `Token '${token.type}' is not a value!`
        }
        val = parseResult.value
        pos = parseResult.pos

        return { value: val, pos: pos }
    }

    private parseThing(token: Token) {
        let result: NbtValue | null

        if ((result = this.parseByte(token)) !== null) {
            return result
        } else if ((result = this.parseShort(token)) !== null) {
            return result
        } else if ((result = this.parseInt(token)) !== null) {
            return result
        } else if ((result = this.parseLong(token)) !== null) {
            return result
        } else if ((result = this.parseFloat(token)) !== null) {
            return result
        } else if ((result = this.parseDouble(token)) !== null) {
            return result
        } else {
            return this.parseString(token)
        }
    }

    private parseString(token: Token) {
        let result = new NbtString()

        result.set(token.value)

        return result
    }

    private parseByte(token: Token) {
        let num: number
        let result = new NbtByte()

        if (token.value === 'true') {
            num = 1
        } else if (token.value === 'false') {
            num = 0
        } else if (isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'b') {
            num = parseInt(token.value)
        } else {
            return null
        }

        result.set(num)

        return result
    }

    private parseShort(token: Token) {
        let num: number
        let result = new NbtShort()

        if (isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 's') {
            num = parseInt(token.value)
        } else {
            return null
        }

        result.set(num)

        return result
    }

    private parseInt(token: Token) {
        let num: number
        let result = new NbtInt()

        if (isNumeric(token.value)) {
            if (token.value.indexOf('.') === -1) {
                num = parseFloat(token.value)
            } else {
                return null
            }
        } else {
            return null
        }

        result.set(num)

        return result
    }

    private parseLong(token: Token) {
        let num: number
        let result = new NbtLong()

        if (isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'l') {
            num = parseInt(token.value)
        } else {
            return null
        }

        result.set(num)

        return result
    }

    private parseFloat(token: Token) {
        let num: number
        let result = new NbtFloat()

        if (isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'l') {
            num = parseFloat(token.value)
        } else {
            return null
        }

        result.set(num)

        return result
    }

    private parseDouble(token: Token) {
        let num: number
        let result = new NbtDouble()

        if (isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'd') {
            num = parseFloat(token.value)
        } else if (isNumeric(token.value)) {
            if (token.value.indexOf('.') !== -1) {
                num = parseFloat(token.value)
            } else {
                return null
            }
        } else {
            return null
        }

        result.set(num)

        return result
    }
}

interface ParseResult {
    value: NbtValue
    pos: number
}
