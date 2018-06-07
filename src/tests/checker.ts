import 'mocha'
import * as assert from 'power-assert'

import Checker from '../checker'

describe.only('Checker tests', () => {
    describe('isUuid() tests', () => {
        it('should return true when put an uuid', () => {
            let actual = Checker.isUuid('fc96c9b6-69f7-11e8-adc0-fa7ae01bbebc')

            assert(actual)
        })
    })
    describe('isTargetSelector() tests', () => {
        it('should return true when put a selector', () => {
            let actual = Checker.isSelector('@e[c=1]')

            assert(actual)
        })
    })
    describe('isString() tests', () => {
        it('should return true when put a set of special chars', () => {
            let actual = Checker.isString('哈? @#$#^* hh')

            assert(actual)
        })
    })
    describe('isWord() tests', () => {
        it('should return true when put a set of letters', () => {
            let actual = Checker.isWord('foo')

            assert(actual)
        })
        it('should return false when put a set of special chars', () => {
            let actual = Checker.isWord('哈? @#$#^* hh')

            assert(!actual)
        })
    })
    describe('isNum() tests', () => {
        it('should return true when put a number', () => {
            let actual = Checker.isNum('-.100')

            assert(actual)
        })
    })
    describe('isPath() tests', () => {
        it('should return true when put a location without namespace', () => {
            let actual = Checker.isPath('mjsb/foo')

            assert(actual)
        })
        it('should return true when put a location with namespace', () => {
            let actual = Checker.isPath('spgoding:mjsb/foo')

            assert(actual)
        })
    })
    describe('isIP() tests', () => {
        it('should return true when put an ip', () => {
            let actual = Checker.isIP('192.168.0.1')

            assert(actual)
        })
        it('should return false when put an invalid ip', () => {
            let actual = Checker.isIP('666.233.0.1')

            assert(!actual)
        })
    })
    describe('isPosition() tests', () => {
        it('should return true when put a relative coordinates', () => {
            let actual = Checker.isPosition('~1 ~ ~-2.3')

            assert(actual)
        })
        it('should return true when put an absolute coordinates', () => {
            let actual = Checker.isPosition('12.34 0.5 43.21')

            assert(actual)
        })
        it('should return false when put less than 3 doubles', () => {
            let actual = Checker.isPosition('12.34 56')

            assert(!actual)
        })
    })
    describe('isNbt() tests', () => {
        it('should return false', () => {
            let actual = Checker.isNbt('{}')

            assert(actual)
        })
    })
})
