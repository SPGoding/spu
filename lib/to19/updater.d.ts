import { Updater } from '../utils/wheel_chief/updater';
import { UpdateResult } from '../utils/utils';
import { NbtCompound } from '../utils/nbt/nbt';
export declare class UpdaterTo19 extends Updater {
    static upLine(input: string, from: string): UpdateResult;
    upArgument(input: string, updater: string): string;
    protected upMinecraftComponent(input: string): string;
    protected upSpgodingCommand(input: string): {
        command: string;
        warnings: string[];
    };
    protected upSpgodingEntityNbt(input: NbtCompound): NbtCompound;
    protected upSpgodingItemNbt(input: NbtCompound): NbtCompound;
    protected upSpgodingTargetSelector(input: string): string;
}
