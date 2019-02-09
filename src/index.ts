import { UpdaterTo19 } from './to19/updater'
import { UpdaterTo111 } from './to111/updater'
import { UpdaterTo112 } from './to112/updater'
import { UpdaterTo113 } from './to113/updater'
import { UpdaterTo114 } from './to114/updater'
import { isWhiteSpace, UpdateResult } from './utils/utils';

function $(id: string) {
    return <HTMLElement>document.getElementById(id)
}

let info = $('info')
let from: '18' | '19' | '111' | '112' | '113' = '113'
let to: '19' | '111' | '112' | '113' | '114' = '114'

info.style.display = 'none'

// 转换按钮
$('button').onclick = () => {
    info.style.display = ''
    let number = 1
    let frame: 'success' | 'warning' | 'danger' = 'success'
    let msg = ''
    let ans = ''
    try {
        let timeBefore = (new Date()).getTime()
        let content = (<HTMLInputElement>$('input')).value
        if (content) {
            const lines = content.toString().split('\n')

            for (const line of lines) {
                number = lines.indexOf(line)

                let result: UpdateResult

                if (line[0] === '#' || isWhiteSpace(line)) {
                    result = { command: line, warnings: [] }
                } else {
                    if (to === '114') {
                        result = UpdaterTo114.upLine(line, from)
                    } else if (to === '113') {
                        result = UpdaterTo113.upLine(line, from)
                    } else if (to === '112') {
                        result = UpdaterTo112.upLine(line, from)
                    } else if (to === '111') {
                        result = UpdaterTo111.upLine(line, from)
                    } else if (to === '19') {
                        result = UpdaterTo19.upLine(line, from)
                    } else {
                        throw `Unknown to version: '${to}'.`
                    }
                }

                result.warnings = result.warnings.filter(v => !isWhiteSpace(v))

                if (result.warnings.length > 0) {
                    frame = 'warning'
                    msg += `Line #${number + 1}: <br />`
                    for (const warning of result.warnings) {
                        msg += `    ${warning}<br />`
                    }
                }
                ans += result.command + '\n'
            }

            ans = ans.slice(0, -1) // Remove the last line.
            const timeAfter = (new Date()).getTime()
            const timeDelta = timeAfter - timeBefore
            msg = `Updated ${lines.length} line${lines.length === 1 ? '' : 's'} (in ${(timeDelta / 1000).toFixed(3)} seconds).<br />${msg}`
        }
    } catch (ex) {
        frame = 'danger'
        msg = `Updated error. <br />Line #${number + 1}: ${ex}`
        ans = ''
    } finally {
        ; (<HTMLInputElement>$('output')).value = ans
        info.innerHTML = msg
        info.classList.replace('alert-success', `alert-${frame}`)
        info.classList.replace('alert-danger', `alert-${frame}`)
        info.classList.replace('alert-warning', `alert-${frame}`)
    }
}