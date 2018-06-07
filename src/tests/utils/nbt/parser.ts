import 'mocha'
import * as assert from 'power-assert'

import { Parser } from '../../../utils/nbt/parser'
import { NbtCompound, NbtByte } from '../../../utils/nbt/nbt'

describe('Parser tests', () => {
    describe.only('parse() tests', () => {
        it('should parse a key-value pair', () => {
            let parser = new Parser()

            let actual = parser.parse([
                { type: 'BeginCompound', value: '{' },
                { type: 'String', value: 'foo' },
                { type: 'Comma', value: ':' },
                { type: 'Byte', value: 0 },
                { type: 'EndCompound', value: '}' },
                { type: 'EndOfDocument', value: '' }
            ])

            assert(actual.toString() === '{foo:0b}')
        })
        it('should parse two key-value pairs', () => {
            let parser = new Parser()

            let actual = parser.parse([
                { type: 'BeginCompound', value: '{' },
                { type: 'String', value: 'foo' },
                { type: 'Comma', value: ':' },
                { type: 'Byte', value: 0 },
                { type: 'Colon', value: ',' },
                { type: 'Double', value: 500 },
                { type: 'Comma', value: ':' },
                { type: 'String', value: 'I love pca!' },
                { type: 'EndCompound', value: '}' },
                { type: 'EndOfDocument', value: '' }
            ])
            console.log('===')
            console.log(actual.toString())
            console.log('===')
            assert(actual.toString() === '{foo:0b,500d:"I love pca!"}')
        })
    })
})
