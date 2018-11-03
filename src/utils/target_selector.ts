import { NbtCompound } from './nbt/nbt'
import { getNbtCompound } from './utils'

export class TargetSelector {
    public variable: string
    public tag: string[] = []
    public team: string[] = []
    public gamemode: string[] = []
    public name: string[] = []
    public type: string[] = []
    public distance: Range
    public level: Range
    public x_rotation: Range
    public y_rotation: Range
    public limit: string
    public x: string
    public y: string
    public z: string
    public dx: string
    public dy: string
    public dz: string
    public sort: string
    public advancements: Map<string, any> = new Map()
    public scores: Map<string, Range> = new Map()
    public nbt: NbtCompound

    constructor(input: string) {
        this.parseHead(input)
        this.parseArgument(input, 3)
    }

    private parseHead(input: string) {
        if (input.charAt(0) !== '@') {
            throw `Expected '@' at [0] but got '${input.charAt(0)}'.`
        }
        if (/^[aeprs]$/.test(input.charAt(1))) {
            this.variable = input.charAt(1)
        } else {
            throw `Expected '/^[aeprs]$/' at [1] but got '${input.charAt(1)}'.`
        }
        if (!/^$|^\[$/.test(input.charAt(2))) {
            // Neither empty nor open square bracket.
            throw `Expected '/^$|^\[$/' at [2] but got '${input.charAt(2)}'.`
        }
    }

    private parseArgument(input: string, index: number) {
        if (/^$|^\]$/.test(input.charAt(index))) {
            // Either empty or close square bracket.
            return
        }

        let key = ''
        while (input.charAt(index) !== '=') {
            key += input.charAt(index)
            index += 1
        }

        index += 1

        switch (key) {
            case 'scores':
                index = this.parseScores(input, index)
                break
            case 'advancements':
                index = this.parseAdvancements(input, index)
                break
            case 'nbt':
                index = this.parseNbt(input, index)
                break
            default:
                let value = ''
                while (!/^[\]|,]$/.test(input.charAt(index))) {
                    // Neither close square bracket nor comma
                    value += input.charAt(index)
                    index += 1
                }
                switch (key) {
                    // Multiple
                    case 'tag':
                    case 'team':
                    case 'gamemode':
                    case 'name':
                    case 'type':
                        this[key].push(value)
                        break
                    // Range
                    case 'distance':
                    case 'level':
                    case 'x_rotation':
                    case 'y_rotation':
                        this[key] = new Range(value)
                        break
                    // Direct store.
                    case 'limit':
                    case 'x':
                    case 'y':
                    case 'z':
                    case 'dx':
                    case 'dy':
                    case 'dz':
                    case 'sort':
                        this[key] = value
                        break
                    default:
                        throw `Unknown argument key: '${key}'.`
                }
                break
        }

        this.parseArgument(input, index + 1)
    }

    /**
     * Parse the `scores` arugment.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of `scores` (should be `}`).
     */
    private parseScores(input: string, index: number) {
        if (input.charAt(index) !== '{') {
            throw `Expected '{' but got '${input.charAt(index)}'.`
        }

        index += 1

        if (input.charAt(index) === '}') {
            return index
        }

        return this.parseScore(input, index)
    }

    /**
     * Parse a single score.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of this score (should be `,` or `}`).
     */
    private parseScore(input: string, index: number) {
        if (input.charAt(index) === '') {
            return index
        }

        let objective = ''
        while (input.charAt(index) !== '=') {
            objective += input.charAt(index)
            index += 1
        }
        index += 1

        let value = ''
        let end = false
        while (!/^[}|,]$/.test(input.charAt(index))) {
            // Neither '}' nor ','.
            value += input.charAt(index)
            index += 1
            if (input.charAt(index) === '}') {
                end = true
            }
        }

        this.scores.set(objective, new Range(value))

        if (!end) {
            index = this.parseScore(input, index + 1)
        }

        return index
    }

    /**
     * Parse the `advancements` arugment.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of `advancements` (should be `}`).
     */
    private parseAdvancements(input: string, index: number) {
        if (input.charAt(index) !== '{') {
            throw `Expected '{' but got '${input.charAt(index)}'.`
        }

        index += 1

        if (input.charAt(index) === '}') {
            return index
        }

        return this.parseAdvancement(input, index)
    }

    /**
     * Parse a single advancement.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of this advancement (should be `,` or `}`).
     */
    private parseAdvancement(input: string, index: number) {
        if (input.charAt(index) === '') {
            return index
        }

        let advancement = ''
        while (input.charAt(index) !== '=') {
            advancement += input.charAt(index)
            index += 1
        }

        index += 1

        if (input.charAt(index) === '{') {
            const result = {}
            index = this.parseAdvancementCriterias(input, index, result)
            index += 1
            this.advancements.set(advancement, result)
        } else {
            let value = ''
            while (!/^[}|,]$/.test(input.charAt(index))) {
                // Neither '}' nor ','.
                value += input.charAt(index)
                index += 1
            }
            this.advancements.set(advancement, value)
        }

        if (input.charAt(index) !== '}') {
            index = this.parseAdvancement(input, index + 1)
        }

        return index
    }

    /**
     * Parse advancement criterias.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of this `criterias` (should be `}`).
     */
    private parseAdvancementCriterias(input: string, index: number, result: { [criteria: string]: string }) {
        if (input.charAt(index) !== '{') {
            throw `Expected '{' but got '${input.charAt(index)}'.`
        }

        index += 1

        if (input.charAt(index) === '}') {
            return index
        }

        return this.parseAdvancementCriteria(input, index, result)
    }

    /**
     * Parse a single advancement criteria.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of this criteria (should be `,` or `}`).
     */
    private parseAdvancementCriteria(input: string, index: number, result: { [criteria: string]: string }) {
        if (input.charAt(index) === '') {
            return index
        }

        let criteria = ''
        while (input.charAt(index) !== '=') {
            criteria += input.charAt(index)
            index += 1
        }

        index += 1

        let value = ''
        let end = false
        while (!/^[}|,]$/.test(input.charAt(index))) {
            // Neither '}' nor ','.
            value += input.charAt(index)
            index += 1
            if (input.charAt(index) === '}') {
                end = true
            }
        }

        result[criteria] = value

        if (!end) {
            index = this.parseAdvancementCriteria(input, index + 1, result)
        }

        return index
    }

    /**
     * Parse the `nbt` argument.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of `nbt` (should be `}`).
     */
    private parseNbt(input: string, index: number) {
        let endIndex = index + 1

        while (input.charAt(endIndex) !== '') {
            let nbt = new NbtCompound()
            try {
                nbt = getNbtCompound(input.slice(index, endIndex))
            } catch {
                endIndex += 1
                continue
            }
            this.nbt = nbt
            return endIndex
        }

        throw `Can't parse as nbt argument: '${input}'[${index}].`
    }
}

/**
 * Represents a range in a target selector.
 */
class Range {
    public min: number | null
    public max: number | null

    constructor(str: string) {
        let arr = str.split('..')
        if (arr.length === 2) {
            this.min = arr[0] ? Number(arr[0]) : null
            this.max = arr[1] ? Number(arr[1]) : null
        } else {
            this.min = this.max = Number(arr[0])
        }
    }

    public toString() {
        let min = this.min
        let max = this.max
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
