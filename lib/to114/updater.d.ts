import { Updater } from '../utils/wheel_chief/updater';
import { UpdateResult } from '../utils/utils';
import { NbtCompound } from '../utils/nbt/nbt';
export declare class UpdaterTo114 extends Updater {
    static upLine(input: string, from: string): UpdateResult;
    upArgument(input: string, updater: string): string;
    protected upSpgodingCommand(input: string): UpdateResult;
    protected upSpgodingBlockName(input: string): string;
    protected upSpgodingItemName(input: string): string;
    protected upSpgodingItemNbt(input: NbtCompound): NbtCompound;
    protected upSpgodingItemTagNbt(input: NbtCompound): NbtCompound;
    private upSpgodingPreTickTime;
}
