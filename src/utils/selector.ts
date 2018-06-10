import CharReader from './char_reader'
import Converter from '../converter'
import { isWhiteSpace } from './utils'
import { NbtCompound } from './nbt/nbt'

/**
 * Represent a target selector.
 * Provides methods to operate it.
 * @author SPGoding
 */
export default class Selector {
    private variable: SelectorVariable
    private dx: number
    private dy: number
    private dz: number
    private limit: number
    private x: number
    private y: number
    private z: number
    private sort: string
    private tag: string[] = []
    private team: string[] = []
    private name: string[] = []
    private type: string[] = []
    private gamemode: string[] = []
    private level = new Range(null, null)
    private distance = new Range(null, null)
    private x_rotation = new Range(null, null)
    private y_rotation = new Range(null, null)
    private scores = new Map<string, Range>()
    private advancements = new Map<string, boolean | Map<string, boolean>>()
    private nbt = new NbtCompound()

    constructor() {}

    /**
     * Parses this selector according to a string in 1.12.
     * @param str An string representing a target selector.
     */
    public parse1_12(str: string) {
        let charReader = new CharReader(str)
        let char: string

        char = charReader.next()
        if (char !== '@') {
            throw `First char should be '@': ${str}`
        }

        char = charReader.next()
        this.parseVariable1_12(char, str)

        char = charReader.next()
        this.parseProperties1_12(char, charReader, str)
    }

    /**
     * Parses this selector according to a string in 1.13.
     * @param str An string representing a target selector.
     */
    public parse1_13(str: string) {
        let charReader = new CharReader(str)
        let char: string

        char = charReader.next()
        if (char !== '@') {
            throw `First char should be '@': ${str}`
        }

        char = charReader.next()
        this.parseVariable1_13(char, str)

        char = charReader.next()
        this.parseProperties1_13(char, charReader, str)
    }

