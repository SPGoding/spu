import 'mocha'
import * as assert from 'power-assert'

import { BlockState } from '../../utils/blockstate'

describe('BlockState tests', () => {
    describe('constructor() tests', () => {
        it('should parse single name', () => {
            const input = 'spg'

            const actual = new BlockState(input)

            assert(actual.name === 'spg')
        })
        it('should parse empty state', () => {
            const input = 'spg[]'

            const actual = new BlockState(input)

            assert.deepEqual(actual.states, {})
        })
        it('should parse a single state', () => {
            const input = 'spg[foo=bar]'

            const actual = new BlockState(input)

            assert.deepEqual(actual.states, { foo: 'bar' })
        })
        it('should parse states ending with a comma', () => {
            const input = 'spg[foo=bar,]'

            const actual = new BlockState(input)

            assert.deepEqual(actual.states, { foo: 'bar' })
        })
        it('should parse multiple states', () => {
            const input = 'spg[foo=bar,baz=qux]'

            const actual = new BlockState(input)

            assert.deepEqual(actual.states, { foo: 'bar', baz: 'qux' })
        })
        it('should parse single nbt', () => {
            const input = 'spg{foo:bar}'

            const actual = new BlockState(input)
            const foo = actual.nbt.get('foo')

            assert(foo && foo.toString() === '"bar"')
        })
        it('should parse both states and nbt', () => {
            const input = 'spg[foo=bar]{baz:qux}'

            const actual = new BlockState(input)
            const baz = actual.nbt.get('baz')

            assert.deepEqual(actual.states, { foo: 'bar' })
            assert(baz && baz.toString() === '"qux"')
        })
    })
})
