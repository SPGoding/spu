import { NbtCompound } from "./nbt/nbt";
export declare class ItemStack {
    name: string;
    nbt: NbtCompound;
    constructor(input: string);
    toString(): string;
    /**
     * Parses the item name.
     * @returns The end of the name. (The index of the char before `{` or ``.)
     */
    private parseName;
    /**
     * Parses the item nbt.
     * @returns The end of the nbt. (Can be `}` or ``.)
     */
    private parseNbt;
}
