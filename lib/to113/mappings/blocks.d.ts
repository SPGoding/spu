import { NbtCompound, NbtString, NbtInt, NbtByte, NbtShort } from '../../utils/nbt/nbt';
import { Number_Number_String_StringArray } from './mapping';
export declare class StdBlock {
    private readonly _isBlockTag;
    private readonly _name;
    private readonly _states;
    private readonly _nbt;
    constructor(name: string, states: string[], nbt: NbtCompound, isBlockTag?: boolean);
    getName(): string;
    getStates(): string[];
    getNbt(): NbtCompound;
    getFull(): string;
    getNominal(): string;
    hasStates(): boolean;
    hasNbt(): boolean;
    isBlockTag(): boolean;
}
/**
 * Provides methods to convert blockstacks from 1.12 to 1.13.
 */
export default class Blocks {
    static std112(id?: number, name?: string, data?: number, state?: string, nbt?: string): StdBlock;
    static to113(std: StdBlock): StdBlock;
    private static upPiston;
    private static upNoteBlock;
    private static upCactus;
    private static updateJukebox;
    private static upBed;
    private static upBanner;
    private static upSkull;
    static upNumericToBlockState(id: NbtShort | NbtInt, data?: NbtShort | NbtInt): NbtCompound;
    static upStringToBlockState(id: NbtString, data?: NbtByte | NbtInt | NbtShort): NbtCompound;
    private static getStatesFromNominal;
    /**
     * @param defaultStates Defualt states without square('[' and ']').
     * @param customStates Custom states. Will replace the default states.
     */
    static combineStates(defaultStates: string[], customStates: string[]): string[];
    /**
     * @example
     * [
     *     ['1.13 Nominal ID', ...'1.12 Normlaize IDs']
     * ]
     */
    static Nominal112_Nominal113: string[][];
    /**
     * Thank MCEdit: https://github.com/mcedit/mcedit2/blob/master/src/mceditlib/blocktypes/idmapping_raw_1_12.json
     * Thank pca for introducing it to me.
     */
    static ID_Data_Name_States: Number_Number_String_StringArray[];
}
