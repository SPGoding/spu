/**
 *     _______..______     _______   ______    _______   __  .__   __.   _______
 *     /       ||   _  \   /  _____| /  __  \  |       \ |  | |  \ |  |  /  _____|
 *    |   (----`|  |_)  | |  |  __  |  |  |  | |  .--.  ||  | |   \|  | |  |  __
 *     \   \    |   ___/  |  | |_ | |  |  |  | |  |  |  ||  | |  . `  | |  | |_ |
 * .----)   |   |  |      |  |__| | |  `--'  | |  '--'  ||  | |  |\   | |  |__| |
 * |_______/    | _|       \______|  \______/  |_______/ |__| |__| \__|  \______|
 *
 */

import Converter from './converter'

$(document).ready(function() {
    $('#button').click(function() {
        try {
            let result = ''
            let content = $('#input').val()
            if (content) {
                let lines = content.toString().split('\n')
                for (let line of lines) {
                    line = Converter.cvtLine(line, $('#position-correct').is(':checked'))
                    result += line + '<br>'
                }
                $('#output').html(result)
            }
        } catch (ex) {
            console.error(`Converted error: ${ex}`)
            alert(ex)
        }
    })
})
