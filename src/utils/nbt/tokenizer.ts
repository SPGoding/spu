import CharReader, { isWhiteSpace } from '../char_reader'

/**
 * Provides methods to tokenize a nbt string.
 *
 * @author SPGoding
 */
export class Tokenizer {
    private charReader: CharReader

    constructor(nbt: string) {
        this.charReader = new CharReader(nbt)
    }

    public tokenize() {
        let result: Token[] = []
        let char = this.skipWhiteSpace()

        let token = this.readAToken(char)
        while (token.getType() !== TokenType.EndOfDocument) {
            token = this.readAToken(char)
            result.push(token)
            char = this.skipWhiteSpace()
        }

        return result
    }

    private readAToken(char: string) {
        switch (char) {
            case '{':
                this.charReader.next()
                return new Token(TokenType.BeginCompound, '{')
            case '}':
                this.charReader.next()
                return new Token(TokenType.EndCompound, '}')
            case '[':
                if (this.isBeginByteArray()) {
                    return this.readBeginByteArray()
                } else if (this.isBeginIntArray()) {
                    return this.readBeginIntArray()
                } else if (this.isBeginLongArray()) {
                    return this.readBeginLongArray()
                } else {
                    return new Token(TokenType.BeginList, '[')
                }
            case ']':
                return new Token(TokenType.EndListArray, ']')
            case ':':
                return new Token(TokenType.Colon, ':')
            case ',':
                return new Token(TokenType.Comma, ',')
            case '':
                return new Token(TokenType.EndOfDocument, '')
            default:
                throw `Unexpected token at char '${char}'.`
        }
    }

    private skipWhiteSpace() {
        let char = this.charReader.next()
        while (char && isWhiteSpace(char)) {
            char = this.charReader.next()
        }
        return char
    }

    private isBeginByteArray() {
        let pos = this.charReader.getPos()
        let result = false

        if (this.charReader.next() === 'B' && this.charReader.next() === ';') {
            result = true
        }

        this.charReader.setPos(pos)
        return result
    }

    private readBeginByteArray() {
        this.charReader.next()
        this.charReader.next()
        this.charReader.next()

        return new Token(TokenType.BeginByteArray, '[B;')
    }

    private isBeginIntArray() {
        let pos = this.charReader.getPos()
        let result = false

        if (this.charReader.next() === 'I' && this.charReader.next() === ';') {
            result = true
        }

        this.charReader.setPos(pos)
        return result
    }

    private readBeginIntArray() {
        this.charReader.next()
        this.charReader.next()
        this.charReader.next()

        return new Token(TokenType.BeginByteArray, '[I;')
    }

    private isBeginLongArray() {
        let pos = this.charReader.getPos()
        let result = false

        if (this.charReader.next() === 'L' && this.charReader.next() === ';') {
            result = true
        }

        this.charReader.setPos(pos)
        return result
    }

    private readBeginLongArray() {
        this.charReader.next()
        this.charReader.next()
        this.charReader.next()

        return new Token(TokenType.BeginByteArray, '[L;')
    }
}

export class Token {
    private type: TokenType
    private value: any

    constructor(type: TokenType, value: any) {
        this.type = type
        this.value = value
    }

    getType() {
        return this.type
    }

    getValue() {
        return this.value
    }
}

export enum TokenType {
    /*  {  */ BeginCompound,
    /*  }  */ EndCompound,
    /*  [  */ BeginList,
    /* [B; */ BeginByteArray,
    /* [I; */ BeginIntArray,
    /* [L; */ BeginLongArray,
    /*  ]  */ EndListArray,
    /*  :  */ Colon,
    /*  ,  */ Comma,
    /*  b  */ Byte,
    /*  s  */ Short,
    /*  i  */ Int,
    /*  l  */ Long,
    /*  f  */ Float,
    /*  d  */ Double,
    /*  "  */ String,
    /* NUL */ EndOfDocument
}
