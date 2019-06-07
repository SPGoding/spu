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
            'blockdata ~ ~ ~ {}',
            'blockdata ~ ~ ~ {auto:1b}'
        ];
        const expected = [
            'data get block ~ ~ ~',
            'data merge block ~ ~ ~ {auto:1b}'
        ];
        const actual = __1.update(input, from, to).commands;
        assert.deepStrictEqual(actual, expected);
    });
});
//# sourceMappingURL=text.js.map