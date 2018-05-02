import ArgReader from './arg_reader'
import Selector from './selector'

/**
 * Provides methods to convert commands in a mcf file from minecraft 1.12 to 1.13.
 * @author SPGoding
 */
export default class Converter {
    /**
     * Returns if an command matches an format.
     * @param cmd An old minecraft command.
     * @param fmt An old format defined in formats.ts.
     */
    private static isMatch(cmd: string, fmt: string) {
        let fmtReader = new ArgReader(fmt)
        let fmtArg = fmtReader.next()
        let cmdReader = new ArgReader(cmd)
        let cmdArg = cmdReader.next()
        while (fmtArg !== '') {
            while (!Converter.isArgMatch(cmdArg, fmtArg)) {
                if (cmdReader.hasMore()) {
                    cmdArg += '\s' +  cmdReader.next()
                } else {
                    // 把arg连接到最后一个了也不匹配，凉了
                    // Exm??? Why Chinese??? What are you saying???
                    return false
                }
            }
        }
        return true
    }

    private static isArgMatch(cmdArg: string, fmtArg: string) {
        if (fmtArg.charAt(0) === '%") {
            switch (fmtArg.slice(1)) {
                case 'entity':
                    return Converter.isEntity(cmdArg)
                    break
                // TODO
            }
        } else {
            return cmdArg === fmtArg
        }
    }

    private static isEntity(input: string) {
        return Converter.isSelector() || Converter.isString() || Converter.isUuid()
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
        if (string.charAt(0) === '#') {
            return input
        } else {

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
                return ''
        }
    }

    static selector(input: string) {
        let sel = new Selector()
        sel.parse112(input)
        return sel.get113()
    }
}
