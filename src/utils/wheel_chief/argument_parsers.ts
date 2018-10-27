import { isNumeric } from "../utils";

/**
 * A brigadier parser.
 */
export interface ArgumentParser {
    tryParse(args: string[], index: number): ArgumentParseResult
}

export interface ArgumentParseResult {
    value: string | null
    index: number
    
    message?: string
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
            return { value: value, index: index++ }
        } else {
            return { value: null, index: index++ }
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
                return { value: value, index: index++ }
            } else {
                return { value: value, index: index++, message: `Double should be in [${this.min}, ${this.max}].` }
            }
        } else {
            return { value: null, index: index++ }
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
                return { value: value, index: index++ }
            } else {
                return { value: value, index: index++, message: `Float should be in [${this.min}, ${this.max}].` }
            }
        } else {
            return { value: null, index: index++ }
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
                return { value: value, index: index++ }
            } else {
                return { value: value, index: index++, message: `Integer should be in [${this.min}, ${this.max}].` }
            }
        } else {
            return { value: null, index: index++ }
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
            case 'word':
                return { value: args[index], index: index++ }
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
                        return { value: args.slice(index, endIndex + 1).join(' '), index: endIndex++ }
                    } else {
                        return { value: null, index: index++, message: 'String should be end with ".' }
                    }
                } else {
                    return { value: args[index], index: index++ }
                }
            case 'greedy':
                return { value: args.slice(index).join(' '), index: args.length }
            default:
                break
        }
    }
}