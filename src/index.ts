/**
 *     _______..______     _______   ______    _______   __  .__   __.   _______
 *     /       ||   _  \   /  _____| /  __  \  |       \ |  | |  \ |  |  /  _____|
 *    |   (----`|  |_)  | |  |  __  |  |  |  | |  .--.  ||  | |   \|  | |  |  __
 *     \   \    |   ___/  |  | |_ | |  |  |  | |  |  |  ||  | |  . `  | |  | |_ |
 * .----)   |   |  |      |  |__| | |  `--'  | |  '--'  ||  | |  |\   | |  |__| |
 * |_______/    | _|       \______|  \______/  |_______/ |__| |__| \__|  \______|
 *
 */
import Updater112To113 from './112to113/updater'
import Updater113To1131 from './113to1131/updater'

$(document).ready(() => {
    let from_112 = <HTMLButtonElement>document.getElementById('from-112')
    let from_113 = <HTMLButtonElement>document.getElementById('from-113')
    let to_113 = <HTMLButtonElement>document.getElementById('to-113')
    let to_1131 = <HTMLButtonElement>document.getElementById('to-1131')
    let from: '1.12' | '1.13' = '1.12'
    let to: '1.13' | '1.13.1' = '1.13.1'

    $('#warn').hide()
    $('#error').hide()
    $('#info').hide()
    $('#success').hide()
    $('#button').click(() => {
        $('#warn').hide()
        $('#error').hide()
        $('#success').hide()
        $('#info').show()
        ;(<HTMLElement>document.getElementById('info')).innerHTML = 'Updating...'

        let number = 1
        let frame: 'success' | 'warn' | 'error' = 'success'
        let msg = ""
        let result = ''
        try {
            let timeBefore = (new Date()).getTime()
            let content = (<HTMLInputElement>document.getElementById('input')).value
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
            $('#info').hide()
            ;(<HTMLInputElement>document.getElementById('output')).value = result
            ;(<HTMLElement>document.getElementById(frame)).innerHTML = msg
            $(`#${frame}`).show()
        }
    })

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
})