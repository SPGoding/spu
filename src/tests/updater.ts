import 'mocha'
import * as assert from 'power-assert'

import Updater from '../updater'

describe.only('Updater tests', () => {
    describe('cvtArgument() tests', () => {
        describe('%adv tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('minecraft:story/root', '%adv')
                assert(actual === 'minecraft:story/root')
            })
        })
        describe('%adv_crit tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('foo', '%adv_crit')
                assert(actual === 'foo')
            })
        })
        describe('%block tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('minecraft:grass', '%block')
                assert(actual === 'minecraft:grass')
            })
        })
        describe('%block_dust_param tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('8193', '%block_dust_param')
                assert(actual === 'minecraft:polished_granite')
            })
        })
        describe('%block_metadata_or_state tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('type=oak,stage=0', '%block_metadata_or_state')
                assert(actual === 'type=oak,stage=0')
            })
        })
        describe('%block_nbt tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument(
                    '{Items:[{Count:1b,id:"minecraft:wooden_sword",Damage:998s}]}',
                    '%block_nbt'
                )
                assert(actual === '{Items:[{Count:1b,id:"minecraft:wooden_sword",Damage:998s}]}')
            })
        })
        describe('%bool tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('true', '%bool')
                assert(actual === 'true')
            })
        })
        describe('%command tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('advancement grant @e only foo', '%command')
                assert(actual === 'advancement grant @e[sort=nearest] only foo')
            })
        })
        describe('%difficulty tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('h', '%difficulty')
                assert(actual === 'hard')
            })
        })
        describe('%effect tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('1', '%effect')
                assert(actual === 'minecraft:speed')
            })
        })
        describe('%ench tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('0', '%ench')
                assert(actual === 'minecraft:protection')
            })
        })
        describe('%entity tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('@r', '%entity')
                assert(actual === '@e[sort=random,type=player]')
            })
        })
        describe('%entity_nbt tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('{CustomName:"foo"}', '%entity_nbt')
                assert(actual === '{CustomName:"{\\"text\\":\\"foo\\"}"}')
            })
        })
        describe('%entity_type tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('minecraft:ender_crystal', '%entity_type')
                assert(actual === 'minecraft:end_crystal')
            })
        })
        describe('%func tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('minecraft:fuck', '%func')
                assert(actual === 'minecraft:fuck')
            })
        })
        describe('%gamemode tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('0', '%gamemode')
                assert(actual === 'survival')
            })
        })
        describe('%ip tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('192.168.0.1', '%ip')
                assert(actual === '192.168.0.1')
            })
        })
        describe('%item tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('minecraft:record_13', '%item')
                assert(actual === 'minecraft:record_13')
            })
        })
        describe('%item_data tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('0', '%item_data')
                assert(actual === '0')
            })
        })
        describe('%item_dust_params tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('17 2', '%item_dust_params')
                assert(actual === 'minecraft:birch_log')
            })
        })
        describe('%item_nbt tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('{Count:1b,id:"minecraft:wooden_sword",Damage:998s}', '%item_nbt')
                assert(actual === '{Count:1b,id:"minecraft:wooden_sword",tag:{Damage:998s}}')
            })
        })
        describe('%item_tag_nbt tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('{display:{Name:"foo"}}', '%item_tag_nbt')
                assert(actual === '{display:{Name:"foo"}}')
            })
        })
        describe('%json tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument(
                    '[{"extra":{"clickEvent":{"action":"run_command","value":"kill @e"}}}]',
                    '%json'
                )
                assert(actual === '[{"extra":{"clickEvent":{"action":"run_command","value":"kill @e[sort=nearest]"}}}]')
            })
        })
        describe('%literal tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('Give', '%literal')
                assert(actual === 'give')
            })
        })
        describe('%num tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('12', '%num')
                assert(actual === '12')
            })
        })
        describe('%particle tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('blockdust', '%particle')
                assert(actual === 'block')
            })
        })
        describe('%recipe tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('orginal', '%recipe')
                assert(actual === 'orginal')
            })
        })
        describe('%scb_crit tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('stat.craftItem.minecraft.stone', '%scb_crit')
                assert(actual === 'minecraft.crafted:minecraft.stone')
            })
        })
        describe('%slot tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('slot.hotbar.1', '%slot')
                assert(actual === 'hotbar.1')
            })
        })
        describe('%sound tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('block.orginal.orginal', '%sound')
                assert(actual === 'block.orginal.orginal')
            })
        })
        describe('%source tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('orginal', '%source')
                assert(actual === 'orginal')
            })
        })
        describe('%string tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('orginal', '%string')
                assert(actual === 'orginal')
            })
        })
        describe('%uuid tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('orginal', '%uuid')
                assert(actual === 'orginal')
            })
        })
        describe('%vec_2 tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('o r', '%vec_2')
                assert(actual === 'o r')
            })
        })
        describe('%vec_3 tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('o r i', '%vec_3')
                assert(actual === 'o r i')
            })
        })
        describe('%word tests', () => {
            it('should convert', () => {
                const actual = Updater.cvtArgument('orginal', '%word')
                assert(actual === 'orginal')
            })
        })
    })
})
