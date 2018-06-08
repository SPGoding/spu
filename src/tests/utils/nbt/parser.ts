import 'mocha'
import * as assert from 'power-assert'

import { Parser } from '../../../utils/nbt/parser'

describe.only('Parser tests', () => {
    describe('parse() tests', () => {
        it('should parse "0.0" as "0d"', () => {
            let parser = new Parser()

            let actual = parser.parse([
                { type: 'BeginCompound', value: '{' },
                { type: 'Thing', value: '123' },
                { type: 'Comma', value: ':' },
                { type: 'Thing', value: '0.0' },
                { type: 'EndCompound', value: '}' },
                { type: 'EndOfDocument', value: '' }
            ])

            assert(actual.toString() === '{123:0d}')
        })
        it('should parse compounds', () => {
            let parser = new Parser()

            let actual = parser.parse([
                { type: 'BeginCompound', value: '{' },
                { type: 'Thing', value: 'foo' },
                { type: 'Comma', value: ':' },
                { type: 'BeginCompound', value: '{' },
                { type: 'EndCompound', value: '}' },
                { type: 'EndCompound', value: '}' },
                { type: 'EndOfDocument', value: '' }
            ])

            assert(actual.toString() === '{foo:{}}')
        })
        it.only('should parse list', () => {
            let parser = new Parser()

            let actual = parser.parse([
                { type: 'BeginCompound', value: '{' },
                { type: 'Thing', value: 'foo' },
                { type: 'Comma', value: ':' },
                { type: 'BeginList', value: '[' },
                { type: 'Thing', value: 'bar' },
                { type: 'Colon', value: ',' },
                { type: 'BeginList', value: '[' },
                { type: 'EndListOrArray', value: ']' },
                { type: 'EndListOrArray', value: ']' },
                { type: 'EndCompound', value: '}' },
                { type: 'EndOfDocument', value: '' }
            ])

            assert(actual.toString() === '{foo:["bar",[]]}')
        })
    })
})
