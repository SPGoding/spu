/**
 *     _______..______     _______   ______    _______   __  .__   __.   _______
 *     /       ||   _  \   /  _____| /  __  \  |       \ |  | |  \ |  |  /  _____|
 *    |   (----`|  |_)  | |  |  __  |  |  |  | |  .--.  ||  | |   \|  | |  |  __
 *     \   \    |   ___/  |  | |_ | |  |  |  | |  |  |  ||  | |  . `  | |  | |_ |
 * .----)   |   |  |      |  |__| | |  `--'  | |  '--'  ||  | |  |\   | |  |__| |
 * |_______/    | _|       \______|  \______/  |_______/ |__| |__| \__|  \______|
 *
 */
import Updater from './112to113/updater'

$(document).ready(() => {
    $('#warn').hide()
    $('#error').hide()
    $('#info').hide()
    $('#success').hide()
    $('#button').click(() => {
        $('#warn').hide()
        $('#error').hide()
        $('#success').hide()
        $('#info').show()
        $('#info').html('Updating...')

        let number = 1
        let frame: 'success' | 'warn' | 'error' = 'success'
        let msg = ""
        let result = ''
        try {
            let timeBefore = (new Date()).getTime()
            let content = $('#input').val()
            if (content) {
                let lines = content.toString().split('\n')

                for (let line of lines) {
                        number = lines.indexOf(line)
                        line = Updater.upLine(line, $('#position-correct').is(':checked'))
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
            $('#output').html(result)
            $(`#${frame}`).html(msg)
            $(`#${frame}`).show()
        }
    })
})