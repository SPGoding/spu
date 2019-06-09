import { NbtCompound } from './nbt/nbt';
export declare class BlockState {
    name: string;
    nbt: NbtCompound;
    states: {
        [stateKey: string]: string;
    };
    constructor(input: string);
    toString(): string;
    /**
     * Parses the block name.
     * @returns The end of the name. (The index of the char before `[`, `{` or ``.)
     */
    private parseName;
    /**
     * Parses the block states.
     * @returns The end of the states. (Can be `]`, `` or the end of the name.)
     */
    private parseStates;
    /**
     * Parses a block state.
     * @returns The end of this state. (Can be `,` or `]`.)
     */
    private parseAState;
    /**
     * Skip spaces.
     * @returns The index of the first nonspace char.
     */
    private skipSpaces;
    /**
     * Parses the block nbt.
     * @returns The end of the nbt. (Can be `}` or ``.)
     */
    private parseNbt;
}
