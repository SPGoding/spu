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
    static combineStates(defaultStates: string[], customStates: string[]): string[];
    static Nominal112_Nominal113: string[][];
    static ID_Data_Name_States: Number_Number_String_StringArray[];
}
