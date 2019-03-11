"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("./nbt/tokenizer");
const parser_1 = require("./nbt/parser");
function isNumeric(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}
exports.isNumeric = isNumeric;
function isWhiteSpace(char) {
    return char === '' || [' ', '\t', '\n', '\r'].indexOf(char) !== -1;
}
exports.isWhiteSpace = isWhiteSpace;
function getNbtCompound(str, version = 'after 1.12') {
    const tokenizer = new tokenizer_1.Tokenizer();
    const tokens = tokenizer.tokenize(str, version);
    const parser = new parser_1.Parser();
    const nbt = parser.parseCompounds(tokens, version);
    return nbt;
}
exports.getNbtCompound = getNbtCompound;
function getNbtList(str, version = 'after 1.12') {
    const tokenizer = new tokenizer_1.Tokenizer();
    const tokens = tokenizer.tokenize(str, version);
    const parser = new parser_1.Parser();
    return parser.parseLists(tokens, version);
}
exports.getNbtList = getNbtList;
function completeNamespace(input) {
    if (input.indexOf(':') === -1) {
        input = `minecraft:${input}`;
    }
    return input;
}
exports.completeNamespace = completeNamespace;
function getUuidLeastUuidMost(uuid) {
    uuid = uuid.replace(/-/g, '');
    const uuidMost = parseInt(uuid.slice(0, 16), 16);
    const uuidLeast = parseInt(uuid.slice(16), 16);
    return { L: uuidLeast, M: uuidMost };
}
exports.getUuidLeastUuidMost = getUuidLeastUuidMost;
exports.escape = (str, quote = '"') => quote === '"' ?
    str.replace(/([\\"])/g, '\\$1') :
    str.replace(/([\\'])/g, '\\$1');
exports.unescape = (str) => str.replace(/\\([\\"'])/g, '$1');
