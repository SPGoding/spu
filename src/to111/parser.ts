import { getNbtCompound } from '../utils/utils'
import { ArgumentParser } from '../utils/wheel_chief/parser'
import { Selector111 } from './utils/selector'

export class ArgumentParser19To111 extends ArgumentParser {
    protected parseMinecraftEntity(splited: string[], index: number): number {
        let join = splited[index]
        let result = ''
        if (join.charAt(0) !== '@') {
            return 1
        }
        result = Selector111.tryParse(join)
        if (result === 'VALID') {
            return 1
        }
        else {
            for (let i = index + 1; i < splited.length; i++) {
                join += ' ' + splited[i]
                result = Selector111.tryParse(join)
                if (result === 'VALID') {
                    return i - index + 1
                }
                else {
                    continue
                }
            }
            throw `Expected an entity selector: ${result}`
        }
    }
    protected parseMinecraftNbt(splited: string[], index: number): number {
        let exception
        for (let endIndex = splited.length; endIndex > index; endIndex--) {
            const test = splited.slice(index, endIndex).join(' ')
            try {
                getNbtCompound(test, 'before 1.12')
                return endIndex - index
            }
            catch (e) {
                exception = e
                continue
            }
        }
        throw exception
    }
}
