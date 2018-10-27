import { isNumeric } from "../utils";

/**
 * A brigadier parser.
 */
export default interface Parser {
    tryParse(args: string[], index: number, version: number): boolean
}

/**
 * brigadier:bool
 * @property N/A
 */
export class BrigadierBool implements Parser {
    public constructor() { }

    public canParse(value: string, version: number) {
        return ['true', 'false'].indexOf(value) !== -1
    }
}

/**
 * brigadier:double
 * @property min
 * @property max
 */
export class BrigadierDouble implements Parser {
    private min: number | undefined
    private max: number | undefined

    public constructor(min?: number, max?: number) {
        this.min = min
        this.max = max
    }

    public canParse(value: string, version: number) {
        if (version === 1) {
            return isNumeric(value) &&
                (this.min === undefined || parseFloat(value) >= this.min) &&
                (this.max === undefined || parseFloat(value) <= this.max)
        } else {
            return false
        }
    }
}

/**
 * brigadier:float
 * @property min
 * @property max
 */
export class BrigadierFloat implements Parser {
    private min: number | undefined
    private max: number | undefined

    public constructor(min?: number, max?: number) {
        this.min = min
        this.max = max
    }

    public canParse(value: string, version: number) {
        if (version === 1) {
            return isNumeric(value) &&
                (this.min === undefined || parseFloat(value) >= this.min) &&
                (this.max === undefined || parseFloat(value) <= this.max)
        } else {
            return false
        }
    }
}

/**
 * brigadier:integer
 * @property min
 * @property max
 */
export class BrigadierInteger implements Parser {
    private min: number | undefined
    private max: number | undefined

    public constructor(min?: number, max?: number) {
        this.min = min
        this.max = max
    }

    public canParse(value: string, version: number) {
        if (version === 1) {
            return isNumeric(value) &&
                parseInt(value) === parseFloat(value) &&
                (this.min === undefined || parseInt(value) >= this.min) &&
                (this.max === undefined || parseInt(value) <= this.max)
        } else {
            return false
        }
    }
}

/**
 * brigadier:string
 * @property type: Can be one of the following values: 'greedy', 'phrase' and 'word'.
 */
export class BrigadierString implements Parser {
    private type: 'greedy' | 'phrase' | 'word' | undefined

    public constructor(type: 'greedy' | 'phrase' | 'word') {
        this.type = type
    }

    public canParse(value: string, version: number) {
        if (version === 1) {
            switch (this.type) {
                case value:

                    break
                default:
                    break
            }
        } else {
            return false
        }
    }
}