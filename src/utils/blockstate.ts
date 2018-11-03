import { NbtCompound } from "./nbt/nbt";
import { getNbtCompound } from "./utils";

export class BlockState {
    public name: string
    public nbt: NbtCompound
    public states: { [stateKey: string]: string } = {}

    constructor(input: string) {
        let index = 0
        index = this.parseName(input, index) + 1
        index = this.parseStates(input, index) + 1
        this.parseNbt(input, index)
    }

    /**
     * Parses the block name.
     * @returns The end of the name. (The index of the char before `[`, `{` or ``.)
     */
    private parseName(input: string, index: number) {
        let name = ''

        while (input.charAt(index) !== '' && input.charAt(index) !== '[' && input.charAt(index) !== '{') {
            name += input.charAt(index)
            index += 1
        }

        this.name = name

        return index - 1
    }

    /**
     * Parses the block states.
     * @returns The end of the states. (Can be `]`, `` or the end of the name.)
     */
    private parseStates(input: string, index: number) {
        if (input.charAt(index) === '[') {
            index += 1
            index = this.skipSpaces(input, index)

            if (input.charAt(index) !== ']') {
                index = this.parseAState(input, index)
            }
        } else {
            index -= 1
        }

        return index
    }

    /**
     * Parses a block state.
     * @returns The end of this state. (Can be `,` or `]`.)
     */
    private parseAState(input: string, index: number) {
        let stateKey = ''

        // Read key
        while (input.charAt(index) !== '=') {
            if (input.charAt(index) === '') {
                throw `Expected '=' but got EOF.`
            } else if (input.charAt(index) === ' ') {
                index = this.skipSpaces(input, index)
                if (input.charAt(index) !== '=') {
                    throw `Expected '=' but got '${input.charAt(index)}' after several spaces.`
                }
            } else {
                stateKey += input.charAt(index)
                index += 1
            }
        }

        index += 1

        // Read value
        let value = ''
        index = this.skipSpaces(input, index)

        while (input.charAt(index) !== ']' && input.charAt(index) !== ',') {
            if (input.charAt(index) === '') {
                throw `Expected ']' or ',' but got EOF.`
            } else if (input.charAt(index) === ' ') {
                index = this.skipSpaces(input, index)
                if (input.charAt(index) !== ']' && input.charAt(index) !== ',') {
                    throw `Expected ']' or ',' but got '${input.charAt(index)}' after several spaces.`
                }
            } else {
                value += input.charAt(index)
                index += 1
            }
        }

        if (input.charAt(index) === ',') {
            if (input[index + 1] !== ']') {
                this.parseAState(input, index + 1)
            } else {
                index += 1
            }
        }

        this.states[stateKey] = value

        return index
    }

    /**
     * Skip spaces.
     * @returns The index of the first nonspace char.
     */
    private skipSpaces(input: string, index: number) {
        while (input.charAt(index) === ' ') {
            index += 1
        }

        return index
    }

    /**
     * Parses the block nbt.
     * @returns The end of the nbt. (Can be `}` or ``.)
     */
    private parseNbt(input: string, index: number) {
        if (input.charAt(index) === '{') {
            this.nbt = getNbtCompound(input.slice(index))
        }

        return index
    }
} 