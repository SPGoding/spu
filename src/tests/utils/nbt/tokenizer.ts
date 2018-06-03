import 'mocha'
import * as assert from 'power-assert'

import { Tokenizer, Token, TokenType } from '../../../utils/nbt/tokenizer'

describe('Tokenizer tests', () => {
    describe('tokenize() tests', () => {
        describe('reading token tests', () => {
            it('should return Token(BeginCompound)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('{')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.BeginCompound, value: '{' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(EndCompound)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('}')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.EndCompound, value: '}' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(BeginIntArray)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('[I;')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.BeginIntArray, value: '[I;' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(BeginByteArray)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('[B;')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.BeginByteArray, value: '[B;' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(BeginLongArray)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('[L;')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.BeginLongArray, value: '[L;' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(BeginList)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('[')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.BeginList, value: '[' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(EndListOrArray)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize(']')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.EndListOrArray, value: ']' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(Colon)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize(':')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.Colon, value: ':' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(Comma)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize(',')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.Comma, value: ',' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(Byte) with boolean', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('false')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.Byte, value: 0 },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(Short)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('-32768S')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.Short, value: -32768 },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(Int) without suffix', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('233')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.Int, value: 233 },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(Long)', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('233L')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.Long, value: 233 },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(Float) with scientific notation', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('1.2e3f')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.Float, value: 1200 },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should return Token(Double) without suffix', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('123.1')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.Double, value: 123.1 },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should read unquoted string which is like a number with suffix', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('123456A')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.String, value: '123456A' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should read unquoted string which is like scientific notation', () => {
                // FUCK YOU, MOJANG!
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('123e3')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.String, value: '123e3' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should read normal unquoted string', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('sdfhjkhsdf')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.String, value: 'sdfhjkhsdf' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should read quoted string', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('"\\\\foo \\"bar\\""')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.String, value: '\\foo "bar"' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
            it('should skip spaces', () => {
                let tokenizer = new Tokenizer()

                let actual = tokenizer.tokenize('{ : }')

                assert.deepStrictEqual(actual, [
                    { type: TokenType.BeginCompound, value: '{' },
                    { type: TokenType.Colon, value: ':' },
                    { type: TokenType.EndCompound, value: '}' },
                    { type: TokenType.EndOfDocument, value: '' }
                ])
            })
        })
        it('should read a full nbt', () => {
            let tokenizer = new Tokenizer()

            let actual = tokenizer.tokenize('{ foo : 233e1 , bar : [I; 123F , 998. ] }')

            assert.deepStrictEqual(actual, [
                { type: TokenType.BeginCompound, value: '{' },
                { type: TokenType.String, value: 'foo' },
                { type: TokenType.Colon, value: ':' },
                { type: TokenType.String, value: '233e1' },
                { type: TokenType.Comma, value: ',' },
                { type: TokenType.String, value: 'bar' },
                { type: TokenType.Colon, value: ':' },
                { type: TokenType.BeginIntArray, value: '[I;' },
                { type: TokenType.Float, value: 123 },
                { type: TokenType.Comma, value: ',' },
                { type: TokenType.Double, value: 998 },
                { type: TokenType.EndListOrArray, value: ']' },
                { type: TokenType.EndCompound, value: '}' },
                { type: TokenType.EndOfDocument, value: '' }
            ])
        })
    })
})
