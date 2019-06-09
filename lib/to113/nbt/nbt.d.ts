export declare type NbtValue = NbtCompound | NbtList | NbtByteArray | NbtIntArray | NbtLongArray | NbtByte | NbtShort | NbtInt | NbtLong | NbtFloat | NbtDouble | NbtString;
export declare class NbtString {
    private value;
    constructor(value?: string);
    get: () => string;
    set(value: string): void;
    toString: () => string;
}
export declare class NbtByte {
    private value;
    constructor(value?: number);
    get: () => number;
    set(value: number): void;
    toString: () => string;
}
export declare class NbtShort {
    private value;
    constructor(value?: number);
    get: () => number;
    set(value: number): void;
    toString: () => string;
}
export declare class NbtInt {
    private value;
    constructor(value?: number);
    get: () => number;
    set(value: number): void;
    toString: () => string;
}
export declare class NbtLong {
    private value;
    constructor(value?: number);
    get: () => number;
    set(value: number): void;
    toString: () => string;
}
export declare class NbtFloat {
    private value;
    constructor(value?: number);
    get: () => number;
    set(value: number): void;
    toString(): string;
}
export declare class NbtDouble {
    private value;
    constructor(value?: number);
    get: () => number;
    set(value: number): void;
    toString(): string;
}
export declare class NbtCompound {
    private readonly value;
    get: (key: string) => NbtCompound | NbtList | NbtByteArray | NbtIntArray | NbtLongArray | NbtByte | NbtShort | NbtInt | NbtLong | NbtFloat | NbtDouble | NbtString | undefined;
    del: (key: string) => boolean;
    set(key: string, val: NbtValue): void;
    toString(): string;
    toJson(): string;
}
export declare class NbtList {
    private readonly value;
    readonly length: number;
    get: (index: number) => NbtValue;
    set(index: number, val: NbtValue): void;
    add(val: NbtValue): void;
    toString(): string;
    toJson(): string;
    forEach: any;
}
export declare class NbtByteArray {
    private readonly value;
    get: (index: number) => NbtByte;
    add(val: NbtByte): void;
    toString(): string;
}
export declare class NbtIntArray {
    private readonly value;
    get: (index: number) => NbtInt;
    add(val: NbtInt): void;
    toString(): string;
}
export declare class NbtLongArray {
    private readonly value;
    get: (index: number) => NbtLong;
    add(val: NbtLong): void;
    toString(): string;
}
