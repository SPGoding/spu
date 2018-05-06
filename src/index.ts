import Converter from './converter'

$(document).ready(function() {
    $('#button').click(function() {
        let result = ''
        let lines = $('#input').val().toString().split('\n')
        for (let line of lines) {
            line = Converter.cvtLine(line)
            result += line + '<br>'
        }
        $('#output').html(result)
    })
})
