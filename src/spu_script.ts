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

    private compileArgument(arg: string, map: Map<string, string>) {
        let compiledMap = this.compileArgumentToMap(arg)
        let id = map.keys().next().value
        let methods = map.get(id)
        

        return ''
    }

    /**
     * 
     * @param arg A spu script arg.
     * @returns A map contains id and methods.
     * @example 
     * compileArgument('%0') => {'0': {}}
     * compileArgument('%1$adv%0%2$nbt%3') => {'1': {adv: ['0', '2'], nbt: ['3']}}
     */
    private compileArgumentToMap(arg: string) {
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
        let methodName: string
        let methodParam: string
        let methodParams: string[]
        while (char) {
            methodName = ''
            methodParams = []
            char = charReader.next()
            while (char && char !== '%' && char !== '$') {
                methodName += char
                char = charReader.next()
            }
            char = charReader.next()
            while (char && char !== '$') {
                methodParam = ''
                while (char && char !== '%' && char !== '$') {
                    methodParam += char
                    char = charReader.next()
                }
                methodParams.push(methodParam)
                char = charReader.next()
            }
            methods.set(methodName, methodParams)
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
                case 'number':
                    return SpuScript.isNumber(cmdArg)
                case 'selector':
                    return SpuScript.isTargetSelector(cmdArg)
                case 'uuid':
                    return SpuScript.isUuid(cmdArg)
                default:
                    throw `Unknown argument type: ${spusArg.slice(1)}`
                // TODO
            }
        } else {
            return cmdArg.toLowerCase() === spusArg
        }
    }

    static isEntity(input: string) {
        return SpuScript.isTargetSelector(input) || 
               SpuScript.isString(input) || 
               SpuScript.isUuid(input)
    }

    static isString(input: string) {
        return /^\w*$/.test(input)
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