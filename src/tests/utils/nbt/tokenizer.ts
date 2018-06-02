import 'mocha'
import * as assert from 'power-assert'

import { Tokenizer, Token } from '../../../utils/nbt/tokenizer'

describe.only('Tokenizer tests', () => {
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
            it('should return Token(EndListArray)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize(']')

                assert.deepStrictEqual(actual, [
                    { type: 'EndListArray', value: ']' },
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
            it('should return Token(Byte)', () => {
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
            it('should return Token(Int)', () => {
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
            it('should return Token(Float) ', () => {
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
            it('should read quoted string', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('"\\\\foo \\"bar\\""')

                assert.deepStrictEqual(actual, [
                    { type: 'String', value: '\\foo "bar"' },
                    { type: 'EndOfDocument', value: '' }
                ])
            }}
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
    })
})
