import { NbtCompound } from "./nbt/nbt";
export declare class ItemStack {
    name: string;
    nbt: NbtCompound;
    constructor(input: string);
    toString(): string;
    private parseName;
    private parseNbt;
}
