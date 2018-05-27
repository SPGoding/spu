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
            case '':
                return { token: { type: 'EndOfDocument', value: '' }, pos: pos + 1 }
            default:
                throw `Unexpected token at pos '${pos}' in '${nbt}'.`
        }
    }

    private skipWhiteSpace(nbt: string, pos: number) {
        while (isWhiteSpace(nbt.substr(pos, 1))) {
            pos += 1
        }
        return pos
    }
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
