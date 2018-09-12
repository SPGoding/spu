import Updater from '../112to113/updater'
import Selector from '../112to113/selector'
import Spuses from '../112to113/mappings/spuses'
import { isNumeric } from './utils'
import { Tokenizer as NbtTokenizer } from './nbt/tokenizer'
import { Parser as NbtParser } from './nbt/parser'

export default class Checker {
    public static isArgumentMatch(cmdArg: string, spusArg: string) {
        if (spusArg.charAt(0) === '%') {
            switch (spusArg.slice(1)) {
                case 'adv':
                    return Checker.isResourceLocation(cmdArg)
                case 'adv_crit':
                    return Checker.isWord(cmdArg)
                case 'block':
                    return Checker.isResourceLocation(cmdArg)
                case 'block_dust_param':
                    return Checker.isBlockDustParam(cmdArg)
                case 'block_metadata_or_state':
                    return Checker.isBlockMetadataOrState(cmdArg)
                case 'block_nbt':
                    return Checker.isNbt(cmdArg)
                case 'bool':
                    return Checker.isBool(cmdArg)
                case 'no_slash_command':
                case 'command':
                    return Checker.isCommand(cmdArg)
                case 'difficulty':
                    return Checker.isDifficulty(cmdArg)
                case 'effect':
                    return Checker.isEffectNumericID(cmdArg) || Checker.isStringID(cmdArg)
                case 'ench':
                    return Checker.isEnchNumericID(cmdArg) || Checker.isStringID(cmdArg)
                case 'entity':
                    return (
                        Checker.isSelector(cmdArg) || Checker.isWord(cmdArg) || Checker.isUuid(cmdArg) || cmdArg === '*'
                    )
                case 'entity_nbt':
                    return Checker.isNbt(cmdArg)
                case 'entity_type':
                    return Checker.isStringID(cmdArg)
                case 'execute_command':
                    return Checker.isExecuteCommand(cmdArg)
                case 'func':
                    return Checker.isResourceLocation(cmdArg)
                case 'gamemode':
                    return Checker.isGamemode(cmdArg)
                case 'ip':
                    return Checker.isIP(cmdArg)
                case 'item':
                    return Checker.isResourceLocation(cmdArg)
                case 'item_data':
                    return Checker.isItemData(cmdArg)
                case 'item_dust_params':
                    return Checker.isItemDustParams(cmdArg)
                case 'item_nbt':
                case 'item_tag_nbt':
                    return Checker.isNbt(cmdArg)
                case 'json':
                    return Checker.isJson(cmdArg)
                case 'literal':
                    return Checker.isLiteral(cmdArg)
                case 'num':
                    return Checker.isNum(cmdArg)
                case 'num_l':
                    return Checker.isNum(cmdArg.slice(0, -1)) && cmdArg.slice(-1).toUpperCase() === 'L'
                case 'num_or_star':
                    return Checker.isNumOrStar(cmdArg)
                case 'particle':
                    return Checker.isStringID(cmdArg)
                case 'pre_json':
                    return Checker.isString(cmdArg)
                case 'recipe':
                    return Checker.isResourceLocation(cmdArg) || cmdArg === '*'
                case 'say_string':
                    return Checker.isString(cmdArg)
                case 'scb_crit':
                    return Checker.isScbCrit(cmdArg)
                case 'slot':
                    return Checker.isSlot(cmdArg)
                case 'sound':
                    return Checker.isSound(cmdArg)
                case 'source':
                    return Checker.isSource(cmdArg)
                case 'string':
                    return Checker.isString(cmdArg)
                case 'team_option':
                    return Checker.isWord(cmdArg)
                case 'uuid':
                    return Checker.isUuid(cmdArg)
                case 'vec_2':
                    return Checker.isVec_2(cmdArg)
                case 'vec_3':
                    return Checker.isVec_3(cmdArg)
                case 'word':
                    return Checker.isWord(cmdArg)
                default:
                    throw `Unknown argument type: ${spusArg.slice(1)}`
            }
        } else {
            return cmdArg.toLowerCase() === spusArg.toLowerCase().replace(/\\%/g, '%')
        }
    }

