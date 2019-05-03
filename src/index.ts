import { UpdaterTo19 } from './to19/updater'
import { UpdaterTo111 } from './to111/updater'
import { UpdaterTo112 } from './to112/updater'
import { UpdaterTo113 } from './to113/updater'
import { UpdaterTo114 } from './to114/updater'
import { isWhiteSpace, UpdateResult } from './utils/utils'

export interface Result {
    /**
     * All updated commands.
     */
    commands: string[],
    /**
     * Human-readable logs.
     */
    logs: string[],
    /**
     * `success` means success.  
     * `warning` means that the commands are correct but spu can't update it cuz of some reasons, like Minecraft totally removed them in further versions.
     * `error` means that the commands have syntax error(s).
     */
    state: 'success' | 'warning' | 'error'
}

/**
 * Update command(s).
 * @param commands The command(s) that will be updated. Support blank lines and comments. Support slashes(`/`) before commands.
 * @param from The original version of the command(s). `X` stands for *Minecraft Java Edition 1.X*.
 * @param to The target version. `X` stands for *Minecraft Java Edition 1.X*.
 */
export function update(commands: string[], from: number, to: number): Result {
    let state: 'success' | 'warning' | 'error' = 'success'
    const logs: string[] = []
    const updatedCommands: string[] = []
    const timeBefore = (new Date()).getTime()

    // The following region is used to update the input content line by line.
    for (let i = 0; i < commands.length; i++) {
        try {
            const line = commands[i]

            let result: UpdateResult

            if (line[0] === '#' || isWhiteSpace(line)) {
                // Handle comments or empty lines.
                result = { command: line, warnings: [] }
            } else {
                // Handle commands.
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
                    throw `Unknown version: '${to}'.`
                }
            }

            result.warnings = result.warnings.filter(v => !isWhiteSpace(v))
            if (result.warnings.length > 0) {
                state = 'warning'
                let log = `Warnings detected when updating Line #${i + 1}: \n`
                log += result.warnings.join('\n    - ')
                logs.push(log)
            }
            updatedCommands.push(result.command)
        } catch (ex) {
            // We meet some syntax errors.
            // Stop updating immediately. We will not return any updated commands, even though they are correct.
            // Because spu is an updater, not a linter. We expect all the input are definitely correct.
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
     * The time cost to update the input.
     */
    const timeDelta = timeAfter - timeBefore
    logs.push(`Updated ${commands.length} line${commands.length === 1 ? '' : 's'} (in ${(timeDelta / 1000).toFixed(3)} seconds).`)

    return { commands: updatedCommands, logs, state }
}
