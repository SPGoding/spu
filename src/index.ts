import Updater18To111 from './18to111/updater'
import Updater111To1122 from './111to1122/updater'
import Updater112To1131 from './1122to1131/updater'

function $(id: string) {
    return <HTMLElement>document.getElementById(id)
}

let from_18 = $('from-18')
let from_111 = $('from-111')
let from_1122 = $('from-1122')
let to_111 = $('to-111')
let to_1122 = $('to-112')
let to_1131 = $('to-1131')
let info = $('info')
let from: '18' | '111' | '1122' = '1122'
let to: '111' | '1122' | '1131' = '1131'

info.style.display = 'none'

$('button').onclick = () => {
    info.style.display = ''
    let number = 1
    let frame: 'success' | 'warning' | 'danger' = 'success'
    let msg = ""
    let result = ''
    try {
        let timeBefore = (new Date()).getTime()
        let content = (<HTMLInputElement>$('input')).value
        if (content) {
            let lines = content.toString().split('\n')

            for (let line of lines) {
                number = lines.indexOf(line)

                if (from === '18' && to === '111') {
                    line = Updater18To111.upLine(line)
                } else if (from === '18' && to === '1122') {
                    line = Updater111To1122.upLine(
                        Updater111To1122.upLine(line)
                    )
                } else if (from === '18' && to === '1131') {
                    line = Updater112To1131.upLine(
                        Updater111To1122.upLine(
                            Updater18To111.upLine(line)
                        )
                    )
                } else if (from === '111' && to === '1122') {
                    line = Updater111To1122.upLine(line)
                } else if (from === '111' && to === '1131') {
                    line = Updater112To1131.upLine(
                        Updater111To1122.upLine(line)
                    )
                } else if (from === '1122' && to === '1131') {
                    line = Updater112To1131.upLine(line)
                }

                if (line.indexOf(' !> ') !== -1) {
                    frame = 'warning'
                    msg += `Line #${number + 1}: ${line.slice(line.indexOf(' !> ') + 4).replace(/ !> /g, '<br />')}<br />`
                    line = line.slice(0, line.indexOf(' !> '))
                }
                result += line + '\n'
            }

            result = result.slice(0, -1) // Remove the last line.
            let timeAfter = (new Date()).getTime()
            let timeDelta = timeAfter - timeBefore
            msg = `Updated ${lines.length} line${lines.length === 1 ? '' : 's'} (in ${(timeDelta / 1000).toFixed(3)} seconds).<br />${msg}`
        }
    } catch (ex) {
        frame = 'danger'
        msg = `Updated error. <br />Line #${number + 1}: ${ex}`
        result = ''
    } finally {
        ; (<HTMLInputElement>$('output')).value = result
        info.innerHTML = msg
        info.classList.replace('alert-success', `alert-${frame}`)
        info.classList.replace('alert-danger', `alert-${frame}`)
        info.classList.replace('alert-warning', `alert-${frame}`)
    }
}

function resetButtons(type: 'from' | 'to') {
    if (type === 'from') {
        from_18.classList.replace('btn-active', 'btn-default')
        from_111.classList.replace('btn-active', 'btn-default')
        from_1122.classList.replace('btn-active', 'btn-default')
    } else {
        to_111.classList.replace('btn-active', 'btn-default')
        to_1122.classList.replace('btn-active', 'btn-default')
        to_1131.classList.replace('btn-active', 'btn-default')
    }
}

from_18.onclick = () => {
    resetButtons('from')
    from_18.classList.replace('btn-default', 'btn-active')
    from = '18'
}
from_111.onclick = () => {
    resetButtons('from')
    from_111.classList.replace('btn-default', 'btn-active')
    from = '111'
}
from_1122.onclick = () => {
    resetButtons('from')
    from_1122.classList.replace('btn-default', 'btn-active')
    from = '1122'
}
to_111.onclick = () => {
    resetButtons('to')
    to_111.classList.replace('btn-default', 'btn-active')
    to = '111'
}
to_1122.onclick = () => {
    resetButtons('to')
    to_1122.classList.replace('btn-default', 'btn-active')
    to = '1122'
}
to_1131.onclick = () => {
    resetButtons('to')
    to_1131.classList.replace('btn-default', 'btn-active')
    to = '1131'
}