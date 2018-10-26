import Updater from './updater'
import Selector from '../112to113/selector'
import Spuses from './mappings/spuses'
import { isNumeric } from '../../utils/utils'
import { Tokenizer as NbtTokenizer } from '../../utils/nbt/tokenizer'
import { Parser as NbtParser } from '../../utils/nbt/parser'

export default class Checker {
    public static isArgumentMatch(cmdArg: string, spusArg: string) {
        if (spusArg.charAt(0) === '%') {
            switch (spusArg.slice(1)) {
                case 'block_nbt':
                    return Checker.isNbt(cmdArg)
                case 'bool':
                    return Checker.isBool(cmdArg)
                case 'command':
                    return Checker.isCommand(cmdArg)
                case 'entity':
                    return (
                        Checker.isSelector(cmdArg) || Checker.isWord(cmdArg) || Checker.isUuid(cmdArg) || cmdArg === '*'
                    )
                case 'entity_nbt':
                    return Checker.isNbt(cmdArg)
                case 'entity_type':
                    return Checker.isStringID(cmdArg)
                case 'item_nbt':
                case 'item_tag_nbt':
                    return Checker.isNbt(cmdArg)
                case 'json':
                    return Checker.isJsonElement(cmdArg)
                case 'literal':
                    return Checker.isLiteral(cmdArg)
                case 'num':
                    return Checker.isNum(cmdArg)
                case 'num_l':
                    return Checker.isNum(cmdArg.slice(0, -1)) && cmdArg.slice(-1).toUpperCase() === 'L'
                case 'num_or_star':
                    return Checker.isNumOrStar(cmdArg)
                case 'say_string':
                    return Checker.isString(cmdArg)
                case 'vec_2':
                    return Checker.isVec2(cmdArg)
                case 'vec_3':
                    return Checker.isVec3(cmdArg)
                case 'word':
                    return Checker.isWord(cmdArg)
                default:
                    throw `Unknown argument type: ${spusArg.slice(1)}`
            }
        } else {
            return cmdArg.toLowerCase() === spusArg.toLowerCase().replace(/\\%/g, '%')
        }
    }

    public static isBool(input: string) {
        return ['true', 'false'].indexOf(input.toLowerCase()) !== -1
    }

    public static isCommand(input: string) {
        if (input.slice(0, 1) === '/') {
            input = input.slice(1)
        }
        for (const spusOld of Spuses.pairs.keys()) {
            let map = Updater.getResultMap(input, spusOld)
            if (map) {
                return true
            }
        }
        return false
    }

    public static isJson(input: string) {
        try {
            if (typeof JSON.parse(input) === 'object') {
                return true
            } else {
                return false
            }
        } catch (ignored) {
            return false
        }
    }

    public static isJsonElement(input: string) {
        return this.isJson(input) || (input.slice(0, 1) === '"' && input.slice(-1) === '"') || this.isNum(input) || this.isBool(input)
    }

    public static isLiteral(input: string) {
        return /^[a-zA-Z]+$/.test(input)
    }

    public static isWord(input: string) {
        return /^[^\s]+$/.test(input)
    }

    public static isString(input: string) {
        return true
    }

    public static isNum(input: string) {
        return isNumeric(input)
    }

    public static isNumOrStar(input: string) {
        return isNumeric(input) || input == '*'
    }

    public static isStringID(input: string) {
        return /^(\w+:)?[a-z_]+$/.test(input)
    }

    public static isResourceLocation(input: string) {
        return /^(\w+:)?\w+(\/\w+)*$/.test(input)
    }

    public static isSelector(input: string) {
        return Selector.isValid(input)
    }

    public static isUuid(input: string) {
        return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/.test(input)
    }

    public static isVec2(input: string) {
        return /^((((~?[+-]?(\d*(\.\d*)?)|\.\d+)|(~))(\s|$)){2})$/.test(input)
    }

    public static isVec3(input: string) {
        // This regex is coppied from
        // https://github.com/pca006132/datapack-helper/blob/master/src/command-node/format.ts
        // Dressed pca, I love you!!!
        return /^((((~?[+-]?(\d*(\.\d*)?)|\.\d*)|(~))(\s|$)){3}|(\^([+-]?(\d*(\.\d*)?|\.\d*))?(\s|$)){3})$/.test(input)
    }

    public static isNbt(input: string) {
        try {
            let tokenizer = new NbtTokenizer()
            let parser = new NbtParser()
            let tokens = tokenizer.tokenize(input, 'before 1.12')
            parser.parseCompounds(tokens, 'before 1.12')
            return true
        } catch (ignored) {
            return false
        }
    }
}
