import 'mocha'
import * as assert from 'power-assert'

import Blocks from '../../mappings/blocks'

describe('Blocks tests', () => {
    describe('get1_12NormalizeIDFrom1_12NumericID() tests', () => {
        it('should return directly', () => {
            let actual = Blocks.get1_12NormalizeIDFrom1_12NumericID(0)

            assert(actual === 'minecraft:air')
        })
        it('should return seperate metadata and id', () => {
            let actual = Blocks.get1_12NormalizeIDFrom1_12NumericID(1 + 2 * 4096)

            assert(actual === 'minecraft:stone[variant=smooth_granite]')
        })
    })
    describe('get1_13NormalizeIDFrom1_12NormalizeID() tests', () => {
        it('should return directly', () => {
            let actual = Blocks.get1_13NormalizeIDFrom1_12NormalizeID('minecraft:stone[variant=smooth_granite]')

            assert(actual === 'minecraft:polished_granite')
        })
        it('should return along many 1_12 IDs', () => {
            let actual = Blocks.get1_13NormalizeIDFrom1_12NormalizeID(
                'minecraft:bed[facing=north,occupied=false,part=foot]'
            )

            assert(actual === 'minecraft:red_bed[facing=north,occupied=false,part=foot]')
        })
    })
})
