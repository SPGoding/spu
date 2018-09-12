import Updater18To111 from './18to111/updater'
import Updater19To111 from './19to111/updater'
import Updater111To112 from './111to112/updater'
import Updater112To113 from './112to113/updater'

function $(id: string) {
    return <HTMLElement>document.getElementById(id)
}

let from_18 = $('from-18')
let from_19 = $('from-19')
let from_111 = $('from-111')
let from_112 = $('from-112')
let to_111 = $('to-111')
let to_112 = $('to-112')
let to_113 = $('to-113')
let info = $('info')
let from: '18' | '19' | '111' | '112' = '112'
let to: '111' | '112' | '113' = '113'

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

                if (from === '19' && to === '111') {
                    line = Updater19To111.upLine(line)
                } else if (from === '19' && to === '112') {
                    line = Updater111To112.upLine(
                        Updater19To111.upLine(line)
                    )
                } else if (from === '19' && to === '113') {
                    line = Updater112To113.upLine(
                        Updater111To112.upLine(
                            Updater19To111.upLine(line)
                        )
                    )
                } else if (from === '111' && to === '112') {
                    line = Updater111To112.upLine(line)
                } else if (from === '111' && to === '113') {
                    line = Updater112To113.upLine(
                        Updater111To112.upLine(line)
                    )
                } else if (from === '112' && to === '113') {
                    line = Updater112To113.upLine(line)
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
        from_19.classList.replace('btn-active', 'btn-default')
        from_111.classList.replace('btn-active', 'btn-default')
        from_112.classList.replace('btn-active', 'btn-default')
    } else {
        to_111.classList.replace('btn-active', 'btn-default')
        to_112.classList.replace('btn-active', 'btn-default')
        to_113.classList.replace('btn-active', 'btn-default')
    }
}

from_18.onclick = () => {
    resetButtons('from')
    from_18.classList.replace('btn-default', 'btn-active')
    from = '18'
}
from_19.onclick = () => {
    resetButtons('from')
    from_19.classList.replace('btn-default', 'btn-active')
    from = '19'
}
from_111.onclick = () => {
    resetButtons('from')
    from_111.classList.replace('btn-default', 'btn-active')
    from = '111'
}
from_112.onclick = () => {
    resetButtons('from')
    from_112.classList.replace('btn-default', 'btn-active')
    from = '112'
}
to_111.onclick = () => {
    resetButtons('to')
    to_111.classList.replace('btn-default', 'btn-active')
    to = '111'
}
to_112.onclick = () => {
    resetButtons('to')
    to_112.classList.replace('btn-default', 'btn-active')
    to = '112'
}
to_113.onclick = () => {
    resetButtons('to')
    to_113.classList.replace('btn-default', 'btn-active')
    to = '113'
}