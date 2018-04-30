import Converter from './converter'
import Selector from './selector'

$(document).ready(function() {
    $('#button').click(function() {
        let result = ''
        let lines = $('#input').val().toString().split('\n')
        for (let line of lines) {
            line = Converter.line(line)
            result += line + '<br>'
        }
        $('#output').html(result)
    })
})