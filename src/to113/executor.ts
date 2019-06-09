import { SpuScriptExecutor, Argument } from '../utils/wheel_chief/wheel_chief'
import { isNumeric, getNbtCompound } from '../utils/utils'
import { Selector113 as TargetSelector112 } from './utils/selector'
import { TargetSelector as TargetSelector113 } from '../utils/selector'
import Blocks from './mappings/blocks'
import Items from './mappings/items'

export class SpuScriptExecutor112To113 implements SpuScriptExecutor {
    public execute(script: string, args: Argument[]) {
        const splited = script.split(' ')
        for (let i = 0; i < splited.length; i++) {
            if (splited[i].slice(0, 1) === '%') {
                splited[i] = args[parseInt(splited[i].slice(1))].value
            }
            else if (splited[i].slice(0, 1) === '$') {
                const paramIndexes = splited[i].slice(1).split('%')
                const params = paramIndexes.slice(1).map(v => args[parseInt(v)] ? args[parseInt(v)].value : '')
                
                switch (paramIndexes[0]) {
                    case 'setAsRangeWithMin':
                        if (params[0] !== '*') {
                            splited[i] = `${params[0]}..`
                        } else {
                            splited[i] = '-2147483648..'
                        }
                        break
                    case 'setAsRangeWithMinAndMax': {
                        if (params[0] !== '*' && params[1] !== '*') {
                            if (params[0] !== params[1]) {
                                splited[i] = `${params[0]}..${params[1]}`
                            } else {
                                splited[i] = `${params[0]}`
                            }
                        } else if (params[0] !== '*' && params[1] === '*') {
                            splited[i] = `${params[0]}..`
                        } else if (params[0] === '*' && params[1] !== '*') {
                            splited[i] = `..${params[1]}`
                        } else {
                            splited[i] = '-2147483648..'
                        }
                        break
                    }
                    case 'setBlockParam':
                        splited[i] = Blocks.to113(Blocks.std112(parseInt(params[0]))).getFull()
                        break
                    case 'setItemParams':
                        splited[i] = Items.to113(Items.std112(parseInt(params[0]), undefined, parseInt(params[1]))).getNominal()
                        break
                    case 'setNameToItemStack':
                        splited[i] = Items.to113(Items.std112(undefined, params[0])).getNominal()
                        break
                    case 'setNameDataToItemStack':
                        splited[i] = Items.to113(Items.std112(undefined, params[0], parseInt(params[1]))).getNominal()
                        break
                    case 'setNameDataNbtToItemStack':
                        splited[i] = Items.to113(Items.std112(undefined, params[0], parseInt(params[1]), params[2])).getNominal()
                        break
                    case 'setNameToBlockState':
                        splited[i] = Blocks.to113(Blocks.std112(undefined, params[0])).getFull()
                        break
                    case 'setNameStatesToBlockState':
                        if (isNumeric(params[2])) {
                            splited[i] = Blocks.to113(Blocks.std112(undefined, params[0], parseInt(params[1]))).getFull()
                        } else {
                            splited[i] = Blocks.to113(Blocks.std112(undefined, params[0], undefined, params[1])).getFull()
                        }
                        break
                    case 'setNameStatesNbtToBlockState':
                        if (isNumeric(params[2])) {
                            splited[i] = Blocks.to113(Blocks.std112(undefined, params[0], parseInt(params[1]), undefined, params[2])).getFull()
                        } else {
                            splited[i] = Blocks.to113(Blocks.std112(undefined, params[0], undefined, params[1], params[2])).getFull()
                        }
                        break
                    case 'setNbtToSelector': {
                        const sel112 = new TargetSelector112()
                        sel112.parse(params[0])
                        const sel113 = new TargetSelector113(sel112.to113())
                        sel113.nbt = getNbtCompound(params[1])
                        splited[i] = sel113.toString()
                        break
                    }
                    default:
                        throw `Unexpected script method: '${paramIndexes[0]}'.`
                }
            }
        }
        return splited.join(' ')
    }
}
