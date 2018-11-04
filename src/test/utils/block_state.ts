import 'mocha'
import * as assert from 'power-assert'

import { BlockState } from '../../utils/block_state'

describe('BlockState tests', () => {
    describe('constructor() tests', () => {
        it('should parse single name', () => {
            const input = 'spgoding:foobar'

            const actual = new BlockState(input)

            assert(actual.name === 'spgoding:foobar')
        })
        it('should parse empty state', () => {
            const input = 'spgoding:foobar[]'

            const actual = new BlockState(input)

            assert.deepEqual(actual.states, {})
        })
        it('should parse a single state', () => {
            const input = 'spgoding:foobar[foo=bar]'

            const actual = new BlockState(input)

            assert.deepEqual(actual.states, { foo: 'bar' })
        })
        it('should parse states ending with a comma', () => {
            const input = 'spgoding:foobar[foo=bar,]'

            const actual = new BlockState(input)

            assert.deepEqual(actual.states, { foo: 'bar' })
        })
        it('should parse multiple states', () => {
            const input = 'spgoding:foobar[foo=bar,baz=qux]'

            const actual = new BlockState(input)

            assert.deepEqual(actual.states, { foo: 'bar', baz: 'qux' })
        })
        it('should parse single nbt', () => {
            const input = 'spgoding:foobar{foo:bar}'

            const actual = new BlockState(input)
            const foo = actual.nbt.get('foo')

            assert(foo && foo.toString() === '"bar"')
        })
        it('should parse both states and nbt', () => {
            const input = 'spgoding:foobar[foo=bar]{baz:qux}'

            const actual = new BlockState(input)
            const baz = actual.nbt.get('baz')

            assert.deepEqual(actual.states, { foo: 'bar' })
            assert(baz && baz.toString() === '"qux"')
        })
        it(`shouldn't parse unfinished blockstate`, () => {
            const input = 'minecraft:command_block[conditional=false,facing=down]{Command:"fill'

            try {
                new BlockState(input).toString()
                assert(false)
            } catch {
                // Take it easy
            }
        })
    })
    describe('toString() tests', () => {
        it('should return name', () => {
            const input = 'spgoding:foobar'

            const actual = new BlockState(input).toString()

            assert(actual === input)
        })
        it('should return states', () => {
            const input = 'spgoding:foobar[baz=qux]'

            const actual = new BlockState(input).toString()

            assert(actual === input)
        })
        it('should return nbt', () => {
            const input = 'spgoding:foobar{baz:"qux"}'

            const actual = new BlockState(input).toString()

            assert(actual === input)
        })
        it('should return both states and nbt', () => {
            const input = 'spgoding:sf[foo=bar]{baz:"qux"}'

            const actual = new BlockState(input).toString()

            assert(actual === input)
        })
    })
})
