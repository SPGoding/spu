import CharReader from './utils/char_reader'
import ArgumentReader from './utils/argument_reader'
import Selector19To111 from './to111/selector'
import { getNbtCompound } from '../utils/utils'
import { UpdaterTo111 } from './to111/updater';

/**
 * Represents a spu script.
 * Provides methods to compile itself.
 * @example
 * let spus = new SpuScript('execute if entity %0$adv%1%2')
 * let result = spus.compileWith(resultMap)
 * @deprecated
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

        if (!methods || !source) {
            throw 'Spu Script execute error.'
        }

        for (const name of methods.keys()) {
            let paramIds = methods.get(name)
            if (paramIds) {
                let params = paramIds.map(x => {
                    let result = resultMap.get(`%${x}`)
                    return result ? result : ''
                })
                switch (name) {
                    case '[19to111]CombineEntityTypeWithNbt': {
                        const ans = UpdaterTo111.upEntityNbtWithType(getNbtCompound(params[0]), source)
                        source = ans.entityType
                        break
                    }
                    case '[19to111]CombineSelectorWithNbt': {
                        const sel = new Selector19To111()
                        sel.parse(source)
                        const ans = UpdaterTo111.upEntityNbtWithType(getNbtCompound(params[0]), sel.getType())
                        sel.setType(ans.entityType)
                        source = sel.to111()
                        break
                    }
                    default:
                        throw `Unknwon spu script method: '${name}'`
                }
            }
        }

        return source
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
