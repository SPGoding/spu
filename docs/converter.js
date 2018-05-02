"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selector_1 = require("./selector");
/**
 * Provides methods to convert commands in a mcf file from minecraft 1.12 to 1.13.
 * @author SPGoding
 */
class Converter {
    /**
     * Returns if an command matches an format.
     * @param oldCommand An old minecraft command.
     * @param oldFormat An old format defined in formats.ts.
     */
    isMatch(oldCommand, oldFormat) {
    }
    static line(input) {
        let sel = new selector_1.default();
        sel.parse112(input);
        return sel.get113();
    }
    static gamemode(input) {
        switch (input) {
            case 's':
            case '0':
            case 'survival':
                return 'survival';
            case 'c':
            case '1':
            case 'creative':
                return 'creative';
            case 'a':
            case '2':
            case 'adventure':
                return 'adventure';
            case 'sp':
            case '3':
            case 'spector':
                return 'spector';
            default:
                return '';
        }
    }
}
exports.default = Converter;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Literal"] = 0] = "Literal";
    TokenType[TokenType["Bool"] = 1] = "Bool";
    TokenType[TokenType["Number"] = 2] = "Number";
    TokenType[TokenType["String"] = 3] = "String";
    TokenType[TokenType["Position"] = 4] = "Position";
    TokenType[TokenType["Entity"] = 5] = "Entity";
    TokenType[TokenType["Block"] = 6] = "Block";
    TokenType[TokenType["Item"] = 7] = "Item";
    TokenType[TokenType["Nbt"] = 8] = "Nbt";
    TokenType[TokenType["NbtPath"] = 9] = "NbtPath";
    TokenType[TokenType["Vec2"] = 10] = "Vec2";
    TokenType[TokenType["Vec3"] = 11] = "Vec3";
    TokenType[TokenType["End"] = 12] = "End";
})(TokenType || (TokenType = {}));
class Token {
    constructor(tokenType, value) {
        this.tokenType = tokenType;
        this.value = value;
    }
    getTokenType() {
        return this.tokenType;
    }
    getValue() {
        return this.value;
    }
}
class Tokenizer {
    constructor(charReader) {
        this.charReader = charReader;
        this.tokens = new Array();
    }
    tokenize() {
        let token;
        do {
            token = this.start();
            this.tokens.push(token);
        } while (token.getTokenType() !== TokenType.End);
    }
    start() {
        let char;
        while (true) {
            if (!this.charReader.hasMore()) {
                return new Token(TokenType.End, null);
            }
            char = this.charReader.next();
            if (!this.isWhiteSpace(char)) {
                break;
            }
        }
        return null;
    }
    isWhiteSpace(char) {
        return char === '';
    }
}
