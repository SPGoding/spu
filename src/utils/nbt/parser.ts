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

        if (result.pos + 1 === tokens.length) {
            return result.value
        } else {
            throw `Unsymmetrical squares.`
        }
    }

    /**
     * @returns {pos: the index of the closed square, value: parsed Value object}
     */
    private parseCompound(tokens: Token[], pos: number): ParseResult {
        let expectedType: TokenType
        let state: 'key' | 'val' = 'key'
        let key = ''
        let val: string | number
        let value: NbtValue

        expectedType = TokenType.BeginCompound

        for (; pos < tokens.length; pos++) {
            const token = tokens[pos]

            if (token.type === expectedType) {
                switch (token.type) {
                    case TokenType.BeginCompound:
                        expectedType = TokenType.EndCompound | TokenType.Key
                        value = new NbtCompound()
                        break
                    case TokenType.Value:
                        if (state === 'key') {
                            expectedType = TokenType.Comma
                            key = token.value.toString()
                        } else if (state === 'val') {
                            expectedType =
                                TokenType.Colon | TokenType.EndCompound | TokenType.EndListOrArray
                            val = new foo(token.value)
                            value.set(key, val)
                        }
                        break
                    case TokenType.Comma:
                        expectedType = TokenType.Value
                        state = 'val'
                        break
                    default:
                        break
                }
            } else {
                throw `Expect '${expectedType}' but get '${
                    token.type
                }' when parsing '${tokens}[${pos}]'.`
            }
        }

        throw ''
    }
}

interface ParseResult {
    value: NbtValue
    pos: number
}
