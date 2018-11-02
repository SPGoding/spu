import 'mocha'
import * as assert from 'power-assert'

import { TargetSelector } from '../../utils/target_selector'

describe.only('TargetSelector tests', () => {
    describe('constructor() tests', () => {
        it('should parse variable', () => {
            const input = '@e'

            const actual = new TargetSelector(input)

            assert(actual.variable === 'e')
        })
        it('should parse directly stored argument', () => {
            const input = '@e[limit=1]'

            const actual = new TargetSelector(input)

            assert(actual.limit === '1')
        })
        it('should parse multiple argument', () => {
            const input = '@e[tag=foo,tag=bar]'

            const actual = new TargetSelector(input)

            assert.deepEqual(actual.tag, ['foo', 'bar'])
        })
        it('should parse range argument', () => {
            const input = '@e[distance=0..2]'

            const actual = new TargetSelector(input)

            assert(actual.distance.max === 2 && actual.distance.max === 2)
        })
        it('should parse scores', () => {
            const input = '@e[scores={foobar=0..2}]'

            const actual = new TargetSelector(input)
            const foobar = actual.scores.get('foobar')

            assert(foobar && foobar.min === 0 && foobar.max === 2)
        })
        it('should parse advancements', () => {
            const input = '@e[advancements={foo=false,bar={baz=true}}]'

            const actual = new TargetSelector(input)
            const objective = actual.scores.get('foobar')

            assert(objective && objective.min === 0 && objective.max === 2)
        })
    })
})