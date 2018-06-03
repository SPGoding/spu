import 'mocha'
import * as assert from 'power-assert'

import { Tokenizer, Token } from '../../../utils/nbt/tokenizer'

describe('Tokenizer tests', () => {
    describe('tokenize() tests', () => {
        describe('reading token tests', () => {
            it('should return Token(BeginCompound)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('{')

                assert.deepStrictEqual(actual, [
                    { type: 'BeginCompound', value: '{' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(EndCompound)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('}')

                assert.deepStrictEqual(actual, [
                    { type: 'EndCompound', value: '}' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(BeginIntArray)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('[I;')

                assert.deepStrictEqual(actual, [
                    { type: 'BeginIntArray', value: '[I;' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(BeginByteArray)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('[B;')

                assert.deepStrictEqual(actual, [
                    { type: 'BeginByteArray', value: '[B;' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(BeginLongArray)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('[L;')

                assert.deepStrictEqual(actual, [
                    { type: 'BeginLongArray', value: '[L;' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(BeginList)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('[')

                assert.deepStrictEqual(actual, [
                    { type: 'BeginList', value: '[' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(EndListOrArray)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize(']')

                assert.deepStrictEqual(actual, [
                    { type: 'EndListOrArray', value: ']' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(Colon)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize(':')

                assert.deepStrictEqual(actual, [
                    { type: 'Colon', value: ':' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(Comma)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize(',')

                assert.deepStrictEqual(actual, [
                    { type: 'Comma', value: ',' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(Byte) with boolean', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('false')

                assert.deepStrictEqual(actual, [
                    { type: 'Byte', value: 0 },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(Short)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('-32768S')

                assert.deepStrictEqual(actual, [
                    { type: 'Short', value: -32768 },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(Int) without suffix', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('233')

                assert.deepStrictEqual(actual, [
                    { type: 'Int', value: 233 },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(Long)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('233L')

                assert.deepStrictEqual(actual, [
                    { type: 'Long', value: 233 },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(Float) with scientific notation', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('1.2e3f')

                assert.deepStrictEqual(actual, [
                    { type: 'Float', value: 1200 },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should return Token(Double) without suffix', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('123.1')

                assert.deepStrictEqual(actual, [
                    { type: 'Double', value: 123.1 },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should read unquoted string which is like a number with suffix', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('123456A')

                assert.deepStrictEqual(actual, [
                    { type: 'String', value: '123456A' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should read unquoted string which is like scientific notation', () => {
                // FUCK YOU, MOJANG!
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('123e3')

                assert.deepStrictEqual(actual, [
                    { type: 'String', value: '123e3' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should read normal unquoted string', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('sdfhjkhsdf')

                assert.deepStrictEqual(actual, [
                    { type: 'String', value: 'sdfhjkhsdf' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should read quoted string', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('"\\\\foo \\"bar\\""')

                assert.deepStrictEqual(actual, [
                    { type: 'String', value: '\\foo "bar"' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
            it('should skip spaces', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('{ : }')

                assert.deepStrictEqual(actual, [
                    { type: 'BeginCompound', value: '{' },
                    { type: 'Colon', value: ':' },
                    { type: 'EndCompound', value: '}' },
                    { type: 'EndOfDocument', value: '' }
                ])
            })
        })
        it('should read a full nbt', () => {
            let tokenizer = new Tokenizer()

            let actual = tokenizer.tokenize('{ foo : 233e1 , bar : [I; 123F , 998. ] }')

            assert.deepStrictEqual(actual, [
                { type: 'BeginCompound', value: '{' },
                { type: 'String', value: 'foo' },
                { type: 'Colon', value: ':' },
                { type: 'String', value: '233e1' },
                { type: 'Comma', value: ',' },
                { type: 'String', value: 'bar' },
                { type: 'Colon', value: ':' },
                { type: 'BeginIntArray', value: '[I;' },
                { type: 'Float', value: 123 },
                { type: 'Comma', value: ',' },
                { type: 'Double', value: 998 },
                { type: 'EndListOrArray', value: ']' },
                { type: 'EndCompound', value: '}' },
                { type: 'EndOfDocument', value: '' }
            ])
        })
    })
})
