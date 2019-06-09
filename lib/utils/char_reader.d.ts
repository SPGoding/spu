export declare class CharReader {
    private str;
    private pos;
    private length;
    getPos(): number;
    setPos(pos: number): void;
    constructor(str: string);
    peek(): string;
    next(): string;
    back(): void;
    hasMore(): boolean;
    readUntil(until: string[]): string;
}
