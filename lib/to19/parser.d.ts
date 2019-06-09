import { ArgumentParser } from '../utils/wheel_chief/parser';
export declare class ArgumentParser18To19 extends ArgumentParser {
    parseArgument(parser: string, splited: string[], index: number, properties: any): number;
    protected parseMinecraftEntity(splited: string[], index: number): number;
    protected parseMinecraftNbt(splited: string[], index: number): number;
    protected parseSpgodingNbtContainsRiding(splited: string[], index: number): number;
}
