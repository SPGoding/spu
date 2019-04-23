import { NbtCompound } from "./nbt/nbt";
export declare class BlockState {
    name: string;
    nbt: NbtCompound;
    states: {
        [stateKey: string]: string;
    };
    constructor(input: string);
    toString(): string;
    private parseName;
    private parseStates;
    private parseAState;
    private skipSpaces;
    private parseNbt;
}
