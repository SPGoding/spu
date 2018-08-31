import 'mocha'
import * as assert from 'power-assert'

import { isNumeric } from '../../../utils/utils'

describe('Utils tests', () => {
    describe('isNumeric() tests', () => {
        it('number should return true', () => {
            let actual = isNumeric(0)

            assert(actual)
        })
        it('string number should return true', () => {
            let actual = isNumeric('233')

            assert(actual)
        })
        it('string NaN should return false', () => {
            let actual = isNumeric('sadjushdfj')

            assert(!actual)
        })
        it('scientific notation should return true', () => {
            let actual = isNumeric('1.3e5')

            assert(actual)
        })
        it('null should return false', () => {
            let actual = isNumeric(null)

            assert(!actual)
        })
        it('undefined should return false', () => {
            let actual = isNumeric(undefined)

            assert(!actual)
        })
        it('NaN should return false', () => {
            let actual = isNumeric(NaN)

            assert(!actual)
        })
    })
})
