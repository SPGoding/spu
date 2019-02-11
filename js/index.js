"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("./to19/updater");
const updater_2 = require("./to111/updater");
const updater_3 = require("./to112/updater");
const updater_4 = require("./to113/updater");
const updater_5 = require("./to114/updater");
const utils_1 = require("./utils/utils");
function transform(content, from, to) {
    let number = 1;
    let frame = 'success';
    let msg = [];
    let ans = [];
    try {
        let timeBefore = (new Date()).getTime();
        if (content) {
            const lines = content.toString().split('\n');
            console.log("Got lines:", lines);
            for (const line of lines) {
                number = lines.indexOf(line);
                let result;
                if (line[0] === '#' || utils_1.isWhiteSpace(line)) {
                    result = { command: line, warnings: [] };
                }
                else {
                    if (to === 14) {
                        result = updater_5.UpdaterTo114.upLine(line, '1' + from);
                    }
                    else if (to === 13) {
                        result = updater_4.UpdaterTo113.upLine(line, '1' + from);
                    }
                    else if (to === 12) {
                        result = updater_3.UpdaterTo112.upLine(line, '1' + from);
                    }
                    else if (to === 11) {
                        result = updater_2.UpdaterTo111.upLine(line, '1' + from);
                    }
                    else if (to === 9) {
                        result = updater_1.UpdaterTo19.upLine(line, '1' + from);
                    }
                    else {
                        throw `Unknown to version: '${to}'.`;
                    }
                }
                result.warnings = result.warnings.filter(v => !utils_1.isWhiteSpace(v));
                if (result.warnings.length > 0) {
                    console.warn("检测到在途的编译错误：", msg);
                    frame = 'warning';
                    msg.push(`Line #${number + 1}:`);
                    for (const warning of result.warnings) {
                        msg.push(`    ${warning}`);
                    }
                }
                console.log("已转换：", result);
                ans.push(result.command);
            }
            const timeAfter = (new Date()).getTime();
            const timeDelta = timeAfter - timeBefore;
            msg.push(`Updated ${lines.length} line${lines.length === 1 ? '' : 's'} (in ${(timeDelta / 1000).toFixed(3)} seconds).`);
        }
    }
    catch (ex) {
        return {
            state: 'danger',
            commands: [],
            log: [`Updated error at line #${number + 1}: ${ex}`]
        };
    }
    finally {
        return {
            state: frame,
            commands: ans,
            log: msg
        };
    }
}
exports.transformCommand = transform;
