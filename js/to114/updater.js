"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wheel_chief_1 = require("../utils/wheel_chief/wheel_chief");
const commands_1 = require("./commands");
const updater_1 = require("../utils/wheel_chief/updater");
const utils_1 = require("../utils/utils");
const nbt_1 = require("../utils/nbt/nbt");
const updater_2 = require("../to113/updater");
const argument_parsers_1 = require("../utils/wheel_chief/argument_parsers");
class SpuScriptExecutor113To114 {
    execute(script, args) {
        const splited = script.split(' ');
        for (let i = 0; i < splited.length; i++) {
            if (splited[i].slice(0, 1) === '%') {
                splited[i] = args[parseInt(splited[i].slice(1))].value;
            }
            else if (splited[i].slice(0, 1) === '$') {
                const params = splited[i].slice(1).split('%');
                switch (params[0]) {
                    default:
                        throw `Unexpected script method: '${params[0]}'.`;
                }
            }
        }
        return splited.join(' ');
    }
}
class UpdaterTo114 extends updater_1.Updater {
    static upLine(input, from) {
        const ans = { command: input, warnings: [] };
        if (['18', '19', '111', '112'].indexOf(from) !== -1) {
            const result = updater_2.UpdaterTo113.upLine(ans.command, from);
            ans.command = result.command;
            ans.warnings = result.warnings;
        }
        else if (from !== '113') {
            throw `Expected from version: '18', '19', '111', '112' or '113' but got '${from}'.`;
        }
        const result = new UpdaterTo114().upSpgodingCommand(ans.command);
        ans.command = result.command;
        ans.warnings = ans.warnings.concat(result.warnings);
        return ans;
    }
    upArgument(input, updater) {
        switch (updater) {
            case 'spgoding:pre_tick_time':
                return this.upSpgodingPreTickTime(input);
            default:
                return super.upArgument(input, updater);
        }
    }
    upSpgodingCommand(input) {
        return wheel_chief_1.WheelChief.update(input, commands_1.Commands113To114.commands, new argument_parsers_1.ArgumentParser(), this, new SpuScriptExecutor113To114());
    }
    upSpgodingBlockName(input) {
        input = utils_1.completeNamespace(input);
        const mapping = [
            ['minecraft:sign', 'minecraft:oak_sign'],
            ['minecraft:wall_sign', 'minecraft:oak_wall_sign'],
            ['minecraft:stone_slab', 'minecraft:smooth_stone_slab']
        ];
        const result = mapping.find(v => v[0] === input);
        if (result) {
            input = result[1];
        }
        return input;
    }
    upSpgodingItemName(input) {
        input = utils_1.completeNamespace(input);
        const mapping = [
            ['minecraft:sign', 'minecraft:oak_sign'],
            ['minecraft:stone_slab', 'minecraft:smooth_stone_slab']
        ];
        const result = mapping.find(v => v[0] === input);
        if (result) {
            input = result[1];
        }
        return input;
    }
    upSpgodingItemTagNbt(input) {
        input = super.upSpgodingItemTagNbt(input);
        {
            const display = input.get('display');
            if (display instanceof nbt_1.NbtCompound) {
                const lore = display.get('Lore');
                if (lore instanceof nbt_1.NbtList) {
                    lore.forEach((line) => {
                        line.set(`{"text":"${utils_1.escape(line.get())}"}`);
                    });
                }
            }
            return input;
        }
    }
    upSpgodingPreTickTime(input) {
        return `${input}t`;
    }
}
exports.UpdaterTo114 = UpdaterTo114;
