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
    })
})
