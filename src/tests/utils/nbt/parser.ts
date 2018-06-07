import 'mocha'
import * as assert from 'power-assert'

import { Parser } from '../../../utils/nbt/parser'
import { NbtCompound, NbtByte } from '../../../utils/nbt/nbt'

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
    })
})
