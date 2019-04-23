"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("./to19/updater");
const updater_2 = require("./to111/updater");
const updater_3 = require("./to112/updater");
const updater_4 = require("./to113/updater");
const updater_5 = require("./to114/updater");
const utils_1 = require("./utils/utils");
function update(commands, from, to) {
    let state = 'success';
    const logs = [];
    const updatedCommands = [];
    const timeBefore = (new Date()).getTime();
    for (let i = 0; i < commands.length; i++) {
        try {
            const line = commands[i];
            let result;
            if (line[0] === '#' || utils_1.isWhiteSpace(line)) {
                result = { command: line, warnings: [] };
            }
            else {
                if (to === 14) {
                    result = updater_5.UpdaterTo114.upLine(line, `1${from}`);
                }
                else if (to === 13) {
                    result = updater_4.UpdaterTo113.upLine(line, `1${from}`);
                }
                else if (to === 12) {
                    result = updater_3.UpdaterTo112.upLine(line, `1${from}`);
                }
                else if (to === 11) {
                    result = updater_2.UpdaterTo111.upLine(line, `1${from}`);
                }
                else if (to === 9) {
                    result = updater_1.UpdaterTo19.upLine(line, `1${from}`);
                }
                else {
                    throw `Unknown version: '${to}'. This should never happen :(`;
                }
            }
            result.warnings = result.warnings.filter(v => !utils_1.isWhiteSpace(v));
            if (result.warnings.length > 0) {
                state = 'warning';
                let log = `Warnings detected when updating Line #${i + 1}: \n`;
                log += result.warnings.join('\n    - ');
                logs.push(log);
            }
            updatedCommands.push(result.command);
        }
        catch (ex) {
            const ans = {
                commands: [],
                state: 'error',
                logs: [`Errors occurred when updating Line #${i + 1}: ${ex}`]
            };
            return ans;
        }
    }
    const timeAfter = (new Date()).getTime();
    const timeDelta = timeAfter - timeBefore;
    logs.push(`Updated ${commands.length} line${commands.length === 1 ? '' : 's'} (in ${(timeDelta / 1000).toFixed(3)} seconds).`);
    return { commands: updatedCommands, logs, state };
}
exports.update = update;
//# sourceMappingURL=index.js.map