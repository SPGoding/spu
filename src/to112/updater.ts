import { SpuScriptExecutor, WheelChief, Argument, ParseResult } from '../utils/wheel_chief/wheel_chief'
import { Commands111To112 } from './commands'
import { Updater } from '../utils/wheel_chief/updater'
import { TargetSelector as TargetSelector112 } from './target_selector'
import { UpdateResult } from '../utils/utils';
import { UpdaterTo111 } from '../bad_practice/to111/updater';

class SpuScriptExecutor111To112 implements SpuScriptExecutor {
    public execute(script: string, args: Argument[]) {
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
}
