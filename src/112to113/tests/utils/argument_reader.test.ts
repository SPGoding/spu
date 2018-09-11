import 'mocha'
import * as assert from 'power-assert'

import ArgumentReader from '../../../utils/argument_reader'

describe('ArgumentReader tests', () => {
    describe('peak() tests', () => {
        it('should return "m"', () => {
            let argReader = new ArgumentReader('m j s b')

            let result = argReader.peek()

            assert(result === 'm')
        })
    })

    describe('next() tests', () => {
        it('should return "m" and "j" arg by arg', () => {
            let argReader = new ArgumentReader('m j s b')

            let first = argReader.next()
            let second = argReader.next()

            assert(first === 'm')
            assert(second === 'j')
        })
        it('should return "" when out of array', () => {
            let argReader = new ArgumentReader('m')

            argReader.next()
            let result = argReader.next()

            assert(result === '')
        })
    })

    describe('back() tests', () => {
        it('should back to "j"', () => {
            let argReader = new ArgumentReader('m j s b')
            let result: string

            argReader.next()
            argReader.next()
            argReader.back()
            result = argReader.peek()

            assert(result === 'j')
        })
        it('should back to "m" when out of array', () => {
            let argReader = new ArgumentReader('m j s b')
            let result: string

            argReader.back()
            argReader.back()
            argReader.back()
            result = argReader.peek()

            assert(result === 'm')
        })
    })

    describe('hasMore() tests', () => {
        it('should return true', () => {
            let argReader = new ArgumentReader('m j s b')
            let result: boolean

            argReader.next()
            argReader.next()
            argReader.next()
            result = argReader.hasMore()

            assert(result === true)
        })
        it('should return false', () => {
            let argReader = new ArgumentReader('m j s b')
            let result: boolean

            argReader.next()
            argReader.next()
            argReader.next()
            argReader.next()
            result = argReader.hasMore()

            assert(result === false)
        })
    })
})
