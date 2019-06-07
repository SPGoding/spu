"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wheel_chief_1 = require("../utils/wheel_chief/wheel_chief");
const commands_1 = require("./commands");
const updater_1 = require("../utils/wheel_chief/updater");
const updater_2 = require("../to111/updater");
const parser_1 = require("../utils/wheel_chief/parser");
const target_selector_1 = require("./target_selector");
class SpuScriptExecutor111To112 {
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
class ArgumentParser111To112 extends parser_1.ArgumentParser {
    parseMinecraftEntity(splited, index) {
        let join = splited[index];
        if (join.charAt(0) !== '@') {
            return 1;
        }
        if (target_selector_1.TargetSelector.isValid(join)) {
            return 1;
        }
        else {
            for (let i = index + 1; i < splited.length; i++) {
                join += ' ' + splited[i];
                if (target_selector_1.TargetSelector.isValid(join)) {
                    return i - index + 1;
                }
                else {
                    continue;
                }
            }
            throw 'Expected an entity selector.';
        }
    }
}
class UpdaterTo112 extends updater_1.Updater {
    static upLine(input, from) {
        const ans = { command: input, warnings: [] };
        if (['18', '19'].indexOf(from) !== -1) {
            const result = updater_2.UpdaterTo111.upLine(ans.command, from);
            ans.command = result.command;
            ans.warnings = result.warnings;
        }
        else if (from !== '111') {
            throw `Expected from version: '18', '19' or '111' but got '${from}'.`;
        }
        const result = new UpdaterTo112().upSpgodingCommand(ans.command);
        ans.command = result.command;
        ans.warnings = ans.warnings.concat(result.warnings);
        return ans;
    }
    upSpgodingCommand(input) {
        const result = wheel_chief_1.WheelChief.update(input, commands_1.Commands111To112.commands, new ArgumentParser111To112(), this, new SpuScriptExecutor111To112());
        return { command: result.command, warnings: result.warnings };
    }
    upSpgodingTargetSelector(input) {
        return input;
    }
}
exports.UpdaterTo112 = UpdaterTo112;
//# sourceMappingURL=updater.js.map