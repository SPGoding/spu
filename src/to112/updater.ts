import { WheelChief } from '../utils/wheel_chief/wheel_chief'
import { Commands111To112 } from './commands'
import { Updater } from '../utils/wheel_chief/updater'
import { UpdateResult } from '../utils/utils'
import { UpdaterTo111 } from '../to111/updater'
import { SpuScriptExecutor111To112 } from './executor'
import { ArgumentParser111To112 } from './parser'

export class UpdaterTo112 extends Updater {
    public static upLine(input: string, from: string): UpdateResult {
        const ans: UpdateResult = { command: input, warnings: [] }

        if (['18', '19'].indexOf(from) !== -1) {
            const result = UpdaterTo111.upLine(ans.command, from)
            ans.command = result.command
            ans.warnings = result.warnings
        } else if (from !== '111') {
            throw `Expected from version: '18', '19' or '111' but got '${from}'.`
        }

        const result = new UpdaterTo112().upSpgodingCommand(ans.command)

        ans.command = result.command
        ans.warnings = ans.warnings.concat(result.warnings)

        return ans
    }

    protected upSpgodingCommand(input: string) {
        const result = WheelChief.update(input, Commands111To112.commands,
            new ArgumentParser111To112(), this, new SpuScriptExecutor111To112())
        return { command: result.command, warnings: result.warnings }
    }

    protected upSpgodingTargetSelector(input: string) {
        return input
    }
}
