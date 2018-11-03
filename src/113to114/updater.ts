import { SpuScriptExecutor, WheelChief, Argument } from '../utils/wheel_chief/wheel_chief'
import { Commands113 } from './commands'
import { Updater } from '../utils/wheel_chief/updater'
import { escape } from '../utils/utils';
import { NbtCompound, NbtList, NbtString } from '../utils/nbt/nbt';

export class SpuScriptExecutor113To114 implements SpuScriptExecutor {
    public execute(script: string, args: Argument[]): string {
        let splited = script.split(' ')

        for (let i = 0; i < splited.length; i++) {
            if (splited[i].slice(0, 1) === '%') {
                splited[i] = args[parseInt(splited[i].slice(1))].value
            } else if (splited[i].slice(0, 1) === '$') {
                let params = splited[i].slice(1).split('%')
                switch (params[0]) {
                    case 'toTick':
                        splited[i] = `${args[parseInt(params[1])]}t`
                        break
                    default:
                        throw `Unexpected script method: '${params[0]}'.`
                }
            }
        }

        return splited.join(' ')
    }
}

export default class Updater113To114 extends Updater {
    public static upLine(input: string, from: string) {
        if (from !== '113') {
            // TODO: Recursion update.
            // input = Updater112To113.upLine(input, from)
        }
        return new Updater113To114().upSpgodingCommand(input)
    }

    public upArgument(input: string, updater: string): string {
        switch (updater) {
            case 'spgoding:pre_tick_time':
                return this.upPreTickTime(input)
            default:
                return super.upArgument(input, updater)
        }
    }

    protected upSpgodingCommand(input: string): string {
        return WheelChief.update(input, Commands113.commands, new SpuScriptExecutor113To114(), this)
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

    private upPreTickTime(input: string) {
        return `${input}t`
    }
}