    public static isBlockDustParam(input: string) {
        return isNumeric(input) && Number(input) >= 0 && Number(input) <= 255 + 15 * 4096
    }

    public static isBlockMetadataOrState(input: string) {
        if (isNumeric(input)) {
            return Number(input) >= -1 && Number(input) <= 15 ? true : false
        } else {
            return /^(\w+=[\w0-9]+,?)+$/.test(input)
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

    public static isDifficulty(input: string) {
        return (
            ['0', '1', '2', '3', 'p', 'e', 'n', 'h', 'peaceful', 'easy', 'normal', 'hard'].indexOf(
                input.toLowerCase()
            ) !== -1
        )
    }

    public static isEffectNumericID(input: string) {
        return Number(input) >= 1 && Number(input) <= 27
    }

    public static isEnchNumericID(input: string) {
        return Number(input) >= 0 && Number(input) <= 71
    }

    public static isGamemode(input: string) {
        return (
            ['0', '1', '2', '3', 's', 'c', 'a', 'sp', 'survival', 'creative', 'adventure', 'spectator'].indexOf(
                input.toLowerCase()
            ) !== -1
        )
    }

    public static isItemData(input: string) {
        if (isNumeric(input)) {
            return Number(input) >= -1 && Number(input) <= 32767 ? true : false
        } else {
            return false
        }
    }

    public static isItemDustParams(input: string) {
        const arr = input.split(' ')
        if (arr.length === 2 && isNumeric(arr[0]) && isNumeric(arr[1])) {
            return true
        } else {
            return false
        }
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

    public static isUuid(input: string) {
        return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/.test(input)
    }

    public static isScbCrit(input: string) {
        if (input.slice(0, 5) === 'stat.') {
            return true
        } else {
            return (
                [
                    'dummy',
                    'trigger',
                    'health',
                    'xp',
                    'level',
                    'food',
                    'air',
                    'armor',
                    'teamkill',
                    'killedByTeam',
                    'deathCount',
                    'playerKillCount',
                    'totalKillCount'
                ].indexOf(input) !== -1
            )
        }
    }

    public static isSlot(input: string) {
        return input.slice(0, 5) === 'slot.'
    }

    public static isSound(input: string) {
        return /^[a-z]+(\.[a-z]+)*$/.test(input)
    }

    public static isSource(input: string) {
        return (
            [
                'master',
                'music',
                'record',
                'weather',
                'block',
                'hostile',
                'neutral',
                'player',
                'ambient',
                'voice'
            ].indexOf(input.toLowerCase()) !== -1
        )
    }

    public static isStringID(input: string) {
        return /^(\w+:)?[a-z_]+$/.test(input)
    }

    public static isExecuteCommand(input: string) {
        return input.slice(0, 7) === 'execute' || input.slice(0, 8) === '/execute'
    }

    public static isResourceLocation(input: string) {
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

    public static isVec_2(input: string) {
        return /^((((~?[+-]?(\d*(\.\d*)?)|\.\d+)|(~))(\s|$)){2})$/.test(input)
    }

    public static isVec_3(input: string) {
        // This regex is coppied from
        // https://github.com/pca006132/datapack-helper/blob/master/src/command-node/format.ts
        // Dressed pca, I love you!!!
        return /^((((~?[+-]?(\d*(\.\d*)?)|\.\d*)|(~))(\s|$)){3}|(\^([+-]?(\d*(\.\d*)?|\.\d*))?(\s|$)){3})$/.test(input)
    }

    public static isNbt(input: string) {
        try {
            let tokenizer = new NbtTokenizer()
            let parser = new NbtParser()
            let tokens = tokenizer.tokenize(input)
            parser.parse(tokens)
            return true
        } catch (ignored) {
            return false
        }
    }
}
