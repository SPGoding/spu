import Converter from './converter'

$(document).ready(function() {
    $('#button').click(function() {
        let result = ''
        let content = $('#input').val()
        if (content) {
            let lines = content.toString().split('\n')
            for (let line of lines) {
                line = Converter.cvtLine(line)
                result += line + '<br>'
            }
            $('#output').html(result)
        }
    })
})
