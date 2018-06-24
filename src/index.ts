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

$(document).ready(function() {
    $('#warn').hide()
    $('#error').hide()
    $('#button').click(function() {
        let number = 1
        try {
            let result = ''
            let warn = '警告：<br />'
            let content = $('#input').val()
            if (content) {
                let lines = content.toString().split('\n')
                for (let line of lines) {
                    number = lines.indexOf(line)
                    line = Updater.upLine(line, $('#position-correct').is(':checked'))
                    if (line.indexOf('!>') !== -1) {
                        warn += `Line ${number + 1}：${line.slice(line.indexOf('!>') + 2)}<br />`
                        line = line.slice(0, line.indexOf('!>') - 1)
                    }
                    result += line + '\n'
                }
                result = result.slice(0, -1) // Remove the last line.
                $('#output').html(result)
                $('#warn').html(warn)
                if (warn === '警告：<br />') {
                    $('#warn').hide()
                } else {
                    $('#warn').show()
                }
                $('#error').hide()
            }
        } catch (ex) {
            $('#output').html('')
            $('#warn').hide()
            $('#error').html(`错误：<br />Line ${number}: ${ex}`)
            $('#error').show()
        }
    })
})
