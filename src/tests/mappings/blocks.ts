import 'mocha'
import * as assert from 'power-assert'

import Blocks from '../../mappings/blocks'

describe('Blocks tests', () => {
    describe('std1_12() tests', () => {
        it('should deal with Numeric', () => {
            let actual = Blocks.std112(1).getFull()

            assert(actual === 'minecraft:stone[variant=stone]')
        })
        it('should deal with Numeric with Data', () => {
            let actual = Blocks.std112(1, undefined, 3).getFull()

            assert(actual === 'minecraft:stone[variant=diorite]')
        })
        it('should deal with String', () => {
            let actual = Blocks.std112(undefined, 'dirt', undefined).getFull()

            assert(actual === 'minecraft:dirt[snowy=false,variant=dirt]')
        })
        it('should deal with String and Data', () => {
            let actual = Blocks.std112(undefined, 'dirt', 1).getFull()

            assert(actual === 'minecraft:dirt[snowy=false,variant=coarse_dirt]')
        })
        it('should deal with String, Data and NBT', () => {
            let actual = Blocks.std112(undefined, 'standing_banner', 1, undefined, '{Base:1}').getFull()

            assert(actual === 'minecraft:standing_banner[rotation=1]{Base:1}')
        })
        it('should deal with String and State', () => {
            let actual = Blocks.std112(undefined, 'dirt', undefined, 'variant=podzol').getFull()

            assert(actual === 'minecraft:dirt[snowy=false,variant=podzol]')
        })
        it('should throw with String and Numeric', () => {
            let actual = Blocks.std112(0, 'air').getFull()
            assert.throws(Blocks.std112)
        })
    })
    describe('get1_13() tests', () => {
        it('should deal with Numeric', () => {
            let std = Blocks.std112(1)

            let actual = Blocks.to113(std).getNominal()

            assert(actual === 'minecraft:stone')
        })
        it('should deal with String, Data and NBT', () => {
            let std = Blocks.std112(undefined, 'standing_banner', 1, undefined, '{Base:1}')

            let actual = Blocks.to113(std).getNominal()

            assert(actual === 'minecraft:red_banner[rotation=1]')
        })
    })
})
