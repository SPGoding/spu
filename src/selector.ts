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
    private advancements: Map<string, bool>

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
                    // 读取key
                    char = charReader.next()
                    if (isWhiteSpace(char)) {
                        continue
                    }
                    key.append(char)
                } while (char !== '=')
                do {
                    // 读取value
                    char = charReader.next()
                    if (isWhiteSpace(char)) {
                        continue
                    }
                    val.append(char)
                } while (char !== ',' && char !== ']' )

                if (key.length > 6 && key.substring(0, 5) === 'score_') {
                    // 特殊处理score
                    let objective: string
                    if (key.substr(-4) === '_min') {
                        // 最小值
                        objective = key.substring(6, key.length - 5)
                        if (this.scores.has(objective) {
                            // map里已经存了这个记分项，补全
                            this.scores.get(objective).setMin(val)
                        }
                    } else {
                        // 最大值
                        objective = key.substring(6)
                         if (this.scores.has(objective) {
                            // map里已经存了这个记分项，补全
                            this.scores.get(objective).setMax(val)
                        }
                    }
                } else {
                    // 普通属性
                    this.properties.set(key, val)
                }
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

    setMin(min: number) {
        this.min = min
    }

    getMax() {
        return this.max
    }

    setMax(max: number) {
        this.max = max
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
