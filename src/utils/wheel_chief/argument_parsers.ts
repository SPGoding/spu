import { isNumeric } from "../utils";

/**
 * A brigadier parser.
 */
export interface ArgumentParser {
    tryParse(args: string[], index: number): ArgumentParseResult
}

export interface ArgumentParseResult {
    successful: boolean
    deltaIndex: number
    message?: string
}

/**
 * literal
 * @property N/A
 */
export class BrigadierLiteralParser implements ArgumentParser {
    private literal: string

    public constructor(literal: string) {
        this.literal = literal
    }

    public tryParse(args: string[], index: number): ArgumentParseResult {
        const value = args[index]
        if (value === this.literal) {
            return { arg: value, index: index++, parser: 'literal' }
        } else {
            return { arg: null, index: index++, parser: 'literal' }
        }
    }
}

/**
 * brigadier:bool
 * @property N/A
 */
export class BrigadierBoolParser implements ArgumentParser {
    public constructor() { }

    public tryParse(args: string[], index: number): ArgumentParseResult {
        const value = args[index]
        if (['false', 'true'].indexOf(value) !== -1) {
            return { arg: value, index: index++, parser: 'brigadier:bool' }
        } else {
            return { arg: null, index: index++, parser: 'brigadier:bool' }
        }
    }
}

/**
 * brigadier:double
 * @property min
 * @property max
 */
export class BrigadierDoubleParser implements ArgumentParser {
    private min: number | undefined
    private max: number | undefined

    public constructor(min?: number, max?: number) {
        this.min = min
        this.max = max
    }

    public tryParse(args: string[], index: number): ArgumentParseResult {
        const value = args[index]
        if (isNumeric(value)) {
            if ((this.min === undefined || parseFloat(value) >= this.min) &&
                (this.max === undefined || parseFloat(value) <= this.max)) {
                return { arg: value, index: index++, parser: 'brigadier:double' }
            } else {
                return { arg: value, index: index++, parser: 'brigadier:double', message: `Double should be in [${this.min}, ${this.max}].` }
            }
        } else {
            return { arg: null, index: index++, parser: 'brigadier:double' }
        }
    }
}

/**
 * brigadier:float
 * @property min
 * @property max
 */
export class BrigadierFloatParser implements ArgumentParser {
    private min: number | undefined
    private max: number | undefined

    public constructor(min?: number, max?: number) {
        this.min = min
        this.max = max
    }

    public tryParse(args: string[], index: number): ArgumentParseResult {
        const value = args[index]
        if (isNumeric(value)) {
            if ((this.min === undefined || parseFloat(value) >= this.min) &&
                (this.max === undefined || parseFloat(value) <= this.max)) {
                return { arg: value, index: index++, parser: 'brigadier:float' }
            } else {
                return { arg: value, index: index++, parser: 'brigadier:float', message: `Float should be in [${this.min}, ${this.max}].` }
            }
        } else {
            return { arg: null, index: index++, parser: 'brigadier:float' }
        }
    }
}

/**
 * brigadier:integer
 * @property min
 * @property max
 */
export class BrigadierIntegerParser implements ArgumentParser {
    private min: number | undefined
    private max: number | undefined

    public constructor(min?: number, max?: number) {
        this.min = min
        this.max = max
    }

    public tryParse(args: string[], index: number): ArgumentParseResult {
        const value = args[index]
        if (isNumeric(value) && parseFloat(value) === parseInt(value)) {
            if ((this.min === undefined || parseFloat(value) >= this.min) &&
                (this.max === undefined || parseFloat(value) <= this.max)) {
                return { arg: value, index: index++, parser: 'brigadier:integer' }
            } else {
                return { arg: value, index: index++, parser: 'brigadier:integer', message: `Integer should be in [${this.min}, ${this.max}].` }
            }
        } else {
            return { arg: null, index: index++, parser: 'brigadier:integer' }
        }
    }
}

/**
 * brigadier:string
 * @property type: Can be one of the following values: 'greedy', 'phrase' and 'word'.
 */
export class BrigadierStringParser implements ArgumentParser {
    private type: 'greedy' | 'phrase' | 'word' | undefined

    public constructor(type: 'greedy' | 'phrase' | 'word' = 'word') {
        this.type = type
    }

    public tryParse(args: string[], index: number): ArgumentParseResult {
        switch (this.type) {
            case 'greedy':
                return { arg: args.slice(index).join(' '), index: args.length, parser: 'brigadier:string' }
            case 'phrase':
                if (args[index].slice(0, 1) === '"') {
                    let endIndex: number | undefined
                    for (let i = index; i < args.length; i++) {
                        const arg = args[i];
                        if (arg.slice(-1) === '"' && arg.slice(-2, -1) !== '\\') {
                            endIndex = i
                            break
                        }
                    }
                    if (endIndex !== undefined) {
                        return { arg: args.slice(index, endIndex + 1).join(' '), index: endIndex++, parser: 'brigadier:string' }
                    } else {
                        return { arg: null, index: index++, parser: 'brigadier:string', message: 'String should be end with ".' }
                    }
                } else {
                    return { arg: args[index], index: index++, parser: 'brigadier:string' }
                }
            case 'word':
            default:
                return { arg: args[index], index: index++, parser: 'brigadier:string' }
        }
    }
}