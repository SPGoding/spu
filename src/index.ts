/**
 *     _______..______     _______   ______    _______   __  .__   __.   _______
 *     /       ||   _  \   /  _____| /  __  \  |       \ |  | |  \ |  |  /  _____|
 *    |   (----`|  |_)  | |  |  __  |  |  |  | |  .--.  ||  | |   \|  | |  |  __
 *     \   \    |   ___/  |  | |_ | |  |  |  | |  |  |  ||  | |  . `  | |  | |_ |
 * .----)   |   |  |      |  |__| | |  `--'  | |  '--'  ||  | |  |\   | |  |__| |
 * |_______/    | _|       \______|  \______/  |_______/ |__| |__| \__|  \______|
 *
 */

import Updater from './updater'

$(document).ready(function () {
    $('#warn').hide()
    $('#error').hide()
    $('#info').hide()
    $('#button').click(function () {
        let number = 1
        let frame: 'info' | 'warn' | 'error' = 'info'
        let output = ""
        try {
            let timeBefore = (new Date()).getTime()
            let result = ''
            let content = $('#input').val()
            if (content) {
                let lines = content.toString().split('\n')
                for (let line of lines) {
                    number = lines.indexOf(line)
                    line = Updater.upLine(line, $('#position-correct').is(':checked'))
                    if (line.indexOf('!>') !== -1) {
                        frame = 'warn'
                        output += `Line #${number + 1}：${line.slice(line.indexOf('!>') + 2)}<br />`
                        line = line.slice(0, line.indexOf('!>') - 1)
                    }
                    result += line + '\n'
                }
                result = result.slice(0, -1) // Remove the last line.
                $('#output').html(result)
                let timeAfter = (new Date()).getTime()
                let timeDelta = timeAfter - timeBefore
                output = `Updated ${lines.length} line${lines.length === 1 ? '' : 's'} (in ${(timeDelta / 1000).toFixed(3)} seconds).<br />${output}`
            }
        } catch (ex) {
            frame = 'error'
            output = `Updated error. <br />Line #${number + 1}: ${ex}`
        } finally {
            $('#info').hide()
            $('#warn').hide()
            $('#error').hide()
            $(`#${frame}`).html(output)
            $(`#${frame}`).show()
        }
    })
})
