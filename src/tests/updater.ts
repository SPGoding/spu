import 'mocha'
import * as assert from 'power-assert'

import Updater from '../updater'

describe('Updater tests', () => {
    describe('cvtArgument() tests', () => {
        describe('%adv tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('minecraft:story/root', '%adv')
                assert(actual === 'minecraft:story/root')
            })
        })
        describe('%adv_crit tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('foo', '%adv_crit')
                assert(actual === 'foo')
            })
        })
        describe('%block tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('minecraft:grass', '%block')
                assert(actual === 'minecraft:grass')
            })
        })
        describe('%block_dust_param tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('8193', '%block_dust_param')
                assert(actual === 'minecraft:polished_granite')
            })
        })
        describe('%block_metadata_or_state tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('type=oak,stage=0', '%block_metadata_or_state')
                assert(actual === 'type=oak,stage=0')
            })
        })
        describe('%block_nbt tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument(
                    '{Items:[{Count:1b,id:"minecraft:wooden_sword",Damage:998s}]}',
                    '%block_nbt'
                )
                assert(actual === '{Items:[{Count:1b,id:"minecraft:wooden_sword",Damage:998s}]}')
            })
        })
        describe('%bool tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('true', '%bool')
                assert(actual === 'true')
            })
        })
        describe('%command tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('advancement grant @e[c=1] only foo', '%command')
                assert(actual === 'advancement grant @e[limit=1,sort=nearest] only foo')
            })
        })
        describe('%difficulty tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('h', '%difficulty')
                assert(actual === 'hard')
            })
        })
        describe('%effect tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('1', '%effect')
                assert(actual === 'minecraft:speed')
            })
        })
        describe('%ench tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('0', '%ench')
                assert(actual === 'minecraft:protection')
            })
        })
        describe('%entity tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('@r[type=zombie]', '%entity')
                assert(actual === '@e[sort=random,type=zombie]')
            })
        })
        describe('%entity_nbt tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('{CustomName:"foo"}', '%entity_nbt')
                assert(actual === '{CustomName:"{\\"text\\":\\"foo\\"}"}')
            })
        })
        describe('%entity_type tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('minecraft:ender_crystal', '%entity_type')
                assert(actual === 'minecraft:end_crystal')
            })
        })
        describe('%func tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('minecraft:fuck', '%func')
                assert(actual === 'minecraft:fuck')
            })
        })
        describe('%gamemode tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('0', '%gamemode')
                assert(actual === 'survival')
            })
        })
        describe('%ip tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('192.168.0.1', '%ip')
                assert(actual === '192.168.0.1')
            })
        })
        describe('%item tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('minecraft:record_13', '%item')
                assert(actual === 'minecraft:record_13')
            })
        })
        describe('%item_data tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('0', '%item_data')
                assert(actual === '0')
            })
        })
        describe('%item_dust_params tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('17 2', '%item_dust_params')
                assert(actual === 'minecraft:birch_log')
            })
        })
        describe('%item_nbt tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('{Count:1b,id:"minecraft:wooden_sword",Damage:998s}', '%item_nbt')
                assert(actual === '{Count:1b,id:"minecraft:wooden_sword",tag:{Damage:998s}}')
            })
            it('should convert', () => {
                const actual = Updater.upArgument('{id:"minecraft:fireworks",Count:1b}', '%item_nbt')
                assert(actual === '{id:"minecraft:firework_rocket",Count:1b}')
            })
        })
        describe('%item_tag_nbt tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('{display:{Name:"foo"}}', '%item_tag_nbt')
                assert(actual === '{display:{Name:"foo"}}')
            })
        })
        describe('%json tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument(
                    '[{"extra":{"clickEvent":{"action":"run_command","value":"kill @e[c=1]"}}}]',
                    '%json'
                )
                assert(actual === '[{"extra":{"clickEvent":{"action":"run_command","value":"kill @e[limit=1,sort=nearest]"}}}]')
            })
        })
        describe('%literal tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('Give', '%literal')
                assert(actual === 'give')
            })
        })
        describe('%num tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('12', '%num')
                assert(actual === '12')
            })
        })
        describe('%particle tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('blockdust', '%particle')
                assert(actual === 'block')
            })
        })
        describe('%recipe tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('orginal', '%recipe')
                assert(actual === 'orginal')
            })
        })
        describe('%scb_crit tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('stat.craftItem.minecraft.stone', '%scb_crit')
                assert(actual === 'minecraft.crafted:minecraft.stone')
            })
        })
        describe('%slot tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('slot.hotbar.1', '%slot')
                assert(actual === 'hotbar.1')
            })
        })
        describe('%sound tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('block.orginal.orginal', '%sound')
                assert(actual === 'block.orginal.orginal')
            })
        })
        describe('%source tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('orginal', '%source')
                assert(actual === 'orginal')
            })
        })
        describe('%string tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('orginal', '%string')
                assert(actual === 'orginal')
            })
        })
        describe('%uuid tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('orginal', '%uuid')
                assert(actual === 'orginal')
            })
        })
        describe('%vec_2 tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('o r', '%vec_2')
                assert(actual === 'o r')
            })
        })
        describe('%vec_3 tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('o r i', '%vec_3')
                assert(actual === 'o r i')
            })
        })
        describe('%word tests', () => {
            it('should convert', () => {
                const actual = Updater.upArgument('orginal', '%word')
                assert(actual === 'orginal')
            })
        })
    })
})
