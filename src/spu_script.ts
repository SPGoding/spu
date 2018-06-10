import Checker from './checker'
import CharReader from './utils/char_reader'
import ArgumentReader from './utils/argument_reader'
import Selector from './utils/selector'

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
        let patternMap = this.getPatternMap(arg)
        let id = patternMap.keys().next().value
        let methods = patternMap.get(id)
        let source = resultMap.get(`%${id}`)

        if (methods && source) {
            let result = source

            for (const name of methods.keys()) {
                let paramIds = methods.get(name)
                if (paramIds) {
                    let params = paramIds.map(x => {
                        let result = resultMap.get(`%${x}`)
                        return result ? result : ''
                    })
                    switch (name) {
                        case 'addAdv':
                            let selector = new Selector()
                            selector.parse1_13(source)
                            if (params.length === 1) {
                                selector.addFinishedAdvancement(params[0])
                            } else if (params.length === 2) {
                                selector.addFinishedAdvancement(params[0], params[1])
                            } else {
                                throw `Unexpected param count: ${
                                    params.length
                                } of ${name} in ${arg}.`
                            }
                            result = selector.get1_13()
                            break
                        default:
                            break
                    }
                }
            }

            return result
        }

        return ''
    }

    /**
     *
     * @param arg A spu script arg.
     * @returns A map contains id and methods.
     * @example
     * this.getPatternMap('%0') => {'0': {}}
     * this.getPatternMap('%1$addAdv%0%2$addNbt%3') => {'1': {addAdv: ['0', '2'], addNbt: ['3']}}
     */
    private getPatternMap(arg: string) {
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
}
