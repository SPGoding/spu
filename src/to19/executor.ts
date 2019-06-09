import { SpuScriptExecutor, Argument } from '../utils/wheel_chief/wheel_chief'
import { getNbtCompound } from '../utils/utils'
import { NbtCompound, NbtList, NbtString } from '../utils/nbt/nbt'

export class SpuScriptExecutor18To19 implements SpuScriptExecutor {
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
                    case 'setTypeByNbt': {
                        const nbt = getNbtCompound(param1, 'before 1.12')
                        const riding = nbt.get('Riding')
                        if (riding instanceof NbtCompound) {
                            const id = riding.get('id')
                            if (id instanceof NbtString) {
                                splited[i] = id.get()
                            }
                            else {
                                splited[i] = 'spgoding:undefined'
                            }
                        }
                        else {
                            splited[i] = 'spgoding:undefined'
                        }
                        break
                    }
                    case 'setNbtWithType': {
                        const passenger = getNbtCompound(param1, 'before 1.12')
                        const ridden = passenger.get('Riding')
                        passenger.del('Riding')
                        passenger.set('id', new NbtString(param2))
                        if (ridden instanceof NbtCompound) {
                            ridden.del('id')
                            const passengers = new NbtList()
                            passengers.add(passenger)
                            ridden.set('Passengers', passengers)
                            splited[i] = ridden.toString()
                        }
                        else {
                            splited[i] = '{}'
                        }
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
