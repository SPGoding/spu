import CharReader from './char_reader'
import ArgumentReader from './argument_reader'
import TargetSelector from './selector'

/**
 * Represents a spu script.
 * Provides methods to compile itself.
 * @example
 * let spus = new SpuScript('execute if entity %0$adv%1%2')
 * let result = spus.compileWith(resultMap)
 */
export default class SpuScript {
    private spus: string

    /**
     * Constructs this spus object from a format.
     * @param spus A new minecraft command format.
     */
    constructor(spus: string) {
        this.spus = spus
    }

    /**
     * Compile this spu script with an result map.
     * @param map An result map.
     */
    compileWith(map: Map<string, string>) {
        let argReader = new ArgumentReader(this.spus)
        let arg = argReader.next()
        let result = ''

        while (arg) {
            if (arg.slice(0, 1) === '%') {
                arg = this.compileArgument(arg, map)
            }
            result += arg + ' '
            arg = argReader.next()
        }

        // Remove extra space.
        result = result.slice(0, -1)

        return result
    }

    private compileArgument(arg: string, resultMap: Map<string, string>) {
        let tokensMap = this.tokenize(arg)
        let id = tokensMap.keys().next().value
        let methods = tokensMap.get(id)
        let source = resultMap.get(`%${id}`)
        let result = source

        for (const name of methods.keys()) {
            const params = methods.get(name)
            switch (name) {
                case 'adv':
                    if (params.length === 1) {
                        let sel = new TargetSelector()
                        sel.parse113(params[0])
                    } else if (params.length === 2) {
                    } else {
                        throw `Unexpected param count: ${params.length} of ${name} in ${arg}.`
                    }
                    break
                default:
                    break
            }
        }

        return result
    }

    /**
     *
     * @param arg A spu script arg.
     * @returns A map contains id and methods.
     * @example
     * tokenize('%0') => {'0': {}}
     * tokenize('%1$adv%0%2$nbt%3') => {'1': {adv: ['0', '2'], nbt: ['3']}}
     */
    private tokenize(arg: string) {
        let result = ''
        let charReader = new CharReader(arg)
        let char = charReader.next()
        let id = ''
        let methods = new Map<string, string[]>()

        if (char === '%') {
            char = charReader.next()
        } else {
            throw `Unexpected token: ${char} in ${arg}. Should be '%".`
        }

        while (char && char !== '$') {
            id += char
            char = charReader.next()
        }
        let name: string
        let param: string
        let params: string[]
        while (char) {
            name = ''
            params = []
            char = charReader.next()
            while (char && char !== '%' && char !== '$') {
                name += char
                char = charReader.next()
            }
            char = charReader.next()
            while (char && char !== '$') {
                param = ''
                while (char && char !== '%' && char !== '$') {
                    param += char
                    char = charReader.next()
                }
                params.push(param)
                char = charReader.next()
            }
            methods.set(name, params)
        }

        return new Map([[id, methods]])
    }

    static isArgumentMatch(cmdArg: string, spusArg: string) {
        if (spusArg.charAt(0) === '%') {
            switch (spusArg.slice(1)) {
                case 'entity':
                    return SpuScript.isEntity(cmdArg)
                case 'string':
                    return SpuScript.isString(cmdArg)
                case 'word':
                    return SpuScript.isWord(cmdArg)
                case 'number':
                    return SpuScript.isNumber(cmdArg)
                case 'selector':
                    return SpuScript.isTargetSelector(cmdArg)
                case 'uuid':
                    return SpuScript.isUuid(cmdArg)
                default:
                    throw `Unknown argument type: ${spusArg.slice(1)}`
                // TODO:
            }
        } else {
            return cmdArg.toLowerCase() === spusArg
        }
    }

    static isEntity(input: string) {
        return (
            SpuScript.isTargetSelector(input) || SpuScript.isWord(input) || SpuScript.isUuid(input)
        )
    }

    static isWord(input: string) {
        return /^[\w:]*$/.test(input)
    }

    static isString(input: string) {
        return /^.*$/.test(input)
    }

    static isUuid(input: string) {
        return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/.test(input)
    }

    static isNumber(input: string) {
        return /^[+-]?[0-9]+\.?[0-9]*$/.test(input)
    }

    static isTargetSelector(input: string) {
        return TargetSelector.isValid(input)
    }
}
