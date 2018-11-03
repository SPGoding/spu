import { NbtCompound } from "./nbt/nbt";
import { getNbtCompound, completeNamespace } from "./utils";

export class ItemStack {
    public name: string
    public nbt: NbtCompound

    constructor(input: string) {
        let index = 0
        index = this.parseName(input, index) + 1
        this.parseNbt(input, index)
    }

    public toString() {
        let result = this.name

        if (this.nbt !== undefined) {
            result += this.nbt.toString()
        }

        return result
    }

    /**
     * Parses the item name.
     * @returns The end of the name. (The index of the char before `{` or ``.)
     */
    private parseName(input: string, index: number) {
        let name = ''

        while (input.charAt(index) !== '' && input.charAt(index) !== '[' && input.charAt(index) !== '{') {
            name += input.charAt(index)
            index += 1
        }

        name = completeNamespace(name)

        this.name = name

        return index - 1
    }
    
    /**
     * Parses the item nbt.
     * @returns The end of the nbt. (Can be `}` or ``.)
     */
    private parseNbt(input: string, index: number) {
        if (input.charAt(index) === '{') {
            this.nbt = getNbtCompound(input.slice(index))
        }

        return index
    }
} 