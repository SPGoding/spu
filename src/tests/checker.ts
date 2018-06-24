import 'mocha'
import * as assert from 'power-assert'

import Checker from '../checker'

describe('Checker tests', () => {
    describe('isArgumentMatch() tests', () => {
        describe('%adv tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('minecraft:story/root', '%adv')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('foo:bar:exm', '%adv')
                assert(!actual)
            })
        })
        describe('%adv_crit tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('foo', '%adv_crit')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('假的', '%adv_crit')
                assert(!actual)
            })
        })
        describe('%block tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('stone', '%block')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('123', '%block')
                assert(!actual)
            })
        })
        describe('%block_dust_param tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('8193', '%block_dust_param')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('hh', '%block_dust_param')
                assert(!actual)
            })
        })
        describe('%block_metadata_or_state tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('foo=foo', '%block_metadata_or_state')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('wtf', '%block_metadata_or_state')
                assert(!actual)
            })
        })
        describe('%block_nbt tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('{Text1:"666"}', '%block_nbt')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('{Text1::}', '%block_nbt')
                assert(!actual)
            })
        })
        describe('%bool tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('true', '%bool')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('ture', '%bool')
                assert(!actual)
            })
        })
        describe('%command tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('advancement grant @e only foo', '%command')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('advancement grant @e only', '%command')
                assert(!actual)
            })
        })
        describe('%difficulty tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('h', '%difficulty')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('m', '%difficulty')
                assert(!actual)
            })
        })
        describe('%effect tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('1', '%effect')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('28', '%effect')
                assert(!actual)
            })
        })
        describe('%ench tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('0', '%ench')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('72', '%ench')
                assert(!actual)
            })
        })
        describe('%entity tests', () => {
            it.only('should return true', () => {
                let actual = Checker.isArgumentMatch('@e[type=item,score_foo_min=1]', '%entity')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('!', '%entity')
                assert(!actual)
            })
        })
        describe('%entity_nbt tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('{CustomName:"foo"}', '%entity_nbt')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('{CustomName:,:}', '%entity_nbt')
                assert(!actual)
            })
        })
        describe('%entity_type tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('minecraft:zombie', '%entity_type')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('123', '%entity_type')
                assert(!actual)
            })
        })
        describe('%func tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('minecraft:fuck', '%func')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('!', '%func')
                assert(!actual)
            })
        })
        describe('%gamemode tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('0', '%gamemode')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('4', '%gamemode')
                assert(!actual)
            })
        })
        describe('%ip tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('192.168.0.1', '%ip')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('192.666.233.789', '%ip')
                assert(!actual)
            })
        })
        describe('%item tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('minecraft:stone', '%item')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('minecraft:fuck', '%item')
                assert(!actual)
            })
        })
        describe('%item_data tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('0', '%item_data')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('+-', '%item_data')
                assert(!actual)
            })
        })
        describe('%item_dust_params tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('10 0', '%item_dust_params')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('998', '%item_dust_params')
                assert(!actual)
            })
        })
        describe('%item_nbt tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('{id:"minecraft:foo",Count:1b}', '%item_nbt')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('{::}', '%item_nbt')
                assert(!actual)
            })
        })
        describe('%item_tag_nbt tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('{display:{Name:"foo"}}', '%item_tag_nbt')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('{::}', '%item_tag_nbt')
                assert(!actual)
            })
        })
        describe('%json tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('{"text":"foo"}', '%json')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('{', '%json')
                assert(!actual)
            })
        })
        describe('%literal tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('AA', '%literal')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('1234', '%literal')
                assert(!actual)
            })
        })
        describe('%num tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('12', '%num')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('ab', '%num')
                assert(!actual)
            })
        })
        describe('%particle tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('minecraft:reddust', '%particle')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch(':', '%particle')
                assert(!actual)
            })
        })
        describe('%recipe tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('minecraft:a/b', '%recipe')
                assert(actual)
            })
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('*', '%recipe')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('!', '%recipe')
                assert(!actual)
            })
        })
        describe('%scb_crit tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('dummy', '%scb_crit')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('dmuuy', '%scb_crit')
                assert(!actual)
            })
        })
        describe('%slot tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('slot.horbar.1', '%slot')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('solt.fake', '%slot')
                assert(!actual)
            })
        })
        describe('%sound tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('block.anvil.fall', '%sound')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('!', '%sound')
                assert(!actual)
            })
        })
        describe('%source tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('master', '%source')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('a', '%source')
                assert(!actual)
            })
        })
        describe('%string tests', () => {
            it('should always return true', () => {
                let actual = Checker.isArgumentMatch('G$ 哇 3$ SD*a%e&dsf w$%eWA', '%string')
                assert(actual)
            })
        })
        describe('%uuid tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('170aa6d0-6c57-11e8-adc0-fa7ae01bbebc', '%uuid')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('170aa6d0-6c57-11e8-adc0-fa7ae01bbeb', '%uuid')
                assert(!actual)
            })
        })
        describe('%vec_2 tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('1 2', '%vec_2')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('1 2 3', '%vec_2')
                assert(!actual)
            })
        })
        describe('%vec_3 tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('1 2 3', '%vec_3')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('1 2', '%vec_3')
                assert(!actual)
            })
        })
        describe('%word tests', () => {
            it('should return true', () => {
                let actual = Checker.isArgumentMatch('1aA_', '%word')
                assert(actual)
            })
            it('should return false', () => {
                let actual = Checker.isArgumentMatch('!', '%word')
                assert(!actual)
            })
        })
    })
})
