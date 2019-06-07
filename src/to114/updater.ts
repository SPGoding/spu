import { WheelChief } from '../utils/wheel_chief/wheel_chief'
import { Commands113To114 } from './commands'
import { Updater } from '../utils/wheel_chief/updater'
import { escape, completeNamespace, UpdateResult } from '../utils/utils'
import { NbtCompound, NbtList, NbtString } from '../utils/nbt/nbt'
import { UpdaterTo113 } from '../to113/updater'
import { ArgumentParser } from '../utils/wheel_chief/argument_parser'
import { SpuScriptExecutor113To114 } from './executor'

export class UpdaterTo114 extends Updater {
    public static upLine(input: string, from: string): UpdateResult {
        const ans: UpdateResult = { command: input, warnings: [] }

        if (['18', '19', '111', '112'].indexOf(from) !== -1) {
            const result = UpdaterTo113.upLine(ans.command, from)
            ans.command = result.command
            ans.warnings = result.warnings
        } else if (from !== '113') {
            throw `Expected from version: '18', '19', '111', '112' or '113' but got '${from}'.`
        }

        const result = new UpdaterTo114().upSpgodingCommand(ans.command)

        ans.command = result.command
        ans.warnings = ans.warnings.concat(result.warnings)

        return ans
    }

    public upArgument(input: string, updater: string): string {
        switch (updater) {
            case 'spgoding:pre_tick_time':
                return this.upSpgodingPreTickTime(input)
            default:
                return super.upArgument(input, updater)
        }
    }

    protected upSpgodingCommand(input: string): UpdateResult {
        return WheelChief.update(input, Commands113To114.commands, new ArgumentParser(), this, new SpuScriptExecutor113To114())
    }

    protected upSpgodingBlockName(input: string): string {
        input = completeNamespace(input)

        const mapping: [string, string][] = [
            ['minecraft:sign', 'minecraft:oak_sign'],
            ['minecraft:wall_sign', 'minecraft:oak_wall_sign'],
            ['minecraft:stone_slab', 'minecraft:smooth_stone_slab']
        ]

        const result = mapping.find(v => v[0] === input)

        if (result) {
            input = result[1]
        }

        return input
    }

    protected upSpgodingItemName(input: string): string {
        input = completeNamespace(input)

        const mapping: [string, string][] = [
            ['minecraft:sign', 'minecraft:oak_sign'],
            ['minecraft:stone_slab', 'minecraft:smooth_stone_slab']
        ]

        const result = mapping.find(v => v[0] === input)

        if (result) {
            input = result[1]
        }

        return input
    }

    protected upSpgodingItemNbt(input: NbtCompound): NbtCompound {
        input = super.upSpgodingItemNbt(input)

        /* id */ {
            const id = input.get('id')
            if (id instanceof NbtString) {
                id.set(this.upSpgodingItemName(id.get()))
            }
        }

        return input
    }

    protected upSpgodingItemTagNbt(input: NbtCompound): NbtCompound {
        input = super.upSpgodingItemTagNbt(input)

        /* display.Lore */ {
            const display = input.get('display')
            if (display instanceof NbtCompound) {
                const lore = display.get('Lore')
                if (lore instanceof NbtList) {
                    lore.forEach((line: NbtString) => {
                        line.set(`{"text":"${escape(line.get())}"}`)
                    })
                }
            }

            return input
        }
    }

    private upSpgodingPreTickTime(input: string) {
        return `${input}t`
    }
}
