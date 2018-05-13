import CharReader from './char_reader'
import Converter from './converter'
import { isWhiteSpace } from './char_reader'

/**
 * Represent a target selector.
 * Provides methods to operate it.
 * @author SPGoding
 */
export default class TargetSelector {
    private variable: SelectorType
    private dx: number
    private dy: number
    private dz: number
    private limit: number
    private x: number
    private y: number
    private z: number
    private sort: string
    private tag: string[]
    private team: string[]
    private name: string[]
    private type: string[]
    private gamemode: string[]
    private level = new Range(null, null)
    private distance = new Range(null, null)
    private x_rotation = new Range(null, null)
    private y_rotation = new Range(null, null)
    private scores: Map<string, Range>
    private advancements: Map<string, boolean>

    constructor() {}

    /**
     * Parses this selector according to a string in 1.12.
     * @param str An string representing a target selector.
     */
    parse112(str: string) {
        let charReader = new CharReader(str)
        let char: string

        char = charReader.next()
        if (char !== '@') {
            throw `First char should be '@': ${str}`
        }

        char = charReader.next()
        switch (char) {
            case 'a':
                this.variable = SelectorType.A
                this.sort = 'nearest'
                break
            case 'e':
                this.variable = SelectorType.E
                this.sort = 'nearest'
                break
            case 'p':
                this.variable = SelectorType.P
                break
            case 'r':
                this.variable = SelectorType.R
                break
            case 's':
                this.variable = SelectorType.S
                break
            default:
                throw `Unknown variable: ${char} in ${str}`
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
                    // Read key.
                    if (isWhiteSpace(char)) {
                        continue
                    }
                    key += char
                    char = charReader.next()
                }

                char = charReader.next()
                while (char !== ',' && char !== ']' ) {
                    // Read value.
                    if (isWhiteSpace(char)) {
                        continue
                    }
                    val += char 
                    char = charReader.next()
                }

                if (key.length > 6 && key.slice(0, 6) === 'score_') {
                    // Deal with scores.
                    let objective: string
                    if (key.slice(-4) === '_min') {
                        // The min.
                        objective = key.slice(6, -4)
                        this.setScoreMin(objective, val)
                    } else {
                        // The max.
                        objective = key.slice(6)
                        this.setScoreMax(objective, val)
                    }
                } else {
                    // Deal with normal properties.
                    switch (key) {
                        case 'dx':
                            this.dx = Number(val)
                            break
                        case 'dy':
                            this.dy = Number(val)
                            break
                        case 'dz':
                            this.dz = Number(val)
                            break
                        case 'tag':
                            this.tag.push(val)
                            break
                        case 'team':
                            this.team.push(val)
                            break
                        case 'name':
                            this.name.push(val)
                            break
                        case 'type':
                            this.type.push(val)
                            break
                        case 'c':
                            if (Number(val) >= 0) {
                                this.limit = Number(val)
                            } else {
                                this.sort = 'furthest'
                                this.limit = -Number(val)
                            }
                            break
                        case 'm':
                            this.gamemode.push(Converter.cvtGamemode(val))
                            break
                        case 'l':
                            this.level.setMax(Number(val))
                            break
                        case 'lm': 
                            this.level.setMax(Number(val))
                            break
                        case 'r': 
                            this.setMax('distance', val)
                            break
                        case 'rm': 
                            this.setRange('distance', val)
                            break
                        case 'rx': 
                            this.setMax('x_rotation', val)
                            break
                        case 'rxm': 
                            this.setRange('x_rotation', val)
                            break
                        case 'ry': 
                            this.setMax('y_rotation', val)
                            break
                        case 'rym': 
                            this.setRange('y_rotation', val)
                            break
                        // These are properties that need to center correct.
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
            throw `Unexpected token: ${str}`
        }
    }
    
    /**
     * Parses this selector according to a string in 1.13.
     * @param str An string representing a target selector.
     */
    parse113(str: string) {
        let charReader = new CharReader(str)
        let char: string

        char = charReader.next()
        if (char !== '@') {
            throw `First char should be '@': ${str}`
        }

        char = charReader.next()
        switch (char) {
            case 'a':
                this.variable = SelectorType.A
                break
            case 'e':
                this.variable = SelectorType.E
                break
            case 'p':
                this.variable = SelectorType.P
                break
            case 'r':
                this.variable = SelectorType.R
                break
            case 's':
                this.variable = SelectorType.S
                break
            default:
                throw `Unknown type: ${char} in ${str}`
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
                    // Read key.
                    if (isWhiteSpace(char)) {
                        continue
                    }
                    key += char
                    char = charReader.next()
                }

                char = charReader.next()
                while (char !== ',' && char !== ']' ) {
                    // Read value.
                    if (isWhiteSpace(char)) {
                        continue
                    }
                    val += char 
                    char = charReader.next()
                }

                if (key === 'scores') {
                    // Deal with scores.
                    this.setScores(val)
                } else {
                    // Deal with normal properties.
                    switch (key) {
                        // These are properties that don't need to change.
                        case 'dx':
                        case 'dy':
                        case 'dz':
                        case 'tag':
                        case 'team':
                        case 'name':
                        case 'type':
                            this.properties.set(key, val)
                            break
                        // These are properties that need to rename.
                        case 'c':
                            if (Number(val) >= 0) {
                                this.properties.set('limit', val)
                            } else {
                                this.properties.set('sort', 'furthest')
                                this.properties.set('limit', (-Number(val)).toString())
                            }
                            break
                        case 'm':
                            this.properties.set('gamemode', Converter.cvtGamemode(val))
                            break
                        // These are properties that need to change to range and rename.
                        case 'l':
                            this.setMax('level', val)
                            break
                        case 'lm': 
                            this.setRange('level', val)
                            break
                        case 'r': 
                            this.setMax('distance', val)
                            break
                        case 'rm': 
                            this.setRange('distance', val)
                            break
                        case 'rx': 
                            this.setMax('x_rotation', val)
                            break
                        case 'rxm': 
                            this.setRange('x_rotation', val)
                            break
                        case 'ry': 
                            this.setMax('y_rotation', val)
                            break
                        case 'rym': 
                            this.setRange('y_rotation', val)
                            break
                        // These are properties that need to center correct.
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
            throw `Unexpected token: ${str}`
        }
    }

    /**
     * Gets a string that can represent this target selector in 1.13.
     */
    get113() {
        let result = '@'

        switch (this.variable) {
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
            // Deal with normal properties.
            for (const key of this.properties.keys()) {
                let val = this.properties.get(key)
                result += `${key}=${val},`
            }
        }

        if (this.ranges.size !== 0) {
            // Deal with ranges.
            for (const key of this.ranges.keys()) {
                let range = this.ranges.get(key)
                result += `${key}=${range.toString()},`
            }
        }

        if (this.scores.size !== 0) {
            result += 'scores={'
            // Deal with scores
            for (const objective of this.scores.keys()) {
                let range = this.scores.get(objective)
                result += `${objective}=${range.toString()},`
            }
            result = result.slice(0, -1) + '},'
        }

        if (this.advancements.size !== 0) {
            // Deal with advancements.
            // TODO
        }

            // Deal with NBT.
            // TODO
        
        // Close the square brackets.
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + ']'
        } else if (result.slice(-1) === '[') {
            result = result.slice(0, -1)
        }
        
        return result
    }

    /**
     * Returns if a target selector is valid.
     * @param input a target selector.
     */
    static isValid(input: string) {
        try {
            let sel = new TargetSelector()
            sel.parse112(input)
        } catch(ignored) {
            return false
        }
        return true
    }

    /**
     * 
     * @param key 
     * @param type 
     * @param val 
     * @example this.setRange(this.distance, 'max', 10)
     */
    private setRange(key: any, type: string, val: number) {
        if (!key) {
            key = new Range(null, null)
        }
    }

    private setScoreMin(objective: string, min: string) {
        if (this.scores.has(objective)) {
            // The 'scores' map has this objective, so complete it.
            this.scores.get(objective).setMin(Number(min))
        } else {
            // The 'scores' map doesn't have this objective, so create it.
            this.scores.set(objective, new Range(Number(min), null))
        }
    }

    private setScoreMax(objective: string, max: string) {
        if (this.scores.has(objective)) {
            // The 'scores' map has this objective, so complete it.
            this.scores.get(objective).setMax(Number(max))
        } else {
            // The 'scores' map doesn't have this objective, so create it.
            this.scores.set(objective, new Range(null, Number(max)))
        }
    }

    /**
     * Sets the 'scores' field with a string.
     * @param str The value of 'scores' in target selector in 1.13.
     * @example
     * this.setScores('{}')
     * this.setScores('{foo=1,bar=1..5,fuck=2..,me=..10}')
     */
    private setScores(str: string) {
        let charReader = new CharReader(str)
        let char = charReader.next()

        if (char !== '{') {
            throw `Unexpected 'scores' value begins: ${char} at ${str}.`
        }


    }
}

enum SelectorType {
    A, E, P, R, S
}

/**
 * Represents a range in a target selector.
 */
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
            return ''
        }
    }
}
