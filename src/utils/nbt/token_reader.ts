import CharReader, { isWhiteSpace } from '../char_reader'

/**
 * Makes a character stream as a Token stream.
 *
 * @author https://github.com/michaelliao/jsonstream/blob/master/src/main/java/com/itranswarp/jsonstream/TokenReader.java
 * @author SPGoding
 */
export default class Tokenizer {
    private charReader: CharReader

    constructor(nbt: string) {
        this.charReader = new CharReader(nbt)
    }

    read() {
        let result: Token[] = []
        let char = ''

        while (true) {
            if (!this.charReader.hasMore()) {
                result.push(new Token(TokenType.EndOfDocument, null))
            }
            char = this.charReader.peek()
            if (!isWhiteSpace(char)) {
                break
            }
            this.charReader.next()
        }

        switch (char) {
            case '{':
                this.charReader.next()
                result.push(new Token(TokenType.BeginCompound, '{'))
            case '}':
                this.charReader.next()
                result.push(new Token(TokenType.EndCompound, '}'))
            default:
                break
        }
    }
}

class Token {
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

enum TokenType {
    /*  {  */ BeginCompound,
    /*  }  */ EndCompound,
    /*  [  */ BeginList,
    /* [b; */ BeginByteArray,
    /* [i; */ BeginIntArray,
    /* [l; */ BeginLongArray,
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

export { Tokenizer }
