import { SpuScriptExecutor, Argument } from '../utils/wheel_chief/wheel_chief'
import { getNbtCompound } from '../utils/utils'
import { Selector111 } from './utils/selector'
import { UpdaterTo111 } from './updater'

export class SpuScriptExecutor19To111 implements SpuScriptExecutor {
    public execute(script: string, args: Argument[]) {
        const splited = script.split(' ')
        for (let i = 0; i < splited.length; i++) {
            if (splited[i].slice(0, 1) === '%') {
                splited[i] = args[parseInt(splited[i].slice(1))].value
            }
            else if (splited[i].slice(0, 1) === '$') {
                const params = splited[i].slice(1).split('%')
                const index1 = parseInt(params[1])
                const index2 = parseInt(params[2])
                const param1 = args[index1] ? args[index1].value : ''
                const param2 = args[index2] ? args[index2].value : ''
                switch (params[0]) {
                    case 'setTypeWithNbt': {
                        const result = UpdaterTo111.upEntityNbtWithType(getNbtCompound(param2, 'before 1.12'), param1)
                        splited[i] = result.type
                        break
                    }
                    case 'setSelectorWithNbt': {
                        try {
                            const sel = new Selector111(param1)
                            if (sel.arguments.type !== undefined) {
                                const result = UpdaterTo111.upEntityNbtWithType(getNbtCompound(param2, 'before 1.12'), sel.arguments.type)
                                sel.arguments.type = result.type
                                splited[i] = sel.toString()
                            }
                            else {
                                splited[i] = param1
                            }
                        }
                        catch (ignored) {
                            // Take it easy.
                            splited[i] = param1
                        }
                        break
                    }
                    case 'delVariantNbt': {
                        const nbt = getNbtCompound(param1, 'before 1.12')
                        nbt.del('Type')
                        nbt.del('Elder')
                        nbt.del('ZombieType')
                        nbt.del('SkeletonType')
                        splited[i] = nbt.toString()
                        break
                    }
                    default:
                        throw `Unexpected script method: '${params[0]}'.`
                }
            }
        }
        return splited.join(' ')
    }
}
