import 'mocha'
import * as assert from 'power-assert'

import { NbtString } from '../../../utils/nbt/nbt'

describe('Nbt tests', () => {
    describe('NbtString tests', () => {
        describe('toString() tests', () => {
            it('should escape', () => {
                let str = new NbtString()

                str.set('I love \\"pca\\"')

                assert(str.toString() === '"I love \\\\\\"pca\\\\\\""')
            })
        })
    })
})
