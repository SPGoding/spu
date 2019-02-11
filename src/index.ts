import { UpdaterTo19 } from './to19/updater'
import { UpdaterTo111 } from './to111/updater'
import { UpdaterTo112 } from './to112/updater'
import { UpdaterTo113 } from './to113/updater'
import { UpdaterTo114 } from './to114/updater'
import { isWhiteSpace, UpdateResult } from './utils/utils';

// 转换按钮回调函数
function transform(content : string, from: number, to : number ,callBack : (state: string, commands: string[], log: string[]) => void){
    let number = 1
    let frame: 'success' | 'warning' | 'danger' = 'success'
    let msg : string[] = []
    let ans : string[] = []
    try {
        let timeBefore = (new Date()).getTime()
        if (content) {
            const lines = content.toString().split('\n')

            for (const line of lines) {
                number = lines.indexOf(line)

                let result: UpdateResult

                if (line[0] === '#' || isWhiteSpace(line)) {
                    result = { command: line, warnings: [] }
                } else {
                    if (to === 14) {
                        result = UpdaterTo114.upLine(line, '1' + from)
                    } else if (to === 13) {
                        result = UpdaterTo113.upLine(line, '1' + from)
                    } else if (to === 12) {
                        result = UpdaterTo112.upLine(line, '1' + from)
                    } else if (to === 11) {
                        result = UpdaterTo111.upLine(line, '1' + from)
                    } else if (to === 9) {
                        result = UpdaterTo19.upLine(line, '1' + from)
                    } else {
                        throw `Unknown to version: '${to}'.`
                    }
                }

                result.warnings = result.warnings.filter(v => !isWhiteSpace(v))

                if (result.warnings.length > 0) {
                    frame = 'warning'
                    msg.push(`Line #${number + 1}:`)
                    for (const warning of result.warnings) {
                        msg.push(`    ${warning}`)
                    }
                }
                ans.push(result.command)
            }

            const timeAfter = (new Date()).getTime()
            const timeDelta = timeAfter - timeBefore
            msg.push(`Updated ${lines.length} line${lines.length === 1 ? '' : 's'} (in ${(timeDelta / 1000).toFixed(3)} seconds).`)
        }
    } catch (ex) {
        callBack('danger', [], [`Updated error at line #${number + 1}: ${ex}`])
    } finally {
        callBack(frame, ans, msg)
    }
}

/**
 * @description 该模块唯一一个可调用的函数，用于升级命令
 * @param {string} command 欲转换的命令集
 * @param {number} from 原始命令集的所属游戏版本，传递一个数字进来，例如传递 8 代笔游戏版本 1.8
 * @param {number} to 欲转换到的游戏版本。也是传递一个数字进来，例如传递 14 代表游戏版本 1.14
 * @param {(string, string[], string[]) => void} callBack 回调函数，其中的参数分别为状态、转换得到的命令字符串数组、日志字符串数组
 */
export let transformCommand = transform