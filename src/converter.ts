import ArgumentReader from './argument_reader'
import Spuses from './spuses'
import TargetSelector from './selector'
import SweetPragmaticsUpdaterScript from './sweet_pragmatics_updater_script'

/**
 * Provides methods to convert commands in a mcf file from minecraft 1.12 to 1.13.
 * @author SPGoding
 */
export default class Converter {
    /**
     * Returns an result map from an old command and an old spus.
     * @param cmd An old minecraft command.
     * @param spus An old spus defined in spuses.ts.
     * @returns NULLABLE. A map filled with converted value. Like {%n: converted value}.
     */
    private static getResultMap(cmd: string, spus: string) {
        let spusReader = new ArgumentReader(spus)
        let spusArg = spusReader.next()
        let cmdReader = new ArgumentReader(cmd)
        let cmdArg = cmdReader.next()
        let map = new Map<string, string>()
        let cnt = 0
        while (spusArg !== '') {
            while (!Spu.isArgumentMatch(cmdArg, spusArg)) {
                if (cmdReader.hasMore()) {
                    cmdArg += ' ' +  cmdReader.next()
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

    private static cvtArgument(cmd: string, spus: string) {
        switch (spus.slice(1)) {
            case 'entity':
                return Converter.cvtEntity(cmd)
            default:
                return cmd
        }
    }

   static cvtLine(input: string) {
        if (input.charAt(0) === '#') {
            return input
        } else {
            for (const spusOld of Spu.spuses.keys()) {
                let map = Converter.getResultMap(input, spusOld)
                if (map) {
                    let spusNew = Spu.spuses.get(spusOld)
                    let spus = new SweetPragmaticsUpdaterScript(spusNew)
                    let result = spus.compileWith(map)
                    return `execute positioned 0.0 0.0 0.0 run ${result}`
                }
            }
            throw `Unknown line: ${input}`
        }
    }

    static cvtGamemode(input: string) {
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

    static cvtTargetSelector(input: string) {
        let sel = new TargetSelector()
        sel.parse112(input)
        return sel.get113()
    }

    static cvtEntity(input: string) {
        if (Spu.isTargetSelector(input)) {
            return Converter.cvtTargetSelector(input)
        } else {
            return input
        }
    }
}
