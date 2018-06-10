(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selector_1 = require("./utils/selector");
const utils_1 = require("./utils/utils");
class Checker {
    static isArgumentMatch(cmdArg, spusArg) {
        if (spusArg.charAt(0) === '%') {
            switch (spusArg.slice(1)) {
                case 'adv':
                    return Checker.isPath(cmdArg);
                case 'adv_crit':
                    return Checker.isWord(cmdArg);
                case 'entity':
                    return Checker.isSelector(cmdArg) || Checker.isWord(cmdArg) || Checker.isUuid(cmdArg);
                case 'string':
                    return Checker.isString(cmdArg);
                case 'word':
                    return Checker.isWord(cmdArg);
                case 'num':
                    return Checker.isNum(cmdArg);
                case 'ip':
                    return Checker.isIP(cmdArg);
                case 'nbt':
                    return Checker.isNbt(cmdArg);
                default:
                    throw `Unknown argument type: ${spusArg.slice(1)}`;
            }
        }
        else {
            return cmdArg.toLowerCase() === spusArg;
        }
    }
    static isWord(input) {
        return /^\w*$/.test(input);
    }
    static isString(input) {
        return /^.+$/.test(input);
    }
    static isNum(input) {
        return utils_1.isNumeric(input);
    }
    static isUuid(input) {
        return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/.test(input);
    }
    static isPath(input) {
        return /^(\w+:)?\w+(\/\w+)*$/.test(input);
    }
    static isSelector(input) {
        return selector_1.default.isValid(input);
    }
    static isIP(input) {
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(input);
    }
    static isVec_3(input) {
        return /^((((~?[+-]?(\d+(\.\d+)?)|\.\d+)|(~))(\s|$)){3}|(\^([+-]?(\d+(\.\d+)?|\.\d+))?(\s|$)){3})/.test(input);
    }
    static isNbt(input) {
        throw 'NO NBT PARSER SUPPORTS!!!';
    }
}
exports.default = Checker;

},{"./utils/selector":9,"./utils/utils":10}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argument_reader_1 = require("./utils/argument_reader");
const selector_1 = require("./utils/selector");
const spuses_1 = require("./mappings/spuses");
const spu_script_1 = require("./spu_script");
const checker_1 = require("./checker");
class Converter {
    static getResultMap(cmd, spus) {
        let spusReader = new argument_reader_1.default(spus);
        let spusArg = spusReader.next();
        let cmdReader = new argument_reader_1.default(cmd);
        let cmdArg = cmdReader.next();
        let map = new Map();
        let cnt = 0;
        while (spusArg !== '') {
            while (!checker_1.default.isArgumentMatch(cmdArg, spusArg)) {
                if (cmdReader.hasMore()) {
                    cmdArg += ' ' + cmdReader.next();
                }
                else {
                    return null;
                }
            }
            if (spusArg.charAt(0) === '%') {
                map.set(`%${cnt}`, Converter.cvtArgument(cmdArg, spusArg));
                cnt++;
            }
            spusArg = spusReader.next();
            cmdArg = cmdReader.next();
        }
        if (cmdArg === '') {
            return map;
        }
        else {
            return null;
        }
    }
    static cvtLine(input, positionCorrect) {
        if (input.charAt(0) === '#') {
            return input;
        }
        else {
            return Converter.cvtCommand(input, positionCorrect);
        }
    }
    static cvtCommand(input, positionCorrect) {
        for (const spusOld of spuses_1.default.pairs.keys()) {
            let map = Converter.getResultMap(input, spusOld);
            if (map) {
                let spusNew = spuses_1.default.pairs.get(spusOld);
                if (spusNew) {
                    let spus = new spu_script_1.default(spusNew);
                    let result = spus.compileWith(map);
                    if (positionCorrect) {
                        alert();
                        return `execute positioned 0.0 0.0 0.0 run ${result}`;
                    }
                    else {
                        return result;
                    }
                }
            }
        }
        throw `Unknown command: ${input}`;
    }
    static cvtArgument(arg, spus) {
        switch (spus.slice(1)) {
            case 'adv':
            case 'adv_crit':
                return arg;
            case 'entity':
                return Converter.cvtEntity(arg);
            case 'difficulty':
                return Converter.cvtDifficulty(arg);
            case 'mode':
                return Converter.cvtMode(arg);
            default:
                return arg;
        }
    }
    static cvtDifficulty(input) {
        switch (input) {
            case '0':
            case 'p':
            case 'peaceful':
                return 'peaceful';
            case '1':
            case 'e':
            case 'easy':
                return 'easy';
            case '2':
            case 'n':
            case 'normal':
                return 'normal';
            case '3':
            case 'h':
            case 'hard':
                return 'hard';
            default:
                throw `Unknown difficulty: ${input}`;
        }
    }
    static cvtEntity(input) {
        let sel = new selector_1.default();
        if (checker_1.default.isSelector(input)) {
            sel.parse1_12(input);
        }
        else if (checker_1.default.isWord(input)) {
            sel.parse1_12(`@p[name=${input}]`);
        }
        else {
            return input;
        }
        return sel.get1_13();
    }
    static cvtMode(input) {
        switch (input) {
            case '0':
            case 's':
            case 'survival':
                return 'survival';
            case '1':
            case 'c':
            case 'creative':
                return 'creative';
            case '2':
            case 'a':
            case 'adventure':
                return 'adventure';
            case '3':
            case 'sp':
            case 'spectator':
                return 'spectator';
            default:
                throw `Unknown gamemode: ${input}`;
        }
    }
}
exports.default = Converter;

},{"./checker":1,"./mappings/spuses":4,"./spu_script":5,"./utils/argument_reader":6,"./utils/selector":9}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("./converter");
$(document).ready(function () {
    $('#button').click(function () {
        try {
            let result = '';
            let content = $('#input').val();
            if (content) {
                let lines = content.toString().split('\n');
                for (let line of lines) {
                    line = converter_1.default.cvtLine(line, $('#position-correct').is(':checked'));
                    result += line + '<br>';
                }
                $('#output').html(result);
            }
        }
        catch (ex) {
            console.error(`Converted error: ${ex}`);
            alert(ex);
        }
    });
});

},{"./converter":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Spuses {
}
Spuses.pairs = new Map([
    ['advancement test %entity %adv', 'execute if entity %0$addAdvToEntity%1'],
    ['advancement test %entity %adv %adv_crit', 'execute if entity %0$addAdvToEntity%1%2'],
    ['advancement %literal %entity %literal %adv', 'advancement %0 %1 %2 %3'],
    ['advancement %literal %entity only %adv %adv_crit', 'advancement %0 %1 only %2 %3'],
    ['advancement %literal %entity everything', 'advancement %0 %1 everything'],
    ['ban %entity', 'ban %0'],
    ['ban %entity %string..', 'ban %0 %1'],
    ['ban-ip %entity', 'ban-ip %0'],
    ['ban-ip %entity %string..', 'ban-ip %0 %1'],
    ['ban-ip %ip', 'ban-ip %0'],
    ['ban-ip %ip %string..', 'ban-ip %0 %1'],
    ['banlist %literal', 'banlist %0'],
    ['blockdata %vec_3 %block_nbt', 'data merge block %0 %1'],
    ['clear', 'clear'],
    ['clear %entity', 'clear %0'],
    ['clear %entity %item', 'clear %0 %1'],
    ['clear %entity %item %item_data', 'clear %0 %1$addDataToItem%2'],
    ['clear %entity %item %item_data %num', 'clear %0 %1$addDataToItem%2 %3'],
    ['clear %entity %item %item_data %num %entity_nbt', 'clear %0 %1$addDataToItem%2$addNbtToItem%4'],
    ['clone %vec_3 %vec_3 %vec_3', 'clone %0 %1 %2'],
    ['clone %vec_3 %vec_3 %vec_3 %literal', 'clone %0 %1 %2 %3'],
    ['clone %vec_3 %vec_3 %vec_3 %literal %literal', 'clone %0 %1 %2 %3 %4'],
    ['clone %vec_3 %vec_3 %vec_3 %literal %literal %block', 'clone %0 %1 %2 %3 %5 %4'],
    [
        'clone %vec_3 %vec_3 %vec_3 %literal %literal %block %block_metadata_or_state',
        'clone %0 %1 %2 %3 %5$addMetadataOrStateToBlock%6 %4'
    ],
    ['debug %literal', 'debug %0'],
    ['defaultgamemode %gamemode', 'defaultgamemode %0'],
    ['deop %entity', 'deop %0'],
    ['difficulty %difficulty', 'difficulty %0'],
    ['effect %entity clear', 'effect clear %0'],
    ['effect %entity %effect', 'effect give %0 %1'],
    ['effect %entity %effect %num', 'effect give %0 %1 %2'],
    ['effect %entity %effect %num %num', 'effect give %0 %1 %2 %3'],
    ['effect %entity %effect %num %num %bool', 'effect give %0 %1 %2 %3 %4'],
    ['enchant %entity %ench', 'enchant %0 %1'],
    ['enchant %entity %ench %num', 'enchant %0 %1 %2'],
    ['entitydata %entity %entity_nbt', 'execute as %0 run data merge entity @s %1'],
    ['execute %entity %vec_3 %command', 'execute as %0 at @s positioned %1 run %2'],
    [
        'execute %entity %vec_3 detect %vec_3 %block %block_metadata_or_state %command',
        'execute as %0 at @s positioned %1 if block %2 %3$addMetadataOrStateToBlock%4 run %5'
    ],
    ['fill %vec_3 %vec_3 %block', 'fill %0 %1 %2'],
    ['fill %vec_3 %vec_3 %block %block_metadata_or_state', 'fill %0 %1 %2$addMetadataOrStateToBlock%3'],
    ['fill %vec_3 %vec_3 %block %block_metadata_or_state %literal', 'fill %0 %1 %2$addMetadataOrStateToBlock%3 %4'],
    [
        'fill %vec_3 %vec_3 %block %block_metadata_or_state %literal %block_nbt',
        'fill %0 %1 %2$addMetadataOrStateToBlock%3$addNbtToBlock%5 %4'
    ],
    [
        'fill %vec_3 %vec_3 %block %block_metadata_or_state replace %block %block_metadata_or_state',
        'fill %0 %1 %2$addMetadataOrStateToBlock%3 replace %4$addMetadataOrStateToBlock%5'
    ],
    ['function %func', 'function %0'],
    ['function %func %literal %entity', 'execute %1 entity %2 run function %0'],
    ['gamemode %gamemode', 'gamemode %0'],
    ['gamemode %gamemode %entity', 'gamemode %0 %1'],
    ['gamerule %word', 'gamerule %0'],
    ['gamerule gameLoopFunction %word', "# Please add function '%0' into function tag '#minecraft:tick'.|error"],
    ['gamerule %word %word', 'gamerule %0 %1'],
    ['give %entity %item', 'give %0 %1'],
    ['give %entity %item %num %item_data', 'give %0 %1$addDataToItem%3 %2'],
    ['give %entity %item %num %item_data %item_tag_nbt', 'give %0 %1$addDataToItem%3$addNbtToItem%4 %2'],
    ['help %command_name', 'help %0'],
    ['? %command_name', '? %0'],
    ['kick %entity', 'kick %0'],
    ['kick %entity %string..', 'kick %0 %1'],
    ['kill %entity', 'kill %0'],
    ['list', 'list'],
    ['list %uuid..', 'list %0'],
    ['locate Temple', 'locate Desert_Pyramid\nlocate Igloo\nlocate Jungle_Pyramid\nlocate Swamp_hut'],
    ['locate %word', 'locate %0'],
    ['me %string..', 'me %0'],
    ['op %entity', 'op %0'],
    ['pardon %word', 'pardon %0'],
    ['pardon-ip %ip', 'pardon-ip %0'],
    ['particle %particle %vec_3 %vec_3 %num', 'particle %0 %1 %2 %3'],
    ['particle %particle %vec_3 %vec_3 %num %num', 'particle %0 %1 %2 %3 %4'],
    ['particle %particle %vec_3 %vec_3 %num %num %literal', 'particle %0 %1 %2 %3 %4 %5'],
    ['particle %particle %vec_3 %vec_3 %num %num %literal %entity', 'particle %0 %1 %2 %3 %4 %5 %6'],
    ['particle %particle %vec_3 %vec_3 %num %num %literal %entity %block_dust_param', 'FUCK|danger'],
    ['particle %particle %vec_3 %vec_3 %num %num %literal %entity %item_dust_params', 'FUCK|danger'],
    ['playsound %sound %source %entity', 'playsound %0 %1 %2'],
    ['playsound %sound %source %entity %vec_3', 'playsound %0 %1 %2 %3'],
    ['playsound %sound %source %entity %vec_3 %num', 'playsound %0 %1 %2 %3 %4'],
    ['playsound %sound %source %entity %vec_3 %num %num', 'playsound %0 %1 %2 %3 %4 %5'],
    ['playsound %sound %source %entity %vec_3 %num %num %num', 'playsound %0 %1 %2 %3 %4 %5 %6'],
    ['publish', 'publish'],
    ['recipe %literal %recipe', 'recipe %0 %1'],
    ['recipe %literal %entity %recipe', 'recipe %0 %1 %2'],
    ['reload', 'reload'],
    ['replaceitem block %vec_3 %slot %item', 'replaceitem block %0 %1 %2'],
    ['replaceitem block %vec_3 %slot %item %num', 'replaceitem block %0 %1 %2 %3'],
    ['replaceitem block %vec_3 %slot %item %num %item_data', 'replaceitem block %0 %1 %2$addDataToItem%4 %3'],
    [
        'replaceitem block %vec_3 %slot %item %num %item_data %item_nbt',
        'replaceitem block %0 %1 %2$addDataToItem%4$addNbtToItem%5 %3'
    ],
    ['replaceitem entity %entity %slot %item', 'replaceitem block %0 %1 %2'],
    ['replaceitem entity %entity %slot %item %num', 'replaceitem block %0 %1 %2 %3'],
    ['replaceitem entity %entity %slot %item %num %item_data', 'replaceitem block %0 %1 %2$addDataToItem%4 %3'],
    [
        'replaceitem entity %entity %slot %item %num %item_data %item_nbt',
        'replaceitem block %0 %1 %2$addDataToItem%4$addNbtToItem%5 %3'
    ],
    ['save-all', 'save-all'],
    ['save-all %literal', 'save-all %0'],
    ['save-off', 'save-off'],
    ['save-on', 'save-on'],
    ['say %string..', 'say %0'],
    ['scoreboard objectives list', 'scoreboard objectives list'],
    ['scoreboard objectives add %word %scb_crit', 'scoreboard objectives add %0 %1'],
    ['scoreboard objectives add %word %scb_crit %string', 'scoreboard objectives add %0 %1 %2'],
    ['scoreboard objectives remove %word', 'scoreboard objectives remove %0'],
    ['scoreboard objectives setdisplay %word', 'scoreboard objectives setdisplay %0'],
    ['scoreboard objectives setdisplay %word %word', 'scoreboard objectives setdisplay %0 %1'],
    ['scoreboard players %literal', 'scoreboard players %0'],
    ['scoreboard players %literal %entity', 'scoreboard players %0 %1'],
    ['scoreboard players %literal %entity %word', 'scoreboard players %0 %1 %2'],
    ['scoreboard players test %entity %word %num', 'execute if entity %0$addScbMinToEntity%1%2'],
    [
        'scoreboard players test %entity %word %num %num',
        'execute if entity %0$addScbMinToEntity%1%2$addScbMaxToEntity%1%3'
    ],
    ['scoreboard players %literal %entity %word %num', 'scoreboard players set %0 %1 %2'],
    [
        'scoreboard players %literal %entity %word %num %entity_nbt',
        'scoreboard players set %0$addNbtToEntity%3 %1 %2'
    ],
    ['scoreboard players tag %entity list', 'tag %0 list'],
    ['scoreboard players tag %entity %literal %num', 'tag %0 %1 %2'],
    ['scoreboard players tag %entity %literal %num %entity_nbt', 'tag %0$addNbtToEntity%3 %1 %2'],
    ['scoreboard teams list', 'team list'],
    ['scoreboard teams list %word', 'team list %0'],
    ['scoreboard teams add %word', 'team add %0'],
    ['scoreboard teams add %word %string..', 'team add %0 %1'],
    ['scoreboard teams remove %word', 'team remove %0'],
    ['scoreboard teams empty %word', 'team empty %0'],
    ['scoreboard teams join %word', 'team join %0'],
    ['scoreboard teams join %word %entity..', 'team join %0 %1'],
    ['scoreboard teams leave', 'team leave'],
    ['scoreboard teams leave %entity..', 'team leave %0'],
    ['scoreboard teams option %word %word %word', 'team option %0 %1 %2'],
    ['seed', 'seed'],
    ['setblock %vec_3 %block', 'setblock %0 %1'],
    ['setblock %vec_3 %block %block_metadata_or_state', 'setblock %0 %1$addMetadataOrStateToBlock%2'],
    ['setblock %vec_3 %block %block_metadata_or_state %literal', 'setblock %0 %1$addMetadataOrStateToBlock%2 %3'],
    [
        'setblock %vec_3 %block %block_metadata_or_state %literal %block_nbt',
        'setblock %0 %1$addMetadataOrStateToBlock%2$addNbtToBlock%4 %3'
    ],
    ['setidletimeout %num', 'setidletimeout %0'],
    ['setworldspawn', 'setworldspawn'],
    ['setworldspawn %vec_3', 'setworldspawn %0'],
    ['spawnpoint', 'spawnpoint'],
    ['spawnpoint %entity', 'spawnpoint %0'],
    ['spawnpoint %entity %vec_3', 'spawnpoint %0 %1'],
    ['spreadplayers %vec_2 %num %num %bool %entity..', 'spreadplayers %0 %1 %2 %3 %4'],
    ['stats %string..', "# Couldn't convert 'stat' commands. Use 'execute store ...'!|error"],
    ['stop', 'stop'],
    ['stopsound %entity', 'stopsound %0'],
    ['stopsound %entity %source', 'stopsound %0 %1'],
    ['stopsound %entity %source %sound', 'stopsound %0 %1 %2'],
    ['summon %entity_type', 'summon %0'],
    ['summon %entity_type %vec_3', 'summon %0 %1'],
    ['summon %entity_type %vec_3 %entity_nbt', 'summon %0 %1 %2'],
    ['teleport %entity %vec_3', 'teleport %0 %1'],
    ['teleport %entity %vec_3 %vec_2', 'teleport %0 %1 %2'],
    ['tell %entity %string..', 'tell %0 %1'],
    ['msg %entity %string..', 'msg %0 %1'],
    ['w %entity %string..', 'w %0 %1'],
    ['tellraw %entity %json..', 'tellraw %0 %1'],
    ['testfor %entity', 'execute if entity %0'],
    ['testfor %entity %entity_nbt', 'execute if entity %0$addNbtToEntity%1'],
    ['testforblock %vec_3 %block', 'execute if block %0 %1'],
    ['testforblock %vec_3 %block %block_metadata_or_state', 'execute if block %0 %1$addMetadataOrStateToBlock%2'],
    [
        'testforblock %vec_3 %block %block_metadata_or_state %block_nbt',
        'execute if block %0 %1$addMetadataOrStateToBlock%2$addNbtToBlock%3'
    ],
    ['testforblocks %vec_3 %vec_3 %vec_3', 'execute if blocks %0 %1 %2 all'],
    ['testforblocks %vec_3 %vec_3 %vec_3 %literal', 'execute if blocks %0 %1 %2 %3'],
    ['time %literal %word', 'time %0 %1'],
    ['title %entity %word', 'title %0 %1'],
    ['title %entity %word %json..', 'title %0 %1 %2'],
    ['title %entity times %num %num %num', 'title %0 times %1 %2 %3'],
    ['toggledownfall', 'weather clear|warn'],
    ['tp %entity', 'teleport %0'],
    ['tp %entity %entity', 'teleport %0 %1'],
    ['tp %vec_3', 'teleport %0'],
    ['tp %entity %vec_3', 'execute as %0 at @s run teleport @s %1'],
    ['tp %entity %vec_3 %vec_2', 'execute as %0 at @s run teleport @s %1 %2'],
    ['trigger %word %literal %num', 'trigger %0 %1 %2'],
    ['weather %literal', 'weather %0'],
    ['weather %literal %num', 'weather %0 %1'],
    ['whitelist %literal', 'whitelist %0'],
    ['whitelist %literal %entity', 'whitelist %0 %1'],
    ['worldborder add %num', 'worldborder add %0'],
    ['worldborder add %num %num', 'worldborder add %0 %1'],
    ['worldborder center %vec_2', 'worldborder center %0'],
    ['worldborder damage %literal %num', 'worldborder damage %0 %1'],
    ['worldborder get', 'worldborder get'],
    ['worldborder set %num', 'worldborder set %0'],
    ['worldborder set %num %num', 'worldborder set %0 %1'],
    ['worldborder warning %literal %num', 'worldborder warning %0 %1']
]);
exports.default = Spuses;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const char_reader_1 = require("./utils/char_reader");
const argument_reader_1 = require("./utils/argument_reader");
const selector_1 = require("./utils/selector");
class SpuScript {
    constructor(spus) {
        this.spus = spus;
    }
    compileWith(map) {
        let argReader = new argument_reader_1.default(this.spus);
        let arg = argReader.next();
        let result = '';
        while (arg) {
            if (arg.slice(0, 1) === '%') {
                arg = this.compileArgument(arg, map);
            }
            result += arg + ' ';
            arg = argReader.next();
        }
        result = result.slice(0, -1);
        return result;
    }
    compileArgument(arg, resultMap) {
        let patternMap = this.getPatternMap(arg);
        let id = patternMap.keys().next().value;
        let methods = patternMap.get(id);
        let source = resultMap.get(`%${id}`);
        if (methods && source) {
            let result = source;
            for (const name of methods.keys()) {
                let paramIds = methods.get(name);
                if (paramIds) {
                    let params = paramIds.map(x => {
                        let result = resultMap.get(`%${x}`);
                        return result ? result : '';
                    });
                    switch (name) {
                        case 'addAdv':
                            let selector = new selector_1.default();
                            selector.parse1_13(source);
                            if (params.length === 1) {
                                selector.addFinishedAdvancement(params[0]);
                            }
                            else if (params.length === 2) {
                                selector.addFinishedAdvancement(params[0], params[1]);
                            }
                            else {
                                throw `Unexpected param count: ${params.length} of ${name} in ${arg}.`;
                            }
                            result = selector.get1_13();
                            break;
                        default:
                            break;
                    }
                }
            }
            return result;
        }
        return '';
    }
    getPatternMap(arg) {
        let result = '';
        let charReader = new char_reader_1.default(arg);
        let char = charReader.next();
        let id = '';
        let methods = new Map();
        if (char === '%') {
            char = charReader.next();
        }
        else {
            throw `Unexpected token: ${char} in ${arg}. Should be '%".`;
        }
        while (char && char !== '$') {
            id += char;
            char = charReader.next();
        }
        let name;
        let param;
        let params;
        while (char) {
            name = '';
            params = [];
            char = charReader.next();
            while (char && char !== '%' && char !== '$') {
                name += char;
                char = charReader.next();
            }
            char = charReader.next();
            while (char && char !== '$') {
                param = '';
                while (char && char !== '%' && char !== '$') {
                    param += char;
                    char = charReader.next();
                }
                params.push(param);
                char = charReader.next();
            }
            methods.set(name, params);
        }
        return new Map([[id, methods]]);
    }
}
exports.default = SpuScript;

},{"./utils/argument_reader":6,"./utils/char_reader":7,"./utils/selector":9}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArgumentReader {
    constructor(str) {
        this.arg = str.split(' ');
        this.pos = 0;
        this.length = this.arg.length;
    }
    peek() {
        if (this.pos - 1 >= this.length) {
            return '';
        }
        return this.arg[this.pos];
    }
    next() {
        if (!this.hasMore()) {
            return '';
        }
        return this.arg[this.pos++];
    }
    back() {
        this.pos = Math.max(0, --this.pos);
    }
    hasMore() {
        return this.pos < this.length;
    }
}
exports.default = ArgumentReader;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class CharReader {
    getPos() {
        return this.pos;
    }
    setPos(pos) {
        this.pos = pos;
    }
    constructor(str) {
        this.str = str;
        this.pos = 0;
        this.length = str.length;
    }
    peek() {
        if (this.pos - 1 >= this.length) {
            return '';
        }
        return this.str.charAt(this.pos);
    }
    next() {
        if (!this.hasMore()) {
            return '';
        }
        return this.str.charAt(this.pos++);
    }
    back() {
        this.pos = Math.max(0, --this.pos);
    }
    hasMore() {
        return this.pos < this.length;
    }
    readUntil(until) {
        let result = '';
        let char = this.str.charAt(this.pos - 1);
        while (this.hasMore() && until.indexOf(char) === -1) {
            if (utils_1.isWhiteSpace(char)) {
                char = this.next();
                continue;
            }
            result += char;
            char = this.next();
        }
        return result;
    }
}
exports.default = CharReader;

},{"./utils":10}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class NbtString {
    constructor() {
        this.get = () => this.value;
        this.toString = () => `"${utils_1.escape(this.value)}"`;
    }
    set(value) {
        this.value = value;
    }
}
exports.NbtString = NbtString;
class NbtByte {
    constructor() {
        this.get = () => this.value;
        this.toString = () => `${this.value}b`;
    }
    set(value) {
        this.value = value;
    }
}
exports.NbtByte = NbtByte;
class NbtShort {
    constructor() {
        this.get = () => this.value;
        this.toString = () => `${this.value}s`;
    }
    set(value) {
        this.value = value;
    }
}
exports.NbtShort = NbtShort;
class NbtInt {
    constructor() {
        this.get = () => this.value;
        this.toString = () => `${this.value}`;
    }
    set(value) {
        this.value = value;
    }
}
exports.NbtInt = NbtInt;
class NbtLong {
    constructor() {
        this.get = () => this.value;
        this.toString = () => `${this.value}L`;
    }
    set(value) {
        this.value = value;
    }
}
exports.NbtLong = NbtLong;
class NbtFloat {
    constructor() {
        this.get = () => this.value;
        this.toString = () => `${this.value}f`;
    }
    set(value) {
        this.value = value;
    }
}
exports.NbtFloat = NbtFloat;
class NbtDouble {
    constructor() {
        this.get = () => this.value;
        this.toString = () => `${this.value}d`;
    }
    set(value) {
        this.value = value;
    }
}
exports.NbtDouble = NbtDouble;
class NbtCompound {
    constructor() {
        this.value = new Map();
        this.get = (key) => this.value.get(key);
    }
    set(key, val) {
        this.value.set(key, val);
    }
    toString() {
        let result = '{';
        for (const key of this.value.keys()) {
            const val = this.get(key);
            if (val) {
                result += `${key}:${val.toString()},`;
            }
        }
        if (result.length === 1) {
            result += '}';
        }
        else {
            result = result.slice(0, -1) + '}';
        }
        return result;
    }
}
exports.NbtCompound = NbtCompound;
class NbtList {
    constructor() {
        this.value = [];
        this.get = (index) => this.value[index];
    }
    add(val) {
        this.value.push(val);
    }
    toString() {
        let result = '[';
        for (const val of this.value) {
            result += `${val.toString()},`;
        }
        if (result.length === 1) {
            result += ']';
        }
        else {
            result = result.slice(0, -1) + ']';
        }
        return result;
    }
}
exports.NbtList = NbtList;
class NbtByteArray {
    constructor() {
        this.value = [];
        this.get = (index) => this.value[index];
    }
    add(val) {
        this.value.push(val);
    }
    toString() {
        let result = '[B;';
        for (const val of this.value) {
            result += `${val.toString()},`;
        }
        if (result.length === 1) {
            result += ']';
        }
        else {
            result = result.slice(0, -1) + ']';
        }
        return result;
    }
}
exports.NbtByteArray = NbtByteArray;
class NbtIntArray {
    constructor() {
        this.value = [];
        this.get = (index) => this.value[index];
    }
    add(val) {
        this.value.push(val);
    }
    toString() {
        let result = '[I;';
        for (const val of this.value) {
            result += `${val.toString()},`;
        }
        if (result.length === 1) {
            result += ']';
        }
        else {
            result = result.slice(0, -1) + ']';
        }
        return result;
    }
}
exports.NbtIntArray = NbtIntArray;
class NbtLongArray {
    constructor() {
        this.value = [];
        this.get = (index) => this.value[index];
    }
    add(val) {
        this.value.push(val);
    }
    toString() {
        let result = '[L;';
        for (const val of this.value) {
            result += `${val.toString()},`;
        }
        if (result.length === 1) {
            result += ']';
        }
        else {
            result = result.slice(0, -1) + ']';
        }
        return result;
    }
}
exports.NbtLongArray = NbtLongArray;

},{"../utils":10}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const char_reader_1 = require("./char_reader");
const converter_1 = require("../converter");
const utils_1 = require("./utils");
const nbt_1 = require("./nbt/nbt");
class Selector {
    constructor() {
        this.tag = [];
        this.team = [];
        this.name = [];
        this.type = [];
        this.gamemode = [];
        this.level = new Range(null, null);
        this.distance = new Range(null, null);
        this.x_rotation = new Range(null, null);
        this.y_rotation = new Range(null, null);
        this.scores = new Map();
        this.advancements = new Map();
        this.nbt = new nbt_1.NbtCompound();
    }
    parse1_12(str) {
        let charReader = new char_reader_1.default(str);
        let char;
        char = charReader.next();
        if (char !== '@') {
            throw `First char should be '@': ${str}`;
        }
        char = charReader.next();
        this.parseVariable1_12(char, str);
        char = charReader.next();
        this.parseProperties1_12(char, charReader, str);
    }
    parse1_13(str) {
        let charReader = new char_reader_1.default(str);
        let char;
        char = charReader.next();
        if (char !== '@') {
            throw `First char should be '@': ${str}`;
        }
        char = charReader.next();
        this.parseVariable1_13(char, str);
        char = charReader.next();
        this.parseProperties1_13(char, charReader, str);
    }
    get1_13() {
        let result = '@';
        result = this.getVariable1_13(result);
        result += '[';
        result = this.getProperties1_13(result);
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + ']';
        }
        else if (result.slice(-1) === '[') {
            result = result.slice(0, -1);
        }
        return result;
    }
    static isValid(input) {
        try {
            let sel = new Selector();
            sel.parse1_12(input);
        }
        catch (ignored) {
            return false;
        }
        return true;
    }
    addFinishedAdvancement(adv, crit) {
        if (crit) {
            if (this.advancements.has(adv)) {
                let val = this.advancements.get(adv);
                if (typeof val === 'boolean') {
                    return;
                }
                else {
                    if (!val) {
                        val = new Map();
                    }
                    val.set(crit, true);
                }
            }
            else {
                this.advancements.set(adv, new Map([[crit, true]]));
            }
        }
        else {
            this.advancements.set(adv, true);
        }
    }
    parseVariable1_12(char, str) {
        switch (char) {
            case 'a':
                this.variable = SelectorVariable.A;
                this.sort = 'nearest';
                break;
            case 'e':
                this.variable = SelectorVariable.E;
                this.sort = 'nearest';
                break;
            case 'p':
                this.variable = SelectorVariable.P;
                break;
            case 'r':
                this.variable = SelectorVariable.E;
                this.sort = 'random';
                break;
            case 's':
                this.variable = SelectorVariable.S;
                break;
            default:
                throw `Unknown variable: ${char} in ${str}`;
        }
    }
    parseProperties1_12(char, charReader, str) {
        if (!char) {
            return;
        }
        if (char === '[') {
            let key;
            let val;
            while (char) {
                char = charReader.next();
                key = charReader.readUntil(['=']);
                char = charReader.next();
                val = charReader.readUntil([',', ']']);
                char = charReader.next();
                if (key.length > 6 && key.slice(0, 6) === 'score_') {
                    this.parseScore1_12(key, val);
                }
                else {
                    switch (key) {
                        case 'dx':
                            this.dx = Number(val);
                            break;
                        case 'dy':
                            this.dy = Number(val);
                            break;
                        case 'dz':
                            this.dz = Number(val);
                            break;
                        case 'tag':
                            this.tag.push(val);
                            break;
                        case 'team':
                            this.team.push(val);
                            break;
                        case 'name':
                            this.name.push(val);
                            break;
                        case 'type':
                            this.type.push(val);
                            break;
                        case 'c':
                            if (Number(val) >= 0) {
                                this.limit = Number(val);
                            }
                            else {
                                if (this.sort !== 'random') {
                                    this.sort = 'furthest';
                                }
                                this.limit = -Number(val);
                            }
                            break;
                        case 'm':
                            this.gamemode.push(converter_1.default.cvtMode(val));
                            break;
                        case 'l':
                            this.level.setMax(Number(val));
                            break;
                        case 'lm':
                            this.level.setMax(Number(val));
                            break;
                        case 'r':
                            this.distance.setMax(Number(val));
                            break;
                        case 'rm':
                            this.distance.setMin(Number(val));
                            break;
                        case 'rx':
                            this.x_rotation.setMax(Number(val));
                            break;
                        case 'rxm':
                            this.x_rotation.setMin(Number(val));
                            break;
                        case 'ry':
                            this.y_rotation.setMax(Number(val));
                            break;
                        case 'rym':
                            this.y_rotation.setMin(Number(val));
                            break;
                        case 'x':
                        case 'y':
                        case 'z':
                            if (val.indexOf('.') === -1) {
                                val += '.5';
                            }
                            switch (key) {
                                case 'x':
                                    this.x = Number(val);
                                    break;
                                case 'y':
                                    this.y = Number(val);
                                    break;
                                case 'z':
                                    this.z = Number(val);
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        else {
            throw `Unexpected token: ${str}`;
        }
    }
    parseVariable1_13(char, str) {
        switch (char) {
            case 'a':
                this.variable = SelectorVariable.A;
                break;
            case 'e':
                this.variable = SelectorVariable.E;
                break;
            case 'p':
                this.variable = SelectorVariable.P;
                break;
            case 'r':
                this.variable = SelectorVariable.R;
                break;
            case 's':
                this.variable = SelectorVariable.S;
                break;
            default:
                throw `Unknown variable: ${char} in ${str}`;
        }
    }
    parseProperties1_13(char, charReader, str) {
        if (char === '') {
            return;
        }
        else if (char === '[') {
            let key;
            let val;
            while (char !== ']') {
                key = '';
                val = '';
                char = charReader.next();
                key = charReader.readUntil(['=']);
                char = charReader.next();
                let depth = 0;
                while (depth !== 0 || (char !== ',' && char !== ']')) {
                    if (utils_1.isWhiteSpace(char)) {
                        char = charReader.next();
                        continue;
                    }
                    if (char === '{' || char === '[') {
                        depth += 1;
                    }
                    else if (char === '}' || char === ']') {
                        depth -= 1;
                    }
                    val += char;
                    char = charReader.next();
                }
                let range;
                switch (key) {
                    case 'dx':
                        this.dx = Number(val);
                        break;
                    case 'dy':
                        this.dy = Number(val);
                        break;
                    case 'dz':
                        this.dz = Number(val);
                        break;
                    case 'tag':
                        this.tag.push(val);
                        break;
                    case 'team':
                        this.team.push(val);
                        break;
                    case 'name':
                        this.name.push(val);
                        break;
                    case 'type':
                        this.type.push(val);
                        break;
                    case 'gamemode':
                        this.gamemode.push(val);
                        break;
                    case 'limit':
                        this.limit = Number(val);
                        break;
                    case 'level':
                        range = new Range(null, null);
                        range.parse1_13(val);
                        this.level = range;
                        break;
                    case 'distance':
                        range = new Range(null, null);
                        range.parse1_13(val);
                        this.distance = range;
                        break;
                    case 'x_rotation':
                        range = new Range(null, null);
                        range.parse1_13(val);
                        this.x_rotation = range;
                        break;
                    case 'y_rotation':
                        range = new Range(null, null);
                        range.parse1_13(val);
                        this.y_rotation = range;
                        break;
                    case 'x':
                        this.x = Number(val);
                        break;
                    case 'y':
                        this.y = Number(val);
                        break;
                    case 'z':
                        this.z = Number(val);
                        break;
                    case 'scores':
                        this.parseScores1_13(val);
                        break;
                    case 'advancements':
                        this.parseAdvancements1_13(val);
                        break;
                    case 'nbt':
                        break;
                    default:
                        break;
                }
            }
        }
        else {
            throw `Unexpected token: ${str}`;
        }
    }
    parseAdvancements1_13(val) {
        let charReader = new char_reader_1.default(val);
        let char = charReader.next();
        let adv;
        let crit;
        let bool;
        let map;
        if (char !== '{') {
            throw `Advancements should start with '{', but get '${char}' at '${val}'`;
        }
        char = charReader.next();
        if (char === '}') {
            return;
        }
        while (char) {
            adv = '';
            bool = '';
            adv = charReader.readUntil(['=']);
            char = charReader.next();
            if (char === '{') {
                map = new Map();
                while (char !== '}') {
                    char = charReader.next();
                    crit = '';
                    bool = '';
                    crit = charReader.readUntil(['=']);
                    char = charReader.next();
                    bool = charReader.readUntil(['}', ',']);
                    charReader.back();
                    char = charReader.next();
                    map.set(crit, Boolean(bool));
                }
                this.advancements.set(adv, map);
            }
            else {
                bool = charReader.readUntil(['}', ',']);
                charReader.back();
                char = charReader.next();
            }
            char = charReader.next();
            this.advancements.set(adv, Boolean(bool));
        }
    }
    getVariable1_13(result) {
        switch (this.variable) {
            case SelectorVariable.A:
                result += 'a';
                break;
            case SelectorVariable.E:
                result += 'e';
                break;
            case SelectorVariable.P:
                result += 'p';
                break;
            case SelectorVariable.R:
                result += 'r';
                break;
            case SelectorVariable.S:
                result += 's';
                break;
        }
        return result;
    }
    getProperties1_13(result) {
        if (this.dx) {
            result += `dx=${this.dx},`;
        }
        if (this.dy) {
            result += `dy=${this.dy},`;
        }
        if (this.dz) {
            result += `dz=${this.dz},`;
        }
        if (this.limit) {
            result += `limit=${this.limit},`;
        }
        if (this.x) {
            result += `x=${this.x},`;
        }
        if (this.y) {
            result += `y=${this.y},`;
        }
        if (this.z) {
            result += `z=${this.z},`;
        }
        if (this.sort) {
            result += `sort=${this.sort},`;
        }
        for (const i of this.tag) {
            result += `tag=${i},`;
        }
        for (const i of this.team) {
            result += `team=${i},`;
        }
        for (const i of this.name) {
            result += `name=${i},`;
        }
        for (const i of this.type) {
            result += `type=${i},`;
        }
        for (const i of this.gamemode) {
            result += `gamemode=${i},`;
        }
        let tmp = this.level.get1_13();
        if (tmp) {
            result += `level=${tmp},`;
        }
        tmp = this.distance.get1_13();
        if (this.distance.get1_13()) {
            result += `distance=${this.distance.get1_13()},`;
        }
        tmp = this.x_rotation.get1_13();
        if (tmp) {
            result += `x_rotation=${tmp},`;
        }
        tmp = this.y_rotation.get1_13();
        if (tmp) {
            result += `y_rotation=${tmp},`;
        }
        tmp = this.getScores1_13();
        if (tmp) {
            result += `scores=${tmp},`;
        }
        tmp = this.getAdvancements1_13();
        if (tmp) {
            result += `advancements=${tmp},`;
        }
        return result;
    }
    setScore(objective, value, type) {
        let range = this.scores.get(objective);
        switch (type) {
            case 'max':
                if (range) {
                    range.setMax(Number(value));
                }
                else {
                    range = new Range(null, Number(value));
                    this.scores.set(objective, range);
                }
                break;
            case 'min':
                if (range) {
                    range.setMin(Number(value));
                }
                else {
                    range = new Range(Number(value), null);
                    this.scores.set(objective, range);
                }
                break;
            default:
                throw `Unknown type: ${type}. Expected 'max' or 'min'`;
        }
    }
    parseScore1_12(key, val) {
        let objective;
        if (key.slice(-4) === '_min') {
            objective = key.slice(6, -4);
            this.setScore(objective, val, 'min');
        }
        else {
            objective = key.slice(6);
            this.setScore(objective, val, 'max');
        }
    }
    parseScores1_13(str) {
        let charReader = new char_reader_1.default(str);
        let char = charReader.next();
        let objective;
        let rangeStr;
        let range;
        if (char !== '{') {
            throw `Unexpected 'scores' value begins: ${char} at ${str}.`;
        }
        char = charReader.next();
        while (char) {
            objective = '';
            rangeStr = '';
            range = new Range(null, null);
            objective = charReader.readUntil(['=']);
            char = charReader.next();
            rangeStr = charReader.readUntil([',', '}']);
            char = charReader.next();
            range.parse1_13(rangeStr);
            this.scores.set(objective, range);
        }
    }
    getScores1_13() {
        let result = '{';
        for (const i of this.scores.keys()) {
            let score = this.scores.get(i);
            if (score) {
                result += `${i}=${score.get1_13()},`;
            }
        }
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + '}';
        }
        else if (result.slice(-1) === '{') {
            result = result.slice(0, -1);
        }
        return result;
    }
    getAdvancements1_13() {
        let result = '{';
        for (const i of this.advancements.keys()) {
            const val = this.advancements.get(i);
            if (typeof val === 'boolean') {
                result += `${i}=${val},`;
            }
            else if (val && typeof val === 'object') {
                result += `${i}={`;
                for (const j of val.keys()) {
                    result += `${j}=${val.get(j)},`;
                }
                result = result.slice(0, -1) + '},';
            }
        }
        if (result.slice(-1) === ',') {
            result = result.slice(0, -1) + '}';
        }
        else if (result.slice(-1) === '{') {
            result = result.slice(0, -1);
        }
        return result;
    }
}
exports.default = Selector;
var SelectorVariable;
(function (SelectorVariable) {
    SelectorVariable[SelectorVariable["A"] = 0] = "A";
    SelectorVariable[SelectorVariable["E"] = 1] = "E";
    SelectorVariable[SelectorVariable["P"] = 2] = "P";
    SelectorVariable[SelectorVariable["R"] = 3] = "R";
    SelectorVariable[SelectorVariable["S"] = 4] = "S";
})(SelectorVariable || (SelectorVariable = {}));
class Range {
    getMin() {
        return this.min;
    }
    setMin(min) {
        this.min = min;
    }
    getMax() {
        return this.max;
    }
    setMax(max) {
        this.max = max;
    }
    constructor(min, max) {
        this.max = max;
        this.min = min;
    }
    parse1_13(str) {
        let arr = str.split('..');
        if (arr.length === 2) {
            this.min = arr[0] ? Number(arr[0]) : null;
            this.max = arr[1] ? Number(arr[1]) : null;
        }
        else {
            this.min = this.max = Number(arr[0]);
        }
    }
    get1_13() {
        let min = this.min;
        let max = this.max;
        if (min && max) {
            if (min !== max) {
                return `${min}..${max}`;
            }
            else {
                return `${min}`;
            }
        }
        else if (min) {
            return `${min}..`;
        }
        else if (max) {
            return `..${max}`;
        }
        else {
            return '';
        }
    }
}

},{"../converter":2,"./char_reader":7,"./nbt/nbt":8,"./utils":10}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isNumeric(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}
exports.isNumeric = isNumeric;
function isWhiteSpace(char) {
    return [' ', '\t', '\n', '\r'].indexOf(char) !== -1;
}
exports.isWhiteSpace = isWhiteSpace;
const EscapePattern = /([\\"])/g;
const UnescapePattern = /\\([\\"])/g;
exports.escape = (s) => s.replace(EscapePattern, '\\$1');
exports.unescape = (s) => s.replace(UnescapePattern, '$1');

},{}]},{},[3]);
