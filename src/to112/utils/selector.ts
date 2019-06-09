import { CharReader } from '../../utils/char_reader'
import { UpdaterTo113 as Updater } from '../../to113/updater'
import { NbtCompound } from '../../utils/nbt/nbt'
import Entities from '../../to113/mappings/entities'

/**
 * Represent a target selector.
 * Provides methods to operate it.
 * @author SPGoding
 */
export class Selector112 {
    private variable: 'a' | 'e' | 'p' | 'r' | 's'
    private dx: number
    private dy: number
    private dz: number
    private limit: number
    private x: number
    private y: number
    private z: number
    private sort: string
    private readonly tag: string[] = []
    private readonly team: string[] = []
    private readonly name: string[] = []
    private readonly type: string[] = []
    private readonly gamemode: string[] = []
    private readonly level = new Range(null, null)
    private readonly distance = new Range(null, null)
    private readonly x_rotation = new Range(null, null)
    private readonly y_rotation = new Range(null, null)
    private readonly scores = new Map<string, Range>()
    private readonly advancements = new Map<string, boolean | Map<string, boolean>>()
    private readonly nbt = new NbtCompound()

    constructor() {}

    /**
     * Parses this selector according to a string in 1.12.
     * @param str An string representing a target selector.
     */
    public parse(str: string) {
        const charReader = new CharReader(str)
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
     * Gets a string that can represent this target selector in 1.13.
     */
    public to113() {
        let result = `@${this.variable}`

        result += '['

        result = this.getProperties(result)

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
            const sel = new Selector112()
            sel.parse(input)
        } catch (ignored) {
            return false
        }
        return true
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
                    this.parseScore(key, val)
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
                                this.gamemode.push(new Updater().upSpgodingGamemode(val))
                            } else {
                                this.gamemode.push('!' + new Updater().upSpgodingGamemode(val.slice(1)))
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

    private getProperties(result: string) {
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
        if ((tmp = this.getScores())) {
            result += `scores=${tmp},`
        }
        if ((tmp = this.getAdvancements())) {
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

    private parseScore(key: string, val: string) {
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

    private getScores() {
        let result = '{'

        for (const i of this.scores.keys()) {
            const score = this.scores.get(i)
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

    private getAdvancements() {
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
        const arr = str.split('..')
        if (arr.length === 2) {
            this.min = arr[0] ? Number(arr[0]) : null
            this.max = arr[1] ? Number(arr[1]) : null
        } else {
            this.min = this.max = Number(arr[0])
        }
    }

    get1_13() {
        const min = this.min
        const max = this.max
        if (min !== null && max !== null) {
            if (min !== max) {
                return `${min}..${max}`
            } else {
                return `${min}`
            }
        } else if (min !== null) {
            return `${min}..`
        } else if (max !== null) {
            return `..${max}`
        } else {
            return ''
        }
    }
}
