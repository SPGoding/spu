import { UpdaterTo19 } from './to19/updater'
import { UpdaterTo111 } from './to111/updater'
import { UpdaterTo112 } from './to112/updater'
import { UpdaterTo113 } from './to113/updater'
import { UpdaterTo114 } from './to114/updater'
import { isWhiteSpace, UpdateResult } from './utils/utils'

interface Result { state: 'success' | 'warning' | 'error', commands: string[], logs: string[] }


/**
 * @description 该模块唯一一个可调用的函数，用于升级命令
 * @param {string} command 欲转换的命令集
 * @param {number} from 原始命令集的所属游戏版本，传递一个数字进来，例如传递 `8` 代表游戏版本 1.8
 * @param {number} to 欲转换到的游戏版本。也是传递一个数字进来，例如传递 `14` 代表游戏版本 1.14
 */
export function transformCommand(content: string, from: number, to: number): Result {
    /**
     * `success` means success.  
     * `warning` means that the commands are correct but we can't update it cuz of some reasons, like Minecraft totally removed them in further versions, or the changes is so break that we can't update it.  
     * `error` means that the commands have syntax error.
     */
    let state: 'success' | 'warning' | 'error' = 'success'
    /**
     * All information that will be showed to users after updating commands.
     * Each element will be showed in seperate dialogue.
     */
    const logs: string[] = []
    /**
     * All commands which are updated.
     */
    const commands: string[] = []
    const timeBefore = (new Date()).getTime()
    const lines = content.split('\n')

    // The following region is used to update the input content line by line.
    for (let i = 0; i < lines.length; i++) {
        try {
            const line = lines[i]

            let result: UpdateResult

            if (line[0] === '#' || isWhiteSpace(line)) {
                // Handle comments or empty lines.
                result = { command: line, warnings: [] }
            } else {
                // Handle ordinary commands.
                if (to === 14) {
                    result = UpdaterTo114.upLine(line, `1${from}`)
                } else if (to === 13) {
                    result = UpdaterTo113.upLine(line, `1${from}`)
                } else if (to === 12) {
                    result = UpdaterTo112.upLine(line, `1${from}`)
                } else if (to === 11) {
                    result = UpdaterTo111.upLine(line, `1${from}`)
                } else if (to === 9) {
                    result = UpdaterTo19.upLine(line, `1${from}`)
                } else {
                    throw `Unknown version: '${to}'. This should NEVER happen :(`
                }
            }

            result.warnings = result.warnings.filter(v => !isWhiteSpace(v))
            if (result.warnings.length > 0) {
                // We meet some warnings.
                // Never mind.
                state = 'warning'
                // [TODO] Solved the new line break problem in a odd way.
                let log = `Warnings detected when updating Line #${i + 1}: \n`
                log += result.warnings.join('\n    - ')
                logs.push(log)
            }
            commands.push(result.command)
        } catch (ex) {
            // We meet some syntax errors.
            // Stop updating immediately. We will not return any updated commands, even though they are correct.
            // Because spu is an updater, not a linter. We expect all the input content are definitely correct.
            // It's even reasonable to crash when we receive commands which have syntax errors :P
            const ans: Result = {
                commands: [],
                state: 'error',
                logs: [`Errors occurred when updating Line #${i + 1}: ${ex}`]
            }

            return ans
        }
    }

    const timeAfter = (new Date()).getTime()
    /**
     * The time cost to update the input content.
     */
    const timeDelta = timeAfter - timeBefore
    logs.push(`Updated ${lines.length} line${lines.length === 1 ? '' : 's'} (in ${(timeDelta / 1000).toFixed(3)} seconds).`)

    return { commands, logs, state }
}
