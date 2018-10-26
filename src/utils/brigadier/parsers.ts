import { isNumeric } from "../utils";

/**
 * A brigadier parser.
 */
export default interface Parser {
    canParse(value: string): boolean
}

/**
 * brigadier:bool
 * @property N/A
 */
export class BrigadierBool implements Parser {
    public constructor() { }

    public canParse(value: string) {
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

    public canParse(value: string) {
        return isNumeric(value) &&
            (this.min === undefined || parseFloat(value) >= this.min) &&
            (this.max === undefined || parseFloat(value) <= this.max)
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

    public canParse(value: string) {
        return isNumeric(value) &&
            (this.min === undefined || parseFloat(value) >= this.min) &&
            (this.max === undefined || parseFloat(value) <= this.max)
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

    public canParse(value: string) {
        return isNumeric(value) &&
            parseInt(value) === parseFloat(value) &&
            (this.min === undefined || parseInt(value) >= this.min) &&
            (this.max === undefined || parseInt(value) <= this.max)
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

    public canParse(value: string) {
        switch (this.type) {
            case value:
                
                break
            default:
                break
        }
    }
}