"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert = require("power-assert");
const __1 = require("..");
describe.only('update() test', () => {
    it('Should update', () => {
        const from = 8;
        const to = 13;
        const input = [
            'scoreboard players test foo bar *',
            'scoreboard players test foo bar * *',
            'scoreboard players test foo bar * 0',
            'scoreboard players test foo bar 0 *',
            'scoreboard players test foo bar 0 2',
            'scoreboard players test foo bar 0 0'
        ];
        const expected = [
            'execute if score foo bar matches -2147483648..',
            'execute if score foo bar matches -2147483648..',
            'execute if score foo bar matches ..0',
            'execute if score foo bar matches 0..',
            'execute if score foo bar matches 0..2',
            'execute if score foo bar matches 0'
        ];
        const actual = __1.update(input, from, to).commands;
        assert.deepStrictEqual(actual, expected);
    });
});
//# sourceMappingURL=test.js.map