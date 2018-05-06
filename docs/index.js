"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("./converter");
$(document).ready(function () {
    $('#button').click(function () {
        let result = '';
        let lines = $('#input').val().toString().split('\n');
        for (let line of lines) {
            line = converter_1.default.cvtLine(line);
            result += line + '<br>';
        }
        $('#output').html(result);
    });
});
//# sourceMappingURL=index.js.map