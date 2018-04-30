"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const patterns_1 = require("./patterns");
/**
 * Provides methods to convert things in a function from minecraft 1.12 to 1.13.
 * According to https://minecraft.gamepedia.com/1.13#Command_format_2.
 * @author SPGoding
 */
class Converter {
    /**
     * Convert a line.
     * @param line A line need to convert. It can be a blank line, a comment starting with '#', or a command.
     * @returns A converted line.
     */
    static line(line) {
        if (line.charAt(0) === '#') {
            return line;
        }
        return Converter.convert(line);
    }
    /**
     * Convert a command.
     * @param cmd A command need to convert.
     * @returns A converted line.
     */
    static convert(input) {
        for (const key of patterns_1.default.CommandsMap.keys()) {
            // TODO(SPGoding): Add new param types.
            let pattern = new RegExp('^' + key
                .replace(/%entity/g, patterns_1.default.entity)
                .replace(/%vector3d/g, patterns_1.default.vector3d)
                .replace(/%nbt/g, patterns_1.default.nbt)
                .replace(/%string/g, patterns_1.default.string)
                .replace(/%double/g, patterns_1.default.double)
                + '$');
            console.log(pattern);
            if (pattern.test(input)) {
                console.log(input);
                console.log(pattern);
                console.log(key);
                let params = key.match(/(?<=%)\w+/g);
                let index = 0;
                let result = [];
                params.forEach(param => {
                    index++;
                    let tmp = input.replace(pattern, `\\${index}`);
                    let pushed = '';
                    switch (param) {
                        case 'entity':
                            pushed = Converter.entity(tmp);
                            break;
                        case 'string':
                            pushed = Converter.string(tmp);
                            break;
                        case 'vector3d':
                            pushed = Converter.vector3d(tmp);
                            break;
                        case 'nbt':
                            pushed = Converter.nbt(tmp);
                            break;
                        case 'double':
                            pushed = Converter.double(tmp);
                            break;
                        // TODO(SPGoding): Add new param types.
                        default:
                            break;
                    }
                    result.push(pushed);
                });
                let output = patterns_1.default.CommandsMap.get(key);
                for (let i = 0; i < result.length; i++) {
                    output = output.replace(`%${i}`, result[i]);
                }
                return output;
            }
        }
        return input;
    }
    static entity(input) {
        return '实体';
    }
    static vector3d(input) {
        return '3doubles向量';
    }
    static nbt(input) {
        return 'NBT';
    }
    static string(input) {
        return '字符串';
    }
    static double(input) {
        return 'DOUBLE';
    }
}
exports.default = Converter;
