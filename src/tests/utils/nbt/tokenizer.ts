import 'mocha'
import * as assert from 'power-assert'

import { Tokenizer, Token, TokenType } from '../../../utils/nbt/tokenizer'

describe.only('Tokenizer tests', () => {
    describe('tokenize() tests', () => {
        describe('reading token tests', () => {
            it('should return Token(BeginCompound)', () => {
                let tokenizer = new Tokenizer('{')

                let result = tokenizer.tokenize()

                assert.deepStrictEqual(result, [
                    new Token(TokenType.BeginCompound, '{'),
                    new Token(TokenType.EndOfDocument, '')
                ])
            })
            it('should return Token(EndCompound)', () => {
                let tokenizer = new Tokenizer('}')

                let result = tokenizer.tokenize()

                assert.deepStrictEqual(result, [
                    new Token(TokenType.EndCompound, '}'),
                    new Token(TokenType.EndOfDocument, '')
                ])
            })
            it('should return Token(BeginList)', () => {
                let tokenizer = new Tokenizer('[')

                let result = tokenizer.tokenize()

                assert.deepStrictEqual(result, [
                    new Token(TokenType.BeginList, '['),
                    new Token(TokenType.EndOfDocument, '')
                ])
            })
            it.only('should return Token(BeginByteArray)', () => {
                let tokenizer = new Tokenizer('[B;')

                let result = tokenizer.tokenize()

                assert.deepStrictEqual(result, [
                    new Token(TokenType.BeginByteArray, '[B;'),
                    new Token(TokenType.EndOfDocument, '')
                ])
            })
            it('should return Token(BeginIntArray)', () => {
                let tokenizer = new Tokenizer('[I;')

                let result = tokenizer.tokenize()

                assert.deepStrictEqual(result, [
                    new Token(TokenType.BeginIntArray, '[I;'),
                    new Token(TokenType.EndOfDocument, '')
                ])
            })
            it('should return Token(BeginLongArray)', () => {
                let tokenizer = new Tokenizer('[L;')

                let result = tokenizer.tokenize()

                assert.deepStrictEqual(result, [
                    new Token(TokenType.BeginLongArray, '[L;'),
                    new Token(TokenType.EndOfDocument, '')
                ])
            })
            it('should return Token(EndListArray)', () => {
                let tokenizer = new Tokenizer(']')

                let result = tokenizer.tokenize()

                assert.deepStrictEqual(result, [
                    new Token(TokenType.EndListArray, ']'),
                    new Token(TokenType.EndOfDocument, '')
                ])
            })
            // it('should skip whitespace', () => {
            //     let tokenizer = new Tokenizer('{ foo : bar }')

            //     let result = tokenizer.tokenize()

            //     assert.deepStrictEqual(result, [
            //         new Token(TokenType.BeginCompound, '{'),
            //         new Token(TokenType.String, 'foo'),
            //         new Token(TokenType.Colon, ':'),
            //         new Token(TokenType.String, 'bar'),
            //         new Token(TokenType.EndCompound, '}')
            //     ])
            // })
        })
    })
})
