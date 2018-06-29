(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blocks_1 = require("./mappings/blocks");
const updater_1 = require("./updater");
const items_1 = require("./mappings/items");
const selector_1 = require("./utils/selector");
const spuses_1 = require("./mappings/spuses");
const utils_1 = require("./utils/utils");
const tokenizer_1 = require("./utils/nbt/tokenizer");
const parser_1 = require("./utils/nbt/parser");
class Checker {
    static isArgumentMatch(cmdArg, spusArg) {
        if (spusArg.charAt(0) === '%') {
            switch (spusArg.slice(1)) {
                case 'adv':
                    return Checker.isPath(cmdArg);
                case 'adv_crit':
                    return Checker.isWord(cmdArg);
                case 'block':
                    return Checker.isBlock(cmdArg);
                case 'block_dust_param':
                    return Checker.isBlockDustParam(cmdArg);
                case 'block_metadata_or_state':
                    return Checker.isBlockMetadataOrState(cmdArg);
                case 'block_nbt':
                    return Checker.isNbt(cmdArg);
                case 'bool':
                    return Checker.isBool(cmdArg);
                case 'command':
                    return Checker.isCommand(cmdArg);
                case 'difficulty':
                    return Checker.isDifficulty(cmdArg);
                case 'effect':
                    return Checker.isEffectNumericID(cmdArg) || Checker.isStringID(cmdArg);
                case 'ench':
                    return Checker.isEnchNumericID(cmdArg) || Checker.isStringID(cmdArg);
                case 'entity':
                    return (Checker.isSelector(cmdArg) || Checker.isWord(cmdArg) || Checker.isUuid(cmdArg) || cmdArg === '*');
                case 'entity_nbt':
                    return Checker.isNbt(cmdArg);
                case 'entity_type':
                    return Checker.isStringID(cmdArg);
                case 'func':
                    return Checker.isPath(cmdArg);
                case 'gamemode':
                    return Checker.isGamemode(cmdArg);
                case 'ip':
                    return Checker.isIP(cmdArg);
                case 'item':
                    return Checker.isItem(cmdArg);
                case 'item_data':
                    return Checker.isItemData(cmdArg);
                case 'item_dust_params':
                    return Checker.isItemDustParams(cmdArg);
                case 'item_nbt':
                case 'item_tag_nbt':
                    return Checker.isNbt(cmdArg);
                case 'json':
                    return Checker.isJson(cmdArg);
                case 'literal':
                    return Checker.isLiteral(cmdArg);
                case 'num':
                    return Checker.isNum(cmdArg);
                case 'num_or_star':
                    return Checker.isNumOrStar(cmdArg);
                case 'particle':
                    return Checker.isStringID(cmdArg);
                case 'recipe':
                    return Checker.isPath(cmdArg) || cmdArg === '*';
                case 'scb_crit':
                    return Checker.isScbCrit(cmdArg);
                case 'slot':
                    return Checker.isSlot(cmdArg);
                case 'sound':
                    return Checker.isSound(cmdArg);
                case 'source':
                    return Checker.isSource(cmdArg);
                case 'string':
                    return Checker.isString(cmdArg);
                case 'uuid':
                    return Checker.isUuid(cmdArg);
                case 'vec_2':
                    return Checker.isVec_2(cmdArg);
                case 'vec_3':
                    return Checker.isVec_3(cmdArg);
                case 'word':
                    return Checker.isWord(cmdArg);
                default:
                    throw `Unknown argument type: ${spusArg.slice(1)}`;
            }
        }
        else {
            return cmdArg.toLowerCase() === spusArg.toLowerCase();
        }
    }
    static isBlock(input) {
        return blocks_1.default.is1_12StringID(input);
    }
    static isBlockDustParam(input) {
        const result = blocks_1.default.get1_12NominalIDFrom1_12NumericID(Number(input));
        return result ? true : false;
    }
    static isBlockMetadataOrState(input) {
        if (utils_1.isNumeric(input)) {
            return Number(input) >= -1 && Number(input) <= 15 ? true : false;
        }
        else {
            return /^(\w+=[\w0-9]+,?)+$/.test(input);
        }
    }
    static isBool(input) {
        return ['true', 'false'].indexOf(input.toLowerCase()) !== -1;
    }
    static isCommand(input) {
        for (const spusOld of spuses_1.default.pairs.keys()) {
            let map = updater_1.default.getResultMap(input, spusOld);
            if (map) {
                return true;
            }
        }
        return false;
    }
    static isDifficulty(input) {
        return (['0', '1', '2', '3', 'p', 'e', 'n', 'h', 'peaceful', 'easy', 'normal', 'hard'].indexOf(input.toLowerCase()) !== -1);
    }
    static isEffectNumericID(input) {
        return Number(input) >= 1 && Number(input) <= 27;
    }
    static isEnchNumericID(input) {
        return Number(input) >= 0 && Number(input) <= 71;
    }
    static isGamemode(input) {
        return (['0', '1', '2', '3', 's', 'c', 'a', 'sp', 'survival', 'creative', 'adventure', 'spectator'].indexOf(input.toLowerCase()) !== -1);
    }
    static isItem(input) {
        return items_1.default.is1_12NominalIDExist(input);
    }
    static isItemData(input) {
        if (utils_1.isNumeric(input)) {
            return Number(input) >= -1 && Number(input) <= 32767 ? true : false;
        }
        else {
            return false;
        }
    }
    static isItemDustParams(input) {
        const arr = input.split(' ');
        if (arr.length === 2 && utils_1.isNumeric(arr[0]) && utils_1.isNumeric(arr[1])) {
            return true;
        }
        else {
            return false;
        }
    }
    static isJson(input) {
        try {
            if (typeof JSON.parse(input) === 'object') {
                return true;
            }
            else {
                return false;
            }
        }
        catch (ignored) {
            return false;
        }
    }
    static isLiteral(input) {
        return /^[a-zA-Z]+$/.test(input);
    }
    static isWord(input) {
        return /^[\w0-9]+$/.test(input);
    }
    static isString(input) {
        return /^.+$/.test(input);
    }
    static isNum(input) {
        return utils_1.isNumeric(input);
    }
    static isNumOrStar(input) {
        return utils_1.isNumeric(input) || input == '*';
    }
    static isUuid(input) {
        return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/.test(input);
    }
    static isScbCrit(input) {
        if (input.slice(0, 5) === 'stat.') {
            return true;
        }
        else {
            return ([
                'dummy',
                'trigger',
                'health',
                'xp',
                'level',
                'food',
                'air',
                'armor',
                'teamkill',
                'killedByTeam',
                'deathCount',
                'playerKillCount',
                'totalKillCount'
            ].indexOf(input) !== -1);
        }
    }
    static isSlot(input) {
        return input.slice(0, 5) === 'slot.';
    }
    static isSound(input) {
        return /^[a-z]+(\.[a-z]+)*$/.test(input);
    }
    static isSource(input) {
        return ([
            'master',
            'music',
            'record',
            'weather',
            'block',
            'hostile',
            'neutral',
            'player',
            'ambient',
            'voice'
        ].indexOf(input.toLowerCase()) !== -1);
    }
    static isStringID(input) {
        return /^(\w+:)?[a-z_]+$/.test(input);
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
    static isVec_2(input) {
        return /^((((~?[+-]?(\d+(\.\d+)?)|\.\d+)|(~))(\s|$)){2})$/.test(input);
    }
    static isVec_3(input) {
        return /^((((~?[+-]?(\d+(\.\d+)?)|\.\d+)|(~))(\s|$)){3}|(\^([+-]?(\d+(\.\d+)?|\.\d+))?(\s|$)){3})$/.test(input);
    }
    static isNbt(input) {
        try {
            let tokenizer = new tokenizer_1.Tokenizer();
            let parser = new parser_1.Parser();
            let tokens = tokenizer.tokenize(input);
            parser.parse(tokens);
            return true;
        }
        catch (ignored) {
            return false;
        }
    }
}
exports.default = Checker;

},{"./mappings/blocks":3,"./mappings/items":7,"./mappings/spuses":10,"./updater":12,"./utils/nbt/parser":16,"./utils/nbt/tokenizer":17,"./utils/selector":18,"./utils/utils":19}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("./updater");
$(document).ready(function () {
    $('#warn').hide();
    $('#error').hide();
    $('#info').hide();
    $('#button').click(function () {
        let number = 1;
        let frame = 'info';
        let output = "";
        try {
            let timeBefore = (new Date()).getTime();
            let result = '';
            let content = $('#input').val();
            if (content) {
                let lines = content.toString().split('\n');
                for (let line of lines) {
                    number++;
                    line = updater_1.default.upLine(line, $('#position-correct').is(':checked'));
                    if (line.indexOf('!>') !== -1) {
                        frame = 'warn';
                        output += `Line ${number}：${line.slice(line.indexOf('!>') + 2)}<br />`;
                        line = line.slice(0, line.indexOf('!>') - 1);
                    }
                    result += line + '\n';
                }
                result = result.slice(0, -1);
                $('#output').html(result);
                let timeAfter = (new Date()).getTime();
                let timeDelta = timeAfter - timeBefore;
                output = `Upgraded ${number} command${number === 1 ? '' : 's'} (in ${(timeDelta / 1000).toFixed(2)} seconds)<br />${output}`;
            }
        }
        catch (ex) {
            frame = 'error';
            output = `Upgraded error: <br />Line ${number}: ${ex}`;
        }
        finally {
            $('#info').hide();
            $('#warn').hide();
            $('#error').hide();
            $(`#${frame}`).html(output);
            $(`#${frame}`).show();
        }
    });
});

},{"./updater":12}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Blocks {
    static is1_12StringID(id) {
        if (id.slice(0, 10) !== 'minecraft:') {
            id = `minecraft:${id}`;
        }
        const arr = Blocks.NumericID_Metadata_NominalID.find(v => v[2].toString().split('[')[0] === id);
        return arr ? true : false;
    }
    static get1_12NominalIDFrom1_12StringIDWithMetadata(id, metadata) {
        if (id.slice(0, 10) !== 'minecraft:') {
            id = `minecraft:${id}`;
        }
        const arr = Blocks.NumericID_Metadata_NominalID.find(v => v[1] === metadata && v[2].split('[')[0] === id);
        if (arr) {
            return arr[2];
        }
        else {
            throw `Unknown 1.12 string ID: '${id}:${metadata}'`;
        }
    }
    static get1_12NominalIDFrom1_12NumericID(id, metadata) {
        if (!metadata) {
            metadata = 0;
            while (id > 255) {
                metadata += 1;
                id -= 4096;
            }
        }
        const arr = Blocks.NumericID_Metadata_NominalID.find(v => v[0] === id && v[1] === metadata);
        if (arr) {
            return arr[2];
        }
        else {
            return null;
        }
    }
    static get1_13NominalIDFrom1_12NominalID(input) {
        if (input.slice(0, 10) !== 'minecraft:') {
            input = `minecraft:${input}`;
        }
        const arr = Blocks.NominalID_NominalID.find(v => v.indexOf(input, 1) >= 1);
        if (arr) {
            return arr[0];
        }
        else {
            return input;
        }
    }
    static get1_13NominalIDFrom1_12NumericID(id, metadata) {
        const nominalID1_12 = Blocks.get1_12NominalIDFrom1_12NumericID(id, metadata);
        if (nominalID1_12) {
            return Blocks.get1_13NominalIDFrom1_12NominalID(nominalID1_12);
        }
        else {
            throw `Unknown 1.12 numeric ID: '${id}:${metadata}'`;
        }
    }
    static get1_12NominalIDFrom1_12StringID(input) {
        if (input.slice(0, 10) !== 'minecraft:') {
            input = `minecraft:${input}`;
        }
        const arr = Blocks.NumericID_Metadata_NominalID.find(v => v[2].toString().split('[')[0] === input.split('[')[0] && v[1] === 0);
        if (arr) {
            let defaultStates = Blocks.getStatesFromStringID(arr[2]);
            let customStates = Blocks.getStatesFromStringID(input);
            let resultStates = Blocks.sortStates(Blocks.combineStates(defaultStates, customStates));
            return `${input.split('[')[0]}[${resultStates}]`;
        }
        else {
            throw `Unknown 1.12 string ID: '${input}'`;
        }
    }
    static getStatesFromStringID(input) {
        let arr = input.split('[');
        if (arr.length === 2) {
            return arr[1].slice(0, -1);
        }
        else {
            return '';
        }
    }
    static sortStates(input) {
        let arr = input.split(',');
        arr.sort();
        return arr.join();
    }
    static combineStates(defaultStates, customStates) {
        let drr = defaultStates.split(',');
        let crr = customStates.split(',');
        let rrr = [];
        for (const i of drr) {
            const str = crr.find(v => v.split('=')[0] === i.split('=')[0]);
            if (str) {
                rrr.push(str);
            }
            else {
                rrr.push(i);
            }
        }
        return rrr.join();
    }
}
Blocks.NominalID_NominalID = [
    ['minecraft:air', 'minecraft:air'],
    ['minecraft:stone', 'minecraft:stone[variant=stone]'],
    ['minecraft:granite', 'minecraft:stone[variant=granite]'],
    ['minecraft:polished_granite', 'minecraft:stone[variant=smooth_granite]'],
    ['minecraft:diorite', 'minecraft:stone[variant=diorite]'],
    ['minecraft:polished_diorite', 'minecraft:stone[variant=smooth_diorite]'],
    ['minecraft:andesite', 'minecraft:stone[variant=andesite]'],
    ['minecraft:polished_andesite', 'minecraft:stone[variant=smooth_andesite]'],
    ['minecraft:grass_block[snowy=false]', 'minecraft:grass[snowy=false]', 'minecraft:grass[snowy=true]'],
    ['minecraft:dirt', 'minecraft:dirt[snowy=false,variant=dirt]', 'minecraft:dirt[snowy=true,variant=dirt]'],
    [
        'minecraft:coarse_dirt',
        'minecraft:dirt[snowy=false,variant=coarse_dirt]',
        'minecraft:dirt[snowy=true,variant=coarse_dirt]'
    ],
    [
        'minecraft:podzol[snowy=false]',
        'minecraft:dirt[snowy=false,variant=podzol]',
        'minecraft:dirt[snowy=true,variant=podzol]'
    ],
    ['minecraft:cobblestone', 'minecraft:cobblestone'],
    ['minecraft:oak_planks', 'minecraft:planks[variant=oak]'],
    ['minecraft:spruce_planks', 'minecraft:planks[variant=spruce]'],
    ['minecraft:birch_planks', 'minecraft:planks[variant=birch]'],
    ['minecraft:jungle_planks', 'minecraft:planks[variant=jungle]'],
    ['minecraft:acacia_planks', 'minecraft:planks[variant=acacia]'],
    ['minecraft:dark_oak_planks', 'minecraft:planks[variant=dark_oak]'],
    ['minecraft:oak_sapling[stage=0]', 'minecraft:sapling[stage=0,type=oak]'],
    ['minecraft:spruce_sapling[stage=0]', 'minecraft:sapling[stage=0,type=spruce]'],
    ['minecraft:birch_sapling[stage=0]', 'minecraft:sapling[stage=0,type=birch]'],
    ['minecraft:jungle_sapling[stage=0]', 'minecraft:sapling[stage=0,type=jungle]'],
    ['minecraft:acacia_sapling[stage=0]', 'minecraft:sapling[stage=0,type=acacia]'],
    ['minecraft:dark_oak_sapling[stage=0]', 'minecraft:sapling[stage=0,type=dark_oak]'],
    ['minecraft:oak_sapling[stage=1]', 'minecraft:sapling[stage=1,type=oak]'],
    ['minecraft:spruce_sapling[stage=1]', 'minecraft:sapling[stage=1,type=spruce]'],
    ['minecraft:birch_sapling[stage=1]', 'minecraft:sapling[stage=1,type=birch]'],
    ['minecraft:jungle_sapling[stage=1]', 'minecraft:sapling[stage=1,type=jungle]'],
    ['minecraft:acacia_sapling[stage=1]', 'minecraft:sapling[stage=1,type=acacia]'],
    ['minecraft:dark_oak_sapling[stage=1]', 'minecraft:sapling[stage=1,type=dark_oak]'],
    ['minecraft:bedrock', 'minecraft:bedrock'],
    ['minecraft:water[level=0]', 'minecraft:flowing_water[level=0]'],
    ['minecraft:water[level=1]', 'minecraft:flowing_water[level=1]'],
    ['minecraft:water[level=2]', 'minecraft:flowing_water[level=2]'],
    ['minecraft:water[level=3]', 'minecraft:flowing_water[level=3]'],
    ['minecraft:water[level=4]', 'minecraft:flowing_water[level=4]'],
    ['minecraft:water[level=5]', 'minecraft:flowing_water[level=5]'],
    ['minecraft:water[level=6]', 'minecraft:flowing_water[level=6]'],
    ['minecraft:water[level=7]', 'minecraft:flowing_water[level=7]'],
    ['minecraft:water[level=8]', 'minecraft:flowing_water[level=8]'],
    ['minecraft:water[level=9]', 'minecraft:flowing_water[level=9]'],
    ['minecraft:water[level=10]', 'minecraft:flowing_water[level=10]'],
    ['minecraft:water[level=11]', 'minecraft:flowing_water[level=11]'],
    ['minecraft:water[level=12]', 'minecraft:flowing_water[level=12]'],
    ['minecraft:water[level=13]', 'minecraft:flowing_water[level=13]'],
    ['minecraft:water[level=14]', 'minecraft:flowing_water[level=14]'],
    ['minecraft:water[level=15]', 'minecraft:flowing_water[level=15]'],
    ['minecraft:water[level=0]', 'minecraft:water[level=0]'],
    ['minecraft:water[level=1]', 'minecraft:water[level=1]'],
    ['minecraft:water[level=2]', 'minecraft:water[level=2]'],
    ['minecraft:water[level=3]', 'minecraft:water[level=3]'],
    ['minecraft:water[level=4]', 'minecraft:water[level=4]'],
    ['minecraft:water[level=5]', 'minecraft:water[level=5]'],
    ['minecraft:water[level=6]', 'minecraft:water[level=6]'],
    ['minecraft:water[level=7]', 'minecraft:water[level=7]'],
    ['minecraft:water[level=8]', 'minecraft:water[level=8]'],
    ['minecraft:water[level=9]', 'minecraft:water[level=9]'],
    ['minecraft:water[level=10]', 'minecraft:water[level=10]'],
    ['minecraft:water[level=11]', 'minecraft:water[level=11]'],
    ['minecraft:water[level=12]', 'minecraft:water[level=12]'],
    ['minecraft:water[level=13]', 'minecraft:water[level=13]'],
    ['minecraft:water[level=14]', 'minecraft:water[level=14]'],
    ['minecraft:water[level=15]', 'minecraft:water[level=15]'],
    ['minecraft:lava[level=0]', 'minecraft:flowing_lava[level=0]'],
    ['minecraft:lava[level=1]', 'minecraft:flowing_lava[level=1]'],
    ['minecraft:lava[level=2]', 'minecraft:flowing_lava[level=2]'],
    ['minecraft:lava[level=3]', 'minecraft:flowing_lava[level=3]'],
    ['minecraft:lava[level=4]', 'minecraft:flowing_lava[level=4]'],
    ['minecraft:lava[level=5]', 'minecraft:flowing_lava[level=5]'],
    ['minecraft:lava[level=6]', 'minecraft:flowing_lava[level=6]'],
    ['minecraft:lava[level=7]', 'minecraft:flowing_lava[level=7]'],
    ['minecraft:lava[level=8]', 'minecraft:flowing_lava[level=8]'],
    ['minecraft:lava[level=9]', 'minecraft:flowing_lava[level=9]'],
    ['minecraft:lava[level=10]', 'minecraft:flowing_lava[level=10]'],
    ['minecraft:lava[level=11]', 'minecraft:flowing_lava[level=11]'],
    ['minecraft:lava[level=12]', 'minecraft:flowing_lava[level=12]'],
    ['minecraft:lava[level=13]', 'minecraft:flowing_lava[level=13]'],
    ['minecraft:lava[level=14]', 'minecraft:flowing_lava[level=14]'],
    ['minecraft:lava[level=15]', 'minecraft:flowing_lava[level=15]'],
    ['minecraft:lava[level=0]', 'minecraft:lava[level=0]'],
    ['minecraft:lava[level=1]', 'minecraft:lava[level=1]'],
    ['minecraft:lava[level=2]', 'minecraft:lava[level=2]'],
    ['minecraft:lava[level=3]', 'minecraft:lava[level=3]'],
    ['minecraft:lava[level=4]', 'minecraft:lava[level=4]'],
    ['minecraft:lava[level=5]', 'minecraft:lava[level=5]'],
    ['minecraft:lava[level=6]', 'minecraft:lava[level=6]'],
    ['minecraft:lava[level=7]', 'minecraft:lava[level=7]'],
    ['minecraft:lava[level=8]', 'minecraft:lava[level=8]'],
    ['minecraft:lava[level=9]', 'minecraft:lava[level=9]'],
    ['minecraft:lava[level=10]', 'minecraft:lava[level=10]'],
    ['minecraft:lava[level=11]', 'minecraft:lava[level=11]'],
    ['minecraft:lava[level=12]', 'minecraft:lava[level=12]'],
    ['minecraft:lava[level=13]', 'minecraft:lava[level=13]'],
    ['minecraft:lava[level=14]', 'minecraft:lava[level=14]'],
    ['minecraft:lava[level=15]', 'minecraft:lava[level=15]'],
    ['minecraft:sand', 'minecraft:sand[variant=sand]'],
    ['minecraft:red_sand', 'minecraft:sand[variant=red_sand]'],
    ['minecraft:gravel', 'minecraft:gravel'],
    ['minecraft:gold_ore', 'minecraft:gold_ore'],
    ['minecraft:iron_ore', 'minecraft:iron_ore'],
    ['minecraft:coal_ore', 'minecraft:coal_ore'],
    ['minecraft:oak_log[axis=y]', 'minecraft:log[axis=y,variant=oak]'],
    ['minecraft:spruce_log[axis=y]', 'minecraft:log[axis=y,variant=spruce]'],
    ['minecraft:birch_log[axis=y]', 'minecraft:log[axis=y,variant=birch]'],
    ['minecraft:jungle_log[axis=y]', 'minecraft:log[axis=y,variant=jungle]'],
    ['minecraft:oak_log[axis=x]', 'minecraft:log[axis=x,variant=oak]'],
    ['minecraft:spruce_log[axis=x]', 'minecraft:log[axis=x,variant=spruce]'],
    ['minecraft:birch_log[axis=x]', 'minecraft:log[axis=x,variant=birch]'],
    ['minecraft:jungle_log[axis=x]', 'minecraft:log[axis=x,variant=jungle]'],
    ['minecraft:oak_log[axis=z]', 'minecraft:log[axis=z,variant=oak]'],
    ['minecraft:spruce_log[axis=z]', 'minecraft:log[axis=z,variant=spruce]'],
    ['minecraft:birch_log[axis=z]', 'minecraft:log[axis=z,variant=birch]'],
    ['minecraft:jungle_log[axis=z]', 'minecraft:log[axis=z,variant=jungle]'],
    ['minecraft:oak_wood', 'minecraft:log[axis=none,variant=oak]'],
    ['minecraft:spruce_wood', 'minecraft:log[axis=none,variant=spruce]'],
    ['minecraft:birch_wood', 'minecraft:log[axis=none,variant=birch]'],
    ['minecraft:jungle_wood', 'minecraft:log[axis=none,variant=jungle]'],
    [
        'minecraft:oak_leaves[check_decay=false,decayable=true]',
        'minecraft:leaves[check_decay=false,decayable=true,variant=oak]'
    ],
    [
        'minecraft:spruce_leaves[check_decay=false,decayable=true]',
        'minecraft:leaves[check_decay=false,decayable=true,variant=spruce]'
    ],
    [
        'minecraft:birch_leaves[check_decay=false,decayable=true]',
        'minecraft:leaves[check_decay=false,decayable=true,variant=birch]'
    ],
    [
        'minecraft:jungle_leaves[check_decay=false,decayable=true]',
        'minecraft:leaves[check_decay=false,decayable=true,variant=jungle]'
    ],
    [
        'minecraft:oak_leaves[check_decay=false,decayable=false]',
        'minecraft:leaves[check_decay=false,decayable=false,variant=oak]'
    ],
    [
        'minecraft:spruce_leaves[check_decay=false,decayable=false]',
        'minecraft:leaves[check_decay=false,decayable=false,variant=spruce]'
    ],
    [
        'minecraft:birch_leaves[check_decay=false,decayable=false]',
        'minecraft:leaves[check_decay=false,decayable=false,variant=birch]'
    ],
    [
        'minecraft:jungle_leaves[check_decay=false,decayable=false]',
        'minecraft:leaves[check_decay=false,decayable=false,variant=jungle]'
    ],
    [
        'minecraft:oak_leaves[check_decay=true,decayable=true]',
        'minecraft:leaves[check_decay=true,decayable=true,variant=oak]'
    ],
    [
        'minecraft:spruce_leaves[check_decay=true,decayable=true]',
        'minecraft:leaves[check_decay=true,decayable=true,variant=spruce]'
    ],
    [
        'minecraft:birch_leaves[check_decay=true,decayable=true]',
        'minecraft:leaves[check_decay=true,decayable=true,variant=birch]'
    ],
    [
        'minecraft:jungle_leaves[check_decay=true,decayable=true]',
        'minecraft:leaves[check_decay=true,decayable=true,variant=jungle]'
    ],
    [
        'minecraft:oak_leaves[check_decay=true,decayable=false]',
        'minecraft:leaves[check_decay=true,decayable=false,variant=oak]'
    ],
    [
        'minecraft:spruce_leaves[check_decay=true,decayable=false]',
        'minecraft:leaves[check_decay=true,decayable=false,variant=spruce]'
    ],
    [
        'minecraft:birch_leaves[check_decay=true,decayable=false]',
        'minecraft:leaves[check_decay=true,decayable=false,variant=birch]'
    ],
    [
        'minecraft:jungle_leaves[check_decay=true,decayable=false]',
        'minecraft:leaves[check_decay=true,decayable=false,variant=jungle]'
    ],
    ['minecraft:sponge', 'minecraft:sponge[wet=false]'],
    ['minecraft:wet_sponge', 'minecraft:sponge[wet=true]'],
    ['minecraft:glass', 'minecraft:glass'],
    ['minecraft:lapis_ore', 'minecraft:lapis_ore'],
    ['minecraft:lapis_block', 'minecraft:lapis_block'],
    ['minecraft:dispenser[facing=down,triggered=false]', 'minecraft:dispenser[facing=down,triggered=false]'],
    ['minecraft:dispenser[facing=up,triggered=false]', 'minecraft:dispenser[facing=up,triggered=false]'],
    ['minecraft:dispenser[facing=north,triggered=false]', 'minecraft:dispenser[facing=north,triggered=false]'],
    ['minecraft:dispenser[facing=south,triggered=false]', 'minecraft:dispenser[facing=south,triggered=false]'],
    ['minecraft:dispenser[facing=west,triggered=false]', 'minecraft:dispenser[facing=west,triggered=false]'],
    ['minecraft:dispenser[facing=east,triggered=false]', 'minecraft:dispenser[facing=east,triggered=false]'],
    ['minecraft:dispenser[facing=down,triggered=true]', 'minecraft:dispenser[facing=down,triggered=true]'],
    ['minecraft:dispenser[facing=up,triggered=true]', 'minecraft:dispenser[facing=up,triggered=true]'],
    ['minecraft:dispenser[facing=north,triggered=true]', 'minecraft:dispenser[facing=north,triggered=true]'],
    ['minecraft:dispenser[facing=south,triggered=true]', 'minecraft:dispenser[facing=south,triggered=true]'],
    ['minecraft:dispenser[facing=west,triggered=true]', 'minecraft:dispenser[facing=west,triggered=true]'],
    ['minecraft:dispenser[facing=east,triggered=true]', 'minecraft:dispenser[facing=east,triggered=true]'],
    ['minecraft:sandstone', 'minecraft:sandstone[type=sandstone]'],
    ['minecraft:chiseled_sandstone', 'minecraft:sandstone[type=chiseled_sandstone]'],
    ['minecraft:cut_sandstone', 'minecraft:sandstone[type=smooth_sandstone]'],
    ['minecraft:note_block', 'minecraft:noteblock'],
    [
        'minecraft:red_bed[facing=south,occupied=false,part=foot]',
        'minecraft:bed[facing=south,occupied=false,part=foot]',
        'minecraft:bed[facing=south,occupied=true,part=foot]'
    ],
    [
        'minecraft:red_bed[facing=west,occupied=false,part=foot]',
        'minecraft:bed[facing=west,occupied=false,part=foot]',
        'minecraft:bed[facing=west,occupied=true,part=foot]'
    ],
    [
        'minecraft:red_bed[facing=north,occupied=false,part=foot]',
        'minecraft:bed[facing=north,occupied=false,part=foot]',
        'minecraft:bed[facing=north,occupied=true,part=foot]'
    ],
    [
        'minecraft:red_bed[facing=east,occupied=false,part=foot]',
        'minecraft:bed[facing=east,occupied=false,part=foot]',
        'minecraft:bed[facing=east,occupied=true,part=foot]'
    ],
    [
        'minecraft:red_bed[facing=south,occupied=false,part=head]',
        'minecraft:bed[facing=south,occupied=false,part=head]'
    ],
    [
        'minecraft:red_bed[facing=west,occupied=false,part=head]',
        'minecraft:bed[facing=west,occupied=false,part=head]'
    ],
    [
        'minecraft:red_bed[facing=north,occupied=false,part=head]',
        'minecraft:bed[facing=north,occupied=false,part=head]'
    ],
    [
        'minecraft:red_bed[facing=east,occupied=false,part=head]',
        'minecraft:bed[facing=east,occupied=false,part=head]'
    ],
    [
        'minecraft:red_bed[facing=south,occupied=true,part=head]',
        'minecraft:bed[facing=south,occupied=true,part=head]'
    ],
    [
        'minecraft:red_bed[facing=west,occupied=true,part=head]',
        'minecraft:bed[facing=west,occupied=true,part=head]'
    ],
    [
        'minecraft:red_bed[facing=north,occupied=true,part=head]',
        'minecraft:bed[facing=north,occupied=true,part=head]'
    ],
    [
        'minecraft:red_bed[facing=east,occupied=true,part=head]',
        'minecraft:bed[facing=east,occupied=true,part=head]'
    ],
    [
        'minecraft:powered_rail[powered=false,shape=north_south]',
        'minecraft:golden_rail[powered=false,shape=north_south]'
    ],
    [
        'minecraft:powered_rail[powered=false,shape=east_west]',
        'minecraft:golden_rail[powered=false,shape=east_west]'
    ],
    [
        'minecraft:powered_rail[powered=false,shape=ascending_east]',
        'minecraft:golden_rail[powered=false,shape=ascending_east]'
    ],
    [
        'minecraft:powered_rail[powered=false,shape=ascending_west]',
        'minecraft:golden_rail[powered=false,shape=ascending_west]'
    ],
    [
        'minecraft:powered_rail[powered=false,shape=ascending_north]',
        'minecraft:golden_rail[powered=false,shape=ascending_north]'
    ],
    [
        'minecraft:powered_rail[powered=false,shape=ascending_south]',
        'minecraft:golden_rail[powered=false,shape=ascending_south]'
    ],
    [
        'minecraft:powered_rail[powered=true,shape=north_south]',
        'minecraft:golden_rail[powered=true,shape=north_south]'
    ],
    ['minecraft:powered_rail[powered=true,shape=east_west]', 'minecraft:golden_rail[powered=true,shape=east_west]'],
    [
        'minecraft:powered_rail[powered=true,shape=ascending_east]',
        'minecraft:golden_rail[powered=true,shape=ascending_east]'
    ],
    [
        'minecraft:powered_rail[powered=true,shape=ascending_west]',
        'minecraft:golden_rail[powered=true,shape=ascending_west]'
    ],
    [
        'minecraft:powered_rail[powered=true,shape=ascending_north]',
        'minecraft:golden_rail[powered=true,shape=ascending_north]'
    ],
    [
        'minecraft:powered_rail[powered=true,shape=ascending_south]',
        'minecraft:golden_rail[powered=true,shape=ascending_south]'
    ],
    [
        'minecraft:detector_rail[powered=false,shape=north_south]',
        'minecraft:detector_rail[powered=false,shape=north_south]'
    ],
    [
        'minecraft:detector_rail[powered=false,shape=east_west]',
        'minecraft:detector_rail[powered=false,shape=east_west]'
    ],
    [
        'minecraft:detector_rail[powered=false,shape=ascending_east]',
        'minecraft:detector_rail[powered=false,shape=ascending_east]'
    ],
    [
        'minecraft:detector_rail[powered=false,shape=ascending_west]',
        'minecraft:detector_rail[powered=false,shape=ascending_west]'
    ],
    [
        'minecraft:detector_rail[powered=false,shape=ascending_north]',
        'minecraft:detector_rail[powered=false,shape=ascending_north]'
    ],
    [
        'minecraft:detector_rail[powered=false,shape=ascending_south]',
        'minecraft:detector_rail[powered=false,shape=ascending_south]'
    ],
    [
        'minecraft:detector_rail[powered=true,shape=north_south]',
        'minecraft:detector_rail[powered=true,shape=north_south]'
    ],
    [
        'minecraft:detector_rail[powered=true,shape=east_west]',
        'minecraft:detector_rail[powered=true,shape=east_west]'
    ],
    [
        'minecraft:detector_rail[powered=true,shape=ascending_east]',
        'minecraft:detector_rail[powered=true,shape=ascending_east]'
    ],
    [
        'minecraft:detector_rail[powered=true,shape=ascending_west]',
        'minecraft:detector_rail[powered=true,shape=ascending_west]'
    ],
    [
        'minecraft:detector_rail[powered=true,shape=ascending_north]',
        'minecraft:detector_rail[powered=true,shape=ascending_north]'
    ],
    [
        'minecraft:detector_rail[powered=true,shape=ascending_south]',
        'minecraft:detector_rail[powered=true,shape=ascending_south]'
    ],
    ['minecraft:sticky_piston[extended=false,facing=down]', 'minecraft:sticky_piston[extended=false,facing=down]'],
    ['minecraft:sticky_piston[extended=false,facing=up]', 'minecraft:sticky_piston[extended=false,facing=up]'],
    [
        'minecraft:sticky_piston[extended=false,facing=north]',
        'minecraft:sticky_piston[extended=false,facing=north]'
    ],
    [
        'minecraft:sticky_piston[extended=false,facing=south]',
        'minecraft:sticky_piston[extended=false,facing=south]'
    ],
    ['minecraft:sticky_piston[extended=false,facing=west]', 'minecraft:sticky_piston[extended=false,facing=west]'],
    ['minecraft:sticky_piston[extended=false,facing=east]', 'minecraft:sticky_piston[extended=false,facing=east]'],
    ['minecraft:sticky_piston[extended=true,facing=down]', 'minecraft:sticky_piston[extended=true,facing=down]'],
    ['minecraft:sticky_piston[extended=true,facing=up]', 'minecraft:sticky_piston[extended=true,facing=up]'],
    ['minecraft:sticky_piston[extended=true,facing=north]', 'minecraft:sticky_piston[extended=true,facing=north]'],
    ['minecraft:sticky_piston[extended=true,facing=south]', 'minecraft:sticky_piston[extended=true,facing=south]'],
    ['minecraft:sticky_piston[extended=true,facing=west]', 'minecraft:sticky_piston[extended=true,facing=west]'],
    ['minecraft:sticky_piston[extended=true,facing=east]', 'minecraft:sticky_piston[extended=true,facing=east]'],
    ['minecraft:cobweb', 'minecraft:web'],
    ['minecraft:dead_bush', 'minecraft:tallgrass[type=dead_bush]'],
    ['minecraft:grass', 'minecraft:tallgrass[type=tall_grass]'],
    ['minecraft:fern', 'minecraft:tallgrass[type=fern]'],
    ['minecraft:dead_bush', 'minecraft:deadbush'],
    ['minecraft:piston[extended=false,facing=down]', 'minecraft:piston[extended=false,facing=down]'],
    ['minecraft:piston[extended=false,facing=up]', 'minecraft:piston[extended=false,facing=up]'],
    ['minecraft:piston[extended=false,facing=north]', 'minecraft:piston[extended=false,facing=north]'],
    ['minecraft:piston[extended=false,facing=south]', 'minecraft:piston[extended=false,facing=south]'],
    ['minecraft:piston[extended=false,facing=west]', 'minecraft:piston[extended=false,facing=west]'],
    ['minecraft:piston[extended=false,facing=east]', 'minecraft:piston[extended=false,facing=east]'],
    ['minecraft:piston[extended=true,facing=down]', 'minecraft:piston[extended=true,facing=down]'],
    ['minecraft:piston[extended=true,facing=up]', 'minecraft:piston[extended=true,facing=up]'],
    ['minecraft:piston[extended=true,facing=north]', 'minecraft:piston[extended=true,facing=north]'],
    ['minecraft:piston[extended=true,facing=south]', 'minecraft:piston[extended=true,facing=south]'],
    ['minecraft:piston[extended=true,facing=west]', 'minecraft:piston[extended=true,facing=west]'],
    ['minecraft:piston[extended=true,facing=east]', 'minecraft:piston[extended=true,facing=east]'],
    [
        'minecraft:piston_head[facing=down,short=false,type=normal]',
        'minecraft:piston_head[facing=down,short=false,type=normal]',
        'minecraft:piston_head[facing=down,short=true,type=normal]'
    ],
    [
        'minecraft:piston_head[facing=up,short=false,type=normal]',
        'minecraft:piston_head[facing=up,short=false,type=normal]',
        'minecraft:piston_head[facing=up,short=true,type=normal]'
    ],
    [
        'minecraft:piston_head[facing=north,short=false,type=normal]',
        'minecraft:piston_head[facing=north,short=false,type=normal]',
        'minecraft:piston_head[facing=north,short=true,type=normal]'
    ],
    [
        'minecraft:piston_head[facing=south,short=false,type=normal]',
        'minecraft:piston_head[facing=south,short=false,type=normal]',
        'minecraft:piston_head[facing=south,short=true,type=normal]'
    ],
    [
        'minecraft:piston_head[facing=west,short=false,type=normal]',
        'minecraft:piston_head[facing=west,short=false,type=normal]',
        'minecraft:piston_head[facing=west,short=true,type=normal]'
    ],
    [
        'minecraft:piston_head[facing=east,short=false,type=normal]',
        'minecraft:piston_head[facing=east,short=false,type=normal]',
        'minecraft:piston_head[facing=east,short=true,type=normal]'
    ],
    [
        'minecraft:piston_head[facing=down,short=false,type=sticky]',
        'minecraft:piston_head[facing=down,short=false,type=sticky]',
        'minecraft:piston_head[facing=down,short=true,type=sticky]'
    ],
    [
        'minecraft:piston_head[facing=up,short=false,type=sticky]',
        'minecraft:piston_head[facing=up,short=false,type=sticky]',
        'minecraft:piston_head[facing=up,short=true,type=sticky]'
    ],
    [
        'minecraft:piston_head[facing=north,short=false,type=sticky]',
        'minecraft:piston_head[facing=north,short=false,type=sticky]',
        'minecraft:piston_head[facing=north,short=true,type=sticky]'
    ],
    [
        'minecraft:piston_head[facing=south,short=false,type=sticky]',
        'minecraft:piston_head[facing=south,short=false,type=sticky]',
        'minecraft:piston_head[facing=south,short=true,type=sticky]'
    ],
    [
        'minecraft:piston_head[facing=west,short=false,type=sticky]',
        'minecraft:piston_head[facing=west,short=false,type=sticky]',
        'minecraft:piston_head[facing=west,short=true,type=sticky]'
    ],
    [
        'minecraft:piston_head[facing=east,short=false,type=sticky]',
        'minecraft:piston_head[facing=east,short=false,type=sticky]',
        'minecraft:piston_head[facing=east,short=true,type=sticky]'
    ],
    ['minecraft:white_wool', 'minecraft:wool[color=white]'],
    ['minecraft:orange_wool', 'minecraft:wool[color=orange]'],
    ['minecraft:magenta_wool', 'minecraft:wool[color=magenta]'],
    ['minecraft:light_blue_wool', 'minecraft:wool[color=light_blue]'],
    ['minecraft:yellow_wool', 'minecraft:wool[color=yellow]'],
    ['minecraft:lime_wool', 'minecraft:wool[color=lime]'],
    ['minecraft:pink_wool', 'minecraft:wool[color=pink]'],
    ['minecraft:gray_wool', 'minecraft:wool[color=gray]'],
    ['minecraft:light_gray_wool', 'minecraft:wool[color=silver]'],
    ['minecraft:cyan_wool', 'minecraft:wool[color=cyan]'],
    ['minecraft:purple_wool', 'minecraft:wool[color=purple]'],
    ['minecraft:blue_wool', 'minecraft:wool[color=blue]'],
    ['minecraft:brown_wool', 'minecraft:wool[color=brown]'],
    ['minecraft:green_wool', 'minecraft:wool[color=green]'],
    ['minecraft:red_wool', 'minecraft:wool[color=red]'],
    ['minecraft:black_wool', 'minecraft:wool[color=black]'],
    ['minecraft:moving_piston[facing=down,type=normal]', 'minecraft:piston_extension[facing=down,type=normal]'],
    ['minecraft:moving_piston[facing=up,type=normal]', 'minecraft:piston_extension[facing=up,type=normal]'],
    ['minecraft:moving_piston[facing=north,type=normal]', 'minecraft:piston_extension[facing=north,type=normal]'],
    ['minecraft:moving_piston[facing=south,type=normal]', 'minecraft:piston_extension[facing=south,type=normal]'],
    ['minecraft:moving_piston[facing=west,type=normal]', 'minecraft:piston_extension[facing=west,type=normal]'],
    ['minecraft:moving_piston[facing=east,type=normal]', 'minecraft:piston_extension[facing=east,type=normal]'],
    ['minecraft:moving_piston[facing=down,type=sticky]', 'minecraft:piston_extension[facing=down,type=sticky]'],
    ['minecraft:moving_piston[facing=up,type=sticky]', 'minecraft:piston_extension[facing=up,type=sticky]'],
    ['minecraft:moving_piston[facing=north,type=sticky]', 'minecraft:piston_extension[facing=north,type=sticky]'],
    ['minecraft:moving_piston[facing=south,type=sticky]', 'minecraft:piston_extension[facing=south,type=sticky]'],
    ['minecraft:moving_piston[facing=west,type=sticky]', 'minecraft:piston_extension[facing=west,type=sticky]'],
    ['minecraft:moving_piston[facing=east,type=sticky]', 'minecraft:piston_extension[facing=east,type=sticky]'],
    ['minecraft:dandelion', 'minecraft:yellow_flower[type=dandelion]'],
    ['minecraft:poppy', 'minecraft:red_flower[type=poppy]'],
    ['minecraft:blue_orchid', 'minecraft:red_flower[type=blue_orchid]'],
    ['minecraft:allium', 'minecraft:red_flower[type=allium]'],
    ['minecraft:azure_bluet', 'minecraft:red_flower[type=houstonia]'],
    ['minecraft:red_tulip', 'minecraft:red_flower[type=red_tulip]'],
    ['minecraft:orange_tulip', 'minecraft:red_flower[type=orange_tulip]'],
    ['minecraft:white_tulip', 'minecraft:red_flower[type=white_tulip]'],
    ['minecraft:pink_tulip', 'minecraft:red_flower[type=pink_tulip]'],
    ['minecraft:oxeye_daisy', 'minecraft:red_flower[type=oxeye_daisy]'],
    ['minecraft:brown_mushroom', 'minecraft:brown_mushroom'],
    ['minecraft:red_mushroom', 'minecraft:red_mushroom'],
    ['minecraft:gold_block', 'minecraft:gold_block'],
    ['minecraft:iron_block', 'minecraft:iron_block'],
    ['minecraft:stone_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=stone]'],
    ['minecraft:sandstone_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=sandstone]'],
    ['minecraft:petrified_oak_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=wood_old]'],
    ['minecraft:cobblestone_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=cobblestone]'],
    ['minecraft:brick_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=brick]'],
    ['minecraft:stone_brick_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=stone_brick]'],
    [
        'minecraft:nether_brick_slab[type=double]',
        'minecraft:double_stone_slab[seamless=false,variant=nether_brick]'
    ],
    ['minecraft:quartz_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=quartz]'],
    ['minecraft:smooth_stone', 'minecraft:double_stone_slab[seamless=true,variant=stone]'],
    ['minecraft:smooth_sandstone', 'minecraft:double_stone_slab[seamless=true,variant=sandstone]'],
    ['minecraft:petrified_oak_slab[type=double]', 'minecraft:double_stone_slab[seamless=true,variant=wood_old]'],
    ['minecraft:cobblestone_slab[type=double]', 'minecraft:double_stone_slab[seamless=true,variant=cobblestone]'],
    ['minecraft:brick_slab[type=double]', 'minecraft:double_stone_slab[seamless=true,variant=brick]'],
    ['minecraft:stone_brick_slab[type=double]', 'minecraft:double_stone_slab[seamless=true,variant=stone_brick]'],
    ['minecraft:nether_brick_slab[type=double]', 'minecraft:double_stone_slab[seamless=true,variant=nether_brick]'],
    ['minecraft:smooth_quartz', 'minecraft:double_stone_slab[seamless=true,variant=quartz]'],
    ['minecraft:stone_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=stone]'],
    ['minecraft:sandstone_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=sandstone]'],
    ['minecraft:petrified_oak_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=wood_old]'],
    ['minecraft:cobblestone_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=cobblestone]'],
    ['minecraft:brick_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=brick]'],
    ['minecraft:stone_brick_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=stone_brick]'],
    ['minecraft:nether_brick_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=nether_brick]'],
    ['minecraft:quartz_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=quartz]'],
    ['minecraft:stone_slab[type=top]', 'minecraft:stone_slab[half=top,variant=stone]'],
    ['minecraft:sandstone_slab[type=top]', 'minecraft:stone_slab[half=top,variant=sandstone]'],
    ['minecraft:petrified_oak_slab[type=top]', 'minecraft:stone_slab[half=top,variant=wood_old]'],
    ['minecraft:cobblestone_slab[type=top]', 'minecraft:stone_slab[half=top,variant=cobblestone]'],
    ['minecraft:brick_slab[type=top]', 'minecraft:stone_slab[half=top,variant=brick]'],
    ['minecraft:stone_brick_slab[type=top]', 'minecraft:stone_slab[half=top,variant=stone_brick]'],
    ['minecraft:nether_brick_slab[type=top]', 'minecraft:stone_slab[half=top,variant=nether_brick]'],
    ['minecraft:quartz_slab[type=top]', 'minecraft:stone_slab[half=top,variant=quartz]'],
    ['minecraft:bricks', 'minecraft:brick_block'],
    ['minecraft:tnt[explode=false]', 'minecraft:tnt[explode=false]'],
    ['minecraft:tnt[explode=true]', 'minecraft:tnt[explode=true]'],
    ['minecraft:bookshelf', 'minecraft:bookshelf'],
    ['minecraft:mossy_cobblestone', 'minecraft:mossy_cobblestone'],
    ['minecraft:obsidian', 'minecraft:obsidian'],
    ['minecraft:wall_torch[facing=east]', 'minecraft:torch[facing=east]'],
    ['minecraft:wall_torch[facing=west]', 'minecraft:torch[facing=west]'],
    ['minecraft:wall_torch[facing=south]', 'minecraft:torch[facing=south]'],
    ['minecraft:wall_torch[facing=north]', 'minecraft:torch[facing=north]'],
    ['minecraft:torch', 'minecraft:torch[facing=up]'],
    [
        'minecraft:fire[age=0,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=0,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=0,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=0,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=0,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=0,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=0,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=0,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=0,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=0,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=0,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=0,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=0,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=0,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=0,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=0,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=0,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=0,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=0,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=0,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=0,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=0,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=0,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=0,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=0,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=0,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=0,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=0,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=0,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=0,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=0,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=0,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=0,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=1,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=1,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=1,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=1,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=1,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=1,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=1,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=1,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=1,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=1,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=1,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=1,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=1,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=1,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=1,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=1,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=1,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=1,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=1,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=1,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=1,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=1,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=1,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=1,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=1,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=1,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=1,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=1,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=1,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=1,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=1,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=1,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=1,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=2,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=2,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=2,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=2,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=2,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=2,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=2,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=2,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=2,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=2,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=2,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=2,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=2,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=2,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=2,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=2,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=2,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=2,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=2,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=2,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=2,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=2,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=2,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=2,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=2,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=2,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=2,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=2,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=2,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=2,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=2,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=2,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=2,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=3,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=3,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=3,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=3,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=3,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=3,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=3,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=3,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=3,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=3,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=3,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=3,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=3,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=3,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=3,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=3,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=3,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=3,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=3,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=3,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=3,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=3,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=3,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=3,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=3,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=3,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=3,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=3,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=3,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=3,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=3,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=3,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=3,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=4,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=4,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=4,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=4,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=4,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=4,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=4,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=4,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=4,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=4,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=4,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=4,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=4,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=4,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=4,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=4,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=4,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=4,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=4,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=4,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=4,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=4,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=4,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=4,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=4,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=4,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=4,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=4,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=4,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=4,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=4,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=4,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=4,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=5,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=5,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=5,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=5,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=5,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=5,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=5,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=5,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=5,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=5,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=5,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=5,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=5,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=5,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=5,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=5,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=5,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=5,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=5,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=5,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=5,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=5,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=5,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=5,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=5,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=5,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=5,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=5,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=5,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=5,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=5,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=5,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=5,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=6,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=6,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=6,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=6,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=6,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=6,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=6,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=6,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=6,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=6,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=6,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=6,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=6,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=6,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=6,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=6,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=6,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=6,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=6,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=6,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=6,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=6,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=6,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=6,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=6,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=6,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=6,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=6,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=6,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=6,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=6,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=6,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=6,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=7,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=7,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=7,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=7,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=7,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=7,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=7,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=7,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=7,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=7,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=7,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=7,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=7,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=7,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=7,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=7,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=7,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=7,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=7,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=7,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=7,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=7,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=7,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=7,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=7,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=7,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=7,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=7,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=7,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=7,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=7,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=7,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=7,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=8,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=8,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=8,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=8,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=8,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=8,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=8,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=8,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=8,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=8,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=8,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=8,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=8,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=8,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=8,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=8,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=8,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=8,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=8,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=8,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=8,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=8,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=8,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=8,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=8,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=8,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=8,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=8,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=8,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=8,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=8,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=8,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=8,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=9,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=9,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=9,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=9,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=9,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=9,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=9,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=9,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=9,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=9,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=9,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=9,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=9,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=9,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=9,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=9,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=9,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=9,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=9,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=9,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=9,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=9,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=9,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=9,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=9,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=9,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=9,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=9,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=9,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=9,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=9,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=9,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=9,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=10,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=10,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=10,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=10,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=10,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=10,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=10,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=10,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=10,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=10,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=10,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=10,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=10,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=10,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=10,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=10,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=10,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=10,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=10,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=10,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=10,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=10,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=10,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=10,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=10,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=10,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=10,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=10,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=10,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=10,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=10,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=10,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=10,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=11,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=11,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=11,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=11,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=11,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=11,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=11,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=11,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=11,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=11,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=11,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=11,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=11,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=11,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=11,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=11,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=11,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=11,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=11,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=11,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=11,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=11,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=11,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=11,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=11,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=11,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=11,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=11,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=11,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=11,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=11,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=11,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=11,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=12,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=12,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=12,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=12,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=12,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=12,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=12,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=12,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=12,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=12,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=12,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=12,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=12,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=12,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=12,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=12,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=12,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=12,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=12,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=12,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=12,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=12,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=12,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=12,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=12,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=12,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=12,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=12,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=12,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=12,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=12,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=12,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=12,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=13,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=13,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=13,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=13,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=13,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=13,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=13,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=13,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=13,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=13,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=13,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=13,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=13,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=13,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=13,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=13,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=13,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=13,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=13,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=13,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=13,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=13,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=13,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=13,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=13,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=13,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=13,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=13,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=13,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=13,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=13,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=13,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=13,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=14,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=14,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=14,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=14,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=14,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=14,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=14,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=14,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=14,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=14,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=14,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=14,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=14,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=14,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=14,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=14,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=14,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=14,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=14,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=14,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=14,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=14,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=14,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=14,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=14,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=14,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=14,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=14,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=14,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=14,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=14,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=14,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=14,east=true,north:true,south=true,up:true,west=true]'
    ],
    [
        'minecraft:fire[age=15,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=15,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=15,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=15,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=15,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=15,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=15,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=15,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=15,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=15,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=15,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=15,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=15,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=15,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=15,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=15,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=15,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:fire[age=15,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:fire[age=15,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:fire[age=15,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:fire[age=15,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:fire[age=15,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:fire[age=15,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:fire[age=15,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:fire[age=15,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:fire[age=15,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:fire[age=15,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:fire[age=15,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:fire[age=15,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:fire[age=15,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:fire[age=15,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:fire[age=15,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:fire[age=15,east=true,north:true,south=true,up:true,west=true]'
    ],
    ['minecraft:mob_spawner', 'minecraft:spawner'],
    [
        'minecraft:oak_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:oak_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:oak_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:oak_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:oak_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:oak_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:oak_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:oak_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:oak_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:oak_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:oak_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:oak_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:oak_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:oak_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:oak_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:oak_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:oak_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:oak_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:oak_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:oak_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:oak_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:oak_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:oak_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:oak_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:oak_stairs[facing=east,half=top,shape=straight]',
        'minecraft:oak_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:oak_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:oak_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:oak_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:oak_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:oak_stairs[facing=west,half=top,shape=straight]',
        'minecraft:oak_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:oak_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:oak_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:oak_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:oak_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:oak_stairs[facing=south,half=top,shape=straight]',
        'minecraft:oak_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:oak_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:oak_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:oak_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:oak_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:oak_stairs[facing=north,half=top,shape=straight]',
        'minecraft:oak_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:oak_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:oak_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:oak_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:oak_stairs[facing=north,half=top,shape=straight]'
    ],
    ['minecraft:chest[facing=north,type=single]', 'minecraft:chest[facing=north]'],
    ['minecraft:chest[facing=south,type=single]', 'minecraft:chest[facing=south]'],
    ['minecraft:chest[facing=west,type=single]', 'minecraft:chest[facing=west]'],
    ['minecraft:chest[facing=east,type=single]', 'minecraft:chest[facing=east]'],
    [
        'minecraft:redstone_wire[east=none,north=none,power:0,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:0,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:0,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:0,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:0,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:0,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:0,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:0,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:0,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:0,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:0,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:0,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:0,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:0,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:0,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:0,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:0,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:0,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:0,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:0,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:0,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:0,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:0,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:0,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:0,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:0,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:0,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:0,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:0,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:0,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:0,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:0,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:0,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:0,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:0,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:0,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:0,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:0,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:0,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:0,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:0,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:0,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:0,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:0,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:0,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:0,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:0,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:0,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:0,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:0,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:0,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:0,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:0,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:0,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:0,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:0,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:0,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:0,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:0,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:0,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:0,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:0,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:0,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:0,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:0,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:0,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:0,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:0,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:0,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:0,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:0,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:0,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:0,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:0,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:0,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:0,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:0,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:0,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:0,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:0,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:0,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:0,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:1,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:1,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:1,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:1,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:1,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:1,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:1,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:1,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:1,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:1,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:1,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:1,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:1,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:1,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:1,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:1,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:1,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:1,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:1,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:1,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:1,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:1,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:1,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:1,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:1,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:1,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:1,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:1,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:1,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:1,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:1,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:1,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:1,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:1,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:1,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:1,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:1,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:1,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:1,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:1,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:1,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:1,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:1,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:1,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:1,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:1,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:1,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:1,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:1,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:1,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:1,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:1,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:1,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:1,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:1,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:1,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:1,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:1,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:1,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:1,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:1,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:1,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:1,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:1,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:1,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:1,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:1,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:1,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:1,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:1,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:1,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:1,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:1,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:1,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:1,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:1,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:1,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:1,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:1,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:1,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:1,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:1,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:2,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:2,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:2,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:2,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:2,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:2,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:2,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:2,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:2,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:2,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:2,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:2,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:2,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:2,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:2,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:2,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:2,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:2,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:2,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:2,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:2,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:2,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:2,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:2,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:2,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:2,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:2,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:2,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:2,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:2,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:2,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:2,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:2,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:2,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:2,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:2,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:2,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:2,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:2,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:2,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:2,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:2,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:2,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:2,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:2,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:2,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:2,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:2,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:2,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:2,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:2,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:2,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:2,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:2,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:2,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:2,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:2,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:2,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:2,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:2,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:2,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:2,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:2,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:2,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:2,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:2,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:2,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:2,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:2,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:2,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:2,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:2,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:2,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:2,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:2,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:2,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:2,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:2,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:2,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:2,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:2,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:2,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:3,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:3,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:3,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:3,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:3,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:3,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:3,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:3,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:3,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:3,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:3,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:3,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:3,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:3,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:3,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:3,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:3,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:3,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:3,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:3,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:3,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:3,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:3,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:3,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:3,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:3,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:3,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:3,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:3,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:3,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:3,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:3,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:3,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:3,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:3,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:3,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:3,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:3,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:3,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:3,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:3,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:3,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:3,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:3,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:3,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:3,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:3,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:3,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:3,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:3,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:3,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:3,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:3,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:3,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:3,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:3,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:3,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:3,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:3,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:3,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:3,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:3,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:3,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:3,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:3,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:3,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:3,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:3,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:3,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:3,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:3,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:3,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:3,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:3,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:3,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:3,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:3,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:3,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:3,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:3,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:3,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:3,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:4,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:4,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:4,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:4,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:4,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:4,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:4,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:4,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:4,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:4,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:4,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:4,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:4,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:4,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:4,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:4,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:4,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:4,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:4,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:4,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:4,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:4,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:4,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:4,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:4,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:4,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:4,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:4,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:4,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:4,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:4,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:4,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:4,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:4,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:4,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:4,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:4,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:4,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:4,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:4,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:4,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:4,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:4,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:4,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:4,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:4,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:4,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:4,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:4,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:4,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:4,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:4,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:4,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:4,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:4,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:4,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:4,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:4,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:4,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:4,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:4,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:4,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:4,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:4,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:4,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:4,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:4,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:4,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:4,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:4,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:4,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:4,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:4,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:4,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:4,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:4,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:4,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:4,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:4,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:4,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:4,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:4,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:5,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:5,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:5,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:5,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:5,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:5,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:5,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:5,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:5,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:5,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:5,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:5,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:5,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:5,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:5,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:5,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:5,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:5,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:5,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:5,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:5,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:5,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:5,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:5,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:5,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:5,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:5,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:5,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:5,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:5,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:5,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:5,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:5,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:5,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:5,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:5,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:5,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:5,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:5,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:5,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:5,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:5,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:5,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:5,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:5,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:5,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:5,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:5,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:5,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:5,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:5,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:5,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:5,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:5,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:5,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:5,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:5,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:5,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:5,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:5,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:5,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:5,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:5,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:5,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:5,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:5,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:5,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:5,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:5,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:5,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:5,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:5,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:5,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:5,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:5,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:5,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:5,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:5,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:5,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:5,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:5,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:5,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:6,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:6,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:6,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:6,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:6,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:6,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:6,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:6,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:6,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:6,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:6,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:6,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:6,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:6,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:6,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:6,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:6,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:6,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:6,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:6,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:6,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:6,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:6,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:6,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:6,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:6,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:6,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:6,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:6,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:6,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:6,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:6,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:6,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:6,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:6,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:6,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:6,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:6,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:6,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:6,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:6,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:6,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:6,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:6,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:6,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:6,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:6,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:6,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:6,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:6,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:6,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:6,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:6,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:6,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:6,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:6,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:6,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:6,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:6,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:6,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:6,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:6,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:6,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:6,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:6,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:6,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:6,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:6,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:6,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:6,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:6,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:6,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:6,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:6,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:6,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:6,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:6,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:6,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:6,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:6,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:6,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:6,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:7,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:7,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:7,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:7,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:7,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:7,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:7,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:7,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:7,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:7,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:7,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:7,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:7,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:7,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:7,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:7,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:7,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:7,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:7,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:7,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:7,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:7,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:7,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:7,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:7,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:7,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:7,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:7,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:7,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:7,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:7,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:7,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:7,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:7,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:7,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:7,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:7,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:7,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:7,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:7,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:7,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:7,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:7,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:7,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:7,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:7,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:7,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:7,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:7,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:7,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:7,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:7,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:7,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:7,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:7,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:7,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:7,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:7,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:7,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:7,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:7,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:7,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:7,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:7,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:7,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:7,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:7,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:7,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:7,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:7,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:7,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:7,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:7,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:7,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:7,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:7,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:7,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:7,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:7,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:7,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:7,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:7,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:8,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:8,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:8,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:8,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:8,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:8,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:8,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:8,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:8,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:8,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:8,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:8,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:8,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:8,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:8,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:8,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:8,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:8,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:8,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:8,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:8,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:8,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:8,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:8,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:8,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:8,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:8,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:8,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:8,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:8,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:8,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:8,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:8,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:8,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:8,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:8,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:8,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:8,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:8,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:8,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:8,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:8,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:8,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:8,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:8,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:8,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:8,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:8,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:8,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:8,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:8,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:8,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:8,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:8,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:8,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:8,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:8,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:8,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:8,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:8,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:8,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:8,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:8,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:8,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:8,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:8,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:8,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:8,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:8,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:8,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:8,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:8,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:8,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:8,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:8,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:8,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:8,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:8,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:8,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:8,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:8,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:8,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:9,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:9,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:9,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:9,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:9,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:9,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:9,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:9,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:9,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:9,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:9,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:9,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:9,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:9,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:9,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:9,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:9,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:9,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:9,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:9,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:9,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:9,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:9,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:9,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:9,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:9,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:9,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:9,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:9,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:9,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:9,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:9,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:9,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:9,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:9,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:9,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:9,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:9,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:9,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:9,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:9,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:9,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:9,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:9,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:9,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:9,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:9,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:9,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:9,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:9,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:9,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:9,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:9,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:9,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:9,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:9,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:9,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:9,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:9,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:9,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:9,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:9,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:9,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:9,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:9,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:9,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:9,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:9,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:9,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:9,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:9,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:9,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:9,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:9,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:9,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:9,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:9,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:9,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:9,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:9,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:9,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:9,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:10,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:10,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:10,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:10,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:10,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:10,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:10,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:10,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:10,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:10,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:10,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:10,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:10,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:10,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:10,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:10,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:10,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:10,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:10,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:10,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:10,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:10,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:10,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:10,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:10,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:10,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:10,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:10,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:10,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:10,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:10,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:10,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:10,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:10,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:10,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:10,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:10,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:10,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:10,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:10,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:10,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:10,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:10,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:10,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:10,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:10,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:10,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:10,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:10,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:10,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:10,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:10,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:10,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:10,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:10,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:10,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:10,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:10,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:10,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:10,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:10,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:10,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:10,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:10,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:10,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:10,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:10,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:10,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:10,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:10,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:10,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:10,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:10,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:10,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:10,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:10,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:10,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:10,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:10,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:10,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:10,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:10,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:11,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:11,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:11,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:11,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:11,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:11,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:11,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:11,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:11,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:11,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:11,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:11,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:11,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:11,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:11,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:11,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:11,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:11,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:11,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:11,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:11,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:11,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:11,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:11,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:11,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:11,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:11,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:11,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:11,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:11,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:11,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:11,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:11,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:11,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:11,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:11,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:11,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:11,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:11,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:11,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:11,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:11,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:11,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:11,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:11,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:11,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:11,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:11,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:11,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:11,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:11,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:11,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:11,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:11,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:11,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:11,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:11,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:11,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:11,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:11,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:11,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:11,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:11,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:11,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:11,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:11,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:11,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:11,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:11,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:11,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:11,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:11,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:11,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:11,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:11,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:11,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:11,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:11,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:11,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:11,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:11,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:11,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:12,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:12,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:12,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:12,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:12,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:12,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:12,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:12,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:12,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:12,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:12,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:12,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:12,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:12,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:12,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:12,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:12,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:12,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:12,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:12,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:12,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:12,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:12,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:12,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:12,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:12,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:12,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:12,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:12,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:12,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:12,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:12,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:12,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:12,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:12,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:12,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:12,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:12,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:12,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:12,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:12,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:12,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:12,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:12,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:12,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:12,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:12,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:12,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:12,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:12,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:12,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:12,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:12,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:12,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:12,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:12,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:12,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:12,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:12,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:12,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:12,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:12,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:12,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:12,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:12,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:12,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:12,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:12,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:12,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:12,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:12,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:12,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:12,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:12,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:12,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:12,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:12,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:12,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:12,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:12,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:12,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:12,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:13,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:13,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:13,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:13,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:13,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:13,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:13,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:13,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:13,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:13,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:13,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:13,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:13,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:13,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:13,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:13,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:13,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:13,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:13,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:13,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:13,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:13,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:13,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:13,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:13,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:13,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:13,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:13,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:13,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:13,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:13,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:13,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:13,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:13,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:13,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:13,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:13,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:13,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:13,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:13,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:13,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:13,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:13,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:13,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:13,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:13,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:13,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:13,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:13,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:13,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:13,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:13,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:13,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:13,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:13,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:13,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:13,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:13,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:13,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:13,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:13,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:13,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:13,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:13,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:13,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:13,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:13,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:13,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:13,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:13,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:13,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:13,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:13,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:13,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:13,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:13,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:13,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:13,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:13,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:13,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:13,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:13,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:14,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:14,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:14,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:14,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:14,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:14,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:14,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:14,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:14,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:14,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:14,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:14,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:14,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:14,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:14,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:14,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:14,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:14,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:14,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:14,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:14,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:14,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:14,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:14,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:14,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:14,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:14,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:14,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:14,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:14,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:14,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:14,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:14,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:14,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:14,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:14,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:14,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:14,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:14,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:14,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:14,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:14,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:14,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:14,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:14,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:14,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:14,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:14,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:14,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:14,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:14,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:14,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:14,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:14,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:14,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:14,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:14,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:14,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:14,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:14,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:14,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:14,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:14,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:14,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:14,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:14,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:14,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:14,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:14,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:14,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:14,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:14,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:14,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:14,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:14,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:14,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:14,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:14,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:14,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:14,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:14,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:14,south=up,west=up]'
    ],
    [
        'minecraft:redstone_wire[east=none,north=none,power:15,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:15,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:15,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:15,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:15,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:15,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:15,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=none,power:15,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=none,power:15,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=none,power:15,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:15,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:15,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:15,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:15,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:15,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:15,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=side,power:15,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=side,power:15,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=side,power:15,south=up,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:15,south=none,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:15,south=none,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:15,south=none,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:15,south=side,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:15,south=side,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:15,south=side,west=up]',
        'minecraft:redstone_wire[east=none,north=up,power:15,south=up,west=none]',
        'minecraft:redstone_wire[east=none,north=up,power:15,south=up,west=side]',
        'minecraft:redstone_wire[east=none,north=up,power:15,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:15,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:15,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:15,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:15,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:15,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:15,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=none,power:15,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=none,power:15,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=none,power:15,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:15,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:15,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:15,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:15,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:15,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:15,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=side,power:15,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=side,power:15,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=side,power:15,south=up,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:15,south=none,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:15,south=none,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:15,south=none,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:15,south=side,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:15,south=side,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:15,south=side,west=up]',
        'minecraft:redstone_wire[east=side,north=up,power:15,south=up,west=none]',
        'minecraft:redstone_wire[east=side,north=up,power:15,south=up,west=side]',
        'minecraft:redstone_wire[east=side,north=up,power:15,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:15,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:15,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:15,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:15,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:15,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:15,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=none,power:15,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=none,power:15,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=none,power:15,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:15,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:15,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:15,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:15,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:15,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:15,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=side,power:15,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=side,power:15,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=side,power:15,south=up,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:15,south=none,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:15,south=none,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:15,south=none,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:15,south=side,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:15,south=side,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:15,south=side,west=up]',
        'minecraft:redstone_wire[east=up,north=up,power:15,south=up,west=none]',
        'minecraft:redstone_wire[east=up,north=up,power:15,south=up,west=side]',
        'minecraft:redstone_wire[east=up,north=up,power:15,south=up,west=up]'
    ],
    ['minecraft:diamond_ore', 'minecraft:diamond_ore'],
    ['minecraft:diamond_block', 'minecraft:diamond_block'],
    ['minecraft:crafting_table', 'minecraft:crafting_table'],
    ['minecraft:wheat[age=0]', 'minecraft:wheat[age=0]'],
    ['minecraft:wheat[age=1]', 'minecraft:wheat[age=1]'],
    ['minecraft:wheat[age=2]', 'minecraft:wheat[age=2]'],
    ['minecraft:wheat[age=3]', 'minecraft:wheat[age=3]'],
    ['minecraft:wheat[age=4]', 'minecraft:wheat[age=4]'],
    ['minecraft:wheat[age=5]', 'minecraft:wheat[age=5]'],
    ['minecraft:wheat[age=6]', 'minecraft:wheat[age=6]'],
    ['minecraft:wheat[age=7]', 'minecraft:wheat[age=7]'],
    ['minecraft:farmland[moisture=0]', 'minecraft:farmland[moisture=0]'],
    ['minecraft:farmland[moisture=1]', 'minecraft:farmland[moisture=1]'],
    ['minecraft:farmland[moisture=2]', 'minecraft:farmland[moisture=2]'],
    ['minecraft:farmland[moisture=3]', 'minecraft:farmland[moisture=3]'],
    ['minecraft:farmland[moisture=4]', 'minecraft:farmland[moisture=4]'],
    ['minecraft:farmland[moisture=5]', 'minecraft:farmland[moisture=5]'],
    ['minecraft:farmland[moisture=6]', 'minecraft:farmland[moisture=6]'],
    ['minecraft:farmland[moisture=7]', 'minecraft:farmland[moisture=7]'],
    ['minecraft:furnace[facing=north,lit=false]', 'minecraft:furnace[facing=north]'],
    ['minecraft:furnace[facing=south,lit=false]', 'minecraft:furnace[facing=south]'],
    ['minecraft:furnace[facing=west,lit=false]', 'minecraft:furnace[facing=west]'],
    ['minecraft:furnace[facing=east,lit=false]', 'minecraft:furnace[facing=east]'],
    ['minecraft:furnace[facing=north,lit=true]', 'minecraft:lit_furnace[facing=north]'],
    ['minecraft:furnace[facing=south,lit=true]', 'minecraft:lit_furnace[facing=south]'],
    ['minecraft:furnace[facing=west,lit=true]', 'minecraft:lit_furnace[facing=west]'],
    ['minecraft:furnace[facing=east,lit=true]', 'minecraft:lit_furnace[facing=east]'],
    ['minecraft:sign[rotation=0]', 'minecraft:standing_sign[rotation=0]'],
    ['minecraft:sign[rotation=1]', 'minecraft:standing_sign[rotation=1]'],
    ['minecraft:sign[rotation=2]', 'minecraft:standing_sign[rotation=2]'],
    ['minecraft:sign[rotation=3]', 'minecraft:standing_sign[rotation=3]'],
    ['minecraft:sign[rotation=4]', 'minecraft:standing_sign[rotation=4]'],
    ['minecraft:sign[rotation=5]', 'minecraft:standing_sign[rotation=5]'],
    ['minecraft:sign[rotation=6]', 'minecraft:standing_sign[rotation=6]'],
    ['minecraft:sign[rotation=7]', 'minecraft:standing_sign[rotation=7]'],
    ['minecraft:sign[rotation=8]', 'minecraft:standing_sign[rotation=8]'],
    ['minecraft:sign[rotation=9]', 'minecraft:standing_sign[rotation=9]'],
    ['minecraft:sign[rotation=10]', 'minecraft:standing_sign[rotation=10]'],
    ['minecraft:sign[rotation=11]', 'minecraft:standing_sign[rotation=11]'],
    ['minecraft:sign[rotation=12]', 'minecraft:standing_sign[rotation=12]'],
    ['minecraft:sign[rotation=13]', 'minecraft:standing_sign[rotation=13]'],
    ['minecraft:sign[rotation=14]', 'minecraft:standing_sign[rotation=14]'],
    ['minecraft:sign[rotation=15]', 'minecraft:standing_sign[rotation=15]'],
    [
        'minecraft:oak_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:wooden_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:wooden_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:wooden_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:wooden_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:oak_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:wooden_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:wooden_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:wooden_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:wooden_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:oak_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:wooden_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:wooden_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:wooden_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:wooden_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:oak_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:wooden_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:wooden_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:wooden_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:wooden_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:oak_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:wooden_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:wooden_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:wooden_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:wooden_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:oak_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:wooden_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:wooden_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:wooden_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:wooden_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:oak_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:wooden_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:wooden_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:wooden_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:wooden_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:oak_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:wooden_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:wooden_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:wooden_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:wooden_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:oak_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:wooden_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:wooden_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:wooden_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:wooden_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:wooden_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:wooden_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:wooden_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:wooden_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
    ],
    [
        'minecraft:oak_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:wooden_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:wooden_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:wooden_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:wooden_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:wooden_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:wooden_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:wooden_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:wooden_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
    ],
    [
        'minecraft:oak_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:wooden_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:wooden_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:wooden_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:wooden_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:wooden_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:wooden_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:wooden_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:wooden_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
    ],
    [
        'minecraft:oak_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:wooden_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:wooden_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:wooden_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:wooden_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:wooden_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:wooden_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:wooden_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:wooden_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
    ],
    ['minecraft:ladder[facing=north]', 'minecraft:ladder[facing=north]'],
    ['minecraft:ladder[facing=south]', 'minecraft:ladder[facing=south]'],
    ['minecraft:ladder[facing=west]', 'minecraft:ladder[facing=west]'],
    ['minecraft:ladder[facing=east]', 'minecraft:ladder[facing=east]'],
    ['minecraft:rail[shape=north_south]', 'minecraft:rail[shape=north_south]'],
    ['minecraft:rail[shape=east_west]', 'minecraft:rail[shape=east_west]'],
    ['minecraft:rail[shape=ascending_east]', 'minecraft:rail[shape=ascending_east]'],
    ['minecraft:rail[shape=ascending_west]', 'minecraft:rail[shape=ascending_west]'],
    ['minecraft:rail[shape=ascending_north]', 'minecraft:rail[shape=ascending_north]'],
    ['minecraft:rail[shape=ascending_south]', 'minecraft:rail[shape=ascending_south]'],
    ['minecraft:rail[shape=south_east]', 'minecraft:rail[shape=south_east]'],
    ['minecraft:rail[shape=south_west]', 'minecraft:rail[shape=south_west]'],
    ['minecraft:rail[shape=north_west]', 'minecraft:rail[shape=north_west]'],
    ['minecraft:rail[shape=north_east]', 'minecraft:rail[shape=north_east]'],
    [
        'minecraft:cobblestone_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:stone_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:stone_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:stone_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:stone_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:stone_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:cobblestone_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:stone_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:stone_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:stone_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:stone_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:stone_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:cobblestone_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:stone_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:stone_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:stone_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:stone_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:stone_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:cobblestone_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:stone_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:stone_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:stone_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:stone_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:stone_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:cobblestone_stairs[facing=east,half=top,shape=straight]',
        'minecraft:stone_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:stone_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:stone_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:stone_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:stone_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:cobblestone_stairs[facing=west,half=top,shape=straight]',
        'minecraft:stone_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:stone_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:stone_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:stone_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:stone_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:cobblestone_stairs[facing=south,half=top,shape=straight]',
        'minecraft:stone_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:stone_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:stone_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:stone_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:stone_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:cobblestone_stairs[facing=north,half=top,shape=straight]',
        'minecraft:stone_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:stone_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:stone_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:stone_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:stone_stairs[facing=north,half=top,shape=straight]'
    ],
    ['minecraft:wall_sign[facing=north]', 'minecraft:wall_sign[facing=north]'],
    ['minecraft:wall_sign[facing=south]', 'minecraft:wall_sign[facing=south]'],
    ['minecraft:wall_sign[facing=west]', 'minecraft:wall_sign[facing=west]'],
    ['minecraft:wall_sign[facing=east]', 'minecraft:wall_sign[facing=east]'],
    ['minecraft:lever[face=ceiling,facing=west,powered=false]', 'minecraft:lever[facing=down_x,powered=false]'],
    ['minecraft:lever[face=wall,facing=east,powered=false]', 'minecraft:lever[facing=east,powered=false]'],
    ['minecraft:lever[face=wall,facing=west,powered=false]', 'minecraft:lever[facing=west,powered=false]'],
    ['minecraft:lever[face=wall,facing=south,powered=false]', 'minecraft:lever[facing=south,powered=false]'],
    ['minecraft:lever[face=wall,facing=north,powered=false]', 'minecraft:lever[facing=north,powered=false]'],
    ['minecraft:lever[face=floor,facing=north,powered=false]', 'minecraft:lever[facing=up_z,powered=false]'],
    ['minecraft:lever[face=floor,facing=west,powered=false]', 'minecraft:lever[facing=up_x,powered=false]'],
    ['minecraft:lever[face=ceiling,facing=north,powered=false]', 'minecraft:lever[facing=down_z,powered=false]'],
    ['minecraft:lever[face=ceiling,facing=west,powered=true]', 'minecraft:lever[facing=down_x,powered=true]'],
    ['minecraft:lever[face=wall,facing=east,powered=true]', 'minecraft:lever[facing=east,powered=true]'],
    ['minecraft:lever[face=wall,facing=west,powered=true]', 'minecraft:lever[facing=west,powered=true]'],
    ['minecraft:lever[face=wall,facing=south,powered=true]', 'minecraft:lever[facing=south,powered=true]'],
    ['minecraft:lever[face=wall,facing=north,powered=true]', 'minecraft:lever[facing=north,powered=true]'],
    ['minecraft:lever[face=floor,facing=north,powered=true]', 'minecraft:lever[facing=up_z,powered=true]'],
    ['minecraft:lever[face=floor,facing=west,powered=true]', 'minecraft:lever[facing=up_x,powered=true]'],
    ['minecraft:lever[face=ceiling,facing=north,powered=true]', 'minecraft:lever[facing=down_z,powered=true]'],
    ['minecraft:stone_pressure_plate[powered=false]', 'minecraft:stone_pressure_plate[powered=false]'],
    ['minecraft:stone_pressure_plate[powered=true]', 'minecraft:stone_pressure_plate[powered=true]'],
    [
        'minecraft:iron_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:iron_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:iron_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:iron_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:iron_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:iron_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:iron_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:iron_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:iron_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:iron_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:iron_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:iron_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:iron_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:iron_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:iron_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:iron_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:iron_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:iron_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:iron_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:iron_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:iron_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:iron_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:iron_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:iron_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:iron_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:iron_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:iron_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:iron_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:iron_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:iron_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:iron_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:iron_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:iron_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:iron_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:iron_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:iron_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:iron_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:iron_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:iron_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:iron_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:iron_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:iron_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:iron_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:iron_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:iron_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:iron_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:iron_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:iron_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:iron_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
    ],
    [
        'minecraft:iron_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:iron_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:iron_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:iron_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:iron_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:iron_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:iron_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:iron_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:iron_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
    ],
    [
        'minecraft:iron_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:iron_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:iron_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:iron_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:iron_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:iron_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:iron_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:iron_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:iron_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
    ],
    [
        'minecraft:iron_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:iron_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:iron_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:iron_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:iron_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:iron_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:iron_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:iron_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:iron_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
    ],
    ['minecraft:oak_pressure_plate[powered=false]', 'minecraft:wooden_pressure_plate[powered=false]'],
    ['minecraft:oak_pressure_plate[powered=true]', 'minecraft:wooden_pressure_plate[powered=true]'],
    ['minecraft:redstone_ore[lit=false]', 'minecraft:redstone_ore'],
    ['minecraft:redstone_ore[lit=true]', 'minecraft:lit_redstone_ore'],
    ['minecraft:redstone_wall_torch[facing=east,lit=false]', 'minecraft:unlit_redstone_torch[facing=east]'],
    ['minecraft:redstone_wall_torch[facing=west,lit=false]', 'minecraft:unlit_redstone_torch[facing=west]'],
    ['minecraft:redstone_wall_torch[facing=south,lit=false]', 'minecraft:unlit_redstone_torch[facing=south]'],
    ['minecraft:redstone_wall_torch[facing=north,lit=false]', 'minecraft:unlit_redstone_torch[facing=north]'],
    ['minecraft:redstone_torch[lit=false]', 'minecraft:unlit_redstone_torch[facing=up]'],
    ['minecraft:redstone_wall_torch[facing=east,lit=true]', 'minecraft:redstone_torch[facing=east]'],
    ['minecraft:redstone_wall_torch[facing=west,lit=true]', 'minecraft:redstone_torch[facing=west]'],
    ['minecraft:redstone_wall_torch[facing=south,lit=true]', 'minecraft:redstone_torch[facing=south]'],
    ['minecraft:redstone_wall_torch[facing=north,lit=true]', 'minecraft:redstone_torch[facing=north]'],
    ['minecraft:redstone_torch[lit=true]', 'minecraft:redstone_torch[facing=up]'],
    [
        'minecraft:stone_button[face=ceiling,facing=north,powered=false]',
        'minecraft:stone_button[facing=down,powered=false]'
    ],
    [
        'minecraft:stone_button[face=wall,facing=east,powered=false]',
        'minecraft:stone_button[facing=east,powered=false]'
    ],
    [
        'minecraft:stone_button[face=wall,facing=west,powered=false]',
        'minecraft:stone_button[facing=west,powered=false]'
    ],
    [
        'minecraft:stone_button[face=wall,facing=south,powered=false]',
        'minecraft:stone_button[facing=south,powered=false]'
    ],
    [
        'minecraft:stone_button[face=wall,facing=north,powered=false]',
        'minecraft:stone_button[facing=north,powered=false]'
    ],
    [
        'minecraft:stone_button[face=floor,facing=north,powered=false]',
        'minecraft:stone_button[facing=up,powered=false]'
    ],
    [
        'minecraft:stone_button[face=ceiling,facing=north,powered=true]',
        'minecraft:stone_button[facing=down,powered=true]'
    ],
    [
        'minecraft:stone_button[face=wall,facing=east,powered=true]',
        'minecraft:stone_button[facing=east,powered=true]'
    ],
    [
        'minecraft:stone_button[face=wall,facing=west,powered=true]',
        'minecraft:stone_button[facing=west,powered=true]'
    ],
    [
        'minecraft:stone_button[face=wall,facing=south,powered=true]',
        'minecraft:stone_button[facing=south,powered=true]'
    ],
    [
        'minecraft:stone_button[face=wall,facing=north,powered=true]',
        'minecraft:stone_button[facing=north,powered=true]'
    ],
    [
        'minecraft:stone_button[face=floor,facing=north,powered=true]',
        'minecraft:stone_button[facing=up,powered=true]'
    ],
    ['minecraft:snow[layers=1]', 'minecraft:snow_layer[layers=1]'],
    ['minecraft:snow[layers=2]', 'minecraft:snow_layer[layers=2]'],
    ['minecraft:snow[layers=3]', 'minecraft:snow_layer[layers=3]'],
    ['minecraft:snow[layers=4]', 'minecraft:snow_layer[layers=4]'],
    ['minecraft:snow[layers=5]', 'minecraft:snow_layer[layers=5]'],
    ['minecraft:snow[layers=6]', 'minecraft:snow_layer[layers=6]'],
    ['minecraft:snow[layers=7]', 'minecraft:snow_layer[layers=7]'],
    ['minecraft:snow[layers=8]', 'minecraft:snow_layer[layers=8]'],
    ['minecraft:ice', 'minecraft:ice'],
    ['minecraft:snow_block', 'minecraft:snow'],
    ['minecraft:cactus[age=0]', 'minecraft:cactus[age=0]'],
    ['minecraft:cactus[age=1]', 'minecraft:cactus[age=1]'],
    ['minecraft:cactus[age=2]', 'minecraft:cactus[age=2]'],
    ['minecraft:cactus[age=3]', 'minecraft:cactus[age=3]'],
    ['minecraft:cactus[age=4]', 'minecraft:cactus[age=4]'],
    ['minecraft:cactus[age=5]', 'minecraft:cactus[age=5]'],
    ['minecraft:cactus[age=6]', 'minecraft:cactus[age=6]'],
    ['minecraft:cactus[age=7]', 'minecraft:cactus[age=7]'],
    ['minecraft:cactus[age=8]', 'minecraft:cactus[age=8]'],
    ['minecraft:cactus[age=9]', 'minecraft:cactus[age=9]'],
    ['minecraft:cactus[age=10]', 'minecraft:cactus[age=10]'],
    ['minecraft:cactus[age=11]', 'minecraft:cactus[age=11]'],
    ['minecraft:cactus[age=12]', 'minecraft:cactus[age=12]'],
    ['minecraft:cactus[age=13]', 'minecraft:cactus[age=13]'],
    ['minecraft:cactus[age=14]', 'minecraft:cactus[age=14]'],
    ['minecraft:cactus[age=15]', 'minecraft:cactus[age=15]'],
    ['minecraft:clay', 'minecraft:clay'],
    ['minecraft:sugar_cane[age=0]', 'minecraft:reeds[age=0]'],
    ['minecraft:sugar_cane[age=1]', 'minecraft:reeds[age=1]'],
    ['minecraft:sugar_cane[age=2]', 'minecraft:reeds[age=2]'],
    ['minecraft:sugar_cane[age=3]', 'minecraft:reeds[age=3]'],
    ['minecraft:sugar_cane[age=4]', 'minecraft:reeds[age=4]'],
    ['minecraft:sugar_cane[age=5]', 'minecraft:reeds[age=5]'],
    ['minecraft:sugar_cane[age=6]', 'minecraft:reeds[age=6]'],
    ['minecraft:sugar_cane[age=7]', 'minecraft:reeds[age=7]'],
    ['minecraft:sugar_cane[age=8]', 'minecraft:reeds[age=8]'],
    ['minecraft:sugar_cane[age=9]', 'minecraft:reeds[age=9]'],
    ['minecraft:sugar_cane[age=10]', 'minecraft:reeds[age=10]'],
    ['minecraft:sugar_cane[age=11]', 'minecraft:reeds[age=11]'],
    ['minecraft:sugar_cane[age=12]', 'minecraft:reeds[age=12]'],
    ['minecraft:sugar_cane[age=13]', 'minecraft:reeds[age=13]'],
    ['minecraft:sugar_cane[age=14]', 'minecraft:reeds[age=14]'],
    ['minecraft:sugar_cane[age=15]', 'minecraft:reeds[age=15]'],
    ['minecraft:jukebox[has_record=false]', 'minecraft:jukebox[has_record=false]'],
    ['minecraft:jukebox[has_record=true]', 'minecraft:jukebox[has_record=true]'],
    [
        'minecraft:oak_fence[east=false,north=false,south:false,west=false]',
        'minecraft:fence[east=false,north=false,south:false,west=false]',
        'minecraft:fence[east=false,north=false,south:false,west=true]',
        'minecraft:fence[east=false,north=false,south:true,west=false]',
        'minecraft:fence[east=false,north=false,south:true,west=true]',
        'minecraft:fence[east=false,north=true,south:false,west=false]',
        'minecraft:fence[east=false,north=true,south:false,west=true]',
        'minecraft:fence[east=false,north=true,south:true,west=false]',
        'minecraft:fence[east=false,north=true,south:true,west=true]',
        'minecraft:fence[east=true,north=false,south:false,west=false]',
        'minecraft:fence[east=true,north=false,south:false,west=true]',
        'minecraft:fence[east=true,north=false,south:true,west=false]',
        'minecraft:fence[east=true,north=false,south:true,west=true]',
        'minecraft:fence[east=true,north=true,south:false,west=false]',
        'minecraft:fence[east=true,north=true,south:false,west=true]',
        'minecraft:fence[east=true,north=true,south:true,west=false]',
        'minecraft:fence[east=true,north=true,south:true,west=true]'
    ],
    ['minecraft:carved_pumpkin[facing=south]', 'minecraft:pumpkin[facing=south]'],
    ['minecraft:carved_pumpkin[facing=west]', 'minecraft:pumpkin[facing=west]'],
    ['minecraft:carved_pumpkin[facing=north]', 'minecraft:pumpkin[facing=north]'],
    ['minecraft:carved_pumpkin[facing=east]', 'minecraft:pumpkin[facing=east]'],
    ['minecraft:netherrack', 'minecraft:netherrack'],
    ['minecraft:soul_sand', 'minecraft:soul_sand'],
    ['minecraft:glowstone', 'minecraft:glowstone'],
    ['minecraft:portal[axis=x]', 'minecraft:nether_portal[axis=x]'],
    ['minecraft:portal[axis=z]', 'minecraft:nether_portal[axis=z]'],
    ['minecraft:jack_o_lantern[facing=south]', 'minecraft:lit_pumpkin[facing=south]'],
    ['minecraft:jack_o_lantern[facing=west]', 'minecraft:lit_pumpkin[facing=west]'],
    ['minecraft:jack_o_lantern[facing=north]', 'minecraft:lit_pumpkin[facing=north]'],
    ['minecraft:jack_o_lantern[facing=east]', 'minecraft:lit_pumpkin[facing=east]'],
    ['minecraft:cake[bites=0]', 'minecraft:cake[bites=0]'],
    ['minecraft:cake[bites=1]', 'minecraft:cake[bites=1]'],
    ['minecraft:cake[bites=2]', 'minecraft:cake[bites=2]'],
    ['minecraft:cake[bites=3]', 'minecraft:cake[bites=3]'],
    ['minecraft:cake[bites=4]', 'minecraft:cake[bites=4]'],
    ['minecraft:cake[bites=5]', 'minecraft:cake[bites=5]'],
    ['minecraft:cake[bites=6]', 'minecraft:cake[bites=6]'],
    [
        'minecraft:repeater[delay=1,facing=south,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=1,facing=south,locked=false]',
        'minecraft:unpowered_repeater[delay=1,facing=south,locked=true]'
    ],
    [
        'minecraft:repeater[delay=1,facing=west,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=1,facing=west,locked=false]',
        'minecraft:unpowered_repeater[delay=1,facing=west,locked=true]'
    ],
    [
        'minecraft:repeater[delay=1,facing=north,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=1,facing=north,locked=false]',
        'minecraft:unpowered_repeater[delay=1,facing=north,locked=true]'
    ],
    [
        'minecraft:repeater[delay=1,facing=east,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=1,facing=east,locked=false]',
        'minecraft:unpowered_repeater[delay=1,facing=east,locked=true]'
    ],
    [
        'minecraft:repeater[delay=2,facing=south,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=2,facing=south,locked=false]',
        'minecraft:unpowered_repeater[delay=2,facing=south,locked=true]'
    ],
    [
        'minecraft:repeater[delay=2,facing=west,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=2,facing=west,locked=false]',
        'minecraft:unpowered_repeater[delay=2,facing=west,locked=true]'
    ],
    [
        'minecraft:repeater[delay=2,facing=north,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=2,facing=north,locked=false]',
        'minecraft:unpowered_repeater[delay=2,facing=north,locked=true]'
    ],
    [
        'minecraft:repeater[delay=2,facing=east,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=2,facing=east,locked=false]',
        'minecraft:unpowered_repeater[delay=2,facing=east,locked=true]'
    ],
    [
        'minecraft:repeater[delay=3,facing=south,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=3,facing=south,locked=false]',
        'minecraft:unpowered_repeater[delay=3,facing=south,locked=true]'
    ],
    [
        'minecraft:repeater[delay=3,facing=west,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=3,facing=west,locked=false]',
        'minecraft:unpowered_repeater[delay=3,facing=west,locked=true]'
    ],
    [
        'minecraft:repeater[delay=3,facing=north,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=3,facing=north,locked=false]',
        'minecraft:unpowered_repeater[delay=3,facing=north,locked=true]'
    ],
    [
        'minecraft:repeater[delay=3,facing=east,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=3,facing=east,locked=false]',
        'minecraft:unpowered_repeater[delay=3,facing=east,locked=true]'
    ],
    [
        'minecraft:repeater[delay=4,facing=south,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=4,facing=south,locked=false]',
        'minecraft:unpowered_repeater[delay=4,facing=south,locked=true]'
    ],
    [
        'minecraft:repeater[delay=4,facing=west,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=4,facing=west,locked=false]',
        'minecraft:unpowered_repeater[delay=4,facing=west,locked=true]'
    ],
    [
        'minecraft:repeater[delay=4,facing=north,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=4,facing=north,locked=false]',
        'minecraft:unpowered_repeater[delay=4,facing=north,locked=true]'
    ],
    [
        'minecraft:repeater[delay=4,facing=east,locked:false,powered=false]',
        'minecraft:unpowered_repeater[delay=4,facing=east,locked=false]',
        'minecraft:unpowered_repeater[delay=4,facing=east,locked=true]'
    ],
    [
        'minecraft:repeater[delay=1,facing=south,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=1,facing=south,locked=false]',
        'minecraft:powered_repeater[delay=1,facing=south,locked=true]'
    ],
    [
        'minecraft:repeater[delay=1,facing=west,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=1,facing=west,locked=false]',
        'minecraft:powered_repeater[delay=1,facing=west,locked=true]'
    ],
    [
        'minecraft:repeater[delay=1,facing=north,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=1,facing=north,locked=false]',
        'minecraft:powered_repeater[delay=1,facing=north,locked=true]'
    ],
    [
        'minecraft:repeater[delay=1,facing=east,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=1,facing=east,locked=false]',
        'minecraft:powered_repeater[delay=1,facing=east,locked=true]'
    ],
    [
        'minecraft:repeater[delay=2,facing=south,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=2,facing=south,locked=false]',
        'minecraft:powered_repeater[delay=2,facing=south,locked=true]'
    ],
    [
        'minecraft:repeater[delay=2,facing=west,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=2,facing=west,locked=false]',
        'minecraft:powered_repeater[delay=2,facing=west,locked=true]'
    ],
    [
        'minecraft:repeater[delay=2,facing=north,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=2,facing=north,locked=false]',
        'minecraft:powered_repeater[delay=2,facing=north,locked=true]'
    ],
    [
        'minecraft:repeater[delay=2,facing=east,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=2,facing=east,locked=false]',
        'minecraft:powered_repeater[delay=2,facing=east,locked=true]'
    ],
    [
        'minecraft:repeater[delay=3,facing=south,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=3,facing=south,locked=false]',
        'minecraft:powered_repeater[delay=3,facing=south,locked=true]'
    ],
    [
        'minecraft:repeater[delay=3,facing=west,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=3,facing=west,locked=false]',
        'minecraft:powered_repeater[delay=3,facing=west,locked=true]'
    ],
    [
        'minecraft:repeater[delay=3,facing=north,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=3,facing=north,locked=false]',
        'minecraft:powered_repeater[delay=3,facing=north,locked=true]'
    ],
    [
        'minecraft:repeater[delay=3,facing=east,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=3,facing=east,locked=false]',
        'minecraft:powered_repeater[delay=3,facing=east,locked=true]'
    ],
    [
        'minecraft:repeater[delay=4,facing=south,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=4,facing=south,locked=false]',
        'minecraft:powered_repeater[delay=4,facing=south,locked=true]'
    ],
    [
        'minecraft:repeater[delay=4,facing=west,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=4,facing=west,locked=false]',
        'minecraft:powered_repeater[delay=4,facing=west,locked=true]'
    ],
    [
        'minecraft:repeater[delay=4,facing=north,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=4,facing=north,locked=false]',
        'minecraft:powered_repeater[delay=4,facing=north,locked=true]'
    ],
    [
        'minecraft:repeater[delay=4,facing=east,locked:false,powered=true]',
        'minecraft:powered_repeater[delay=4,facing=east,locked=false]',
        'minecraft:powered_repeater[delay=4,facing=east,locked=true]'
    ],
    ['minecraft:white_stained_glass', 'minecraft:stained_glass[color=white]'],
    ['minecraft:orange_stained_glass', 'minecraft:stained_glass[color=orange]'],
    ['minecraft:magenta_stained_glass', 'minecraft:stained_glass[color=magenta]'],
    ['minecraft:light_blue_stained_glass', 'minecraft:stained_glass[color=light_blue]'],
    ['minecraft:yellow_stained_glass', 'minecraft:stained_glass[color=yellow]'],
    ['minecraft:lime_stained_glass', 'minecraft:stained_glass[color=lime]'],
    ['minecraft:pink_stained_glass', 'minecraft:stained_glass[color=pink]'],
    ['minecraft:gray_stained_glass', 'minecraft:stained_glass[color=gray]'],
    ['minecraft:light_gray_stained_glass', 'minecraft:stained_glass[color=silver]'],
    ['minecraft:cyan_stained_glass', 'minecraft:stained_glass[color=cyan]'],
    ['minecraft:purple_stained_glass', 'minecraft:stained_glass[color=purple]'],
    ['minecraft:blue_stained_glass', 'minecraft:stained_glass[color=blue]'],
    ['minecraft:brown_stained_glass', 'minecraft:stained_glass[color=brown]'],
    ['minecraft:green_stained_glass', 'minecraft:stained_glass[color=green]'],
    ['minecraft:red_stained_glass', 'minecraft:stained_glass[color=red]'],
    ['minecraft:black_stained_glass', 'minecraft:stained_glass[color=black]'],
    [
        'minecraft:oak_trapdoor[facing=north,half=bottom,open=false]',
        'minecraft:trapdoor[facing=north,half=bottom,open=false]'
    ],
    [
        'minecraft:oak_trapdoor[facing=south,half=bottom,open=false]',
        'minecraft:trapdoor[facing=south,half=bottom,open=false]'
    ],
    [
        'minecraft:oak_trapdoor[facing=west,half=bottom,open=false]',
        'minecraft:trapdoor[facing=west,half=bottom,open=false]'
    ],
    [
        'minecraft:oak_trapdoor[facing=east,half=bottom,open=false]',
        'minecraft:trapdoor[facing=east,half=bottom,open=false]'
    ],
    [
        'minecraft:oak_trapdoor[facing=north,half=bottom,open=true]',
        'minecraft:trapdoor[facing=north,half=bottom,open=true]'
    ],
    [
        'minecraft:oak_trapdoor[facing=south,half=bottom,open=true]',
        'minecraft:trapdoor[facing=south,half=bottom,open=true]'
    ],
    [
        'minecraft:oak_trapdoor[facing=west,half=bottom,open=true]',
        'minecraft:trapdoor[facing=west,half=bottom,open=true]'
    ],
    [
        'minecraft:oak_trapdoor[facing=east,half=bottom,open=true]',
        'minecraft:trapdoor[facing=east,half=bottom,open=true]'
    ],
    [
        'minecraft:oak_trapdoor[facing=north,half=top,open=false]',
        'minecraft:trapdoor[facing=north,half=top,open=false]'
    ],
    [
        'minecraft:oak_trapdoor[facing=south,half=top,open=false]',
        'minecraft:trapdoor[facing=south,half=top,open=false]'
    ],
    [
        'minecraft:oak_trapdoor[facing=west,half=top,open=false]',
        'minecraft:trapdoor[facing=west,half=top,open=false]'
    ],
    [
        'minecraft:oak_trapdoor[facing=east,half=top,open=false]',
        'minecraft:trapdoor[facing=east,half=top,open=false]'
    ],
    [
        'minecraft:oak_trapdoor[facing=north,half=top,open=true]',
        'minecraft:trapdoor[facing=north,half=top,open=true]'
    ],
    [
        'minecraft:oak_trapdoor[facing=south,half=top,open=true]',
        'minecraft:trapdoor[facing=south,half=top,open=true]'
    ],
    [
        'minecraft:oak_trapdoor[facing=west,half=top,open=true]',
        'minecraft:trapdoor[facing=west,half=top,open=true]'
    ],
    [
        'minecraft:oak_trapdoor[facing=east,half=top,open=true]',
        'minecraft:trapdoor[facing=east,half=top,open=true]'
    ],
    ['minecraft:infested_stone', 'minecraft:monster_egg[variant=stone]'],
    ['minecraft:infested_cobblestone', 'minecraft:monster_egg[variant=cobblestone]'],
    ['minecraft:infested_stone_bricks', 'minecraft:monster_egg[variant=stone_brick]'],
    ['minecraft:infested_mossy_stone_bricks', 'minecraft:monster_egg[variant=mossy_brick]'],
    ['minecraft:infested_cracked_stone_bricks', 'minecraft:monster_egg[variant=cracked_brick]'],
    ['minecraft:infested_chiseled_stone_bricks', 'minecraft:monster_egg[variant=chiseled_brick]'],
    ['minecraft:stone_bricks', 'minecraft:stonebrick[variant=stonebrick]'],
    ['minecraft:mossy_stone_bricks', 'minecraft:stonebrick[variant=mossy_stonebrick]'],
    ['minecraft:cracked_stone_bricks', 'minecraft:stonebrick[variant=cracked_stonebrick]'],
    ['minecraft:chiseled_stone_bricks', 'minecraft:stonebrick[variant=chiseled_stonebrick]'],
    [
        'minecraft:brown_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]',
        'minecraft:brown_mushroom_block[variant=all_inside]'
    ],
    [
        'minecraft:brown_mushroom_block[north=true,east=false,south:false,west=true,up:true,down=false]',
        'minecraft:brown_mushroom_block[variant=north_west]'
    ],
    [
        'minecraft:brown_mushroom_block[north=true,east=false,south:false,west=false,up:true,down=false]',
        'minecraft:brown_mushroom_block[variant=north]'
    ],
    [
        'minecraft:brown_mushroom_block[north=true,east=true,south:false,west=false,up:true,down=false]',
        'minecraft:brown_mushroom_block[variant=north_east]'
    ],
    [
        'minecraft:brown_mushroom_block[north=false,east=false,south:false,west=true,up:true,down=false]',
        'minecraft:brown_mushroom_block[variant=west]'
    ],
    [
        'minecraft:brown_mushroom_block[north=false,east=false,south:false,west=false,up:true,down=false]',
        'minecraft:brown_mushroom_block[variant=center]'
    ],
    [
        'minecraft:brown_mushroom_block[north=false,east=true,south:false,west=false,up:true,down=false]',
        'minecraft:brown_mushroom_block[variant=east]'
    ],
    [
        'minecraft:brown_mushroom_block[north=false,east=false,south:true,west=true,up:true,down=false]',
        'minecraft:brown_mushroom_block[variant=south_west]'
    ],
    [
        'minecraft:brown_mushroom_block[north=false,east=false,south:true,west=false,up:true,down=false]',
        'minecraft:brown_mushroom_block[variant=south]'
    ],
    [
        'minecraft:brown_mushroom_block[north=false,east=true,south:true,west=false,up:true,down=false]',
        'minecraft:brown_mushroom_block[variant=south_east]'
    ],
    [
        'minecraft:mushroom_stem[north=true,east=true,south:true,west=true,up:false,down=false]',
        'minecraft:brown_mushroom_block[variant=stem]'
    ],
    ['minecraft:brown_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]', ''],
    ['minecraft:brown_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]', ''],
    ['minecraft:brown_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]', ''],
    [
        'minecraft:brown_mushroom_block[north=true,east=true,south:true,west=true,up:true,down=true]',
        'minecraft:brown_mushroom_block[variant=all_outside]'
    ],
    [
        'minecraft:mushroom_stem[north=true,east=true,south:true,west=true,up:true,down=true]',
        'minecraft:brown_mushroom_block[variant=all_stem]'
    ],
    [
        'minecraft:red_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]',
        'minecraft:red_mushroom_block[variant=all_inside]'
    ],
    [
        'minecraft:red_mushroom_block[north=true,east=false,south:false,west=true,up:true,down=false]',
        'minecraft:red_mushroom_block[variant=north_west]'
    ],
    [
        'minecraft:red_mushroom_block[north=true,east=false,south:false,west=false,up:true,down=false]',
        'minecraft:red_mushroom_block[variant=north]'
    ],
    [
        'minecraft:red_mushroom_block[north=true,east=true,south:false,west=false,up:true,down=false]',
        'minecraft:red_mushroom_block[variant=north_east]'
    ],
    [
        'minecraft:red_mushroom_block[north=false,east=false,south:false,west=true,up:true,down=false]',
        'minecraft:red_mushroom_block[variant=west]'
    ],
    [
        'minecraft:red_mushroom_block[north=false,east=false,south:false,west=false,up:true,down=false]',
        'minecraft:red_mushroom_block[variant=center]'
    ],
    [
        'minecraft:red_mushroom_block[north=false,east=true,south:false,west=false,up:true,down=false]',
        'minecraft:red_mushroom_block[variant=east]'
    ],
    [
        'minecraft:red_mushroom_block[north=false,east=false,south:true,west=true,up:true,down=false]',
        'minecraft:red_mushroom_block[variant=south_west]'
    ],
    [
        'minecraft:red_mushroom_block[north=false,east=false,south:true,west=false,up:true,down=false]',
        'minecraft:red_mushroom_block[variant=south]'
    ],
    [
        'minecraft:red_mushroom_block[north=false,east=true,south:true,west=false,up:true,down=false]',
        'minecraft:red_mushroom_block[variant=south_east]'
    ],
    [
        'minecraft:mushroom_stem[north=true,east=true,south:true,west=true,up:false,down=false]',
        'minecraft:red_mushroom_block[variant=stem]'
    ],
    ['minecraft:red_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]', ''],
    ['minecraft:red_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]', ''],
    ['minecraft:red_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]', ''],
    [
        'minecraft:red_mushroom_block[north=true,east=true,south:true,west=true,up:true,down=true]',
        'minecraft:red_mushroom_block[variant=all_outside]'
    ],
    [
        'minecraft:mushroom_stem[north=true,east=true,south:true,west=true,up:true,down=true]',
        'minecraft:red_mushroom_block[variant=all_stem]'
    ],
    [
        'minecraft:iron_bars[east=false,north=false,south:false,west=false]',
        'minecraft:iron_bars[east=false,north=false,south:false,west=false]',
        'minecraft:iron_bars[east=false,north=false,south:false,west=true]',
        'minecraft:iron_bars[east=false,north=false,south:true,west=false]',
        'minecraft:iron_bars[east=false,north=false,south:true,west=true]',
        'minecraft:iron_bars[east=false,north=true,south:false,west=false]',
        'minecraft:iron_bars[east=false,north=true,south:false,west=true]',
        'minecraft:iron_bars[east=false,north=true,south:true,west=false]',
        'minecraft:iron_bars[east=false,north=true,south:true,west=true]',
        'minecraft:iron_bars[east=true,north=false,south:false,west=false]',
        'minecraft:iron_bars[east=true,north=false,south:false,west=true]',
        'minecraft:iron_bars[east=true,north=false,south:true,west=false]',
        'minecraft:iron_bars[east=true,north=false,south:true,west=true]',
        'minecraft:iron_bars[east=true,north=true,south:false,west=false]',
        'minecraft:iron_bars[east=true,north=true,south:false,west=true]',
        'minecraft:iron_bars[east=true,north=true,south:true,west=false]',
        'minecraft:iron_bars[east=true,north=true,south:true,west=true]'
    ],
    [
        'minecraft:glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:glass_pane[east=false,north=false,south:false,west=true]',
        'minecraft:glass_pane[east=false,north=false,south:true,west=false]',
        'minecraft:glass_pane[east=false,north=false,south:true,west=true]',
        'minecraft:glass_pane[east=false,north=true,south:false,west=false]',
        'minecraft:glass_pane[east=false,north=true,south:false,west=true]',
        'minecraft:glass_pane[east=false,north=true,south:true,west=false]',
        'minecraft:glass_pane[east=false,north=true,south:true,west=true]',
        'minecraft:glass_pane[east=true,north=false,south:false,west=false]',
        'minecraft:glass_pane[east=true,north=false,south:false,west=true]',
        'minecraft:glass_pane[east=true,north=false,south:true,west=false]',
        'minecraft:glass_pane[east=true,north=false,south:true,west=true]',
        'minecraft:glass_pane[east=true,north=true,south:false,west=false]',
        'minecraft:glass_pane[east=true,north=true,south:false,west=true]',
        'minecraft:glass_pane[east=true,north=true,south:true,west=false]',
        'minecraft:glass_pane[east=true,north=true,south:true,west=true]'
    ],
    ['minecraft:melon_block', 'minecraft:melon_block'],
    [
        'minecraft:pumpkin_stem[age=0]',
        'minecraft:pumpkin_stem[age=0,facing=east]',
        'minecraft:pumpkin_stem[age=0,facing=north]',
        'minecraft:pumpkin_stem[age=0,facing=south]',
        'minecraft:pumpkin_stem[age=0,facing=up]',
        'minecraft:pumpkin_stem[age=0,facing=west]'
    ],
    [
        'minecraft:pumpkin_stem[age=1]',
        'minecraft:pumpkin_stem[age=1,facing=east]',
        'minecraft:pumpkin_stem[age=1,facing=north]',
        'minecraft:pumpkin_stem[age=1,facing=south]',
        'minecraft:pumpkin_stem[age=1,facing=up]',
        'minecraft:pumpkin_stem[age=1,facing=west]'
    ],
    [
        'minecraft:pumpkin_stem[age=2]',
        'minecraft:pumpkin_stem[age=2,facing=east]',
        'minecraft:pumpkin_stem[age=2,facing=north]',
        'minecraft:pumpkin_stem[age=2,facing=south]',
        'minecraft:pumpkin_stem[age=2,facing=up]',
        'minecraft:pumpkin_stem[age=2,facing=west]'
    ],
    [
        'minecraft:pumpkin_stem[age=3]',
        'minecraft:pumpkin_stem[age=3,facing=east]',
        'minecraft:pumpkin_stem[age=3,facing=north]',
        'minecraft:pumpkin_stem[age=3,facing=south]',
        'minecraft:pumpkin_stem[age=3,facing=up]',
        'minecraft:pumpkin_stem[age=3,facing=west]'
    ],
    [
        'minecraft:pumpkin_stem[age=4]',
        'minecraft:pumpkin_stem[age=4,facing=east]',
        'minecraft:pumpkin_stem[age=4,facing=north]',
        'minecraft:pumpkin_stem[age=4,facing=south]',
        'minecraft:pumpkin_stem[age=4,facing=up]',
        'minecraft:pumpkin_stem[age=4,facing=west]'
    ],
    [
        'minecraft:pumpkin_stem[age=5]',
        'minecraft:pumpkin_stem[age=5,facing=east]',
        'minecraft:pumpkin_stem[age=5,facing=north]',
        'minecraft:pumpkin_stem[age=5,facing=south]',
        'minecraft:pumpkin_stem[age=5,facing=up]',
        'minecraft:pumpkin_stem[age=5,facing=west]'
    ],
    [
        'minecraft:pumpkin_stem[age=6]',
        'minecraft:pumpkin_stem[age=6,facing=east]',
        'minecraft:pumpkin_stem[age=6,facing=north]',
        'minecraft:pumpkin_stem[age=6,facing=south]',
        'minecraft:pumpkin_stem[age=6,facing=up]',
        'minecraft:pumpkin_stem[age=6,facing=west]'
    ],
    [
        'minecraft:pumpkin_stem[age=7]',
        'minecraft:pumpkin_stem[age=7,facing=east]',
        'minecraft:pumpkin_stem[age=7,facing=north]',
        'minecraft:pumpkin_stem[age=7,facing=south]',
        'minecraft:pumpkin_stem[age=7,facing=up]',
        'minecraft:pumpkin_stem[age=7,facing=west]'
    ],
    [
        'minecraft:melon_stem[age=0]',
        'minecraft:melon_stem[age=0,facing=east]',
        'minecraft:melon_stem[age=0,facing=north]',
        'minecraft:melon_stem[age=0,facing=south]',
        'minecraft:melon_stem[age=0,facing=up]',
        'minecraft:melon_stem[age=0,facing=west]'
    ],
    [
        'minecraft:melon_stem[age=1]',
        'minecraft:melon_stem[age=1,facing=east]',
        'minecraft:melon_stem[age=1,facing=north]',
        'minecraft:melon_stem[age=1,facing=south]',
        'minecraft:melon_stem[age=1,facing=up]',
        'minecraft:melon_stem[age=1,facing=west]'
    ],
    [
        'minecraft:melon_stem[age=2]',
        'minecraft:melon_stem[age=2,facing=east]',
        'minecraft:melon_stem[age=2,facing=north]',
        'minecraft:melon_stem[age=2,facing=south]',
        'minecraft:melon_stem[age=2,facing=up]',
        'minecraft:melon_stem[age=2,facing=west]'
    ],
    [
        'minecraft:melon_stem[age=3]',
        'minecraft:melon_stem[age=3,facing=east]',
        'minecraft:melon_stem[age=3,facing=north]',
        'minecraft:melon_stem[age=3,facing=south]',
        'minecraft:melon_stem[age=3,facing=up]',
        'minecraft:melon_stem[age=3,facing=west]'
    ],
    [
        'minecraft:melon_stem[age=4]',
        'minecraft:melon_stem[age=4,facing=east]',
        'minecraft:melon_stem[age=4,facing=north]',
        'minecraft:melon_stem[age=4,facing=south]',
        'minecraft:melon_stem[age=4,facing=up]',
        'minecraft:melon_stem[age=4,facing=west]'
    ],
    [
        'minecraft:melon_stem[age=5]',
        'minecraft:melon_stem[age=5,facing=east]',
        'minecraft:melon_stem[age=5,facing=north]',
        'minecraft:melon_stem[age=5,facing=south]',
        'minecraft:melon_stem[age=5,facing=up]',
        'minecraft:melon_stem[age=5,facing=west]'
    ],
    [
        'minecraft:melon_stem[age=6]',
        'minecraft:melon_stem[age=6,facing=east]',
        'minecraft:melon_stem[age=6,facing=north]',
        'minecraft:melon_stem[age=6,facing=south]',
        'minecraft:melon_stem[age=6,facing=up]',
        'minecraft:melon_stem[age=6,facing=west]'
    ],
    [
        'minecraft:melon_stem[age=7]',
        'minecraft:melon_stem[age=7,facing=east]',
        'minecraft:melon_stem[age=7,facing=north]',
        'minecraft:melon_stem[age=7,facing=south]',
        'minecraft:melon_stem[age=7,facing=up]',
        'minecraft:melon_stem[age=7,facing=west]'
    ],
    [
        'minecraft:vine[east=false,north=false,south:false,up=true,west=false]',
        'minecraft:vine[east=false,north=false,south:false,up=false,west=false]',
        'minecraft:vine[east=false,north=false,south:false,up=true,west=false]'
    ],
    [
        'minecraft:vine[east=false,north=false,south:true,up=true,west=false]',
        'minecraft:vine[east=false,north=false,south:true,up=false,west=false]',
        'minecraft:vine[east=false,north=false,south:true,up=true,west=false]'
    ],
    [
        'minecraft:vine[east=false,north=false,south:false,up=true,west=true]',
        'minecraft:vine[east=false,north=false,south:false,up=false,west=true]',
        'minecraft:vine[east=false,north=false,south:false,up=true,west=true]'
    ],
    [
        'minecraft:vine[east=false,north=false,south:true,up=true,west=true]',
        'minecraft:vine[east=false,north=false,south:true,up=false,west=true]',
        'minecraft:vine[east=false,north=false,south:true,up=true,west=true]'
    ],
    [
        'minecraft:vine[east=false,north=true,south:false,up=true,west=false]',
        'minecraft:vine[east=false,north=true,south:false,up=false,west=false]',
        'minecraft:vine[east=false,north=true,south:false,up=true,west=false]'
    ],
    [
        'minecraft:vine[east=false,north=true,south:true,up=true,west=false]',
        'minecraft:vine[east=false,north=true,south:true,up=false,west=false]',
        'minecraft:vine[east=false,north=true,south:true,up=true,west=false]'
    ],
    [
        'minecraft:vine[east=false,north=true,south:false,up=true,west=true]',
        'minecraft:vine[east=false,north=true,south:false,up=false,west=true]',
        'minecraft:vine[east=false,north=true,south:false,up=true,west=true]'
    ],
    [
        'minecraft:vine[east=false,north=true,south:true,up=true,west=true]',
        'minecraft:vine[east=false,north=true,south:true,up=false,west=true]',
        'minecraft:vine[east=false,north=true,south:true,up=true,west=true]'
    ],
    [
        'minecraft:vine[east=true,north=false,south:false,up=true,west=false]',
        'minecraft:vine[east=true,north=false,south:false,up=false,west=false]',
        'minecraft:vine[east=true,north=false,south:false,up=true,west=false]'
    ],
    [
        'minecraft:vine[east=true,north=false,south:true,up=true,west=false]',
        'minecraft:vine[east=true,north=false,south:true,up=false,west=false]',
        'minecraft:vine[east=true,north=false,south:true,up=true,west=false]'
    ],
    [
        'minecraft:vine[east=true,north=false,south:false,up=true,west=true]',
        'minecraft:vine[east=true,north=false,south:false,up=false,west=true]',
        'minecraft:vine[east=true,north=false,south:false,up=true,west=true]'
    ],
    [
        'minecraft:vine[east=true,north=false,south:true,up=true,west=true]',
        'minecraft:vine[east=true,north=false,south:true,up=false,west=true]',
        'minecraft:vine[east=true,north=false,south:true,up=true,west=true]'
    ],
    [
        'minecraft:vine[east=true,north=true,south:false,up=true,west=false]',
        'minecraft:vine[east=true,north=true,south:false,up=false,west=false]',
        'minecraft:vine[east=true,north=true,south:false,up=true,west=false]'
    ],
    [
        'minecraft:vine[east=true,north=true,south:true,up=true,west=false]',
        'minecraft:vine[east=true,north=true,south:true,up=false,west=false]',
        'minecraft:vine[east=true,north=true,south:true,up=true,west=false]'
    ],
    [
        'minecraft:vine[east=true,north=true,south:false,up=true,west=true]',
        'minecraft:vine[east=true,north=true,south:false,up=false,west=true]',
        'minecraft:vine[east=true,north=true,south:false,up=true,west=true]'
    ],
    [
        'minecraft:vine[east=true,north=true,south:true,up=true,west=true]',
        'minecraft:vine[east=true,north=true,south:true,up=false,west=true]',
        'minecraft:vine[east=true,north=true,south:true,up=true,west=true]'
    ],
    [
        'minecraft:oak_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
        'minecraft:fence_gate[facing=south,in_wall=false,open:false,powered=false]',
        'minecraft:fence_gate[facing=south,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:oak_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
        'minecraft:fence_gate[facing=west,in_wall=false,open:false,powered=false]',
        'minecraft:fence_gate[facing=west,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:oak_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
        'minecraft:fence_gate[facing=north,in_wall=false,open:false,powered=false]',
        'minecraft:fence_gate[facing=north,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:oak_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
        'minecraft:fence_gate[facing=east,in_wall=false,open:false,powered=false]',
        'minecraft:fence_gate[facing=east,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:oak_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
        'minecraft:fence_gate[facing=south,in_wall=false,open:true,powered=false]',
        'minecraft:fence_gate[facing=south,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:oak_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
        'minecraft:fence_gate[facing=west,in_wall=false,open:true,powered=false]',
        'minecraft:fence_gate[facing=west,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:oak_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
        'minecraft:fence_gate[facing=north,in_wall=false,open:true,powered=false]',
        'minecraft:fence_gate[facing=north,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:oak_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
        'minecraft:fence_gate[facing=east,in_wall=false,open:true,powered=false]',
        'minecraft:fence_gate[facing=east,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:oak_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
        'minecraft:fence_gate[facing=south,in_wall=false,open:false,powered=true]',
        'minecraft:fence_gate[facing=south,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:oak_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
        'minecraft:fence_gate[facing=west,in_wall=false,open:false,powered=true]',
        'minecraft:fence_gate[facing=west,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:oak_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
        'minecraft:fence_gate[facing=north,in_wall=false,open:false,powered=true]',
        'minecraft:fence_gate[facing=north,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:oak_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
        'minecraft:fence_gate[facing=east,in_wall=false,open:false,powered=true]',
        'minecraft:fence_gate[facing=east,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:oak_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
        'minecraft:fence_gate[facing=south,in_wall=false,open:true,powered=true]',
        'minecraft:fence_gate[facing=south,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:oak_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
        'minecraft:fence_gate[facing=west,in_wall=false,open:true,powered=true]',
        'minecraft:fence_gate[facing=west,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:oak_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
        'minecraft:fence_gate[facing=north,in_wall=false,open:true,powered=true]',
        'minecraft:fence_gate[facing=north,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:oak_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
        'minecraft:fence_gate[facing=east,in_wall=false,open:true,powered=true]',
        'minecraft:fence_gate[facing=east,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:brick_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:brick_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:brick_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:brick_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:brick_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:brick_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:brick_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:brick_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:brick_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:brick_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:brick_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:brick_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:brick_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:brick_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:brick_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:brick_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:brick_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:brick_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:brick_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:brick_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:brick_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:brick_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:brick_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:brick_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:brick_stairs[facing=east,half=top,shape=straight]',
        'minecraft:brick_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:brick_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:brick_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:brick_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:brick_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:brick_stairs[facing=west,half=top,shape=straight]',
        'minecraft:brick_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:brick_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:brick_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:brick_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:brick_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:brick_stairs[facing=south,half=top,shape=straight]',
        'minecraft:brick_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:brick_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:brick_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:brick_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:brick_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:brick_stairs[facing=north,half=top,shape=straight]',
        'minecraft:brick_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:brick_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:brick_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:brick_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:brick_stairs[facing=north,half=top,shape=straight]'
    ],
    [
        'minecraft:stone_brick_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:stone_brick_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:stone_brick_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:stone_brick_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:stone_brick_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:stone_brick_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:stone_brick_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:stone_brick_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:stone_brick_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:stone_brick_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:stone_brick_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:stone_brick_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:stone_brick_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:stone_brick_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:stone_brick_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:stone_brick_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:stone_brick_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:stone_brick_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:stone_brick_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:stone_brick_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:stone_brick_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:stone_brick_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:stone_brick_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:stone_brick_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:stone_brick_stairs[facing=east,half=top,shape=straight]',
        'minecraft:stone_brick_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:stone_brick_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:stone_brick_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:stone_brick_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:stone_brick_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:stone_brick_stairs[facing=west,half=top,shape=straight]',
        'minecraft:stone_brick_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:stone_brick_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:stone_brick_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:stone_brick_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:stone_brick_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:stone_brick_stairs[facing=south,half=top,shape=straight]',
        'minecraft:stone_brick_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:stone_brick_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:stone_brick_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:stone_brick_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:stone_brick_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:stone_brick_stairs[facing=north,half=top,shape=straight]',
        'minecraft:stone_brick_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:stone_brick_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:stone_brick_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:stone_brick_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:stone_brick_stairs[facing=north,half=top,shape=straight]'
    ],
    ['minecraft:mycelium[snowy=false]', 'minecraft:mycelium[snowy=false]', 'minecraft:mycelium[snowy=true]'],
    ['minecraft:lily_pad', 'minecraft:waterlily'],
    ['minecraft:nether_bricks', 'minecraft:nether_brick'],
    [
        'minecraft:nether_brick_fence[east=false,north=false,south:false,west=false]',
        'minecraft:nether_brick_fence[east=false,north=false,south:false,west=false]',
        'minecraft:nether_brick_fence[east=false,north=false,south:false,west=true]',
        'minecraft:nether_brick_fence[east=false,north=false,south:true,west=false]',
        'minecraft:nether_brick_fence[east=false,north=false,south:true,west=true]',
        'minecraft:nether_brick_fence[east=false,north=true,south:false,west=false]',
        'minecraft:nether_brick_fence[east=false,north=true,south:false,west=true]',
        'minecraft:nether_brick_fence[east=false,north=true,south:true,west=false]',
        'minecraft:nether_brick_fence[east=false,north=true,south:true,west=true]',
        'minecraft:nether_brick_fence[east=true,north=false,south:false,west=false]',
        'minecraft:nether_brick_fence[east=true,north=false,south:false,west=true]',
        'minecraft:nether_brick_fence[east=true,north=false,south:true,west=false]',
        'minecraft:nether_brick_fence[east=true,north=false,south:true,west=true]',
        'minecraft:nether_brick_fence[east=true,north=true,south:false,west=false]',
        'minecraft:nether_brick_fence[east=true,north=true,south:false,west=true]',
        'minecraft:nether_brick_fence[east=true,north=true,south:true,west=false]',
        'minecraft:nether_brick_fence[east=true,north=true,south:true,west=true]'
    ],
    [
        'minecraft:nether_brick_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:nether_brick_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:nether_brick_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:nether_brick_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:nether_brick_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:nether_brick_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:nether_brick_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:nether_brick_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:nether_brick_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:nether_brick_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:nether_brick_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:nether_brick_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:nether_brick_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:nether_brick_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:nether_brick_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:nether_brick_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:nether_brick_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:nether_brick_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:nether_brick_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:nether_brick_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:nether_brick_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:nether_brick_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:nether_brick_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:nether_brick_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:nether_brick_stairs[facing=east,half=top,shape=straight]',
        'minecraft:nether_brick_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:nether_brick_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:nether_brick_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:nether_brick_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:nether_brick_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:nether_brick_stairs[facing=west,half=top,shape=straight]',
        'minecraft:nether_brick_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:nether_brick_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:nether_brick_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:nether_brick_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:nether_brick_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:nether_brick_stairs[facing=south,half=top,shape=straight]',
        'minecraft:nether_brick_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:nether_brick_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:nether_brick_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:nether_brick_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:nether_brick_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:nether_brick_stairs[facing=north,half=top,shape=straight]',
        'minecraft:nether_brick_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:nether_brick_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:nether_brick_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:nether_brick_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:nether_brick_stairs[facing=north,half=top,shape=straight]'
    ],
    ['minecraft:nether_wart[age=0]', 'minecraft:nether_wart[age=0]'],
    ['minecraft:nether_wart[age=1]', 'minecraft:nether_wart[age=1]'],
    ['minecraft:nether_wart[age=2]', 'minecraft:nether_wart[age=2]'],
    ['minecraft:nether_wart[age=3]', 'minecraft:nether_wart[age=3]'],
    ['minecraft:enchanting_table', 'minecraft:enchanting_table'],
    [
        'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=false,has_bottle_2=false]',
        'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=false,has_bottle_2=false]'
    ],
    [
        'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=false,has_bottle_2=false]',
        'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=false,has_bottle_2=false]'
    ],
    [
        'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=true,has_bottle_2=false]',
        'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=true,has_bottle_2=false]'
    ],
    [
        'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=true,has_bottle_2=false]',
        'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=true,has_bottle_2=false]'
    ],
    [
        'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=false,has_bottle_2=true]',
        'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=false,has_bottle_2=true]'
    ],
    [
        'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=false,has_bottle_2=true]',
        'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=false,has_bottle_2=true]'
    ],
    [
        'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=true,has_bottle_2=true]',
        'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=true,has_bottle_2=true]'
    ],
    [
        'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=true,has_bottle_2=true]',
        'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=true,has_bottle_2=true]'
    ],
    ['minecraft:cauldron[level=0]', 'minecraft:cauldron[level=0]'],
    ['minecraft:cauldron[level=1]', 'minecraft:cauldron[level=1]'],
    ['minecraft:cauldron[level=2]', 'minecraft:cauldron[level=2]'],
    ['minecraft:cauldron[level=3]', 'minecraft:cauldron[level=3]'],
    ['minecraft:end_portal', 'minecraft:end_portal'],
    ['minecraft:end_portal_frame[eye=false,facing=south]', 'minecraft:end_portal_frame[eye=false,facing=south]'],
    ['minecraft:end_portal_frame[eye=false,facing=west]', 'minecraft:end_portal_frame[eye=false,facing=west]'],
    ['minecraft:end_portal_frame[eye=false,facing=north]', 'minecraft:end_portal_frame[eye=false,facing=north]'],
    ['minecraft:end_portal_frame[eye=false,facing=east]', 'minecraft:end_portal_frame[eye=false,facing=east]'],
    ['minecraft:end_portal_frame[eye=true,facing=south]', 'minecraft:end_portal_frame[eye=true,facing=south]'],
    ['minecraft:end_portal_frame[eye=true,facing=west]', 'minecraft:end_portal_frame[eye=true,facing=west]'],
    ['minecraft:end_portal_frame[eye=true,facing=north]', 'minecraft:end_portal_frame[eye=true,facing=north]'],
    ['minecraft:end_portal_frame[eye=true,facing=east]', 'minecraft:end_portal_frame[eye=true,facing=east]'],
    ['minecraft:end_stone', 'minecraft:end_stone'],
    ['minecraft:dragon_egg', 'minecraft:dragon_egg'],
    ['minecraft:redstone_lamp[lit=false]', 'minecraft:redstone_lamp'],
    ['minecraft:redstone_lamp[lit=true]', 'minecraft:lit_redstone_lamp'],
    ['minecraft:oak_slab[type=double]', 'minecraft:double_wooden_slab[variant=oak]'],
    ['minecraft:spruce_slab[type=double]', 'minecraft:double_wooden_slab[variant=spruce]'],
    ['minecraft:birch_slab[type=double]', 'minecraft:double_wooden_slab[variant=birch]'],
    ['minecraft:jungle_slab[type=double]', 'minecraft:double_wooden_slab[variant=jungle]'],
    ['minecraft:acacia_slab[type=double]', 'minecraft:double_wooden_slab[variant=acacia]'],
    ['minecraft:dark_oak_slab[type=double]', 'minecraft:double_wooden_slab[variant=dark_oak]'],
    ['minecraft:oak_slab[type=bottom]', 'minecraft:wooden_slab[half=bottom,variant=oak]'],
    ['minecraft:spruce_slab[type=bottom]', 'minecraft:wooden_slab[half=bottom,variant=spruce]'],
    ['minecraft:birch_slab[type=bottom]', 'minecraft:wooden_slab[half=bottom,variant=birch]'],
    ['minecraft:jungle_slab[type=bottom]', 'minecraft:wooden_slab[half=bottom,variant=jungle]'],
    ['minecraft:acacia_slab[type=bottom]', 'minecraft:wooden_slab[half=bottom,variant=acacia]'],
    ['minecraft:dark_oak_slab[type=bottom]', 'minecraft:wooden_slab[half=bottom,variant=dark_oak]'],
    ['minecraft:oak_slab[type=top]', 'minecraft:wooden_slab[half=top,variant=oak]'],
    ['minecraft:spruce_slab[type=top]', 'minecraft:wooden_slab[half=top,variant=spruce]'],
    ['minecraft:birch_slab[type=top]', 'minecraft:wooden_slab[half=top,variant=birch]'],
    ['minecraft:jungle_slab[type=top]', 'minecraft:wooden_slab[half=top,variant=jungle]'],
    ['minecraft:acacia_slab[type=top]', 'minecraft:wooden_slab[half=top,variant=acacia]'],
    ['minecraft:dark_oak_slab[type=top]', 'minecraft:wooden_slab[half=top,variant=dark_oak]'],
    ['minecraft:cocoa[age=0,facing=south]', 'minecraft:cocoa[age=0,facing=south]'],
    ['minecraft:cocoa[age=0,facing=west]', 'minecraft:cocoa[age=0,facing=west]'],
    ['minecraft:cocoa[age=0,facing=north]', 'minecraft:cocoa[age=0,facing=north]'],
    ['minecraft:cocoa[age=0,facing=east]', 'minecraft:cocoa[age=0,facing=east]'],
    ['minecraft:cocoa[age=1,facing=south]', 'minecraft:cocoa[age=1,facing=south]'],
    ['minecraft:cocoa[age=1,facing=west]', 'minecraft:cocoa[age=1,facing=west]'],
    ['minecraft:cocoa[age=1,facing=north]', 'minecraft:cocoa[age=1,facing=north]'],
    ['minecraft:cocoa[age=1,facing=east]', 'minecraft:cocoa[age=1,facing=east]'],
    ['minecraft:cocoa[age=2,facing=south]', 'minecraft:cocoa[age=2,facing=south]'],
    ['minecraft:cocoa[age=2,facing=west]', 'minecraft:cocoa[age=2,facing=west]'],
    ['minecraft:cocoa[age=2,facing=north]', 'minecraft:cocoa[age=2,facing=north]'],
    ['minecraft:cocoa[age=2,facing=east]', 'minecraft:cocoa[age=2,facing=east]'],
    [
        'minecraft:sandstone_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:sandstone_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:sandstone_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:sandstone_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:sandstone_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:sandstone_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:sandstone_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:sandstone_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:sandstone_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:sandstone_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:sandstone_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:sandstone_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:sandstone_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:sandstone_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:sandstone_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:sandstone_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:sandstone_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:sandstone_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:sandstone_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:sandstone_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:sandstone_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:sandstone_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:sandstone_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:sandstone_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:sandstone_stairs[facing=east,half=top,shape=straight]',
        'minecraft:sandstone_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:sandstone_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:sandstone_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:sandstone_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:sandstone_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:sandstone_stairs[facing=west,half=top,shape=straight]',
        'minecraft:sandstone_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:sandstone_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:sandstone_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:sandstone_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:sandstone_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:sandstone_stairs[facing=south,half=top,shape=straight]',
        'minecraft:sandstone_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:sandstone_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:sandstone_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:sandstone_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:sandstone_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:sandstone_stairs[facing=north,half=top,shape=straight]',
        'minecraft:sandstone_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:sandstone_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:sandstone_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:sandstone_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:sandstone_stairs[facing=north,half=top,shape=straight]'
    ],
    ['minecraft:emerald_ore', 'minecraft:emerald_ore'],
    ['minecraft:ender_chest[facing=north]', 'minecraft:ender_chest[facing=north]'],
    ['minecraft:ender_chest[facing=south]', 'minecraft:ender_chest[facing=south]'],
    ['minecraft:ender_chest[facing=west]', 'minecraft:ender_chest[facing=west]'],
    ['minecraft:ender_chest[facing=east]', 'minecraft:ender_chest[facing=east]'],
    [
        'minecraft:tripwire_hook[attached=false,facing=south,powered=false]',
        'minecraft:tripwire_hook[attached=false,facing=south,powered=false]'
    ],
    [
        'minecraft:tripwire_hook[attached=false,facing=west,powered=false]',
        'minecraft:tripwire_hook[attached=false,facing=west,powered=false]'
    ],
    [
        'minecraft:tripwire_hook[attached=false,facing=north,powered=false]',
        'minecraft:tripwire_hook[attached=false,facing=north,powered=false]'
    ],
    [
        'minecraft:tripwire_hook[attached=false,facing=east,powered=false]',
        'minecraft:tripwire_hook[attached=false,facing=east,powered=false]'
    ],
    [
        'minecraft:tripwire_hook[attached=true,facing=south,powered=false]',
        'minecraft:tripwire_hook[attached=true,facing=south,powered=false]'
    ],
    [
        'minecraft:tripwire_hook[attached=true,facing=west,powered=false]',
        'minecraft:tripwire_hook[attached=true,facing=west,powered=false]'
    ],
    [
        'minecraft:tripwire_hook[attached=true,facing=north,powered=false]',
        'minecraft:tripwire_hook[attached=true,facing=north,powered=false]'
    ],
    [
        'minecraft:tripwire_hook[attached=true,facing=east,powered=false]',
        'minecraft:tripwire_hook[attached=true,facing=east,powered=false]'
    ],
    [
        'minecraft:tripwire_hook[attached=false,facing=south,powered=true]',
        'minecraft:tripwire_hook[attached=false,facing=south,powered=true]'
    ],
    [
        'minecraft:tripwire_hook[attached=false,facing=west,powered=true]',
        'minecraft:tripwire_hook[attached=false,facing=west,powered=true]'
    ],
    [
        'minecraft:tripwire_hook[attached=false,facing=north,powered=true]',
        'minecraft:tripwire_hook[attached=false,facing=north,powered=true]'
    ],
    [
        'minecraft:tripwire_hook[attached=false,facing=east,powered=true]',
        'minecraft:tripwire_hook[attached=false,facing=east,powered=true]'
    ],
    [
        'minecraft:tripwire_hook[attached=true,facing=south,powered=true]',
        'minecraft:tripwire_hook[attached=true,facing=south,powered=true]'
    ],
    [
        'minecraft:tripwire_hook[attached=true,facing=west,powered=true]',
        'minecraft:tripwire_hook[attached=true,facing=west,powered=true]'
    ],
    [
        'minecraft:tripwire_hook[attached=true,facing=north,powered=true]',
        'minecraft:tripwire_hook[attached=true,facing=north,powered=true]'
    ],
    [
        'minecraft:tripwire_hook[attached=true,facing=east,powered=true]',
        'minecraft:tripwire_hook[attached=true,facing=east,powered=true]'
    ],
    [
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:false,south=true,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:false,south=true,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:false,south=true,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:false,south=true,west=true]'
    ],
    [
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:true,south=true,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:true,south=true,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:true,south=true,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:true,south=true,west=true]'
    ],
    [
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:false,south=false,west=false]',
        ''
    ],
    [
        'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:true,south=false,west=false]',
        ''
    ],
    [
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:false,south=true,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:false,south=true,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:false,south=true,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:false,south=true,west=true]'
    ],
    [
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:true,south=true,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:true,south=true,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:true,south=true,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:true,south=true,west=true]'
    ],
    [
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:false,south=false,west=false]',
        ''
    ],
    [
        'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:true,south=false,west=false]',
        ''
    ],
    [
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:false,south=true,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:false,south=true,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:false,south=true,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:false,south=true,west=true]'
    ],
    [
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:true,south=true,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:true,south=true,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:true,south=true,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:true,south=true,west=true]'
    ],
    [
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:false,south=false,west=false]',
        ''
    ],
    [
        'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:true,south=false,west=false]',
        ''
    ],
    [
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:false,south=true,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:false,south=true,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:false,south=true,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:false,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:false,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:false,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:false,south=true,west=true]'
    ],
    [
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:true,south=true,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:true,south=true,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:true,south=true,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:true,south=false,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:true,south=false,west=true]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:true,south=true,west=false]',
        'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:true,south=true,west=true]'
    ],
    [
        'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:false,south=false,west=false]',
        ''
    ],
    ['minecraft:emerald_block', 'minecraft:emerald_block'],
    [
        'minecraft:spruce_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:spruce_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:spruce_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:spruce_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:spruce_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:spruce_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:spruce_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:spruce_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:spruce_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:spruce_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:spruce_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:spruce_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:spruce_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:spruce_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:spruce_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:spruce_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:spruce_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:spruce_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:spruce_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:spruce_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:spruce_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:spruce_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:spruce_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:spruce_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:spruce_stairs[facing=east,half=top,shape=straight]',
        'minecraft:spruce_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:spruce_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:spruce_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:spruce_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:spruce_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:spruce_stairs[facing=west,half=top,shape=straight]',
        'minecraft:spruce_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:spruce_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:spruce_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:spruce_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:spruce_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:spruce_stairs[facing=south,half=top,shape=straight]',
        'minecraft:spruce_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:spruce_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:spruce_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:spruce_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:spruce_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:spruce_stairs[facing=north,half=top,shape=straight]',
        'minecraft:spruce_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:spruce_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:spruce_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:spruce_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:spruce_stairs[facing=north,half=top,shape=straight]'
    ],
    [
        'minecraft:birch_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:birch_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:birch_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:birch_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:birch_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:birch_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:birch_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:birch_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:birch_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:birch_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:birch_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:birch_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:birch_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:birch_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:birch_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:birch_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:birch_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:birch_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:birch_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:birch_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:birch_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:birch_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:birch_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:birch_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:birch_stairs[facing=east,half=top,shape=straight]',
        'minecraft:birch_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:birch_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:birch_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:birch_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:birch_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:birch_stairs[facing=west,half=top,shape=straight]',
        'minecraft:birch_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:birch_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:birch_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:birch_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:birch_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:birch_stairs[facing=south,half=top,shape=straight]',
        'minecraft:birch_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:birch_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:birch_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:birch_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:birch_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:birch_stairs[facing=north,half=top,shape=straight]',
        'minecraft:birch_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:birch_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:birch_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:birch_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:birch_stairs[facing=north,half=top,shape=straight]'
    ],
    [
        'minecraft:jungle_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:jungle_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:jungle_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:jungle_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:jungle_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:jungle_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:jungle_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:jungle_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:jungle_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:jungle_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:jungle_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:jungle_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:jungle_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:jungle_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:jungle_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:jungle_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:jungle_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:jungle_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:jungle_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:jungle_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:jungle_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:jungle_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:jungle_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:jungle_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:jungle_stairs[facing=east,half=top,shape=straight]',
        'minecraft:jungle_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:jungle_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:jungle_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:jungle_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:jungle_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:jungle_stairs[facing=west,half=top,shape=straight]',
        'minecraft:jungle_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:jungle_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:jungle_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:jungle_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:jungle_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:jungle_stairs[facing=south,half=top,shape=straight]',
        'minecraft:jungle_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:jungle_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:jungle_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:jungle_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:jungle_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:jungle_stairs[facing=north,half=top,shape=straight]',
        'minecraft:jungle_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:jungle_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:jungle_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:jungle_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:jungle_stairs[facing=north,half=top,shape=straight]'
    ],
    [
        'minecraft:command_block[conditional=false,facing=down]',
        'minecraft:command_block[conditional=false,facing=down]'
    ],
    [
        'minecraft:command_block[conditional=false,facing=up]',
        'minecraft:command_block[conditional=false,facing=up]'
    ],
    [
        'minecraft:command_block[conditional=false,facing=north]',
        'minecraft:command_block[conditional=false,facing=north]'
    ],
    [
        'minecraft:command_block[conditional=false,facing=south]',
        'minecraft:command_block[conditional=false,facing=south]'
    ],
    [
        'minecraft:command_block[conditional=false,facing=west]',
        'minecraft:command_block[conditional=false,facing=west]'
    ],
    [
        'minecraft:command_block[conditional=false,facing=east]',
        'minecraft:command_block[conditional=false,facing=east]'
    ],
    [
        'minecraft:command_block[conditional=true,facing=down]',
        'minecraft:command_block[conditional=true,facing=down]'
    ],
    ['minecraft:command_block[conditional=true,facing=up]', 'minecraft:command_block[conditional=true,facing=up]'],
    [
        'minecraft:command_block[conditional=true,facing=north]',
        'minecraft:command_block[conditional=true,facing=north]'
    ],
    [
        'minecraft:command_block[conditional=true,facing=south]',
        'minecraft:command_block[conditional=true,facing=south]'
    ],
    [
        'minecraft:command_block[conditional=true,facing=west]',
        'minecraft:command_block[conditional=true,facing=west]'
    ],
    [
        'minecraft:command_block[conditional=true,facing=east]',
        'minecraft:command_block[conditional=true,facing=east]'
    ],
    ['minecraft:beacon', 'minecraft:beacon'],
    [
        'minecraft:cobblestone_wall[east=false,north=false,south:false,up=false,west=false]',
        'minecraft:cobblestone_wall[east=false,north=false,south:false,up=false,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=false,south:false,up=false,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=false,south:false,up=true,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=false,south:false,up=true,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=false,south:true,up=false,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=false,south:true,up=false,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=false,south:true,up=true,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=false,south:true,up=true,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=true,south:false,up=false,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=true,south:false,up=false,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=true,south:false,up=true,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=true,south:false,up=true,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=true,south:true,up=false,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=true,south:true,up=false,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=true,south:true,up=true,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=true,south:true,up=true,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=false,south:false,up=false,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=false,south:false,up=false,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=false,south:false,up=true,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=false,south:false,up=true,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=false,south:true,up=false,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=false,south:true,up=false,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=false,south:true,up=true,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=false,south:true,up=true,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=true,south:false,up=false,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=true,south:false,up=false,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=true,south:false,up=true,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=true,south:false,up=true,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=true,south:true,up=false,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=true,south:true,up=false,variant:cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=true,south:true,up=true,variant:cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=true,south:true,up=true,variant:cobblestone,west=true]'
    ],
    [
        'minecraft:mossy_cobblestone_wall[east=false,north=false,south:false,up=false,west=false]',
        'minecraft:cobblestone_wall[east=false,north=false,south:false,up=false,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=false,south:false,up=false,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=false,south:false,up=true,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=false,south:false,up=true,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=false,south:true,up=false,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=false,south:true,up=false,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=false,south:true,up=true,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=false,south:true,up=true,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=true,south:false,up=false,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=true,south:false,up=false,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=true,south:false,up=true,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=true,south:false,up=true,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=true,south:true,up=false,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=true,south:true,up=false,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=false,north=true,south:true,up=true,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=false,north=true,south:true,up=true,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=false,south:false,up=false,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=false,south:false,up=false,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=false,south:false,up=true,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=false,south:false,up=true,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=false,south:true,up=false,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=false,south:true,up=false,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=false,south:true,up=true,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=false,south:true,up=true,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=true,south:false,up=false,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=true,south:false,up=false,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=true,south:false,up=true,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=true,south:false,up=true,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=true,south:true,up=false,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=true,south:true,up=false,variant:mossy_cobblestone,west=true]',
        'minecraft:cobblestone_wall[east=true,north=true,south:true,up=true,variant:mossy_cobblestone,west=false]',
        'minecraft:cobblestone_wall[east=true,north=true,south:true,up=true,variant:mossy_cobblestone,west=true]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=0]',
        'minecraft:flower_pot[contents=allium,legacy_data=0]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=0]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=0]',
        'minecraft:flower_pot[contents=cactus,legacy_data=0]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=0]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=0]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=0]',
        'minecraft:flower_pot[contents=empty,legacy_data=0]',
        'minecraft:flower_pot[contents=fern,legacy_data=0]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=0]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=0]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=0]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=0]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=0]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=0]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=0]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=0]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=0]',
        'minecraft:flower_pot[contents=rose,legacy_data=0]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=0]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=0]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=1]',
        'minecraft:flower_pot[contents=allium,legacy_data=1]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=1]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=1]',
        'minecraft:flower_pot[contents=cactus,legacy_data=1]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=1]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=1]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=1]',
        'minecraft:flower_pot[contents=empty,legacy_data=1]',
        'minecraft:flower_pot[contents=fern,legacy_data=1]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=1]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=1]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=1]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=1]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=1]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=1]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=1]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=1]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=1]',
        'minecraft:flower_pot[contents=rose,legacy_data=1]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=1]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=1]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=2]',
        'minecraft:flower_pot[contents=allium,legacy_data=2]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=2]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=2]',
        'minecraft:flower_pot[contents=cactus,legacy_data=2]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=2]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=2]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=2]',
        'minecraft:flower_pot[contents=empty,legacy_data=2]',
        'minecraft:flower_pot[contents=fern,legacy_data=2]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=2]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=2]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=2]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=2]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=2]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=2]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=2]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=2]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=2]',
        'minecraft:flower_pot[contents=rose,legacy_data=2]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=2]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=2]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=3]',
        'minecraft:flower_pot[contents=allium,legacy_data=3]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=3]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=3]',
        'minecraft:flower_pot[contents=cactus,legacy_data=3]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=3]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=3]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=3]',
        'minecraft:flower_pot[contents=empty,legacy_data=3]',
        'minecraft:flower_pot[contents=fern,legacy_data=3]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=3]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=3]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=3]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=3]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=3]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=3]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=3]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=3]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=3]',
        'minecraft:flower_pot[contents=rose,legacy_data=3]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=3]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=3]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=4]',
        'minecraft:flower_pot[contents=allium,legacy_data=4]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=4]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=4]',
        'minecraft:flower_pot[contents=cactus,legacy_data=4]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=4]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=4]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=4]',
        'minecraft:flower_pot[contents=empty,legacy_data=4]',
        'minecraft:flower_pot[contents=fern,legacy_data=4]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=4]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=4]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=4]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=4]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=4]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=4]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=4]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=4]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=4]',
        'minecraft:flower_pot[contents=rose,legacy_data=4]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=4]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=4]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=5]',
        'minecraft:flower_pot[contents=allium,legacy_data=5]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=5]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=5]',
        'minecraft:flower_pot[contents=cactus,legacy_data=5]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=5]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=5]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=5]',
        'minecraft:flower_pot[contents=empty,legacy_data=5]',
        'minecraft:flower_pot[contents=fern,legacy_data=5]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=5]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=5]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=5]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=5]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=5]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=5]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=5]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=5]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=5]',
        'minecraft:flower_pot[contents=rose,legacy_data=5]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=5]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=5]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=6]',
        'minecraft:flower_pot[contents=allium,legacy_data=6]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=6]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=6]',
        'minecraft:flower_pot[contents=cactus,legacy_data=6]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=6]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=6]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=6]',
        'minecraft:flower_pot[contents=empty,legacy_data=6]',
        'minecraft:flower_pot[contents=fern,legacy_data=6]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=6]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=6]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=6]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=6]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=6]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=6]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=6]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=6]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=6]',
        'minecraft:flower_pot[contents=rose,legacy_data=6]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=6]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=6]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=7]',
        'minecraft:flower_pot[contents=allium,legacy_data=7]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=7]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=7]',
        'minecraft:flower_pot[contents=cactus,legacy_data=7]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=7]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=7]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=7]',
        'minecraft:flower_pot[contents=empty,legacy_data=7]',
        'minecraft:flower_pot[contents=fern,legacy_data=7]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=7]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=7]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=7]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=7]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=7]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=7]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=7]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=7]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=7]',
        'minecraft:flower_pot[contents=rose,legacy_data=7]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=7]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=7]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=8]',
        'minecraft:flower_pot[contents=allium,legacy_data=8]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=8]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=8]',
        'minecraft:flower_pot[contents=cactus,legacy_data=8]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=8]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=8]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=8]',
        'minecraft:flower_pot[contents=empty,legacy_data=8]',
        'minecraft:flower_pot[contents=fern,legacy_data=8]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=8]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=8]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=8]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=8]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=8]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=8]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=8]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=8]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=8]',
        'minecraft:flower_pot[contents=rose,legacy_data=8]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=8]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=8]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=9]',
        'minecraft:flower_pot[contents=allium,legacy_data=9]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=9]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=9]',
        'minecraft:flower_pot[contents=cactus,legacy_data=9]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=9]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=9]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=9]',
        'minecraft:flower_pot[contents=empty,legacy_data=9]',
        'minecraft:flower_pot[contents=fern,legacy_data=9]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=9]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=9]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=9]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=9]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=9]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=9]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=9]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=9]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=9]',
        'minecraft:flower_pot[contents=rose,legacy_data=9]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=9]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=9]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=10]',
        'minecraft:flower_pot[contents=allium,legacy_data=10]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=10]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=10]',
        'minecraft:flower_pot[contents=cactus,legacy_data=10]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=10]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=10]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=10]',
        'minecraft:flower_pot[contents=empty,legacy_data=10]',
        'minecraft:flower_pot[contents=fern,legacy_data=10]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=10]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=10]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=10]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=10]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=10]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=10]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=10]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=10]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=10]',
        'minecraft:flower_pot[contents=rose,legacy_data=10]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=10]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=10]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=11]',
        'minecraft:flower_pot[contents=allium,legacy_data=11]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=11]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=11]',
        'minecraft:flower_pot[contents=cactus,legacy_data=11]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=11]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=11]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=11]',
        'minecraft:flower_pot[contents=empty,legacy_data=11]',
        'minecraft:flower_pot[contents=fern,legacy_data=11]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=11]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=11]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=11]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=11]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=11]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=11]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=11]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=11]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=11]',
        'minecraft:flower_pot[contents=rose,legacy_data=11]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=11]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=11]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=12]',
        'minecraft:flower_pot[contents=allium,legacy_data=12]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=12]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=12]',
        'minecraft:flower_pot[contents=cactus,legacy_data=12]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=12]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=12]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=12]',
        'minecraft:flower_pot[contents=empty,legacy_data=12]',
        'minecraft:flower_pot[contents=fern,legacy_data=12]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=12]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=12]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=12]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=12]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=12]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=12]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=12]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=12]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=12]',
        'minecraft:flower_pot[contents=rose,legacy_data=12]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=12]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=12]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=13]',
        'minecraft:flower_pot[contents=allium,legacy_data=13]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=13]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=13]',
        'minecraft:flower_pot[contents=cactus,legacy_data=13]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=13]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=13]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=13]',
        'minecraft:flower_pot[contents=empty,legacy_data=13]',
        'minecraft:flower_pot[contents=fern,legacy_data=13]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=13]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=13]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=13]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=13]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=13]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=13]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=13]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=13]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=13]',
        'minecraft:flower_pot[contents=rose,legacy_data=13]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=13]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=13]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=14]',
        'minecraft:flower_pot[contents=allium,legacy_data=14]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=14]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=14]',
        'minecraft:flower_pot[contents=cactus,legacy_data=14]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=14]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=14]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=14]',
        'minecraft:flower_pot[contents=empty,legacy_data=14]',
        'minecraft:flower_pot[contents=fern,legacy_data=14]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=14]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=14]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=14]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=14]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=14]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=14]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=14]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=14]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=14]',
        'minecraft:flower_pot[contents=rose,legacy_data=14]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=14]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=14]'
    ],
    [
        'minecraft:potted_cactus',
        'minecraft:flower_pot[contents=acacia_sapling,legacy_data=15]',
        'minecraft:flower_pot[contents=allium,legacy_data=15]',
        'minecraft:flower_pot[contents=birch_sapling,legacy_data=15]',
        'minecraft:flower_pot[contents=blue_orchid,legacy_data=15]',
        'minecraft:flower_pot[contents=cactus,legacy_data=15]',
        'minecraft:flower_pot[contents=dandelion,legacy_data=15]',
        'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=15]',
        'minecraft:flower_pot[contents=dead_bush,legacy_data=15]',
        'minecraft:flower_pot[contents=empty,legacy_data=15]',
        'minecraft:flower_pot[contents=fern,legacy_data=15]',
        'minecraft:flower_pot[contents=houstonia,legacy_data=15]',
        'minecraft:flower_pot[contents=jungle_sapling,legacy_data=15]',
        'minecraft:flower_pot[contents=mushroom_brown,legacy_data=15]',
        'minecraft:flower_pot[contents=mushroom_red,legacy_data=15]',
        'minecraft:flower_pot[contents=oak_sapling,legacy_data=15]',
        'minecraft:flower_pot[contents=orange_tulip,legacy_data=15]',
        'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=15]',
        'minecraft:flower_pot[contents=pink_tulip,legacy_data=15]',
        'minecraft:flower_pot[contents=red_tulip,legacy_data=15]',
        'minecraft:flower_pot[contents=rose,legacy_data=15]',
        'minecraft:flower_pot[contents=spruce_sapling,legacy_data=15]',
        'minecraft:flower_pot[contents=white_tulip,legacy_data=15]'
    ],
    ['minecraft:carrots[age=0]', 'minecraft:carrots[age=0]'],
    ['minecraft:carrots[age=1]', 'minecraft:carrots[age=1]'],
    ['minecraft:carrots[age=2]', 'minecraft:carrots[age=2]'],
    ['minecraft:carrots[age=3]', 'minecraft:carrots[age=3]'],
    ['minecraft:carrots[age=4]', 'minecraft:carrots[age=4]'],
    ['minecraft:carrots[age=5]', 'minecraft:carrots[age=5]'],
    ['minecraft:carrots[age=6]', 'minecraft:carrots[age=6]'],
    ['minecraft:carrots[age=7]', 'minecraft:carrots[age=7]'],
    ['minecraft:potatoes[age=0]', 'minecraft:potatoes[age=0]'],
    ['minecraft:potatoes[age=1]', 'minecraft:potatoes[age=1]'],
    ['minecraft:potatoes[age=2]', 'minecraft:potatoes[age=2]'],
    ['minecraft:potatoes[age=3]', 'minecraft:potatoes[age=3]'],
    ['minecraft:potatoes[age=4]', 'minecraft:potatoes[age=4]'],
    ['minecraft:potatoes[age=5]', 'minecraft:potatoes[age=5]'],
    ['minecraft:potatoes[age=6]', 'minecraft:potatoes[age=6]'],
    ['minecraft:potatoes[age=7]', 'minecraft:potatoes[age=7]'],
    [
        'minecraft:oak_button[face=ceiling,facing=north,powered=false]',
        'minecraft:wooden_button[facing=down,powered=false]'
    ],
    [
        'minecraft:oak_button[face=wall,facing=east,powered=false]',
        'minecraft:wooden_button[facing=east,powered=false]'
    ],
    [
        'minecraft:oak_button[face=wall,facing=west,powered=false]',
        'minecraft:wooden_button[facing=west,powered=false]'
    ],
    [
        'minecraft:oak_button[face=wall,facing=south,powered=false]',
        'minecraft:wooden_button[facing=south,powered=false]'
    ],
    [
        'minecraft:oak_button[face=wall,facing=north,powered=false]',
        'minecraft:wooden_button[facing=north,powered=false]'
    ],
    [
        'minecraft:oak_button[face=floor,facing=north,powered=false]',
        'minecraft:wooden_button[facing=up,powered=false]'
    ],
    [
        'minecraft:oak_button[face=ceiling,facing=north,powered=true]',
        'minecraft:wooden_button[facing=down,powered=true]'
    ],
    [
        'minecraft:oak_button[face=wall,facing=east,powered=true]',
        'minecraft:wooden_button[facing=east,powered=true]'
    ],
    [
        'minecraft:oak_button[face=wall,facing=west,powered=true]',
        'minecraft:wooden_button[facing=west,powered=true]'
    ],
    [
        'minecraft:oak_button[face=wall,facing=south,powered=true]',
        'minecraft:wooden_button[facing=south,powered=true]'
    ],
    [
        'minecraft:oak_button[face=wall,facing=north,powered=true]',
        'minecraft:wooden_button[facing=north,powered=true]'
    ],
    [
        'minecraft:oak_button[face=floor,facing=north,powered=true]',
        'minecraft:wooden_button[facing=up,powered=true]'
    ],
    ['minecraft:skeleton_skull[facing=down,nodrop=false]', 'minecraft:skull[facing=down,nodrop=false]'],
    ['minecraft:skeleton_skull[facing=up,nodrop=false]', 'minecraft:skull[facing=up,nodrop=false]'],
    ['minecraft:skeleton_skull[facing=north,nodrop=false]', 'minecraft:skull[facing=north,nodrop=false]'],
    ['minecraft:skeleton_skull[facing=south,nodrop=false]', 'minecraft:skull[facing=south,nodrop=false]'],
    ['minecraft:skeleton_skull[facing=west,nodrop=false]', 'minecraft:skull[facing=west,nodrop=false]'],
    ['minecraft:skeleton_skull[facing=east,nodrop=false]', 'minecraft:skull[facing=east,nodrop=false]'],
    ['minecraft:skeleton_skull[facing=down,nodrop=true]', 'minecraft:skull[facing=down,nodrop=true]'],
    ['minecraft:skeleton_skull[facing=up,nodrop=true]', 'minecraft:skull[facing=up,nodrop=true]'],
    ['minecraft:skeleton_skull[facing=north,nodrop=true]', 'minecraft:skull[facing=north,nodrop=true]'],
    ['minecraft:skeleton_skull[facing=south,nodrop=true]', 'minecraft:skull[facing=south,nodrop=true]'],
    ['minecraft:skeleton_skull[facing=west,nodrop=true]', 'minecraft:skull[facing=west,nodrop=true]'],
    ['minecraft:skeleton_skull[facing=east,nodrop=true]', 'minecraft:skull[facing=east,nodrop=true]'],
    ['minecraft:anvil[facing=south]', 'minecraft:anvil[damage=0,facing=south]'],
    ['minecraft:anvil[facing=west]', 'minecraft:anvil[damage=0,facing=west]'],
    ['minecraft:anvil[facing=north]', 'minecraft:anvil[damage=0,facing=north]'],
    ['minecraft:anvil[facing=east]', 'minecraft:anvil[damage=0,facing=east]'],
    ['minecraft:chipped_anvil[facing=south]', 'minecraft:anvil[damage=1,facing=south]'],
    ['minecraft:chipped_anvil[facing=west]', 'minecraft:anvil[damage=1,facing=west]'],
    ['minecraft:chipped_anvil[facing=north]', 'minecraft:anvil[damage=1,facing=north]'],
    ['minecraft:chipped_anvil[facing=east]', 'minecraft:anvil[damage=1,facing=east]'],
    ['minecraft:damaged_anvil[facing=south]', 'minecraft:anvil[damage=2,facing=south]'],
    ['minecraft:damaged_anvil[facing=west]', 'minecraft:anvil[damage=2,facing=west]'],
    ['minecraft:damaged_anvil[facing=north]', 'minecraft:anvil[damage=2,facing=north]'],
    ['minecraft:damaged_anvil[facing=east]', 'minecraft:anvil[damage=2,facing=east]'],
    ['minecraft:trapped_chest[facing=north,type=single]', 'minecraft:trapped_chest[facing=north]'],
    ['minecraft:trapped_chest[facing=south,type=single]', 'minecraft:trapped_chest[facing=south]'],
    ['minecraft:trapped_chest[facing=west,type=single]', 'minecraft:trapped_chest[facing=west]'],
    ['minecraft:trapped_chest[facing=east,type=single]', 'minecraft:trapped_chest[facing=east]'],
    ['minecraft:light_weighted_pressure_plate[power=0]', 'minecraft:light_weighted_pressure_plate[power=0]'],
    ['minecraft:light_weighted_pressure_plate[power=1]', 'minecraft:light_weighted_pressure_plate[power=1]'],
    ['minecraft:light_weighted_pressure_plate[power=2]', 'minecraft:light_weighted_pressure_plate[power=2]'],
    ['minecraft:light_weighted_pressure_plate[power=3]', 'minecraft:light_weighted_pressure_plate[power=3]'],
    ['minecraft:light_weighted_pressure_plate[power=4]', 'minecraft:light_weighted_pressure_plate[power=4]'],
    ['minecraft:light_weighted_pressure_plate[power=5]', 'minecraft:light_weighted_pressure_plate[power=5]'],
    ['minecraft:light_weighted_pressure_plate[power=6]', 'minecraft:light_weighted_pressure_plate[power=6]'],
    ['minecraft:light_weighted_pressure_plate[power=7]', 'minecraft:light_weighted_pressure_plate[power=7]'],
    ['minecraft:light_weighted_pressure_plate[power=8]', 'minecraft:light_weighted_pressure_plate[power=8]'],
    ['minecraft:light_weighted_pressure_plate[power=9]', 'minecraft:light_weighted_pressure_plate[power=9]'],
    ['minecraft:light_weighted_pressure_plate[power=10]', 'minecraft:light_weighted_pressure_plate[power=10]'],
    ['minecraft:light_weighted_pressure_plate[power=11]', 'minecraft:light_weighted_pressure_plate[power=11]'],
    ['minecraft:light_weighted_pressure_plate[power=12]', 'minecraft:light_weighted_pressure_plate[power=12]'],
    ['minecraft:light_weighted_pressure_plate[power=13]', 'minecraft:light_weighted_pressure_plate[power=13]'],
    ['minecraft:light_weighted_pressure_plate[power=14]', 'minecraft:light_weighted_pressure_plate[power=14]'],
    ['minecraft:light_weighted_pressure_plate[power=15]', 'minecraft:light_weighted_pressure_plate[power=15]'],
    ['minecraft:heavy_weighted_pressure_plate[power=0]', 'minecraft:heavy_weighted_pressure_plate[power=0]'],
    ['minecraft:heavy_weighted_pressure_plate[power=1]', 'minecraft:heavy_weighted_pressure_plate[power=1]'],
    ['minecraft:heavy_weighted_pressure_plate[power=2]', 'minecraft:heavy_weighted_pressure_plate[power=2]'],
    ['minecraft:heavy_weighted_pressure_plate[power=3]', 'minecraft:heavy_weighted_pressure_plate[power=3]'],
    ['minecraft:heavy_weighted_pressure_plate[power=4]', 'minecraft:heavy_weighted_pressure_plate[power=4]'],
    ['minecraft:heavy_weighted_pressure_plate[power=5]', 'minecraft:heavy_weighted_pressure_plate[power=5]'],
    ['minecraft:heavy_weighted_pressure_plate[power=6]', 'minecraft:heavy_weighted_pressure_plate[power=6]'],
    ['minecraft:heavy_weighted_pressure_plate[power=7]', 'minecraft:heavy_weighted_pressure_plate[power=7]'],
    ['minecraft:heavy_weighted_pressure_plate[power=8]', 'minecraft:heavy_weighted_pressure_plate[power=8]'],
    ['minecraft:heavy_weighted_pressure_plate[power=9]', 'minecraft:heavy_weighted_pressure_plate[power=9]'],
    ['minecraft:heavy_weighted_pressure_plate[power=10]', 'minecraft:heavy_weighted_pressure_plate[power=10]'],
    ['minecraft:heavy_weighted_pressure_plate[power=11]', 'minecraft:heavy_weighted_pressure_plate[power=11]'],
    ['minecraft:heavy_weighted_pressure_plate[power=12]', 'minecraft:heavy_weighted_pressure_plate[power=12]'],
    ['minecraft:heavy_weighted_pressure_plate[power=13]', 'minecraft:heavy_weighted_pressure_plate[power=13]'],
    ['minecraft:heavy_weighted_pressure_plate[power=14]', 'minecraft:heavy_weighted_pressure_plate[power=14]'],
    ['minecraft:heavy_weighted_pressure_plate[power=15]', 'minecraft:heavy_weighted_pressure_plate[power=15]'],
    [
        'minecraft:comparator[facing=south,mode=compare,powered=false]',
        'minecraft:unpowered_comparator[facing=south,mode=compare,powered=false]'
    ],
    [
        'minecraft:comparator[facing=west,mode=compare,powered=false]',
        'minecraft:unpowered_comparator[facing=west,mode=compare,powered=false]'
    ],
    [
        'minecraft:comparator[facing=north,mode=compare,powered=false]',
        'minecraft:unpowered_comparator[facing=north,mode=compare,powered=false]'
    ],
    [
        'minecraft:comparator[facing=east,mode=compare,powered=false]',
        'minecraft:unpowered_comparator[facing=east,mode=compare,powered=false]'
    ],
    [
        'minecraft:comparator[facing=south,mode=subtract,powered=false]',
        'minecraft:unpowered_comparator[facing=south,mode=subtract,powered=false]'
    ],
    [
        'minecraft:comparator[facing=west,mode=subtract,powered=false]',
        'minecraft:unpowered_comparator[facing=west,mode=subtract,powered=false]'
    ],
    [
        'minecraft:comparator[facing=north,mode=subtract,powered=false]',
        'minecraft:unpowered_comparator[facing=north,mode=subtract,powered=false]'
    ],
    [
        'minecraft:comparator[facing=east,mode=subtract,powered=false]',
        'minecraft:unpowered_comparator[facing=east,mode=subtract,powered=false]'
    ],
    [
        'minecraft:comparator[facing=south,mode=compare,powered=true]',
        'minecraft:unpowered_comparator[facing=south,mode=compare,powered=true]'
    ],
    [
        'minecraft:comparator[facing=west,mode=compare,powered=true]',
        'minecraft:unpowered_comparator[facing=west,mode=compare,powered=true]'
    ],
    [
        'minecraft:comparator[facing=north,mode=compare,powered=true]',
        'minecraft:unpowered_comparator[facing=north,mode=compare,powered=true]'
    ],
    [
        'minecraft:comparator[facing=east,mode=compare,powered=true]',
        'minecraft:unpowered_comparator[facing=east,mode=compare,powered=true]'
    ],
    [
        'minecraft:comparator[facing=south,mode=subtract,powered=true]',
        'minecraft:unpowered_comparator[facing=south,mode=subtract,powered=true]'
    ],
    [
        'minecraft:comparator[facing=west,mode=subtract,powered=true]',
        'minecraft:unpowered_comparator[facing=west,mode=subtract,powered=true]'
    ],
    [
        'minecraft:comparator[facing=north,mode=subtract,powered=true]',
        'minecraft:unpowered_comparator[facing=north,mode=subtract,powered=true]'
    ],
    [
        'minecraft:comparator[facing=east,mode=subtract,powered=true]',
        'minecraft:unpowered_comparator[facing=east,mode=subtract,powered=true]'
    ],
    [
        'minecraft:comparator[facing=south,mode=compare,powered=false]',
        'minecraft:powered_comparator[facing=south,mode=compare,powered=false]'
    ],
    [
        'minecraft:comparator[facing=west,mode=compare,powered=false]',
        'minecraft:powered_comparator[facing=west,mode=compare,powered=false]'
    ],
    [
        'minecraft:comparator[facing=north,mode=compare,powered=false]',
        'minecraft:powered_comparator[facing=north,mode=compare,powered=false]'
    ],
    [
        'minecraft:comparator[facing=east,mode=compare,powered=false]',
        'minecraft:powered_comparator[facing=east,mode=compare,powered=false]'
    ],
    [
        'minecraft:comparator[facing=south,mode=subtract,powered=false]',
        'minecraft:powered_comparator[facing=south,mode=subtract,powered=false]'
    ],
    [
        'minecraft:comparator[facing=west,mode=subtract,powered=false]',
        'minecraft:powered_comparator[facing=west,mode=subtract,powered=false]'
    ],
    [
        'minecraft:comparator[facing=north,mode=subtract,powered=false]',
        'minecraft:powered_comparator[facing=north,mode=subtract,powered=false]'
    ],
    [
        'minecraft:comparator[facing=east,mode=subtract,powered=false]',
        'minecraft:powered_comparator[facing=east,mode=subtract,powered=false]'
    ],
    [
        'minecraft:comparator[facing=south,mode=compare,powered=true]',
        'minecraft:powered_comparator[facing=south,mode=compare,powered=true]'
    ],
    [
        'minecraft:comparator[facing=west,mode=compare,powered=true]',
        'minecraft:powered_comparator[facing=west,mode=compare,powered=true]'
    ],
    [
        'minecraft:comparator[facing=north,mode=compare,powered=true]',
        'minecraft:powered_comparator[facing=north,mode=compare,powered=true]'
    ],
    [
        'minecraft:comparator[facing=east,mode=compare,powered=true]',
        'minecraft:powered_comparator[facing=east,mode=compare,powered=true]'
    ],
    [
        'minecraft:comparator[facing=south,mode=subtract,powered=true]',
        'minecraft:powered_comparator[facing=south,mode=subtract,powered=true]'
    ],
    [
        'minecraft:comparator[facing=west,mode=subtract,powered=true]',
        'minecraft:powered_comparator[facing=west,mode=subtract,powered=true]'
    ],
    [
        'minecraft:comparator[facing=north,mode=subtract,powered=true]',
        'minecraft:powered_comparator[facing=north,mode=subtract,powered=true]'
    ],
    [
        'minecraft:comparator[facing=east,mode=subtract,powered=true]',
        'minecraft:powered_comparator[facing=east,mode=subtract,powered=true]'
    ],
    ['minecraft:daylight_detector[inverted=false,power=0]', 'minecraft:daylight_detector[power=0]'],
    ['minecraft:daylight_detector[inverted=false,power=1]', 'minecraft:daylight_detector[power=1]'],
    ['minecraft:daylight_detector[inverted=false,power=2]', 'minecraft:daylight_detector[power=2]'],
    ['minecraft:daylight_detector[inverted=false,power=3]', 'minecraft:daylight_detector[power=3]'],
    ['minecraft:daylight_detector[inverted=false,power=4]', 'minecraft:daylight_detector[power=4]'],
    ['minecraft:daylight_detector[inverted=false,power=5]', 'minecraft:daylight_detector[power=5]'],
    ['minecraft:daylight_detector[inverted=false,power=6]', 'minecraft:daylight_detector[power=6]'],
    ['minecraft:daylight_detector[inverted=false,power=7]', 'minecraft:daylight_detector[power=7]'],
    ['minecraft:daylight_detector[inverted=false,power=8]', 'minecraft:daylight_detector[power=8]'],
    ['minecraft:daylight_detector[inverted=false,power=9]', 'minecraft:daylight_detector[power=9]'],
    ['minecraft:daylight_detector[inverted=false,power=10]', 'minecraft:daylight_detector[power=10]'],
    ['minecraft:daylight_detector[inverted=false,power=11]', 'minecraft:daylight_detector[power=11]'],
    ['minecraft:daylight_detector[inverted=false,power=12]', 'minecraft:daylight_detector[power=12]'],
    ['minecraft:daylight_detector[inverted=false,power=13]', 'minecraft:daylight_detector[power=13]'],
    ['minecraft:daylight_detector[inverted=false,power=14]', 'minecraft:daylight_detector[power=14]'],
    ['minecraft:daylight_detector[inverted=false,power=15]', 'minecraft:daylight_detector[power=15]'],
    ['minecraft:redstone_block', 'minecraft:redstone_block'],
    ['minecraft:nether_quartz_ore', 'minecraft:quartz_ore'],
    ['minecraft:hopper[enabled=true,facing=down]', 'minecraft:hopper[enabled=true,facing=down]'],
    ['minecraft:hopper[enabled=true,facing=north]', 'minecraft:hopper[enabled=true,facing=north]'],
    ['minecraft:hopper[enabled=true,facing=south]', 'minecraft:hopper[enabled=true,facing=south]'],
    ['minecraft:hopper[enabled=true,facing=west]', 'minecraft:hopper[enabled=true,facing=west]'],
    ['minecraft:hopper[enabled=true,facing=east]', 'minecraft:hopper[enabled=true,facing=east]'],
    ['minecraft:hopper[enabled=false,facing=down]', 'minecraft:hopper[enabled=false,facing=down]'],
    ['minecraft:hopper[enabled=false,facing=north]', 'minecraft:hopper[enabled=false,facing=north]'],
    ['minecraft:hopper[enabled=false,facing=south]', 'minecraft:hopper[enabled=false,facing=south]'],
    ['minecraft:hopper[enabled=false,facing=west]', 'minecraft:hopper[enabled=false,facing=west]'],
    ['minecraft:hopper[enabled=false,facing=east]', 'minecraft:hopper[enabled=false,facing=east]'],
    ['minecraft:quartz_block', 'minecraft:quartz_block[variant=default]'],
    ['minecraft:chiseled_quartz_block', 'minecraft:quartz_block[variant=chiseled]'],
    ['minecraft:quartz_pillar[axis=y]', 'minecraft:quartz_block[variant=lines_y]'],
    ['minecraft:quartz_pillar[axis=x]', 'minecraft:quartz_block[variant=lines_x]'],
    ['minecraft:quartz_pillar[axis=z]', 'minecraft:quartz_block[variant=lines_z]'],
    [
        'minecraft:quartz_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:quartz_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:quartz_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:quartz_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:quartz_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:quartz_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:quartz_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:quartz_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:quartz_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:quartz_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:quartz_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:quartz_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:quartz_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:quartz_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:quartz_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:quartz_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:quartz_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:quartz_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:quartz_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:quartz_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:quartz_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:quartz_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:quartz_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:quartz_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:quartz_stairs[facing=east,half=top,shape=straight]',
        'minecraft:quartz_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:quartz_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:quartz_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:quartz_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:quartz_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:quartz_stairs[facing=west,half=top,shape=straight]',
        'minecraft:quartz_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:quartz_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:quartz_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:quartz_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:quartz_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:quartz_stairs[facing=south,half=top,shape=straight]',
        'minecraft:quartz_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:quartz_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:quartz_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:quartz_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:quartz_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:quartz_stairs[facing=north,half=top,shape=straight]',
        'minecraft:quartz_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:quartz_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:quartz_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:quartz_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:quartz_stairs[facing=north,half=top,shape=straight]'
    ],
    [
        'minecraft:activator_rail[powered=false,shape=north_south]',
        'minecraft:activator_rail[powered=false,shape=north_south]'
    ],
    [
        'minecraft:activator_rail[powered=false,shape=east_west]',
        'minecraft:activator_rail[powered=false,shape=east_west]'
    ],
    [
        'minecraft:activator_rail[powered=false,shape=ascending_east]',
        'minecraft:activator_rail[powered=false,shape=ascending_east]'
    ],
    [
        'minecraft:activator_rail[powered=false,shape=ascending_west]',
        'minecraft:activator_rail[powered=false,shape=ascending_west]'
    ],
    [
        'minecraft:activator_rail[powered=false,shape=ascending_north]',
        'minecraft:activator_rail[powered=false,shape=ascending_north]'
    ],
    [
        'minecraft:activator_rail[powered=false,shape=ascending_south]',
        'minecraft:activator_rail[powered=false,shape=ascending_south]'
    ],
    [
        'minecraft:activator_rail[powered=true,shape=north_south]',
        'minecraft:activator_rail[powered=true,shape=north_south]'
    ],
    [
        'minecraft:activator_rail[powered=true,shape=east_west]',
        'minecraft:activator_rail[powered=true,shape=east_west]'
    ],
    [
        'minecraft:activator_rail[powered=true,shape=ascending_east]',
        'minecraft:activator_rail[powered=true,shape=ascending_east]'
    ],
    [
        'minecraft:activator_rail[powered=true,shape=ascending_west]',
        'minecraft:activator_rail[powered=true,shape=ascending_west]'
    ],
    [
        'minecraft:activator_rail[powered=true,shape=ascending_north]',
        'minecraft:activator_rail[powered=true,shape=ascending_north]'
    ],
    [
        'minecraft:activator_rail[powered=true,shape=ascending_south]',
        'minecraft:activator_rail[powered=true,shape=ascending_south]'
    ],
    ['minecraft:dropper[facing=down,triggered=false]', 'minecraft:dropper[facing=down,triggered=false]'],
    ['minecraft:dropper[facing=up,triggered=false]', 'minecraft:dropper[facing=up,triggered=false]'],
    ['minecraft:dropper[facing=north,triggered=false]', 'minecraft:dropper[facing=north,triggered=false]'],
    ['minecraft:dropper[facing=south,triggered=false]', 'minecraft:dropper[facing=south,triggered=false]'],
    ['minecraft:dropper[facing=west,triggered=false]', 'minecraft:dropper[facing=west,triggered=false]'],
    ['minecraft:dropper[facing=east,triggered=false]', 'minecraft:dropper[facing=east,triggered=false]'],
    ['minecraft:dropper[facing=down,triggered=true]', 'minecraft:dropper[facing=down,triggered=true]'],
    ['minecraft:dropper[facing=up,triggered=true]', 'minecraft:dropper[facing=up,triggered=true]'],
    ['minecraft:dropper[facing=north,triggered=true]', 'minecraft:dropper[facing=north,triggered=true]'],
    ['minecraft:dropper[facing=south,triggered=true]', 'minecraft:dropper[facing=south,triggered=true]'],
    ['minecraft:dropper[facing=west,triggered=true]', 'minecraft:dropper[facing=west,triggered=true]'],
    ['minecraft:dropper[facing=east,triggered=true]', 'minecraft:dropper[facing=east,triggered=true]'],
    ['minecraft:white_terracotta', 'minecraft:stained_hardened_clay[color=white]'],
    ['minecraft:orange_terracotta', 'minecraft:stained_hardened_clay[color=orange]'],
    ['minecraft:magenta_terracotta', 'minecraft:stained_hardened_clay[color=magenta]'],
    ['minecraft:light_blue_terracotta', 'minecraft:stained_hardened_clay[color=light_blue]'],
    ['minecraft:yellow_terracotta', 'minecraft:stained_hardened_clay[color=yellow]'],
    ['minecraft:lime_terracotta', 'minecraft:stained_hardened_clay[color=lime]'],
    ['minecraft:pink_terracotta', 'minecraft:stained_hardened_clay[color=pink]'],
    ['minecraft:gray_terracotta', 'minecraft:stained_hardened_clay[color=gray]'],
    ['minecraft:light_gray_terracotta', 'minecraft:stained_hardened_clay[color=silver]'],
    ['minecraft:cyan_terracotta', 'minecraft:stained_hardened_clay[color=cyan]'],
    ['minecraft:purple_terracotta', 'minecraft:stained_hardened_clay[color=purple]'],
    ['minecraft:blue_terracotta', 'minecraft:stained_hardened_clay[color=blue]'],
    ['minecraft:brown_terracotta', 'minecraft:stained_hardened_clay[color=brown]'],
    ['minecraft:green_terracotta', 'minecraft:stained_hardened_clay[color=green]'],
    ['minecraft:red_terracotta', 'minecraft:stained_hardened_clay[color=red]'],
    ['minecraft:black_terracotta', 'minecraft:stained_hardened_clay[color=black]'],
    [
        'minecraft:white_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=white,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=white,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=white,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=white,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=white,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=white,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=white,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=white,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=white,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=white,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=white,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=white,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=white,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=white,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=white,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=white,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:orange_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=orange,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=orange,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=orange,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=orange,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=orange,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=orange,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=orange,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=orange,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=orange,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=orange,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=orange,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=orange,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=orange,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=orange,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=orange,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=orange,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:magenta_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=magenta,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=magenta,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=magenta,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=magenta,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=magenta,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=magenta,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=magenta,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=magenta,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=magenta,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=magenta,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=magenta,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=magenta,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=magenta,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=magenta,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=magenta,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=magenta,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:light_blue_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=light_blue,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=light_blue,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=light_blue,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=light_blue,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=light_blue,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=light_blue,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=light_blue,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=light_blue,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=light_blue,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=light_blue,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=light_blue,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=light_blue,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=light_blue,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=light_blue,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=light_blue,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=light_blue,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:yellow_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=yellow,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=yellow,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=yellow,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=yellow,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=yellow,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=yellow,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=yellow,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=yellow,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=yellow,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=yellow,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=yellow,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=yellow,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=yellow,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=yellow,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=yellow,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=yellow,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:lime_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=lime,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=lime,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=lime,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=lime,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=lime,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=lime,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=lime,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=lime,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=lime,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=lime,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=lime,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=lime,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=lime,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=lime,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=lime,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=lime,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:pink_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=pink,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=pink,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=pink,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=pink,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=pink,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=pink,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=pink,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=pink,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=pink,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=pink,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=pink,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=pink,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=pink,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=pink,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=pink,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=pink,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:gray_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=gray,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=gray,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=gray,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=gray,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=gray,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=gray,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=gray,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=gray,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=gray,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=gray,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=gray,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=gray,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=gray,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=gray,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=gray,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=gray,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:light_gray_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=silver,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=silver,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=silver,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=silver,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=silver,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=silver,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=silver,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=silver,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=silver,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=silver,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=silver,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=silver,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=silver,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=silver,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=silver,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=silver,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:cyan_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=cyan,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=cyan,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=cyan,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=cyan,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=cyan,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=cyan,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=cyan,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=cyan,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=cyan,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=cyan,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=cyan,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=cyan,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=cyan,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=cyan,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=cyan,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=cyan,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:purple_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=purple,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=purple,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=purple,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=purple,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=purple,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=purple,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=purple,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=purple,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=purple,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=purple,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=purple,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=purple,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=purple,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=purple,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=purple,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=purple,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:blue_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=blue,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=blue,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=blue,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=blue,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=blue,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=blue,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=blue,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=blue,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=blue,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=blue,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=blue,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=blue,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=blue,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=blue,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=blue,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=blue,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:brown_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=brown,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=brown,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=brown,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=brown,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=brown,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=brown,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=brown,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=brown,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=brown,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=brown,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=brown,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=brown,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=brown,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=brown,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=brown,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=brown,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:green_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=green,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=green,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=green,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=green,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=green,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=green,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=green,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=green,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=green,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=green,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=green,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=green,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=green,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=green,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=green,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=green,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:red_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=red,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=red,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=red,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=red,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=red,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=red,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=red,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=red,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=red,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=red,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=red,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=red,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=red,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=red,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=red,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=red,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:black_stained_glass_pane[east=false,north=false,south:false,west=false]',
        'minecraft:stained_glass_pane[color=black,east=false,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=black,east=false,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=black,east=false,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=black,east=false,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=black,east=false,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=black,east=false,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=black,east=false,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=black,east=false,north:true,south=true,west=true]',
        'minecraft:stained_glass_pane[color=black,east=true,north:false,south=false,west=false]',
        'minecraft:stained_glass_pane[color=black,east=true,north:false,south=false,west=true]',
        'minecraft:stained_glass_pane[color=black,east=true,north:false,south=true,west=false]',
        'minecraft:stained_glass_pane[color=black,east=true,north:false,south=true,west=true]',
        'minecraft:stained_glass_pane[color=black,east=true,north:true,south=false,west=false]',
        'minecraft:stained_glass_pane[color=black,east=true,north:true,south=false,west=true]',
        'minecraft:stained_glass_pane[color=black,east=true,north:true,south=true,west=false]',
        'minecraft:stained_glass_pane[color=black,east=true,north:true,south=true,west=true]'
    ],
    [
        'minecraft:acacia_leaves[check_decay=false,decayable=true]',
        '{Name:minecraft:leaves2,Properties:{check_decay:false,decayable=true,variant=acacia]'
    ],
    [
        'minecraft:dark_oak_leaves[check_decay=false,decayable=true]',
        '{Name:minecraft:leaves2,Properties:{check_decay:false,decayable=true,variant=dark_oak]'
    ],
    [
        'minecraft:acacia_leaves[check_decay=false,decayable=false]',
        '{Name:minecraft:leaves2,Properties:{check_decay:false,decayable=false,variant=acacia]'
    ],
    [
        'minecraft:dark_oak_leaves[check_decay=false,decayable=false]',
        '{Name:minecraft:leaves2,Properties:{check_decay:false,decayable=false,variant=dark_oak]'
    ],
    [
        'minecraft:acacia_leaves[check_decay=true,decayable=true]',
        '{Name:minecraft:leaves2,Properties:{check_decay:true,decayable=true,variant=acacia]'
    ],
    [
        'minecraft:dark_oak_leaves[check_decay=true,decayable=true]',
        '{Name:minecraft:leaves2,Properties:{check_decay:true,decayable=true,variant=dark_oak]'
    ],
    [
        'minecraft:acacia_leaves[check_decay=true,decayable=false]',
        '{Name:minecraft:leaves2,Properties:{check_decay:true,decayable=false,variant=acacia]'
    ],
    [
        'minecraft:dark_oak_leaves[check_decay=true,decayable=false]',
        '{Name:minecraft:leaves2,Properties:{check_decay:true,decayable=false,variant=dark_oak]'
    ],
    ['minecraft:acacia_log[axis=y]', '{Name:minecraft:log2,Properties:{axis:y,variant=acacia]'],
    ['minecraft:dark_oak_log[axis=y]', '{Name:minecraft:log2,Properties:{axis:y,variant=dark_oak]'],
    ['minecraft:acacia_log[axis=x]', '{Name:minecraft:log2,Properties:{axis:x,variant=acacia]'],
    ['minecraft:dark_oak_log[axis=x]', '{Name:minecraft:log2,Properties:{axis:x,variant=dark_oak]'],
    ['minecraft:acacia_log[axis=z]', '{Name:minecraft:log2,Properties:{axis:z,variant=acacia]'],
    ['minecraft:dark_oak_log[axis=z]', '{Name:minecraft:log2,Properties:{axis:z,variant=dark_oak]'],
    ['minecraft:acacia_wood', '{Name:minecraft:log2,Properties:{axis:none,variant=acacia]'],
    ['minecraft:dark_oak_wood', '{Name:minecraft:log2,Properties:{axis:none,variant=dark_oak]'],
    [
        'minecraft:acacia_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:acacia_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:acacia_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:acacia_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:acacia_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:acacia_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:acacia_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:acacia_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:acacia_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:acacia_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:acacia_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:acacia_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:acacia_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:acacia_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:acacia_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:acacia_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:acacia_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:acacia_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:acacia_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:acacia_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:acacia_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:acacia_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:acacia_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:acacia_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:acacia_stairs[facing=east,half=top,shape=straight]',
        'minecraft:acacia_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:acacia_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:acacia_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:acacia_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:acacia_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:acacia_stairs[facing=west,half=top,shape=straight]',
        'minecraft:acacia_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:acacia_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:acacia_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:acacia_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:acacia_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:acacia_stairs[facing=south,half=top,shape=straight]',
        'minecraft:acacia_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:acacia_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:acacia_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:acacia_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:acacia_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:acacia_stairs[facing=north,half=top,shape=straight]',
        'minecraft:acacia_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:acacia_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:acacia_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:acacia_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:acacia_stairs[facing=north,half=top,shape=straight]'
    ],
    [
        'minecraft:dark_oak_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:dark_oak_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:dark_oak_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:dark_oak_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:dark_oak_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:dark_oak_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:dark_oak_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:dark_oak_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:dark_oak_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:dark_oak_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:dark_oak_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:dark_oak_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:dark_oak_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:dark_oak_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:dark_oak_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:dark_oak_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:dark_oak_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:dark_oak_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:dark_oak_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:dark_oak_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:dark_oak_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:dark_oak_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:dark_oak_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:dark_oak_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:dark_oak_stairs[facing=east,half=top,shape=straight]',
        'minecraft:dark_oak_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:dark_oak_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:dark_oak_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:dark_oak_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:dark_oak_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:dark_oak_stairs[facing=west,half=top,shape=straight]',
        'minecraft:dark_oak_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:dark_oak_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:dark_oak_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:dark_oak_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:dark_oak_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:dark_oak_stairs[facing=south,half=top,shape=straight]',
        'minecraft:dark_oak_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:dark_oak_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:dark_oak_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:dark_oak_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:dark_oak_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:dark_oak_stairs[facing=north,half=top,shape=straight]',
        'minecraft:dark_oak_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:dark_oak_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:dark_oak_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:dark_oak_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:dark_oak_stairs[facing=north,half=top,shape=straight]'
    ],
    ['minecraft:slime_block', 'minecraft:slime'],
    ['minecraft:barrier', 'minecraft:barrier'],
    [
        'minecraft:iron_trapdoor[facing=north,half=bottom,open=false]',
        'minecraft:iron_trapdoor[facing=north,half=bottom,open=false]'
    ],
    [
        'minecraft:iron_trapdoor[facing=south,half=bottom,open=false]',
        'minecraft:iron_trapdoor[facing=south,half=bottom,open=false]'
    ],
    [
        'minecraft:iron_trapdoor[facing=west,half=bottom,open=false]',
        'minecraft:iron_trapdoor[facing=west,half=bottom,open=false]'
    ],
    [
        'minecraft:iron_trapdoor[facing=east,half=bottom,open=false]',
        'minecraft:iron_trapdoor[facing=east,half=bottom,open=false]'
    ],
    [
        'minecraft:iron_trapdoor[facing=north,half=bottom,open=true]',
        'minecraft:iron_trapdoor[facing=north,half=bottom,open=true]'
    ],
    [
        'minecraft:iron_trapdoor[facing=south,half=bottom,open=true]',
        'minecraft:iron_trapdoor[facing=south,half=bottom,open=true]'
    ],
    [
        'minecraft:iron_trapdoor[facing=west,half=bottom,open=true]',
        'minecraft:iron_trapdoor[facing=west,half=bottom,open=true]'
    ],
    [
        'minecraft:iron_trapdoor[facing=east,half=bottom,open=true]',
        'minecraft:iron_trapdoor[facing=east,half=bottom,open=true]'
    ],
    [
        'minecraft:iron_trapdoor[facing=north,half=top,open=false]',
        'minecraft:iron_trapdoor[facing=north,half=top,open=false]'
    ],
    [
        'minecraft:iron_trapdoor[facing=south,half=top,open=false]',
        'minecraft:iron_trapdoor[facing=south,half=top,open=false]'
    ],
    [
        'minecraft:iron_trapdoor[facing=west,half=top,open=false]',
        'minecraft:iron_trapdoor[facing=west,half=top,open=false]'
    ],
    [
        'minecraft:iron_trapdoor[facing=east,half=top,open=false]',
        'minecraft:iron_trapdoor[facing=east,half=top,open=false]'
    ],
    [
        'minecraft:iron_trapdoor[facing=north,half=top,open=true]',
        'minecraft:iron_trapdoor[facing=north,half=top,open=true]'
    ],
    [
        'minecraft:iron_trapdoor[facing=south,half=top,open=true]',
        'minecraft:iron_trapdoor[facing=south,half=top,open=true]'
    ],
    [
        'minecraft:iron_trapdoor[facing=west,half=top,open=true]',
        'minecraft:iron_trapdoor[facing=west,half=top,open=true]'
    ],
    [
        'minecraft:iron_trapdoor[facing=east,half=top,open=true]',
        'minecraft:iron_trapdoor[facing=east,half=top,open=true]'
    ],
    ['minecraft:prismarine', 'minecraft:prismarine[variant=prismarine]'],
    ['minecraft:prismarine_bricks', 'minecraft:prismarine[variant=prismarine_bricks]'],
    ['minecraft:dark_prismarine', 'minecraft:prismarine[variant=dark_prismarine]'],
    ['minecraft:sea_lantern', 'minecraft:sea_lantern'],
    ['minecraft:hay_block[axis=y]', 'minecraft:hay_block[axis=y]'],
    ['minecraft:hay_block[axis=x]', 'minecraft:hay_block[axis=x]'],
    ['minecraft:hay_block[axis=z]', 'minecraft:hay_block[axis=z]'],
    ['minecraft:white_carpet', 'minecraft:carpet[color=white]'],
    ['minecraft:orange_carpet', 'minecraft:carpet[color=orange]'],
    ['minecraft:magenta_carpet', 'minecraft:carpet[color=magenta]'],
    ['minecraft:light_blue_carpet', 'minecraft:carpet[color=light_blue]'],
    ['minecraft:yellow_carpet', 'minecraft:carpet[color=yellow]'],
    ['minecraft:lime_carpet', 'minecraft:carpet[color=lime]'],
    ['minecraft:pink_carpet', 'minecraft:carpet[color=pink]'],
    ['minecraft:gray_carpet', 'minecraft:carpet[color=gray]'],
    ['minecraft:light_gray_carpet', 'minecraft:carpet[color=silver]'],
    ['minecraft:cyan_carpet', 'minecraft:carpet[color=cyan]'],
    ['minecraft:purple_carpet', 'minecraft:carpet[color=purple]'],
    ['minecraft:blue_carpet', 'minecraft:carpet[color=blue]'],
    ['minecraft:brown_carpet', 'minecraft:carpet[color=brown]'],
    ['minecraft:green_carpet', 'minecraft:carpet[color=green]'],
    ['minecraft:red_carpet', 'minecraft:carpet[color=red]'],
    ['minecraft:black_carpet', 'minecraft:carpet[color=black]'],
    ['minecraft:terracotta', 'minecraft:hardened_clay'],
    ['minecraft:coal_block', 'minecraft:coal_block'],
    ['minecraft:packed_ice', 'minecraft:packed_ice'],
    [
        'minecraft:sunflower[half=lower]',
        'minecraft:double_plant[facing=east,half=lower,variant=sunflower]',
        'minecraft:double_plant[facing=north,half=lower,variant=sunflower]',
        'minecraft:double_plant[facing=south,half=lower,variant=sunflower]',
        'minecraft:double_plant[facing=west,half=lower,variant=sunflower]'
    ],
    [
        'minecraft:lilac[half=lower]',
        'minecraft:double_plant[facing=east,half=lower,variant=syringa]',
        'minecraft:double_plant[facing=north,half=lower,variant=syringa]',
        'minecraft:double_plant[facing=south,half=lower,variant=syringa]',
        'minecraft:double_plant[facing=west,half=lower,variant=syringa]'
    ],
    [
        'minecraft:tall_grass[half=lower]',
        'minecraft:double_plant[facing=east,half=lower,variant=double_grass]',
        'minecraft:double_plant[facing=north,half=lower,variant=double_grass]',
        'minecraft:double_plant[facing=south,half=lower,variant=double_grass]',
        'minecraft:double_plant[facing=west,half=lower,variant=double_grass]'
    ],
    [
        'minecraft:large_fern[half=lower]',
        'minecraft:double_plant[facing=east,half=lower,variant=double_fern]',
        'minecraft:double_plant[facing=north,half=lower,variant=double_fern]',
        'minecraft:double_plant[facing=south,half=lower,variant=double_fern]',
        'minecraft:double_plant[facing=west,half=lower,variant=double_fern]'
    ],
    [
        'minecraft:rose_bush[half=lower]',
        'minecraft:double_plant[facing=east,half=lower,variant=double_rose]',
        'minecraft:double_plant[facing=north,half=lower,variant=double_rose]',
        'minecraft:double_plant[facing=south,half=lower,variant=double_rose]',
        'minecraft:double_plant[facing=west,half=lower,variant=double_rose]'
    ],
    [
        'minecraft:peony[half=lower]',
        'minecraft:double_plant[facing=east,half=lower,variant=paeonia]',
        'minecraft:double_plant[facing=north,half=lower,variant=paeonia]',
        'minecraft:double_plant[facing=south,half=lower,variant=paeonia]',
        'minecraft:double_plant[facing=west,half=lower,variant=paeonia]'
    ],
    [
        'minecraft:peony[half=upper]',
        'minecraft:double_plant[facing=south,half=upper,variant=double_fern]',
        'minecraft:double_plant[facing=south,half=upper,variant=double_grass]',
        'minecraft:double_plant[facing=south,half=upper,variant=double_rose]',
        'minecraft:double_plant[facing=south,half=upper,variant=paeonia]',
        'minecraft:double_plant[facing=south,half=upper,variant=sunflower]',
        'minecraft:double_plant[facing=south,half=upper,variant=syringa]'
    ],
    [
        'minecraft:peony[half=upper]',
        'minecraft:double_plant[facing=west,half=upper,variant=double_fern]',
        'minecraft:double_plant[facing=west,half=upper,variant=double_grass]',
        'minecraft:double_plant[facing=west,half=upper,variant=double_rose]',
        'minecraft:double_plant[facing=west,half=upper,variant=paeonia]',
        'minecraft:double_plant[facing=west,half=upper,variant=sunflower]',
        'minecraft:double_plant[facing=west,half=upper,variant=syringa]'
    ],
    [
        'minecraft:peony[half=upper]',
        'minecraft:double_plant[facing=north,half=upper,variant=double_fern]',
        'minecraft:double_plant[facing=north,half=upper,variant=double_grass]',
        'minecraft:double_plant[facing=north,half=upper,variant=double_rose]',
        'minecraft:double_plant[facing=north,half=upper,variant=paeonia]',
        'minecraft:double_plant[facing=north,half=upper,variant=sunflower]',
        'minecraft:double_plant[facing=north,half=upper,variant=syringa]'
    ],
    [
        'minecraft:peony[half=upper]',
        'minecraft:double_plant[facing=east,half=upper,variant=double_fern]',
        'minecraft:double_plant[facing=east,half=upper,variant=double_grass]',
        'minecraft:double_plant[facing=east,half=upper,variant=double_rose]',
        'minecraft:double_plant[facing=east,half=upper,variant=paeonia]',
        'minecraft:double_plant[facing=east,half=upper,variant=sunflower]',
        'minecraft:double_plant[facing=east,half=upper,variant=syringa]'
    ],
    ['minecraft:white_banner[rotation=0]', 'minecraft:standing_banner[rotation=0]'],
    ['minecraft:white_banner[rotation=1]', 'minecraft:standing_banner[rotation=1]'],
    ['minecraft:white_banner[rotation=2]', 'minecraft:standing_banner[rotation=2]'],
    ['minecraft:white_banner[rotation=3]', 'minecraft:standing_banner[rotation=3]'],
    ['minecraft:white_banner[rotation=4]', 'minecraft:standing_banner[rotation=4]'],
    ['minecraft:white_banner[rotation=5]', 'minecraft:standing_banner[rotation=5]'],
    ['minecraft:white_banner[rotation=6]', 'minecraft:standing_banner[rotation=6]'],
    ['minecraft:white_banner[rotation=7]', 'minecraft:standing_banner[rotation=7]'],
    ['minecraft:white_banner[rotation=8]', 'minecraft:standing_banner[rotation=8]'],
    ['minecraft:white_banner[rotation=9]', 'minecraft:standing_banner[rotation=9]'],
    ['minecraft:white_banner[rotation=10]', 'minecraft:standing_banner[rotation=10]'],
    ['minecraft:white_banner[rotation=11]', 'minecraft:standing_banner[rotation=11]'],
    ['minecraft:white_banner[rotation=12]', 'minecraft:standing_banner[rotation=12]'],
    ['minecraft:white_banner[rotation=13]', 'minecraft:standing_banner[rotation=13]'],
    ['minecraft:white_banner[rotation=14]', 'minecraft:standing_banner[rotation=14]'],
    ['minecraft:white_banner[rotation=15]', 'minecraft:standing_banner[rotation=15]'],
    ['minecraft:white_wall_banner[facing=north]', 'minecraft:wall_banner[facing=north]'],
    ['minecraft:white_wall_banner[facing=south]', 'minecraft:wall_banner[facing=south]'],
    ['minecraft:white_wall_banner[facing=west]', 'minecraft:wall_banner[facing=west]'],
    ['minecraft:white_wall_banner[facing=east]', 'minecraft:wall_banner[facing=east]'],
    ['minecraft:daylight_detector[inverted=true,power=0]', 'minecraft:daylight_detector_inverted[power=0]'],
    ['minecraft:daylight_detector[inverted=true,power=1]', 'minecraft:daylight_detector_inverted[power=1]'],
    ['minecraft:daylight_detector[inverted=true,power=2]', 'minecraft:daylight_detector_inverted[power=2]'],
    ['minecraft:daylight_detector[inverted=true,power=3]', 'minecraft:daylight_detector_inverted[power=3]'],
    ['minecraft:daylight_detector[inverted=true,power=4]', 'minecraft:daylight_detector_inverted[power=4]'],
    ['minecraft:daylight_detector[inverted=true,power=5]', 'minecraft:daylight_detector_inverted[power=5]'],
    ['minecraft:daylight_detector[inverted=true,power=6]', 'minecraft:daylight_detector_inverted[power=6]'],
    ['minecraft:daylight_detector[inverted=true,power=7]', 'minecraft:daylight_detector_inverted[power=7]'],
    ['minecraft:daylight_detector[inverted=true,power=8]', 'minecraft:daylight_detector_inverted[power=8]'],
    ['minecraft:daylight_detector[inverted=true,power=9]', 'minecraft:daylight_detector_inverted[power=9]'],
    ['minecraft:daylight_detector[inverted=true,power=10]', 'minecraft:daylight_detector_inverted[power=10]'],
    ['minecraft:daylight_detector[inverted=true,power=11]', 'minecraft:daylight_detector_inverted[power=11]'],
    ['minecraft:daylight_detector[inverted=true,power=12]', 'minecraft:daylight_detector_inverted[power=12]'],
    ['minecraft:daylight_detector[inverted=true,power=13]', 'minecraft:daylight_detector_inverted[power=13]'],
    ['minecraft:daylight_detector[inverted=true,power=14]', 'minecraft:daylight_detector_inverted[power=14]'],
    ['minecraft:daylight_detector[inverted=true,power=15]', 'minecraft:daylight_detector_inverted[power=15]'],
    ['minecraft:red_sandstone', 'minecraft:red_sandstone[type=red_sandstone]'],
    ['minecraft:chiseled_red_sandstone', 'minecraft:red_sandstone[type=chiseled_red_sandstone]'],
    ['minecraft:cut_red_sandstone', 'minecraft:red_sandstone[type=smooth_red_sandstone]'],
    [
        'minecraft:red_sandstone_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:red_sandstone_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:red_sandstone_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:red_sandstone_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:red_sandstone_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:red_sandstone_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:red_sandstone_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:red_sandstone_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:red_sandstone_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:red_sandstone_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:red_sandstone_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:red_sandstone_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:red_sandstone_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:red_sandstone_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:red_sandstone_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:red_sandstone_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:red_sandstone_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:red_sandstone_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:red_sandstone_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:red_sandstone_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:red_sandstone_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:red_sandstone_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:red_sandstone_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:red_sandstone_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:red_sandstone_stairs[facing=east,half=top,shape=straight]',
        'minecraft:red_sandstone_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:red_sandstone_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:red_sandstone_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:red_sandstone_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:red_sandstone_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:red_sandstone_stairs[facing=west,half=top,shape=straight]',
        'minecraft:red_sandstone_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:red_sandstone_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:red_sandstone_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:red_sandstone_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:red_sandstone_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:red_sandstone_stairs[facing=south,half=top,shape=straight]',
        'minecraft:red_sandstone_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:red_sandstone_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:red_sandstone_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:red_sandstone_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:red_sandstone_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:red_sandstone_stairs[facing=north,half=top,shape=straight]',
        'minecraft:red_sandstone_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:red_sandstone_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:red_sandstone_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:red_sandstone_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:red_sandstone_stairs[facing=north,half=top,shape=straight]'
    ],
    [
        'minecraft:red_sandstone_slab[type=double]',
        '{Name:minecraft:double_stone_slab2,Properties:{seamless:false,variant=red_sandstone]'
    ],
    [
        'minecraft:smooth_red_sandstone',
        '{Name:minecraft:double_stone_slab2,Properties:{seamless:true,variant=red_sandstone]'
    ],
    [
        'minecraft:red_sandstone_slab[type=bottom]',
        '{Name:minecraft:stone_slab2,Properties:{half:bottom,variant=red_sandstone]'
    ],
    [
        'minecraft:red_sandstone_slab[type=top]',
        '{Name:minecraft:stone_slab2,Properties:{half:top,variant=red_sandstone]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
        'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
        'minecraft:spruce_fence_gate[facing=south,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
        'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
        'minecraft:spruce_fence_gate[facing=west,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
        'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
        'minecraft:spruce_fence_gate[facing=north,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
        'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
        'minecraft:spruce_fence_gate[facing=east,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
        'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
        'minecraft:spruce_fence_gate[facing=south,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
        'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
        'minecraft:spruce_fence_gate[facing=west,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
        'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
        'minecraft:spruce_fence_gate[facing=north,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
        'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
        'minecraft:spruce_fence_gate[facing=east,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
        'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
        'minecraft:spruce_fence_gate[facing=south,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
        'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
        'minecraft:spruce_fence_gate[facing=west,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
        'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
        'minecraft:spruce_fence_gate[facing=north,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
        'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
        'minecraft:spruce_fence_gate[facing=east,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
        'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
        'minecraft:spruce_fence_gate[facing=south,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
        'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
        'minecraft:spruce_fence_gate[facing=west,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
        'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
        'minecraft:spruce_fence_gate[facing=north,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
        'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
        'minecraft:spruce_fence_gate[facing=east,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:birch_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
        'minecraft:birch_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
        'minecraft:birch_fence_gate[facing=south,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:birch_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
        'minecraft:birch_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
        'minecraft:birch_fence_gate[facing=west,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:birch_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
        'minecraft:birch_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
        'minecraft:birch_fence_gate[facing=north,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:birch_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
        'minecraft:birch_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
        'minecraft:birch_fence_gate[facing=east,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:birch_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
        'minecraft:birch_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
        'minecraft:birch_fence_gate[facing=south,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:birch_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
        'minecraft:birch_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
        'minecraft:birch_fence_gate[facing=west,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:birch_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
        'minecraft:birch_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
        'minecraft:birch_fence_gate[facing=north,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:birch_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
        'minecraft:birch_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
        'minecraft:birch_fence_gate[facing=east,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:birch_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
        'minecraft:birch_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
        'minecraft:birch_fence_gate[facing=south,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:birch_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
        'minecraft:birch_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
        'minecraft:birch_fence_gate[facing=west,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:birch_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
        'minecraft:birch_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
        'minecraft:birch_fence_gate[facing=north,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:birch_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
        'minecraft:birch_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
        'minecraft:birch_fence_gate[facing=east,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:birch_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
        'minecraft:birch_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
        'minecraft:birch_fence_gate[facing=south,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:birch_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
        'minecraft:birch_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
        'minecraft:birch_fence_gate[facing=west,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:birch_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
        'minecraft:birch_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
        'minecraft:birch_fence_gate[facing=north,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:birch_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
        'minecraft:birch_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
        'minecraft:birch_fence_gate[facing=east,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
        'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
        'minecraft:jungle_fence_gate[facing=south,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
        'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
        'minecraft:jungle_fence_gate[facing=west,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
        'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
        'minecraft:jungle_fence_gate[facing=north,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
        'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
        'minecraft:jungle_fence_gate[facing=east,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
        'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
        'minecraft:jungle_fence_gate[facing=south,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
        'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
        'minecraft:jungle_fence_gate[facing=west,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
        'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
        'minecraft:jungle_fence_gate[facing=north,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
        'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
        'minecraft:jungle_fence_gate[facing=east,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
        'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
        'minecraft:jungle_fence_gate[facing=south,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
        'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
        'minecraft:jungle_fence_gate[facing=west,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
        'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
        'minecraft:jungle_fence_gate[facing=north,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
        'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
        'minecraft:jungle_fence_gate[facing=east,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
        'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
        'minecraft:jungle_fence_gate[facing=south,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
        'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
        'minecraft:jungle_fence_gate[facing=west,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
        'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
        'minecraft:jungle_fence_gate[facing=north,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
        'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
        'minecraft:jungle_fence_gate[facing=east,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=south,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=west,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=north,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=east,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=south,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=west,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=north,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
        'minecraft:dark_oak_fence_gate[facing=east,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=south,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=west,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=north,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=east,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=south,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=west,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=north,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
        'minecraft:dark_oak_fence_gate[facing=east,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
        'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
        'minecraft:acacia_fence_gate[facing=south,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
        'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
        'minecraft:acacia_fence_gate[facing=west,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
        'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
        'minecraft:acacia_fence_gate[facing=north,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
        'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
        'minecraft:acacia_fence_gate[facing=east,in_wall=true,open:false,powered=false]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
        'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
        'minecraft:acacia_fence_gate[facing=south,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
        'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
        'minecraft:acacia_fence_gate[facing=west,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
        'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
        'minecraft:acacia_fence_gate[facing=north,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
        'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
        'minecraft:acacia_fence_gate[facing=east,in_wall=true,open:true,powered=false]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
        'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
        'minecraft:acacia_fence_gate[facing=south,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
        'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
        'minecraft:acacia_fence_gate[facing=west,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
        'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
        'minecraft:acacia_fence_gate[facing=north,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
        'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
        'minecraft:acacia_fence_gate[facing=east,in_wall=true,open:false,powered=true]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
        'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
        'minecraft:acacia_fence_gate[facing=south,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
        'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
        'minecraft:acacia_fence_gate[facing=west,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
        'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
        'minecraft:acacia_fence_gate[facing=north,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
        'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
        'minecraft:acacia_fence_gate[facing=east,in_wall=true,open:true,powered=true]'
    ],
    [
        'minecraft:spruce_fence[east=false,north=false,south:false,west=false]',
        'minecraft:spruce_fence[east=false,north=false,south:false,west=false]',
        'minecraft:spruce_fence[east=false,north=false,south:false,west=true]',
        'minecraft:spruce_fence[east=false,north=false,south:true,west=false]',
        'minecraft:spruce_fence[east=false,north=false,south:true,west=true]',
        'minecraft:spruce_fence[east=false,north=true,south:false,west=false]',
        'minecraft:spruce_fence[east=false,north=true,south:false,west=true]',
        'minecraft:spruce_fence[east=false,north=true,south:true,west=false]',
        'minecraft:spruce_fence[east=false,north=true,south:true,west=true]',
        'minecraft:spruce_fence[east=true,north=false,south:false,west=false]',
        'minecraft:spruce_fence[east=true,north=false,south:false,west=true]',
        'minecraft:spruce_fence[east=true,north=false,south:true,west=false]',
        'minecraft:spruce_fence[east=true,north=false,south:true,west=true]',
        'minecraft:spruce_fence[east=true,north=true,south:false,west=false]',
        'minecraft:spruce_fence[east=true,north=true,south:false,west=true]',
        'minecraft:spruce_fence[east=true,north=true,south:true,west=false]',
        'minecraft:spruce_fence[east=true,north=true,south:true,west=true]'
    ],
    [
        'minecraft:birch_fence[east=false,north=false,south:false,west=false]',
        'minecraft:birch_fence[east=false,north=false,south:false,west=false]',
        'minecraft:birch_fence[east=false,north=false,south:false,west=true]',
        'minecraft:birch_fence[east=false,north=false,south:true,west=false]',
        'minecraft:birch_fence[east=false,north=false,south:true,west=true]',
        'minecraft:birch_fence[east=false,north=true,south:false,west=false]',
        'minecraft:birch_fence[east=false,north=true,south:false,west=true]',
        'minecraft:birch_fence[east=false,north=true,south:true,west=false]',
        'minecraft:birch_fence[east=false,north=true,south:true,west=true]',
        'minecraft:birch_fence[east=true,north=false,south:false,west=false]',
        'minecraft:birch_fence[east=true,north=false,south:false,west=true]',
        'minecraft:birch_fence[east=true,north=false,south:true,west=false]',
        'minecraft:birch_fence[east=true,north=false,south:true,west=true]',
        'minecraft:birch_fence[east=true,north=true,south:false,west=false]',
        'minecraft:birch_fence[east=true,north=true,south:false,west=true]',
        'minecraft:birch_fence[east=true,north=true,south:true,west=false]',
        'minecraft:birch_fence[east=true,north=true,south:true,west=true]'
    ],
    [
        'minecraft:jungle_fence[east=false,north=false,south:false,west=false]',
        'minecraft:jungle_fence[east=false,north=false,south:false,west=false]',
        'minecraft:jungle_fence[east=false,north=false,south:false,west=true]',
        'minecraft:jungle_fence[east=false,north=false,south:true,west=false]',
        'minecraft:jungle_fence[east=false,north=false,south:true,west=true]',
        'minecraft:jungle_fence[east=false,north=true,south:false,west=false]',
        'minecraft:jungle_fence[east=false,north=true,south:false,west=true]',
        'minecraft:jungle_fence[east=false,north=true,south:true,west=false]',
        'minecraft:jungle_fence[east=false,north=true,south:true,west=true]',
        'minecraft:jungle_fence[east=true,north=false,south:false,west=false]',
        'minecraft:jungle_fence[east=true,north=false,south:false,west=true]',
        'minecraft:jungle_fence[east=true,north=false,south:true,west=false]',
        'minecraft:jungle_fence[east=true,north=false,south:true,west=true]',
        'minecraft:jungle_fence[east=true,north=true,south:false,west=false]',
        'minecraft:jungle_fence[east=true,north=true,south:false,west=true]',
        'minecraft:jungle_fence[east=true,north=true,south:true,west=false]',
        'minecraft:jungle_fence[east=true,north=true,south:true,west=true]'
    ],
    [
        'minecraft:dark_oak_fence[east=false,north=false,south:false,west=false]',
        'minecraft:dark_oak_fence[east=false,north=false,south:false,west=false]',
        'minecraft:dark_oak_fence[east=false,north=false,south:false,west=true]',
        'minecraft:dark_oak_fence[east=false,north=false,south:true,west=false]',
        'minecraft:dark_oak_fence[east=false,north=false,south:true,west=true]',
        'minecraft:dark_oak_fence[east=false,north=true,south:false,west=false]',
        'minecraft:dark_oak_fence[east=false,north=true,south:false,west=true]',
        'minecraft:dark_oak_fence[east=false,north=true,south:true,west=false]',
        'minecraft:dark_oak_fence[east=false,north=true,south:true,west=true]',
        'minecraft:dark_oak_fence[east=true,north=false,south:false,west=false]',
        'minecraft:dark_oak_fence[east=true,north=false,south:false,west=true]',
        'minecraft:dark_oak_fence[east=true,north=false,south:true,west=false]',
        'minecraft:dark_oak_fence[east=true,north=false,south:true,west=true]',
        'minecraft:dark_oak_fence[east=true,north=true,south:false,west=false]',
        'minecraft:dark_oak_fence[east=true,north=true,south:false,west=true]',
        'minecraft:dark_oak_fence[east=true,north=true,south:true,west=false]',
        'minecraft:dark_oak_fence[east=true,north=true,south:true,west=true]'
    ],
    [
        'minecraft:acacia_fence[east=false,north=false,south:false,west=false]',
        'minecraft:acacia_fence[east=false,north=false,south:false,west=false]',
        'minecraft:acacia_fence[east=false,north=false,south:false,west=true]',
        'minecraft:acacia_fence[east=false,north=false,south:true,west=false]',
        'minecraft:acacia_fence[east=false,north=false,south:true,west=true]',
        'minecraft:acacia_fence[east=false,north=true,south:false,west=false]',
        'minecraft:acacia_fence[east=false,north=true,south:false,west=true]',
        'minecraft:acacia_fence[east=false,north=true,south:true,west=false]',
        'minecraft:acacia_fence[east=false,north=true,south:true,west=true]',
        'minecraft:acacia_fence[east=true,north=false,south:false,west=false]',
        'minecraft:acacia_fence[east=true,north=false,south:false,west=true]',
        'minecraft:acacia_fence[east=true,north=false,south:true,west=false]',
        'minecraft:acacia_fence[east=true,north=false,south:true,west=true]',
        'minecraft:acacia_fence[east=true,north=true,south:false,west=false]',
        'minecraft:acacia_fence[east=true,north=true,south:false,west=true]',
        'minecraft:acacia_fence[east=true,north=true,south:true,west=false]',
        'minecraft:acacia_fence[east=true,north=true,south:true,west=true]'
    ],
    [
        'minecraft:spruce_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:spruce_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:spruce_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:spruce_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:spruce_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:spruce_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:spruce_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:spruce_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:spruce_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:spruce_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:spruce_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:spruce_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:spruce_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:spruce_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:spruce_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:spruce_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:spruce_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:spruce_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:spruce_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:spruce_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:spruce_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:spruce_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:spruce_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:spruce_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:spruce_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:spruce_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:spruce_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:spruce_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:spruce_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:spruce_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:spruce_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:spruce_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:spruce_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:spruce_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:spruce_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:spruce_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:spruce_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:spruce_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:spruce_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:spruce_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:spruce_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:spruce_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:spruce_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:spruce_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:spruce_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:spruce_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:spruce_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:spruce_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:spruce_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
    ],
    [
        'minecraft:spruce_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:spruce_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:spruce_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:spruce_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:spruce_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:spruce_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:spruce_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:spruce_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:spruce_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
    ],
    [
        'minecraft:spruce_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:spruce_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:spruce_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:spruce_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:spruce_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:spruce_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:spruce_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:spruce_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:spruce_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
    ],
    [
        'minecraft:spruce_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:spruce_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:spruce_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:spruce_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:spruce_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:spruce_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:spruce_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:spruce_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:spruce_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:birch_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:birch_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:birch_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:birch_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:birch_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:birch_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:birch_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:birch_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:birch_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:birch_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:birch_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:birch_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:birch_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:birch_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:birch_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:birch_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:birch_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:birch_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:birch_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:birch_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:birch_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:birch_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:birch_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:birch_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:birch_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:birch_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:birch_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:birch_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:birch_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:birch_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:birch_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:birch_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:birch_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:birch_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:birch_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:birch_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:birch_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:birch_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:birch_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:birch_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:birch_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:birch_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:birch_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:birch_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:birch_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:birch_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:birch_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:birch_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:birch_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
    ],
    [
        'minecraft:birch_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:birch_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:birch_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:birch_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:birch_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:birch_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:birch_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:birch_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:birch_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
    ],
    [
        'minecraft:birch_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:birch_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:birch_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:birch_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:birch_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:birch_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:birch_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:birch_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:birch_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
    ],
    [
        'minecraft:birch_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:birch_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:birch_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:birch_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:birch_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:birch_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:birch_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:birch_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:birch_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:jungle_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:jungle_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:jungle_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:jungle_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:jungle_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:jungle_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:jungle_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:jungle_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:jungle_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:jungle_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:jungle_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:jungle_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:jungle_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:jungle_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:jungle_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:jungle_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:jungle_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:jungle_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:jungle_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:jungle_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:jungle_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:jungle_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:jungle_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:jungle_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:jungle_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:jungle_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:jungle_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:jungle_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:jungle_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:jungle_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:jungle_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:jungle_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:jungle_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:jungle_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:jungle_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:jungle_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:jungle_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:jungle_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:jungle_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:jungle_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:jungle_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:jungle_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:jungle_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:jungle_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:jungle_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:jungle_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:jungle_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:jungle_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:jungle_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
    ],
    [
        'minecraft:jungle_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:jungle_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:jungle_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:jungle_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:jungle_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:jungle_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:jungle_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:jungle_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:jungle_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
    ],
    [
        'minecraft:jungle_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:jungle_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:jungle_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:jungle_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:jungle_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:jungle_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:jungle_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:jungle_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:jungle_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
    ],
    [
        'minecraft:jungle_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:jungle_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:jungle_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:jungle_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:jungle_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:jungle_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:jungle_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:jungle_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:jungle_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:acacia_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:acacia_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:acacia_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:acacia_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:acacia_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:acacia_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:acacia_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:acacia_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:acacia_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:acacia_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:acacia_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:acacia_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:acacia_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:acacia_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:acacia_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:acacia_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:acacia_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:acacia_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:acacia_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:acacia_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:acacia_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:acacia_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:acacia_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:acacia_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:acacia_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:acacia_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:acacia_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:acacia_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:acacia_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:acacia_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:acacia_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:acacia_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:acacia_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:acacia_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:acacia_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:acacia_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:acacia_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:acacia_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:acacia_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:acacia_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:acacia_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:acacia_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:acacia_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:acacia_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:acacia_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:acacia_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:acacia_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:acacia_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:acacia_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
    ],
    [
        'minecraft:acacia_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:acacia_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:acacia_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:acacia_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:acacia_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:acacia_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:acacia_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:acacia_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:acacia_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
    ],
    [
        'minecraft:acacia_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:acacia_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:acacia_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:acacia_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:acacia_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:acacia_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:acacia_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:acacia_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:acacia_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
    ],
    [
        'minecraft:acacia_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:acacia_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:acacia_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:acacia_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:acacia_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:acacia_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:acacia_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:acacia_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:acacia_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:dark_oak_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:dark_oak_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:dark_oak_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:dark_oak_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
    ],
    [
        'minecraft:dark_oak_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:dark_oak_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:dark_oak_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:dark_oak_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:dark_oak_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:dark_oak_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:dark_oak_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
        'minecraft:dark_oak_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
    ],
    [
        'minecraft:dark_oak_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
    ],
    [
        'minecraft:dark_oak_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
        'minecraft:dark_oak_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
        'minecraft:dark_oak_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
    ],
    [
        'minecraft:dark_oak_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:dark_oak_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:dark_oak_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
        'minecraft:dark_oak_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
    ],
    [
        'minecraft:dark_oak_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:dark_oak_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:dark_oak_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
        'minecraft:dark_oak_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
        'minecraft:dark_oak_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
    ],
    ['minecraft:end_rod[facing=down]', 'minecraft:end_rod[facing=down]'],
    ['minecraft:end_rod[facing=up]', 'minecraft:end_rod[facing=up]'],
    ['minecraft:end_rod[facing=north]', 'minecraft:end_rod[facing=north]'],
    ['minecraft:end_rod[facing=south]', 'minecraft:end_rod[facing=south]'],
    ['minecraft:end_rod[facing=west]', 'minecraft:end_rod[facing=west]'],
    ['minecraft:end_rod[facing=east]', 'minecraft:end_rod[facing=east]'],
    [
        'minecraft:chorus_plant[down=false,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:chorus_plant[down=false,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:chorus_plant[down=false,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:chorus_plant[down=false,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:chorus_plant[down=false,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:chorus_plant[down=false,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:chorus_plant[down=false,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:chorus_plant[down=false,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:chorus_plant[down=false,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:chorus_plant[down=false,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:chorus_plant[down=false,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:chorus_plant[down=false,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:chorus_plant[down=false,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:chorus_plant[down=false,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:chorus_plant[down=false,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:chorus_plant[down=false,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:chorus_plant[down=false,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:chorus_plant[down=false,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:chorus_plant[down=false,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:chorus_plant[down=false,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:chorus_plant[down=false,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:chorus_plant[down=false,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:chorus_plant[down=false,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:chorus_plant[down=false,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:chorus_plant[down=false,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:chorus_plant[down=false,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:chorus_plant[down=false,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:chorus_plant[down=false,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:chorus_plant[down=false,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:chorus_plant[down=false,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:chorus_plant[down=false,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:chorus_plant[down=false,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:chorus_plant[down=false,east=true,north:true,south=true,up:true,west=true]',
        'minecraft:chorus_plant[down=true,east=false,north:false,south=false,up:false,west=false]',
        'minecraft:chorus_plant[down=true,east=false,north:false,south=false,up:false,west=true]',
        'minecraft:chorus_plant[down=true,east=false,north:false,south=false,up:true,west=false]',
        'minecraft:chorus_plant[down=true,east=false,north:false,south=false,up:true,west=true]',
        'minecraft:chorus_plant[down=true,east=false,north:false,south=true,up:false,west=false]',
        'minecraft:chorus_plant[down=true,east=false,north:false,south=true,up:false,west=true]',
        'minecraft:chorus_plant[down=true,east=false,north:false,south=true,up:true,west=false]',
        'minecraft:chorus_plant[down=true,east=false,north:false,south=true,up:true,west=true]',
        'minecraft:chorus_plant[down=true,east=false,north:true,south=false,up:false,west=false]',
        'minecraft:chorus_plant[down=true,east=false,north:true,south=false,up:false,west=true]',
        'minecraft:chorus_plant[down=true,east=false,north:true,south=false,up:true,west=false]',
        'minecraft:chorus_plant[down=true,east=false,north:true,south=false,up:true,west=true]',
        'minecraft:chorus_plant[down=true,east=false,north:true,south=true,up:false,west=false]',
        'minecraft:chorus_plant[down=true,east=false,north:true,south=true,up:false,west=true]',
        'minecraft:chorus_plant[down=true,east=false,north:true,south=true,up:true,west=false]',
        'minecraft:chorus_plant[down=true,east=false,north:true,south=true,up:true,west=true]',
        'minecraft:chorus_plant[down=true,east=true,north:false,south=false,up:false,west=false]',
        'minecraft:chorus_plant[down=true,east=true,north:false,south=false,up:false,west=true]',
        'minecraft:chorus_plant[down=true,east=true,north:false,south=false,up:true,west=false]',
        'minecraft:chorus_plant[down=true,east=true,north:false,south=false,up:true,west=true]',
        'minecraft:chorus_plant[down=true,east=true,north:false,south=true,up:false,west=false]',
        'minecraft:chorus_plant[down=true,east=true,north:false,south=true,up:false,west=true]',
        'minecraft:chorus_plant[down=true,east=true,north:false,south=true,up:true,west=false]',
        'minecraft:chorus_plant[down=true,east=true,north:false,south=true,up:true,west=true]',
        'minecraft:chorus_plant[down=true,east=true,north:true,south=false,up:false,west=false]',
        'minecraft:chorus_plant[down=true,east=true,north:true,south=false,up:false,west=true]',
        'minecraft:chorus_plant[down=true,east=true,north:true,south=false,up:true,west=false]',
        'minecraft:chorus_plant[down=true,east=true,north:true,south=false,up:true,west=true]',
        'minecraft:chorus_plant[down=true,east=true,north:true,south=true,up:false,west=false]',
        'minecraft:chorus_plant[down=true,east=true,north:true,south=true,up:false,west=true]',
        'minecraft:chorus_plant[down=true,east=true,north:true,south=true,up:true,west=false]',
        'minecraft:chorus_plant[down=true,east=true,north:true,south=true,up:true,west=true]'
    ],
    ['minecraft:chorus_flower[age=0]', 'minecraft:chorus_flower[age=0]'],
    ['minecraft:chorus_flower[age=1]', 'minecraft:chorus_flower[age=1]'],
    ['minecraft:chorus_flower[age=2]', 'minecraft:chorus_flower[age=2]'],
    ['minecraft:chorus_flower[age=3]', 'minecraft:chorus_flower[age=3]'],
    ['minecraft:chorus_flower[age=4]', 'minecraft:chorus_flower[age=4]'],
    ['minecraft:chorus_flower[age=5]', 'minecraft:chorus_flower[age=5]'],
    ['minecraft:purpur_block', 'minecraft:purpur_block'],
    ['minecraft:purpur_pillar[axis=y]', 'minecraft:purpur_pillar[axis=y]'],
    ['minecraft:purpur_pillar[axis=x]', 'minecraft:purpur_pillar[axis=x]'],
    ['minecraft:purpur_pillar[axis=z]', 'minecraft:purpur_pillar[axis=z]'],
    [
        'minecraft:purpur_stairs[facing=east,half=bottom,shape=straight]',
        'minecraft:purpur_stairs[facing=east,half=bottom,shape=inner_left]',
        'minecraft:purpur_stairs[facing=east,half=bottom,shape=inner_right]',
        'minecraft:purpur_stairs[facing=east,half=bottom,shape=outer_left]',
        'minecraft:purpur_stairs[facing=east,half=bottom,shape=outer_right]',
        'minecraft:purpur_stairs[facing=east,half=bottom,shape=straight]'
    ],
    [
        'minecraft:purpur_stairs[facing=west,half=bottom,shape=straight]',
        'minecraft:purpur_stairs[facing=west,half=bottom,shape=inner_left]',
        'minecraft:purpur_stairs[facing=west,half=bottom,shape=inner_right]',
        'minecraft:purpur_stairs[facing=west,half=bottom,shape=outer_left]',
        'minecraft:purpur_stairs[facing=west,half=bottom,shape=outer_right]',
        'minecraft:purpur_stairs[facing=west,half=bottom,shape=straight]'
    ],
    [
        'minecraft:purpur_stairs[facing=south,half=bottom,shape=straight]',
        'minecraft:purpur_stairs[facing=south,half=bottom,shape=inner_left]',
        'minecraft:purpur_stairs[facing=south,half=bottom,shape=inner_right]',
        'minecraft:purpur_stairs[facing=south,half=bottom,shape=outer_left]',
        'minecraft:purpur_stairs[facing=south,half=bottom,shape=outer_right]',
        'minecraft:purpur_stairs[facing=south,half=bottom,shape=straight]'
    ],
    [
        'minecraft:purpur_stairs[facing=north,half=bottom,shape=straight]',
        'minecraft:purpur_stairs[facing=north,half=bottom,shape=inner_left]',
        'minecraft:purpur_stairs[facing=north,half=bottom,shape=inner_right]',
        'minecraft:purpur_stairs[facing=north,half=bottom,shape=outer_left]',
        'minecraft:purpur_stairs[facing=north,half=bottom,shape=outer_right]',
        'minecraft:purpur_stairs[facing=north,half=bottom,shape=straight]'
    ],
    [
        'minecraft:purpur_stairs[facing=east,half=top,shape=straight]',
        'minecraft:purpur_stairs[facing=east,half=top,shape=inner_left]',
        'minecraft:purpur_stairs[facing=east,half=top,shape=inner_right]',
        'minecraft:purpur_stairs[facing=east,half=top,shape=outer_left]',
        'minecraft:purpur_stairs[facing=east,half=top,shape=outer_right]',
        'minecraft:purpur_stairs[facing=east,half=top,shape=straight]'
    ],
    [
        'minecraft:purpur_stairs[facing=west,half=top,shape=straight]',
        'minecraft:purpur_stairs[facing=west,half=top,shape=inner_left]',
        'minecraft:purpur_stairs[facing=west,half=top,shape=inner_right]',
        'minecraft:purpur_stairs[facing=west,half=top,shape=outer_left]',
        'minecraft:purpur_stairs[facing=west,half=top,shape=outer_right]',
        'minecraft:purpur_stairs[facing=west,half=top,shape=straight]'
    ],
    [
        'minecraft:purpur_stairs[facing=south,half=top,shape=straight]',
        'minecraft:purpur_stairs[facing=south,half=top,shape=inner_left]',
        'minecraft:purpur_stairs[facing=south,half=top,shape=inner_right]',
        'minecraft:purpur_stairs[facing=south,half=top,shape=outer_left]',
        'minecraft:purpur_stairs[facing=south,half=top,shape=outer_right]',
        'minecraft:purpur_stairs[facing=south,half=top,shape=straight]'
    ],
    [
        'minecraft:purpur_stairs[facing=north,half=top,shape=straight]',
        'minecraft:purpur_stairs[facing=north,half=top,shape=inner_left]',
        'minecraft:purpur_stairs[facing=north,half=top,shape=inner_right]',
        'minecraft:purpur_stairs[facing=north,half=top,shape=outer_left]',
        'minecraft:purpur_stairs[facing=north,half=top,shape=outer_right]',
        'minecraft:purpur_stairs[facing=north,half=top,shape=straight]'
    ],
    ['minecraft:purpur_slab[type=double]', 'minecraft:purpur_double_slab[variant=default]'],
    ['minecraft:purpur_slab[type=bottom]', 'minecraft:purpur_slab[half=bottom,variant=default]'],
    ['minecraft:purpur_slab[type=top]', 'minecraft:purpur_slab[half=top,variant=default]'],
    ['minecraft:end_stone_bricks', 'minecraft:end_bricks'],
    ['minecraft:beetroots[age=0]', 'minecraft:beetroots[age=0]'],
    ['minecraft:beetroots[age=1]', 'minecraft:beetroots[age=1]'],
    ['minecraft:beetroots[age=2]', 'minecraft:beetroots[age=2]'],
    ['minecraft:beetroots[age=3]', 'minecraft:beetroots[age=3]'],
    ['minecraft:grass_path', 'minecraft:grass_path'],
    ['minecraft:end_gateway', 'minecraft:end_gateway'],
    [
        'minecraft:repeating_command_block[conditional=false,facing=down]',
        'minecraft:repeating_command_block[conditional=false,facing=down]'
    ],
    [
        'minecraft:repeating_command_block[conditional=false,facing=up]',
        'minecraft:repeating_command_block[conditional=false,facing=up]'
    ],
    [
        'minecraft:repeating_command_block[conditional=false,facing=north]',
        'minecraft:repeating_command_block[conditional=false,facing=north]'
    ],
    [
        'minecraft:repeating_command_block[conditional=false,facing=south]',
        'minecraft:repeating_command_block[conditional=false,facing=south]'
    ],
    [
        'minecraft:repeating_command_block[conditional=false,facing=west]',
        'minecraft:repeating_command_block[conditional=false,facing=west]'
    ],
    [
        'minecraft:repeating_command_block[conditional=false,facing=east]',
        'minecraft:repeating_command_block[conditional=false,facing=east]'
    ],
    [
        'minecraft:repeating_command_block[conditional=true,facing=down]',
        'minecraft:repeating_command_block[conditional=true,facing=down]'
    ],
    [
        'minecraft:repeating_command_block[conditional=true,facing=up]',
        'minecraft:repeating_command_block[conditional=true,facing=up]'
    ],
    [
        'minecraft:repeating_command_block[conditional=true,facing=north]',
        'minecraft:repeating_command_block[conditional=true,facing=north]'
    ],
    [
        'minecraft:repeating_command_block[conditional=true,facing=south]',
        'minecraft:repeating_command_block[conditional=true,facing=south]'
    ],
    [
        'minecraft:repeating_command_block[conditional=true,facing=west]',
        'minecraft:repeating_command_block[conditional=true,facing=west]'
    ],
    [
        'minecraft:repeating_command_block[conditional=true,facing=east]',
        'minecraft:repeating_command_block[conditional=true,facing=east]'
    ],
    [
        'minecraft:chain_command_block[conditional=false,facing=down]',
        'minecraft:chain_command_block[conditional=false,facing=down]'
    ],
    [
        'minecraft:chain_command_block[conditional=false,facing=up]',
        'minecraft:chain_command_block[conditional=false,facing=up]'
    ],
    [
        'minecraft:chain_command_block[conditional=false,facing=north]',
        'minecraft:chain_command_block[conditional=false,facing=north]'
    ],
    [
        'minecraft:chain_command_block[conditional=false,facing=south]',
        'minecraft:chain_command_block[conditional=false,facing=south]'
    ],
    [
        'minecraft:chain_command_block[conditional=false,facing=west]',
        'minecraft:chain_command_block[conditional=false,facing=west]'
    ],
    [
        'minecraft:chain_command_block[conditional=false,facing=east]',
        'minecraft:chain_command_block[conditional=false,facing=east]'
    ],
    [
        'minecraft:chain_command_block[conditional=true,facing=down]',
        'minecraft:chain_command_block[conditional=true,facing=down]'
    ],
    [
        'minecraft:chain_command_block[conditional=true,facing=up]',
        'minecraft:chain_command_block[conditional=true,facing=up]'
    ],
    [
        'minecraft:chain_command_block[conditional=true,facing=north]',
        'minecraft:chain_command_block[conditional=true,facing=north]'
    ],
    [
        'minecraft:chain_command_block[conditional=true,facing=south]',
        'minecraft:chain_command_block[conditional=true,facing=south]'
    ],
    [
        'minecraft:chain_command_block[conditional=true,facing=west]',
        'minecraft:chain_command_block[conditional=true,facing=west]'
    ],
    [
        'minecraft:chain_command_block[conditional=true,facing=east]',
        'minecraft:chain_command_block[conditional=true,facing=east]'
    ],
    ['minecraft:frosted_ice[age=0]', 'minecraft:frosted_ice[age=0]'],
    ['minecraft:frosted_ice[age=1]', 'minecraft:frosted_ice[age=1]'],
    ['minecraft:frosted_ice[age=2]', 'minecraft:frosted_ice[age=2]'],
    ['minecraft:frosted_ice[age=3]', 'minecraft:frosted_ice[age=3]'],
    ['minecraft:magma_block', 'minecraft:magma'],
    ['minecraft:nether_wart_block', 'minecraft:nether_wart_block'],
    ['minecraft:red_nether_bricks', 'minecraft:red_nether_brick'],
    ['minecraft:bone_block[axis=y]', 'minecraft:bone_block[axis=y]'],
    ['minecraft:bone_block[axis=x]', 'minecraft:bone_block[axis=x]'],
    ['minecraft:bone_block[axis=z]', 'minecraft:bone_block[axis=z]'],
    ['minecraft:structure_void', 'minecraft:structure_void'],
    ['minecraft:observer[facing=down,powered=false]', 'minecraft:observer[facing=down,powered=false]'],
    ['minecraft:observer[facing=up,powered=false]', 'minecraft:observer[facing=up,powered=false]'],
    ['minecraft:observer[facing=north,powered=false]', 'minecraft:observer[facing=north,powered=false]'],
    ['minecraft:observer[facing=south,powered=false]', 'minecraft:observer[facing=south,powered=false]'],
    ['minecraft:observer[facing=west,powered=false]', 'minecraft:observer[facing=west,powered=false]'],
    ['minecraft:observer[facing=east,powered=false]', 'minecraft:observer[facing=east,powered=false]'],
    ['minecraft:observer[facing=down,powered=true]', 'minecraft:observer[facing=down,powered=true]'],
    ['minecraft:observer[facing=up,powered=true]', 'minecraft:observer[facing=up,powered=true]'],
    ['minecraft:observer[facing=north,powered=true]', 'minecraft:observer[facing=north,powered=true]'],
    ['minecraft:observer[facing=south,powered=true]', 'minecraft:observer[facing=south,powered=true]'],
    ['minecraft:observer[facing=west,powered=true]', 'minecraft:observer[facing=west,powered=true]'],
    ['minecraft:observer[facing=east,powered=true]', 'minecraft:observer[facing=east,powered=true]'],
    ['minecraft:white_shulker_box[facing=down]', 'minecraft:white_shulker_box[facing=down]'],
    ['minecraft:white_shulker_box[facing=up]', 'minecraft:white_shulker_box[facing=up]'],
    ['minecraft:white_shulker_box[facing=north]', 'minecraft:white_shulker_box[facing=north]'],
    ['minecraft:white_shulker_box[facing=south]', 'minecraft:white_shulker_box[facing=south]'],
    ['minecraft:white_shulker_box[facing=west]', 'minecraft:white_shulker_box[facing=west]'],
    ['minecraft:white_shulker_box[facing=east]', 'minecraft:white_shulker_box[facing=east]'],
    ['minecraft:orange_shulker_box[facing=down]', 'minecraft:orange_shulker_box[facing=down]'],
    ['minecraft:orange_shulker_box[facing=up]', 'minecraft:orange_shulker_box[facing=up]'],
    ['minecraft:orange_shulker_box[facing=north]', 'minecraft:orange_shulker_box[facing=north]'],
    ['minecraft:orange_shulker_box[facing=south]', 'minecraft:orange_shulker_box[facing=south]'],
    ['minecraft:orange_shulker_box[facing=west]', 'minecraft:orange_shulker_box[facing=west]'],
    ['minecraft:orange_shulker_box[facing=east]', 'minecraft:orange_shulker_box[facing=east]'],
    ['minecraft:magenta_shulker_box[facing=down]', 'minecraft:magenta_shulker_box[facing=down]'],
    ['minecraft:magenta_shulker_box[facing=up]', 'minecraft:magenta_shulker_box[facing=up]'],
    ['minecraft:magenta_shulker_box[facing=north]', 'minecraft:magenta_shulker_box[facing=north]'],
    ['minecraft:magenta_shulker_box[facing=south]', 'minecraft:magenta_shulker_box[facing=south]'],
    ['minecraft:magenta_shulker_box[facing=west]', 'minecraft:magenta_shulker_box[facing=west]'],
    ['minecraft:magenta_shulker_box[facing=east]', 'minecraft:magenta_shulker_box[facing=east]'],
    ['minecraft:light_blue_shulker_box[facing=down]', 'minecraft:light_blue_shulker_box[facing=down]'],
    ['minecraft:light_blue_shulker_box[facing=up]', 'minecraft:light_blue_shulker_box[facing=up]'],
    ['minecraft:light_blue_shulker_box[facing=north]', 'minecraft:light_blue_shulker_box[facing=north]'],
    ['minecraft:light_blue_shulker_box[facing=south]', 'minecraft:light_blue_shulker_box[facing=south]'],
    ['minecraft:light_blue_shulker_box[facing=west]', 'minecraft:light_blue_shulker_box[facing=west]'],
    ['minecraft:light_blue_shulker_box[facing=east]', 'minecraft:light_blue_shulker_box[facing=east]'],
    ['minecraft:yellow_shulker_box[facing=down]', 'minecraft:yellow_shulker_box[facing=down]'],
    ['minecraft:yellow_shulker_box[facing=up]', 'minecraft:yellow_shulker_box[facing=up]'],
    ['minecraft:yellow_shulker_box[facing=north]', 'minecraft:yellow_shulker_box[facing=north]'],
    ['minecraft:yellow_shulker_box[facing=south]', 'minecraft:yellow_shulker_box[facing=south]'],
    ['minecraft:yellow_shulker_box[facing=west]', 'minecraft:yellow_shulker_box[facing=west]'],
    ['minecraft:yellow_shulker_box[facing=east]', 'minecraft:yellow_shulker_box[facing=east]'],
    ['minecraft:lime_shulker_box[facing=down]', 'minecraft:lime_shulker_box[facing=down]'],
    ['minecraft:lime_shulker_box[facing=up]', 'minecraft:lime_shulker_box[facing=up]'],
    ['minecraft:lime_shulker_box[facing=north]', 'minecraft:lime_shulker_box[facing=north]'],
    ['minecraft:lime_shulker_box[facing=south]', 'minecraft:lime_shulker_box[facing=south]'],
    ['minecraft:lime_shulker_box[facing=west]', 'minecraft:lime_shulker_box[facing=west]'],
    ['minecraft:lime_shulker_box[facing=east]', 'minecraft:lime_shulker_box[facing=east]'],
    ['minecraft:pink_shulker_box[facing=down]', 'minecraft:pink_shulker_box[facing=down]'],
    ['minecraft:pink_shulker_box[facing=up]', 'minecraft:pink_shulker_box[facing=up]'],
    ['minecraft:pink_shulker_box[facing=north]', 'minecraft:pink_shulker_box[facing=north]'],
    ['minecraft:pink_shulker_box[facing=south]', 'minecraft:pink_shulker_box[facing=south]'],
    ['minecraft:pink_shulker_box[facing=west]', 'minecraft:pink_shulker_box[facing=west]'],
    ['minecraft:pink_shulker_box[facing=east]', 'minecraft:pink_shulker_box[facing=east]'],
    ['minecraft:gray_shulker_box[facing=down]', 'minecraft:gray_shulker_box[facing=down]'],
    ['minecraft:gray_shulker_box[facing=up]', 'minecraft:gray_shulker_box[facing=up]'],
    ['minecraft:gray_shulker_box[facing=north]', 'minecraft:gray_shulker_box[facing=north]'],
    ['minecraft:gray_shulker_box[facing=south]', 'minecraft:gray_shulker_box[facing=south]'],
    ['minecraft:gray_shulker_box[facing=west]', 'minecraft:gray_shulker_box[facing=west]'],
    ['minecraft:gray_shulker_box[facing=east]', 'minecraft:gray_shulker_box[facing=east]'],
    ['minecraft:light_gray_shulker_box[facing=down]', 'minecraft:silver_shulker_box[facing=down]'],
    ['minecraft:light_gray_shulker_box[facing=up]', 'minecraft:silver_shulker_box[facing=up]'],
    ['minecraft:light_gray_shulker_box[facing=north]', 'minecraft:silver_shulker_box[facing=north]'],
    ['minecraft:light_gray_shulker_box[facing=south]', 'minecraft:silver_shulker_box[facing=south]'],
    ['minecraft:light_gray_shulker_box[facing=west]', 'minecraft:silver_shulker_box[facing=west]'],
    ['minecraft:light_gray_shulker_box[facing=east]', 'minecraft:silver_shulker_box[facing=east]'],
    ['minecraft:cyan_shulker_box[facing=down]', 'minecraft:cyan_shulker_box[facing=down]'],
    ['minecraft:cyan_shulker_box[facing=up]', 'minecraft:cyan_shulker_box[facing=up]'],
    ['minecraft:cyan_shulker_box[facing=north]', 'minecraft:cyan_shulker_box[facing=north]'],
    ['minecraft:cyan_shulker_box[facing=south]', 'minecraft:cyan_shulker_box[facing=south]'],
    ['minecraft:cyan_shulker_box[facing=west]', 'minecraft:cyan_shulker_box[facing=west]'],
    ['minecraft:cyan_shulker_box[facing=east]', 'minecraft:cyan_shulker_box[facing=east]'],
    ['minecraft:purple_shulker_box[facing=down]', 'minecraft:purple_shulker_box[facing=down]'],
    ['minecraft:purple_shulker_box[facing=up]', 'minecraft:purple_shulker_box[facing=up]'],
    ['minecraft:purple_shulker_box[facing=north]', 'minecraft:purple_shulker_box[facing=north]'],
    ['minecraft:purple_shulker_box[facing=south]', 'minecraft:purple_shulker_box[facing=south]'],
    ['minecraft:purple_shulker_box[facing=west]', 'minecraft:purple_shulker_box[facing=west]'],
    ['minecraft:purple_shulker_box[facing=east]', 'minecraft:purple_shulker_box[facing=east]'],
    ['minecraft:blue_shulker_box[facing=down]', 'minecraft:blue_shulker_box[facing=down]'],
    ['minecraft:blue_shulker_box[facing=up]', 'minecraft:blue_shulker_box[facing=up]'],
    ['minecraft:blue_shulker_box[facing=north]', 'minecraft:blue_shulker_box[facing=north]'],
    ['minecraft:blue_shulker_box[facing=south]', 'minecraft:blue_shulker_box[facing=south]'],
    ['minecraft:blue_shulker_box[facing=west]', 'minecraft:blue_shulker_box[facing=west]'],
    ['minecraft:blue_shulker_box[facing=east]', 'minecraft:blue_shulker_box[facing=east]'],
    ['minecraft:brown_shulker_box[facing=down]', 'minecraft:brown_shulker_box[facing=down]'],
    ['minecraft:brown_shulker_box[facing=up]', 'minecraft:brown_shulker_box[facing=up]'],
    ['minecraft:brown_shulker_box[facing=north]', 'minecraft:brown_shulker_box[facing=north]'],
    ['minecraft:brown_shulker_box[facing=south]', 'minecraft:brown_shulker_box[facing=south]'],
    ['minecraft:brown_shulker_box[facing=west]', 'minecraft:brown_shulker_box[facing=west]'],
    ['minecraft:brown_shulker_box[facing=east]', 'minecraft:brown_shulker_box[facing=east]'],
    ['minecraft:green_shulker_box[facing=down]', 'minecraft:green_shulker_box[facing=down]'],
    ['minecraft:green_shulker_box[facing=up]', 'minecraft:green_shulker_box[facing=up]'],
    ['minecraft:green_shulker_box[facing=north]', 'minecraft:green_shulker_box[facing=north]'],
    ['minecraft:green_shulker_box[facing=south]', 'minecraft:green_shulker_box[facing=south]'],
    ['minecraft:green_shulker_box[facing=west]', 'minecraft:green_shulker_box[facing=west]'],
    ['minecraft:green_shulker_box[facing=east]', 'minecraft:green_shulker_box[facing=east]'],
    ['minecraft:red_shulker_box[facing=down]', 'minecraft:red_shulker_box[facing=down]'],
    ['minecraft:red_shulker_box[facing=up]', 'minecraft:red_shulker_box[facing=up]'],
    ['minecraft:red_shulker_box[facing=north]', 'minecraft:red_shulker_box[facing=north]'],
    ['minecraft:red_shulker_box[facing=south]', 'minecraft:red_shulker_box[facing=south]'],
    ['minecraft:red_shulker_box[facing=west]', 'minecraft:red_shulker_box[facing=west]'],
    ['minecraft:red_shulker_box[facing=east]', 'minecraft:red_shulker_box[facing=east]'],
    ['minecraft:black_shulker_box[facing=down]', 'minecraft:black_shulker_box[facing=down]'],
    ['minecraft:black_shulker_box[facing=up]', 'minecraft:black_shulker_box[facing=up]'],
    ['minecraft:black_shulker_box[facing=north]', 'minecraft:black_shulker_box[facing=north]'],
    ['minecraft:black_shulker_box[facing=south]', 'minecraft:black_shulker_box[facing=south]'],
    ['minecraft:black_shulker_box[facing=west]', 'minecraft:black_shulker_box[facing=west]'],
    ['minecraft:black_shulker_box[facing=east]', 'minecraft:black_shulker_box[facing=east]'],
    ['minecraft:white_glazed_terracotta[facing=south]', 'minecraft:white_glazed_terracotta[facing=south]'],
    ['minecraft:white_glazed_terracotta[facing=west]', 'minecraft:white_glazed_terracotta[facing=west]'],
    ['minecraft:white_glazed_terracotta[facing=north]', 'minecraft:white_glazed_terracotta[facing=north]'],
    ['minecraft:white_glazed_terracotta[facing=east]', 'minecraft:white_glazed_terracotta[facing=east]'],
    ['minecraft:orange_glazed_terracotta[facing=south]', 'minecraft:orange_glazed_terracotta[facing=south]'],
    ['minecraft:orange_glazed_terracotta[facing=west]', 'minecraft:orange_glazed_terracotta[facing=west]'],
    ['minecraft:orange_glazed_terracotta[facing=north]', 'minecraft:orange_glazed_terracotta[facing=north]'],
    ['minecraft:orange_glazed_terracotta[facing=east]', 'minecraft:orange_glazed_terracotta[facing=east]'],
    ['minecraft:magenta_glazed_terracotta[facing=south]', 'minecraft:magenta_glazed_terracotta[facing=south]'],
    ['minecraft:magenta_glazed_terracotta[facing=west]', 'minecraft:magenta_glazed_terracotta[facing=west]'],
    ['minecraft:magenta_glazed_terracotta[facing=north]', 'minecraft:magenta_glazed_terracotta[facing=north]'],
    ['minecraft:magenta_glazed_terracotta[facing=east]', 'minecraft:magenta_glazed_terracotta[facing=east]'],
    [
        'minecraft:light_blue_glazed_terracotta[facing=south]',
        'minecraft:light_blue_glazed_terracotta[facing=south]'
    ],
    ['minecraft:light_blue_glazed_terracotta[facing=west]', 'minecraft:light_blue_glazed_terracotta[facing=west]'],
    [
        'minecraft:light_blue_glazed_terracotta[facing=north]',
        'minecraft:light_blue_glazed_terracotta[facing=north]'
    ],
    ['minecraft:light_blue_glazed_terracotta[facing=east]', 'minecraft:light_blue_glazed_terracotta[facing=east]'],
    ['minecraft:yellow_glazed_terracotta[facing=south]', 'minecraft:yellow_glazed_terracotta[facing=south]'],
    ['minecraft:yellow_glazed_terracotta[facing=west]', 'minecraft:yellow_glazed_terracotta[facing=west]'],
    ['minecraft:yellow_glazed_terracotta[facing=north]', 'minecraft:yellow_glazed_terracotta[facing=north]'],
    ['minecraft:yellow_glazed_terracotta[facing=east]', 'minecraft:yellow_glazed_terracotta[facing=east]'],
    ['minecraft:lime_glazed_terracotta[facing=south]', 'minecraft:lime_glazed_terracotta[facing=south]'],
    ['minecraft:lime_glazed_terracotta[facing=west]', 'minecraft:lime_glazed_terracotta[facing=west]'],
    ['minecraft:lime_glazed_terracotta[facing=north]', 'minecraft:lime_glazed_terracotta[facing=north]'],
    ['minecraft:lime_glazed_terracotta[facing=east]', 'minecraft:lime_glazed_terracotta[facing=east]'],
    ['minecraft:pink_glazed_terracotta[facing=south]', 'minecraft:pink_glazed_terracotta[facing=south]'],
    ['minecraft:pink_glazed_terracotta[facing=west]', 'minecraft:pink_glazed_terracotta[facing=west]'],
    ['minecraft:pink_glazed_terracotta[facing=north]', 'minecraft:pink_glazed_terracotta[facing=north]'],
    ['minecraft:pink_glazed_terracotta[facing=east]', 'minecraft:pink_glazed_terracotta[facing=east]'],
    ['minecraft:gray_glazed_terracotta[facing=south]', 'minecraft:gray_glazed_terracotta[facing=south]'],
    ['minecraft:gray_glazed_terracotta[facing=west]', 'minecraft:gray_glazed_terracotta[facing=west]'],
    ['minecraft:gray_glazed_terracotta[facing=north]', 'minecraft:gray_glazed_terracotta[facing=north]'],
    ['minecraft:gray_glazed_terracotta[facing=east]', 'minecraft:gray_glazed_terracotta[facing=east]'],
    ['minecraft:light_gray_glazed_terracotta[facing=south]', 'minecraft:silver_glazed_terracotta[facing=south]'],
    ['minecraft:light_gray_glazed_terracotta[facing=west]', 'minecraft:silver_glazed_terracotta[facing=west]'],
    ['minecraft:light_gray_glazed_terracotta[facing=north]', 'minecraft:silver_glazed_terracotta[facing=north]'],
    ['minecraft:light_gray_glazed_terracotta[facing=east]', 'minecraft:silver_glazed_terracotta[facing=east]'],
    ['minecraft:cyan_glazed_terracotta[facing=south]', 'minecraft:cyan_glazed_terracotta[facing=south]'],
    ['minecraft:cyan_glazed_terracotta[facing=west]', 'minecraft:cyan_glazed_terracotta[facing=west]'],
    ['minecraft:cyan_glazed_terracotta[facing=north]', 'minecraft:cyan_glazed_terracotta[facing=north]'],
    ['minecraft:cyan_glazed_terracotta[facing=east]', 'minecraft:cyan_glazed_terracotta[facing=east]'],
    ['minecraft:purple_glazed_terracotta[facing=south]', 'minecraft:purple_glazed_terracotta[facing=south]'],
    ['minecraft:purple_glazed_terracotta[facing=west]', 'minecraft:purple_glazed_terracotta[facing=west]'],
    ['minecraft:purple_glazed_terracotta[facing=north]', 'minecraft:purple_glazed_terracotta[facing=north]'],
    ['minecraft:purple_glazed_terracotta[facing=east]', 'minecraft:purple_glazed_terracotta[facing=east]'],
    ['minecraft:blue_glazed_terracotta[facing=south]', 'minecraft:blue_glazed_terracotta[facing=south]'],
    ['minecraft:blue_glazed_terracotta[facing=west]', 'minecraft:blue_glazed_terracotta[facing=west]'],
    ['minecraft:blue_glazed_terracotta[facing=north]', 'minecraft:blue_glazed_terracotta[facing=north]'],
    ['minecraft:blue_glazed_terracotta[facing=east]', 'minecraft:blue_glazed_terracotta[facing=east]'],
    ['minecraft:brown_glazed_terracotta[facing=south]', 'minecraft:brown_glazed_terracotta[facing=south]'],
    ['minecraft:brown_glazed_terracotta[facing=west]', 'minecraft:brown_glazed_terracotta[facing=west]'],
    ['minecraft:brown_glazed_terracotta[facing=north]', 'minecraft:brown_glazed_terracotta[facing=north]'],
    ['minecraft:brown_glazed_terracotta[facing=east]', 'minecraft:brown_glazed_terracotta[facing=east]'],
    ['minecraft:green_glazed_terracotta[facing=south]', 'minecraft:green_glazed_terracotta[facing=south]'],
    ['minecraft:green_glazed_terracotta[facing=west]', 'minecraft:green_glazed_terracotta[facing=west]'],
    ['minecraft:green_glazed_terracotta[facing=north]', 'minecraft:green_glazed_terracotta[facing=north]'],
    ['minecraft:green_glazed_terracotta[facing=east]', 'minecraft:green_glazed_terracotta[facing=east]'],
    ['minecraft:red_glazed_terracotta[facing=south]', 'minecraft:red_glazed_terracotta[facing=south]'],
    ['minecraft:red_glazed_terracotta[facing=west]', 'minecraft:red_glazed_terracotta[facing=west]'],
    ['minecraft:red_glazed_terracotta[facing=north]', 'minecraft:red_glazed_terracotta[facing=north]'],
    ['minecraft:red_glazed_terracotta[facing=east]', 'minecraft:red_glazed_terracotta[facing=east]'],
    ['minecraft:black_glazed_terracotta[facing=south]', 'minecraft:black_glazed_terracotta[facing=south]'],
    ['minecraft:black_glazed_terracotta[facing=west]', 'minecraft:black_glazed_terracotta[facing=west]'],
    ['minecraft:black_glazed_terracotta[facing=north]', 'minecraft:black_glazed_terracotta[facing=north]'],
    ['minecraft:black_glazed_terracotta[facing=east]', 'minecraft:black_glazed_terracotta[facing=east]'],
    ['minecraft:white_concrete', 'minecraft:concrete[color=white]'],
    ['minecraft:orange_concrete', 'minecraft:concrete[color=orange]'],
    ['minecraft:magenta_concrete', 'minecraft:concrete[color=magenta]'],
    ['minecraft:light_blue_concrete', 'minecraft:concrete[color=light_blue]'],
    ['minecraft:yellow_concrete', 'minecraft:concrete[color=yellow]'],
    ['minecraft:lime_concrete', 'minecraft:concrete[color=lime]'],
    ['minecraft:pink_concrete', 'minecraft:concrete[color=pink]'],
    ['minecraft:gray_concrete', 'minecraft:concrete[color=gray]'],
    ['minecraft:light_gray_concrete', 'minecraft:concrete[color=silver]'],
    ['minecraft:cyan_concrete', 'minecraft:concrete[color=cyan]'],
    ['minecraft:purple_concrete', 'minecraft:concrete[color=purple]'],
    ['minecraft:blue_concrete', 'minecraft:concrete[color=blue]'],
    ['minecraft:brown_concrete', 'minecraft:concrete[color=brown]'],
    ['minecraft:green_concrete', 'minecraft:concrete[color=green]'],
    ['minecraft:red_concrete', 'minecraft:concrete[color=red]'],
    ['minecraft:black_concrete', 'minecraft:concrete[color=black]'],
    ['minecraft:white_concrete_powder', 'minecraft:concrete_powder[color=white]'],
    ['minecraft:orange_concrete_powder', 'minecraft:concrete_powder[color=orange]'],
    ['minecraft:magenta_concrete_powder', 'minecraft:concrete_powder[color=magenta]'],
    ['minecraft:light_blue_concrete_powder', 'minecraft:concrete_powder[color=light_blue]'],
    ['minecraft:yellow_concrete_powder', 'minecraft:concrete_powder[color=yellow]'],
    ['minecraft:lime_concrete_powder', 'minecraft:concrete_powder[color=lime]'],
    ['minecraft:pink_concrete_powder', 'minecraft:concrete_powder[color=pink]'],
    ['minecraft:gray_concrete_powder', 'minecraft:concrete_powder[color=gray]'],
    ['minecraft:light_gray_concrete_powder', 'minecraft:concrete_powder[color=silver]'],
    ['minecraft:cyan_concrete_powder', 'minecraft:concrete_powder[color=cyan]'],
    ['minecraft:purple_concrete_powder', 'minecraft:concrete_powder[color=purple]'],
    ['minecraft:blue_concrete_powder', 'minecraft:concrete_powder[color=blue]'],
    ['minecraft:brown_concrete_powder', 'minecraft:concrete_powder[color=brown]'],
    ['minecraft:green_concrete_powder', 'minecraft:concrete_powder[color=green]'],
    ['minecraft:red_concrete_powder', 'minecraft:concrete_powder[color=red]'],
    ['minecraft:black_concrete_powder', 'minecraft:concrete_powder[color=black]'],
    ['minecraft:structure_block[mode=save]', 'minecraft:structure_block[mode=save]'],
    ['minecraft:structure_block[mode=load]', 'minecraft:structure_block[mode=load]'],
    ['minecraft:structure_block[mode=corner]', 'minecraft:structure_block[mode=corner]'],
    ['minecraft:structure_block[mode=data]', 'minecraft:structure_block[mode=data]']
];
Blocks.NumericID_Metadata_NominalID = [
    [0, 0, 'minecraft:air'],
    [1, 0, 'minecraft:stone[variant=stone]'],
    [1, 1, 'minecraft:stone[variant=granite]'],
    [1, 2, 'minecraft:stone[variant=smooth_granite]'],
    [1, 3, 'minecraft:stone[variant=diorite]'],
    [1, 4, 'minecraft:stone[variant=smooth_diorite]'],
    [1, 5, 'minecraft:stone[variant=andesite]'],
    [1, 6, 'minecraft:stone[variant=smooth_andesite]'],
    [2, 0, 'minecraft:grass[snowy=false]'],
    [3, 0, 'minecraft:dirt[snowy=false,variant=dirt]'],
    [3, 1, 'minecraft:dirt[snowy=false,variant=coarse_dirt]'],
    [3, 2, 'minecraft:dirt[snowy=false,variant=podzol]'],
    [4, 0, 'minecraft:cobblestone'],
    [5, 0, 'minecraft:planks[variant=oak]'],
    [5, 1, 'minecraft:planks[variant=spruce]'],
    [5, 2, 'minecraft:planks[variant=birch]'],
    [5, 3, 'minecraft:planks[variant=jungle]'],
    [5, 4, 'minecraft:planks[variant=acacia]'],
    [5, 5, 'minecraft:planks[variant=dark_oak]'],
    [6, 0, 'minecraft:sapling[stage=0,type=oak]'],
    [6, 1, 'minecraft:sapling[stage=0,type=spruce]'],
    [6, 2, 'minecraft:sapling[stage=0,type=birch]'],
    [6, 3, 'minecraft:sapling[stage=0,type=jungle]'],
    [6, 4, 'minecraft:sapling[stage=0,type=acacia]'],
    [6, 5, 'minecraft:sapling[stage=0,type=dark_oak]'],
    [6, 8, 'minecraft:sapling[stage=1,type=oak]'],
    [6, 9, 'minecraft:sapling[stage=1,type=spruce]'],
    [6, 10, 'minecraft:sapling[stage=1,type=birch]'],
    [6, 11, 'minecraft:sapling[stage=1,type=jungle]'],
    [6, 12, 'minecraft:sapling[stage=1,type=acacia]'],
    [6, 13, 'minecraft:sapling[stage=1,type=dark_oak]'],
    [7, 0, 'minecraft:bedrock'],
    [8, 0, 'minecraft:flowing_water[level=0]'],
    [8, 1, 'minecraft:flowing_water[level=1]'],
    [8, 2, 'minecraft:flowing_water[level=2]'],
    [8, 3, 'minecraft:flowing_water[level=3]'],
    [8, 4, 'minecraft:flowing_water[level=4]'],
    [8, 5, 'minecraft:flowing_water[level=5]'],
    [8, 6, 'minecraft:flowing_water[level=6]'],
    [8, 7, 'minecraft:flowing_water[level=7]'],
    [8, 8, 'minecraft:flowing_water[level=8]'],
    [8, 9, 'minecraft:flowing_water[level=9]'],
    [8, 10, 'minecraft:flowing_water[level=10]'],
    [8, 11, 'minecraft:flowing_water[level=11]'],
    [8, 12, 'minecraft:flowing_water[level=12]'],
    [8, 13, 'minecraft:flowing_water[level=13]'],
    [8, 14, 'minecraft:flowing_water[level=14]'],
    [8, 15, 'minecraft:flowing_water[level=15]'],
    [9, 0, 'minecraft:water[level=0]'],
    [9, 1, 'minecraft:water[level=1]'],
    [9, 2, 'minecraft:water[level=2]'],
    [9, 3, 'minecraft:water[level=3]'],
    [9, 4, 'minecraft:water[level=4]'],
    [9, 5, 'minecraft:water[level=5]'],
    [9, 6, 'minecraft:water[level=6]'],
    [9, 7, 'minecraft:water[level=7]'],
    [9, 8, 'minecraft:water[level=8]'],
    [9, 9, 'minecraft:water[level=9]'],
    [9, 10, 'minecraft:water[level=10]'],
    [9, 11, 'minecraft:water[level=11]'],
    [9, 12, 'minecraft:water[level=12]'],
    [9, 13, 'minecraft:water[level=13]'],
    [9, 14, 'minecraft:water[level=14]'],
    [9, 15, 'minecraft:water[level=15]'],
    [10, 0, 'minecraft:flowing_lava[level=0]'],
    [10, 1, 'minecraft:flowing_lava[level=1]'],
    [10, 2, 'minecraft:flowing_lava[level=2]'],
    [10, 3, 'minecraft:flowing_lava[level=3]'],
    [10, 4, 'minecraft:flowing_lava[level=4]'],
    [10, 5, 'minecraft:flowing_lava[level=5]'],
    [10, 6, 'minecraft:flowing_lava[level=6]'],
    [10, 7, 'minecraft:flowing_lava[level=7]'],
    [10, 8, 'minecraft:flowing_lava[level=8]'],
    [10, 9, 'minecraft:flowing_lava[level=9]'],
    [10, 10, 'minecraft:flowing_lava[level=10]'],
    [10, 11, 'minecraft:flowing_lava[level=11]'],
    [10, 12, 'minecraft:flowing_lava[level=12]'],
    [10, 13, 'minecraft:flowing_lava[level=13]'],
    [10, 14, 'minecraft:flowing_lava[level=14]'],
    [10, 15, 'minecraft:flowing_lava[level=15]'],
    [11, 0, 'minecraft:lava[level=0]'],
    [11, 1, 'minecraft:lava[level=1]'],
    [11, 2, 'minecraft:lava[level=2]'],
    [11, 3, 'minecraft:lava[level=3]'],
    [11, 4, 'minecraft:lava[level=4]'],
    [11, 5, 'minecraft:lava[level=5]'],
    [11, 6, 'minecraft:lava[level=6]'],
    [11, 7, 'minecraft:lava[level=7]'],
    [11, 8, 'minecraft:lava[level=8]'],
    [11, 9, 'minecraft:lava[level=9]'],
    [11, 10, 'minecraft:lava[level=10]'],
    [11, 11, 'minecraft:lava[level=11]'],
    [11, 12, 'minecraft:lava[level=12]'],
    [11, 13, 'minecraft:lava[level=13]'],
    [11, 14, 'minecraft:lava[level=14]'],
    [11, 15, 'minecraft:lava[level=15]'],
    [12, 0, 'minecraft:sand[variant=sand]'],
    [12, 1, 'minecraft:sand[variant=red_sand]'],
    [13, 0, 'minecraft:gravel'],
    [14, 0, 'minecraft:gold_ore'],
    [15, 0, 'minecraft:iron_ore'],
    [16, 0, 'minecraft:coal_ore'],
    [17, 0, 'minecraft:log[axis=y,variant=oak]'],
    [17, 1, 'minecraft:log[axis=y,variant=spruce]'],
    [17, 2, 'minecraft:log[axis=y,variant=birch]'],
    [17, 3, 'minecraft:log[axis=y,variant=jungle]'],
    [17, 4, 'minecraft:log[axis=x,variant=oak]'],
    [17, 5, 'minecraft:log[axis=x,variant=spruce]'],
    [17, 6, 'minecraft:log[axis=x,variant=birch]'],
    [17, 7, 'minecraft:log[axis=x,variant=jungle]'],
    [17, 8, 'minecraft:log[axis=z,variant=oak]'],
    [17, 9, 'minecraft:log[axis=z,variant=spruce]'],
    [17, 10, 'minecraft:log[axis=z,variant=birch]'],
    [17, 11, 'minecraft:log[axis=z,variant=jungle]'],
    [17, 12, 'minecraft:log[axis=none,variant=oak]'],
    [17, 13, 'minecraft:log[axis=none,variant=spruce]'],
    [17, 14, 'minecraft:log[axis=none,variant=birch]'],
    [17, 15, 'minecraft:log[axis=none,variant=jungle]'],
    [18, 0, 'minecraft:leaves[check_decay=false,decayable=true,variant=oak]'],
    [18, 1, 'minecraft:leaves[check_decay=false,decayable=true,variant=spruce]'],
    [18, 2, 'minecraft:leaves[check_decay=false,decayable=true,variant=birch]'],
    [18, 3, 'minecraft:leaves[check_decay=false,decayable=true,variant=jungle]'],
    [18, 4, 'minecraft:leaves[check_decay=false,decayable=false,variant=oak]'],
    [18, 5, 'minecraft:leaves[check_decay=false,decayable=false,variant=spruce]'],
    [18, 6, 'minecraft:leaves[check_decay=false,decayable=false,variant=birch]'],
    [18, 7, 'minecraft:leaves[check_decay=false,decayable=false,variant=jungle]'],
    [18, 8, 'minecraft:leaves[check_decay=true,decayable=true,variant=oak]'],
    [18, 9, 'minecraft:leaves[check_decay=true,decayable=true,variant=spruce]'],
    [18, 10, 'minecraft:leaves[check_decay=true,decayable=true,variant=birch]'],
    [18, 11, 'minecraft:leaves[check_decay=true,decayable=true,variant=jungle]'],
    [18, 12, 'minecraft:leaves[check_decay=true,decayable=false,variant=oak]'],
    [18, 13, 'minecraft:leaves[check_decay=true,decayable=false,variant=spruce]'],
    [18, 14, 'minecraft:leaves[check_decay=true,decayable=false,variant=birch]'],
    [18, 15, 'minecraft:leaves[check_decay=true,decayable=false,variant=jungle]'],
    [19, 0, 'minecraft:sponge[wet=false]'],
    [19, 1, 'minecraft:sponge[wet=true]'],
    [20, 0, 'minecraft:glass'],
    [21, 0, 'minecraft:lapis_ore'],
    [22, 0, 'minecraft:lapis_block'],
    [23, 0, 'minecraft:dispenser[facing=down,triggered=false]'],
    [23, 1, 'minecraft:dispenser[facing=up,triggered=false]'],
    [23, 2, 'minecraft:dispenser[facing=north,triggered=false]'],
    [23, 3, 'minecraft:dispenser[facing=south,triggered=false]'],
    [23, 4, 'minecraft:dispenser[facing=west,triggered=false]'],
    [23, 5, 'minecraft:dispenser[facing=east,triggered=false]'],
    [23, 8, 'minecraft:dispenser[facing=down,triggered=true]'],
    [23, 9, 'minecraft:dispenser[facing=up,triggered=true]'],
    [23, 10, 'minecraft:dispenser[facing=north,triggered=true]'],
    [23, 11, 'minecraft:dispenser[facing=south,triggered=true]'],
    [23, 12, 'minecraft:dispenser[facing=west,triggered=true]'],
    [23, 13, 'minecraft:dispenser[facing=east,triggered=true]'],
    [24, 0, 'minecraft:sandstone[type=sandstone]'],
    [24, 1, 'minecraft:sandstone[type=chiseled_sandstone]'],
    [24, 2, 'minecraft:sandstone[type=smooth_sandstone]'],
    [25, 0, 'minecraft:noteblock'],
    [26, 0, 'minecraft:bed[facing=south,occupied=false,part=foot]'],
    [26, 1, 'minecraft:bed[facing=west,occupied=false,part=foot]'],
    [26, 2, 'minecraft:bed[facing=north,occupied=false,part=foot]'],
    [26, 3, 'minecraft:bed[facing=east,occupied=false,part=foot]'],
    [26, 8, 'minecraft:bed[facing=south,occupied=false,part=head]'],
    [26, 9, 'minecraft:bed[facing=west,occupied=false,part=head]'],
    [26, 10, 'minecraft:bed[facing=north,occupied=false,part=head]'],
    [26, 11, 'minecraft:bed[facing=east,occupied=false,part=head]'],
    [26, 12, 'minecraft:bed[facing=south,occupied=true,part=head]'],
    [26, 13, 'minecraft:bed[facing=west,occupied=true,part=head]'],
    [26, 14, 'minecraft:bed[facing=north,occupied=true,part=head]'],
    [26, 15, 'minecraft:bed[facing=east,occupied=true,part=head]'],
    [27, 0, 'minecraft:golden_rail[powered=false,shape=north_south]'],
    [27, 1, 'minecraft:golden_rail[powered=false,shape=east_west]'],
    [27, 2, 'minecraft:golden_rail[powered=false,shape=ascending_east]'],
    [27, 3, 'minecraft:golden_rail[powered=false,shape=ascending_west]'],
    [27, 4, 'minecraft:golden_rail[powered=false,shape=ascending_north]'],
    [27, 5, 'minecraft:golden_rail[powered=false,shape=ascending_south]'],
    [27, 8, 'minecraft:golden_rail[powered=true,shape=north_south]'],
    [27, 9, 'minecraft:golden_rail[powered=true,shape=east_west]'],
    [27, 10, 'minecraft:golden_rail[powered=true,shape=ascending_east]'],
    [27, 11, 'minecraft:golden_rail[powered=true,shape=ascending_west]'],
    [27, 12, 'minecraft:golden_rail[powered=true,shape=ascending_north]'],
    [27, 13, 'minecraft:golden_rail[powered=true,shape=ascending_south]'],
    [28, 0, 'minecraft:detector_rail[powered=false,shape=north_south]'],
    [28, 1, 'minecraft:detector_rail[powered=false,shape=east_west]'],
    [28, 2, 'minecraft:detector_rail[powered=false,shape=ascending_east]'],
    [28, 3, 'minecraft:detector_rail[powered=false,shape=ascending_west]'],
    [28, 4, 'minecraft:detector_rail[powered=false,shape=ascending_north]'],
    [28, 5, 'minecraft:detector_rail[powered=false,shape=ascending_south]'],
    [28, 8, 'minecraft:detector_rail[powered=true,shape=north_south]'],
    [28, 9, 'minecraft:detector_rail[powered=true,shape=east_west]'],
    [28, 10, 'minecraft:detector_rail[powered=true,shape=ascending_east]'],
    [28, 11, 'minecraft:detector_rail[powered=true,shape=ascending_west]'],
    [28, 12, 'minecraft:detector_rail[powered=true,shape=ascending_north]'],
    [28, 13, 'minecraft:detector_rail[powered=true,shape=ascending_south]'],
    [29, 0, 'minecraft:sticky_piston[extended=false,facing=down]'],
    [29, 1, 'minecraft:sticky_piston[extended=false,facing=up]'],
    [29, 2, 'minecraft:sticky_piston[extended=false,facing=north]'],
    [29, 3, 'minecraft:sticky_piston[extended=false,facing=south]'],
    [29, 4, 'minecraft:sticky_piston[extended=false,facing=west]'],
    [29, 5, 'minecraft:sticky_piston[extended=false,facing=east]'],
    [29, 8, 'minecraft:sticky_piston[extended=true,facing=down]'],
    [29, 9, 'minecraft:sticky_piston[extended=true,facing=up]'],
    [29, 10, 'minecraft:sticky_piston[extended=true,facing=north]'],
    [29, 11, 'minecraft:sticky_piston[extended=true,facing=south]'],
    [29, 12, 'minecraft:sticky_piston[extended=true,facing=west]'],
    [29, 13, 'minecraft:sticky_piston[extended=true,facing=east]'],
    [30, 0, 'minecraft:web'],
    [31, 0, 'minecraft:tallgrass[type=dead_bush]'],
    [31, 1, 'minecraft:tallgrass[type=tall_grass]'],
    [31, 2, 'minecraft:tallgrass[type=fern]'],
    [32, 0, 'minecraft:deadbush'],
    [33, 0, 'minecraft:piston[extended=false,facing=down]'],
    [33, 1, 'minecraft:piston[extended=false,facing=up]'],
    [33, 2, 'minecraft:piston[extended=false,facing=north]'],
    [33, 3, 'minecraft:piston[extended=false,facing=south]'],
    [33, 4, 'minecraft:piston[extended=false,facing=west]'],
    [33, 5, 'minecraft:piston[extended=false,facing=east]'],
    [33, 8, 'minecraft:piston[extended=true,facing=down]'],
    [33, 9, 'minecraft:piston[extended=true,facing=up]'],
    [33, 10, 'minecraft:piston[extended=true,facing=north]'],
    [33, 11, 'minecraft:piston[extended=true,facing=south]'],
    [33, 12, 'minecraft:piston[extended=true,facing=west]'],
    [33, 13, 'minecraft:piston[extended=true,facing=east]'],
    [34, 0, 'minecraft:piston_head[facing=down,short=false,type=normal]'],
    [34, 1, 'minecraft:piston_head[facing=up,short=false,type=normal]'],
    [34, 2, 'minecraft:piston_head[facing=north,short=false,type=normal]'],
    [34, 3, 'minecraft:piston_head[facing=south,short=false,type=normal]'],
    [34, 4, 'minecraft:piston_head[facing=west,short=false,type=normal]'],
    [34, 5, 'minecraft:piston_head[facing=east,short=false,type=normal]'],
    [34, 8, 'minecraft:piston_head[facing=down,short=false,type=sticky]'],
    [34, 9, 'minecraft:piston_head[facing=up,short=false,type=sticky]'],
    [34, 10, 'minecraft:piston_head[facing=north,short=false,type=sticky]'],
    [34, 11, 'minecraft:piston_head[facing=south,short=false,type=sticky]'],
    [34, 12, 'minecraft:piston_head[facing=west,short=false,type=sticky]'],
    [34, 13, 'minecraft:piston_head[facing=east,short=false,type=sticky]'],
    [35, 0, 'minecraft:wool[color=white]'],
    [35, 1, 'minecraft:wool[color=orange]'],
    [35, 2, 'minecraft:wool[color=magenta]'],
    [35, 3, 'minecraft:wool[color=light_blue]'],
    [35, 4, 'minecraft:wool[color=yellow]'],
    [35, 5, 'minecraft:wool[color=lime]'],
    [35, 6, 'minecraft:wool[color=pink]'],
    [35, 7, 'minecraft:wool[color=gray]'],
    [35, 8, 'minecraft:wool[color=silver]'],
    [35, 9, 'minecraft:wool[color=cyan]'],
    [35, 10, 'minecraft:wool[color=purple]'],
    [35, 11, 'minecraft:wool[color=blue]'],
    [35, 12, 'minecraft:wool[color=brown]'],
    [35, 13, 'minecraft:wool[color=green]'],
    [35, 14, 'minecraft:wool[color=red]'],
    [35, 15, 'minecraft:wool[color=black]'],
    [36, 0, 'minecraft:piston_extension[facing=down,type=normal]'],
    [36, 1, 'minecraft:piston_extension[facing=up,type=normal]'],
    [36, 2, 'minecraft:piston_extension[facing=north,type=normal]'],
    [36, 3, 'minecraft:piston_extension[facing=south,type=normal]'],
    [36, 4, 'minecraft:piston_extension[facing=west,type=normal]'],
    [36, 5, 'minecraft:piston_extension[facing=east,type=normal]'],
    [36, 8, 'minecraft:piston_extension[facing=down,type=sticky]'],
    [36, 9, 'minecraft:piston_extension[facing=up,type=sticky]'],
    [36, 10, 'minecraft:piston_extension[facing=north,type=sticky]'],
    [36, 11, 'minecraft:piston_extension[facing=south,type=sticky]'],
    [36, 12, 'minecraft:piston_extension[facing=west,type=sticky]'],
    [36, 13, 'minecraft:piston_extension[facing=east,type=sticky]'],
    [37, 0, 'minecraft:yellow_flower[type=dandelion]'],
    [38, 0, 'minecraft:red_flower[type=poppy]'],
    [38, 1, 'minecraft:red_flower[type=blue_orchid]'],
    [38, 2, 'minecraft:red_flower[type=allium]'],
    [38, 3, 'minecraft:red_flower[type=houstonia]'],
    [38, 4, 'minecraft:red_flower[type=red_tulip]'],
    [38, 5, 'minecraft:red_flower[type=orange_tulip]'],
    [38, 6, 'minecraft:red_flower[type=white_tulip]'],
    [38, 7, 'minecraft:red_flower[type=pink_tulip]'],
    [38, 8, 'minecraft:red_flower[type=oxeye_daisy]'],
    [39, 0, 'minecraft:brown_mushroom'],
    [40, 0, 'minecraft:red_mushroom'],
    [41, 0, 'minecraft:gold_block'],
    [42, 0, 'minecraft:iron_block'],
    [43, 0, 'minecraft:double_stone_slab[seamless=false,variant=stone]'],
    [43, 1, 'minecraft:double_stone_slab[seamless=false,variant=sandstone]'],
    [43, 2, 'minecraft:double_stone_slab[seamless=false,variant=wood_old]'],
    [43, 3, 'minecraft:double_stone_slab[seamless=false,variant=cobblestone]'],
    [43, 4, 'minecraft:double_stone_slab[seamless=false,variant=brick]'],
    [43, 5, 'minecraft:double_stone_slab[seamless=false,variant=stone_brick]'],
    [43, 6, 'minecraft:double_stone_slab[seamless=false,variant=nether_brick]'],
    [43, 7, 'minecraft:double_stone_slab[seamless=false,variant=quartz]'],
    [43, 8, 'minecraft:double_stone_slab[seamless=true,variant=stone]'],
    [43, 9, 'minecraft:double_stone_slab[seamless=true,variant=sandstone]'],
    [43, 10, 'minecraft:double_stone_slab[seamless=true,variant=wood_old]'],
    [43, 11, 'minecraft:double_stone_slab[seamless=true,variant=cobblestone]'],
    [43, 12, 'minecraft:double_stone_slab[seamless=true,variant=brick]'],
    [43, 13, 'minecraft:double_stone_slab[seamless=true,variant=stone_brick]'],
    [43, 14, 'minecraft:double_stone_slab[seamless=true,variant=nether_brick]'],
    [43, 15, 'minecraft:double_stone_slab[seamless=true,variant=quartz]'],
    [44, 0, 'minecraft:stone_slab[half=bottom,variant=stone]'],
    [44, 1, 'minecraft:stone_slab[half=bottom,variant=sandstone]'],
    [44, 2, 'minecraft:stone_slab[half=bottom,variant=wood_old]'],
    [44, 3, 'minecraft:stone_slab[half=bottom,variant=cobblestone]'],
    [44, 4, 'minecraft:stone_slab[half=bottom,variant=brick]'],
    [44, 5, 'minecraft:stone_slab[half=bottom,variant=stone_brick]'],
    [44, 6, 'minecraft:stone_slab[half=bottom,variant=nether_brick]'],
    [44, 7, 'minecraft:stone_slab[half=bottom,variant=quartz]'],
    [44, 8, 'minecraft:stone_slab[half=top,variant=stone]'],
    [44, 9, 'minecraft:stone_slab[half=top,variant=sandstone]'],
    [44, 10, 'minecraft:stone_slab[half=top,variant=wood_old]'],
    [44, 11, 'minecraft:stone_slab[half=top,variant=cobblestone]'],
    [44, 12, 'minecraft:stone_slab[half=top,variant=brick]'],
    [44, 13, 'minecraft:stone_slab[half=top,variant=stone_brick]'],
    [44, 14, 'minecraft:stone_slab[half=top,variant=nether_brick]'],
    [44, 15, 'minecraft:stone_slab[half=top,variant=quartz]'],
    [45, 0, 'minecraft:brick_block'],
    [46, 0, 'minecraft:tnt[explode=false]'],
    [46, 1, 'minecraft:tnt[explode=true]'],
    [47, 0, 'minecraft:bookshelf'],
    [48, 0, 'minecraft:mossy_cobblestone'],
    [49, 0, 'minecraft:obsidian'],
    [50, 0, 'minecraft:torch[facing=up]'],
    [50, 1, 'minecraft:torch[facing=east]'],
    [50, 2, 'minecraft:torch[facing=west]'],
    [50, 3, 'minecraft:torch[facing=south]'],
    [50, 4, 'minecraft:torch[facing=north]'],
    [51, 0, 'minecraft:fire[age=0,east=false,north=false,south=false,up=false,west=false]'],
    [51, 1, 'minecraft:fire[age=1,east=false,north=false,south=false,up=false,west=false]'],
    [51, 2, 'minecraft:fire[age=2,east=false,north=false,south=false,up=false,west=false]'],
    [51, 3, 'minecraft:fire[age=3,east=false,north=false,south=false,up=false,west=false]'],
    [51, 4, 'minecraft:fire[age=4,east=false,north=false,south=false,up=false,west=false]'],
    [51, 5, 'minecraft:fire[age=5,east=false,north=false,south=false,up=false,west=false]'],
    [51, 6, 'minecraft:fire[age=6,east=false,north=false,south=false,up=false,west=false]'],
    [51, 7, 'minecraft:fire[age=7,east=false,north=false,south=false,up=false,west=false]'],
    [51, 8, 'minecraft:fire[age=8,east=false,north=false,south=false,up=false,west=false]'],
    [51, 9, 'minecraft:fire[age=9,east=false,north=false,south=false,up=false,west=false]'],
    [51, 10, 'minecraft:fire[age=10,east=false,north=false,south=false,up=false,west=false]'],
    [51, 11, 'minecraft:fire[age=11,east=false,north=false,south=false,up=false,west=false]'],
    [51, 12, 'minecraft:fire[age=12,east=false,north=false,south=false,up=false,west=false]'],
    [51, 13, 'minecraft:fire[age=13,east=false,north=false,south=false,up=false,west=false]'],
    [51, 14, 'minecraft:fire[age=14,east=false,north=false,south=false,up=false,west=false]'],
    [51, 15, 'minecraft:fire[age=15,east=false,north=false,south=false,up=false,west=false]'],
    [52, 0, 'minecraft:mob_spawner'],
    [53, 0, 'minecraft:oak_stairs[facing=east,half=bottom,shape=straight]'],
    [53, 1, 'minecraft:oak_stairs[facing=west,half=bottom,shape=straight]'],
    [53, 2, 'minecraft:oak_stairs[facing=south,half=bottom,shape=straight]'],
    [53, 3, 'minecraft:oak_stairs[facing=north,half=bottom,shape=straight]'],
    [53, 4, 'minecraft:oak_stairs[facing=east,half=top,shape=straight]'],
    [53, 5, 'minecraft:oak_stairs[facing=west,half=top,shape=straight]'],
    [53, 6, 'minecraft:oak_stairs[facing=south,half=top,shape=straight]'],
    [53, 7, 'minecraft:oak_stairs[facing=north,half=top,shape=straight]'],
    [54, 0, 'minecraft:chest[facing=north]'],
    [54, 3, 'minecraft:chest[facing=south]'],
    [54, 4, 'minecraft:chest[facing=west]'],
    [54, 5, 'minecraft:chest[facing=east]'],
    [55, 0, 'minecraft:redstone_wire[east=none,north=none,power=0,south=none,west=none]'],
    [55, 1, 'minecraft:redstone_wire[east=none,north=none,power=1,south=none,west=none]'],
    [55, 2, 'minecraft:redstone_wire[east=none,north=none,power=2,south=none,west=none]'],
    [55, 3, 'minecraft:redstone_wire[east=none,north=none,power=3,south=none,west=none]'],
    [55, 4, 'minecraft:redstone_wire[east=none,north=none,power=4,south=none,west=none]'],
    [55, 5, 'minecraft:redstone_wire[east=none,north=none,power=5,south=none,west=none]'],
    [55, 6, 'minecraft:redstone_wire[east=none,north=none,power=6,south=none,west=none]'],
    [55, 7, 'minecraft:redstone_wire[east=none,north=none,power=7,south=none,west=none]'],
    [55, 8, 'minecraft:redstone_wire[east=none,north=none,power=8,south=none,west=none]'],
    [55, 9, 'minecraft:redstone_wire[east=none,north=none,power=9,south=none,west=none]'],
    [55, 10, 'minecraft:redstone_wire[east=none,north=none,power=10,south=none,west=none]'],
    [55, 11, 'minecraft:redstone_wire[east=none,north=none,power=11,south=none,west=none]'],
    [55, 12, 'minecraft:redstone_wire[east=none,north=none,power=12,south=none,west=none]'],
    [55, 13, 'minecraft:redstone_wire[east=none,north=none,power=13,south=none,west=none]'],
    [55, 14, 'minecraft:redstone_wire[east=none,north=none,power=14,south=none,west=none]'],
    [55, 15, 'minecraft:redstone_wire[east=none,north=none,power=15,south=none,west=none]'],
    [56, 0, 'minecraft:diamond_ore'],
    [57, 0, 'minecraft:diamond_block'],
    [58, 0, 'minecraft:crafting_table'],
    [59, 0, 'minecraft:wheat[age=0]'],
    [59, 1, 'minecraft:wheat[age=1]'],
    [59, 2, 'minecraft:wheat[age=2]'],
    [59, 3, 'minecraft:wheat[age=3]'],
    [59, 4, 'minecraft:wheat[age=4]'],
    [59, 5, 'minecraft:wheat[age=5]'],
    [59, 6, 'minecraft:wheat[age=6]'],
    [59, 7, 'minecraft:wheat[age=7]'],
    [60, 0, 'minecraft:farmland[moisture=0]'],
    [60, 1, 'minecraft:farmland[moisture=1]'],
    [60, 2, 'minecraft:farmland[moisture=2]'],
    [60, 3, 'minecraft:farmland[moisture=3]'],
    [60, 4, 'minecraft:farmland[moisture=4]'],
    [60, 5, 'minecraft:farmland[moisture=5]'],
    [60, 6, 'minecraft:farmland[moisture=6]'],
    [60, 7, 'minecraft:farmland[moisture=7]'],
    [61, 0, 'minecraft:furnace[facing=north]'],
    [61, 3, 'minecraft:furnace[facing=south]'],
    [61, 4, 'minecraft:furnace[facing=west]'],
    [61, 5, 'minecraft:furnace[facing=east]'],
    [62, 0, 'minecraft:lit_furnace[facing=north]'],
    [62, 3, 'minecraft:lit_furnace[facing=south]'],
    [62, 4, 'minecraft:lit_furnace[facing=west]'],
    [62, 5, 'minecraft:lit_furnace[facing=east]'],
    [63, 0, 'minecraft:standing_sign[rotation=0]'],
    [63, 1, 'minecraft:standing_sign[rotation=1]'],
    [63, 2, 'minecraft:standing_sign[rotation=2]'],
    [63, 3, 'minecraft:standing_sign[rotation=3]'],
    [63, 4, 'minecraft:standing_sign[rotation=4]'],
    [63, 5, 'minecraft:standing_sign[rotation=5]'],
    [63, 6, 'minecraft:standing_sign[rotation=6]'],
    [63, 7, 'minecraft:standing_sign[rotation=7]'],
    [63, 8, 'minecraft:standing_sign[rotation=8]'],
    [63, 9, 'minecraft:standing_sign[rotation=9]'],
    [63, 10, 'minecraft:standing_sign[rotation=10]'],
    [63, 11, 'minecraft:standing_sign[rotation=11]'],
    [63, 12, 'minecraft:standing_sign[rotation=12]'],
    [63, 13, 'minecraft:standing_sign[rotation=13]'],
    [63, 14, 'minecraft:standing_sign[rotation=14]'],
    [63, 15, 'minecraft:standing_sign[rotation=15]'],
    [64, 0, 'minecraft:wooden_door[facing=east,half=lower,hinge=left,open=false,powered=false]'],
    [64, 1, 'minecraft:wooden_door[facing=south,half=lower,hinge=left,open=false,powered=false]'],
    [64, 2, 'minecraft:wooden_door[facing=west,half=lower,hinge=left,open=false,powered=false]'],
    [64, 3, 'minecraft:wooden_door[facing=north,half=lower,hinge=left,open=false,powered=false]'],
    [64, 4, 'minecraft:wooden_door[facing=east,half=lower,hinge=left,open=true,powered=false]'],
    [64, 5, 'minecraft:wooden_door[facing=south,half=lower,hinge=left,open=true,powered=false]'],
    [64, 6, 'minecraft:wooden_door[facing=west,half=lower,hinge=left,open=true,powered=false]'],
    [64, 7, 'minecraft:wooden_door[facing=north,half=lower,hinge=left,open=true,powered=false]'],
    [64, 8, 'minecraft:wooden_door[facing=north,half=upper,hinge=left,open=false,powered=false]'],
    [64, 9, 'minecraft:wooden_door[facing=north,half=upper,hinge=right,open=false,powered=false]'],
    [64, 10, 'minecraft:wooden_door[facing=north,half=upper,hinge=left,open=false,powered=true]'],
    [64, 11, 'minecraft:wooden_door[facing=north,half=upper,hinge=right,open=false,powered=true]'],
    [65, 0, 'minecraft:ladder[facing=north]'],
    [65, 3, 'minecraft:ladder[facing=south]'],
    [65, 4, 'minecraft:ladder[facing=west]'],
    [65, 5, 'minecraft:ladder[facing=east]'],
    [66, 0, 'minecraft:rail[shape=north_south]'],
    [66, 1, 'minecraft:rail[shape=east_west]'],
    [66, 2, 'minecraft:rail[shape=ascending_east]'],
    [66, 3, 'minecraft:rail[shape=ascending_west]'],
    [66, 4, 'minecraft:rail[shape=ascending_north]'],
    [66, 5, 'minecraft:rail[shape=ascending_south]'],
    [66, 6, 'minecraft:rail[shape=south_east]'],
    [66, 7, 'minecraft:rail[shape=south_west]'],
    [66, 8, 'minecraft:rail[shape=north_west]'],
    [66, 9, 'minecraft:rail[shape=north_east]'],
    [67, 0, 'minecraft:stone_stairs[facing=east,half=bottom,shape=straight]'],
    [67, 1, 'minecraft:stone_stairs[facing=west,half=bottom,shape=straight]'],
    [67, 2, 'minecraft:stone_stairs[facing=south,half=bottom,shape=straight]'],
    [67, 3, 'minecraft:stone_stairs[facing=north,half=bottom,shape=straight]'],
    [67, 4, 'minecraft:stone_stairs[facing=east,half=top,shape=straight]'],
    [67, 5, 'minecraft:stone_stairs[facing=west,half=top,shape=straight]'],
    [67, 6, 'minecraft:stone_stairs[facing=south,half=top,shape=straight]'],
    [67, 7, 'minecraft:stone_stairs[facing=north,half=top,shape=straight]'],
    [68, 0, 'minecraft:wall_sign[facing=north]'],
    [68, 3, 'minecraft:wall_sign[facing=south]'],
    [68, 4, 'minecraft:wall_sign[facing=west]'],
    [68, 5, 'minecraft:wall_sign[facing=east]'],
    [69, 0, 'minecraft:lever[facing=down_x,powered=false]'],
    [69, 1, 'minecraft:lever[facing=east,powered=false]'],
    [69, 2, 'minecraft:lever[facing=west,powered=false]'],
    [69, 3, 'minecraft:lever[facing=south,powered=false]'],
    [69, 4, 'minecraft:lever[facing=north,powered=false]'],
    [69, 5, 'minecraft:lever[facing=up_z,powered=false]'],
    [69, 6, 'minecraft:lever[facing=up_x,powered=false]'],
    [69, 7, 'minecraft:lever[facing=down_z,powered=false]'],
    [69, 8, 'minecraft:lever[facing=down_x,powered=true]'],
    [69, 9, 'minecraft:lever[facing=east,powered=true]'],
    [69, 10, 'minecraft:lever[facing=west,powered=true]'],
    [69, 11, 'minecraft:lever[facing=south,powered=true]'],
    [69, 12, 'minecraft:lever[facing=north,powered=true]'],
    [69, 13, 'minecraft:lever[facing=up_z,powered=true]'],
    [69, 14, 'minecraft:lever[facing=up_x,powered=true]'],
    [69, 15, 'minecraft:lever[facing=down_z,powered=true]'],
    [70, 0, 'minecraft:stone_pressure_plate[powered=false]'],
    [70, 1, 'minecraft:stone_pressure_plate[powered=true]'],
    [71, 0, 'minecraft:iron_door[facing=east,half=lower,hinge=left,open=false,powered=false]'],
    [71, 1, 'minecraft:iron_door[facing=south,half=lower,hinge=left,open=false,powered=false]'],
    [71, 2, 'minecraft:iron_door[facing=west,half=lower,hinge=left,open=false,powered=false]'],
    [71, 3, 'minecraft:iron_door[facing=north,half=lower,hinge=left,open=false,powered=false]'],
    [71, 4, 'minecraft:iron_door[facing=east,half=lower,hinge=left,open=true,powered=false]'],
    [71, 5, 'minecraft:iron_door[facing=south,half=lower,hinge=left,open=true,powered=false]'],
    [71, 6, 'minecraft:iron_door[facing=west,half=lower,hinge=left,open=true,powered=false]'],
    [71, 7, 'minecraft:iron_door[facing=north,half=lower,hinge=left,open=true,powered=false]'],
    [71, 8, 'minecraft:iron_door[facing=north,half=upper,hinge=left,open=false,powered=false]'],
    [71, 9, 'minecraft:iron_door[facing=north,half=upper,hinge=right,open=false,powered=false]'],
    [71, 10, 'minecraft:iron_door[facing=north,half=upper,hinge=left,open=false,powered=true]'],
    [71, 11, 'minecraft:iron_door[facing=north,half=upper,hinge=right,open=false,powered=true]'],
    [72, 0, 'minecraft:wooden_pressure_plate[powered=false]'],
    [72, 1, 'minecraft:wooden_pressure_plate[powered=true]'],
    [73, 0, 'minecraft:redstone_ore'],
    [74, 0, 'minecraft:lit_redstone_ore'],
    [75, 0, 'minecraft:unlit_redstone_torch[facing=up]'],
    [75, 1, 'minecraft:unlit_redstone_torch[facing=east]'],
    [75, 2, 'minecraft:unlit_redstone_torch[facing=west]'],
    [75, 3, 'minecraft:unlit_redstone_torch[facing=south]'],
    [75, 4, 'minecraft:unlit_redstone_torch[facing=north]'],
    [76, 0, 'minecraft:redstone_torch[facing=up]'],
    [76, 1, 'minecraft:redstone_torch[facing=east]'],
    [76, 2, 'minecraft:redstone_torch[facing=west]'],
    [76, 3, 'minecraft:redstone_torch[facing=south]'],
    [76, 4, 'minecraft:redstone_torch[facing=north]'],
    [77, 0, 'minecraft:stone_button[facing=down,powered=false]'],
    [77, 1, 'minecraft:stone_button[facing=east,powered=false]'],
    [77, 2, 'minecraft:stone_button[facing=west,powered=false]'],
    [77, 3, 'minecraft:stone_button[facing=south,powered=false]'],
    [77, 4, 'minecraft:stone_button[facing=north,powered=false]'],
    [77, 5, 'minecraft:stone_button[facing=up,powered=false]'],
    [77, 8, 'minecraft:stone_button[facing=down,powered=true]'],
    [77, 9, 'minecraft:stone_button[facing=east,powered=true]'],
    [77, 10, 'minecraft:stone_button[facing=west,powered=true]'],
    [77, 11, 'minecraft:stone_button[facing=south,powered=true]'],
    [77, 12, 'minecraft:stone_button[facing=north,powered=true]'],
    [77, 13, 'minecraft:stone_button[facing=up,powered=true]'],
    [78, 0, 'minecraft:snow_layer[layers=1]'],
    [78, 1, 'minecraft:snow_layer[layers=2]'],
    [78, 2, 'minecraft:snow_layer[layers=3]'],
    [78, 3, 'minecraft:snow_layer[layers=4]'],
    [78, 4, 'minecraft:snow_layer[layers=5]'],
    [78, 5, 'minecraft:snow_layer[layers=6]'],
    [78, 6, 'minecraft:snow_layer[layers=7]'],
    [78, 7, 'minecraft:snow_layer[layers=8]'],
    [79, 0, 'minecraft:ice'],
    [80, 0, 'minecraft:snow'],
    [81, 0, 'minecraft:cactus[age=0]'],
    [81, 1, 'minecraft:cactus[age=1]'],
    [81, 2, 'minecraft:cactus[age=2]'],
    [81, 3, 'minecraft:cactus[age=3]'],
    [81, 4, 'minecraft:cactus[age=4]'],
    [81, 5, 'minecraft:cactus[age=5]'],
    [81, 6, 'minecraft:cactus[age=6]'],
    [81, 7, 'minecraft:cactus[age=7]'],
    [81, 8, 'minecraft:cactus[age=8]'],
    [81, 9, 'minecraft:cactus[age=9]'],
    [81, 10, 'minecraft:cactus[age=10]'],
    [81, 11, 'minecraft:cactus[age=11]'],
    [81, 12, 'minecraft:cactus[age=12]'],
    [81, 13, 'minecraft:cactus[age=13]'],
    [81, 14, 'minecraft:cactus[age=14]'],
    [81, 15, 'minecraft:cactus[age=15]'],
    [82, 0, 'minecraft:clay'],
    [83, 0, 'minecraft:reeds[age=0]'],
    [83, 1, 'minecraft:reeds[age=1]'],
    [83, 2, 'minecraft:reeds[age=2]'],
    [83, 3, 'minecraft:reeds[age=3]'],
    [83, 4, 'minecraft:reeds[age=4]'],
    [83, 5, 'minecraft:reeds[age=5]'],
    [83, 6, 'minecraft:reeds[age=6]'],
    [83, 7, 'minecraft:reeds[age=7]'],
    [83, 8, 'minecraft:reeds[age=8]'],
    [83, 9, 'minecraft:reeds[age=9]'],
    [83, 10, 'minecraft:reeds[age=10]'],
    [83, 11, 'minecraft:reeds[age=11]'],
    [83, 12, 'minecraft:reeds[age=12]'],
    [83, 13, 'minecraft:reeds[age=13]'],
    [83, 14, 'minecraft:reeds[age=14]'],
    [83, 15, 'minecraft:reeds[age=15]'],
    [84, 0, 'minecraft:jukebox[has_record=false]'],
    [84, 1, 'minecraft:jukebox[has_record=true]'],
    [85, 0, 'minecraft:fence[east=false,north=false,south=false,west=false]'],
    [86, 0, 'minecraft:pumpkin[facing=south]'],
    [86, 1, 'minecraft:pumpkin[facing=west]'],
    [86, 2, 'minecraft:pumpkin[facing=north]'],
    [86, 3, 'minecraft:pumpkin[facing=east]'],
    [87, 0, 'minecraft:netherrack'],
    [88, 0, 'minecraft:soul_sand'],
    [89, 0, 'minecraft:glowstone'],
    [90, 0, 'minecraft:portal[axis=x]'],
    [90, 2, 'minecraft:portal[axis=z]'],
    [91, 0, 'minecraft:lit_pumpkin[facing=south]'],
    [91, 1, 'minecraft:lit_pumpkin[facing=west]'],
    [91, 2, 'minecraft:lit_pumpkin[facing=north]'],
    [91, 3, 'minecraft:lit_pumpkin[facing=east]'],
    [92, 0, 'minecraft:cake[bites=0]'],
    [92, 1, 'minecraft:cake[bites=1]'],
    [92, 2, 'minecraft:cake[bites=2]'],
    [92, 3, 'minecraft:cake[bites=3]'],
    [92, 4, 'minecraft:cake[bites=4]'],
    [92, 5, 'minecraft:cake[bites=5]'],
    [92, 6, 'minecraft:cake[bites=6]'],
    [93, 0, 'minecraft:unpowered_repeater[delay=1,facing=south,locked=false]'],
    [93, 1, 'minecraft:unpowered_repeater[delay=1,facing=west,locked=false]'],
    [93, 2, 'minecraft:unpowered_repeater[delay=1,facing=north,locked=false]'],
    [93, 3, 'minecraft:unpowered_repeater[delay=1,facing=east,locked=false]'],
    [93, 4, 'minecraft:unpowered_repeater[delay=2,facing=south,locked=false]'],
    [93, 5, 'minecraft:unpowered_repeater[delay=2,facing=west,locked=false]'],
    [93, 6, 'minecraft:unpowered_repeater[delay=2,facing=north,locked=false]'],
    [93, 7, 'minecraft:unpowered_repeater[delay=2,facing=east,locked=false]'],
    [93, 8, 'minecraft:unpowered_repeater[delay=3,facing=south,locked=false]'],
    [93, 9, 'minecraft:unpowered_repeater[delay=3,facing=west,locked=false]'],
    [93, 10, 'minecraft:unpowered_repeater[delay=3,facing=north,locked=false]'],
    [93, 11, 'minecraft:unpowered_repeater[delay=3,facing=east,locked=false]'],
    [93, 12, 'minecraft:unpowered_repeater[delay=4,facing=south,locked=false]'],
    [93, 13, 'minecraft:unpowered_repeater[delay=4,facing=west,locked=false]'],
    [93, 14, 'minecraft:unpowered_repeater[delay=4,facing=north,locked=false]'],
    [93, 15, 'minecraft:unpowered_repeater[delay=4,facing=east,locked=false]'],
    [94, 0, 'minecraft:powered_repeater[delay=1,facing=south,locked=false]'],
    [94, 1, 'minecraft:powered_repeater[delay=1,facing=west,locked=false]'],
    [94, 2, 'minecraft:powered_repeater[delay=1,facing=north,locked=false]'],
    [94, 3, 'minecraft:powered_repeater[delay=1,facing=east,locked=false]'],
    [94, 4, 'minecraft:powered_repeater[delay=2,facing=south,locked=false]'],
    [94, 5, 'minecraft:powered_repeater[delay=2,facing=west,locked=false]'],
    [94, 6, 'minecraft:powered_repeater[delay=2,facing=north,locked=false]'],
    [94, 7, 'minecraft:powered_repeater[delay=2,facing=east,locked=false]'],
    [94, 8, 'minecraft:powered_repeater[delay=3,facing=south,locked=false]'],
    [94, 9, 'minecraft:powered_repeater[delay=3,facing=west,locked=false]'],
    [94, 10, 'minecraft:powered_repeater[delay=3,facing=north,locked=false]'],
    [94, 11, 'minecraft:powered_repeater[delay=3,facing=east,locked=false]'],
    [94, 12, 'minecraft:powered_repeater[delay=4,facing=south,locked=false]'],
    [94, 13, 'minecraft:powered_repeater[delay=4,facing=west,locked=false]'],
    [94, 14, 'minecraft:powered_repeater[delay=4,facing=north,locked=false]'],
    [94, 15, 'minecraft:powered_repeater[delay=4,facing=east,locked=false]'],
    [95, 0, 'minecraft:stained_glass[color=white]'],
    [95, 1, 'minecraft:stained_glass[color=orange]'],
    [95, 2, 'minecraft:stained_glass[color=magenta]'],
    [95, 3, 'minecraft:stained_glass[color=light_blue]'],
    [95, 4, 'minecraft:stained_glass[color=yellow]'],
    [95, 5, 'minecraft:stained_glass[color=lime]'],
    [95, 6, 'minecraft:stained_glass[color=pink]'],
    [95, 7, 'minecraft:stained_glass[color=gray]'],
    [95, 8, 'minecraft:stained_glass[color=silver]'],
    [95, 9, 'minecraft:stained_glass[color=cyan]'],
    [95, 10, 'minecraft:stained_glass[color=purple]'],
    [95, 11, 'minecraft:stained_glass[color=blue]'],
    [95, 12, 'minecraft:stained_glass[color=brown]'],
    [95, 13, 'minecraft:stained_glass[color=green]'],
    [95, 14, 'minecraft:stained_glass[color=red]'],
    [95, 15, 'minecraft:stained_glass[color=black]'],
    [96, 0, 'minecraft:trapdoor[facing=north,half=bottom,open=false]'],
    [96, 1, 'minecraft:trapdoor[facing=south,half=bottom,open=false]'],
    [96, 2, 'minecraft:trapdoor[facing=west,half=bottom,open=false]'],
    [96, 3, 'minecraft:trapdoor[facing=east,half=bottom,open=false]'],
    [96, 4, 'minecraft:trapdoor[facing=north,half=bottom,open=true]'],
    [96, 5, 'minecraft:trapdoor[facing=south,half=bottom,open=true]'],
    [96, 6, 'minecraft:trapdoor[facing=west,half=bottom,open=true]'],
    [96, 7, 'minecraft:trapdoor[facing=east,half=bottom,open=true]'],
    [96, 8, 'minecraft:trapdoor[facing=north,half=top,open=false]'],
    [96, 9, 'minecraft:trapdoor[facing=south,half=top,open=false]'],
    [96, 10, 'minecraft:trapdoor[facing=west,half=top,open=false]'],
    [96, 11, 'minecraft:trapdoor[facing=east,half=top,open=false]'],
    [96, 12, 'minecraft:trapdoor[facing=north,half=top,open=true]'],
    [96, 13, 'minecraft:trapdoor[facing=south,half=top,open=true]'],
    [96, 14, 'minecraft:trapdoor[facing=west,half=top,open=true]'],
    [96, 15, 'minecraft:trapdoor[facing=east,half=top,open=true]'],
    [97, 0, 'minecraft:monster_egg[variant=stone]'],
    [97, 1, 'minecraft:monster_egg[variant=cobblestone]'],
    [97, 2, 'minecraft:monster_egg[variant=stone_brick]'],
    [97, 3, 'minecraft:monster_egg[variant=mossy_brick]'],
    [97, 4, 'minecraft:monster_egg[variant=cracked_brick]'],
    [97, 5, 'minecraft:monster_egg[variant=chiseled_brick]'],
    [98, 0, 'minecraft:stonebrick[variant=stonebrick]'],
    [98, 1, 'minecraft:stonebrick[variant=mossy_stonebrick]'],
    [98, 2, 'minecraft:stonebrick[variant=cracked_stonebrick]'],
    [98, 3, 'minecraft:stonebrick[variant=chiseled_stonebrick]'],
    [99, 0, 'minecraft:brown_mushroom_block[variant=all_inside]'],
    [99, 1, 'minecraft:brown_mushroom_block[variant=north_west]'],
    [99, 2, 'minecraft:brown_mushroom_block[variant=north]'],
    [99, 3, 'minecraft:brown_mushroom_block[variant=north_east]'],
    [99, 4, 'minecraft:brown_mushroom_block[variant=west]'],
    [99, 5, 'minecraft:brown_mushroom_block[variant=center]'],
    [99, 6, 'minecraft:brown_mushroom_block[variant=east]'],
    [99, 7, 'minecraft:brown_mushroom_block[variant=south_west]'],
    [99, 8, 'minecraft:brown_mushroom_block[variant=south]'],
    [99, 9, 'minecraft:brown_mushroom_block[variant=south_east]'],
    [99, 10, 'minecraft:brown_mushroom_block[variant=stem]'],
    [99, 14, 'minecraft:brown_mushroom_block[variant=all_outside]'],
    [99, 15, 'minecraft:brown_mushroom_block[variant=all_stem]'],
    [100, 0, 'minecraft:red_mushroom_block[variant=all_inside]'],
    [100, 1, 'minecraft:red_mushroom_block[variant=north_west]'],
    [100, 2, 'minecraft:red_mushroom_block[variant=north]'],
    [100, 3, 'minecraft:red_mushroom_block[variant=north_east]'],
    [100, 4, 'minecraft:red_mushroom_block[variant=west]'],
    [100, 5, 'minecraft:red_mushroom_block[variant=center]'],
    [100, 6, 'minecraft:red_mushroom_block[variant=east]'],
    [100, 7, 'minecraft:red_mushroom_block[variant=south_west]'],
    [100, 8, 'minecraft:red_mushroom_block[variant=south]'],
    [100, 9, 'minecraft:red_mushroom_block[variant=south_east]'],
    [100, 10, 'minecraft:red_mushroom_block[variant=stem]'],
    [100, 14, 'minecraft:red_mushroom_block[variant=all_outside]'],
    [100, 15, 'minecraft:red_mushroom_block[variant=all_stem]'],
    [101, 0, 'minecraft:iron_bars[east=false,north=false,south=false,west=false]'],
    [102, 0, 'minecraft:glass_pane[east=false,north=false,south=false,west=false]'],
    [103, 0, 'minecraft:melon_block'],
    [104, 0, 'minecraft:pumpkin_stem[age=0,facing=up]'],
    [104, 1, 'minecraft:pumpkin_stem[age=1,facing=up]'],
    [104, 2, 'minecraft:pumpkin_stem[age=2,facing=up]'],
    [104, 3, 'minecraft:pumpkin_stem[age=3,facing=up]'],
    [104, 4, 'minecraft:pumpkin_stem[age=4,facing=up]'],
    [104, 5, 'minecraft:pumpkin_stem[age=5,facing=up]'],
    [104, 6, 'minecraft:pumpkin_stem[age=6,facing=up]'],
    [104, 7, 'minecraft:pumpkin_stem[age=7,facing=up]'],
    [105, 0, 'minecraft:melon_stem[age=0,facing=up]'],
    [105, 1, 'minecraft:melon_stem[age=1,facing=up]'],
    [105, 2, 'minecraft:melon_stem[age=2,facing=up]'],
    [105, 3, 'minecraft:melon_stem[age=3,facing=up]'],
    [105, 4, 'minecraft:melon_stem[age=4,facing=up]'],
    [105, 5, 'minecraft:melon_stem[age=5,facing=up]'],
    [105, 6, 'minecraft:melon_stem[age=6,facing=up]'],
    [105, 7, 'minecraft:melon_stem[age=7,facing=up]'],
    [106, 0, 'minecraft:vine[east=false,north=false,south=false,up=false,west=false]'],
    [106, 1, 'minecraft:vine[east=false,north=false,south=true,up=false,west=false]'],
    [106, 2, 'minecraft:vine[east=false,north=false,south=false,up=false,west=true]'],
    [106, 3, 'minecraft:vine[east=false,north=false,south=true,up=false,west=true]'],
    [106, 4, 'minecraft:vine[east=false,north=true,south=false,up=false,west=false]'],
    [106, 5, 'minecraft:vine[east=false,north=true,south=true,up=false,west=false]'],
    [106, 6, 'minecraft:vine[east=false,north=true,south=false,up=false,west=true]'],
    [106, 7, 'minecraft:vine[east=false,north=true,south=true,up=false,west=true]'],
    [106, 8, 'minecraft:vine[east=true,north=false,south=false,up=false,west=false]'],
    [106, 9, 'minecraft:vine[east=true,north=false,south=true,up=false,west=false]'],
    [106, 10, 'minecraft:vine[east=true,north=false,south=false,up=false,west=true]'],
    [106, 11, 'minecraft:vine[east=true,north=false,south=true,up=false,west=true]'],
    [106, 12, 'minecraft:vine[east=true,north=true,south=false,up=false,west=false]'],
    [106, 13, 'minecraft:vine[east=true,north=true,south=true,up=false,west=false]'],
    [106, 14, 'minecraft:vine[east=true,north=true,south=false,up=false,west=true]'],
    [106, 15, 'minecraft:vine[east=true,north=true,south=true,up=false,west=true]'],
    [107, 0, 'minecraft:fence_gate[facing=south,in_wall=false,open=false,powered=false]'],
    [107, 1, 'minecraft:fence_gate[facing=west,in_wall=false,open=false,powered=false]'],
    [107, 2, 'minecraft:fence_gate[facing=north,in_wall=false,open=false,powered=false]'],
    [107, 3, 'minecraft:fence_gate[facing=east,in_wall=false,open=false,powered=false]'],
    [107, 4, 'minecraft:fence_gate[facing=south,in_wall=false,open=true,powered=false]'],
    [107, 5, 'minecraft:fence_gate[facing=west,in_wall=false,open=true,powered=false]'],
    [107, 6, 'minecraft:fence_gate[facing=north,in_wall=false,open=true,powered=false]'],
    [107, 7, 'minecraft:fence_gate[facing=east,in_wall=false,open=true,powered=false]'],
    [107, 8, 'minecraft:fence_gate[facing=south,in_wall=false,open=false,powered=true]'],
    [107, 9, 'minecraft:fence_gate[facing=west,in_wall=false,open=false,powered=true]'],
    [107, 10, 'minecraft:fence_gate[facing=north,in_wall=false,open=false,powered=true]'],
    [107, 11, 'minecraft:fence_gate[facing=east,in_wall=false,open=false,powered=true]'],
    [107, 12, 'minecraft:fence_gate[facing=south,in_wall=false,open=true,powered=true]'],
    [107, 13, 'minecraft:fence_gate[facing=west,in_wall=false,open=true,powered=true]'],
    [107, 14, 'minecraft:fence_gate[facing=north,in_wall=false,open=true,powered=true]'],
    [107, 15, 'minecraft:fence_gate[facing=east,in_wall=false,open=true,powered=true]'],
    [108, 0, 'minecraft:brick_stairs[facing=east,half=bottom,shape=straight]'],
    [108, 1, 'minecraft:brick_stairs[facing=west,half=bottom,shape=straight]'],
    [108, 2, 'minecraft:brick_stairs[facing=south,half=bottom,shape=straight]'],
    [108, 3, 'minecraft:brick_stairs[facing=north,half=bottom,shape=straight]'],
    [108, 4, 'minecraft:brick_stairs[facing=east,half=top,shape=straight]'],
    [108, 5, 'minecraft:brick_stairs[facing=west,half=top,shape=straight]'],
    [108, 6, 'minecraft:brick_stairs[facing=south,half=top,shape=straight]'],
    [108, 7, 'minecraft:brick_stairs[facing=north,half=top,shape=straight]'],
    [109, 0, 'minecraft:stone_brick_stairs[facing=east,half=bottom,shape=straight]'],
    [109, 1, 'minecraft:stone_brick_stairs[facing=west,half=bottom,shape=straight]'],
    [109, 2, 'minecraft:stone_brick_stairs[facing=south,half=bottom,shape=straight]'],
    [109, 3, 'minecraft:stone_brick_stairs[facing=north,half=bottom,shape=straight]'],
    [109, 4, 'minecraft:stone_brick_stairs[facing=east,half=top,shape=straight]'],
    [109, 5, 'minecraft:stone_brick_stairs[facing=west,half=top,shape=straight]'],
    [109, 6, 'minecraft:stone_brick_stairs[facing=south,half=top,shape=straight]'],
    [109, 7, 'minecraft:stone_brick_stairs[facing=north,half=top,shape=straight]'],
    [110, 0, 'minecraft:mycelium[snowy=false]'],
    [111, 0, 'minecraft:waterlily'],
    [112, 0, 'minecraft:nether_brick'],
    [113, 0, 'minecraft:nether_brick_fence[east=false,north=false,south=false,west=false]'],
    [114, 0, 'minecraft:nether_brick_stairs[facing=east,half=bottom,shape=straight]'],
    [114, 1, 'minecraft:nether_brick_stairs[facing=west,half=bottom,shape=straight]'],
    [114, 2, 'minecraft:nether_brick_stairs[facing=south,half=bottom,shape=straight]'],
    [114, 3, 'minecraft:nether_brick_stairs[facing=north,half=bottom,shape=straight]'],
    [114, 4, 'minecraft:nether_brick_stairs[facing=east,half=top,shape=straight]'],
    [114, 5, 'minecraft:nether_brick_stairs[facing=west,half=top,shape=straight]'],
    [114, 6, 'minecraft:nether_brick_stairs[facing=south,half=top,shape=straight]'],
    [114, 7, 'minecraft:nether_brick_stairs[facing=north,half=top,shape=straight]'],
    [115, 0, 'minecraft:nether_wart[age=0]'],
    [115, 1, 'minecraft:nether_wart[age=1]'],
    [115, 2, 'minecraft:nether_wart[age=2]'],
    [115, 3, 'minecraft:nether_wart[age=3]'],
    [116, 0, 'minecraft:enchanting_table'],
    [117, 0, 'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=false,has_bottle_2=false]'],
    [117, 1, 'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=false,has_bottle_2=false]'],
    [117, 2, 'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=true,has_bottle_2=false]'],
    [117, 3, 'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=true,has_bottle_2=false]'],
    [117, 4, 'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=false,has_bottle_2=true]'],
    [117, 5, 'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=false,has_bottle_2=true]'],
    [117, 6, 'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=true,has_bottle_2=true]'],
    [117, 7, 'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=true,has_bottle_2=true]'],
    [118, 0, 'minecraft:cauldron[level=0]'],
    [118, 1, 'minecraft:cauldron[level=1]'],
    [118, 2, 'minecraft:cauldron[level=2]'],
    [118, 3, 'minecraft:cauldron[level=3]'],
    [119, 0, 'minecraft:end_portal'],
    [120, 0, 'minecraft:end_portal_frame[eye=false,facing=south]'],
    [120, 1, 'minecraft:end_portal_frame[eye=false,facing=west]'],
    [120, 2, 'minecraft:end_portal_frame[eye=false,facing=north]'],
    [120, 3, 'minecraft:end_portal_frame[eye=false,facing=east]'],
    [120, 4, 'minecraft:end_portal_frame[eye=true,facing=south]'],
    [120, 5, 'minecraft:end_portal_frame[eye=true,facing=west]'],
    [120, 6, 'minecraft:end_portal_frame[eye=true,facing=north]'],
    [120, 7, 'minecraft:end_portal_frame[eye=true,facing=east]'],
    [121, 0, 'minecraft:end_stone'],
    [122, 0, 'minecraft:dragon_egg'],
    [123, 0, 'minecraft:redstone_lamp'],
    [124, 0, 'minecraft:lit_redstone_lamp'],
    [125, 0, 'minecraft:double_wooden_slab[variant=oak]'],
    [125, 1, 'minecraft:double_wooden_slab[variant=spruce]'],
    [125, 2, 'minecraft:double_wooden_slab[variant=birch]'],
    [125, 3, 'minecraft:double_wooden_slab[variant=jungle]'],
    [125, 4, 'minecraft:double_wooden_slab[variant=acacia]'],
    [125, 5, 'minecraft:double_wooden_slab[variant=dark_oak]'],
    [126, 0, 'minecraft:wooden_slab[half=bottom,variant=oak]'],
    [126, 1, 'minecraft:wooden_slab[half=bottom,variant=spruce]'],
    [126, 2, 'minecraft:wooden_slab[half=bottom,variant=birch]'],
    [126, 3, 'minecraft:wooden_slab[half=bottom,variant=jungle]'],
    [126, 4, 'minecraft:wooden_slab[half=bottom,variant=acacia]'],
    [126, 5, 'minecraft:wooden_slab[half=bottom,variant=dark_oak]'],
    [126, 8, 'minecraft:wooden_slab[half=top,variant=oak]'],
    [126, 9, 'minecraft:wooden_slab[half=top,variant=spruce]'],
    [126, 10, 'minecraft:wooden_slab[half=top,variant=birch]'],
    [126, 11, 'minecraft:wooden_slab[half=top,variant=jungle]'],
    [126, 12, 'minecraft:wooden_slab[half=top,variant=acacia]'],
    [126, 13, 'minecraft:wooden_slab[half=top,variant=dark_oak]'],
    [127, 0, 'minecraft:cocoa[age=0,facing=south]'],
    [127, 1, 'minecraft:cocoa[age=0,facing=west]'],
    [127, 2, 'minecraft:cocoa[age=0,facing=north]'],
    [127, 3, 'minecraft:cocoa[age=0,facing=east]'],
    [127, 4, 'minecraft:cocoa[age=1,facing=south]'],
    [127, 5, 'minecraft:cocoa[age=1,facing=west]'],
    [127, 6, 'minecraft:cocoa[age=1,facing=north]'],
    [127, 7, 'minecraft:cocoa[age=1,facing=east]'],
    [127, 8, 'minecraft:cocoa[age=2,facing=south]'],
    [127, 9, 'minecraft:cocoa[age=2,facing=west]'],
    [127, 10, 'minecraft:cocoa[age=2,facing=north]'],
    [127, 11, 'minecraft:cocoa[age=2,facing=east]'],
    [128, 0, 'minecraft:sandstone_stairs[facing=east,half=bottom,shape=straight]'],
    [128, 1, 'minecraft:sandstone_stairs[facing=west,half=bottom,shape=straight]'],
    [128, 2, 'minecraft:sandstone_stairs[facing=south,half=bottom,shape=straight]'],
    [128, 3, 'minecraft:sandstone_stairs[facing=north,half=bottom,shape=straight]'],
    [128, 4, 'minecraft:sandstone_stairs[facing=east,half=top,shape=straight]'],
    [128, 5, 'minecraft:sandstone_stairs[facing=west,half=top,shape=straight]'],
    [128, 6, 'minecraft:sandstone_stairs[facing=south,half=top,shape=straight]'],
    [128, 7, 'minecraft:sandstone_stairs[facing=north,half=top,shape=straight]'],
    [129, 0, 'minecraft:emerald_ore'],
    [130, 0, 'minecraft:ender_chest[facing=north]'],
    [130, 3, 'minecraft:ender_chest[facing=south]'],
    [130, 4, 'minecraft:ender_chest[facing=west]'],
    [130, 5, 'minecraft:ender_chest[facing=east]'],
    [131, 0, 'minecraft:tripwire_hook[attached=false,facing=south,powered=false]'],
    [131, 1, 'minecraft:tripwire_hook[attached=false,facing=west,powered=false]'],
    [131, 2, 'minecraft:tripwire_hook[attached=false,facing=north,powered=false]'],
    [131, 3, 'minecraft:tripwire_hook[attached=false,facing=east,powered=false]'],
    [131, 4, 'minecraft:tripwire_hook[attached=true,facing=south,powered=false]'],
    [131, 5, 'minecraft:tripwire_hook[attached=true,facing=west,powered=false]'],
    [131, 6, 'minecraft:tripwire_hook[attached=true,facing=north,powered=false]'],
    [131, 7, 'minecraft:tripwire_hook[attached=true,facing=east,powered=false]'],
    [131, 8, 'minecraft:tripwire_hook[attached=false,facing=south,powered=true]'],
    [131, 9, 'minecraft:tripwire_hook[attached=false,facing=west,powered=true]'],
    [131, 10, 'minecraft:tripwire_hook[attached=false,facing=north,powered=true]'],
    [131, 11, 'minecraft:tripwire_hook[attached=false,facing=east,powered=true]'],
    [131, 12, 'minecraft:tripwire_hook[attached=true,facing=south,powered=true]'],
    [131, 13, 'minecraft:tripwire_hook[attached=true,facing=west,powered=true]'],
    [131, 14, 'minecraft:tripwire_hook[attached=true,facing=north,powered=true]'],
    [131, 15, 'minecraft:tripwire_hook[attached=true,facing=east,powered=true]'],
    [
        132,
        0,
        'minecraft:tripwire[attached=false,disarmed=false,east=false,north=false,powered=false,south=false,west=false]'
    ],
    [
        132,
        1,
        'minecraft:tripwire[attached=false,disarmed=false,east=false,north=false,powered=true,south=false,west=false]'
    ],
    [
        132,
        4,
        'minecraft:tripwire[attached=true,disarmed=false,east=false,north=false,powered=false,south=false,west=false]'
    ],
    [
        132,
        5,
        'minecraft:tripwire[attached=true,disarmed=false,east=false,north=false,powered=true,south=false,west=false]'
    ],
    [
        132,
        8,
        'minecraft:tripwire[attached=false,disarmed=true,east=false,north=false,powered=false,south=false,west=false]'
    ],
    [
        132,
        9,
        'minecraft:tripwire[attached=false,disarmed=true,east=false,north=false,powered=true,south=false,west=false]'
    ],
    [
        132,
        12,
        'minecraft:tripwire[attached=true,disarmed=true,east=false,north=false,powered=false,south=false,west=false]'
    ],
    [
        132,
        13,
        'minecraft:tripwire[attached=true,disarmed=true,east=false,north=false,powered=true,south=false,west=false]'
    ],
    [133, 0, 'minecraft:emerald_block'],
    [134, 0, 'minecraft:spruce_stairs[facing=east,half=bottom,shape=straight]'],
    [134, 1, 'minecraft:spruce_stairs[facing=west,half=bottom,shape=straight]'],
    [134, 2, 'minecraft:spruce_stairs[facing=south,half=bottom,shape=straight]'],
    [134, 3, 'minecraft:spruce_stairs[facing=north,half=bottom,shape=straight]'],
    [134, 4, 'minecraft:spruce_stairs[facing=east,half=top,shape=straight]'],
    [134, 5, 'minecraft:spruce_stairs[facing=west,half=top,shape=straight]'],
    [134, 6, 'minecraft:spruce_stairs[facing=south,half=top,shape=straight]'],
    [134, 7, 'minecraft:spruce_stairs[facing=north,half=top,shape=straight]'],
    [135, 0, 'minecraft:birch_stairs[facing=east,half=bottom,shape=straight]'],
    [135, 1, 'minecraft:birch_stairs[facing=west,half=bottom,shape=straight]'],
    [135, 2, 'minecraft:birch_stairs[facing=south,half=bottom,shape=straight]'],
    [135, 3, 'minecraft:birch_stairs[facing=north,half=bottom,shape=straight]'],
    [135, 4, 'minecraft:birch_stairs[facing=east,half=top,shape=straight]'],
    [135, 5, 'minecraft:birch_stairs[facing=west,half=top,shape=straight]'],
    [135, 6, 'minecraft:birch_stairs[facing=south,half=top,shape=straight]'],
    [135, 7, 'minecraft:birch_stairs[facing=north,half=top,shape=straight]'],
    [136, 0, 'minecraft:jungle_stairs[facing=east,half=bottom,shape=straight]'],
    [136, 1, 'minecraft:jungle_stairs[facing=west,half=bottom,shape=straight]'],
    [136, 2, 'minecraft:jungle_stairs[facing=south,half=bottom,shape=straight]'],
    [136, 3, 'minecraft:jungle_stairs[facing=north,half=bottom,shape=straight]'],
    [136, 4, 'minecraft:jungle_stairs[facing=east,half=top,shape=straight]'],
    [136, 5, 'minecraft:jungle_stairs[facing=west,half=top,shape=straight]'],
    [136, 6, 'minecraft:jungle_stairs[facing=south,half=top,shape=straight]'],
    [136, 7, 'minecraft:jungle_stairs[facing=north,half=top,shape=straight]'],
    [137, 0, 'minecraft:command_block[conditional=false,facing=down]'],
    [137, 1, 'minecraft:command_block[conditional=false,facing=up]'],
    [137, 2, 'minecraft:command_block[conditional=false,facing=north]'],
    [137, 3, 'minecraft:command_block[conditional=false,facing=south]'],
    [137, 4, 'minecraft:command_block[conditional=false,facing=west]'],
    [137, 5, 'minecraft:command_block[conditional=false,facing=east]'],
    [137, 8, 'minecraft:command_block[conditional=true,facing=down]'],
    [137, 9, 'minecraft:command_block[conditional=true,facing=up]'],
    [137, 10, 'minecraft:command_block[conditional=true,facing=north]'],
    [137, 11, 'minecraft:command_block[conditional=true,facing=south]'],
    [137, 12, 'minecraft:command_block[conditional=true,facing=west]'],
    [137, 13, 'minecraft:command_block[conditional=true,facing=east]'],
    [138, 0, 'minecraft:beacon'],
    [
        139,
        0,
        'minecraft:cobblestone_wall[east=false,north=false,south=false,up=false,variant=cobblestone,west=false]'
    ],
    [
        139,
        1,
        'minecraft:cobblestone_wall[east=false,north=false,south=false,up=false,variant=mossy_cobblestone,west=false]'
    ],
    [140, 0, 'minecraft:flower_pot[contents=empty,legacy_data=0]'],
    [141, 0, 'minecraft:carrots[age=0]'],
    [141, 1, 'minecraft:carrots[age=1]'],
    [141, 2, 'minecraft:carrots[age=2]'],
    [141, 3, 'minecraft:carrots[age=3]'],
    [141, 4, 'minecraft:carrots[age=4]'],
    [141, 5, 'minecraft:carrots[age=5]'],
    [141, 6, 'minecraft:carrots[age=6]'],
    [141, 7, 'minecraft:carrots[age=7]'],
    [142, 0, 'minecraft:potatoes[age=0]'],
    [142, 1, 'minecraft:potatoes[age=1]'],
    [142, 2, 'minecraft:potatoes[age=2]'],
    [142, 3, 'minecraft:potatoes[age=3]'],
    [142, 4, 'minecraft:potatoes[age=4]'],
    [142, 5, 'minecraft:potatoes[age=5]'],
    [142, 6, 'minecraft:potatoes[age=6]'],
    [142, 7, 'minecraft:potatoes[age=7]'],
    [143, 0, 'minecraft:wooden_button[facing=down,powered=false]'],
    [143, 1, 'minecraft:wooden_button[facing=east,powered=false]'],
    [143, 2, 'minecraft:wooden_button[facing=west,powered=false]'],
    [143, 3, 'minecraft:wooden_button[facing=south,powered=false]'],
    [143, 4, 'minecraft:wooden_button[facing=north,powered=false]'],
    [143, 5, 'minecraft:wooden_button[facing=up,powered=false]'],
    [143, 8, 'minecraft:wooden_button[facing=down,powered=true]'],
    [143, 9, 'minecraft:wooden_button[facing=east,powered=true]'],
    [143, 10, 'minecraft:wooden_button[facing=west,powered=true]'],
    [143, 11, 'minecraft:wooden_button[facing=south,powered=true]'],
    [143, 12, 'minecraft:wooden_button[facing=north,powered=true]'],
    [143, 13, 'minecraft:wooden_button[facing=up,powered=true]'],
    [144, 0, 'minecraft:skull[facing=down,nodrop=false]'],
    [144, 1, 'minecraft:skull[facing=up,nodrop=false]'],
    [144, 2, 'minecraft:skull[facing=north,nodrop=false]'],
    [144, 3, 'minecraft:skull[facing=south,nodrop=false]'],
    [144, 4, 'minecraft:skull[facing=west,nodrop=false]'],
    [144, 5, 'minecraft:skull[facing=east,nodrop=false]'],
    [144, 8, 'minecraft:skull[facing=down,nodrop=true]'],
    [144, 9, 'minecraft:skull[facing=up,nodrop=true]'],
    [144, 10, 'minecraft:skull[facing=north,nodrop=true]'],
    [144, 11, 'minecraft:skull[facing=south,nodrop=true]'],
    [144, 12, 'minecraft:skull[facing=west,nodrop=true]'],
    [144, 13, 'minecraft:skull[facing=east,nodrop=true]'],
    [145, 0, 'minecraft:anvil[damage=0,facing=south]'],
    [145, 1, 'minecraft:anvil[damage=0,facing=west]'],
    [145, 2, 'minecraft:anvil[damage=0,facing=north]'],
    [145, 3, 'minecraft:anvil[damage=0,facing=east]'],
    [145, 4, 'minecraft:anvil[damage=1,facing=south]'],
    [145, 5, 'minecraft:anvil[damage=1,facing=west]'],
    [145, 6, 'minecraft:anvil[damage=1,facing=north]'],
    [145, 7, 'minecraft:anvil[damage=1,facing=east]'],
    [145, 8, 'minecraft:anvil[damage=2,facing=south]'],
    [145, 9, 'minecraft:anvil[damage=2,facing=west]'],
    [145, 10, 'minecraft:anvil[damage=2,facing=north]'],
    [145, 11, 'minecraft:anvil[damage=2,facing=east]'],
    [146, 0, 'minecraft:trapped_chest[facing=north]'],
    [146, 3, 'minecraft:trapped_chest[facing=south]'],
    [146, 4, 'minecraft:trapped_chest[facing=west]'],
    [146, 5, 'minecraft:trapped_chest[facing=east]'],
    [147, 0, 'minecraft:light_weighted_pressure_plate[power=0]'],
    [147, 1, 'minecraft:light_weighted_pressure_plate[power=1]'],
    [147, 2, 'minecraft:light_weighted_pressure_plate[power=2]'],
    [147, 3, 'minecraft:light_weighted_pressure_plate[power=3]'],
    [147, 4, 'minecraft:light_weighted_pressure_plate[power=4]'],
    [147, 5, 'minecraft:light_weighted_pressure_plate[power=5]'],
    [147, 6, 'minecraft:light_weighted_pressure_plate[power=6]'],
    [147, 7, 'minecraft:light_weighted_pressure_plate[power=7]'],
    [147, 8, 'minecraft:light_weighted_pressure_plate[power=8]'],
    [147, 9, 'minecraft:light_weighted_pressure_plate[power=9]'],
    [147, 10, 'minecraft:light_weighted_pressure_plate[power=10]'],
    [147, 11, 'minecraft:light_weighted_pressure_plate[power=11]'],
    [147, 12, 'minecraft:light_weighted_pressure_plate[power=12]'],
    [147, 13, 'minecraft:light_weighted_pressure_plate[power=13]'],
    [147, 14, 'minecraft:light_weighted_pressure_plate[power=14]'],
    [147, 15, 'minecraft:light_weighted_pressure_plate[power=15]'],
    [148, 0, 'minecraft:heavy_weighted_pressure_plate[power=0]'],
    [148, 1, 'minecraft:heavy_weighted_pressure_plate[power=1]'],
    [148, 2, 'minecraft:heavy_weighted_pressure_plate[power=2]'],
    [148, 3, 'minecraft:heavy_weighted_pressure_plate[power=3]'],
    [148, 4, 'minecraft:heavy_weighted_pressure_plate[power=4]'],
    [148, 5, 'minecraft:heavy_weighted_pressure_plate[power=5]'],
    [148, 6, 'minecraft:heavy_weighted_pressure_plate[power=6]'],
    [148, 7, 'minecraft:heavy_weighted_pressure_plate[power=7]'],
    [148, 8, 'minecraft:heavy_weighted_pressure_plate[power=8]'],
    [148, 9, 'minecraft:heavy_weighted_pressure_plate[power=9]'],
    [148, 10, 'minecraft:heavy_weighted_pressure_plate[power=10]'],
    [148, 11, 'minecraft:heavy_weighted_pressure_plate[power=11]'],
    [148, 12, 'minecraft:heavy_weighted_pressure_plate[power=12]'],
    [148, 13, 'minecraft:heavy_weighted_pressure_plate[power=13]'],
    [148, 14, 'minecraft:heavy_weighted_pressure_plate[power=14]'],
    [148, 15, 'minecraft:heavy_weighted_pressure_plate[power=15]'],
    [149, 0, 'minecraft:unpowered_comparator[facing=south,mode=compare,powered=false]'],
    [149, 1, 'minecraft:unpowered_comparator[facing=west,mode=compare,powered=false]'],
    [149, 2, 'minecraft:unpowered_comparator[facing=north,mode=compare,powered=false]'],
    [149, 3, 'minecraft:unpowered_comparator[facing=east,mode=compare,powered=false]'],
    [149, 4, 'minecraft:unpowered_comparator[facing=south,mode=subtract,powered=false]'],
    [149, 5, 'minecraft:unpowered_comparator[facing=west,mode=subtract,powered=false]'],
    [149, 6, 'minecraft:unpowered_comparator[facing=north,mode=subtract,powered=false]'],
    [149, 7, 'minecraft:unpowered_comparator[facing=east,mode=subtract,powered=false]'],
    [149, 8, 'minecraft:unpowered_comparator[facing=south,mode=compare,powered=true]'],
    [149, 9, 'minecraft:unpowered_comparator[facing=west,mode=compare,powered=true]'],
    [149, 10, 'minecraft:unpowered_comparator[facing=north,mode=compare,powered=true]'],
    [149, 11, 'minecraft:unpowered_comparator[facing=east,mode=compare,powered=true]'],
    [149, 12, 'minecraft:unpowered_comparator[facing=south,mode=subtract,powered=true]'],
    [149, 13, 'minecraft:unpowered_comparator[facing=west,mode=subtract,powered=true]'],
    [149, 14, 'minecraft:unpowered_comparator[facing=north,mode=subtract,powered=true]'],
    [149, 15, 'minecraft:unpowered_comparator[facing=east,mode=subtract,powered=true]'],
    [150, 0, 'minecraft:powered_comparator[facing=south,mode=compare,powered=false]'],
    [150, 1, 'minecraft:powered_comparator[facing=west,mode=compare,powered=false]'],
    [150, 2, 'minecraft:powered_comparator[facing=north,mode=compare,powered=false]'],
    [150, 3, 'minecraft:powered_comparator[facing=east,mode=compare,powered=false]'],
    [150, 4, 'minecraft:powered_comparator[facing=south,mode=subtract,powered=false]'],
    [150, 5, 'minecraft:powered_comparator[facing=west,mode=subtract,powered=false]'],
    [150, 6, 'minecraft:powered_comparator[facing=north,mode=subtract,powered=false]'],
    [150, 7, 'minecraft:powered_comparator[facing=east,mode=subtract,powered=false]'],
    [150, 8, 'minecraft:powered_comparator[facing=south,mode=compare,powered=true]'],
    [150, 9, 'minecraft:powered_comparator[facing=west,mode=compare,powered=true]'],
    [150, 10, 'minecraft:powered_comparator[facing=north,mode=compare,powered=true]'],
    [150, 11, 'minecraft:powered_comparator[facing=east,mode=compare,powered=true]'],
    [150, 12, 'minecraft:powered_comparator[facing=south,mode=subtract,powered=true]'],
    [150, 13, 'minecraft:powered_comparator[facing=west,mode=subtract,powered=true]'],
    [150, 14, 'minecraft:powered_comparator[facing=north,mode=subtract,powered=true]'],
    [150, 15, 'minecraft:powered_comparator[facing=east,mode=subtract,powered=true]'],
    [151, 0, 'minecraft:daylight_detector[power=0]'],
    [151, 1, 'minecraft:daylight_detector[power=1]'],
    [151, 2, 'minecraft:daylight_detector[power=2]'],
    [151, 3, 'minecraft:daylight_detector[power=3]'],
    [151, 4, 'minecraft:daylight_detector[power=4]'],
    [151, 5, 'minecraft:daylight_detector[power=5]'],
    [151, 6, 'minecraft:daylight_detector[power=6]'],
    [151, 7, 'minecraft:daylight_detector[power=7]'],
    [151, 8, 'minecraft:daylight_detector[power=8]'],
    [151, 9, 'minecraft:daylight_detector[power=9]'],
    [151, 10, 'minecraft:daylight_detector[power=10]'],
    [151, 11, 'minecraft:daylight_detector[power=11]'],
    [151, 12, 'minecraft:daylight_detector[power=12]'],
    [151, 13, 'minecraft:daylight_detector[power=13]'],
    [151, 14, 'minecraft:daylight_detector[power=14]'],
    [151, 15, 'minecraft:daylight_detector[power=15]'],
    [152, 0, 'minecraft:redstone_block'],
    [153, 0, 'minecraft:quartz_ore'],
    [154, 0, 'minecraft:hopper[enabled=true,facing=down]'],
    [154, 2, 'minecraft:hopper[enabled=true,facing=north]'],
    [154, 3, 'minecraft:hopper[enabled=true,facing=south]'],
    [154, 4, 'minecraft:hopper[enabled=true,facing=west]'],
    [154, 5, 'minecraft:hopper[enabled=true,facing=east]'],
    [154, 8, 'minecraft:hopper[enabled=false,facing=down]'],
    [154, 10, 'minecraft:hopper[enabled=false,facing=north]'],
    [154, 11, 'minecraft:hopper[enabled=false,facing=south]'],
    [154, 12, 'minecraft:hopper[enabled=false,facing=west]'],
    [154, 13, 'minecraft:hopper[enabled=false,facing=east]'],
    [155, 0, 'minecraft:quartz_block[variant=default]'],
    [155, 1, 'minecraft:quartz_block[variant=chiseled]'],
    [155, 2, 'minecraft:quartz_block[variant=lines_y]'],
    [155, 3, 'minecraft:quartz_block[variant=lines_x]'],
    [155, 4, 'minecraft:quartz_block[variant=lines_z]'],
    [156, 0, 'minecraft:quartz_stairs[facing=east,half=bottom,shape=straight]'],
    [156, 1, 'minecraft:quartz_stairs[facing=west,half=bottom,shape=straight]'],
    [156, 2, 'minecraft:quartz_stairs[facing=south,half=bottom,shape=straight]'],
    [156, 3, 'minecraft:quartz_stairs[facing=north,half=bottom,shape=straight]'],
    [156, 4, 'minecraft:quartz_stairs[facing=east,half=top,shape=straight]'],
    [156, 5, 'minecraft:quartz_stairs[facing=west,half=top,shape=straight]'],
    [156, 6, 'minecraft:quartz_stairs[facing=south,half=top,shape=straight]'],
    [156, 7, 'minecraft:quartz_stairs[facing=north,half=top,shape=straight]'],
    [157, 0, 'minecraft:activator_rail[powered=false,shape=north_south]'],
    [157, 1, 'minecraft:activator_rail[powered=false,shape=east_west]'],
    [157, 2, 'minecraft:activator_rail[powered=false,shape=ascending_east]'],
    [157, 3, 'minecraft:activator_rail[powered=false,shape=ascending_west]'],
    [157, 4, 'minecraft:activator_rail[powered=false,shape=ascending_north]'],
    [157, 5, 'minecraft:activator_rail[powered=false,shape=ascending_south]'],
    [157, 8, 'minecraft:activator_rail[powered=true,shape=north_south]'],
    [157, 9, 'minecraft:activator_rail[powered=true,shape=east_west]'],
    [157, 10, 'minecraft:activator_rail[powered=true,shape=ascending_east]'],
    [157, 11, 'minecraft:activator_rail[powered=true,shape=ascending_west]'],
    [157, 12, 'minecraft:activator_rail[powered=true,shape=ascending_north]'],
    [157, 13, 'minecraft:activator_rail[powered=true,shape=ascending_south]'],
    [158, 0, 'minecraft:dropper[facing=down,triggered=false]'],
    [158, 1, 'minecraft:dropper[facing=up,triggered=false]'],
    [158, 2, 'minecraft:dropper[facing=north,triggered=false]'],
    [158, 3, 'minecraft:dropper[facing=south,triggered=false]'],
    [158, 4, 'minecraft:dropper[facing=west,triggered=false]'],
    [158, 5, 'minecraft:dropper[facing=east,triggered=false]'],
    [158, 8, 'minecraft:dropper[facing=down,triggered=true]'],
    [158, 9, 'minecraft:dropper[facing=up,triggered=true]'],
    [158, 10, 'minecraft:dropper[facing=north,triggered=true]'],
    [158, 11, 'minecraft:dropper[facing=south,triggered=true]'],
    [158, 12, 'minecraft:dropper[facing=west,triggered=true]'],
    [158, 13, 'minecraft:dropper[facing=east,triggered=true]'],
    [159, 0, 'minecraft:stained_hardened_clay[color=white]'],
    [159, 1, 'minecraft:stained_hardened_clay[color=orange]'],
    [159, 2, 'minecraft:stained_hardened_clay[color=magenta]'],
    [159, 3, 'minecraft:stained_hardened_clay[color=light_blue]'],
    [159, 4, 'minecraft:stained_hardened_clay[color=yellow]'],
    [159, 5, 'minecraft:stained_hardened_clay[color=lime]'],
    [159, 6, 'minecraft:stained_hardened_clay[color=pink]'],
    [159, 7, 'minecraft:stained_hardened_clay[color=gray]'],
    [159, 8, 'minecraft:stained_hardened_clay[color=silver]'],
    [159, 9, 'minecraft:stained_hardened_clay[color=cyan]'],
    [159, 10, 'minecraft:stained_hardened_clay[color=purple]'],
    [159, 11, 'minecraft:stained_hardened_clay[color=blue]'],
    [159, 12, 'minecraft:stained_hardened_clay[color=brown]'],
    [159, 13, 'minecraft:stained_hardened_clay[color=green]'],
    [159, 14, 'minecraft:stained_hardened_clay[color=red]'],
    [159, 15, 'minecraft:stained_hardened_clay[color=black]'],
    [160, 0, 'minecraft:stained_glass_pane[color=white,east=false,north=false,south=false,west=false]'],
    [160, 1, 'minecraft:stained_glass_pane[color=orange,east=false,north=false,south=false,west=false]'],
    [160, 2, 'minecraft:stained_glass_pane[color=magenta,east=false,north=false,south=false,west=false]'],
    [160, 3, 'minecraft:stained_glass_pane[color=light_blue,east=false,north=false,south=false,west=false]'],
    [160, 4, 'minecraft:stained_glass_pane[color=yellow,east=false,north=false,south=false,west=false]'],
    [160, 5, 'minecraft:stained_glass_pane[color=lime,east=false,north=false,south=false,west=false]'],
    [160, 6, 'minecraft:stained_glass_pane[color=pink,east=false,north=false,south=false,west=false]'],
    [160, 7, 'minecraft:stained_glass_pane[color=gray,east=false,north=false,south=false,west=false]'],
    [160, 8, 'minecraft:stained_glass_pane[color=silver,east=false,north=false,south=false,west=false]'],
    [160, 9, 'minecraft:stained_glass_pane[color=cyan,east=false,north=false,south=false,west=false]'],
    [160, 10, 'minecraft:stained_glass_pane[color=purple,east=false,north=false,south=false,west=false]'],
    [160, 11, 'minecraft:stained_glass_pane[color=blue,east=false,north=false,south=false,west=false]'],
    [160, 12, 'minecraft:stained_glass_pane[color=brown,east=false,north=false,south=false,west=false]'],
    [160, 13, 'minecraft:stained_glass_pane[color=green,east=false,north=false,south=false,west=false]'],
    [160, 14, 'minecraft:stained_glass_pane[color=red,east=false,north=false,south=false,west=false]'],
    [160, 15, 'minecraft:stained_glass_pane[color=black,east=false,north=false,south=false,west=false]'],
    [161, 0, 'minecraft:leaves2[check_decay=false,decayable=true,variant=acacia]'],
    [161, 1, 'minecraft:leaves2[check_decay=false,decayable=true,variant=dark_oak]'],
    [161, 4, 'minecraft:leaves2[check_decay=false,decayable=false,variant=acacia]'],
    [161, 5, 'minecraft:leaves2[check_decay=false,decayable=false,variant=dark_oak]'],
    [161, 8, 'minecraft:leaves2[check_decay=true,decayable=true,variant=acacia]'],
    [161, 9, 'minecraft:leaves2[check_decay=true,decayable=true,variant=dark_oak]'],
    [161, 12, 'minecraft:leaves2[check_decay=true,decayable=false,variant=acacia]'],
    [161, 13, 'minecraft:leaves2[check_decay=true,decayable=false,variant=dark_oak]'],
    [162, 0, 'minecraft:log2[axis=y,variant=acacia]'],
    [162, 1, 'minecraft:log2[axis=y,variant=dark_oak]'],
    [162, 4, 'minecraft:log2[axis=x,variant=acacia]'],
    [162, 5, 'minecraft:log2[axis=x,variant=dark_oak]'],
    [162, 8, 'minecraft:log2[axis=z,variant=acacia]'],
    [162, 9, 'minecraft:log2[axis=z,variant=dark_oak]'],
    [162, 12, 'minecraft:log2[axis=none,variant=acacia]'],
    [162, 13, 'minecraft:log2[axis=none,variant=dark_oak]'],
    [163, 0, 'minecraft:acacia_stairs[facing=east,half=bottom,shape=straight]'],
    [163, 1, 'minecraft:acacia_stairs[facing=west,half=bottom,shape=straight]'],
    [163, 2, 'minecraft:acacia_stairs[facing=south,half=bottom,shape=straight]'],
    [163, 3, 'minecraft:acacia_stairs[facing=north,half=bottom,shape=straight]'],
    [163, 4, 'minecraft:acacia_stairs[facing=east,half=top,shape=straight]'],
    [163, 5, 'minecraft:acacia_stairs[facing=west,half=top,shape=straight]'],
    [163, 6, 'minecraft:acacia_stairs[facing=south,half=top,shape=straight]'],
    [163, 7, 'minecraft:acacia_stairs[facing=north,half=top,shape=straight]'],
    [164, 0, 'minecraft:dark_oak_stairs[facing=east,half=bottom,shape=straight]'],
    [164, 1, 'minecraft:dark_oak_stairs[facing=west,half=bottom,shape=straight]'],
    [164, 2, 'minecraft:dark_oak_stairs[facing=south,half=bottom,shape=straight]'],
    [164, 3, 'minecraft:dark_oak_stairs[facing=north,half=bottom,shape=straight]'],
    [164, 4, 'minecraft:dark_oak_stairs[facing=east,half=top,shape=straight]'],
    [164, 5, 'minecraft:dark_oak_stairs[facing=west,half=top,shape=straight]'],
    [164, 6, 'minecraft:dark_oak_stairs[facing=south,half=top,shape=straight]'],
    [164, 7, 'minecraft:dark_oak_stairs[facing=north,half=top,shape=straight]'],
    [165, 0, 'minecraft:slime'],
    [166, 0, 'minecraft:barrier'],
    [167, 0, 'minecraft:iron_trapdoor[facing=north,half=bottom,open=false]'],
    [167, 1, 'minecraft:iron_trapdoor[facing=south,half=bottom,open=false]'],
    [167, 2, 'minecraft:iron_trapdoor[facing=west,half=bottom,open=false]'],
    [167, 3, 'minecraft:iron_trapdoor[facing=east,half=bottom,open=false]'],
    [167, 4, 'minecraft:iron_trapdoor[facing=north,half=bottom,open=true]'],
    [167, 5, 'minecraft:iron_trapdoor[facing=south,half=bottom,open=true]'],
    [167, 6, 'minecraft:iron_trapdoor[facing=west,half=bottom,open=true]'],
    [167, 7, 'minecraft:iron_trapdoor[facing=east,half=bottom,open=true]'],
    [167, 8, 'minecraft:iron_trapdoor[facing=north,half=top,open=false]'],
    [167, 9, 'minecraft:iron_trapdoor[facing=south,half=top,open=false]'],
    [167, 10, 'minecraft:iron_trapdoor[facing=west,half=top,open=false]'],
    [167, 11, 'minecraft:iron_trapdoor[facing=east,half=top,open=false]'],
    [167, 12, 'minecraft:iron_trapdoor[facing=north,half=top,open=true]'],
    [167, 13, 'minecraft:iron_trapdoor[facing=south,half=top,open=true]'],
    [167, 14, 'minecraft:iron_trapdoor[facing=west,half=top,open=true]'],
    [167, 15, 'minecraft:iron_trapdoor[facing=east,half=top,open=true]'],
    [168, 0, 'minecraft:prismarine[variant=prismarine]'],
    [168, 1, 'minecraft:prismarine[variant=prismarine_bricks]'],
    [168, 2, 'minecraft:prismarine[variant=dark_prismarine]'],
    [169, 0, 'minecraft:sea_lantern'],
    [170, 0, 'minecraft:hay_block[axis=y]'],
    [170, 4, 'minecraft:hay_block[axis=x]'],
    [170, 8, 'minecraft:hay_block[axis=z]'],
    [171, 0, 'minecraft:carpet[color=white]'],
    [171, 1, 'minecraft:carpet[color=orange]'],
    [171, 2, 'minecraft:carpet[color=magenta]'],
    [171, 3, 'minecraft:carpet[color=light_blue]'],
    [171, 4, 'minecraft:carpet[color=yellow]'],
    [171, 5, 'minecraft:carpet[color=lime]'],
    [171, 6, 'minecraft:carpet[color=pink]'],
    [171, 7, 'minecraft:carpet[color=gray]'],
    [171, 8, 'minecraft:carpet[color=silver]'],
    [171, 9, 'minecraft:carpet[color=cyan]'],
    [171, 10, 'minecraft:carpet[color=purple]'],
    [171, 11, 'minecraft:carpet[color=blue]'],
    [171, 12, 'minecraft:carpet[color=brown]'],
    [171, 13, 'minecraft:carpet[color=green]'],
    [171, 14, 'minecraft:carpet[color=red]'],
    [171, 15, 'minecraft:carpet[color=black]'],
    [172, 0, 'minecraft:hardened_clay'],
    [173, 0, 'minecraft:coal_block'],
    [174, 0, 'minecraft:packed_ice'],
    [175, 0, 'minecraft:double_plant[facing=north,half=lower,variant=sunflower]'],
    [175, 1, 'minecraft:double_plant[facing=north,half=lower,variant=syringa]'],
    [175, 2, 'minecraft:double_plant[facing=north,half=lower,variant=double_grass]'],
    [175, 3, 'minecraft:double_plant[facing=north,half=lower,variant=double_fern]'],
    [175, 4, 'minecraft:double_plant[facing=north,half=lower,variant=double_rose]'],
    [175, 5, 'minecraft:double_plant[facing=north,half=lower,variant=paeonia]'],
    [175, 8, 'minecraft:double_plant[facing=north,half=upper,variant=sunflower]'],
    [176, 0, 'minecraft:standing_banner[rotation=0]'],
    [176, 1, 'minecraft:standing_banner[rotation=1]'],
    [176, 2, 'minecraft:standing_banner[rotation=2]'],
    [176, 3, 'minecraft:standing_banner[rotation=3]'],
    [176, 4, 'minecraft:standing_banner[rotation=4]'],
    [176, 5, 'minecraft:standing_banner[rotation=5]'],
    [176, 6, 'minecraft:standing_banner[rotation=6]'],
    [176, 7, 'minecraft:standing_banner[rotation=7]'],
    [176, 8, 'minecraft:standing_banner[rotation=8]'],
    [176, 9, 'minecraft:standing_banner[rotation=9]'],
    [176, 10, 'minecraft:standing_banner[rotation=10]'],
    [176, 11, 'minecraft:standing_banner[rotation=11]'],
    [176, 12, 'minecraft:standing_banner[rotation=12]'],
    [176, 13, 'minecraft:standing_banner[rotation=13]'],
    [176, 14, 'minecraft:standing_banner[rotation=14]'],
    [176, 15, 'minecraft:standing_banner[rotation=15]'],
    [177, 0, 'minecraft:wall_banner[facing=north]'],
    [177, 3, 'minecraft:wall_banner[facing=south]'],
    [177, 4, 'minecraft:wall_banner[facing=west]'],
    [177, 5, 'minecraft:wall_banner[facing=east]'],
    [178, 0, 'minecraft:daylight_detector_inverted[power=0]'],
    [178, 1, 'minecraft:daylight_detector_inverted[power=1]'],
    [178, 2, 'minecraft:daylight_detector_inverted[power=2]'],
    [178, 3, 'minecraft:daylight_detector_inverted[power=3]'],
    [178, 4, 'minecraft:daylight_detector_inverted[power=4]'],
    [178, 5, 'minecraft:daylight_detector_inverted[power=5]'],
    [178, 6, 'minecraft:daylight_detector_inverted[power=6]'],
    [178, 7, 'minecraft:daylight_detector_inverted[power=7]'],
    [178, 8, 'minecraft:daylight_detector_inverted[power=8]'],
    [178, 9, 'minecraft:daylight_detector_inverted[power=9]'],
    [178, 10, 'minecraft:daylight_detector_inverted[power=10]'],
    [178, 11, 'minecraft:daylight_detector_inverted[power=11]'],
    [178, 12, 'minecraft:daylight_detector_inverted[power=12]'],
    [178, 13, 'minecraft:daylight_detector_inverted[power=13]'],
    [178, 14, 'minecraft:daylight_detector_inverted[power=14]'],
    [178, 15, 'minecraft:daylight_detector_inverted[power=15]'],
    [179, 0, 'minecraft:red_sandstone[type=red_sandstone]'],
    [179, 1, 'minecraft:red_sandstone[type=chiseled_red_sandstone]'],
    [179, 2, 'minecraft:red_sandstone[type=smooth_red_sandstone]'],
    [180, 0, 'minecraft:red_sandstone_stairs[facing=east,half=bottom,shape=straight]'],
    [180, 1, 'minecraft:red_sandstone_stairs[facing=west,half=bottom,shape=straight]'],
    [180, 2, 'minecraft:red_sandstone_stairs[facing=south,half=bottom,shape=straight]'],
    [180, 3, 'minecraft:red_sandstone_stairs[facing=north,half=bottom,shape=straight]'],
    [180, 4, 'minecraft:red_sandstone_stairs[facing=east,half=top,shape=straight]'],
    [180, 5, 'minecraft:red_sandstone_stairs[facing=west,half=top,shape=straight]'],
    [180, 6, 'minecraft:red_sandstone_stairs[facing=south,half=top,shape=straight]'],
    [180, 7, 'minecraft:red_sandstone_stairs[facing=north,half=top,shape=straight]'],
    [181, 0, 'minecraft:double_stone_slab2[seamless=false,variant=red_sandstone]'],
    [181, 8, 'minecraft:double_stone_slab2[seamless=true,variant=red_sandstone]'],
    [182, 0, 'minecraft:stone_slab2[half=bottom,variant=red_sandstone]'],
    [182, 8, 'minecraft:stone_slab2[half=top,variant=red_sandstone]'],
    [183, 0, 'minecraft:spruce_fence_gate[facing=south,in_wall=false,open=false,powered=false]'],
    [183, 1, 'minecraft:spruce_fence_gate[facing=west,in_wall=false,open=false,powered=false]'],
    [183, 2, 'minecraft:spruce_fence_gate[facing=north,in_wall=false,open=false,powered=false]'],
    [183, 3, 'minecraft:spruce_fence_gate[facing=east,in_wall=false,open=false,powered=false]'],
    [183, 4, 'minecraft:spruce_fence_gate[facing=south,in_wall=false,open=true,powered=false]'],
    [183, 5, 'minecraft:spruce_fence_gate[facing=west,in_wall=false,open=true,powered=false]'],
    [183, 6, 'minecraft:spruce_fence_gate[facing=north,in_wall=false,open=true,powered=false]'],
    [183, 7, 'minecraft:spruce_fence_gate[facing=east,in_wall=false,open=true,powered=false]'],
    [183, 8, 'minecraft:spruce_fence_gate[facing=south,in_wall=false,open=false,powered=true]'],
    [183, 9, 'minecraft:spruce_fence_gate[facing=west,in_wall=false,open=false,powered=true]'],
    [183, 10, 'minecraft:spruce_fence_gate[facing=north,in_wall=false,open=false,powered=true]'],
    [183, 11, 'minecraft:spruce_fence_gate[facing=east,in_wall=false,open=false,powered=true]'],
    [183, 12, 'minecraft:spruce_fence_gate[facing=south,in_wall=false,open=true,powered=true]'],
    [183, 13, 'minecraft:spruce_fence_gate[facing=west,in_wall=false,open=true,powered=true]'],
    [183, 14, 'minecraft:spruce_fence_gate[facing=north,in_wall=false,open=true,powered=true]'],
    [183, 15, 'minecraft:spruce_fence_gate[facing=east,in_wall=false,open=true,powered=true]'],
    [184, 0, 'minecraft:birch_fence_gate[facing=south,in_wall=false,open=false,powered=false]'],
    [184, 1, 'minecraft:birch_fence_gate[facing=west,in_wall=false,open=false,powered=false]'],
    [184, 2, 'minecraft:birch_fence_gate[facing=north,in_wall=false,open=false,powered=false]'],
    [184, 3, 'minecraft:birch_fence_gate[facing=east,in_wall=false,open=false,powered=false]'],
    [184, 4, 'minecraft:birch_fence_gate[facing=south,in_wall=false,open=true,powered=false]'],
    [184, 5, 'minecraft:birch_fence_gate[facing=west,in_wall=false,open=true,powered=false]'],
    [184, 6, 'minecraft:birch_fence_gate[facing=north,in_wall=false,open=true,powered=false]'],
    [184, 7, 'minecraft:birch_fence_gate[facing=east,in_wall=false,open=true,powered=false]'],
    [184, 8, 'minecraft:birch_fence_gate[facing=south,in_wall=false,open=false,powered=true]'],
    [184, 9, 'minecraft:birch_fence_gate[facing=west,in_wall=false,open=false,powered=true]'],
    [184, 10, 'minecraft:birch_fence_gate[facing=north,in_wall=false,open=false,powered=true]'],
    [184, 11, 'minecraft:birch_fence_gate[facing=east,in_wall=false,open=false,powered=true]'],
    [184, 12, 'minecraft:birch_fence_gate[facing=south,in_wall=false,open=true,powered=true]'],
    [184, 13, 'minecraft:birch_fence_gate[facing=west,in_wall=false,open=true,powered=true]'],
    [184, 14, 'minecraft:birch_fence_gate[facing=north,in_wall=false,open=true,powered=true]'],
    [184, 15, 'minecraft:birch_fence_gate[facing=east,in_wall=false,open=true,powered=true]'],
    [185, 0, 'minecraft:jungle_fence_gate[facing=south,in_wall=false,open=false,powered=false]'],
    [185, 1, 'minecraft:jungle_fence_gate[facing=west,in_wall=false,open=false,powered=false]'],
    [185, 2, 'minecraft:jungle_fence_gate[facing=north,in_wall=false,open=false,powered=false]'],
    [185, 3, 'minecraft:jungle_fence_gate[facing=east,in_wall=false,open=false,powered=false]'],
    [185, 4, 'minecraft:jungle_fence_gate[facing=south,in_wall=false,open=true,powered=false]'],
    [185, 5, 'minecraft:jungle_fence_gate[facing=west,in_wall=false,open=true,powered=false]'],
    [185, 6, 'minecraft:jungle_fence_gate[facing=north,in_wall=false,open=true,powered=false]'],
    [185, 7, 'minecraft:jungle_fence_gate[facing=east,in_wall=false,open=true,powered=false]'],
    [185, 8, 'minecraft:jungle_fence_gate[facing=south,in_wall=false,open=false,powered=true]'],
    [185, 9, 'minecraft:jungle_fence_gate[facing=west,in_wall=false,open=false,powered=true]'],
    [185, 10, 'minecraft:jungle_fence_gate[facing=north,in_wall=false,open=false,powered=true]'],
    [185, 11, 'minecraft:jungle_fence_gate[facing=east,in_wall=false,open=false,powered=true]'],
    [185, 12, 'minecraft:jungle_fence_gate[facing=south,in_wall=false,open=true,powered=true]'],
    [185, 13, 'minecraft:jungle_fence_gate[facing=west,in_wall=false,open=true,powered=true]'],
    [185, 14, 'minecraft:jungle_fence_gate[facing=north,in_wall=false,open=true,powered=true]'],
    [185, 15, 'minecraft:jungle_fence_gate[facing=east,in_wall=false,open=true,powered=true]'],
    [186, 0, 'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open=false,powered=false]'],
    [186, 1, 'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open=false,powered=false]'],
    [186, 2, 'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open=false,powered=false]'],
    [186, 3, 'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open=false,powered=false]'],
    [186, 4, 'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open=true,powered=false]'],
    [186, 5, 'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open=true,powered=false]'],
    [186, 6, 'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open=true,powered=false]'],
    [186, 7, 'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open=true,powered=false]'],
    [186, 8, 'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open=false,powered=true]'],
    [186, 9, 'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open=false,powered=true]'],
    [186, 10, 'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open=false,powered=true]'],
    [186, 11, 'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open=false,powered=true]'],
    [186, 12, 'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open=true,powered=true]'],
    [186, 13, 'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open=true,powered=true]'],
    [186, 14, 'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open=true,powered=true]'],
    [186, 15, 'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open=true,powered=true]'],
    [187, 0, 'minecraft:acacia_fence_gate[facing=south,in_wall=false,open=false,powered=false]'],
    [187, 1, 'minecraft:acacia_fence_gate[facing=west,in_wall=false,open=false,powered=false]'],
    [187, 2, 'minecraft:acacia_fence_gate[facing=north,in_wall=false,open=false,powered=false]'],
    [187, 3, 'minecraft:acacia_fence_gate[facing=east,in_wall=false,open=false,powered=false]'],
    [187, 4, 'minecraft:acacia_fence_gate[facing=south,in_wall=false,open=true,powered=false]'],
    [187, 5, 'minecraft:acacia_fence_gate[facing=west,in_wall=false,open=true,powered=false]'],
    [187, 6, 'minecraft:acacia_fence_gate[facing=north,in_wall=false,open=true,powered=false]'],
    [187, 7, 'minecraft:acacia_fence_gate[facing=east,in_wall=false,open=true,powered=false]'],
    [187, 8, 'minecraft:acacia_fence_gate[facing=south,in_wall=false,open=false,powered=true]'],
    [187, 9, 'minecraft:acacia_fence_gate[facing=west,in_wall=false,open=false,powered=true]'],
    [187, 10, 'minecraft:acacia_fence_gate[facing=north,in_wall=false,open=false,powered=true]'],
    [187, 11, 'minecraft:acacia_fence_gate[facing=east,in_wall=false,open=false,powered=true]'],
    [187, 12, 'minecraft:acacia_fence_gate[facing=south,in_wall=false,open=true,powered=true]'],
    [187, 13, 'minecraft:acacia_fence_gate[facing=west,in_wall=false,open=true,powered=true]'],
    [187, 14, 'minecraft:acacia_fence_gate[facing=north,in_wall=false,open=true,powered=true]'],
    [187, 15, 'minecraft:acacia_fence_gate[facing=east,in_wall=false,open=true,powered=true]'],
    [188, 0, 'minecraft:spruce_fence[east=false,north=false,south=false,west=false]'],
    [189, 0, 'minecraft:birch_fence[east=false,north=false,south=false,west=false]'],
    [190, 0, 'minecraft:jungle_fence[east=false,north=false,south=false,west=false]'],
    [191, 0, 'minecraft:dark_oak_fence[east=false,north=false,south=false,west=false]'],
    [192, 0, 'minecraft:acacia_fence[east=false,north=false,south=false,west=false]'],
    [193, 0, 'minecraft:spruce_door[facing=east,half=lower,hinge=left,open=false,powered=false]'],
    [193, 1, 'minecraft:spruce_door[facing=south,half=lower,hinge=left,open=false,powered=false]'],
    [193, 2, 'minecraft:spruce_door[facing=west,half=lower,hinge=left,open=false,powered=false]'],
    [193, 3, 'minecraft:spruce_door[facing=north,half=lower,hinge=left,open=false,powered=false]'],
    [193, 4, 'minecraft:spruce_door[facing=east,half=lower,hinge=left,open=true,powered=false]'],
    [193, 5, 'minecraft:spruce_door[facing=south,half=lower,hinge=left,open=true,powered=false]'],
    [193, 6, 'minecraft:spruce_door[facing=west,half=lower,hinge=left,open=true,powered=false]'],
    [193, 7, 'minecraft:spruce_door[facing=north,half=lower,hinge=left,open=true,powered=false]'],
    [193, 8, 'minecraft:spruce_door[facing=north,half=upper,hinge=left,open=false,powered=false]'],
    [193, 9, 'minecraft:spruce_door[facing=north,half=upper,hinge=right,open=false,powered=false]'],
    [193, 10, 'minecraft:spruce_door[facing=north,half=upper,hinge=left,open=false,powered=true]'],
    [193, 11, 'minecraft:spruce_door[facing=north,half=upper,hinge=right,open=false,powered=true]'],
    [194, 0, 'minecraft:birch_door[facing=east,half=lower,hinge=left,open=false,powered=false]'],
    [194, 1, 'minecraft:birch_door[facing=south,half=lower,hinge=left,open=false,powered=false]'],
    [194, 2, 'minecraft:birch_door[facing=west,half=lower,hinge=left,open=false,powered=false]'],
    [194, 3, 'minecraft:birch_door[facing=north,half=lower,hinge=left,open=false,powered=false]'],
    [194, 4, 'minecraft:birch_door[facing=east,half=lower,hinge=left,open=true,powered=false]'],
    [194, 5, 'minecraft:birch_door[facing=south,half=lower,hinge=left,open=true,powered=false]'],
    [194, 6, 'minecraft:birch_door[facing=west,half=lower,hinge=left,open=true,powered=false]'],
    [194, 7, 'minecraft:birch_door[facing=north,half=lower,hinge=left,open=true,powered=false]'],
    [194, 8, 'minecraft:birch_door[facing=north,half=upper,hinge=left,open=false,powered=false]'],
    [194, 9, 'minecraft:birch_door[facing=north,half=upper,hinge=right,open=false,powered=false]'],
    [194, 10, 'minecraft:birch_door[facing=north,half=upper,hinge=left,open=false,powered=true]'],
    [194, 11, 'minecraft:birch_door[facing=north,half=upper,hinge=right,open=false,powered=true]'],
    [195, 0, 'minecraft:jungle_door[facing=east,half=lower,hinge=left,open=false,powered=false]'],
    [195, 1, 'minecraft:jungle_door[facing=south,half=lower,hinge=left,open=false,powered=false]'],
    [195, 2, 'minecraft:jungle_door[facing=west,half=lower,hinge=left,open=false,powered=false]'],
    [195, 3, 'minecraft:jungle_door[facing=north,half=lower,hinge=left,open=false,powered=false]'],
    [195, 4, 'minecraft:jungle_door[facing=east,half=lower,hinge=left,open=true,powered=false]'],
    [195, 5, 'minecraft:jungle_door[facing=south,half=lower,hinge=left,open=true,powered=false]'],
    [195, 6, 'minecraft:jungle_door[facing=west,half=lower,hinge=left,open=true,powered=false]'],
    [195, 7, 'minecraft:jungle_door[facing=north,half=lower,hinge=left,open=true,powered=false]'],
    [195, 8, 'minecraft:jungle_door[facing=north,half=upper,hinge=left,open=false,powered=false]'],
    [195, 9, 'minecraft:jungle_door[facing=north,half=upper,hinge=right,open=false,powered=false]'],
    [195, 10, 'minecraft:jungle_door[facing=north,half=upper,hinge=left,open=false,powered=true]'],
    [195, 11, 'minecraft:jungle_door[facing=north,half=upper,hinge=right,open=false,powered=true]'],
    [196, 0, 'minecraft:acacia_door[facing=east,half=lower,hinge=left,open=false,powered=false]'],
    [196, 1, 'minecraft:acacia_door[facing=south,half=lower,hinge=left,open=false,powered=false]'],
    [196, 2, 'minecraft:acacia_door[facing=west,half=lower,hinge=left,open=false,powered=false]'],
    [196, 3, 'minecraft:acacia_door[facing=north,half=lower,hinge=left,open=false,powered=false]'],
    [196, 4, 'minecraft:acacia_door[facing=east,half=lower,hinge=left,open=true,powered=false]'],
    [196, 5, 'minecraft:acacia_door[facing=south,half=lower,hinge=left,open=true,powered=false]'],
    [196, 6, 'minecraft:acacia_door[facing=west,half=lower,hinge=left,open=true,powered=false]'],
    [196, 7, 'minecraft:acacia_door[facing=north,half=lower,hinge=left,open=true,powered=false]'],
    [196, 8, 'minecraft:acacia_door[facing=north,half=upper,hinge=left,open=false,powered=false]'],
    [196, 9, 'minecraft:acacia_door[facing=north,half=upper,hinge=right,open=false,powered=false]'],
    [196, 10, 'minecraft:acacia_door[facing=north,half=upper,hinge=left,open=false,powered=true]'],
    [196, 11, 'minecraft:acacia_door[facing=north,half=upper,hinge=right,open=false,powered=true]'],
    [197, 0, 'minecraft:dark_oak_door[facing=east,half=lower,hinge=left,open=false,powered=false]'],
    [197, 1, 'minecraft:dark_oak_door[facing=south,half=lower,hinge=left,open=false,powered=false]'],
    [197, 2, 'minecraft:dark_oak_door[facing=west,half=lower,hinge=left,open=false,powered=false]'],
    [197, 3, 'minecraft:dark_oak_door[facing=north,half=lower,hinge=left,open=false,powered=false]'],
    [197, 4, 'minecraft:dark_oak_door[facing=east,half=lower,hinge=left,open=true,powered=false]'],
    [197, 5, 'minecraft:dark_oak_door[facing=south,half=lower,hinge=left,open=true,powered=false]'],
    [197, 6, 'minecraft:dark_oak_door[facing=west,half=lower,hinge=left,open=true,powered=false]'],
    [197, 7, 'minecraft:dark_oak_door[facing=north,half=lower,hinge=left,open=true,powered=false]'],
    [197, 8, 'minecraft:dark_oak_door[facing=north,half=upper,hinge=left,open=false,powered=false]'],
    [197, 9, 'minecraft:dark_oak_door[facing=north,half=upper,hinge=right,open=false,powered=false]'],
    [197, 10, 'minecraft:dark_oak_door[facing=north,half=upper,hinge=left,open=false,powered=true]'],
    [197, 11, 'minecraft:dark_oak_door[facing=north,half=upper,hinge=right,open=false,powered=true]'],
    [198, 0, 'minecraft:end_rod[facing=down]'],
    [198, 1, 'minecraft:end_rod[facing=up]'],
    [198, 2, 'minecraft:end_rod[facing=north]'],
    [198, 3, 'minecraft:end_rod[facing=south]'],
    [198, 4, 'minecraft:end_rod[facing=west]'],
    [198, 5, 'minecraft:end_rod[facing=east]'],
    [199, 0, 'minecraft:chorus_plant[down=false,east=false,north=false,south=false,up=false,west=false]'],
    [200, 0, 'minecraft:chorus_flower[age=0]'],
    [200, 1, 'minecraft:chorus_flower[age=1]'],
    [200, 2, 'minecraft:chorus_flower[age=2]'],
    [200, 3, 'minecraft:chorus_flower[age=3]'],
    [200, 4, 'minecraft:chorus_flower[age=4]'],
    [200, 5, 'minecraft:chorus_flower[age=5]'],
    [201, 0, 'minecraft:purpur_block'],
    [202, 0, 'minecraft:purpur_pillar[axis=y]'],
    [202, 4, 'minecraft:purpur_pillar[axis=x]'],
    [202, 8, 'minecraft:purpur_pillar[axis=z]'],
    [203, 0, 'minecraft:purpur_stairs[facing=east,half=bottom,shape=straight]'],
    [203, 1, 'minecraft:purpur_stairs[facing=west,half=bottom,shape=straight]'],
    [203, 2, 'minecraft:purpur_stairs[facing=south,half=bottom,shape=straight]'],
    [203, 3, 'minecraft:purpur_stairs[facing=north,half=bottom,shape=straight]'],
    [203, 4, 'minecraft:purpur_stairs[facing=east,half=top,shape=straight]'],
    [203, 5, 'minecraft:purpur_stairs[facing=west,half=top,shape=straight]'],
    [203, 6, 'minecraft:purpur_stairs[facing=south,half=top,shape=straight]'],
    [203, 7, 'minecraft:purpur_stairs[facing=north,half=top,shape=straight]'],
    [204, 0, 'minecraft:purpur_double_slab[variant=default]'],
    [205, 0, 'minecraft:purpur_slab[half=bottom,variant=default]'],
    [205, 8, 'minecraft:purpur_slab[half=top,variant=default]'],
    [206, 0, 'minecraft:end_bricks'],
    [207, 0, 'minecraft:beetroots[age=0]'],
    [207, 1, 'minecraft:beetroots[age=1]'],
    [207, 2, 'minecraft:beetroots[age=2]'],
    [207, 3, 'minecraft:beetroots[age=3]'],
    [208, 0, 'minecraft:grass_path'],
    [209, 0, 'minecraft:end_gateway'],
    [210, 0, 'minecraft:repeating_command_block[conditional=false,facing=down]'],
    [210, 1, 'minecraft:repeating_command_block[conditional=false,facing=up]'],
    [210, 2, 'minecraft:repeating_command_block[conditional=false,facing=north]'],
    [210, 3, 'minecraft:repeating_command_block[conditional=false,facing=south]'],
    [210, 4, 'minecraft:repeating_command_block[conditional=false,facing=west]'],
    [210, 5, 'minecraft:repeating_command_block[conditional=false,facing=east]'],
    [210, 8, 'minecraft:repeating_command_block[conditional=true,facing=down]'],
    [210, 9, 'minecraft:repeating_command_block[conditional=true,facing=up]'],
    [210, 10, 'minecraft:repeating_command_block[conditional=true,facing=north]'],
    [210, 11, 'minecraft:repeating_command_block[conditional=true,facing=south]'],
    [210, 12, 'minecraft:repeating_command_block[conditional=true,facing=west]'],
    [210, 13, 'minecraft:repeating_command_block[conditional=true,facing=east]'],
    [211, 0, 'minecraft:chain_command_block[conditional=false,facing=down]'],
    [211, 1, 'minecraft:chain_command_block[conditional=false,facing=up]'],
    [211, 2, 'minecraft:chain_command_block[conditional=false,facing=north]'],
    [211, 3, 'minecraft:chain_command_block[conditional=false,facing=south]'],
    [211, 4, 'minecraft:chain_command_block[conditional=false,facing=west]'],
    [211, 5, 'minecraft:chain_command_block[conditional=false,facing=east]'],
    [211, 8, 'minecraft:chain_command_block[conditional=true,facing=down]'],
    [211, 9, 'minecraft:chain_command_block[conditional=true,facing=up]'],
    [211, 10, 'minecraft:chain_command_block[conditional=true,facing=north]'],
    [211, 11, 'minecraft:chain_command_block[conditional=true,facing=south]'],
    [211, 12, 'minecraft:chain_command_block[conditional=true,facing=west]'],
    [211, 13, 'minecraft:chain_command_block[conditional=true,facing=east]'],
    [212, 0, 'minecraft:frosted_ice[age=0]'],
    [212, 1, 'minecraft:frosted_ice[age=1]'],
    [212, 2, 'minecraft:frosted_ice[age=2]'],
    [212, 3, 'minecraft:frosted_ice[age=3]'],
    [213, 0, 'minecraft:magma'],
    [214, 0, 'minecraft:nether_wart_block'],
    [215, 0, 'minecraft:red_nether_brick'],
    [216, 0, 'minecraft:bone_block[axis=y]'],
    [216, 4, 'minecraft:bone_block[axis=x]'],
    [216, 8, 'minecraft:bone_block[axis=z]'],
    [217, 0, 'minecraft:structure_void'],
    [218, 0, 'minecraft:observer[facing=down,powered=false]'],
    [218, 1, 'minecraft:observer[facing=up,powered=false]'],
    [218, 2, 'minecraft:observer[facing=north,powered=false]'],
    [218, 3, 'minecraft:observer[facing=south,powered=false]'],
    [218, 4, 'minecraft:observer[facing=west,powered=false]'],
    [218, 5, 'minecraft:observer[facing=east,powered=false]'],
    [219, 0, 'minecraft:white_shulker_box[facing=down]'],
    [219, 1, 'minecraft:white_shulker_box[facing=up]'],
    [219, 2, 'minecraft:white_shulker_box[facing=north]'],
    [219, 3, 'minecraft:white_shulker_box[facing=south]'],
    [219, 4, 'minecraft:white_shulker_box[facing=west]'],
    [219, 5, 'minecraft:white_shulker_box[facing=east]'],
    [220, 0, 'minecraft:orange_shulker_box[facing=down]'],
    [220, 1, 'minecraft:orange_shulker_box[facing=up]'],
    [220, 2, 'minecraft:orange_shulker_box[facing=north]'],
    [220, 3, 'minecraft:orange_shulker_box[facing=south]'],
    [220, 4, 'minecraft:orange_shulker_box[facing=west]'],
    [220, 5, 'minecraft:orange_shulker_box[facing=east]'],
    [221, 0, 'minecraft:magenta_shulker_box[facing=down]'],
    [221, 1, 'minecraft:magenta_shulker_box[facing=up]'],
    [221, 2, 'minecraft:magenta_shulker_box[facing=north]'],
    [221, 3, 'minecraft:magenta_shulker_box[facing=south]'],
    [221, 4, 'minecraft:magenta_shulker_box[facing=west]'],
    [221, 5, 'minecraft:magenta_shulker_box[facing=east]'],
    [222, 0, 'minecraft:light_blue_shulker_box[facing=down]'],
    [222, 1, 'minecraft:light_blue_shulker_box[facing=up]'],
    [222, 2, 'minecraft:light_blue_shulker_box[facing=north]'],
    [222, 3, 'minecraft:light_blue_shulker_box[facing=south]'],
    [222, 4, 'minecraft:light_blue_shulker_box[facing=west]'],
    [222, 5, 'minecraft:light_blue_shulker_box[facing=east]'],
    [223, 0, 'minecraft:yellow_shulker_box[facing=down]'],
    [223, 1, 'minecraft:yellow_shulker_box[facing=up]'],
    [223, 2, 'minecraft:yellow_shulker_box[facing=north]'],
    [223, 3, 'minecraft:yellow_shulker_box[facing=south]'],
    [223, 4, 'minecraft:yellow_shulker_box[facing=west]'],
    [223, 5, 'minecraft:yellow_shulker_box[facing=east]'],
    [224, 0, 'minecraft:lime_shulker_box[facing=down]'],
    [224, 1, 'minecraft:lime_shulker_box[facing=up]'],
    [224, 2, 'minecraft:lime_shulker_box[facing=north]'],
    [224, 3, 'minecraft:lime_shulker_box[facing=south]'],
    [224, 4, 'minecraft:lime_shulker_box[facing=west]'],
    [224, 5, 'minecraft:lime_shulker_box[facing=east]'],
    [225, 0, 'minecraft:pink_shulker_box[facing=down]'],
    [225, 1, 'minecraft:pink_shulker_box[facing=up]'],
    [225, 2, 'minecraft:pink_shulker_box[facing=north]'],
    [225, 3, 'minecraft:pink_shulker_box[facing=south]'],
    [225, 4, 'minecraft:pink_shulker_box[facing=west]'],
    [225, 5, 'minecraft:pink_shulker_box[facing=east]'],
    [226, 0, 'minecraft:gray_shulker_box[facing=down]'],
    [226, 1, 'minecraft:gray_shulker_box[facing=up]'],
    [226, 2, 'minecraft:gray_shulker_box[facing=north]'],
    [226, 3, 'minecraft:gray_shulker_box[facing=south]'],
    [226, 4, 'minecraft:gray_shulker_box[facing=west]'],
    [226, 5, 'minecraft:gray_shulker_box[facing=east]'],
    [227, 0, 'minecraft:silver_shulker_box[facing=down]'],
    [227, 1, 'minecraft:silver_shulker_box[facing=up]'],
    [227, 2, 'minecraft:silver_shulker_box[facing=north]'],
    [227, 3, 'minecraft:silver_shulker_box[facing=south]'],
    [227, 4, 'minecraft:silver_shulker_box[facing=west]'],
    [227, 5, 'minecraft:silver_shulker_box[facing=east]'],
    [228, 0, 'minecraft:cyan_shulker_box[facing=down]'],
    [228, 1, 'minecraft:cyan_shulker_box[facing=up]'],
    [228, 2, 'minecraft:cyan_shulker_box[facing=north]'],
    [228, 3, 'minecraft:cyan_shulker_box[facing=south]'],
    [228, 4, 'minecraft:cyan_shulker_box[facing=west]'],
    [228, 5, 'minecraft:cyan_shulker_box[facing=east]'],
    [229, 0, 'minecraft:purple_shulker_box[facing=down]'],
    [229, 1, 'minecraft:purple_shulker_box[facing=up]'],
    [229, 2, 'minecraft:purple_shulker_box[facing=north]'],
    [229, 3, 'minecraft:purple_shulker_box[facing=south]'],
    [229, 4, 'minecraft:purple_shulker_box[facing=west]'],
    [229, 5, 'minecraft:purple_shulker_box[facing=east]'],
    [230, 0, 'minecraft:blue_shulker_box[facing=down]'],
    [230, 1, 'minecraft:blue_shulker_box[facing=up]'],
    [230, 2, 'minecraft:blue_shulker_box[facing=north]'],
    [230, 3, 'minecraft:blue_shulker_box[facing=south]'],
    [230, 4, 'minecraft:blue_shulker_box[facing=west]'],
    [230, 5, 'minecraft:blue_shulker_box[facing=east]'],
    [231, 0, 'minecraft:brown_shulker_box[facing=down]'],
    [231, 1, 'minecraft:brown_shulker_box[facing=up]'],
    [231, 2, 'minecraft:brown_shulker_box[facing=north]'],
    [231, 3, 'minecraft:brown_shulker_box[facing=south]'],
    [231, 4, 'minecraft:brown_shulker_box[facing=west]'],
    [231, 5, 'minecraft:brown_shulker_box[facing=east]'],
    [232, 0, 'minecraft:green_shulker_box[facing=down]'],
    [232, 1, 'minecraft:green_shulker_box[facing=up]'],
    [232, 2, 'minecraft:green_shulker_box[facing=north]'],
    [232, 3, 'minecraft:green_shulker_box[facing=south]'],
    [232, 4, 'minecraft:green_shulker_box[facing=west]'],
    [232, 5, 'minecraft:green_shulker_box[facing=east]'],
    [233, 0, 'minecraft:red_shulker_box[facing=down]'],
    [233, 1, 'minecraft:red_shulker_box[facing=up]'],
    [233, 2, 'minecraft:red_shulker_box[facing=north]'],
    [233, 3, 'minecraft:red_shulker_box[facing=south]'],
    [233, 4, 'minecraft:red_shulker_box[facing=west]'],
    [233, 5, 'minecraft:red_shulker_box[facing=east]'],
    [234, 0, 'minecraft:black_shulker_box[facing=down]'],
    [234, 1, 'minecraft:black_shulker_box[facing=up]'],
    [234, 2, 'minecraft:black_shulker_box[facing=north]'],
    [234, 3, 'minecraft:black_shulker_box[facing=south]'],
    [234, 4, 'minecraft:black_shulker_box[facing=west]'],
    [234, 5, 'minecraft:black_shulker_box[facing=east]'],
    [235, 0, 'minecraft:white_glazed_terracotta[facing=south]'],
    [235, 1, 'minecraft:white_glazed_terracotta[facing=west]'],
    [235, 2, 'minecraft:white_glazed_terracotta[facing=north]'],
    [235, 3, 'minecraft:white_glazed_terracotta[facing=east]'],
    [236, 0, 'minecraft:orange_glazed_terracotta[facing=south]'],
    [236, 1, 'minecraft:orange_glazed_terracotta[facing=west]'],
    [236, 2, 'minecraft:orange_glazed_terracotta[facing=north]'],
    [236, 3, 'minecraft:orange_glazed_terracotta[facing=east]'],
    [237, 0, 'minecraft:magenta_glazed_terracotta[facing=south]'],
    [237, 1, 'minecraft:magenta_glazed_terracotta[facing=west]'],
    [237, 2, 'minecraft:magenta_glazed_terracotta[facing=north]'],
    [237, 3, 'minecraft:magenta_glazed_terracotta[facing=east]'],
    [238, 0, 'minecraft:light_blue_glazed_terracotta[facing=south]'],
    [238, 1, 'minecraft:light_blue_glazed_terracotta[facing=west]'],
    [238, 2, 'minecraft:light_blue_glazed_terracotta[facing=north]'],
    [238, 3, 'minecraft:light_blue_glazed_terracotta[facing=east]'],
    [239, 0, 'minecraft:yellow_glazed_terracotta[facing=south]'],
    [239, 1, 'minecraft:yellow_glazed_terracotta[facing=west]'],
    [239, 2, 'minecraft:yellow_glazed_terracotta[facing=north]'],
    [239, 3, 'minecraft:yellow_glazed_terracotta[facing=east]'],
    [240, 0, 'minecraft:lime_glazed_terracotta[facing=south]'],
    [240, 1, 'minecraft:lime_glazed_terracotta[facing=west]'],
    [240, 2, 'minecraft:lime_glazed_terracotta[facing=north]'],
    [240, 3, 'minecraft:lime_glazed_terracotta[facing=east]'],
    [241, 0, 'minecraft:pink_glazed_terracotta[facing=south]'],
    [241, 1, 'minecraft:pink_glazed_terracotta[facing=west]'],
    [241, 2, 'minecraft:pink_glazed_terracotta[facing=north]'],
    [241, 3, 'minecraft:pink_glazed_terracotta[facing=east]'],
    [242, 0, 'minecraft:gray_glazed_terracotta[facing=south]'],
    [242, 1, 'minecraft:gray_glazed_terracotta[facing=west]'],
    [242, 2, 'minecraft:gray_glazed_terracotta[facing=north]'],
    [242, 3, 'minecraft:gray_glazed_terracotta[facing=east]'],
    [243, 0, 'minecraft:silver_glazed_terracotta[facing=south]'],
    [243, 1, 'minecraft:silver_glazed_terracotta[facing=west]'],
    [243, 2, 'minecraft:silver_glazed_terracotta[facing=north]'],
    [243, 3, 'minecraft:silver_glazed_terracotta[facing=east]'],
    [244, 0, 'minecraft:cyan_glazed_terracotta[facing=south]'],
    [244, 1, 'minecraft:cyan_glazed_terracotta[facing=west]'],
    [244, 2, 'minecraft:cyan_glazed_terracotta[facing=north]'],
    [244, 3, 'minecraft:cyan_glazed_terracotta[facing=east]'],
    [245, 0, 'minecraft:purple_glazed_terracotta[facing=south]'],
    [245, 1, 'minecraft:purple_glazed_terracotta[facing=west]'],
    [245, 2, 'minecraft:purple_glazed_terracotta[facing=north]'],
    [245, 3, 'minecraft:purple_glazed_terracotta[facing=east]'],
    [246, 0, 'minecraft:blue_glazed_terracotta[facing=south]'],
    [246, 1, 'minecraft:blue_glazed_terracotta[facing=west]'],
    [246, 2, 'minecraft:blue_glazed_terracotta[facing=north]'],
    [246, 3, 'minecraft:blue_glazed_terracotta[facing=east]'],
    [247, 0, 'minecraft:brown_glazed_terracotta[facing=south]'],
    [247, 1, 'minecraft:brown_glazed_terracotta[facing=west]'],
    [247, 2, 'minecraft:brown_glazed_terracotta[facing=north]'],
    [247, 3, 'minecraft:brown_glazed_terracotta[facing=east]'],
    [248, 0, 'minecraft:green_glazed_terracotta[facing=south]'],
    [248, 1, 'minecraft:green_glazed_terracotta[facing=west]'],
    [248, 2, 'minecraft:green_glazed_terracotta[facing=north]'],
    [248, 3, 'minecraft:green_glazed_terracotta[facing=east]'],
    [249, 0, 'minecraft:red_glazed_terracotta[facing=south]'],
    [249, 1, 'minecraft:red_glazed_terracotta[facing=west]'],
    [249, 2, 'minecraft:red_glazed_terracotta[facing=north]'],
    [249, 3, 'minecraft:red_glazed_terracotta[facing=east]'],
    [250, 0, 'minecraft:black_glazed_terracotta[facing=south]'],
    [250, 1, 'minecraft:black_glazed_terracotta[facing=west]'],
    [250, 2, 'minecraft:black_glazed_terracotta[facing=north]'],
    [250, 3, 'minecraft:black_glazed_terracotta[facing=east]'],
    [251, 0, 'minecraft:concrete[color=white]'],
    [251, 1, 'minecraft:concrete[color=orange]'],
    [251, 2, 'minecraft:concrete[color=magenta]'],
    [251, 3, 'minecraft:concrete[color=light_blue]'],
    [251, 4, 'minecraft:concrete[color=yellow]'],
    [251, 5, 'minecraft:concrete[color=lime]'],
    [251, 6, 'minecraft:concrete[color=pink]'],
    [251, 7, 'minecraft:concrete[color=gray]'],
    [251, 8, 'minecraft:concrete[color=silver]'],
    [251, 9, 'minecraft:concrete[color=cyan]'],
    [251, 10, 'minecraft:concrete[color=purple]'],
    [251, 11, 'minecraft:concrete[color=blue]'],
    [251, 12, 'minecraft:concrete[color=brown]'],
    [251, 13, 'minecraft:concrete[color=green]'],
    [251, 14, 'minecraft:concrete[color=red]'],
    [251, 15, 'minecraft:concrete[color=black]'],
    [252, 0, 'minecraft:concrete_powder[color=white]'],
    [252, 1, 'minecraft:concrete_powder[color=orange]'],
    [252, 2, 'minecraft:concrete_powder[color=magenta]'],
    [252, 3, 'minecraft:concrete_powder[color=light_blue]'],
    [252, 4, 'minecraft:concrete_powder[color=yellow]'],
    [252, 5, 'minecraft:concrete_powder[color=lime]'],
    [252, 6, 'minecraft:concrete_powder[color=pink]'],
    [252, 7, 'minecraft:concrete_powder[color=gray]'],
    [252, 8, 'minecraft:concrete_powder[color=silver]'],
    [252, 9, 'minecraft:concrete_powder[color=cyan]'],
    [252, 10, 'minecraft:concrete_powder[color=purple]'],
    [252, 11, 'minecraft:concrete_powder[color=blue]'],
    [252, 12, 'minecraft:concrete_powder[color=brown]'],
    [252, 13, 'minecraft:concrete_powder[color=green]'],
    [252, 14, 'minecraft:concrete_powder[color=red]'],
    [252, 15, 'minecraft:concrete_powder[color=black]'],
    [255, 0, 'minecraft:structure_block[mode=save]'],
    [255, 1, 'minecraft:structure_block[mode=load]'],
    [255, 2, 'minecraft:structure_block[mode=corner]'],
    [255, 3, 'minecraft:structure_block[mode=data]']
];
exports.default = Blocks;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Effects {
    static get1_12NominalIDFrom1_12NumericID(input) {
        const arr = Effects.NumericID_NominalID.find(v => v[0] === input);
        if (arr) {
            return arr[1];
        }
        else {
            throw `Unknwon ench ID: '${input}'`;
        }
    }
}
Effects.NumericID_NominalID = [
    [1, 'minecraft:speed'],
    [2, 'minecraft:slowness'],
    [3, 'minecraft:haste'],
    [4, 'minecraft:mining_fatigue'],
    [5, 'minecraft:strength'],
    [6, 'minecraft:instant_health'],
    [7, 'minecraft:instant_damage'],
    [8, 'minecraft:jump_boost'],
    [9, 'minecraft:nausea'],
    [10, 'minecraft:regeneration'],
    [11, 'minecraft:resistance'],
    [12, 'minecraft:fire_resistance'],
    [13, 'minecraft:water_breathing'],
    [14, 'minecraft:invisibility'],
    [15, 'minecraft:blindness'],
    [16, 'minecraft:night_vision'],
    [17, 'minecraft:hunger'],
    [18, 'minecraft:weakness'],
    [19, 'minecraft:poison'],
    [20, 'minecraft:wither'],
    [21, 'minecraft:health_boost'],
    [22, 'minecraft:absorption'],
    [23, 'minecraft:saturation'],
    [24, 'minecraft:glowing'],
    [25, 'minecraft:levitation'],
    [26, 'minecraft:luck'],
    [27, 'minecraft:unluck']
];
exports.default = Effects;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Enches {
    static get1_12NominalIDFrom1_12NumericID(input) {
        const arr = Enches.NumericID_NominalID.find(v => v[0] === input);
        if (arr) {
            return arr[1];
        }
        else {
            throw `Unknwon ench ID: '${input}'`;
        }
    }
}
Enches.NumericID_NominalID = [
    [0, 'minecraft:protection'],
    [1, 'minecraft:fire_protection'],
    [2, 'minecraft:feather_falling'],
    [3, 'minecraft:blast_protection'],
    [4, 'minecraft:projectile_protection'],
    [5, 'minecraft:respiration'],
    [6, 'minecraft:aqua_affinity'],
    [7, 'minecraft:thorns'],
    [8, 'minecraft:depth_strider'],
    [9, 'minecraft:frost_walker'],
    [10, 'minecraft:binding_curse'],
    [16, 'minecraft:sharpness'],
    [17, 'minecraft:smite'],
    [18, 'minecraft:bane_of_arthropods'],
    [19, 'minecraft:knockback'],
    [20, 'minecraft:fire_aspect'],
    [21, 'minecraft:looting'],
    [22, 'minecraft:sweeping'],
    [32, 'minecraft:efficiency'],
    [33, 'minecraft:silk_touch'],
    [34, 'minecraft:unbreaking'],
    [35, 'minecraft:fortune'],
    [48, 'minecraft:power'],
    [49, 'minecraft:punch'],
    [50, 'minecraft:flame'],
    [51, 'minecraft:infinity'],
    [61, 'minecraft:luck_of_the_sea'],
    [62, 'minecraft:lure'],
    [70, 'minecraft:mending'],
    [71, 'minecraft:vanishing_curse']
];
exports.default = Enches;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Entities {
    static get1_13NominalIDFrom1_12NominalID(input) {
        const arr = Entities.NominalID_NominalID.find(v => v[0] === input);
        if (arr) {
            return arr[1];
        }
        else {
            return input;
        }
    }
    static get1_12NominalIDFrom1_10FuckingID(input) {
        const arr = Entities.FuckingID_NominalID.find(v => v[0] === input);
        if (arr) {
            return arr[1];
        }
        else {
            return `Unknown fucking 1.10 entity ID: '${input}'`;
        }
    }
}
Entities.NominalID_NominalID = [
    ['minecraft:xp_orb', 'minecraft:experience_orb'],
    ['minecraft:xp_bottle', 'minecraft:experience_bottle'],
    ['minecraft:eye_of_ender_signal', 'minecraft:eye_of_ender'],
    ['minecraft:ender_crystal', 'minecraft:end_crystal'],
    ['minecraft:fireworks_rocket', 'minecraft:firework_rocket'],
    ['minecraft:commandblock_minecart', 'minecraft:command_block_minecart'],
    ['minecraft:snowman', 'minecraft:snow_golem'],
    ['minecraft:villager_golem', 'minecraft:iron_golem'],
    ['minecraft:evocation_fangs', 'minecraft:evoker_fangs'],
    ['minecraft:vindication_illager', 'minecraft:vindicator'],
    ['minecraft:evocation_illager', 'minecraft:evoker'],
    ['minecraft:illusion_illager', 'minecraft:illusioner']
];
Entities.FuckingID_NominalID = [
    ['AreaEffectCloud', 'area_effect_cloud'],
    ['ArmorStand', 'armor_stand'],
    ['Cauldron', 'brewing_stand'],
    ['CaveSpider', 'cave_spider'],
    ['MinecartChest', 'chest_minecart'],
    ['Control', 'command_block'],
    ['MinecartCommandBlock', 'commandblock_minecart'],
    ['DLDetector', 'daylight_detector'],
    ['Trap', 'dispenser'],
    ['DragonFireball', 'dragon_fireball'],
    ['ThrownEgg', 'egg'],
    ['EnchantTable', 'enchanting_table'],
    ['EndGateway', 'end_gateway'],
    ['AirPortal', 'end_portal'],
    ['EnderChest', 'ender_chest'],
    ['EnderCrystal', 'ender_crystal'],
    ['EnderDragon', 'ender_dragon'],
    ['ThrownEnderpearl', 'ender_pearl'],
    ['EyeOfEnderSignal', 'eye_of_ender_signal'],
    ['FallingSand', 'falling_block'],
    ['FireworksRocketEntity', 'fireworks_rocket'],
    ['FlowerPot', 'flower_pot'],
    ['MinecartFurnace', 'furnace_minecart'],
    ['MinecartHopper', 'hopper_minecart'],
    ['EntityHorse', 'horse'],
    ['ItemFrame', 'item_frame'],
    ['RecordPlayer', 'jukebox'],
    ['LeashKnot', 'leash_knot'],
    ['LightningBolt', 'lightning_bolt'],
    ['LavaSlime', 'magma_cube'],
    ['MinecartRideable', 'minecart'],
    ['MobSpawner', 'mob_spawner'],
    ['MushroomCow', 'mooshroom'],
    ['Music', 'noteblock'],
    ['Ozelot', 'ocelot'],
    ['PolarBear', 'polar_bear'],
    ['ShulkerBullet', 'shulker_bullet'],
    ['SmallFireball', 'small_fireball'],
    ['SpectralArrow', 'spectral_arrow'],
    ['ThrownPotion', 'potion'],
    ['MinecartSpawner', 'spawner_minecart'],
    ['Structure', 'structure_block'],
    ['PrimedTnt', 'tnt'],
    ['MinecartTNT', 'tnt_minecart'],
    ['VillagerGolem', 'villager_golem'],
    ['WitherBoss', 'wither'],
    ['WitherSkull', 'wither_skull'],
    ['ThrownExpBottle', 'xp_bottle'],
    ['XPOrb', 'xp_orb'],
    ['PigZombie', 'zombie_pigman']
];
exports.default = Entities;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Items {
    static is1_12NominalIDExist(id) {
        if (id.slice(0, 10) !== 'minecraft:') {
            id = `minecraft:${id}`;
        }
        const arr = Items.NumericID_NominalID.find(v => v[1] === id);
        return arr ? true : false;
    }
    static hasEntityTag(id) {
        if (id.slice(0, 10) !== 'minecraft:') {
            id = `minecraft:${id}`;
        }
        return ['armor_stand', 'spawn_egg'].indexOf(id) !== -1;
    }
    static get1_13NominalIDFrom1_12NominalIDWithDataValue(str, data = 0) {
        if (data === -1) {
            data = 0;
        }
        if (str.slice(0, 10) !== 'minecraft:') {
            str = 'minecraft:' + str;
        }
        str = `${str}.${data}`;
        const arr = Items.StringIDWithDataValue_NominalID.find(v => v[0] === str);
        if (arr) {
            return arr[1];
        }
        else {
            return str.split('.')[0];
        }
    }
    static get1_12NominalIDFrom1_12NumericID(input) {
        const arr = Items.NumericID_NominalID.find(v => v[0] === input);
        if (arr) {
            return arr[1];
        }
        else {
            throw `Unknown item numeric ID: '${input}'`;
        }
    }
    static isDamageItem(input) {
        if (input.slice(0, 10) !== 'minecraft:') {
            input = 'minecraft:' + input;
        }
        return Items.DamageItemIDs.indexOf(input) !== -1;
    }
    static isMapItem(input) {
        if (input.slice(0, 10) !== 'minecraft:') {
            input = 'minecraft:' + input;
        }
        return Items.MapItemIDs.indexOf(input) !== -1;
    }
    static getNominalColorFromNumericColor(input, suffix) {
        const arr = Items.NumericColor_NominalColor.find(v => v[0] === input.toString());
        if (arr) {
            return `${arr[1]}${suffix}`;
        }
        else {
            throw `Unknown color value for bed: ${input}`;
        }
    }
}
Items.NumericID_NominalID = [
    [0, 'minecraft:air'],
    [1, 'minecraft:stone'],
    [2, 'minecraft:grass'],
    [3, 'minecraft:dirt'],
    [4, 'minecraft:cobblestone'],
    [5, 'minecraft:planks'],
    [6, 'minecraft:sapling'],
    [7, 'minecraft:bedrock'],
    [8, 'minecraft:flowing_water'],
    [9, 'minecraft:water'],
    [10, 'minecraft:flowing_lava'],
    [11, 'minecraft:lava'],
    [12, 'minecraft:sand'],
    [13, 'minecraft:gravel'],
    [14, 'minecraft:gold_ore'],
    [15, 'minecraft:iron_ore'],
    [16, 'minecraft:coal_ore'],
    [17, 'minecraft:log'],
    [18, 'minecraft:leaves'],
    [19, 'minecraft:sponge'],
    [20, 'minecraft:glass'],
    [21, 'minecraft:lapis_ore'],
    [22, 'minecraft:lapis_block'],
    [23, 'minecraft:dispenser'],
    [24, 'minecraft:sandstone'],
    [25, 'minecraft:noteblock'],
    [26, 'minecraft:bed'],
    [27, 'minecraft:golden_rail'],
    [28, 'minecraft:detector_rail'],
    [29, 'minecraft:sticky_piston'],
    [30, 'minecraft:web'],
    [31, 'minecraft:tallgrass'],
    [32, 'minecraft:deadbush'],
    [33, 'minecraft:piston'],
    [34, 'minecraft:piston_head'],
    [35, 'minecraft:wool'],
    [36, 'minecraft:piston_extension'],
    [37, 'minecraft:yellow_flower'],
    [38, 'minecraft:red_flower'],
    [39, 'minecraft:brown_mushroom'],
    [40, 'minecraft:red_mushroom'],
    [41, 'minecraft:gold_block'],
    [42, 'minecraft:iron_block'],
    [43, 'minecraft:double_stone_slab'],
    [44, 'minecraft:stone_slab'],
    [45, 'minecraft:brick_block'],
    [46, 'minecraft:tnt'],
    [47, 'minecraft:bookshelf'],
    [48, 'minecraft:mossy_cobblestone'],
    [49, 'minecraft:obsidian'],
    [50, 'minecraft:torch'],
    [51, 'minecraft:fire'],
    [52, 'minecraft:mob_spawner'],
    [53, 'minecraft:oak_stairs'],
    [54, 'minecraft:chest'],
    [55, 'minecraft:redstone_wire'],
    [56, 'minecraft:diamond_ore'],
    [57, 'minecraft:diamond_block'],
    [58, 'minecraft:crafting_table'],
    [59, 'minecraft:wheat'],
    [60, 'minecraft:farmland'],
    [61, 'minecraft:furnace'],
    [62, 'minecraft:lit_furnace'],
    [63, 'minecraft:standing_sign'],
    [64, 'minecraft:wooden_door'],
    [65, 'minecraft:ladder'],
    [66, 'minecraft:rail'],
    [67, 'minecraft:stone_stairs'],
    [68, 'minecraft:wall_sign'],
    [69, 'minecraft:lever'],
    [70, 'minecraft:stone_pressure_plate'],
    [71, 'minecraft:iron_door'],
    [72, 'minecraft:wooden_pressure_plate'],
    [73, 'minecraft:redstone_ore'],
    [74, 'minecraft:lit_redstone_ore'],
    [75, 'minecraft:unlit_redstone_torch'],
    [76, 'minecraft:redstone_torch'],
    [77, 'minecraft:stone_button'],
    [78, 'minecraft:snow_layer'],
    [79, 'minecraft:ice'],
    [80, 'minecraft:snow'],
    [81, 'minecraft:cactus'],
    [82, 'minecraft:clay'],
    [83, 'minecraft:reeds'],
    [84, 'minecraft:jukebox'],
    [85, 'minecraft:fence'],
    [86, 'minecraft:pumpkin'],
    [87, 'minecraft:netherrack'],
    [88, 'minecraft:soul_sand'],
    [89, 'minecraft:glowstone'],
    [90, 'minecraft:portal'],
    [91, 'minecraft:lit_pumpkin'],
    [92, 'minecraft:cake'],
    [93, 'minecraft:unpowered_repeater'],
    [94, 'minecraft:powered_repeater'],
    [95, 'minecraft:stained_glass'],
    [96, 'minecraft:trapdoor'],
    [97, 'minecraft:monster_egg'],
    [98, 'minecraft:stonebrick'],
    [99, 'minecraft:brown_mushroom_block'],
    [100, 'minecraft:red_mushroom_block'],
    [101, 'minecraft:iron_bars'],
    [102, 'minecraft:glass_pane'],
    [103, 'minecraft:melon_block'],
    [104, 'minecraft:pumpkin_stem'],
    [105, 'minecraft:melon_stem'],
    [106, 'minecraft:vine'],
    [107, 'minecraft:fence_gate'],
    [108, 'minecraft:brick_stairs'],
    [109, 'minecraft:stone_brick_stairs'],
    [110, 'minecraft:mycelium'],
    [111, 'minecraft:waterlily'],
    [112, 'minecraft:nether_brick'],
    [113, 'minecraft:nether_brick_fence'],
    [114, 'minecraft:nether_brick_stairs'],
    [115, 'minecraft:nether_wart'],
    [116, 'minecraft:enchanting_table'],
    [117, 'minecraft:brewing_stand'],
    [118, 'minecraft:cauldron'],
    [119, 'minecraft:end_portal'],
    [120, 'minecraft:end_portal_frame'],
    [121, 'minecraft:end_stone'],
    [122, 'minecraft:dragon_egg'],
    [123, 'minecraft:redstone_lamp'],
    [124, 'minecraft:lit_redstone_lamp'],
    [125, 'minecraft:double_wooden_slab'],
    [126, 'minecraft:wooden_slab'],
    [127, 'minecraft:cocoa'],
    [128, 'minecraft:sandstone_stairs'],
    [129, 'minecraft:emerald_ore'],
    [130, 'minecraft:ender_chest'],
    [131, 'minecraft:tripwire_hook'],
    [132, 'minecraft:tripwire'],
    [133, 'minecraft:emerald_block'],
    [134, 'minecraft:spruce_stairs'],
    [135, 'minecraft:birch_stairs'],
    [136, 'minecraft:jungle_stairs'],
    [137, 'minecraft:command_block'],
    [138, 'minecraft:beacon'],
    [139, 'minecraft:cobblestone_wall'],
    [140, 'minecraft:flower_pot'],
    [141, 'minecraft:carrots'],
    [142, 'minecraft:potatoes'],
    [143, 'minecraft:wooden_button'],
    [144, 'minecraft:skull'],
    [145, 'minecraft:anvil'],
    [146, 'minecraft:trapped_chest'],
    [147, 'minecraft:light_weighted_pressure_plate'],
    [148, 'minecraft:heavy_weighted_pressure_plate'],
    [149, 'minecraft:unpowered_comparator'],
    [150, 'minecraft:powered_comparator'],
    [151, 'minecraft:daylight_detector'],
    [152, 'minecraft:redstone_block'],
    [153, 'minecraft:quartz_ore'],
    [154, 'minecraft:hopper'],
    [155, 'minecraft:quartz_block'],
    [156, 'minecraft:quartz_stairs'],
    [157, 'minecraft:activator_rail'],
    [158, 'minecraft:dropper'],
    [159, 'minecraft:stained_hardened_clay'],
    [160, 'minecraft:stained_glass_pane'],
    [161, 'minecraft:leaves2'],
    [162, 'minecraft:log2'],
    [163, 'minecraft:acacia_stairs'],
    [164, 'minecraft:dark_oak_stairs'],
    [165, 'minecraft:slime'],
    [166, 'minecraft:barrier'],
    [167, 'minecraft:iron_trapdoor'],
    [168, 'minecraft:prismarine'],
    [169, 'minecraft:sea_lantern'],
    [170, 'minecraft:hay_block'],
    [171, 'minecraft:carpet'],
    [172, 'minecraft:hardened_clay'],
    [173, 'minecraft:coal_block'],
    [174, 'minecraft:packed_ice'],
    [175, 'minecraft:double_plant'],
    [176, 'minecraft:standing_banner'],
    [177, 'minecraft:wall_banner'],
    [178, 'minecraft:daylight_detector_inverted'],
    [179, 'minecraft:red_sandstone'],
    [180, 'minecraft:red_sandstone_stairs'],
    [181, 'minecraft:double_stone_slab2'],
    [182, 'minecraft:stone_slab2'],
    [183, 'minecraft:spruce_fence_gate'],
    [184, 'minecraft:birch_fence_gate'],
    [185, 'minecraft:jungle_fence_gate'],
    [186, 'minecraft:dark_oak_fence_gate'],
    [187, 'minecraft:acacia_fence_gate'],
    [188, 'minecraft:spruce_fence'],
    [189, 'minecraft:birch_fence'],
    [190, 'minecraft:jungle_fence'],
    [191, 'minecraft:dark_oak_fence'],
    [192, 'minecraft:acacia_fence'],
    [193, 'minecraft:spruce_door'],
    [194, 'minecraft:birch_door'],
    [195, 'minecraft:jungle_door'],
    [196, 'minecraft:acacia_door'],
    [197, 'minecraft:dark_oak_door'],
    [198, 'minecraft:end_rod'],
    [199, 'minecraft:chorus_plant'],
    [200, 'minecraft:chorus_flower'],
    [201, 'minecraft:purpur_block'],
    [202, 'minecraft:purpur_pillar'],
    [203, 'minecraft:purpur_stairs'],
    [204, 'minecraft:purpur_double_slab'],
    [205, 'minecraft:purpur_slab'],
    [206, 'minecraft:end_bricks'],
    [207, 'minecraft:beetroots'],
    [208, 'minecraft:grass_path'],
    [209, 'minecraft:end_gateway'],
    [210, 'minecraft:repeating_command_block'],
    [211, 'minecraft:chain_command_block'],
    [212, 'minecraft:frosted_ice'],
    [213, 'minecraft:magma'],
    [214, 'minecraft:nether_wart_block'],
    [215, 'minecraft:red_nether_brick'],
    [216, 'minecraft:bone_block'],
    [217, 'minecraft:structure_void'],
    [218, 'minecraft:observer'],
    [219, 'minecraft:white_shulker_box'],
    [220, 'minecraft:orange_shulker_box'],
    [221, 'minecraft:magenta_shulker_box'],
    [222, 'minecraft:light_blue_shulker_box'],
    [223, 'minecraft:yellow_shulker_box'],
    [224, 'minecraft:lime_shulker_box'],
    [225, 'minecraft:pink_shulker_box'],
    [226, 'minecraft:gray_shulker_box'],
    [227, 'minecraft:silver_shulker_box'],
    [228, 'minecraft:cyan_shulker_box'],
    [229, 'minecraft:purple_shulker_box'],
    [230, 'minecraft:blue_shulker_box'],
    [231, 'minecraft:brown_shulker_box'],
    [232, 'minecraft:green_shulker_box'],
    [233, 'minecraft:red_shulker_box'],
    [234, 'minecraft:black_shulker_box'],
    [235, 'minecraft:white_glazed_terracotta'],
    [236, 'minecraft:orange_glazed_terracotta'],
    [237, 'minecraft:magenta_glazed_terracotta'],
    [238, 'minecraft:light_blue_glazed_terracotta'],
    [239, 'minecraft:yellow_glazed_terracotta'],
    [240, 'minecraft:lime_glazed_terracotta'],
    [241, 'minecraft:pink_glazed_terracotta'],
    [242, 'minecraft:gray_glazed_terracotta'],
    [243, 'minecraft:silver_glazed_terracotta'],
    [244, 'minecraft:cyan_glazed_terracotta'],
    [245, 'minecraft:purple_glazed_terracotta'],
    [246, 'minecraft:blue_glazed_terracotta'],
    [247, 'minecraft:brown_glazed_terracotta'],
    [248, 'minecraft:green_glazed_terracotta'],
    [249, 'minecraft:red_glazed_terracotta'],
    [250, 'minecraft:black_glazed_terracotta'],
    [251, 'minecraft:concrete'],
    [252, 'minecraft:concrete_powder'],
    [255, 'minecraft:structure_block'],
    [256, 'minecraft:iron_shovel'],
    [257, 'minecraft:iron_pickaxe'],
    [258, 'minecraft:iron_axe'],
    [259, 'minecraft:flint_and_steel'],
    [260, 'minecraft:apple'],
    [261, 'minecraft:bow'],
    [262, 'minecraft:arrow'],
    [263, 'minecraft:coal'],
    [264, 'minecraft:diamond'],
    [265, 'minecraft:iron_ingot'],
    [266, 'minecraft:gold_ingot'],
    [267, 'minecraft:iron_sword'],
    [268, 'minecraft:wooden_sword'],
    [269, 'minecraft:wooden_shovel'],
    [270, 'minecraft:wooden_pickaxe'],
    [271, 'minecraft:wooden_axe'],
    [272, 'minecraft:stone_sword'],
    [273, 'minecraft:stone_shovel'],
    [274, 'minecraft:stone_pickaxe'],
    [275, 'minecraft:stone_axe'],
    [276, 'minecraft:diamond_sword'],
    [277, 'minecraft:diamond_shovel'],
    [278, 'minecraft:diamond_pickaxe'],
    [279, 'minecraft:diamond_axe'],
    [280, 'minecraft:stick'],
    [281, 'minecraft:bowl'],
    [282, 'minecraft:mushroom_stew'],
    [283, 'minecraft:golden_sword'],
    [284, 'minecraft:golden_shovel'],
    [285, 'minecraft:golden_pickaxe'],
    [286, 'minecraft:golden_axe'],
    [287, 'minecraft:string'],
    [288, 'minecraft:feather'],
    [289, 'minecraft:gunpowder'],
    [290, 'minecraft:wooden_hoe'],
    [291, 'minecraft:stone_hoe'],
    [292, 'minecraft:iron_hoe'],
    [293, 'minecraft:diamond_hoe'],
    [294, 'minecraft:golden_hoe'],
    [295, 'minecraft:wheat_seeds'],
    [296, 'minecraft:wheat'],
    [297, 'minecraft:bread'],
    [298, 'minecraft:leather_helmet'],
    [299, 'minecraft:leather_chestplate'],
    [300, 'minecraft:leather_leggings'],
    [301, 'minecraft:leather_boots'],
    [302, 'minecraft:chainmail_helmet'],
    [303, 'minecraft:chainmail_chestplate'],
    [304, 'minecraft:chainmail_leggings'],
    [305, 'minecraft:chainmail_boots'],
    [306, 'minecraft:iron_helmet'],
    [307, 'minecraft:iron_chestplate'],
    [308, 'minecraft:iron_leggings'],
    [309, 'minecraft:iron_boots'],
    [310, 'minecraft:diamond_helmet'],
    [311, 'minecraft:diamond_chestplate'],
    [312, 'minecraft:diamond_leggings'],
    [313, 'minecraft:diamond_boots'],
    [314, 'minecraft:golden_helmet'],
    [315, 'minecraft:golden_chestplate'],
    [316, 'minecraft:golden_leggings'],
    [317, 'minecraft:golden_boots'],
    [318, 'minecraft:flint'],
    [319, 'minecraft:porkchop'],
    [320, 'minecraft:cooked_porkchop'],
    [321, 'minecraft:painting'],
    [322, 'minecraft:golden_apple'],
    [323, 'minecraft:sign'],
    [324, 'minecraft:wooden_door'],
    [325, 'minecraft:bucket'],
    [326, 'minecraft:water_bucket'],
    [327, 'minecraft:lava_bucket'],
    [328, 'minecraft:minecart'],
    [329, 'minecraft:saddle'],
    [330, 'minecraft:iron_door'],
    [331, 'minecraft:redstone'],
    [332, 'minecraft:snowball'],
    [333, 'minecraft:boat'],
    [334, 'minecraft:leather'],
    [335, 'minecraft:milk_bucket'],
    [336, 'minecraft:brick'],
    [337, 'minecraft:clay_ball'],
    [338, 'minecraft:reeds'],
    [339, 'minecraft:paper'],
    [340, 'minecraft:book'],
    [341, 'minecraft:slime_ball'],
    [342, 'minecraft:chest_minecart'],
    [343, 'minecraft:furnace_minecart'],
    [344, 'minecraft:egg'],
    [345, 'minecraft:compass'],
    [346, 'minecraft:fishing_rod'],
    [347, 'minecraft:clock'],
    [348, 'minecraft:glowstone_dust'],
    [349, 'minecraft:fish'],
    [350, 'minecraft:cooked_fish'],
    [351, 'minecraft:dye'],
    [352, 'minecraft:bone'],
    [353, 'minecraft:sugar'],
    [354, 'minecraft:cake'],
    [355, 'minecraft:bed'],
    [356, 'minecraft:repeater'],
    [357, 'minecraft:cookie'],
    [358, 'minecraft:filled_map'],
    [359, 'minecraft:shears'],
    [360, 'minecraft:melon'],
    [361, 'minecraft:pumpkin_seeds'],
    [362, 'minecraft:melon_seeds'],
    [363, 'minecraft:beef'],
    [364, 'minecraft:cooked_beef'],
    [365, 'minecraft:chicken'],
    [366, 'minecraft:cooked_chicken'],
    [367, 'minecraft:rotten_flesh'],
    [368, 'minecraft:ender_pearl'],
    [369, 'minecraft:blaze_rod'],
    [370, 'minecraft:ghast_tear'],
    [371, 'minecraft:gold_nugget'],
    [372, 'minecraft:nether_wart'],
    [373, 'minecraft:potion'],
    [374, 'minecraft:glass_bottle'],
    [375, 'minecraft:spider_eye'],
    [376, 'minecraft:fermented_spider_eye'],
    [377, 'minecraft:blaze_powder'],
    [378, 'minecraft:magma_cream'],
    [379, 'minecraft:brewing_stand'],
    [380, 'minecraft:cauldron'],
    [381, 'minecraft:ender_eye'],
    [382, 'minecraft:speckled_melon'],
    [383, 'minecraft:spawn_egg'],
    [384, 'minecraft:experience_bottle'],
    [385, 'minecraft:fire_charge'],
    [386, 'minecraft:writable_book'],
    [387, 'minecraft:written_book'],
    [388, 'minecraft:emerald'],
    [389, 'minecraft:item_frame'],
    [390, 'minecraft:flower_pot'],
    [391, 'minecraft:carrot'],
    [392, 'minecraft:potato'],
    [393, 'minecraft:baked_potato'],
    [394, 'minecraft:poisonous_potato'],
    [395, 'minecraft:map'],
    [396, 'minecraft:golden_carrot'],
    [397, 'minecraft:skull'],
    [398, 'minecraft:carrot_on_a_stick'],
    [399, 'minecraft:nether_star'],
    [400, 'minecraft:pumpkin_pie'],
    [401, 'minecraft:fireworks'],
    [402, 'minecraft:firework_charge'],
    [403, 'minecraft:enchanted_book'],
    [404, 'minecraft:comparator'],
    [405, 'minecraft:netherbrick'],
    [406, 'minecraft:quartz'],
    [407, 'minecraft:tnt_minecart'],
    [408, 'minecraft:hopper_minecart'],
    [409, 'minecraft:prismarine_shard'],
    [410, 'minecraft:prismarine_crystals'],
    [411, 'minecraft:rabbit'],
    [412, 'minecraft:cooked_rabbit'],
    [413, 'minecraft:rabbit_stew'],
    [414, 'minecraft:rabbit_foot'],
    [415, 'minecraft:rabbit_hide'],
    [416, 'minecraft:armor_stand'],
    [417, 'minecraft:iron_horse_armor'],
    [418, 'minecraft:golden_horse_armor'],
    [419, 'minecraft:diamond_horse_armor'],
    [420, 'minecraft:lead'],
    [421, 'minecraft:name_tag'],
    [422, 'minecraft:command_block_minecart'],
    [423, 'minecraft:mutton'],
    [424, 'minecraft:cooked_mutton'],
    [425, 'minecraft:banner'],
    [426, 'minecraft:end_crystal'],
    [427, 'minecraft:spruce_door'],
    [428, 'minecraft:birch_door'],
    [429, 'minecraft:jungle_door'],
    [430, 'minecraft:acacia_door'],
    [431, 'minecraft:dark_oak_door'],
    [432, 'minecraft:chorus_fruit'],
    [433, 'minecraft:chorus_fruit_popped'],
    [434, 'minecraft:beetroot'],
    [435, 'minecraft:beetroot_seeds'],
    [436, 'minecraft:beetroot_soup'],
    [437, 'minecraft:dragon_breath'],
    [438, 'minecraft:splash_potion'],
    [439, 'minecraft:spectral_arrow'],
    [440, 'minecraft:tipped_arrow'],
    [441, 'minecraft:lingering_potion'],
    [442, 'minecraft:shield'],
    [443, 'minecraft:elytra'],
    [444, 'minecraft:spruce_boat'],
    [445, 'minecraft:birch_boat'],
    [446, 'minecraft:jungle_boat'],
    [447, 'minecraft:acacia_boat'],
    [448, 'minecraft:dark_oak_boat'],
    [449, 'minecraft:totem_of_undying'],
    [450, 'minecraft:shulker_shell'],
    [452, 'minecraft:iron_nugget'],
    [453, 'minecraft:knowledge_book'],
    [2256, 'minecraft:record_13'],
    [2257, 'minecraft:record_cat'],
    [2258, 'minecraft:record_blocks'],
    [2259, 'minecraft:record_chirp'],
    [2260, 'minecraft:record_far'],
    [2261, 'minecraft:record_mall'],
    [2262, 'minecraft:record_mellohi'],
    [2263, 'minecraft:record_stal'],
    [2264, 'minecraft:record_strad'],
    [2265, 'minecraft:record_ward'],
    [2266, 'minecraft:record_11'],
    [2267, 'minecraft:record_wait']
];
Items.StringIDWithDataValue_NominalID = [
    ['minecraft:stone.0', 'minecraft:stone'],
    ['minecraft:stone.1', 'minecraft:granite'],
    ['minecraft:stone.2', 'minecraft:polished_granite'],
    ['minecraft:stone.3', 'minecraft:diorite'],
    ['minecraft:stone.4', 'minecraft:polished_diorite'],
    ['minecraft:stone.5', 'minecraft:andesite'],
    ['minecraft:stone.6', 'minecraft:polished_andesite'],
    ['minecraft:dirt.0', 'minecraft:dirt'],
    ['minecraft:dirt.1', 'minecraft:coarse_dirt'],
    ['minecraft:dirt.2', 'minecraft:podzol'],
    ['minecraft:leaves.0', 'minecraft:oak_leaves'],
    ['minecraft:leaves.1', 'minecraft:spruce_leaves'],
    ['minecraft:leaves.2', 'minecraft:birch_leaves'],
    ['minecraft:leaves.3', 'minecraft:jungle_leaves'],
    ['minecraft:leaves2.0', 'minecraft:acacia_leaves'],
    ['minecraft:leaves2.1', 'minecraft:dark_oak_leaves'],
    ['minecraft:log.0', 'minecraft:oak_log'],
    ['minecraft:log.1', 'minecraft:spruce_log'],
    ['minecraft:log.2', 'minecraft:birch_log'],
    ['minecraft:log.3', 'minecraft:jungle_log'],
    ['minecraft:log2.0', 'minecraft:acacia_log'],
    ['minecraft:log2.1', 'minecraft:dark_oak_log'],
    ['minecraft:sapling.0', 'minecraft:oak_sapling'],
    ['minecraft:sapling.1', 'minecraft:spruce_sapling'],
    ['minecraft:sapling.2', 'minecraft:birch_sapling'],
    ['minecraft:sapling.3', 'minecraft:jungle_sapling'],
    ['minecraft:sapling.4', 'minecraft:acacia_sapling'],
    ['minecraft:sapling.5', 'minecraft:dark_oak_sapling'],
    ['minecraft:planks.0', 'minecraft:oak_planks'],
    ['minecraft:planks.1', 'minecraft:spruce_planks'],
    ['minecraft:planks.2', 'minecraft:birch_planks'],
    ['minecraft:planks.3', 'minecraft:jungle_planks'],
    ['minecraft:planks.4', 'minecraft:acacia_planks'],
    ['minecraft:planks.5', 'minecraft:dark_oak_planks'],
    ['minecraft:sand.0', 'minecraft:sand'],
    ['minecraft:sand.1', 'minecraft:red_sand'],
    ['minecraft:quartz_block.0', 'minecraft:quartz_block'],
    ['minecraft:quartz_block.1', 'minecraft:chiseled_quartz_block'],
    ['minecraft:quartz_block.2', 'minecraft:quartz_pillar'],
    ['minecraft:anvil.0', 'minecraft:anvil'],
    ['minecraft:anvil.1', 'minecraft:chipped_anvil'],
    ['minecraft:anvil.2', 'minecraft:damaged_anvil'],
    ['minecraft:wool.0', 'minecraft:white_wool'],
    ['minecraft:wool.1', 'minecraft:orange_wool'],
    ['minecraft:wool.2', 'minecraft:magenta_wool'],
    ['minecraft:wool.3', 'minecraft:light_blue_wool'],
    ['minecraft:wool.4', 'minecraft:yellow_wool'],
    ['minecraft:wool.5', 'minecraft:lime_wool'],
    ['minecraft:wool.6', 'minecraft:pink_wool'],
    ['minecraft:wool.7', 'minecraft:gray_wool'],
    ['minecraft:wool.8', 'minecraft:light_gray_wool'],
    ['minecraft:wool.9', 'minecraft:cyan_wool'],
    ['minecraft:wool.10', 'minecraft:purple_wool'],
    ['minecraft:wool.11', 'minecraft:blue_wool'],
    ['minecraft:wool.12', 'minecraft:brown_wool'],
    ['minecraft:wool.13', 'minecraft:green_wool'],
    ['minecraft:wool.14', 'minecraft:red_wool'],
    ['minecraft:wool.15', 'minecraft:black_wool'],
    ['minecraft:carpet.0', 'minecraft:white_carpet'],
    ['minecraft:carpet.1', 'minecraft:orange_carpet'],
    ['minecraft:carpet.2', 'minecraft:magenta_carpet'],
    ['minecraft:carpet.3', 'minecraft:light_blue_carpet'],
    ['minecraft:carpet.4', 'minecraft:yellow_carpet'],
    ['minecraft:carpet.5', 'minecraft:lime_carpet'],
    ['minecraft:carpet.6', 'minecraft:pink_carpet'],
    ['minecraft:carpet.7', 'minecraft:gray_carpet'],
    ['minecraft:carpet.8', 'minecraft:light_gray_carpet'],
    ['minecraft:carpet.9', 'minecraft:cyan_carpet'],
    ['minecraft:carpet.10', 'minecraft:purple_carpet'],
    ['minecraft:carpet.11', 'minecraft:blue_carpet'],
    ['minecraft:carpet.12', 'minecraft:brown_carpet'],
    ['minecraft:carpet.13', 'minecraft:green_carpet'],
    ['minecraft:carpet.14', 'minecraft:red_carpet'],
    ['minecraft:carpet.15', 'minecraft:black_carpet'],
    ['minecraft:stained_hardened_clay.0', 'minecraft:white_terracotta'],
    ['minecraft:stained_hardened_clay.1', 'minecraft:orange_terracotta'],
    ['minecraft:stained_hardened_clay.2', 'minecraft:magenta_terracotta'],
    ['minecraft:stained_hardened_clay.3', 'minecraft:light_blue_terracotta'],
    ['minecraft:stained_hardened_clay.4', 'minecraft:yellow_terracotta'],
    ['minecraft:stained_hardened_clay.5', 'minecraft:lime_terracotta'],
    ['minecraft:stained_hardened_clay.6', 'minecraft:pink_terracotta'],
    ['minecraft:stained_hardened_clay.7', 'minecraft:gray_terracotta'],
    ['minecraft:stained_hardened_clay.8', 'minecraft:light_gray_terracotta'],
    ['minecraft:stained_hardened_clay.9', 'minecraft:cyan_terracotta'],
    ['minecraft:stained_hardened_clay.10', 'minecraft:purple_terracotta'],
    ['minecraft:stained_hardened_clay.11', 'minecraft:blue_terracotta'],
    ['minecraft:stained_hardened_clay.12', 'minecraft:brown_terracotta'],
    ['minecraft:stained_hardened_clay.13', 'minecraft:green_terracotta'],
    ['minecraft:stained_hardened_clay.14', 'minecraft:red_terracotta'],
    ['minecraft:stained_hardened_clay.15', 'minecraft:black_terracotta'],
    ['minecraft:silver_glazed_terracotta.0', 'minecraft:light_gray_glazed_terracotta'],
    ['minecraft:stained_glass.0', 'minecraft:white_stained_glass'],
    ['minecraft:stained_glass.1', 'minecraft:orange_stained_glass'],
    ['minecraft:stained_glass.2', 'minecraft:magenta_stained_glass'],
    ['minecraft:stained_glass.3', 'minecraft:light_blue_stained_glass'],
    ['minecraft:stained_glass.4', 'minecraft:yellow_stained_glass'],
    ['minecraft:stained_glass.5', 'minecraft:lime_stained_glass'],
    ['minecraft:stained_glass.6', 'minecraft:pink_stained_glass'],
    ['minecraft:stained_glass.7', 'minecraft:gray_stained_glass'],
    ['minecraft:stained_glass.8', 'minecraft:light_gray_stained_glass'],
    ['minecraft:stained_glass.9', 'minecraft:cyan_stained_glass'],
    ['minecraft:stained_glass.10', 'minecraft:purple_stained_glass'],
    ['minecraft:stained_glass.11', 'minecraft:blue_stained_glass'],
    ['minecraft:stained_glass.12', 'minecraft:brown_stained_glass'],
    ['minecraft:stained_glass.13', 'minecraft:green_stained_glass'],
    ['minecraft:stained_glass.14', 'minecraft:red_stained_glass'],
    ['minecraft:stained_glass.15', 'minecraft:black_stained_glass'],
    ['minecraft:stained_glass_pane.0', 'minecraft:white_stained_glass_pane'],
    ['minecraft:stained_glass_pane.1', 'minecraft:orange_stained_glass_pane'],
    ['minecraft:stained_glass_pane.2', 'minecraft:magenta_stained_glass_pane'],
    ['minecraft:stained_glass_pane.3', 'minecraft:light_blue_stained_glass_pane'],
    ['minecraft:stained_glass_pane.4', 'minecraft:yellow_stained_glass_pane'],
    ['minecraft:stained_glass_pane.5', 'minecraft:lime_stained_glass_pane'],
    ['minecraft:stained_glass_pane.6', 'minecraft:pink_stained_glass_pane'],
    ['minecraft:stained_glass_pane.7', 'minecraft:gray_stained_glass_pane'],
    ['minecraft:stained_glass_pane.8', 'minecraft:light_gray_stained_glass_pane'],
    ['minecraft:stained_glass_pane.9', 'minecraft:cyan_stained_glass_pane'],
    ['minecraft:stained_glass_pane.10', 'minecraft:purple_stained_glass_pane'],
    ['minecraft:stained_glass_pane.11', 'minecraft:blue_stained_glass_pane'],
    ['minecraft:stained_glass_pane.12', 'minecraft:brown_stained_glass_pane'],
    ['minecraft:stained_glass_pane.13', 'minecraft:green_stained_glass_pane'],
    ['minecraft:stained_glass_pane.14', 'minecraft:red_stained_glass_pane'],
    ['minecraft:stained_glass_pane.15', 'minecraft:black_stained_glass_pane'],
    ['minecraft:prismarine.0', 'minecraft:prismarine'],
    ['minecraft:prismarine.1', 'minecraft:prismarine_bricks'],
    ['minecraft:prismarine.2', 'minecraft:dark_prismarine'],
    ['minecraft:concrete.0', 'minecraft:white_concrete'],
    ['minecraft:concrete.1', 'minecraft:orange_concrete'],
    ['minecraft:concrete.2', 'minecraft:magenta_concrete'],
    ['minecraft:concrete.3', 'minecraft:light_blue_concrete'],
    ['minecraft:concrete.4', 'minecraft:yellow_concrete'],
    ['minecraft:concrete.5', 'minecraft:lime_concrete'],
    ['minecraft:concrete.6', 'minecraft:pink_concrete'],
    ['minecraft:concrete.7', 'minecraft:gray_concrete'],
    ['minecraft:concrete.8', 'minecraft:light_gray_concrete'],
    ['minecraft:concrete.9', 'minecraft:cyan_concrete'],
    ['minecraft:concrete.10', 'minecraft:purple_concrete'],
    ['minecraft:concrete.11', 'minecraft:blue_concrete'],
    ['minecraft:concrete.12', 'minecraft:brown_concrete'],
    ['minecraft:concrete.13', 'minecraft:green_concrete'],
    ['minecraft:concrete.14', 'minecraft:red_concrete'],
    ['minecraft:concrete.15', 'minecraft:black_concrete'],
    ['minecraft:concrete_powder.0', 'minecraft:white_concrete_powder'],
    ['minecraft:concrete_powder.1', 'minecraft:orange_concrete_powder'],
    ['minecraft:concrete_powder.2', 'minecraft:magenta_concrete_powder'],
    ['minecraft:concrete_powder.3', 'minecraft:light_blue_concrete_powder'],
    ['minecraft:concrete_powder.4', 'minecraft:yellow_concrete_powder'],
    ['minecraft:concrete_powder.5', 'minecraft:lime_concrete_powder'],
    ['minecraft:concrete_powder.6', 'minecraft:pink_concrete_powder'],
    ['minecraft:concrete_powder.7', 'minecraft:gray_concrete_powder'],
    ['minecraft:concrete_powder.8', 'minecraft:light_gray_concrete_powder'],
    ['minecraft:concrete_powder.9', 'minecraft:cyan_concrete_powder'],
    ['minecraft:concrete_powder.10', 'minecraft:purple_concrete_powder'],
    ['minecraft:concrete_powder.11', 'minecraft:blue_concrete_powder'],
    ['minecraft:concrete_powder.12', 'minecraft:brown_concrete_powder'],
    ['minecraft:concrete_powder.13', 'minecraft:green_concrete_powder'],
    ['minecraft:concrete_powder.14', 'minecraft:red_concrete_powder'],
    ['minecraft:concrete_powder.15', 'minecraft:black_concrete_powder'],
    ['minecraft:cobblestone_wall.0', 'minecraft:cobblestone_wall'],
    ['minecraft:cobblestone_wall.1', 'minecraft:mossy_cobblestone_wall'],
    ['minecraft:sandstone.0', 'minecraft:sandstone'],
    ['minecraft:sandstone.1', 'minecraft:chiseled_sandstone'],
    ['minecraft:sandstone.2', 'minecraft:cut_sandstone'],
    ['minecraft:red_sandstone.0', 'minecraft:red_sandstone'],
    ['minecraft:red_sandstone.1', 'minecraft:chiseled_red_sandstone'],
    ['minecraft:red_sandstone.2', 'minecraft:cut_red_sandstone'],
    ['minecraft:stonebrick.0', 'minecraft:stone_bricks'],
    ['minecraft:stonebrick.1', 'minecraft:mossy_stone_bricks'],
    ['minecraft:stonebrick.2', 'minecraft:cracked_stone_bricks'],
    ['minecraft:stonebrick.3', 'minecraft:chiseled_stone_bricks'],
    ['minecraft:monster_egg.0', 'minecraft:infested_stone'],
    ['minecraft:monster_egg.1', 'minecraft:infested_cobblestone'],
    ['minecraft:monster_egg.2', 'minecraft:infested_stone_bricks'],
    ['minecraft:monster_egg.3', 'minecraft:infested_mossy_stone_bricks'],
    ['minecraft:monster_egg.4', 'minecraft:infested_cracked_stone_bricks'],
    ['minecraft:monster_egg.5', 'minecraft:infested_chiseled_stone_bricks'],
    ['minecraft:yellow_flower.0', 'minecraft:dandelion'],
    ['minecraft:red_flower.0', 'minecraft:poppy'],
    ['minecraft:red_flower.1', 'minecraft:blue_orchid'],
    ['minecraft:red_flower.2', 'minecraft:allium'],
    ['minecraft:red_flower.3', 'minecraft:azure_bluet'],
    ['minecraft:red_flower.4', 'minecraft:red_tulip'],
    ['minecraft:red_flower.5', 'minecraft:orange_tulip'],
    ['minecraft:red_flower.6', 'minecraft:white_tulip'],
    ['minecraft:red_flower.7', 'minecraft:pink_tulip'],
    ['minecraft:red_flower.8', 'minecraft:oxeye_daisy'],
    ['minecraft:double_plant.0', 'minecraft:sunflower'],
    ['minecraft:double_plant.1', 'minecraft:lilac'],
    ['minecraft:double_plant.2', 'minecraft:tall_grass'],
    ['minecraft:double_plant.3', 'minecraft:large_fern'],
    ['minecraft:double_plant.4', 'minecraft:rose_bush'],
    ['minecraft:double_plant.5', 'minecraft:peony'],
    ['minecraft:deadbush.0', 'minecraft:dead_bush'],
    ['minecraft:tallgrass.0', 'minecraft:dead_bush'],
    ['minecraft:tallgrass.1', 'minecraft:grass'],
    ['minecraft:tallgrass.2', 'minecraft:fern'],
    ['minecraft:sponge.0', 'minecraft:sponge'],
    ['minecraft:sponge.1', 'minecraft:wet_sponge'],
    ['minecraft:purpur_slab.0', 'minecraft:purpur_slab'],
    ['minecraft:stone_slab.0', 'minecraft:stone_slab'],
    ['minecraft:stone_slab.1', 'minecraft:sandstone_slab'],
    ['minecraft:stone_slab.2', 'minecraft:petrified_oak_slab'],
    ['minecraft:stone_slab.3', 'minecraft:cobblestone_slab'],
    ['minecraft:stone_slab.4', 'minecraft:brick_slab'],
    ['minecraft:stone_slab.5', 'minecraft:stone_brick_slab'],
    ['minecraft:stone_slab.6', 'minecraft:nether_brick_slab'],
    ['minecraft:stone_slab.7', 'minecraft:quartz_slab'],
    ['minecraft:stone_slab2.0', 'minecraft:red_sandstone_slab'],
    ['minecraft:wooden_slab.0', 'minecraft:oak_slab'],
    ['minecraft:wooden_slab.1', 'minecraft:spruce_slab'],
    ['minecraft:wooden_slab.2', 'minecraft:birch_slab'],
    ['minecraft:wooden_slab.3', 'minecraft:jungle_slab'],
    ['minecraft:wooden_slab.4', 'minecraft:acacia_slab'],
    ['minecraft:wooden_slab.5', 'minecraft:dark_oak_slab'],
    ['minecraft:coal.0', 'minecraft:coal'],
    ['minecraft:coal.1', 'minecraft:charcoal'],
    ['minecraft:fish.0', 'minecraft:cod'],
    ['minecraft:fish.1', 'minecraft:salmon'],
    ['minecraft:fish.2', 'minecraft:tropical_fish'],
    ['minecraft:fish.3', 'minecraft:pufferfish'],
    ['minecraft:cooked_fish.0', 'minecraft:cooked_cod'],
    ['minecraft:cooked_fish.1', 'minecraft:cooked_salmon'],
    ['minecraft:skull.0', 'minecraft:skeleton_skull'],
    ['minecraft:skull.1', 'minecraft:wither_skeleton_skull'],
    ['minecraft:skull.2', 'minecraft:zombie_head'],
    ['minecraft:skull.3', 'minecraft:player_head'],
    ['minecraft:skull.4', 'minecraft:creeper_head'],
    ['minecraft:skull.5', 'minecraft:dragon_head'],
    ['minecraft:golden_apple.0', 'minecraft:golden_apple'],
    ['minecraft:golden_apple.1', 'minecraft:enchanted_golden_apple'],
    ['minecraft:fireworks.0', 'minecraft:firework_rocket'],
    ['minecraft:firework_charge.0', 'minecraft:firework_star'],
    ['minecraft:dye.0', 'minecraft:ink_sac'],
    ['minecraft:dye.1', 'minecraft:rose_red'],
    ['minecraft:dye.2', 'minecraft:cactus_green'],
    ['minecraft:dye.3', 'minecraft:cocoa_beans'],
    ['minecraft:dye.4', 'minecraft:lapis_lazuli'],
    ['minecraft:dye.5', 'minecraft:purple_dye'],
    ['minecraft:dye.6', 'minecraft:cyan_dye'],
    ['minecraft:dye.7', 'minecraft:light_gray_dye'],
    ['minecraft:dye.8', 'minecraft:gray_dye'],
    ['minecraft:dye.9', 'minecraft:pink_dye'],
    ['minecraft:dye.10', 'minecraft:lime_dye'],
    ['minecraft:dye.11', 'minecraft:dandelion_yellow'],
    ['minecraft:dye.12', 'minecraft:light_blue_dye'],
    ['minecraft:dye.13', 'minecraft:magenta_dye'],
    ['minecraft:dye.14', 'minecraft:orange_dye'],
    ['minecraft:dye.15', 'minecraft:bone_meal'],
    ['minecraft:silver_shulker_box.0', 'minecraft:light_gray_shulker_box'],
    ['minecraft:fence.0', 'minecraft:oak_fence'],
    ['minecraft:fence_gate.0', 'minecraft:oak_fence_gate'],
    ['minecraft:wooden_door.0', 'minecraft:oak_door'],
    ['minecraft:boat.0', 'minecraft:oak_boat'],
    ['minecraft:lit_pumpkin.0', 'minecraft:jack_o_lantern'],
    ['minecraft:pumpkin.0', 'minecraft:carved_pumpkin'],
    ['minecraft:trapdoor.0', 'minecraft:oak_trapdoor'],
    ['minecraft:nether_brick.0', 'minecraft:nether_bricks'],
    ['minecraft:red_nether_brick.0', 'minecraft:red_nether_bricks'],
    ['minecraft:netherbrick.0', 'minecraft:nether_brick'],
    ['minecraft:wooden_button.0', 'minecraft:oak_button'],
    ['minecraft:wooden_pressure_plate.0', 'minecraft:oak_pressure_plate'],
    ['minecraft:noteblock.0', 'minecraft:note_block'],
    ['minecraft:bed.0', 'minecraft:white_bed'],
    ['minecraft:bed.1', 'minecraft:orange_bed'],
    ['minecraft:bed.2', 'minecraft:magenta_bed'],
    ['minecraft:bed.3', 'minecraft:light_blue_bed'],
    ['minecraft:bed.4', 'minecraft:yellow_bed'],
    ['minecraft:bed.5', 'minecraft:lime_bed'],
    ['minecraft:bed.6', 'minecraft:pink_bed'],
    ['minecraft:bed.7', 'minecraft:gray_bed'],
    ['minecraft:bed.8', 'minecraft:light_gray_bed'],
    ['minecraft:bed.9', 'minecraft:cyan_bed'],
    ['minecraft:bed.10', 'minecraft:purple_bed'],
    ['minecraft:bed.11', 'minecraft:blue_bed'],
    ['minecraft:bed.12', 'minecraft:brown_bed'],
    ['minecraft:bed.13', 'minecraft:green_bed'],
    ['minecraft:bed.14', 'minecraft:red_bed'],
    ['minecraft:bed.15', 'minecraft:black_bed'],
    ['minecraft:banner.15', 'minecraft:white_banner'],
    ['minecraft:banner.14', 'minecraft:orange_banner'],
    ['minecraft:banner.13', 'minecraft:magenta_banner'],
    ['minecraft:banner.12', 'minecraft:light_blue_banner'],
    ['minecraft:banner.11', 'minecraft:yellow_banner'],
    ['minecraft:banner.10', 'minecraft:lime_banner'],
    ['minecraft:banner.9', 'minecraft:pink_banner'],
    ['minecraft:banner.8', 'minecraft:gray_banner'],
    ['minecraft:banner.7', 'minecraft:light_gray_banner'],
    ['minecraft:banner.6', 'minecraft:cyan_banner'],
    ['minecraft:banner.5', 'minecraft:purple_banner'],
    ['minecraft:banner.4', 'minecraft:blue_banner'],
    ['minecraft:banner.3', 'minecraft:brown_banner'],
    ['minecraft:banner.2', 'minecraft:green_banner'],
    ['minecraft:banner.1', 'minecraft:red_banner'],
    ['minecraft:banner.0', 'minecraft:black_banner'],
    ['minecraft:grass.0', 'minecraft:grass_block'],
    ['minecraft:brick_block.0', 'minecraft:bricks'],
    ['minecraft:end_bricks.0', 'minecraft:end_stone_bricks'],
    ['minecraft:golden_rail.0', 'minecraft:powered_rail'],
    ['minecraft:magma.0', 'minecraft:magma_block'],
    ['minecraft:quartz_ore.0', 'minecraft:nether_quartz_ore'],
    ['minecraft:reeds.0', 'minecraft:sugar_cane'],
    ['minecraft:slime.0', 'minecraft:slime_block'],
    ['minecraft:stone_stairs.0', 'minecraft:cobblestone_stairs'],
    ['minecraft:waterlily.0', 'minecraft:lily_pad'],
    ['minecraft:web.0', 'minecraft:cobweb'],
    ['minecraft:snow.0', 'minecraft:snow_block'],
    ['minecraft:snow_layer.0', 'minecraft:snow'],
    ['minecraft:record_11.0', 'minecraft:music_disc_11'],
    ['minecraft:record_13.0', 'minecraft:music_disc_13'],
    ['minecraft:record_blocks.0', 'minecraft:music_disc_blocks'],
    ['minecraft:record_cat.0', 'minecraft:music_disc_cat'],
    ['minecraft:record_chirp.0', 'minecraft:music_disc_chirp'],
    ['minecraft:record_far.0', 'minecraft:music_disc_far'],
    ['minecraft:record_mall.0', 'minecraft:music_disc_mall'],
    ['minecraft:record_mellohi.0', 'minecraft:music_disc_mellohi'],
    ['minecraft:record_stal.0', 'minecraft:music_disc_stal'],
    ['minecraft:record_strad.0', 'minecraft:music_disc_strad'],
    ['minecraft:record_wait.0', 'minecraft:music_disc_wait'],
    ['minecraft:record_ward.0', 'minecraft:music_disc_ward'],
    ['chorus_fruit_popped.0', 'popped_chorus_fruit']
];
Items.DamageItemIDs = [
    'minecraft:bow',
    'minecraft:carrot_on_a_stick',
    'minecraft:chainmail_boots',
    'minecraft:chainmail_chestplate',
    'minecraft:chainmail_helmet',
    'minecraft:chainmail_leggings',
    'minecraft:diamond_axe',
    'minecraft:diamond_boots',
    'minecraft:diamond_chestplate',
    'minecraft:diamond_helmet',
    'minecraft:diamond_hoe',
    'minecraft:diamond_leggings',
    'minecraft:diamond_pickaxe',
    'minecraft:diamond_shovel',
    'minecraft:diamond_sword',
    'minecraft:elytra',
    'minecraft:fishing_rod',
    'minecraft:flint_and_steel',
    'minecraft:golden_axe',
    'minecraft:golden_boots',
    'minecraft:golden_chestplate',
    'minecraft:golden_helmet',
    'minecraft:golden_hoe',
    'minecraft:golden_leggings',
    'minecraft:golden_pickaxe',
    'minecraft:golden_shovel',
    'minecraft:golden_sword',
    'minecraft:iron_axe',
    'minecraft:iron_boots',
    'minecraft:iron_chestplate',
    'minecraft:iron_helmet',
    'minecraft:iron_hoe',
    'minecraft:iron_leggings',
    'minecraft:iron_pickaxe',
    'minecraft:iron_shovel',
    'minecraft:iron_sword',
    'minecraft:leather_boots',
    'minecraft:leather_chestplate',
    'minecraft:leather_helmet',
    'minecraft:leather_leggings',
    'minecraft:shears',
    'minecraft:shield',
    'minecraft:stone_axe',
    'minecraft:stone_hoe',
    'minecraft:stone_pickaxe',
    'minecraft:stone_shovel',
    'minecraft:stone_sword',
    'minecraft:wooden_axe',
    'minecraft:wooden_hoe',
    'minecraft:wooden_pickaxe',
    'minecraft:wooden_shovel',
    'minecraft:wooden_sword'
];
Items.MapItemIDs = [
    'minecraft:map',
    'minecraft:filled_map'
];
Items.NumericColor_NominalColor = [
    ['0', 'minecraft:white_'],
    ['1', 'minecraft:orange_'],
    ['2', 'minecraft:magenta_'],
    ['3', 'minecraft:light_blue_'],
    ['4', 'minecraft:yellow_'],
    ['5', 'minecraft:lime_'],
    ['6', 'minecraft:pink_'],
    ['7', 'minecraft:gray_'],
    ['8', 'minecraft:light_gray_'],
    ['9', 'minecraft:cyan_'],
    ['10', 'minecraft:purple_'],
    ['11', 'minecraft:blue_'],
    ['12', 'minecraft:brown_'],
    ['13', 'minecraft:green_'],
    ['14', 'minecraft:red_'],
    ['15', 'minecraft:black_']
];
exports.default = Items;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Particles {
    static get1_13NominalIDFrom1_12NominalID(input) {
        const arr = Particles.NominalID_NominalID.find(v => v[0] === input);
        if (arr) {
            if (arr[1] === 'removed') {
                throw `Removed particle: '${input}'`;
            }
            return arr[1];
        }
        else {
            return input;
        }
    }
}
Particles.NominalID_NominalID = [
    ['mobSpellAmbient', 'ambient_entity_effect'],
    ['angryVillager', 'angry_villager'],
    ['blockcrack', 'block'],
    ['blockdust', 'block'],
    ['damageIndicator', 'damage_indicator'],
    ['dragonbreath', 'dragon_breath'],
    ['dripLava', 'dripping_lava'],
    ['dripWater', 'dripping_water'],
    ['reddust', 'dust'],
    ['spell', 'effect'],
    ['mobappearance', 'elder_guardian'],
    ['enchantmenttable', 'enchant'],
    ['magicCrit', 'enchanted_hit'],
    ['endRod', 'end_rod'],
    ['mobSpell', 'entity_effect'],
    ['largeexplosion', 'explosion'],
    ['hugeexplosion', 'explosion_emitter'],
    ['fallingdust', 'falling_dust'],
    ['fireworksSpark', 'firework'],
    ['wake', 'fishing'],
    ['happyVillager', 'happy_villager'],
    ['instantSpell', 'instant_effect'],
    ['iconcrack', 'item'],
    ['slime', 'item_slime'],
    ['snowballpoof', 'item_snowball'],
    ['largesmoke', 'large_smoke'],
    ['townaura', 'mycelium'],
    ['explode', 'poof'],
    ['snowshovel', 'poof'],
    ['droplet', 'rain'],
    ['sweepAttack', 'sweep_attack'],
    ['totem', 'totem_of_undying'],
    ['suspended', 'underwater'],
    ['witchMagic', 'witch'],
    ['take', 'removed'],
    ['footstep', 'removed'],
    ['depthsuspend', 'removed']
];
exports.default = Particles;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ScoreboardCriterias {
    static get1_13From1_12(input) {
        const arr = ScoreboardCriterias.Criteria_Criteria.find(v => v[0] === input);
        if (arr) {
            return arr[1];
        }
        else {
            return input;
        }
    }
}
ScoreboardCriterias.Criteria_Criteria = [
    ['craftItem', 'crafted'],
    ['useItem', 'used'],
    ['breakItem', 'broken'],
    ['mineBlock', 'mined'],
    ['killEntity', 'killed'],
    ['pickup', 'picked_up'],
    ['drop', 'dropped'],
    ['entityKilledBy', 'killed_by']
];
exports.default = ScoreboardCriterias;

},{}],10:[function(require,module,exports){
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
    ['ban %entity %string', 'ban %0 %1'],
    ['ban-ip %entity', 'ban-ip %0'],
    ['ban-ip %entity %string', 'ban-ip %0 %1'],
    ['ban-ip %ip', 'ban-ip %0'],
    ['ban-ip %ip %string', 'ban-ip %0 %1'],
    ['banlist %literal', 'banlist %0'],
    ['blockdata %vec_3 %block_nbt', 'data merge block %0 %1'],
    ['clear', 'clear'],
    ['clear %entity', 'clear %0'],
    ['clear %entity %item', 'clear %0 %1$fuckItemItself'],
    ['clear %entity %item %item_data', 'clear %0 %1$addDataToItem%2'],
    ['clear %entity %item %item_data %num', 'clear %0 %1$addDataToItem%2 %3'],
    ['clear %entity %item %item_data %num %entity_nbt', 'clear %0 %1$addDataToItem%2$addNbtToItem%4'],
    ['clone %vec_3 %vec_3 %vec_3', 'clone %0 %1 %2'],
    ['clone %vec_3 %vec_3 %vec_3 %literal', 'clone %0 %1 %2 %3'],
    ['clone %vec_3 %vec_3 %vec_3 %literal %literal', 'clone %0 %1 %2 %3 %4'],
    ['clone %vec_3 %vec_3 %vec_3 %literal %literal %block', 'clone %0 %1 %2 %3 %5$fuckBlockItself %4'],
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
    ['fill %vec_3 %vec_3 %block', 'fill %0 %1 %2$fuckBlockItself'],
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
    [
        'gamerule gameLoopFunction %func',
        "# gamerule gameLoopFunction %0 !>Please add function %0 into function tag '#minecraft:tick'."
    ],
    ['gamerule %word %word', 'gamerule %0 %1'],
    ['give %entity %item', 'give %0 %1$fuckItemItself'],
    ['give %entity %item %num', 'give %0 %1$addDataToItem%3'],
    ['give %entity %item %num %item_data', 'give %0 %1$addDataToItem%3 %2'],
    ['give %entity %item %num %item_data %item_tag_nbt', 'give %0 %1$addDataToItem%3$addNbtToItem%4 %2'],
    ['kick %entity', 'kick %0'],
    ['kick %entity %string', 'kick %0 %1'],
    ['kill %entity', 'kill %0'],
    ['list', 'list'],
    ['list %uuid', 'list %0'],
    ['locate Temple', 'locate Desert_Pyramid\nlocate Igloo\nlocate Jungle_Pyramid\nlocate Swamp_hut'],
    ['locate %word', 'locate %0'],
    ['me %string', 'me %0'],
    ['op %entity', 'op %0'],
    ['pardon %word', 'pardon %0'],
    ['pardon-ip %ip', 'pardon-ip %0'],
    ['particle %particle %vec_3 %vec_3 %num', 'particle %0 %1 %2 %3'],
    ['particle %particle %vec_3 %vec_3 %num %num', 'particle %0 %1 %2 %3 %4'],
    ['particle %particle %vec_3 %vec_3 %num %num %literal', 'particle %0 %1 %2 %3 %4 %5'],
    ['particle %particle %vec_3 %vec_3 %num %num %literal %entity', 'particle %0 %1 %2 %3 %4 %5 %6'],
    [
        'particle %particle %vec_3 %vec_3 %num %num %literal %entity %block_dust_param',
        'particle %0 %7 %1 %2 %3 %4 %5 %6'
    ],
    [
        'particle %particle %vec_3 %vec_3 %num %num %literal %entity %item_dust_params',
        'particle %0 %7 %1 %2 %3 %4 %5 %6'
    ],
    ['playsound %sound %source %entity', 'playsound %0 %1 %2'],
    ['playsound %sound %source %entity %vec_3', 'playsound %0 %1 %2 %3'],
    ['playsound %sound %source %entity %vec_3 %num', 'playsound %0 %1 %2 %3 %4'],
    ['playsound %sound %source %entity %vec_3 %num %num', 'playsound %0 %1 %2 %3 %4 %5'],
    ['playsound %sound %source %entity %vec_3 %num %num %num', 'playsound %0 %1 %2 %3 %4 %5 %6'],
    ['publish', 'publish'],
    ['recipe %literal %recipe', 'recipe %0 %1'],
    ['recipe %literal %entity %recipe', 'recipe %0 %1 %2'],
    ['reload', 'reload'],
    ['replaceitem block %vec_3 %slot %item', 'replaceitem block %0 %1 %2$fuckItemItself'],
    ['replaceitem block %vec_3 %slot %item %num', 'replaceitem block %0 %1 %2$fuckItemItself %3'],
    ['replaceitem block %vec_3 %slot %item %num %item_data', 'replaceitem block %0 %1 %2$addDataToItem%4 %3'],
    [
        'replaceitem block %vec_3 %slot %item %num %item_data %item_tag_nbt',
        'replaceitem block %0 %1 %2$addDataToItem%4$addNbtToItem%5 %3'
    ],
    ['replaceitem entity %entity %slot %item', 'replaceitem block %0 %1 %2$fuckItemItself'],
    ['replaceitem entity %entity %slot %item %num', 'replaceitem block %0 %1 %2$fuckItemItself %3'],
    ['replaceitem entity %entity %slot %item %num %item_data', 'replaceitem block %0 %1 %2$addDataToItem%4 %3'],
    [
        'replaceitem entity %entity %slot %item %num %item_data %item_tag_nbt',
        'replaceitem block %0 %1 %2$addDataToItem%4$addNbtToItem%5 %3'
    ],
    ['save-all', 'save-all'],
    ['save-all %literal', 'save-all %0'],
    ['save-off', 'save-off'],
    ['save-on', 'save-on'],
    ['say %string', 'say %0'],
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
        'scoreboard players test %entity %word %num_or_star %num_or_star',
        'execute if entity %0$addScbMinToEntity%1%2$addScbMaxToEntity%1%3'
    ],
    ['scoreboard players %literal %entity %word %num', 'scoreboard players set %0 %1 %2'],
    [
        'scoreboard players %literal %entity %word %num %entity_nbt',
        'scoreboard players %0 %1$addNbtToEntity%4 %2 %3'
    ],
    ['scoreboard players tag %entity list', 'tag %0 list'],
    ['scoreboard players tag %entity %literal %word', 'tag %0 %1 %2'],
    ['scoreboard players tag %entity %literal %word %entity_nbt', 'tag %0$addNbtToEntity%3 %1 %2'],
    ['scoreboard teams list', 'team list'],
    ['scoreboard teams list %word', 'team list %0'],
    ['scoreboard teams add %word', 'team add %0'],
    ['scoreboard teams add %word %string', 'team add %0 %1'],
    ['scoreboard teams remove %word', 'team remove %0'],
    ['scoreboard teams empty %word', 'team empty %0'],
    ['scoreboard teams join %word', 'team join %0'],
    ['scoreboard teams join %word %entity', 'team join %0 %1'],
    ['scoreboard teams leave', 'team leave'],
    ['scoreboard teams leave %entity', 'team leave %0'],
    ['scoreboard teams option %word %word %word', 'team option %0 %1 %2'],
    ['seed', 'seed'],
    ['setblock %vec_3 %block', 'setblock %0 %1$fuckBlockItself'],
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
    ['spreadplayers %vec_2 %num %num %bool %entity', 'spreadplayers %0 %1 %2 %3 %4'],
    ['stats %string', "# stat %0 !>Use 'execute store ...'"],
    ['stop', 'stop'],
    ['stopsound %entity', 'stopsound %0'],
    ['stopsound %entity %source', 'stopsound %0 %1'],
    ['stopsound %entity %source %sound', 'stopsound %0 %1 %2'],
    ['summon %entity_type', 'summon %0'],
    ['summon %entity_type %vec_3', 'summon %0 %1'],
    ['summon %entity_type %vec_3 %entity_nbt', 'summon %0 %1 %2'],
    ['teleport %entity %vec_3', 'teleport %0 %1'],
    ['teleport %entity %vec_3 %vec_2', 'teleport %0 %1 %2'],
    ['tell %entity %string', 'tell %0 %1'],
    ['msg %entity %string', 'msg %0 %1'],
    ['w %entity %string', 'w %0 %1'],
    ['tellraw %entity %json', 'tellraw %0 %1'],
    ['testfor %entity', 'execute if entity %0'],
    ['testfor %entity %entity_nbt', 'execute if entity %0$addNbtToEntity%1'],
    ['testforblock %vec_3 %block', 'execute if block %0 %1$fuckBlockItself'],
    ['testforblock %vec_3 %block %block_metadata_or_state', 'execute if block %0 %1$addMetadataOrStateToBlock%2'],
    [
        'testforblock %vec_3 %block %block_metadata_or_state %block_nbt',
        'execute if block %0 %1$addMetadataOrStateToBlock%2$addNbtToBlock%3'
    ],
    ['testforblocks %vec_3 %vec_3 %vec_3', 'execute if blocks %0 %1 %2 all'],
    ['testforblocks %vec_3 %vec_3 %vec_3 %literal', 'execute if blocks %0 %1 %2 %3'],
    ['time %literal %word', 'time %0 %1'],
    ['title %entity %word', 'title %0 %1'],
    ['title %entity %word %json', 'title %0 %1 %2'],
    ['title %entity times %num %num %num', 'title %0 times %1 %2 %3'],
    [
        'toggledownfall',
        "weather clear !>'Toggledownfall' could toggle the weather, but 'weather clear' can only set the weather to clear."
    ],
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

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const char_reader_1 = require("./utils/char_reader");
const argument_reader_1 = require("./utils/argument_reader");
const selector_1 = require("./utils/selector");
const items_1 = require("./mappings/items");
const utils_1 = require("./utils/utils");
const blocks_1 = require("./mappings/blocks");
const updater_1 = require("./updater");
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
        let ast = this.getAst(arg);
        let id = ast.keys().next().value;
        let methods = ast.get(id);
        let source = resultMap.get(`%${id}`);
        if (methods && source) {
            for (const name of methods.keys()) {
                let paramIds = methods.get(name);
                if (paramIds) {
                    let params = paramIds.map(x => {
                        let result = resultMap.get(`%${x}`);
                        return result ? result : '';
                    });
                    switch (name) {
                        case 'addAdvToEntity': {
                            let sel = new selector_1.default();
                            sel.parse1_13(source);
                            if (params.length === 1) {
                                sel.addFinishedAdvancement(params[0]);
                            }
                            else if (params.length === 2) {
                                sel.addFinishedAdvancement(params[0], params[1]);
                            }
                            else {
                                throw `Unexpected param count: ${params.length} of ${name} in ${arg}.`;
                            }
                            source = sel.get1_13();
                            break;
                        }
                        case 'addDataToItem':
                            if (items_1.default.isDamageItem(source)) {
                                source += `{Damage:${params[0]}s}`;
                            }
                            else if (items_1.default.isMapItem(source)) {
                                source += `{map:${params[0]}}`;
                            }
                            else {
                                source = items_1.default.get1_13NominalIDFrom1_12NominalIDWithDataValue(source, Number(params[0]));
                            }
                            break;
                        case 'addMetadataOrStateToBlock':
                            if (utils_1.isNumeric(params[0])) {
                                source = blocks_1.default.get1_13NominalIDFrom1_12NominalID(blocks_1.default.get1_12NominalIDFrom1_12StringIDWithMetadata(source, Number(params[0])));
                            }
                            else {
                                source = blocks_1.default.get1_13NominalIDFrom1_12NominalID(blocks_1.default.get1_12NominalIDFrom1_12StringID(`${source}[${params[0]}]`));
                            }
                            break;
                        case 'addNbtToBlock':
                            params[0] = updater_1.default.upBlockNbt(params[0], source);
                            if (params[0].slice(0, 4) === '$ID>') {
                                const states = '[' + source.split('[')[1];
                                source = params[0].slice(4) + (states !== '[undefined' ? states : '');
                            }
                            else if (params[0].slice(0, 4) === '$BS>') {
                                const states = '[' + source.split('[')[1];
                                if (states === '[undefined') {
                                    source = `${source}[${params[0].slice(4)}]`;
                                }
                                else {
                                    source = `${source}[${blocks_1.default.sortStates(blocks_1.default.combineStates(states.slice(1, -1), params[0]))}]`;
                                }
                            }
                            else if (params[0].slice(0, 4) === '$FL>') {
                                source = params[0].slice(4);
                            }
                            else {
                                source += params[0];
                            }
                            break;
                        case 'addNbtToEntity': {
                            let sel = new selector_1.default();
                            sel.parse1_13(source);
                            sel.setNbt(params[0]);
                            source = sel.get1_13();
                            break;
                        }
                        case 'addNbtToItem':
                            let data;
                            if (source.indexOf('{') !== -1) {
                                data = source.slice(source.indexOf('{') + 1);
                                source = source.slice(0, source.indexOf('{'));
                            }
                            params[0] = updater_1.default.upItemTagNbt(params[0], source);
                            source += params[0];
                            if (data) {
                                source = source.slice(0, -1) + ',' + data;
                            }
                            break;
                        case 'addScbMaxToEntity': {
                            if (params[1] !== '*') {
                                let sel = new selector_1.default();
                                sel.parse1_13(source);
                                sel.setScore(params[0], params[1], 'max');
                                source = sel.get1_13();
                            }
                            break;
                        }
                        case 'addScbMinToEntity': {
                            if (params[1] !== '*') {
                                let sel = new selector_1.default();
                                sel.parse1_13(source);
                                sel.setScore(params[0], params[1], 'min');
                                source = sel.get1_13();
                            }
                            break;
                        }
                        case 'fuckItemItself':
                            source = items_1.default.get1_13NominalIDFrom1_12NominalIDWithDataValue(source);
                            break;
                        case 'fuckBlockItself':
                            source = blocks_1.default.get1_13NominalIDFrom1_12NominalID(blocks_1.default.get1_12NominalIDFrom1_12StringIDWithMetadata(source, 0));
                            break;
                        default:
                            throw `Unknwon spu script method: '${name}'`;
                    }
                }
            }
            return source;
        }
        console.error('==========');
        console.error('AST:');
        console.error(ast);
        console.error('ID:');
        console.error(id);
        console.error('METHODS:');
        console.error(methods);
        console.error('SOURCE');
        console.error(source);
        console.error('==========');
        throw 'Spu Script execute error. See console for more information.';
    }
    getAst(arg) {
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
        let method;
        let param;
        let params;
        while (char) {
            method = '';
            params = [];
            char = charReader.next();
            while (char && char !== '%' && char !== '$') {
                method += char;
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
                if (char !== '$') {
                    char = charReader.next();
                }
            }
            methods.set(method, params);
        }
        return new Map([[id, methods]]);
    }
}
exports.default = SpuScript;

},{"./mappings/blocks":3,"./mappings/items":7,"./updater":12,"./utils/argument_reader":13,"./utils/char_reader":14,"./utils/selector":18,"./utils/utils":19}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argument_reader_1 = require("./utils/argument_reader");
const selector_1 = require("./utils/selector");
const spuses_1 = require("./mappings/spuses");
const spu_script_1 = require("./spu_script");
const checker_1 = require("./checker");
const blocks_1 = require("./mappings/blocks");
const effects_1 = require("./mappings/effects");
const enchantments_1 = require("./mappings/enchantments");
const entities_1 = require("./mappings/entities");
const items_1 = require("./mappings/items");
const particles_1 = require("./mappings/particles");
const scoreboard_criterias_1 = require("./mappings/scoreboard_criterias");
const utils_1 = require("./utils/utils");
const nbt_1 = require("./utils/nbt/nbt");
class Updater {
    static getResultMap(cmd, spus) {
        let spusReader = new argument_reader_1.default(spus);
        let spusArg = spusReader.next();
        let cmdSplited = cmd.split(' ');
        let begin = 0;
        let end = cmdSplited.length;
        let cmdArg = cmdSplited.slice(begin, end).join(' ');
        let map = new Map();
        let cnt = 0;
        while (spusArg !== '' && begin < cmdSplited.length) {
            while (!checker_1.default.isArgumentMatch(cmdArg, spusArg)) {
                if (cmdArg !== '') {
                    end -= 1;
                    cmdArg = cmdSplited.slice(begin, end).join(' ');
                }
                else {
                    return null;
                }
            }
            begin = end;
            end = cmdSplited.length;
            if (spusArg.charAt(0) === '%') {
                map.set(`%${cnt++}`, Updater.upArgument(cmdArg, spusArg));
            }
            spusArg = spusReader.next();
            cmdArg = cmdSplited.slice(begin, end).join(' ');
        }
        if (cmdArg === '' && spusArg === '') {
            return map;
        }
        else {
            return null;
        }
    }
    static upLine(input, positionCorrect) {
        if (input.charAt(0) === '#' || /^\s*$/.test(input)) {
            return input;
        }
        else {
            return Updater.upCommand(input, positionCorrect);
        }
    }
    static upCommand(input, positionCorrect) {
        let slash = false;
        if (input.slice(0, 1) === '/') {
            input = input.slice(1);
            slash = true;
        }
        for (const spusOld of spuses_1.default.pairs.keys()) {
            let map = Updater.getResultMap(input, spusOld);
            if (map) {
                let spusNew = spuses_1.default.pairs.get(spusOld);
                if (spusNew) {
                    let spus = new spu_script_1.default(spusNew);
                    let result = spus.compileWith(map);
                    if (positionCorrect) {
                        return `execute positioned 0.0 0.0 0.0 run ${result}`;
                    }
                    else {
                        if (slash) {
                            result = '/' + result;
                        }
                        return result;
                    }
                }
            }
        }
        throw `Unknown command: ${input}`;
    }
    static upArgument(arg, spus) {
        switch (spus.slice(1)) {
            case 'adv':
                return arg;
            case 'adv_crit':
                return arg;
            case 'block':
                return arg;
            case 'block_dust_param':
                return Updater.upBlockDustParam(arg);
            case 'block_metadata_or_state':
                return arg;
            case 'block_nbt':
                return arg;
            case 'bool':
                return arg;
            case 'command':
                return Updater.upCommand(arg, false);
            case 'difficulty':
                return Updater.upDifficulty(arg);
            case 'effect':
                return Updater.upEffect(arg);
            case 'entity':
                return Updater.upEntity(arg);
            case 'entity_nbt':
                return Updater.upEntityNbt(arg);
            case 'ench':
                return Updater.upEnch(arg);
            case 'entity_type':
                return Updater.upEntityType(arg);
            case 'func':
                return arg;
            case 'gamemode':
                return Updater.upGamemode(arg);
            case 'ip':
                return arg;
            case 'item':
                return arg;
            case 'item_data':
                return arg;
            case 'item_dust_params':
                return Updater.upItemDustParams(arg);
            case 'item_nbt':
                return Updater.upItemNbt(arg);
            case 'item_tag_nbt':
                return arg;
            case 'json':
                return Updater.upJson(arg);
            case 'literal':
                return arg.toLowerCase();
            case 'num':
                return arg;
            case 'num_or_star':
                return arg;
            case 'particle':
                return Updater.upParticle(arg);
            case 'recipe':
                return arg;
            case 'scb_crit':
                return Updater.upScbCrit(arg);
            case 'slot':
                return Updater.upSlot(arg);
            case 'sound':
                return arg;
            case 'source':
                return arg;
            case 'string':
                return arg;
            case 'uuid':
                return arg;
            case 'vec_2':
                return arg;
            case 'vec_3':
                return arg;
            case 'word':
                return arg;
            default:
                throw `Unknown arg type: '${spus}'`;
        }
    }
    static upBlockDustParam(input) {
        const num = Number(input);
        const id = blocks_1.default.get1_13NominalIDFrom1_12NumericID(num);
        return id.toString();
    }
    static upBlockNbt(nbt, blockNominalID) {
        const root = utils_1.getNbt(nbt);
        if (blockNominalID.slice(0, 10) !== 'minecraft:') {
            blockNominalID = 'minecraft:' + blockNominalID;
        }
        const block = blockNominalID.split('[')[0];
        switch (block) {
            case 'minecraft:white_banner': {
                {
                    const value = root.get('CustomName');
                    if (value instanceof nbt_1.NbtString) {
                        value.set(`{"text":"${utils_1.escape(value.get())}"}`);
                    }
                }
                {
                    const base = root.get('Base');
                    root.del('Base');
                    if (base instanceof nbt_1.NbtInt) {
                        return `$ID>${items_1.default.getNominalColorFromNumericColor(base.get(), 'banner')}`;
                    }
                }
                break;
            }
            case 'minecraft:white_wall_banner': {
                {
                    const value = root.get('CustomName');
                    if (value instanceof nbt_1.NbtString) {
                        value.set(`{"text":"${utils_1.escape(value.get())}"}`);
                    }
                }
                {
                    const base = root.get('Base');
                    root.del('Base');
                    if (base instanceof nbt_1.NbtInt) {
                        return `$ID>${items_1.default.getNominalColorFromNumericColor(base.get(), 'wall_banner')}`;
                    }
                }
                break;
            }
            case 'minecraft:enchanting_table': {
                {
                    const value = root.get('CustomName');
                    if (value instanceof nbt_1.NbtString) {
                        value.set(`{"text":"${utils_1.escape(value.get())}"}`);
                    }
                }
                break;
            }
            case 'minecraft:red_bed': {
                {
                    const color = root.get('color');
                    if (color instanceof nbt_1.NbtInt) {
                        return `$ID>${items_1.default.getNominalColorFromNumericColor(color.get(), 'bed')}`;
                    }
                }
                break;
            }
            case 'minecraft:cauldron': {
                {
                    const items = root.get('Items');
                    if (items instanceof nbt_1.NbtList) {
                        for (let i = 0; i < items.length; i++) {
                            let item = items.get(i);
                            item = utils_1.getNbt(Updater.upItemNbt(item.toString()));
                            items.set(i, item);
                        }
                    }
                }
                break;
            }
            case 'minecraft:brewing_stand':
            case 'minecraft:chest':
            case 'minecraft:dispenser':
            case 'minecraft:dropper':
            case 'minecraft:furnance':
            case 'minecraft:hopper':
            case 'minecraft:shulker_box': {
                {
                    const value = root.get('CustomName');
                    if (value instanceof nbt_1.NbtString) {
                        value.set(`{"text":"${utils_1.escape(value.get())}"}`);
                    }
                }
                {
                    const items = root.get('Items');
                    if (items instanceof nbt_1.NbtList) {
                        for (let i = 0; i < items.length; i++) {
                            let item = items.get(i);
                            item = utils_1.getNbt(Updater.upItemNbt(item.toString()));
                            items.set(i, item);
                        }
                    }
                }
                break;
            }
            case 'minecraft:command_block':
            case 'minecraft:repeating_command_block':
            case 'minecraft:chain_command_block': {
                {
                    const value = root.get('CustomName');
                    if (value instanceof nbt_1.NbtString) {
                        value.set(`{"text":"${utils_1.escape(value.get())}"}`);
                    }
                }
                {
                    const command = root.get('Command');
                    if (command instanceof nbt_1.NbtString) {
                        command.set(Updater.upCommand(command.get(), false));
                    }
                }
                break;
            }
            case 'minecraft:potted_cactus': {
                {
                    const item = root.get('Item');
                    const data = root.get('Data');
                    if (item instanceof nbt_1.NbtString && data instanceof nbt_1.NbtInt) {
                        return `$ID>minecraft:potted_${blocks_1.default.get1_13NominalIDFrom1_12NominalID(blocks_1.default.get1_12NominalIDFrom1_12StringIDWithMetadata(item.get(), data.get()))
                            .split('[')[0]
                            .replace('minecraft:', '')}`;
                    }
                }
                break;
            }
            case 'minecraft:jukebox': {
                {
                    root.del('Record');
                }
                {
                    let item = root.get('RecordItem');
                    if (item instanceof nbt_1.NbtString) {
                        item = utils_1.getNbt(Updater.upItemNbt(item.toString()));
                        root.set('RecordItem', item);
                    }
                }
                break;
            }
            case 'minecraft:mob_spawner': {
                {
                    const spawnPotentials = root.get('SpawnPotentials');
                    if (spawnPotentials instanceof nbt_1.NbtList) {
                        for (let i = 0; i < spawnPotentials.length; i++) {
                            const potential = spawnPotentials.get(i);
                            if (potential instanceof nbt_1.NbtCompound) {
                                let entity = potential.get('Entity');
                                if (entity instanceof nbt_1.NbtCompound) {
                                    entity = utils_1.getNbt(Updater.upEntityNbt(entity.toString()));
                                    potential.set('Entity', entity);
                                }
                            }
                        }
                    }
                }
                {
                    let spawnData = root.get('SpawnData');
                    if (spawnData instanceof nbt_1.NbtCompound) {
                        spawnData = utils_1.getNbt(Updater.upEntityNbt(spawnData.toString()));
                        root.set('SpawnData', spawnData);
                    }
                }
                break;
            }
            case 'minecraft:note_block': {
                {
                    const note = root.get('note');
                    const powered = root.get('powered');
                    if ((note instanceof nbt_1.NbtByte || note instanceof nbt_1.NbtInt) &&
                        (powered instanceof nbt_1.NbtByte || powered instanceof nbt_1.NbtInt)) {
                        return `$BS>pitch=${note.get()},powered=${powered.get() !== 0}`;
                    }
                    else if (note instanceof nbt_1.NbtByte || note instanceof nbt_1.NbtInt) {
                        return `$BS>pitch=${note.get()}`;
                    }
                    else if (powered instanceof nbt_1.NbtByte || powered instanceof nbt_1.NbtInt) {
                        return `$BS>powered=${powered.get() !== 0}`;
                    }
                }
                break;
            }
            case 'minecraft:piston': {
                {
                    const blockID = root.get('blockId');
                    const blockData = root.get('blockData');
                    root.del('blockId');
                    root.del('blockData');
                    if (blockID instanceof nbt_1.NbtInt &&
                        (blockData instanceof nbt_1.NbtInt || typeof blockData === 'undefined')) {
                        const blockState = Updater.upBlockNumericIDToBlockState(blockID, blockData);
                        root.set('blockState', blockState);
                    }
                }
                break;
            }
            case 'minecraft:sign': {
                {
                    const text = root.get('Text1');
                    if (text instanceof nbt_1.NbtString) {
                        text.set(Updater.upJson(text.get()));
                    }
                }
                {
                    const text = root.get('Text2');
                    if (text instanceof nbt_1.NbtString) {
                        text.set(Updater.upJson(text.get()));
                    }
                }
                {
                    const text = root.get('Text3');
                    if (text instanceof nbt_1.NbtString) {
                        text.set(Updater.upJson(text.get()));
                    }
                }
                {
                    const text = root.get('Text4');
                    if (text instanceof nbt_1.NbtString) {
                        text.set(Updater.upJson(text.get()));
                    }
                }
                break;
            }
            case 'minecraft:skeleton_skull': {
                {
                    const skullType = root.get('SkullType');
                    const rot = root.get('Rot');
                    root.del('SkullType');
                    root.del('Rot');
                    let skullIDPrefix;
                    let skullIDSuffix;
                    if (skullType instanceof nbt_1.NbtByte || skullType instanceof nbt_1.NbtInt) {
                        switch (skullType.get()) {
                            case 0:
                                skullIDPrefix = 'skeleton';
                                skullIDSuffix = 'skull';
                                break;
                            case 1:
                                skullIDPrefix = 'wither_skeleton';
                                skullIDSuffix = 'skull';
                                break;
                            case 2:
                                skullIDPrefix = 'zombie';
                                skullIDSuffix = 'head';
                                break;
                            case 3:
                                skullIDPrefix = 'player';
                                skullIDSuffix = 'head';
                                break;
                            case 4:
                                skullIDPrefix = 'creeper';
                                skullIDSuffix = 'head';
                                break;
                            case 5:
                                skullIDPrefix = 'dragon';
                                skullIDSuffix = 'head';
                                break;
                            default:
                                skullIDPrefix = 'skeleton';
                                skullIDSuffix = 'skull';
                                break;
                        }
                    }
                    else {
                        skullIDPrefix = 'skeleton';
                        skullIDSuffix = 'skull';
                    }
                    if (blockNominalID.indexOf('facing=up') !== -1 || blockNominalID.indexOf('facing=down') !== -1) {
                        if (rot instanceof nbt_1.NbtByte || rot instanceof nbt_1.NbtInt) {
                            return `$FL>${skullIDPrefix}_${skullIDSuffix}[rotation=${rot.get()}]${root.toString() !== '{}' ? root.toString() : ''}`;
                        }
                        else {
                            return `$FL>${skullIDPrefix}_${skullIDSuffix}[rotation=0]${root.toString() !== '{}' ? root.toString() : ''}`;
                        }
                    }
                    else {
                        const facing = blockNominalID.indexOf('facing=') !== -1
                            ? blockNominalID.slice(blockNominalID.indexOf('facing=') + 7, blockNominalID.indexOf(',', blockNominalID.indexOf('facing=') + 7))
                            : 'north';
                        return `$FL>${skullIDPrefix}_wall_${skullIDSuffix}[facing=${facing}]${root.toString() !== '{}' ? root.toString() : ''}`;
                    }
                }
            }
            default:
                break;
        }
        return root.toString();
    }
    static upDifficulty(input) {
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
    static upEffect(input) {
        if (utils_1.isNumeric(input)) {
            return effects_1.default.get1_12NominalIDFrom1_12NumericID(Number(input));
        }
        else {
            return input;
        }
    }
    static upEnch(input) {
        if (utils_1.isNumeric(input)) {
            return enchantments_1.default.get1_12NominalIDFrom1_12NumericID(Number(input));
        }
        else {
            return input;
        }
    }
    static upEntity(input) {
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
    static upEntityNbt(input) {
        const root = utils_1.getNbt(input);
        {
            const id = root.get('id');
            if (id instanceof nbt_1.NbtString) {
                id.set(entities_1.default.get1_13NominalIDFrom1_12NominalID(id.get()));
            }
        }
        {
            const value = root.get('CustomName');
            if (value instanceof nbt_1.NbtString) {
                value.set(`{"text":"${utils_1.escape(value.get())}"}`);
            }
        }
        {
            const passengers = root.get('Passengers');
            if (passengers instanceof nbt_1.NbtList) {
                for (let i = 0; i < passengers.length; i++) {
                    let passenger = passengers.get(i);
                    passenger = utils_1.getNbt(Updater.upEntityNbt(passenger.toString()));
                    passengers.set(i, passenger);
                }
            }
        }
        {
            const handItems = root.get('HandItems');
            if (handItems instanceof nbt_1.NbtList) {
                for (let i = 0; i < handItems.length; i++) {
                    let item = handItems.get(i);
                    item = utils_1.getNbt(Updater.upItemNbt(item.toString()));
                    handItems.set(i, item);
                }
            }
        }
        {
            const armorItems = root.get('ArmorItems');
            if (armorItems instanceof nbt_1.NbtList) {
                for (let i = 0; i < armorItems.length; i++) {
                    let item = armorItems.get(i);
                    item = utils_1.getNbt(Updater.upItemNbt(item.toString()));
                    armorItems.set(i, item);
                }
            }
        }
        {
            let armorItem = root.get('ArmorItem');
            if (armorItem instanceof nbt_1.NbtCompound) {
                armorItem = utils_1.getNbt(Updater.upItemNbt(armorItem.toString()));
                root.set('ArmorItem', armorItem);
            }
        }
        {
            let saddleItem = root.get('SaddleItem');
            if (saddleItem instanceof nbt_1.NbtCompound) {
                saddleItem = utils_1.getNbt(Updater.upItemNbt(saddleItem.toString()));
                root.set('SaddleItem', saddleItem);
            }
        }
        {
            const items = root.get('Items');
            if (items instanceof nbt_1.NbtList) {
                for (let i = 0; i < items.length; i++) {
                    let item = items.get(i);
                    item = utils_1.getNbt(Updater.upItemNbt(item.toString()));
                    items.set(i, item);
                }
            }
        }
        {
            const carried = root.get('carried');
            const carriedData = root.get('carriedData');
            root.del('carried');
            root.del('carriedData');
            if ((carried instanceof nbt_1.NbtShort || carried instanceof nbt_1.NbtInt) &&
                (carriedData instanceof nbt_1.NbtShort || carriedData instanceof nbt_1.NbtInt || typeof carriedData === 'undefined')) {
                const carriedBlockState = Updater.upBlockNumericIDToBlockState(carried, carriedData);
                root.set('carriedBlockState', carriedBlockState);
            }
        }
        {
            let decorItem = root.get('DecorItem');
            if (decorItem instanceof nbt_1.NbtCompound) {
                decorItem = utils_1.getNbt(Updater.upItemNbt(decorItem.toString()));
                root.set('DecorItem', decorItem);
            }
        }
        {
            const inventory = root.get('Inventory');
            if (inventory instanceof nbt_1.NbtList) {
                for (let i = 0; i < inventory.length; i++) {
                    let item = inventory.get(i);
                    item = utils_1.getNbt(Updater.upItemNbt(item.toString()));
                    inventory.set(i, item);
                }
            }
        }
        {
            const inTile = root.get('inTile');
            root.del('inTile');
            if (inTile instanceof nbt_1.NbtString) {
                const inBlockState = Updater.upBlockStringIDToBlockState(inTile);
                root.set('inBlockState', inBlockState);
            }
        }
        {
            let item = root.get('Item');
            if (item instanceof nbt_1.NbtCompound) {
                item = utils_1.getNbt(Updater.upItemNbt(item.toString()));
                root.set('Item', item);
            }
        }
        {
            let selectedItem = root.get('SelectedItem');
            if (selectedItem instanceof nbt_1.NbtCompound) {
                selectedItem = utils_1.getNbt(Updater.upItemNbt(selectedItem.toString()));
                root.set('SelectedItem', selectedItem);
            }
        }
        {
            const command = root.get('Command');
            if (command instanceof nbt_1.NbtString) {
                command.set(Updater.upCommand(command.get(), false));
            }
        }
        {
            const spawnPotentials = root.get('SpawnPotentials');
            if (spawnPotentials instanceof nbt_1.NbtList) {
                for (let i = 0; i < spawnPotentials.length; i++) {
                    const potential = spawnPotentials.get(i);
                    if (potential instanceof nbt_1.NbtCompound) {
                        let entity = potential.get('Entity');
                        if (entity instanceof nbt_1.NbtCompound) {
                            entity = utils_1.getNbt(Updater.upEntityNbt(entity.toString()));
                            potential.set('Entity', entity);
                        }
                    }
                }
            }
        }
        {
            let spawnData = root.get('SpawnData');
            if (spawnData instanceof nbt_1.NbtCompound) {
                spawnData = utils_1.getNbt(Updater.upEntityNbt(spawnData.toString()));
                root.set('SpawnData', spawnData);
            }
        }
        {
            const block = root.get('Block');
            const data = root.get('Data');
            root.del('Block');
            root.del('Data');
            if (block instanceof nbt_1.NbtString &&
                (data instanceof nbt_1.NbtByte || data instanceof nbt_1.NbtInt || typeof data === 'undefined')) {
                const blockState = Updater.upBlockStringIDToBlockState(block, data);
                root.set('BlockState', blockState);
            }
            let tileEntityData = root.get('TileEntityData');
            if (block instanceof nbt_1.NbtString && tileEntityData instanceof nbt_1.NbtCompound) {
                tileEntityData = utils_1.getNbt(Updater.upBlockNbt(tileEntityData.toString(), blocks_1.default.get1_12NominalIDFrom1_12StringIDWithMetadata(block.get(), data ? data.get() : 0)));
                root.set('TileEntityData', tileEntityData);
            }
        }
        {
            const displayTile = root.get('DisplayTile');
            const displayData = root.get('DisplayData');
            root.del('DisplayTile');
            root.del('DisplayData');
            if (displayTile instanceof nbt_1.NbtString &&
                (displayData instanceof nbt_1.NbtInt || typeof displayData === 'undefined')) {
                const displayState = Updater.upBlockStringIDToBlockState(displayTile, displayData);
                root.set('DisplayState', displayState);
            }
        }
        {
            const particle = root.get('Particle');
            const particleParam1 = root.get('ParticleParam1');
            const particleParam2 = root.get('ParticleParam2');
            root.del('ParticleParam1');
            root.del('ParticleParam2');
            if (particle instanceof nbt_1.NbtString) {
                particle.set(Updater.upParticle(particle.get()));
                if (particle.get() === 'block') {
                    if (particleParam1 instanceof nbt_1.NbtInt) {
                        particle.set(particle.get() + ' ' + Updater.upBlockDustParam(particleParam1.get().toString()));
                    }
                }
                else if (particle.get() === 'item') {
                    if (particleParam1 instanceof nbt_1.NbtInt && particleParam2 instanceof nbt_1.NbtInt) {
                        particle.set(particle.get() +
                            ' ' +
                            Updater.upItemDustParams(particleParam1.get().toString() + ' ' + particleParam2.get().toString()));
                    }
                }
            }
        }
        return root.toString();
    }
    static upBlockNumericIDToBlockState(id, data) {
        const carriedBlockState = new nbt_1.NbtCompound();
        const name = new nbt_1.NbtString();
        const properties = new nbt_1.NbtCompound();
        const metadata = data ? data.get() : 0;
        const nominal = blocks_1.default.get1_13NominalIDFrom1_12NumericID(id.get(), metadata);
        name.set(nominal.split('[')[0]);
        if (nominal.indexOf('[') !== -1) {
            nominal
                .slice(nominal.indexOf('[') + 1, -1)
                .split(',')
                .forEach(v => {
                const val = new nbt_1.NbtString();
                const pairs = v.split('=');
                val.set(pairs[1]);
                properties.set(pairs[0], val);
            });
            carriedBlockState.set('Properties', properties);
        }
        carriedBlockState.set('Name', name);
        return carriedBlockState;
    }
    static upBlockStringIDToBlockState(block, data) {
        const blockState = new nbt_1.NbtCompound();
        const name = new nbt_1.NbtString();
        const properties = new nbt_1.NbtCompound();
        const metadata = data ? data.get() : 0;
        const nominal = blocks_1.default.get1_13NominalIDFrom1_12NominalID(blocks_1.default.get1_12NominalIDFrom1_12StringIDWithMetadata(block.get(), metadata));
        name.set(nominal.split('[')[0]);
        if (nominal.indexOf('[') !== -1) {
            nominal
                .slice(nominal.indexOf('[') + 1, -1)
                .split(',')
                .forEach(v => {
                const val = new nbt_1.NbtString();
                const pairs = v.split('=');
                val.set(pairs[1]);
                properties.set(pairs[0], val);
            });
            blockState.set('Properties', properties);
        }
        blockState.set('Name', name);
        return blockState;
    }
    static upEntityType(input) {
        return entities_1.default.get1_13NominalIDFrom1_12NominalID(input);
    }
    static upGamemode(input) {
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
    static upItemDustParams(input) {
        const params = input.split(' ').map(x => Number(x));
        const nominal = items_1.default.get1_12NominalIDFrom1_12NumericID(params[0]);
        return items_1.default.get1_13NominalIDFrom1_12NominalIDWithDataValue(nominal, params[1]);
    }
    static upItemNbt(input) {
        const root = utils_1.getNbt(input);
        const id = root.get('id');
        const damage = root.get('Damage');
        let tag = root.get('tag');
        if (id instanceof nbt_1.NbtString && (damage instanceof nbt_1.NbtShort || damage instanceof nbt_1.NbtInt)) {
            if (tag instanceof nbt_1.NbtCompound) {
                tag = utils_1.getNbt(Updater.upItemTagNbt(tag.toString(), id.get()));
            }
            if (items_1.default.isDamageItem(id.get())) {
                if (!(tag instanceof nbt_1.NbtCompound)) {
                    tag = new nbt_1.NbtCompound();
                }
                tag.set('Damage', damage);
            }
            else {
                const newID = items_1.default.get1_13NominalIDFrom1_12NominalIDWithDataValue(id.get(), damage.get());
                id.set(newID);
                root.set('id', id);
            }
            root.del('Damage');
            if (tag instanceof nbt_1.NbtCompound) {
                root.set('tag', tag);
            }
        }
        return root.toString();
    }
    static upItemTagNbt(nbt, itemNominalID) {
        const item = itemNominalID.split('[')[0];
        const root = utils_1.getNbt(nbt);
        {
            const canDestroy = root.get('CanDestroy');
            if (canDestroy instanceof nbt_1.NbtList) {
                for (let i = 0; i < canDestroy.length; i++) {
                    const block = canDestroy.get(i);
                    if (block instanceof nbt_1.NbtString) {
                        block.set(blocks_1.default.get1_13NominalIDFrom1_12NominalID(blocks_1.default.get1_12NominalIDFrom1_12StringIDWithMetadata(block.get(), 0)).split('[')[0]);
                        canDestroy.set(i, block);
                    }
                }
                root.set('CanDestroy', canDestroy);
            }
        }
        {
            const canPlaceOn = root.get('CanPlaceOn');
            if (canPlaceOn instanceof nbt_1.NbtList) {
                for (let i = 0; i < canPlaceOn.length; i++) {
                    const block = canPlaceOn.get(i);
                    if (block instanceof nbt_1.NbtString) {
                        block.set(blocks_1.default.get1_13NominalIDFrom1_12NominalID(blocks_1.default.get1_12NominalIDFrom1_12StringIDWithMetadata(block.get(), 0)).split('[')[0]);
                    }
                    canPlaceOn.set(i, block);
                }
                root.set('CanPlaceOn', canPlaceOn);
            }
        }
        {
            if (blocks_1.default.is1_12StringID(item)) {
                let blockEntityTag = root.get('BlockEntityTag');
                if (blockEntityTag instanceof nbt_1.NbtCompound) {
                    blockEntityTag = utils_1.getNbt(Updater.upBlockNbt(blockEntityTag.toString(), item));
                    root.set('BlockEntityTag', blockEntityTag);
                }
            }
        }
        {
            const enchantments = root.get('ench');
            root.del('ench');
            if (enchantments instanceof nbt_1.NbtList) {
                for (let i = 0; i < enchantments.length; i++) {
                    const enchantment = enchantments.get(i);
                    if (enchantment instanceof nbt_1.NbtCompound) {
                        let id = enchantment.get('id');
                        if (id instanceof nbt_1.NbtShort || id instanceof nbt_1.NbtInt) {
                            const strID = enchantments_1.default.get1_12NominalIDFrom1_12NumericID(id.get());
                            id = new nbt_1.NbtString();
                            id.set(strID);
                            enchantment.set('id', id);
                        }
                        enchantments.set(i, enchantment);
                    }
                }
                root.set('Enchantments', enchantments);
            }
        }
        {
            const storedEnchantments = root.get('StoredEnchantments');
            if (storedEnchantments instanceof nbt_1.NbtList) {
                for (let i = 0; i < storedEnchantments.length; i++) {
                    const enchantment = storedEnchantments.get(i);
                    if (enchantment instanceof nbt_1.NbtCompound) {
                        let id = enchantment.get('id');
                        if (id instanceof nbt_1.NbtShort || id instanceof nbt_1.NbtInt) {
                            const strID = enchantments_1.default.get1_12NominalIDFrom1_12NumericID(id.get());
                            id = new nbt_1.NbtString();
                            id.set(strID);
                            enchantment.set('id', id);
                        }
                        storedEnchantments.set(i, enchantment);
                    }
                }
                root.set('Enchantments', storedEnchantments);
            }
        }
        {
            const display = root.get('display');
            if (display instanceof nbt_1.NbtCompound) {
                const name = display.get('Name');
                if (name instanceof nbt_1.NbtString) {
                    name.set(`{"text": "${utils_1.escape(name.get())}"}`);
                    display.set('Name', name);
                }
                const locName = display.get('LocName');
                display.del('LocName');
                if (locName instanceof nbt_1.NbtString) {
                    locName.set(`{"translate": "${locName.get()}"}`);
                    display.set('Name', locName);
                }
                root.set('display', display);
            }
        }
        {
            if (items_1.default.hasEntityTag(item)) {
                let entityTag = root.get('EntityTag');
                if (entityTag instanceof nbt_1.NbtCompound) {
                    entityTag = utils_1.getNbt(Updater.upEntityNbt(entityTag.toString()));
                    root.set('EntityTag', entityTag);
                }
            }
        }
        return root.toString();
    }
    static upJson(input) {
        if (input.slice(0, 1) === '"') {
            return input;
        }
        else if (input.slice(0, 1) === '[') {
            let json = JSON.parse(input);
            let result = [];
            for (const i of json) {
                result.push(Updater.upJson(JSON.stringify(i)));
            }
            return `[${result.join()}]`;
        }
        else {
            let json = JSON.parse(input);
            if (json.selector) {
                let sel = new selector_1.default();
                sel.parse1_12(json.selector);
                json.selector = sel.get1_13();
            }
            if (json.clickEvent &&
                json.clickEvent.action &&
                (json.clickEvent.action === 'run_command' || json.clickEvent.action === 'suggest_command') &&
                json.clickEvent.value) {
                json.clickEvent.value = Updater.upCommand(json.clickEvent.value, false);
            }
            if (json.extra) {
                json.extra = JSON.parse(Updater.upJson(JSON.stringify(json.extra)));
            }
            return JSON.stringify(json);
        }
    }
    static upParticle(input) {
        return particles_1.default.get1_13NominalIDFrom1_12NominalID(input);
    }
    static upScbCrit(input) {
        if (input.slice(0, 5) === 'stat.') {
            const subs = input.split(/\./g);
            const newCrit = scoreboard_criterias_1.default.get1_13From1_12(subs[1]);
            switch (subs[1]) {
                case 'mineBlock':
                    let block = '';
                    if (utils_1.isNumeric(subs[2])) {
                        block = blocks_1.default.get1_13NominalIDFrom1_12NumericID(Number(subs[2]))
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '');
                    }
                    else {
                        block = blocks_1.default.get1_13NominalIDFrom1_12NominalID(blocks_1.default.get1_12NominalIDFrom1_12StringID(`${subs[2]}:${subs[3]}`))
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '');
                    }
                    return `minecraft.${newCrit}:${block}`;
                case 'craftItem':
                case 'useItem':
                case 'breakItem':
                case 'pickup':
                case 'drop':
                    let item = '';
                    if (utils_1.isNumeric(subs[2])) {
                        item = items_1.default.get1_13NominalIDFrom1_12NominalIDWithDataValue(items_1.default.get1_12NominalIDFrom1_12NumericID(Number(subs[2])))
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '');
                    }
                    else {
                        item = items_1.default.get1_13NominalIDFrom1_12NominalIDWithDataValue(`${subs[2]}:${subs[3]}`)
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '');
                    }
                    return `minecraft.${newCrit}:${item}`;
                case 'killEntity':
                case 'entityKilledBy':
                    const entity = entities_1.default.get1_13NominalIDFrom1_12NominalID(entities_1.default.get1_12NominalIDFrom1_10FuckingID(subs[2])).replace(/:/g, '.');
                    return `minecraft.${newCrit}:${entity}`;
                default:
                    return `minecraft.custom:minecraft.${subs[1]}`;
            }
        }
        else {
            return input;
        }
    }
    static upSlot(input) {
        return input.slice(5);
    }
}
exports.default = Updater;

},{"./checker":1,"./mappings/blocks":3,"./mappings/effects":4,"./mappings/enchantments":5,"./mappings/entities":6,"./mappings/items":7,"./mappings/particles":8,"./mappings/scoreboard_criterias":9,"./mappings/spuses":10,"./spu_script":11,"./utils/argument_reader":13,"./utils/nbt/nbt":15,"./utils/selector":18,"./utils/utils":19}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"./utils":19}],15:[function(require,module,exports){
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
        this.del = (key) => this.value.delete(key);
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
    get length() {
        return this.value.length;
    }
    set(index, val) {
        this.value[index] = val;
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

},{"../utils":19}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const nbt_1 = require("./nbt");
class Parser {
    parse(tokens) {
        const result = this.parseCompound(tokens, 0);
        if (tokens[result.pos + 1].type === 'EndOfDocument') {
            return result.value;
        }
        else {
            throw `Unsymmetrical squares.`;
        }
    }
    parseCompound(tokens, pos) {
        let expectedTypes;
        let state = 'key';
        let key = '';
        let val;
        let result = new nbt_1.NbtCompound();
        expectedTypes = ['BeginCompound'];
        for (; pos < tokens.length; pos++) {
            const token = tokens[pos];
            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginCompound':
                        if (state === 'key') {
                            expectedTypes = ['EndCompound', 'Thing', 'String'];
                        }
                        else if (state === 'val') {
                            expectedTypes = ['Comma', 'EndCompound'];
                            const parseResult = this.parseCompound(tokens, pos);
                            val = parseResult.value;
                            pos = parseResult.pos;
                            result.set(key, val);
                            state = 'key';
                        }
                        break;
                    case 'EndCompound':
                        return { value: result, pos: pos };
                    case 'Thing':
                    case 'String':
                        if (token.type === 'Thing') {
                            val = this.parseThing(token);
                        }
                        else {
                            val = new nbt_1.NbtString();
                            val.set(token.value.toString());
                        }
                        if (state === 'key') {
                            expectedTypes = ['Colon'];
                            key = token.value;
                            state = 'val';
                        }
                        else if (state === 'val') {
                            expectedTypes = ['Comma', 'EndCompound'];
                            if (val) {
                                result.set(key, val);
                            }
                            state = 'key';
                        }
                        break;
                    case 'BeginByteArray':
                    case 'BeginIntArray':
                    case 'BeginList':
                    case 'BeginLongArray':
                        expectedTypes = ['Comma', 'EndCompound'];
                        const parseResult = this.parseValue(tokens, pos);
                        val = parseResult.value;
                        pos = parseResult.pos;
                        result.set(key, val);
                        state = 'key';
                        break;
                    case 'Colon':
                        expectedTypes = [
                            'Thing',
                            'String',
                            'BeginByteArray',
                            'BeginCompound',
                            'BeginIntArray',
                            'BeginList',
                            'BeginLongArray'
                        ];
                        break;
                    case 'Comma':
                        expectedTypes = ['EndCompound', 'Thing', 'String'];
                        break;
                    default:
                        break;
                }
            }
            else {
                throw `Expect '${expectedTypes}' but get '${token.type}' at pos '${pos}'.`;
            }
        }
        throw 'Parsing compound error!';
    }
    parseList(tokens, pos) {
        let expectedTypes;
        let resultValue = new nbt_1.NbtList();
        let state = 'begin';
        let val;
        expectedTypes = ['BeginList'];
        for (; pos < tokens.length; pos++) {
            const token = tokens[pos];
            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginList':
                        if (state === 'begin') {
                            expectedTypes = [
                                'EndListOrArray',
                                'Thing',
                                'String',
                                'BeginByteArray',
                                'BeginCompound',
                                'BeginIntArray',
                                'BeginList',
                                'BeginLongArray'
                            ];
                            state = 'value';
                        }
                        else if (state === 'value') {
                            expectedTypes = ['Comma', 'EndListOrArray'];
                            const parseResult = this.parseList(tokens, pos);
                            val = parseResult.value;
                            pos = parseResult.pos;
                            resultValue.add(val);
                        }
                        break;
                    case 'EndListOrArray':
                        return { value: resultValue, pos: pos };
                    case 'Thing':
                    case 'String':
                    case 'BeginByteArray':
                    case 'BeginIntArray':
                    case 'BeginList':
                    case 'BeginLongArray':
                    case 'BeginCompound':
                        expectedTypes = ['Comma', 'EndListOrArray'];
                        const parseResult = this.parseValue(tokens, pos);
                        val = parseResult.value;
                        pos = parseResult.pos;
                        resultValue.add(val);
                        break;
                    case 'Comma':
                        expectedTypes = [
                            'EndListOrArray',
                            'Thing',
                            'String',
                            'BeginByteArray',
                            'BeginCompound',
                            'BeginIntArray',
                            'BeginList',
                            'BeginLongArray'
                        ];
                        break;
                    default:
                        break;
                }
            }
            else {
                throw `Expect '${expectedTypes}' but get '${token.type}' at pos '${pos}'.`;
            }
        }
        throw 'Parsing list error!';
    }
    parseByteArray(tokens, pos) {
        let expectedTypes;
        let resultValue = new nbt_1.NbtByteArray();
        let val;
        expectedTypes = ['BeginByteArray'];
        for (; pos < tokens.length; pos++) {
            const token = tokens[pos];
            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginByteArray':
                        expectedTypes = ['EndListOrArray', 'Thing'];
                        break;
                    case 'EndListOrArray':
                        return { value: resultValue, pos: pos };
                    case 'Thing':
                        expectedTypes = ['Comma', 'EndListOrArray'];
                        if ((val = this.parseByte(token)) !== null) {
                            resultValue.add(val);
                        }
                        else {
                            throw `Get a token at '${pos}' whoose type isn't 'Byte' when parsing byte array!`;
                        }
                        break;
                    case 'Comma':
                        expectedTypes = ['EndListOrArray', 'Thing'];
                        break;
                    default:
                        break;
                }
            }
            else {
                throw `Expect '${expectedTypes}' but get '${token.type}' at pos '${pos}'.`;
            }
        }
        throw 'Parsing byte array error!';
    }
    parseIntArray(tokens, pos) {
        let expectedTypes;
        let resultValue = new nbt_1.NbtIntArray();
        let val;
        expectedTypes = ['BeginIntArray'];
        for (; pos < tokens.length; pos++) {
            const token = tokens[pos];
            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginIntArray':
                        expectedTypes = ['EndListOrArray', 'Thing'];
                        break;
                    case 'EndListOrArray':
                        return { value: resultValue, pos: pos };
                    case 'Thing':
                        expectedTypes = ['Comma', 'EndListOrArray'];
                        if ((val = this.parseInt(token)) !== null) {
                            resultValue.add(val);
                        }
                        else {
                            throw `Get a token at '${pos}' whoose type isn't 'Int' when parsing int array!`;
                        }
                        break;
                    case 'Comma':
                        expectedTypes = ['EndListOrArray', 'Thing'];
                        break;
                    default:
                        break;
                }
            }
            else {
                throw `Expect '${expectedTypes}' but get '${token.type}' at pos '${pos}'.`;
            }
        }
        throw 'Parsing int array error!';
    }
    parseLongArray(tokens, pos) {
        let expectedTypes;
        let resultValue = new nbt_1.NbtLongArray();
        let val;
        expectedTypes = ['BeginLongArray'];
        for (; pos < tokens.length; pos++) {
            const token = tokens[pos];
            if (expectedTypes.indexOf(token.type) !== -1) {
                switch (token.type) {
                    case 'BeginLongArray':
                        expectedTypes = ['EndListOrArray', 'Thing'];
                        break;
                    case 'EndListOrArray':
                        return { value: resultValue, pos: pos };
                    case 'Thing':
                        expectedTypes = ['Comma', 'EndListOrArray'];
                        if ((val = this.parseLong(token)) !== null) {
                            resultValue.add(val);
                        }
                        else {
                            throw `Get a token at '${pos}' whoose type isn't 'Long' when parsing long array!`;
                        }
                        break;
                    case 'Comma':
                        expectedTypes = ['EndListOrArray', 'Thing'];
                        break;
                    default:
                        break;
                }
            }
            else {
                throw `Expect '${expectedTypes}' but get '${token.type}' at pos '${pos}'.`;
            }
        }
        throw 'Parsing long array error!';
    }
    parseValue(tokens, pos) {
        let token = tokens[pos];
        let val;
        let parseResult;
        switch (token.type) {
            case 'Thing':
            case 'String':
                if (token.type === 'Thing') {
                    val = this.parseThing(token);
                }
                else {
                    val = new nbt_1.NbtString();
                    val.set(token.value.toString());
                }
                return { value: val, pos: pos };
            case 'BeginCompound':
                parseResult = this.parseCompound(tokens, pos);
                break;
            case 'BeginByteArray':
                parseResult = this.parseByteArray(tokens, pos);
                break;
            case 'BeginIntArray':
                parseResult = this.parseIntArray(tokens, pos);
                break;
            case 'BeginList':
                parseResult = this.parseList(tokens, pos);
                break;
            case 'BeginLongArray':
                parseResult = this.parseLongArray(tokens, pos);
                break;
            default:
                throw `Token '${token.type}' is not a value!`;
        }
        val = parseResult.value;
        pos = parseResult.pos;
        return { value: val, pos: pos };
    }
    parseThing(token) {
        let result;
        if ((result = this.parseByte(token)) !== null) {
            return result;
        }
        else if ((result = this.parseShort(token)) !== null) {
            return result;
        }
        else if ((result = this.parseInt(token)) !== null) {
            return result;
        }
        else if ((result = this.parseLong(token)) !== null) {
            return result;
        }
        else if ((result = this.parseFloat(token)) !== null) {
            return result;
        }
        else if ((result = this.parseDouble(token)) !== null) {
            return result;
        }
        else {
            return this.parseString(token);
        }
    }
    parseString(token) {
        let result = new nbt_1.NbtString();
        result.set(token.value);
        return result;
    }
    parseByte(token) {
        let num;
        let result = new nbt_1.NbtByte();
        if (token.value === 'true') {
            num = 1;
        }
        else if (token.value === 'false') {
            num = 0;
        }
        else if (utils_1.isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'b') {
            num = parseInt(token.value);
        }
        else {
            return null;
        }
        result.set(num);
        return result;
    }
    parseShort(token) {
        let num;
        let result = new nbt_1.NbtShort();
        if (utils_1.isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 's') {
            num = parseInt(token.value);
        }
        else {
            return null;
        }
        result.set(num);
        return result;
    }
    parseInt(token) {
        let num;
        let result = new nbt_1.NbtInt();
        if (utils_1.isNumeric(token.value)) {
            if (token.value.indexOf('.') === -1) {
                num = parseFloat(token.value);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
        result.set(num);
        return result;
    }
    parseLong(token) {
        let num;
        let result = new nbt_1.NbtLong();
        if (utils_1.isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'l') {
            num = parseInt(token.value);
        }
        else {
            return null;
        }
        result.set(num);
        return result;
    }
    parseFloat(token) {
        let num;
        let result = new nbt_1.NbtFloat();
        if (utils_1.isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'l') {
            num = parseFloat(token.value);
        }
        else {
            return null;
        }
        result.set(num);
        return result;
    }
    parseDouble(token) {
        let num;
        let result = new nbt_1.NbtDouble();
        if (utils_1.isNumeric(token.value.slice(0, -1)) && token.value.slice(-1).toLowerCase() === 'd') {
            num = parseFloat(token.value);
        }
        else if (utils_1.isNumeric(token.value)) {
            if (token.value.indexOf('.') !== -1) {
                num = parseFloat(token.value);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
        result.set(num);
        return result;
    }
}
exports.Parser = Parser;

},{"../utils":19,"./nbt":15}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class Tokenizer {
    constructor() {
        this.charPattern = /[a-zA-Z0-9\._+\-]/;
    }
    tokenize(nbt) {
        let tokens = [];
        let result = this.readAToken(nbt, 0);
        tokens.push(result.token);
        while (result.token.type !== 'EndOfDocument') {
            result = this.readAToken(nbt, result.pos);
            tokens.push(result.token);
        }
        return tokens;
    }
    readAToken(nbt, pos) {
        pos = this.skipWhiteSpace(nbt, pos);
        switch (nbt.substr(pos, 1)) {
            case '{':
                return { token: { type: 'BeginCompound', value: '{' }, pos: pos + 1 };
            case '}':
                return { token: { type: 'EndCompound', value: '}' }, pos: pos + 1 };
            case '[':
                switch (nbt.substr(pos, 3)) {
                    case '[I;':
                        return {
                            token: { type: 'BeginIntArray', value: '[I;' },
                            pos: pos + 3
                        };
                    case '[B;':
                        return {
                            token: { type: 'BeginByteArray', value: '[B;' },
                            pos: pos + 3
                        };
                    case '[L;':
                        return {
                            token: { type: 'BeginLongArray', value: '[L;' },
                            pos: pos + 3
                        };
                    default:
                        return { token: { type: 'BeginList', value: '[' }, pos: pos + 1 };
                }
            case ']':
                return { token: { type: 'EndListOrArray', value: ']' }, pos: pos + 1 };
            case ':':
                return { token: { type: 'Colon', value: ':' }, pos: pos + 1 };
            case ',':
                return { token: { type: 'Comma', value: ',' }, pos: pos + 1 };
            case '':
                return { token: { type: 'EndOfDocument', value: '' }, pos: pos + 1 };
            case '"': {
                const readResult = this.readQuotedString(nbt, pos);
                return { token: { type: 'String', value: readResult.str }, pos: readResult.pos + 1 };
            }
            default: {
                const readResult = this.readUnquoted(nbt, pos);
                return {
                    token: { type: 'Thing', value: readResult.str },
                    pos: readResult.pos + 1
                };
            }
        }
    }
    skipWhiteSpace(nbt, pos) {
        while (utils_1.isWhiteSpace(nbt.substr(pos, 1))) {
            pos += 1;
        }
        return pos;
    }
    readQuotedString(nbt, pos) {
        let str = '';
        let flag = false;
        pos += 1;
        while (nbt.substr(pos, 1) !== '"' || flag) {
            if (nbt.substr(pos, 1) === '\\' && !flag) {
                flag = true;
            }
            else {
                str += nbt.substr(pos, 1);
                flag = false;
            }
            pos += 1;
        }
        return { str: str, pos: pos };
    }
    readUnquoted(nbt, pos) {
        let str = '';
        while ([',', ']', '}', ' ', ':', ''].indexOf(nbt.substr(pos, 1)) === -1) {
            const char = nbt.substr(pos, 1);
            if (this.charPattern.test(char)) {
                str += char;
            }
            else {
                throw `Illegal unquoted char at ${pos} in '${nbt}'.`;
            }
            pos += 1;
        }
        pos -= 1;
        return { str: str, pos: pos };
    }
}
exports.Tokenizer = Tokenizer;

},{"../utils":19}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const char_reader_1 = require("./char_reader");
const updater_1 = require("../updater");
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
        this.getVariable1_13 = (result) => (result += this.variable);
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
            if (['a', 'e', 'p', 'r', 's', ']'].indexOf(input.slice(-1)) === -1) {
                return false;
            }
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
    setNbt(nbt) {
        this.nbt = utils_1.getNbt(nbt);
    }
    parseVariable1_12(char, str) {
        switch (char) {
            case 'a':
            case 'e':
                this.sort = 'nearest';
                this.variable = char;
                break;
            case 'p':
            case 'r':
            case 's':
                this.variable = char;
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
                            if (this.variable === 'r') {
                                this.variable = 'e';
                                this.sort = 'random';
                            }
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
                            if (val.slice(0, 1) !== '!') {
                                this.gamemode.push(updater_1.default.upGamemode(val));
                            }
                            else {
                                this.gamemode.push('!' + updater_1.default.upGamemode(val.slice(1)));
                            }
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
                        case '':
                            return;
                        default:
                            throw `Unknown selector key: ${key}`;
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
            case 'e':
            case 'p':
            case 'r':
            case 's':
                this.variable = char;
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
                    case 'sort':
                        this.sort = val;
                        break;
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
                        this.nbt = utils_1.getNbt(val);
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
        let tmp;
        if ((tmp = this.level.get1_13())) {
            result += `level=${tmp},`;
        }
        if ((tmp = this.distance.get1_13())) {
            result += `distance=${this.distance.get1_13()},`;
        }
        if ((tmp = this.x_rotation.get1_13())) {
            result += `x_rotation=${tmp},`;
        }
        if ((tmp = this.y_rotation.get1_13())) {
            result += `y_rotation=${tmp},`;
        }
        if ((tmp = this.getScores1_13())) {
            result += `scores=${tmp},`;
        }
        if ((tmp = this.getAdvancements1_13())) {
            result += `advancements=${tmp},`;
        }
        if ((tmp = this.nbt.toString()) !== '{}') {
            result += `nbt=${tmp},`;
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
            default:
                if (range) {
                    range.setMin(Number(value));
                }
                else {
                    range = new Range(Number(value), null);
                    this.scores.set(objective, range);
                }
                break;
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

},{"../updater":12,"./char_reader":14,"./nbt/nbt":15,"./utils":19}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("./nbt/tokenizer");
const parser_1 = require("./nbt/parser");
function isNumeric(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}
exports.isNumeric = isNumeric;
function isWhiteSpace(char) {
    return [' ', '\t', '\n', '\r'].indexOf(char) !== -1;
}
exports.isWhiteSpace = isWhiteSpace;
function getNbt(str) {
    const tokenizer = new tokenizer_1.Tokenizer();
    const tokens = tokenizer.tokenize(str);
    const parser = new parser_1.Parser();
    const nbt = parser.parse(tokens);
    return nbt;
}
exports.getNbt = getNbt;
const EscapePattern = /([\\"])/g;
const UnescapePattern = /\\([\\"])/g;
exports.escape = (s) => s.replace(EscapePattern, '\\$1');
exports.unescape = (s) => s.replace(UnescapePattern, '$1');

},{"./nbt/parser":16,"./nbt/tokenizer":17}]},{},[2]);
