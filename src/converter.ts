import ArgumentReader from './utils/argument_reader'
import Selector from './utils/selector'
import Spuses from './maps/spuses'
import SpuScript from './spu_script'
import Checker from './checker'

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
    private static getResultMap(cmd: string, spus: string) {
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
                        alert()
                        return `execute positioned 0.0 0.0 0.0 run ${result}`
                    } else {
                        return result
                    }
                }
            }
        }
        throw `Unknown command: ${input}`
    }

    private static cvtArgument(arg: string, spus: string) {
        switch (spus.slice(1)) {
            case 'adv':
            case 'adv_crit':
                return arg
            case 'entity':
                return Converter.cvtEntity(arg)
            case 'difficulty':
                return Converter.cvtDifficulty(arg)
            case 'mode':
                return Converter.cvtMode(arg)
            default:
                return arg
        }
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
            sel.parse112(input)
        } else if (Checker.isWord(input)) {
            sel.parse112(`@p[name=${input}]`)
        } else {
            return input
        }
        return sel.get113()
    }

    public static cvtMode(input: string) {
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
}
