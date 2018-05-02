import CharReader from './char_reader'
import Converter from './converter'
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
    private advancements: Map<string, boolean>
    private ranges: Map<string, Range>

    constructor() {}

    parse112(str: string) {
        let charReader = new CharReader(str)
        let char: string

        this.properties = new Map<string, any>()
        this.scores = new Map<string, Range>()
        this.advancements = new Map<string, boolean>()
        this.ranges = new Map<string, Range>()

        char = charReader.next()
        if (char !== '@') {
            console.log(`First char should be '@': ${str}`)
            return
        }

        char = charReader.next()
        switch (char) {
            case 'a':
                this.type = SelectorType.A
                this.properties.set('sort', 'nearest')
                break
            case 'e':
                this.type = SelectorType.E
                this.properties.set('sort', 'nearest')
                break
            case 'p':
                this.type = SelectorType.P
                break
            case 'r':
                this.type = SelectorType.R
                break
            case 's':
                this.type = SelectorType.S
                break
            default:
                console.log(`Unknown type: ${str}`)
                break
        }

        char = charReader.next()
        if (char === '') {
            return
        } else if (char === '[') {
            let key: string
            let val: string
            while (char !== ']') {
                key = ''
                val = ''
                char = charReader.next()
                while (char !== '=') {
                    // 读取key
                    if (isWhiteSpace(char)) {
                        continue
                    }
                    key += char
                    char = charReader.next()
                }


                char = charReader.next()
                while (char !== ',' && char !== ']' ) {
                    // 读取value
                    if (isWhiteSpace(char)) {
                        continue
                    }
                    val += char 
                    char = charReader.next()
                }

                if (key.length > 6 && key.slice(0, 6) === 'score_') {
                    // 特殊处理score
                    let objective: string
                    if (key.slice(-4) === '_min') {
                        // 最小值
                        objective = key.slice(6, -4)
                        if (this.scores.has(objective)) {
                            // map里已经存了这个记分项，补全
                            this.scores.get(objective).setMin(Number(val))
                        } else {
                            // map里没这个记分项，创建
                            this.scores.set(objective, new Range(Number(val), null))
                        }
                    } else {
                        // 最大值
                        objective = key.slice(6)
                         if (this.scores.has(objective)) {
                            // map里已经存了这个记分项，补全
                            this.scores.get(objective).setMax(Number(val))
                        } else {
                            // map里没这个记分项，创建
                            this.scores.set(objective, new Range(null, Number(val)))
                        }
                    }
                } else {
                    // 其他属性
                    switch (key) {
                        // 无变化
                        case 'dx':
                        case 'dy':
                        case 'dz':
                        case 'tag':
                        case 'team':
                        case 'name':
                        case 'type':
                            this.properties.set(key, val)
                            break
                        // 重命名
                        case 'c':
                            if (Number(val) >= 0) {
                                this.properties.set('limit', val)
                            } else {
                                this.properties.set('sort', 'furthest')
                                this.properties.set('limit', (-Number(val)).toString())
                            }
                            break
                        case 'm':
                            this.properties.set('gamemode', Converter.gamemode(val))
                            break
                        // range且重命名
                        case 'l':
                            this.setRangeMax('level', val)
                            break
                        case 'lm': 
                            this.setRangeMin('level', val)
                            break
                        case 'r': 
                            this.setRangeMax('distance', val)
                            break
                        case 'rm': 
                            this.setRangeMin('distance', val)
                            break
                        case 'rx': 
                            this.setRangeMax('x_rotation', val)
                            break
                        case 'rxm': 
                            this.setRangeMin('x_rotation', val)
                            break
                        case 'ry': 
                            this.setRangeMax('y_rotation', val)
                            break
                        case 'rym': 
                            this.setRangeMin('y_rotation', val)
                            break
                        // 中心对正
                        case 'x':
                        case 'y':
                        case 'z':
                            if (val.indexOf('.') === -1) {
                                val += '.5'
                            }
                            this.properties.set(key, val)
                            break
                    }
                }
            }
        } else {
            console.log(`Unexpected token: ${str}`)
        }
    }

    get113() {
        let result = '@'

        switch (this.type) {
            // 类型
            case SelectorType.A:
                result += 'a'
                break
            case SelectorType.E:
                result += 'e'
                break
            case SelectorType.P:
                result += 'p'
                break
            case SelectorType.R:
                result += 'r'
                break
            case SelectorType.S:
                result += 's'
                break
        }

        result += '['

        if (this.properties.size !== 0) {
            // 普通属性
            for (const key of this.properties.keys()) {
                let val = this.properties.get(key)
                result += `${key}=${val},`
            }
        }

        if (this.ranges.size !== 0) {
            // range属性
            for (const key of this.ranges.keys()) {
                let range = this.ranges.get(key)
                result += `${key}=${range.toString()},`
            }
        }

        if (this.scores.size !== 0) {
            result += 'scores={'
            // 分数
            for (const objective of this.scores.keys()) {
                let range = this.scores.get(objective)
                result += `${objective}=${range.toString()},`
            }
            result = result.slice(0, -1) + '},'
        }

        if (this.advancements.size !== 0) {
            // 进度 TODO
        }

        // NBT TODO
        
        // 完美闭合选择器
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + ']'
        } else if (result.slice(-1) === '[') {
            result = result.slice(0, -1)
        }
        
        return result
    }

    private setRangeMin(key: string, min: string) {
        if (this.ranges.has(key)) {
            this.ranges.get(key).setMin(Number(min))
        } else {
            this.ranges.set(key, new Range(Number(min), null))
        }
    }

    private setRangeMax(key: string, max: string) {
        if (this.ranges.has(key)) {
            this.ranges.get(key).setMax(Number(max))
        } else {
            this.ranges.set(key, new Range(null, Number(max)))
        }
    }
}

enum SelectorType {
    A, E, P, R, S
}

class Range {
    private min: number | null
    private max: number | null

    getMin() {
        return this.min
    }

    setMin(min: number | null) {
        this.min = min
    }

    getMax() {
        return this.max
    }

    setMax(max: number | null) {
        this.max = max
    }

    constructor(min: number | null, max: number | null) {
        this.max = max
        this.min = min
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

    toString() {
        let min = this.min
        let max = this.max
        if (min && max) {
            if (min !== max) {
                return `${min}..${max}`
            } else {
                return `${min}`
            }
        } else if (min) {
            return `${min}..`
        } else if (max) {
            return `..${max}`
        } else {
            console.log(`NullPointerException at Range!`)
            return ''
        }
    }
}
