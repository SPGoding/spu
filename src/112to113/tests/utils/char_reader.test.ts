import 'mocha'
import * as assert from 'power-assert'

import CharReader from '../../../utils/char_reader'

describe('CharReader tests', () => {
    describe('peak() tests', () => {
        it('should return "m"', () => {
            let charReader = new CharReader('mjsb')

            let result = charReader.peek()

            assert(result === 'm')
        })
    })

    describe('next() tests', () => {
        it('should return "m" and "j" char by char', () => {
            let charReader = new CharReader('mjsb')

            let first = charReader.next()
            let second = charReader.next()

            assert(first === 'm' && second === 'j')
        })
        it('should return "" when out of string', () => {
            let charReader = new CharReader('m')

            charReader.next()
            let result = charReader.next()

            assert(result === '')
        })
    })

    describe('back() tests', () => {
        it('should back to "j"', () => {
            let charReader = new CharReader('mjsb')
            let result: string

            charReader.next()
            charReader.next()
            charReader.back()
            result = charReader.peek()

            assert(result === 'j')
        })
        it('should back to "m" when out of string', () => {
            let charReader = new CharReader('mjsb')
            let result: string

            charReader.back()
            charReader.back()
            charReader.back()
            result = charReader.peek()

            assert(result === 'm')
        })
    })

    describe('hasMore() tests', () => {
        it('should return true', () => {
            let charReader = new CharReader('mjsb')
            let result: boolean

            charReader.next()
            charReader.next()
            charReader.next()
            result = charReader.hasMore()

            assert(result === true)
        })
        it('should return false', () => {
            let charReader = new CharReader('mjsb')
            let result: boolean

            charReader.next()
            charReader.next()
            charReader.next()
            charReader.next()
            result = charReader.hasMore()

            assert(result === false)
        })
    })

    describe('readUntil() tests', () => {
        it('should return "mjsb"', () => {
            let charReader = new CharReader('mjsb= =')
            let result: string

            result = charReader.readUntil(['='])

            assert(result === 'mjsb')
        })
    })
})
