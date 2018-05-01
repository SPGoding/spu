import CharReader from './char_reader'
import { isWhiteSpace } from './char_reader'

/**
 * Represent an entity selector.
 * Provides methods to operate it.
 * @author SPGoding
 */
export default class Selector {
    private type: SelectorType
    private properties: Map<string, any>
    private scores: Map<string, Range>

    static parse112(str: string) {
        let charReader = new CharReader(str)
        let char: string

        char = charReader.next()
        if (char !== '@') {
            console.log(`First char should be '@': ${str}`)
            return
        }

        char = charReader.next()
        switch (char) {
            case 'a':
                this.type = SelectorType.A
            case 'e':
                this.type = SelectorType.E
            case 'p':
                this.type = SelectorType.P
            case 'r':
                this.type = SelectorType.R
            case 's':
                this.type = SelectorType.S
            default:
                console.log(`Unknown type: ${str}`)
        }

        char = charReader.next()
        if (char === '') {
            return
        } else if (char === '[') {
            let key: string
            let val: string
            do {
                key = ''
                val = ''
                do {
                    char = charReader.next()
                    if (isWhiteSpace(char)) {
                        continue
                    }
                    key.append(char)
                } while (char !== '=')
                do {
                    char = charReader.next()
                    if (isWhiteSpace(char)) {
                        continue
                    }
                    val.append(char)
                } while (char !== ',' && char !== ']' )
                this.properties.set(key, val)
            } while (char !== ']')
        } else {
            console.log(`Unexpected token: ${str}`)
        }
    }  
}

enum SelectorType {
    A, E, P, R, S
}

class Range {
    private min: number
    private max: number

    getMin() {
        return this.min
    }

    getMax() {
        return this.max
    }

    parse113(str: string) {
        let arr = str.split('..')
        if (arr.length === 2) {
            this.min = arr[0] ? Number(arr[0]) : null
            this.max = arr[1] ? Number(arr[1]) : null
        } else {
            this.min = this.max = Number(arr[0]) 
        }
    }
}
