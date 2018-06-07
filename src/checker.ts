import Selector from './utils/selector'
import { isNumeric } from './utils/utils'

export default class Checker {
    public static isArgumentMatch(cmdArg: string, spusArg: string) {
        if (spusArg.charAt(0) === '%') {
            switch (spusArg.slice(1)) {
                case 'entity':
                    return (
                        Checker.isSelector(cmdArg) ||
                        Checker.isWord(cmdArg) ||
                        Checker.isUuid(cmdArg)
                    )
                case 'string':
                    return Checker.isString(cmdArg)
                case 'word':
                case 'adv_crit':
                    return Checker.isWord(cmdArg)
                case 'num':
                    return Checker.isNum(cmdArg)
                case 'adv':
                    return Checker.isPath(cmdArg)
                case 'ip':
                    return Checker.isIP(cmdArg)
                case 'nbt':
                    return Checker.isNbt(cmdArg)
                default:
                    throw `Unknown argument type: ${spusArg.slice(1)}`
                // TODO:
            }
        } else {
            return cmdArg.toLowerCase() === spusArg
        }
    }

    public static isWord(input: string) {
        return /^\w*$/.test(input)
    }

    public static isString(input: string) {
        return /^.+$/.test(input)
    }

    public static isNum(input: string) {
        return isNumeric(input)
    }

    public static isUuid(input: string) {
        return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/.test(input)
    }

    public static isPath(input: string) {
        return /^(\w+:)?\w+(\/\w+)*$/.test(input)
    }

    public static isSelector(input: string) {
        return Selector.isValid(input)
    }

    public static isIP(input: string) {
        // Shitty regex.
        // Print width? Who cares!
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
            input
        )
    }

    public static isPosition(input: string) {
        // This regex is coppied from
        // https://github.com/pca006132/datapack-helper/blob/master/src/command-node/format.ts
        // Dressed pca, I love you!!!
        return /^((((~?[+-]?(\d+(\.\d+)?)|\.\d+)|(~))(\s|$)){3}|(\^([+-]?(\d+(\.\d+)?|\.\d+))?(\s|$)){3})/.test(
            input
        )
    }

    public static isNbt(input: string) {
        // TODO: When finished nbt parser.
        throw 'NO NBT PARSER SUPPORTS!!!'
    }
}
