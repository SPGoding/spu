"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.SpuScriptExecutor113To114 = SpuScriptExecutor113To114;
//# sourceMappingURL=executor.js.map