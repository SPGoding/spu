import Updater112To113 from './112to113/updater'
import Updater113To1131 from './113to1131/updater'

function $(id: string) {
    return <HTMLElement>document.getElementById(id)
}

let from_112 = $('from-112')
let from_113 = $('from-113')
let to_113 = $('to-113')
let to_1131 = $('to-1131')
let from: '1.12' | '1.13' = '1.12'
let to: '1.13' | '1.13.1' = '1.13.1'

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

                if (from === '1.12' && to === '1.13') {
                    line = Updater112To113.upLine(line, false)
                } else if (from === '1.13' && to === '1.13.1') {
                    line = Updater113To1131.upLine(line)
                } else if (from === '1.12' && to === '1.13.1') {
                    line = Updater113To1131.upLine(
                        Updater112To113.upLine(line, false)
                    )
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
        ;(<HTMLInputElement>$('output')).value = result
        $(frame).innerHTML = msg
        $(frame).style.display = ''
    }
}

from_112.onclick = () => {
    from_112.classList.replace('btn-default', 'btn-active')
    from_113.classList.replace('btn-active', 'btn-default')
    from = '1.12'
}
from_113.onclick = () => {
    from_112.classList.replace('btn-active', 'btn-default')
    from_113.classList.replace('btn-default', 'btn-active')
    from = '1.13'
}
to_113.onclick = () => {
    to_113.classList.replace('btn-default', 'btn-active')
    to_1131.classList.replace('btn-active', 'btn-default')
    to = '1.13'
}
to_1131.onclick = () => {
    to_113.classList.replace('btn-active', 'btn-default')
    to_1131.classList.replace('btn-default', 'btn-active')
    to = '1.13.1'
}