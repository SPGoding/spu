import { SpuScriptExecutor, WheelChief, Argument } from '../utils/wheel_chief/wheel_chief'
import { Commands113To114 } from './commands'
import { Updater } from '../utils/wheel_chief/updater'
import { escape, completeNamespace, UpdateResult } from '../utils/utils'
import { NbtCompound, NbtList, NbtString } from '../utils/nbt/nbt'
import { UpdaterTo113 } from '../to113/updater';

export class SpuScriptExecutor113To114 implements SpuScriptExecutor {
    public execute(script: string, args: Argument[]): string {
        let splited = script.split(' ')

        for (let i = 0; i < splited.length; i++) {
            if (splited[i].slice(0, 1) === '%') {
                splited[i] = args[parseInt(splited[i].slice(1))].value
            } else if (splited[i].slice(0, 1) === '$') {
                let params = splited[i].slice(1).split('%')
                switch (params[0]) {
                    default:
                        throw `Unexpected script method: '${params[0]}'.`
                }
            }
        }

        return splited.join(' ')
    }
}

export class UpdaterTo114 extends Updater {
    public static upLine(input: string, from: string): UpdateResult {
        const ans: UpdateResult = { command: input, warnings: []}

        if (['18', '19', '111', '112'].indexOf(from) !== -1) {
            const result = UpdaterTo113.upLine(ans.command, from)
            ans.command = result.command
            ans.warnings = result.warnings
        } else if (from !== '113') {
            throw `Expected from version: '18', '19', '111', '112' or '113' but got '${from}'.`
        }

        ans.command = new UpdaterTo114().upSpgodingCommand(ans.command)

        if (ans.command.indexOf(' !> ') !== -1) {
            ans.warnings.push(ans.command.split(' !> ').slice(-1)[0])
            ans.command = ans.command.split(' !> ').slice(0, -1).join(' !> ')
        }

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

    protected upSpgodingCommand(input: string): string {
        return WheelChief.update(input, Commands113To114.commands, new SpuScriptExecutor113To114(), this)
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

    protected upSpgodingItemTagNbt(input: NbtCompound): NbtCompound {
        input = super.upSpgodingItemTagNbt(input)

        /* display.Lore */ {
            let display = input.get('display')
            if (display instanceof NbtCompound) {
                let lore = display.get('Lore')
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
