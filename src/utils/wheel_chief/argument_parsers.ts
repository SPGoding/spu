import { isNumeric } from "../utils";
import { Property } from "./wheel_chief";

/**
 * A brigadier parser.
 */
export interface ArgumentParser {
    canParse(splited: string[], index: number): number
}

/**
 * brigadier:bool
 * @property N/A
 */
export class BrigadierBoolParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (['false', 'true'].indexOf(splited[index]) !== -1) {
            return 1
        } else {
            return 0
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

    public canParse(splited: string[], index: number): number {
        if (isNumeric(splited[index]) &&
            (this.min === undefined || parseFloat(splited[index]) >= this.min) &&
            (this.max === undefined || parseFloat(splited[index]) <= this.max)) {
            return 1
        } else {
            return 0
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

    public canParse(splited: string[], index: number): number {
        if (isNumeric(splited[index]) &&
            (this.min === undefined || parseFloat(splited[index]) >= this.min) &&
            (this.max === undefined || parseFloat(splited[index]) <= this.max)) {
            return 1
        } else {
            return 0
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

    public canParse(splited: string[], index: number): number {
        if (isNumeric(splited[index]) && parseInt(splited[index]) === parseFloat(splited[index]) &&
            (this.min === undefined || parseFloat(splited[index]) >= this.min) &&
            (this.max === undefined || parseFloat(splited[index]) <= this.max)) {
            return 1
        } else {
            return 0
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

    public canParse(splited: string[], index: number): number {
        switch (this.type) {
            case 'greedy':
                return splited.length - index
            case 'phrase':
                if (splited[index].slice(0, 1) === '"') {
                    let endIndex: number | undefined
                    for (let i = index; i < splited.length; i++) {
                        const arg = splited[i];
                        if (arg.slice(-1) === '"' && arg.slice(-2, -1) !== '\\') {
                            endIndex = i
                            break
                        }
                    }
                    if (endIndex !== undefined) {
                        return endIndex - index + 1
                    } else {
                        return 0
                    }
                } else {
                    return 1
                }
            case 'word':
            default:
                return 1
        }
    }
}