import CharReader from '../utils/char_reader'
import Updater from './updater'
import { isWhiteSpace, getNbt } from '../utils/utils'
import { NbtCompound } from '../utils/nbt/nbt'
import Entities from './mappings/entities';

/**
 * Represent a target selector.
 * Provides methods to operate it.
 * @author SPGoding
 */
export default class Selector {
    private variable: 'a' | 'e' | 'p' | 'r' | 's'
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

    constructor() { }

    /**
     * Parses this selector according to a string in 1.12.
     * @param str An string representing a target selector.
     */
    public parse112(str: string) {
        let charReader = new CharReader(str)
        let char: string

        char = charReader.next()
        if (char !== '@') {
            throw `First char should be '@': ${str}`
        }

        char = charReader.next()
        this.parseVariable(char, str)

        char = charReader.next()
        this.parseProperties1_12(char, charReader, str)
    }

    /**
     * Parses this selector according to a string in 1.13.
     * @param str An string representing a target selector.
     */
    public parse113(str: string) {
        let charReader = new CharReader(str)
        let char: string

        char = charReader.next()
        if (char !== '@') {
            throw `First char should be '@': ${str}`
        }

        char = charReader.next()
        this.parseVariable(char, str)

        char = charReader.next()
        this.parseProperties1_13(char, charReader, str)
    }

    /**
     * Gets a string that can represent this target selector in 1.12.
     */
    public to112() {
        let result = '@'

        result = this.getVariable1_12(result)

        result += '['

        result = this.getProperties1_12(result)

        // Close the square brackets.
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + ']'
        } else if (result.slice(-1) === '[') {
            result = result.slice(0, -1)
        }

