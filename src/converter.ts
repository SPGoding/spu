import ArgReader from './arg_reader'
import Selector from './selector'
import Formats from './formats'

/**
 * Provides methods to convert commands in a mcf file from minecraft 1.12 to 1.13.
 * @author SPGoding
 */
export default class Converter {
    /**
     * Returns an command matches an format.
     * @param cmd An old minecraft command.
     * @param fmt An old format defined in formats.ts.
     * @returns An map of {%n: converted val}
     */
    private static match(cmd: string, fmt: string) {
        let fmtReader = new ArgReader(fmt)
        let fmtArg = fmtReader.next()
        let cmdReader = new ArgReader(cmd)
        let cmdArg = cmdReader.next()
        let map = new Map<string, string>()
        let cnt = 0
        while (fmtArg !== '') {
            while (!Converter.isArgMatch(cmdArg, fmtArg)) {
                if (cmdReader.hasMore()) {
                    cmdArg += ' ' +  cmdReader.next()
                } else {
                    // 把arg连接到最后一个了也不匹配，凉了
                    // Exm??? Why Chinese??? What are you saying???
                    return null
                }
            }
            if (fmtArg.charAt(0) === '%') {
                map.set(`%${cnt}`, Converter.arg(cmdArg, fmtArg))
                cnt++
            }
            fmtArg = fmtReader.next()
            cmdArg = cmdReader.next()
        }
        if (cmdArg === '') {
            // cmd也到头了，完美匹配
            return map
        } else {
            return null
        }
    }

    private static isArgMatch(cmdArg: string, fmtArg: string) {
        if (fmtArg.charAt(0) === '%') {
            switch (fmtArg.slice(1)) {
                case 'entity':
                    return Converter.isEntity(cmdArg)
                case 'string':
                    return Converter.isString(cmdArg)
                case 'number':
                    return Converter.isNumber(cmdArg)
                case 'selector':
                    return Converter.isSelector(cmdArg)
                case 'uuid':
                    return Converter.isUuid(cmdArg)
                default:
                    throw `Unknown arg type: ${fmtArg.slice(1)}`
                // TODO
            }
        } else {
            return cmdArg === fmtArg
        }
    }

    private static arg(cmd: string, fmt: string) {
        switch (fmt.slice(1)) {
            case 'entity':
                return Converter.entity(cmd)
            default:
                return cmd
        }
    }

    private static isEntity(input: string) {
        return Converter.isSelector(input) || Converter.isString(input) || Converter.isUuid(input)
    }

    private static isString(input: string) {
        return /^\w*$/.test(input)
    }

    private static isUuid(input: string) {
        return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/.test(input)
    }

    private static isNumber(input: string) {
        return /^[+-]?[0-9]+\.?[0-9]*$/.test(input)
    }

    private static isSelector(input: string) {
        return Selector.isValid(input)
    }

    static line(input: string) {
        if (input.charAt(0) === '#') {
            return input
        } else {
            for (const fmtOld of Formats.pairs.keys()) {
                let map = Converter.match(input, fmtOld)
                if (map) {
                    let fmtNew = Formats.pairs.get(fmtOld)
                    let cnt = 0
                    while (/\s%[0-9]+(\s|$)/.test(fmtNew)) {
                        fmtNew = fmtNew.replace(`%${cnt}`, map.get(`%${cnt}`))
                        cnt++
                    }
                    return `execute positioned 0.0 0.0 0.0 run ${fmtNew}`
                }
            }
            throw `Unknown line: ${input}`
        }
    }

    static gamemode(input: string) {
        switch (input) {
            case 's':
            case '0':
            case 'survival':
                return 'survival'
            case 'c':
            case '1':
            case 'creative':
                return 'creative'
            case 'a':
            case '2':
            case 'adventure':
                return 'adventure'
            case 'sp':
            case '3':
            case 'spector':
                return 'spector'
            default:
                throw `Unknown gamemode: ${input}`
        }
    }

    static selector(input: string) {
        let sel = new Selector()
        sel.parse112(input)
        return sel.get113()
    }

    static entity(input: string) {
        if (Converter.isSelector(input)) {
            return Converter.selector(input)
        } else {
            return input
        }
    }
}
