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
    private c: number
    private x: number
    private y: number
    private z: number
    private tag: string
    private team: string
    private name: string
    private type: string
    private m: string
    private l: number
    private lm: number
    private r: number
    private rm: number
    private rx: number
    private rxm: number
    private ry: number
    private rym: number
    private scores = new Map<string, Range>()

    constructor() { }

    /**
     * Parses this selector according to a string in 1.9.
     * @param str An string representing a target selector.
     */
    public parse(str: string) {
        let charReader = new CharReader(str)
        let char: string

        char = charReader.next()
        if (char !== '@') {
            throw `First char should be '@': ${str}`
        }

        char = charReader.next()
        this.parseVariable(char, str)

        char = charReader.next()
        this.parseProperties(char, charReader, str)
    }

    /**
     * Gets a string that can represent this target selector in 1.12.
     */
    public to111() {
        let result = '@'

        result = this.getVariable111(result)

        result += '['

        result = this.getProperties111(result)

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
            sel.parse(input)
        } catch (ignored) {
            return false
        }
        return true
    }

    public getType() {
        return this.type
    }

    public setType(type: string) {
        this.type = type
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

    private parseProperties(char: string, charReader: CharReader, str: string) {
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
                    this.parseScore19(key, val)
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
                            this.tag = val
                            break
                        case 'team':
                            this.team = val
                            break
                        case 'name':
                            this.name = val
                            break
                        case 'type':
                            this.type = Entities.to111(val)
                            break
                        case 'c':
                            this.c = Number(val)
                            break
                        case 'm':
                            this.m = val
                            break
                        case 'l':
                            this.l = Number(val)
                            break
                        case 'lm':
                            this.lm = Number(val)
                            break
                        case 'r':
                            this.r = Number(val)
                            break
                        case 'rm':
                            this.rm = Number(val)
                            break
                        case 'rx':
                            this.rx = Number(val)
                            break
                        case 'rxm':
                            this.rxm = Number(val)
                            break
                        case 'ry':
                            this.ry = Number(val)
                            break
                        case 'rym':
                            this.rym = Number(val)
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

    private getVariable111 = (result: string) => (result += this.variable)

    private getProperties111(result: string) {
        if (this.dx !== undefined) {
            result += `dx=${this.dx},`
        }
        if (this.dy !== undefined) {
            result += `dy=${this.dy},`
        }
        if (this.dz !== undefined) {
            result += `dz=${this.dz},`
        }
        if (this.c !== undefined) {
            result += `c=${this.c},`
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
        if (this.l !== undefined) {
            result += `l=${this.l},`
        }
        if (this.lm !== undefined) {
            result += `lm=${this.lm},`
        }
        if (this.r !== undefined) {
            result += `r=${this.r},`
        }
        if (this.rm !== undefined) {
            result += `rm=${this.rm},`
        }
        if (this.rx !== undefined) {
            result += `rx=${this.rx},`
        }
        if (this.rxm !== undefined) {
            result += `rxm=${this.rxm},`
        }
        if (this.ry !== undefined) {
            result += `ry=${this.ry},`
        }
        if (this.rym !== undefined) {
            result += `rym=${this.rym},`
        }
        if (this.tag !== undefined) {
            result += `tag=${this.tag},`
        }
        if (this.team !== undefined) {
            result += `team=${this.team},`
        }
        if (this.name !== undefined) {
            result += `name=${this.name},`
        }
        if (this.type !== undefined) {
            result += `type=${this.type},`
        }
        if (this.m !== undefined) {
            result += `m=${this.m},`
        }
        let tmp
        if ((tmp = this.getScores111())) {
            result += `scores=${tmp},`
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

    private parseScore19(key: string, val: string) {
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

    private getScores111() {
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
}