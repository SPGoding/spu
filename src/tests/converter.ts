import 'mocha'
import * as assert from 'power-assert'

import Converter from '../converter'

describe.skip('Converter tests', () => {
    describe('cvtArgument() tests', () => {
        describe('%adv tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('minecraft:story/root', '%adv')
                assert(actual === 'minecraft:story/root')
            })
        })
        describe('%adv_crit tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('foo', '%adv_crit')
                assert(actual === 'foo')
            })
        })
        describe('%block tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('minecraft:grass', '%block')
                assert(actual === 'minecraft:grass_block')
            })
        })
        describe('%block_dust_param tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('8193', '%block_dust_param')
                assert(actual === 'minecraft:stone[variant=smooth_granite]')
            })
        })
        describe('%block_nbt tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('{Text1:"hh"}', '%block_nbt')
                assert(actual === '{Text1:"{\\"text\\":\\"hh\\}"}')
            })
        })
        describe('%bool tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('true', '%bool')
                assert(actual === 'true')
            })
        })
        describe('%command tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('advancement grant @e only foo', '%command')
                assert(actual === 'advancement grant @e[sort=neareset] only foo')
            })
        })
        describe('%command_name tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('testfor', '%command_name')
                assert(actual === 'execute if entity')
            })
        })
        describe('%block_metadata_or_state tests', () => {
            it('should convert state', () => {
                let actual = Converter.cvtArgument('type=oak,stage=0', '%block_metadata_or_state')
                assert(actual === '[stage=0,type=oak]')
            })
            it('should convert metadata', () => {
                let actual = Converter.cvtArgument('0', '%block_metadata_or_state')
                assert(actual === '0')
            })
        })
        describe('%difficulty tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('h', '%difficulty')
                assert(actual === 'hard')
            })
        })
        describe('%effect tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('1', '%effect')
                assert(actual === 'minecraft:speed')
            })
        })
        describe('%ench tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('0', '%ench')
                assert(actual === 'minecraft:protection')
            })
        })
        describe('%entity tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('@r', '%entity')
                assert(actual === '@e[sort=random]')
            })
        })
        describe('%entity_nbt tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('{CustomName:"foo"}', '%entity_nbt')
                assert(actual === '{CustomName:"{\\"text\\":\\"foo\\"}"}')
            })
        })
        describe('%entity_type tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('minecraft:zombie', '%entity_type')
                assert(actual === '')
            })
        })
        // https://minecraft.gamepedia.com/1.13/Flattening#Entity_IDs.5B2.5D
        describe('%entity_type tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('minecraft:ender_crystal', '%entity_type')
                assert(actual === 'minecraft:end_crystal')
            })
        })
        describe('%func tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('minecraft:fuck', '%func')
                assert(actual === 'minecraft:fuck')
            })
        })
        describe('%gamemode tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('0', '%gamemode')
                assert(actual === 'survival')
            })
        })
        describe('%ip tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('192.168.0.1', '%ip')
                assert(actual === '192.168.0.1')
            })
        })
        describe('%item tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('minecraft:record_13', '%item')
                assert(actual === 'minecraft:music_disc_13')
            })
        })
        describe('%item_data tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('0', '%item_data')
                assert(actual === '0')
            })
        })
        describe('%item_dust_params tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('10 0', '%item_dust_params')
                assert(actual === 'minecraft:flowing_lava[level=0]')
            })
        })
        describe('%item_nbt tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('{Count:1b,id:"minecraft:wooden_sword",Damage:998s}', '%item_nbt')
                assert(actual === '{Count:1b,id:"minecraft:wooden_sword",tag:{Damage:998s}}')
            })
        })
        describe('%item_tag_nbt tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('{display:{Name:"foo"}}', '%item_tag_nbt')
                assert(actual === '{display:{Name:"{\\"text\\":\\"foo\\"}"}}')
            })
        })
        describe('%json tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument(
                    '{"clickEvent":{"action":"run_command","value":"say \\"fuck me\\""}}',
                    '%json'
                )
                assert(actual === '')
            })
        })
        describe('%literal tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('Give', '%literal')
                assert(actual === 'give')
            })
        })
        describe('%num tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('12', '%num')
                assert(actual === '12')
            })
        })
        // https://minecraft.gamepedia.com/1.13 Changes: particle -- rename
        describe('%particle tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('blockdust', '%particle')
                assert(actual === 'block')
            })
        })
        describe('%recipe tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('orginal', '%recipe')
                assert(actual === 'orginal')
            })
        })
        // http://www.mcbbs.net/thread-775727-1-1.html
        describe('%scb_crit tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('stat.craftItem.stone', '%scb_crit')
                assert(actual === 'minecraft.crafted:minecraft.stone')
            })
        })
        describe('%slot tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('slot.hotbar.1', '%slot')
                assert(actual === 'horbar.1')
            })
        })
        describe('%sound tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('block.orginal.orginal', '%sound')
                assert(actual === 'block.orginal.orginal')
            })
        })
        describe('%source tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('orginal', '%source')
                assert(actual === 'orginal')
            })
        })
        describe('%string tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('orginal', '%string')
                assert(actual === 'orginal')
            })
        })
        describe('%uuid tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('orginal', '%uuid')
                assert(actual === 'orginal')
            })
        })
        describe('%vec_2 tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('o r', '%vec_2')
                assert(actual === 'o r')
            })
        })
        describe('%vec_3 tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('o r i', '%vec_3')
                assert(actual === 'o r i')
            })
        })
        describe('%word tests', () => {
            it('should convert', () => {
                let actual = Converter.cvtArgument('orginal', '%word')
                assert(actual === 'orginal')
            })
        })
    })
})
