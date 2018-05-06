import CharReader from './char_reader'
import ArgumentReader from './argument_reader'

export default class SweetPragmaticsUpdaterScript {
    // Example: execute if entity %0$adv%1%2
    private spus: string

    /**
     * Constructs this spus object from a format.
     * @param spus A new minecraft command format.
     */
    constructor(spus: string) {
        this.spus = spus
    }

    /**
     * Compile this spus from an result map.
     * @param map An result map.
     */
    compileWith(map: Map<string, string>) {
        let argReader = new ArgumentReader(this.spus)
        let arg = argReader.next()
        let result = ''

        while (arg) {
            if (arg.slice(0, 1) === '%') {
                arg = this.compileArgument(arg)
            }
            result += arg + ' '
            arg = argReader.next()
        }

        // Remove extra space.
        result = result.slice(0, -1)

        return result
    }

    private compileArgument(arg: string) {
        let result = ''
        let charReader = new CharReader(arg)
        let char = charReader.next()
        let id = ''

        if (char === '%') {
            char = charReader.next()
        } else {
            throw `Unexpected token: ${char} in ${arg}`
        }

        while (char) {
            if (char !== '$') {
                id += char
            } else {
                char = charReader.next()
                break            
            }
            char = charReader.next()
        }

        return result
    }
}