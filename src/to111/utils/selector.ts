import Entities from '../mappings/entities'
import { isNumeric } from '../../utils/utils'

export class Selector111 {
    public variable: string
    public arguments: { [key: string]: any } = {}
    public scores: { [objective: string]: number } = {}

    constructor(input: string) {
        this.parseHead(input)
        this.parseArgument(input, 3)
    }

    /**
     * @returns `VALID` or an error.
     */
    public static tryParse(input: string) {
        try {
            new Selector111(input)
        } catch (thisIsMyAnswer) {
            return thisIsMyAnswer
        }
        return 'VALID'
    }

    public toString() {
        let result = `@${this.variable}[`

        for (const key in this.arguments) {
            if (['type', 'name', 'team', 'tag', 'c', 'm', 'r', 'rm', 'x', 'y', 'z', 'dx', 'dy',
                'dz', 'l', 'lm', 'rx', 'rxm', 'ry', 'rym'].indexOf(key) !== -1) {
                let value = this.arguments[key]
                if (key === 'type') {
                    value = Entities.to111(value)
                }
                result += `${key}=${value},`
            }
        }

        for (const objective in this.scores) {
            const value = this.scores[objective]
            result += `score_${objective}=${value},`
        }

        result = result.slice(0, -1)
        if (result.length > 2) {
            result += ']'
        }
        return result
    }

    private parseHead(input: string) {
        if (input.charAt(0) !== '@') {
            throw `Expected '@' at [0] but got '${input.charAt(0)}'.`
        }
        if (/^[aeprs]$/.test(input.charAt(1))) {
            this.variable = input.charAt(1)
        } else {
            throw `Expected '/^[aeprs]$/' at [1] but got '${input.charAt(1)}'.`
        }
        if (!/^$|^\[$/.test(input.charAt(2))) {
            // Neither empty nor open square bracket.
            throw `Expected '/^$|^\[$/' at [2] but got '${input.charAt(2)}'.`
        }
    }

    private parseArgument(input: string, index: number) {
        if (/^$|^\]$/.test(input.charAt(index))) {
            // Either empty or close square bracket.
            return
        }

        let key = ''
        while (input.charAt(index) !== '=' && input.charAt(index) !== ',' && input.charAt(index) !== ']') {
            key += input.charAt(index)
            index += 1
        }

        if (isNumeric(key)) {
            if (this.arguments.x === undefined) {
                this.arguments.x = key
            } else if (this.arguments.y === undefined) {
                this.arguments.y = key
            } else if (this.arguments.z === undefined) {
                this.arguments.z = key
            } else if (this.arguments.r === undefined) {
                this.arguments.r = key
            } else {
                throw 'Expected values but got nothing.'
            }
        } else {
            index += 1

            let value = ''
            while (input.charAt(index) && !/^[\]|,]$/.test(input.charAt(index))) {
                // Neither close square bracket nor comma
                value += input.charAt(index)
                index += 1
            }

            if (key.slice(0, 6) === 'score_') {
                this.scores[key.slice(6)] = parseInt(value)
            } else {
                this.arguments[key] = value
            }
        }

        this.parseArgument(input, index + 1)
    }
}
