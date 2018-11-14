import { UpdaterTo19 } from './to19/updater'
import { UpdaterTo111 } from './to111/updater'
import { UpdaterTo112 } from './to112/updater'
import { UpdaterTo113 } from './to113/updater'
import { UpdaterTo114 } from './to114/updater'
import { isWhiteSpace, UpdateResult } from './utils/utils';

function $(id: string) {
    return <HTMLElement>document.getElementById(id)
}

let from_18 = $('from-18')
let from_19 = $('from-19')
let from_111 = $('from-111')
let from_112 = $('from-112')
let from_113 = $('from-113')
let to_19 = $('to-19')
let to_111 = $('to-111')
let to_112 = $('to-112')
let to_113 = $('to-113')
let to_114 = $('to-114')
let info = $('info')
let from: '18' | '19' | '111' | '112' | '113' = '113'
let to: '19' | '111' | '112' | '113' | '114' = '114'

info.style.display = 'none'

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

function resetButtonClasses(type: 'from' | 'to') {
    if (type === 'from') {
        from_18.classList.replace('btn-active', 'btn-default')
        from_19.classList.replace('btn-active', 'btn-default')
        from_111.classList.replace('btn-active', 'btn-default')
        from_112.classList.replace('btn-active', 'btn-default')
        from_113.classList.replace('btn-active', 'btn-default')
    } else {
        to_19.classList.replace('btn-active', 'btn-default')
        to_111.classList.replace('btn-active', 'btn-default')
        to_112.classList.replace('btn-active', 'btn-default')
        to_113.classList.replace('btn-active', 'btn-default')
        to_114.classList.replace('btn-active', 'btn-default')
    }
}

function resetButtonVisibility() {
    to_19.style.display = ''
    to_111.style.display = ''
    to_112.style.display = ''
    to_113.style.display = ''
    to_114.style.display = ''
}

from_18.onclick = () => {
    resetButtonClasses('from')
    from_18.classList.replace('btn-default', 'btn-active')

    resetButtonVisibility()

    from = '18'
}
from_19.onclick = () => {
    resetButtonClasses('from')
    from_19.classList.replace('btn-default', 'btn-active')

    resetButtonVisibility()
    to_19.style.display = 'none'

    from = '19'
}
from_111.onclick = () => {
    resetButtonClasses('from')
    from_111.classList.replace('btn-default', 'btn-active')

    resetButtonVisibility()
    to_19.style.display = 'none'
    to_111.style.display = 'none'

    from = '111'
}
from_112.onclick = () => {
    resetButtonClasses('from')
    from_112.classList.replace('btn-default', 'btn-active')

    resetButtonVisibility()
    to_19.style.display = 'none'
    to_111.style.display = 'none'
    to_112.style.display = 'none'

    from = '112'
}
from_113.onclick = () => {
    resetButtonClasses('from')
    from_113.classList.replace('btn-default', 'btn-active')

    resetButtonVisibility()
    to_19.style.display = 'none'
    to_111.style.display = 'none'
    to_112.style.display = 'none'
    to_113.style.display = 'none'

    from = '113'
}
to_19.onclick = () => {
    resetButtonClasses('to')
    to_19.classList.replace('btn-default', 'btn-active')
    to = '19'
}
to_111.onclick = () => {
    resetButtonClasses('to')
    to_111.classList.replace('btn-default', 'btn-active')
    to = '111'
}
to_112.onclick = () => {
    resetButtonClasses('to')
    to_112.classList.replace('btn-default', 'btn-active')
    to = '112'
}
to_113.onclick = () => {
    resetButtonClasses('to')
    to_113.classList.replace('btn-default', 'btn-active')
    to = '113'
}
to_114.onclick = () => {
    resetButtonClasses('to')
    to_114.classList.replace('btn-default', 'btn-active')
    to = '114'
}