        return result
    }

    /**
     * Gets a string that can represent this target selector in 1.13.
     */
    public to113() {
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
            if (['a', 'e', 'p', 'r', 's', ']'].indexOf(input.slice(-1)) === -1) {
                return false
            }
            let sel = new Selector()
            sel.parse112(input)
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

    public setNbt(nbt: string) {
        this.nbt = getNbt(nbt)
    }

    public setLimit() {
        if (this.variable === 'a' || this.variable === 'e') {
            this.limit = 1
        }
    }

    private parseVariable(char: string, str: string) {
        switch (char) {
            case 'a':
            case 'e':
            case 'p':
            case 'r':
            case 's':
                this.variable = char
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
                //char = charReader.next()
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
                            if (this.variable === 'r') {
                                this.variable = 'e'
                                this.sort = 'random'
                                if (this.limit === undefined) {
                                    this.limit = 1
                                }
                            }
                            this.type.push(Entities.to113(val))
                            break
                        case 'c':
                            if (Number(val) >= 0) {
                                if (this.sort !== 'random' && this.variable !== 'r') {
                                    this.sort = 'nearest'
                                }
                                this.limit = Number(val)
                            } else {
                                if (this.sort !== 'random' && this.variable !== 'r') {
                                    this.sort = 'furthest'
                                }
                                this.limit = -Number(val)
                            }
                            break
                        case 'm':
                            if (val.slice(0, 1) !== '!') {
                                this.gamemode.push(Updater.upGamemode(val))
                            } else {
                                this.gamemode.push('!' + Updater.upGamemode(val.slice(1)))
                            }
                            break
                        case 'l':
                            this.level.setMax(Number(val))
                            break
                        case 'lm':
                            this.level.setMin(Number(val))
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
                        case '':
                            return
                        default:
                            throw `Unknown selector key: ${key}`
                    }
                }
            }
        } else {
            throw `Unexpected token: ${str}`
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
                    case 'sort':
                        this.sort = val
                        break
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
                        // FIXME: NBT reading error, for , .
                        this.nbt = getNbt(val)
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

    private getVariable1_12 = (result: string) => (result += this.variable)
    private getVariable1_13 = (result: string) => (result += this.variable)

    private getProperties1_12(result: string) {
        if (this.dx !== undefined) {
            result += `dx=${this.dx},`
        }
        if (this.dy !== undefined) {
            result += `dy=${this.dy},`
        }
        if (this.dz !== undefined) {
            result += `dz=${this.dz},`
        }
        if (this.limit !== undefined) {
            if (this.sort === 'furthest') {
                result += `c=-${this.limit},`
            } else {
                result += `c=${this.limit},`
            }
        }
        if (this.x !== undefined) {
            result += `x=${this.x},`
        }
        if (this.y !== undefined) {
            result += `y=${this.y},`
        }
        if (this.z !== undefined) {
            result += `z=${this.z},`
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
            result += `m=${i},`
        }
        let tmp
        if ((tmp = this.level.getMax())) {
            result += `l=${tmp},`
        }
        if ((tmp = this.level.getMin())) {
            result += `lm=${tmp},`
        }
        if ((tmp = this.distance.getMax())) {
            result += `r=${tmp},`
        }
        if ((tmp = this.distance.getMin())) {
            result += `rm=${tmp},`
        }
        if ((tmp = this.x_rotation.getMax())) {
            result += `rx=${tmp},`
        }
        if ((tmp = this.x_rotation.getMin())) {
            result += `rxm=${tmp},`
        }
        if ((tmp = this.y_rotation.getMax())) {
            result += `ry=${tmp},`
        }
        if ((tmp = this.y_rotation.getMin())) {
            result += `rym=${tmp},`
        }
        if ((tmp = this.getScores1_12())) {
            result += `scores=${tmp},`
        }
        if (this.sort === 'random') {
            result = `@r${result.slice(2)}`
        }
        return result
    }
    private getProperties1_13(result: string) {
        if (this.dx !== undefined) {
            result += `dx=${this.dx},`
        }
        if (this.dy !== undefined) {
            result += `dy=${this.dy},`
        }
        if (this.dz !== undefined) {
            result += `dz=${this.dz},`
        }
        if (this.limit !== undefined) {
            result += `limit=${this.limit},`
        }
        if (this.x !== undefined) {
            result += `x=${this.x},`
        }
        if (this.y !== undefined) {
            result += `y=${this.y},`
        }
        if (this.z !== undefined) {
            result += `z=${this.z},`
        }
        if (this.sort !== undefined) {
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
        let tmp
        if ((tmp = this.level.get1_13())) {
            result += `level=${tmp},`
        }
        if ((tmp = this.distance.get1_13())) {
            result += `distance=${this.distance.get1_13()},`
        }
        if ((tmp = this.x_rotation.get1_13())) {
            result += `x_rotation=${tmp},`
        }
        if ((tmp = this.y_rotation.get1_13())) {
            result += `y_rotation=${tmp},`
        }
        if ((tmp = this.getScores1_13())) {
            result += `scores=${tmp},`
        }
        if ((tmp = this.getAdvancements1_13())) {
            result += `advancements=${tmp},`
        }
        if ((tmp = this.nbt.toString()) !== '{}') {
            result += `nbt=${tmp},`
        }
        return result
    }

    public setScore(objective: string, value: string, type: 'max' | 'min') {
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
            default:
                if (range) {
                    range.setMin(Number(value))
                } else {
                    range = new Range(Number(value), null)
                    this.scores.set(objective, range)
                }
                break
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

    private getScores1_12() {
        let result = ''

        for (const i of this.scores.keys()) {
            let score = this.scores.get(i)
            if (score && score.getMax() !== null) {
                result += `score_${i}=${score.getMax()},`
            }
            if (score && score.getMin() !== null) {
                result += `score_${i}_min=${score.getMin()},`
            }
        }

        return result
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
        if (min !== null && max !== null) {
            if (min !== max) {
                return `${min}..${max}`
            } else {
                return `${min}`
            }
        } else if (min !== null ) {
            return `${min}..`
        } else if (max !== null ) {
            return `..${max}`
        } else {
            return ''
        }
    }
}