    /**
     * Gets a string that can represent this target selector in 1.13.
     */
    public get1_13() {
        let result = '@'

        result = this.getVariable1_13(result)

        result += '['

        result = this.getProperties1_13(result)

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
    public static isValid(input: string) {
        try {
            let sel = new Selector()
            sel.parse1_12(input)
        } catch (ignored) {
            return false
        }
        return true
    }

    public addFinishedAdvancement(adv: string, crit?: string) {
        if (crit) {
            if (this.advancements.has(adv)) {
                let val = this.advancements.get(adv)
                if (typeof val === 'boolean') {
                    // The adv has a boolean value, doesn't need to add a crit.
                    return
                } else {
                    if (!val) {
                        val = new Map<string, boolean>()
                    }
                    val.set(crit, true)
                }
            } else {
                this.advancements.set(adv, new Map([[crit, true]]))
            }
        } else {
            this.advancements.set(adv, true)
        }
    }

    private parseVariable1_12(char: string, str: string) {
        switch (char) {
            case 'a':
                this.variable = SelectorVariable.A
                this.sort = 'nearest'
                break
            case 'e':
                this.variable = SelectorVariable.E
                this.sort = 'nearest'
                break
            case 'p':
                this.variable = SelectorVariable.P
                break
            case 'r':
                // In 1.13, @r doesn't support 'type', so I used '@e[sort=random]'.
                this.variable = SelectorVariable.E
                this.sort = 'random'
                break
            case 's':
                this.variable = SelectorVariable.S
                break
            default:
                throw `Unknown variable: ${char} in ${str}`
        }
    }

    private parseProperties1_12(char: string, charReader: CharReader, str: string) {
        if (!char) {
            return
        }

        if (char === '[') {
            let key: string
            let val: string
            while (char) {
                char = charReader.next()
                key = charReader.readUntil(['='])
                char = charReader.next()
                val = charReader.readUntil([',', ']'])
                char = charReader.next()

                if (key.length > 6 && key.slice(0, 6) === 'score_') {
                    // Deal with scores.
                    this.parseScore1_12(key, val)
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
                                if (this.sort !== 'random') {
                                    this.sort = 'furthest'
                                }
                                this.limit = -Number(val)
                            }
                            break
                        case 'm':
                            this.gamemode.push(Converter.cvtMode(val))
                            break
                        case 'l':
                            this.level.setMax(Number(val))
                            break
                        case 'lm':
                            this.level.setMax(Number(val))
                            break
                        case 'r':
                            this.distance.setMax(Number(val))
                            break
                        case 'rm':
                            this.distance.setMin(Number(val))
                            break
                        case 'rx':
                            this.x_rotation.setMax(Number(val))
                            break
                        case 'rxm':
                            this.x_rotation.setMin(Number(val))
                            break
                        case 'ry':
                            this.y_rotation.setMax(Number(val))
                            break
                        case 'rym':
                            this.y_rotation.setMin(Number(val))
                            break
                        case 'x':
                        case 'y':
                        case 'z':
                            // Center correct.
                            if (val.indexOf('.') === -1) {
                                val += '.5'
                            }
                            switch (key) {
                                case 'x':
                                    this.x = Number(val)
                                    break
                                case 'y':
                                    this.y = Number(val)
                                    break
                                case 'z':
                                    this.z = Number(val)
                                    break
                                default:
                                    break
                            }
                            break
                        default:
                            break
                    }
                }
            }
        } else {
            throw `Unexpected token: ${str}`
        }
    }

    private parseVariable1_13(char: string, str: string) {
        switch (char) {
            case 'a':
                this.variable = SelectorVariable.A
                break
            case 'e':
                this.variable = SelectorVariable.E
                break
            case 'p':
                this.variable = SelectorVariable.P
                break
            case 'r':
                this.variable = SelectorVariable.R
                break
            case 's':
                this.variable = SelectorVariable.S
                break
            default:
                throw `Unknown variable: ${char} in ${str}`
        }
    }

    private parseProperties1_13(char: string, charReader: CharReader, str: string) {
        if (char === '') {
            return
        } else if (char === '[') {
            let key: string
            let val: string
            while (char !== ']') {
                key = ''
                val = ''
                char = charReader.next()
                key = charReader.readUntil(['='])
                char = charReader.next()
                let depth = 0
                while (depth !== 0 || (char !== ',' && char !== ']')) {
                    // Read value.
                    if (isWhiteSpace(char)) {
                        char = charReader.next()
                        continue
                    }
                    if (char === '{' || char === '[') {
                        depth += 1
                    } else if (char === '}' || char === ']') {
                        depth -= 1
                    }
                    val += char
                    char = charReader.next()
                }

                // Deal with normal properties.
                let range: Range
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
                    case 'gamemode':
                        this.gamemode.push(val)
                        break
                    case 'limit':
                        this.limit = Number(val)
                        break
                    case 'level':
                        range = new Range(null, null)
                        range.parse1_13(val)
                        this.level = range
                        break
                    case 'distance':
                        range = new Range(null, null)
                        range.parse1_13(val)
                        this.distance = range
                        break
                    case 'x_rotation':
                        range = new Range(null, null)
                        range.parse1_13(val)
                        this.x_rotation = range
                        break
                    case 'y_rotation':
                        range = new Range(null, null)
                        range.parse1_13(val)
                        this.y_rotation = range
                        break
                    case 'x':
                        this.x = Number(val)
                        break
                    case 'y':
                        this.y = Number(val)
                        break
                    case 'z':
                        this.z = Number(val)
                        break
                    case 'scores':
                        this.parseScores1_13(val)
                        break
                    case 'advancements':
                        this.parseAdvancements1_13(val)
                        break
                    case 'nbt':
                        // TODO:
                        break
                    default:
                        break
                }
            }
        } else {
            throw `Unexpected token: ${str}`
        }
    }

    private parseAdvancements1_13(val: string) {
        let charReader = new CharReader(val)
        let char = charReader.next()
        let adv: string
        let crit: string
        let bool: string
        let map: Map<string, boolean>

        if (char !== '{') {
            throw `Advancements should start with '{', but get '${char}' at '${val}'`
        }

        char = charReader.next()

        if (char === '}') {
            return
        }

        while (char) {
            adv = ''
            bool = ''

            adv = charReader.readUntil(['='])

            char = charReader.next()

            if (char === '{') {
                map = new Map<string, boolean>()
                while (char !== '}') {
                    char = charReader.next()

                    crit = ''
                    bool = ''

                    crit = charReader.readUntil(['='])
                    char = charReader.next()
                    bool = charReader.readUntil(['}', ','])
                    // Correct the char of 'char'. FIXME: Historical issues.
                    charReader.back()
                    char = charReader.next()

                    map.set(crit, Boolean(bool))
                }
                this.advancements.set(adv, map)
            } else {
                bool = charReader.readUntil(['}', ','])
                // Correct the char of 'char'. FIXME: Historical issues.
                charReader.back()
                char = charReader.next()
            }

            char = charReader.next()
            this.advancements.set(adv, Boolean(bool))
        }
    }

    private getVariable1_13(result: string) {
        switch (this.variable) {
            case SelectorVariable.A:
                result += 'a'
                break
            case SelectorVariable.E:
                result += 'e'
                break
            case SelectorVariable.P:
                result += 'p'
                break
            case SelectorVariable.R:
                result += 'r'
                break
            case SelectorVariable.S:
                result += 's'
                break
        }
        return result
    }

    private getProperties1_13(result: string) {
        if (this.dx) {
            result += `dx=${this.dx},`
        }
        if (this.dy) {
            result += `dy=${this.dy},`
        }
        if (this.dz) {
            result += `dz=${this.dz},`
        }
        if (this.limit) {
            result += `limit=${this.limit},`
        }
        if (this.x) {
            result += `x=${this.x},`
        }
        if (this.y) {
            result += `y=${this.y},`
        }
        if (this.z) {
            result += `z=${this.z},`
        }
        if (this.sort) {
            result += `sort=${this.sort},`
        }
        for (const i of this.tag) {
            result += `tag=${i},`
        }
        for (const i of this.team) {
            result += `team=${i},`
        }
        for (const i of this.name) {
            result += `name=${i},`
        }
        for (const i of this.type) {
            result += `type=${i},`
        }
        for (const i of this.gamemode) {
            result += `gamemode=${i},`
        }
        let tmp = this.level.get1_13()
        if (tmp) {
            result += `level=${tmp},`
        }
        tmp = this.distance.get1_13()
        if (this.distance.get1_13()) {
            result += `distance=${this.distance.get1_13()},`
        }
        tmp = this.x_rotation.get1_13()
        if (tmp) {
            result += `x_rotation=${tmp},`
        }
        tmp = this.y_rotation.get1_13()
        if (tmp) {
            result += `y_rotation=${tmp},`
        }
        tmp = this.getScores1_13()
        if (tmp) {
            result += `scores=${tmp},`
        }
        tmp = this.getAdvancements1_13()
        if (tmp) {
            result += `advancements=${tmp},`
        }
        return result
    }

    private setScore(objective: string, value: string, type: string) {
        let range = this.scores.get(objective)
        switch (type) {
            case 'max':
                if (range) {
                    // The 'scores' map has this objective, so complete it.
                    range.setMax(Number(value))
                } else {
                    // The 'scores' map dosen't have this objective, so create it.
                    range = new Range(null, Number(value))
                    this.scores.set(objective, range)
                }
                break
            case 'min':
                if (range) {
                    range.setMin(Number(value))
                } else {
                    range = new Range(Number(value), null)
                    this.scores.set(objective, range)
                }
                break
            default:
                throw `Unknown type: ${type}. Expected 'max' or 'min'`
        }
    }

    private parseScore1_12(key: string, val: string) {
        // Deal with scores.
        let objective: string
        if (key.slice(-4) === '_min') {
            // The min.
            objective = key.slice(6, -4)
            this.setScore(objective, val, 'min')
        } else {
            // The max.
            objective = key.slice(6)
            this.setScore(objective, val, 'max')
        }
    }

    /**
     * Sets the 'scores' field with a string.
     * @param str The value of 'scores' in target selector in 1.13.
     * @example
     * this.parseScores1_13('{}')
     * this.parseScores1_13('{foo=1,bar=1..5,fuck=2..,me=..10}')
     */
    private parseScores1_13(str: string) {
        let charReader = new CharReader(str)
        let char = charReader.next()
        let objective: string
        let rangeStr: string
        let range: Range

        if (char !== '{') {
            throw `Unexpected 'scores' value begins: ${char} at ${str}.`
        }

        char = charReader.next()

        while (char) {
            objective = ''
            rangeStr = ''
            range = new Range(null, null)

            objective = charReader.readUntil(['='])

            char = charReader.next()

            rangeStr = charReader.readUntil([',', '}'])

            char = charReader.next()

            range.parse1_13(rangeStr)
            this.scores.set(objective, range)
        }
    }

    private getScores1_13() {
        let result = '{'

        for (const i of this.scores.keys()) {
            let score = this.scores.get(i)
            if (score) {
                result += `${i}=${score.get1_13()},`
            }
        }

        // Close the flower brackets.
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + '}'
        } else if (result.slice(-1) === '{') {
            result = result.slice(0, -1)
        }

        return result
    }

    private getAdvancements1_13() {
        let result = '{'

        for (const i of this.advancements.keys()) {
            const val = this.advancements.get(i)
            if (typeof val === 'boolean') {
                result += `${i}=${val},`
            } else if (val && typeof val === 'object') {
                result += `${i}={`
                for (const j of val.keys()) {
                    result += `${j}=${val.get(j)},`
                }
                result = result.slice(0, -1) + '},'
            }
        }

        // Close the flower brackets.
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + '}'
        } else if (result.slice(-1) === '{') {
            result = result.slice(0, -1)
        }

        return result
    }
}

enum SelectorVariable {
    A,
    E,
    P,
    R,
    S
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

    parse1_13(str: string) {
        let arr = str.split('..')
        if (arr.length === 2) {
            this.min = arr[0] ? Number(arr[0]) : null
            this.max = arr[1] ? Number(arr[1]) : null
        } else {
            this.min = this.max = Number(arr[0])
        }
    }

    get1_13() {
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
