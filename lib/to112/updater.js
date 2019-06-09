"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wheel_chief_1 = require("../utils/wheel_chief/wheel_chief");
const commands_1 = require("./commands");
const updater_1 = require("../utils/wheel_chief/updater");
const updater_2 = require("../to111/updater");
const executor_1 = require("./executor");
const parser_1 = require("./parser");
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
        const result = wheel_chief_1.WheelChief.update(input, commands_1.Commands111To112.commands, new parser_1.ArgumentParser111To112(), this, new executor_1.SpuScriptExecutor111To112());
        return { command: result.command, warnings: result.warnings };
    }
    upSpgodingTargetSelector(input) {
        return input;
    }
}
exports.UpdaterTo112 = UpdaterTo112;
//# sourceMappingURL=updater.js.map