import 'mocha'
import * as assert from 'power-assert'

import { Parser } from '../../../utils/nbt/parser'

describe('Parser tests', () => {
    describe('parse() tests', () => {
        it('should parse "0.0" as "0d"', () => {
            let parser = new Parser()

            let actual = parser.parse([
                { type: 'BeginCompound', value: '{' },
                { type: 'Thing', value: '123' },
                { type: 'Colon', value: ':' },
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
                { type: 'Colon', value: ':' },
                { type: 'BeginCompound', value: '{' },
                { type: 'EndCompound', value: '}' },
                { type: 'EndCompound', value: '}' },
                { type: 'EndOfDocument', value: '' }
            ])

            assert(actual.toString() === '{foo:{}}')
        })
        it('should parse list', () => {
            let parser = new Parser()

            let actual = parser.parse([
                { type: 'BeginCompound', value: '{' },
                { type: 'Thing', value: 'foo' },
                { type: 'Colon', value: ':' },
                { type: 'BeginList', value: '[' },
                { type: 'Thing', value: 'bar' },
                { type: 'Comma', value: ',' },
                { type: 'BeginList', value: '[' },
                { type: 'EndListOrArray', value: ']' },
                { type: 'EndListOrArray', value: ']' },
                { type: 'EndCompound', value: '}' },
                { type: 'EndOfDocument', value: '' }
            ])

            assert(actual.toString() === '{foo:["bar",[]]}')
        })
        it('should parse arrays', () => {
            let parser = new Parser()

            let actual = parser.parse([
                { type: 'BeginCompound', value: '{' },
                { type: 'Thing', value: 'byte' },
                { type: 'Colon', value: ':' },
                { type: 'BeginByteArray', value: '[B;' },
                { type: 'Thing', value: 'true' },
                { type: 'Comma', value: ',' },
                { type: 'Thing', value: '0b' },
                { type: 'EndListOrArray', value: ']' },
                { type: 'Comma', value: ',' },
                { type: 'Thing', value: 'int' },
                { type: 'Colon', value: ':' },
                { type: 'BeginIntArray', value: '[I;' },
                { type: 'Thing', value: '233' },
                { type: 'EndListOrArray', value: ']' },
                { type: 'Comma', value: ',' },
                { type: 'Thing', value: 'long' },
                { type: 'Colon', value: ':' },
                { type: 'BeginLongArray', value: '[L;' },
                { type: 'Thing', value: '123456L' },
                { type: 'EndListOrArray', value: ']' },
                { type: 'EndCompound', value: '}' },
                { type: 'EndOfDocument', value: '' }
            ])

            assert(actual.toString() === '{byte:[B;1b,0b],int:[I;233],long:[L;123456L]}')
        })
    })
})
