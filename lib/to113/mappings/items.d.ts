import { NbtCompound, NbtString, NbtShort, NbtInt, NbtByte, NbtValue } from '../../utils/nbt/nbt';
import { Number_String } from './mapping';
export declare class StdItem1_12 {
    private readonly name;
    private readonly data;
    private readonly tag;
    private readonly count;
    private readonly slot;
    constructor(name: string, data: number, tag: NbtCompound, count?: NbtValue, slot?: NbtValue);
    getName(): string;
    getCount(): NbtCompound | import("../../utils/nbt/nbt").NbtList | import("../../utils/nbt/nbt").NbtByteArray | import("../../utils/nbt/nbt").NbtIntArray | import("../../utils/nbt/nbt").NbtLongArray | NbtByte | NbtShort | NbtInt | import("../../utils/nbt/nbt").NbtLong | import("../../utils/nbt/nbt").NbtFloat | import("../../utils/nbt/nbt").NbtDouble | NbtString | undefined;
    getSlot(): NbtCompound | import("../../utils/nbt/nbt").NbtList | import("../../utils/nbt/nbt").NbtByteArray | import("../../utils/nbt/nbt").NbtIntArray | import("../../utils/nbt/nbt").NbtLongArray | NbtByte | NbtShort | NbtInt | import("../../utils/nbt/nbt").NbtLong | import("../../utils/nbt/nbt").NbtFloat | import("../../utils/nbt/nbt").NbtDouble | NbtString | undefined;
    getData(): number;
    getTag(): NbtCompound;
    getNominal(): string;
}
export declare class StdItem1_13 {
    private readonly name;
    private readonly tag;
    private readonly count;
    private readonly slot;
    constructor(name: string, nbt: NbtCompound, count?: NbtValue, slot?: NbtValue);
    getName(): string;
    getTag(): NbtCompound;
    getNominal(): string;
    getNbt(): NbtCompound;
    hasTag(): boolean;
}
/**
 * Providing a map storing old item IDs and new item IDs.
 */
export default class Items {
    static std112(id?: number, name?: string, data?: number, tag?: string, nbt?: string): StdItem1_12;
    static to113(std: StdItem1_12): StdItem1_13;
    static toNominalColor(input: number, suffix: string): string;
    static NumericID112_NominalID112: Number_String[];
    static Nominal112_NominalID113: string[][];
    static DamagableItems: string[];
    static MapItems: string[];
    static SpawnEgges: string[];
    static NumericColor_NominalColor: string[][];
}
