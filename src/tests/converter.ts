import 'mocha'
import * as assert from 'power-assert'

import Converter from '../converter'

describe.only('Converter tests', () => {
    describe('cvtDifficulty() tests', () => {
        it('should return string when put a number', () => {
            let actual = Converter.cvtDifficulty('0')

            assert(actual === 'peaceful')
        })
        it('should return string when put an abbreviation', () => {
            let actual = Converter.cvtDifficulty('h')

            assert(actual === 'hard')
        })
    })
    describe('cvtMode() tests', () => {
        it('should return string when put a number', () => {
            let actual = Converter.cvtMode('0')

            assert(actual === 'survival')
        })
        it('should return string when put an abbreviation', () => {
            let actual = Converter.cvtMode('sp')

            assert(actual === 'spectator')
        })
    })
})
