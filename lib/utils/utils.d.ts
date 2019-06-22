/**
 * Return if a thing is numeric. Scientific notation IS supported.
 * @param num Any thing.
 */
export declare function isNumeric(num: any): boolean;
export declare function isWhiteSpace(char: string): boolean;
export declare type NbtFormat = 'before 1.12' | 'after 1.12' | 'after 1.14';
/**
 * Get an NbtCompound object from a string.
 */
export declare function getNbtCompound(str: string, version?: NbtFormat): import("../../../../../../../SpaceBang/Projects/Programing/TypeScript/spu/src/utils/nbt/nbt").NbtCompound;
/**
 * Get an NbtList object from a string.
 */
export declare function getNbtList(str: string, version?: NbtFormat): import("../../../../../../../SpaceBang/Projects/Programing/TypeScript/spu/src/utils/nbt/nbt").NbtList;
/**
 * Set the namespace to `minecraft:` if no namespace.
 * @param input A string.
 */
export declare function completeNamespace(input: string): string;
/**
 * Get UUIDMost and UUIDLeast froom a UUID pair.
 */
export declare function getUuidLeastUuidMost(uuid: string): {
    L: number;
    M: number;
};
export interface UpdateResult {
    command: string;
    warnings: string[];
}
/**
 * For escape & unescape.
 *
 * @author pca006132
 */
export declare const escape: (str: string, quote?: "\"" | "'") => string;
export declare const unescape: (str: string) => string;
