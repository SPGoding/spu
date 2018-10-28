import 'mocha'
import * as assert from 'power-assert'

import { WheelChief, ParseResult, CmdNode } from '../../../../src/utils/wheel_chief/wheel_chief'

describe.only('WheelChief tests', () => {
    describe('parseNode() tests', () => {
        it('should parse literal', () => {
            const input: ParseResult = {
                command: {
                    args: [],
                    spuScript: ''
                },
                index: 0,
                splited: ['literal']
            }
            const rootNode: CmdNode = {
                type: 'root',
                children: {
                    literal: {
                        type: 'literal',
                        executable: true
                    }
                }
            }

            const actual = WheelChief.parseNode(input, 'N/A', rootNode, rootNode)

            assert.deepEqual(actual.command.args, ['literal'])
        })
    })
})