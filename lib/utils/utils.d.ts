export declare function isNumeric(num: any): boolean;
export declare function isWhiteSpace(char: string): boolean;
export declare type NbtFormat = 'before 1.12' | 'after 1.12' | 'after 1.14';
export declare function getNbtCompound(str: string, version?: NbtFormat): import("../../src/utils/nbt/nbt").NbtCompound;
export declare function getNbtList(str: string, version?: NbtFormat): import("../../src/utils/nbt/nbt").NbtList;
export declare function completeNamespace(input: string): string;
export declare function getUuidLeastUuidMost(uuid: string): {
    L: number;
    M: number;
};
export interface UpdateResult {
    command: string;
    warnings: string[];
}
export declare const escape: (str: string, quote?: "\"" | "'") => string;
export declare const unescape: (str: string) => string;
