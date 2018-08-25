import Updater18To111 from './18to111/updater'
import Updater111To112 from './111to112/updater'
import Updater112To113 from './112to113/updater'

function $(id: string) {
    return <HTMLElement>document.getElementById(id)
}

let from_18 = $('from-18')
let from_111 = $('from-111')
let from_112 = $('from-112')
let to_111 = $('to-111')
let to_112 = $('to-112')
let to_113 = $('to-113')
let from: '1.8' | '1.11' | '1.12' = '1.12'
let to: '1.11' | '1.12' | '1.13' = '1.13'

$('warn').style.display = 'none'
$('error').style.display = 'none'
$('info').style.display = 'none'
$('success').style.display = 'none'
$('button').onclick = () => {
    $('warn').style.display = 'none'
    $('error').style.display = 'none'
    $('success').style.display = 'none'
    $('info').style.display = ''
    $('info').innerHTML = 'Updating...'

    let number = 1
    let frame: 'success' | 'warn' | 'error' = 'success'
    let msg = ""
    let result = ''
    try {
        let timeBefore = (new Date()).getTime()
        let content = (<HTMLInputElement>$('input')).value
        if (content) {
            let lines = content.toString().split('\n')

            for (let line of lines) {
                number = lines.indexOf(line)

                if (from === '1.8' && to === '1.11') {
                    line = Updater18To111.upLine(line)
                } else if (from === '1.8' && to === '1.12') {
                    line = Updater111To112.upLine(
                        Updater111To112.upLine(line)
                    )
                } else if (from === '1.8' && to === '1.13') {
                    line = Updater112To113.upLine(
                        Updater111To112.upLine(
                            Updater18To111.upLine(line)
                        ), false
                    )
                } else if (from === '1.11' && to === '1.12') {
                    line = Updater111To112.upLine(line)
                } else if (from === '1.11' && to === '1.13') {
                    line = Updater112To113.upLine(
                        Updater111To112.upLine(line), false
                    )
                } else if (from === '1.12' && to === '1.13') {
                    line = Updater112To113.upLine(line, false)
                }

                if (line.indexOf('!>') !== -1) {
                    frame = 'warn'
                    msg += `Line #${number + 1}：${line.slice(line.indexOf('!>') + 2)}<br />`
                    line = line.slice(0, line.indexOf('!>') - 1)
                }
                result += line + '\n'
            }

            result = result.slice(0, -1) // Remove the last line.
            let timeAfter = (new Date()).getTime()
            let timeDelta = timeAfter - timeBefore
            msg = `Updated ${lines.length} line${lines.length === 1 ? '' : 's'} (in ${(timeDelta / 1000).toFixed(3)} seconds).<br />${msg}`
        }
    } catch (ex) {
        frame = 'error'
        msg = `Updated error. <br />Line #${number + 1}: ${ex}`
        result = ''
    } finally {
        $('info').style.display = 'none'
            ; (<HTMLInputElement>$('output')).value = result
        $(frame).innerHTML = msg
        $(frame).style.display = ''
    }
}

function resetButtons(type: 'from' | 'to') {
    if (type === 'from') {
        from_18.classList.replace('btn-active', 'btn-default')
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
    from = '1.8'
}
from_111.onclick = () => {
    resetButtons('from')
    from_111.classList.replace('btn-default', 'btn-active')
    from = '1.11'
}
from_112.onclick = () => {
    resetButtons('from')
    from_112.classList.replace('btn-default', 'btn-active')
    from = '1.12'
}
to_111.onclick = () => {
    resetButtons('to')
    to_111.classList.replace('btn-default', 'btn-active')
    to = '1.11'
}
to_112.onclick = () => {
    resetButtons('to')
    to_112.classList.replace('btn-default', 'btn-active')
    to = '1.12'
}
to_113.onclick = () => {
    resetButtons('to')
    to_113.classList.replace('btn-default', 'btn-active')
    to = '1.13'
}