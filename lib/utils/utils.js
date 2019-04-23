"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("./nbt/tokenizer");
const parser_1 = require("./nbt/parser");
/**
 * Return if a thing is numeric. Scientific notation IS supported.
 * @param num Any thing.
 */
function isNumeric(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}
exports.isNumeric = isNumeric;
function isWhiteSpace(char) {
    return char === '' || [' ', '\t', '\n', '\r'].indexOf(char) !== -1;
}
exports.isWhiteSpace = isWhiteSpace;
/**
 * Get an NbtCompound object from a string.
 */
function getNbtCompound(str, version = 'after 1.12') {
    const tokenizer = new tokenizer_1.Tokenizer();
    const tokens = tokenizer.tokenize(str, version);
    const parser = new parser_1.Parser();
    const nbt = parser.parseCompounds(tokens, version);
    return nbt;
}
exports.getNbtCompound = getNbtCompound;
/**
 * Get an NbtList object from a string.
 */
function getNbtList(str, version = 'after 1.12') {
    const tokenizer = new tokenizer_1.Tokenizer();
    const tokens = tokenizer.tokenize(str, version);
    const parser = new parser_1.Parser();
    return parser.parseLists(tokens, version);
}
exports.getNbtList = getNbtList;
/**
 * Set the namespace to `minecraft:` if no namespace.
 * @param input A string.
 */
function completeNamespace(input) {
    if (input.indexOf(':') === -1) {
        input = `minecraft:${input}`;
    }
    return input;
}
exports.completeNamespace = completeNamespace;
/**
 * Get UUIDMost and UUIDLeast froom a UUID pair.
 */
function getUuidLeastUuidMost(uuid) {
    uuid = uuid.replace(/-/g, '');
    const uuidMost = parseInt(uuid.slice(0, 16), 16);
    const uuidLeast = parseInt(uuid.slice(16), 16);
    return { L: uuidLeast, M: uuidMost };
}
exports.getUuidLeastUuidMost = getUuidLeastUuidMost;
/**
 * For escape & unescape.
 *
 * @author pca006132
 */
exports.escape = (str, quote = '"') => quote === '"' ?
    str.replace(/([\\"])/g, '\\$1') :
    str.replace(/([\\'])/g, '\\$1');
exports.unescape = (str) => str.replace(/\\([\\"'])/g, '$1');
//# sourceMappingURL=utils.js.map