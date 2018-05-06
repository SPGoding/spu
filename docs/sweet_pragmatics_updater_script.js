"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const char_reader_1 = require("./char_reader");
const argument_reader_1 = require("./argument_reader");
class SweetPragmaticsUpdaterScript {
    /**
     * Constructs this spus object from a format.
     * @param spus A new minecraft command format.
     */
    constructor(spus) {
        this.spus = spus;
    }
    /**
     * Compile this spus from an result map.
     * @param map An result map.
     */
    compileWith(map) {
        let argReader = new argument_reader_1.default(this.spus);
        let arg = argReader.next();
        let result = '';
        while (arg) {
            if (arg.slice(0, 1) === '%') {
                arg = this.compileArgument(arg);
            }
            result += arg + ' ';
            arg = argReader.next();
        }
        // Remove extra space.
        result = result.slice(0, -1);
        return result;
    }
    compileArgument(arg) {
        let result = '';
        let charReader = new char_reader_1.default(arg);
        let char = charReader.next();
        let id = '';
        if (char === '%') {
            char = charReader.next();
        }
        else {
            throw `Unexpected token: ${char} in ${arg}`;
        }
        while (char) {
            if (char !== '$') {
                id += char;
            }
            else {
                char = charReader.next();
                break;
            }
            char = charReader.next();
        }
        return result;
    }
}
exports.default = SweetPragmaticsUpdaterScript;
//# sourceMappingURL=sweet_pragmatics_updater_script.js.map