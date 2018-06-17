import ArgumentReader from './utils/argument_reader'
import Selector from './utils/selector'
import Spuses from './mappings/spuses'
import SpuScript from './spu_script'
import Checker from './checker'
import Blocks from './mappings/blocks'
import Entities from './mappings/entities'
import Items from './mappings/items'
import { isNumeric } from './utils/utils'
import { Parser as NbtParser } from './utils/nbt/parser'
import { Tokenizer as NbtTokenizer } from './utils/nbt/tokenizer'

/**
 * Provides methods to convert commands in a mcf file from minecraft 1.12 to 1.13.
 * @author SPGoding
 */
export default class Converter {
    /**
     * Returns an result map from an 1.12 command and an 1.12 spus.
     * @param cmd An 1.12 minecraft command.
     * @param spus An 1.12 spus defined in spuses.ts.
     * @returns NULLABLE. A map filled with converted value.
     * @example {'%0': 'converted value'}.
     */
    public static getResultMap(cmd: string, spus: string) {
        let spusReader = new ArgumentReader(spus)
        let spusArg = spusReader.next()
        let cmdReader = new ArgumentReader(cmd)
        let cmdArg = cmdReader.next()
        let map = new Map<string, string>()
        let cnt = 0
        while (spusArg !== '') {
            while (!Checker.isArgumentMatch(cmdArg, spusArg)) {
                if (cmdReader.hasMore()) {
                    cmdArg += ' ' + cmdReader.next()
                } else {
                    // Can't match this spus.
                    return null
                }
            }
            if (spusArg.charAt(0) === '%') {
                map.set(`%${cnt}`, Converter.cvtArgument(cmdArg, spusArg))
                cnt++
            }
            spusArg = spusReader.next()
            cmdArg = cmdReader.next()
        }
        if (cmdArg === '') {
            // Match successfully.
            return map
        } else {
            return null
        }
    }

    public static cvtLine(input: string, positionCorrect: boolean) {
        if (input.charAt(0) === '#') {
            return input
        } else {
            return Converter.cvtCommand(input, positionCorrect)
        }
    }

    public static cvtCommand(input: string, positionCorrect: boolean) {
        for (const spusOld of Spuses.pairs.keys()) {
            let map = Converter.getResultMap(input, spusOld)
            if (map) {
                let spusNew = Spuses.pairs.get(spusOld)
                if (spusNew) {
                    let spus = new SpuScript(spusNew)
                    let result = spus.compileWith(map)
                    if (positionCorrect) {
                        return `execute positioned 0.0 0.0 0.0 run ${result}`
                    } else {
                        return result
                    }
                }
            }
        }
        throw `Unknown command: ${input}`
    }

    public static cvtArgument(arg: string, spus: string) {
        switch (spus.slice(1)) {
            case 'adv':
                return arg
            case 'adv_crit':
                return arg
            case 'block':
                return arg
            case 'block_dust_param':
                return Converter.cvtBlockDustParam(arg)
            case 'block_metadata_or_state':
                return arg
            case 'block_nbt':
                return Converter.cvtBlockNbt(arg)
            case 'bool':
                return arg
            case 'command':
                return Converter.cvtCommand(arg, false)
            case 'difficulty':
                return Converter.cvtDifficulty(arg)
            case 'entity':
                return Converter.cvtEntity(arg)
            case 'entity_type':
                return Converter.cvtEntityType(arg)
            case 'func':
                return arg
            case 'gamemode':
                return Converter.cvtGamemode(arg)
            case 'ip':
                return arg
            case 'item':
                return arg
            case 'item_data':
                return arg
            case 'item_dust_params':
                return Converter.cvtItemDustParams(arg)
            case 'json':
                return Converter.cvtJson(arg)
            case 'literal':
                return arg.toLowerCase()
            case 'num':
                return arg
            case 'recipe':
                return arg
            case 'scb_crit':
                return Converter.cvtScbCrit(arg)
            case 'slot':
                return Converter.cvtSlot(arg)
            case 'sound':
                return arg
            case 'source':
                return arg
            case 'string':
                return arg
            case 'uuid':
                return arg
            case 'vec_2':
                return arg
            case 'vec_3':
                return arg
            case 'word':
                return arg
            default:
                throw `Unknown arg type: '${spus}'`
        }
    }

