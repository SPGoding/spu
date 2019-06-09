"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert = require("power-assert");
const target_selector_1 = require("../../utils/target_selector");
const nbt_1 = require("../../utils/nbt/nbt");
describe('TargetSelector tests', () => {
    describe('constructor() tests', () => {
        it('should parse variable', () => {
            const input = '@e';
            const actual = new target_selector_1.TargetSelector(input);
            assert(actual.variable === 'e');
        });
        it('should parse directly stored argument', () => {
            const input = '@e[limit=1]';
            const actual = new target_selector_1.TargetSelector(input);
            assert(actual.limit === '1');
        });
        it('should parse multiple argument', () => {
            const input = '@e[tag=foo,tag=bar]';
            const actual = new target_selector_1.TargetSelector(input);
            assert.deepEqual(actual.tag, ['foo', 'bar']);
        });
        it('should parse range argument', () => {
            const input = '@e[distance=0..2]';
            const actual = new target_selector_1.TargetSelector(input);
            assert(actual.distance.max === 2 && actual.distance.max === 2);
        });
        it('should parse scores', () => {
            const input = '@e[scores={foo=0..2,bar=1..}]';
            const actual = new target_selector_1.TargetSelector(input);
            const foo = actual.scores.get('foo');
            const bar = actual.scores.get('bar');
            assert(foo && foo.min === 0 && foo.max === 2 && bar && bar.min === 1 && bar.max === null);
        });
        it('should parse nbt', () => {
            const input = '@e[nbt={foobar:1b}]';
            const actual = new target_selector_1.TargetSelector(input);
            const foobar = actual.nbt.get('foobar');
            assert(foobar instanceof nbt_1.NbtByte && foobar.get() === 1);
        });
        it('should parse advancements', () => {
            const input = '@e[advancements={foo=false,bar={baz=true}}]';
            const actual = new target_selector_1.TargetSelector(input);
            const foo = actual.advancements.get('foo');
            const bar = actual.advancements.get('bar');
            assert(foo === 'false');
            assert.deepEqual(bar, { baz: 'true' });
        });
    });
    describe('toString() tests', () => {
        it('should return simple selector', () => {
            const input = '@e';
            const actual = new target_selector_1.TargetSelector(input).toString();
            assert(actual === input);
        });
        it('should return multiple arguments', () => {
            const input = '@e[tag=foo,tag=bar]';
            const actual = new target_selector_1.TargetSelector(input).toString();
            assert(actual === input);
        });
        it('should return range arguments', () => {
            const input = '@e[distance=0..2,level=..10]';
            const actual = new target_selector_1.TargetSelector(input).toString();
            assert(actual === input);
        });
        it('should return string argument', () => {
            const input = '@e[sort=random]';
            const actual = new target_selector_1.TargetSelector(input).toString();
            assert(actual === input);
        });
        it('should return nbt', () => {
            const input = '@e[nbt={foo:"bar"}]';
            const actual = new target_selector_1.TargetSelector(input).toString();
            assert(actual === input);
        });
        it('should return scores', () => {
            const input = '@e[scores={foo=1..,bar=..2,baz=1..2}]';
            const actual = new target_selector_1.TargetSelector(input).toString();
            assert(actual === input);
        });
        it('should return advancements', () => {
            const input = '@e[advancements={foo=false,bar={baz=true}}]';
            const actual = new target_selector_1.TargetSelector(input).toString();
            assert(actual === input);
        });
    });
});
//# sourceMappingURL=target_selector.js.map