import CharReader from './utils/char_reader'
import ArgumentReader from './utils/argument_reader'
import Selector from './utils/selector'
import Items from './mappings/items'
import { isNumeric } from './utils/utils'
import Blocks from './mappings/blocks'
import Updater from './updater'

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
        let ast = this.getAst(arg)
        let id = ast.keys().next().value
        let methods = ast.get(id)
        let source = resultMap.get(`%${id}`)

        if (methods && source) {
            for (const name of methods.keys()) {
                let paramIds = methods.get(name)
                if (paramIds) {
                    let params = paramIds.map(x => {
                        let result = resultMap.get(`%${x}`)
                        return result ? result : ''
                    })
                    switch (name) {
                        case 'addAdvToEntity': {
                            let sel = new Selector()
                            sel.parse1_13(source)
                            if (params.length === 1) {
                                sel.addFinishedAdvancement(params[0])
                            } else if (params.length === 2) {
                                sel.addFinishedAdvancement(params[0], params[1])
                            } else {
                                throw `Unexpected param count: ${params.length} of ${name} in ${arg}.`
                            }
                            source = sel.get1_13()
                            break
                        }
                        case 'addDataToItem':
                            source = Items.get1_13NominalIDFrom1_12NominalIDWithDataValue(source, Number(params[0]))
                            break
                        case 'addMetadataOrStateToBlock':
                            if (isNumeric(params[0])) {
                                source = Blocks.get1_13NominalIDFrom1_12NominalID(
                                    Blocks.get1_12NominalIDFrom1_12StringIDWithMetadata(source, Number(params[0]))
                                )
                            } else {
                                source = Blocks.get1_13NominalIDFrom1_12NominalID(
                                    Blocks.get1_12NominalIDFrom1_12StringID(`${source}[${params[0]}]`)
                                )
                            }
                            break
                        case 'addNbtToBlock':
                            params[0] = Updater.upBlockNbt(params[0], source.split('[')[0])
                            if (params[0].slice(0, 4) === '$ID>') {
                                const states: string = '[' + source.split('[')[1]
                                source = params[0].slice(4) + (states !== '[' ? states : '')
                            } else {
                                source += params[0]
                            }
                            break
                        case 'addNbtToEntity': {
                            let sel = new Selector()
                            sel.parse1_13(source)
                            sel.setNbt(params[0])
                            source = sel.get1_13()
                            break
                        }
                        case 'addNbtToItem':
                            params[0] = Updater.upItemTagNbt(params[0], source)
                            source += params[0]
                            break
                        case 'addScbMaxToEntity': {
                            if (params[1] !== '*') {
                                let sel = new Selector()
                                sel.parse1_13(source)
                                sel.setScore(params[0], params[1], 'max')
                                source = sel.get1_13()
                            }
                            break
                        }
                        case 'addScbMinToEntity': {
                            if (params[1] !== '*') {
                                let sel = new Selector()
                                sel.parse1_13(source)
                                sel.setScore(params[0], params[1], 'min')
                                source = sel.get1_13()
                            }
                            break
                        }
                        case 'fuckItemItself':
                            source = Items.get1_13NominalIDFrom1_12NominalIDWithDataValue(source)
                            break
                        case 'fuckBlockItself':
                            source = Blocks.get1_13NominalIDFrom1_12NominalID(
                                Blocks.get1_12NominalIDFrom1_12StringIDWithMetadata(source, 0)
                            )
                            break
                        default:
                            throw `Unknwon spu script method: '${name}'`
                    }
                }
            }

            return source
        }

        throw 'Spu Script execute error!'
    }

    /**
     *
     * @param arg A spu script arg.
     * @returns A map contains id and methods.
     * @example
     * this.getPatternMap('%0') => {'0': {}}
     * this.getPatternMap('%1$addAdv%0%2$addNbt%3') => {'1': {addAdv: ['0', '2'], addNbt: ['3']}}
     */
    private getAst(arg: string) {
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
        let method: string
        let param: string
        let params: string[]
        while (char) {
            method = ''
            params = []
            char = charReader.next()
            while (char && char !== '%' && char !== '$') {
                method += char
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
                if (char !== '$') {
                    char = charReader.next()
                }
            }
            methods.set(method, params)
        }

        return new Map([[id, methods]])
    }
}