    public static cvtBlockDustParam(input: string) {
        const num = Number(input)
        const id = Blocks.get1_13NormalizeIDFrom1_12NumericID(num)
        return id.toString()
    }

    public static cvtBlockNbt(input: string) {
        const tokenizer = new NbtTokenizer()
        const tokens = tokenizer.tokenize(input)
        const parser = new NbtParser()
        const nbt = parser.parse(tokens)

        throw 'UNFINISHED'
    }

    public static cvtDifficulty(input: string) {
        switch (input) {
            case '0':
            case 'p':
            case 'peaceful':
                return 'peaceful'
            case '1':
            case 'e':
            case 'easy':
                return 'easy'
            case '2':
            case 'n':
            case 'normal':
                return 'normal'
            case '3':
            case 'h':
            case 'hard':
                return 'hard'
            default:
                throw `Unknown difficulty: ${input}`
        }
    }

    public static cvtEntity(input: string) {
        let sel = new Selector()
        if (Checker.isSelector(input)) {
            sel.parse1_12(input)
        } else if (Checker.isWord(input)) {
            sel.parse1_12(`@p[name=${input}]`)
        } else {
            return input
        }
        return sel.get1_13()
    }

    public static cvtEntityType(input: string) {
        return Entities.get1_13NominalIDFrom1_12NominalID(input)
    }

    public static cvtGamemode(input: string) {
        switch (input) {
            case '0':
            case 's':
            case 'survival':
                return 'survival'
            case '1':
            case 'c':
            case 'creative':
                return 'creative'
            case '2':
            case 'a':
            case 'adventure':
                return 'adventure'
            case '3':
            case 'sp':
            case 'spectator':
                return 'spectator'
            default:
                throw `Unknown gamemode: ${input}`
        }
    }

    public static cvtItemDustParams(input: string) {}

    public static cvtJson(input: string) {
        if (input.slice(0, 1) === '"') {
            return input
        } else if (input.slice(0, 1) === '[') {
            let json = JSON.parse(input)
            let result: string[] = []
            for (const i of json) {
                result.push(Converter.cvtJson(JSON.stringify(i)))
            }
            return `[${result.join()}]`
        } else {
            let json = JSON.parse(input)
            if (json.selector) {
                let sel = new Selector()
                sel.parse1_12(json.selector)
                json.selector = sel.get1_13()
            }

            if (
                json.clickEvent &&
                json.clickEvent.action &&
                (json.clickEvent.action === 'run_command' || json.clickEvent.action === 'suggest_command') &&
                json.clickEvent.value
            ) {
                json.clickEvent.value = Converter.cvtCommand(json.clickEvent.value, false)
            }

            if (json.extra) {
                json.extra = JSON.parse(Converter.cvtJson(JSON.stringify(json.extra)))
            }

            return JSON.stringify(json)
        }
    }

    public static cvtScbCrit(input: string) {
        if (input.slice(0, 5) === 'stat.') {
            const subs = input.split(/\./g)
            switch (subs[1]) {
                case 'mineBlock':
                    if (isNumeric(subs[2])) {
                        return `minecraft.mined:${Blocks.get1_13NormalizeIDFrom1_12NumericID(Number(subs[2]))
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '')}`
                    } else {
                        return `minecraft.mined:${Blocks.get1_12NormalizeIDFrom1_12StringID(subs[2])
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '')}`
                    }
                case 'craftItem':
                case 'useItem':
                case 'breakItem':
                case 'pickup':
                case 'drop':
                default:
                    return `minecraft.custom:minecraft.${subs[1]}`
            }
        } else {
            return input
        }
    }

    public static cvtSlot(input: string) {
        return input.slice(5)
    }
}
