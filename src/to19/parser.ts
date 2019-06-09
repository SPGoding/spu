import { getNbtCompound } from '../utils/utils'
import { ArgumentParser } from '../utils/wheel_chief/parser'
import { Selector19 } from './utils/selector'
import { NbtCompound } from '../utils/nbt/nbt'

export class ArgumentParser18To19 extends ArgumentParser {
    public parseArgument(parser: string, splited: string[], index: number, properties: any) {
        switch (parser) {
            case 'spgoding:nbt_contains_riding':
                return this.parseSpgodingNbtContainsRiding(splited, index)
            default:
                return super.parseArgument(parser, splited, index, properties)
        }
    }
    protected parseMinecraftEntity(splited: string[], index: number): number {
        let join = splited[index]
        let result = ''
        if (join.charAt(0) !== '@') {
            return 1
        }
        result = Selector19.tryParse(join)
        if (result === 'VALID') {
            return 1
        }
        else {
            for (let i = index + 1; i < splited.length; i++) {
                join += ` ${splited[i]}`
                result = Selector19.tryParse(join)
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
    protected parseSpgodingNbtContainsRiding(splited: string[], index: number): number {
        let exception
        for (let endIndex = splited.length; endIndex > index; endIndex--) {
            const test = splited.slice(index, endIndex).join(' ')
            try {
                const nbt = getNbtCompound(test, 'before 1.12')
                if (nbt.get('Riding') instanceof NbtCompound) {
                    return endIndex - index
                }
                else {
                    throw "Should contain 'Riding'."
                }
            }
            catch (e) {
                exception = e
                continue
            }
        }
        throw exception
    }
}
