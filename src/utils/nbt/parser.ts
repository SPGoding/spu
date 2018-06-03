import { Token, TokenType } from './tokenizer'

/**
 * Provides methods to parse a NBT tokens list.
 *
 * @author SPGoding
 */
export class Parser {
    public parse(tokens: Token[]) {
        let expectedType: TokenType
        let result = new Compound()

        expectedType = 'BeginCompound'

        for (let pos = 0; pos < tokens.length; pos++) {
            const token = tokens[pos]

            if (token.type === expectedType) {
                if (token.type === 'BeginCompound') {
                    let parseResult = this.parseCompound(tokens, pos)
                    result.set(parseResult.key, { type: 'Compound', value: parseResult.value })
                    pos = parseResult.pos + 1
                }
            } else {
                throw `Expect '${expectedType}' but get '${
                    token.type
                }' when parsing '${tokens}' at '${tokens.indexOf(token)}'`
            }
        }
    }

    private parseCompound(tokens: Token[], pos: number): ParseResult {
        throw ''
    }
}

class Compound {
    private values: Map<string, Value>

    public getValue(key: string) {
        const val = this.values.get(key)
        if (val) {
            return val.value
        } else {
            return undefined
        }
    }

    public getType(key: string) {
        const val = this.values.get(key)
        if (val) {
            return val.type
        } else {
            return undefined
        }
    }

    public set(key: string, val: Value) {
        this.values.set(key, val)
    }
}

class List {
    private values: Value[]

    public getValue(index: number) {
        const val = this.values[index]
        if (val) {
            return val.value
        } else {
            return undefined
        }
    }

    public getType(index: number) {
        const val = this.values[index]
        if (val) {
            return val.type
        } else {
            return undefined
        }
    }
}

class ByteArray {
    private values: number[]

    public getValue(index: number) {
        return this.values[index]
    }
}

class IntArray {
    private values: number[]

    public getValue(index: number) {
        return this.values[index]
    }
}

class LongArray {
    private values: number[]

    public getValue(index: number) {
        return this.values[index]
    }
}

interface Value {
    type:
        | 'Compound'
        | 'List'
        | 'ByteArray'
        | 'IntArray'
        | 'LongArray'
        | 'Byte'
        | 'Short'
        | 'Int'
        | 'Long'
        | 'Float'
        | 'Double'
        | 'String'
    value: Compound | List | ByteArray | IntArray | LongArray | number | string
}

interface ParseResult {
    key: string
    value: Compound | List | ByteArray | IntArray | LongArray | number | string
    pos: number
}
