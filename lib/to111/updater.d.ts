import { Updater } from '../utils/wheel_chief/updater';
import { UpdateResult } from '../utils/utils';
import { NbtCompound } from '../utils/nbt/nbt';
export declare class UpdaterTo111 extends Updater {
    static upLine(input: string, from: string): UpdateResult;
    upArgument(input: string, updater: string): string;
    protected upMinecraftComponent(input: string): string;
    protected upMinecraftEntitySummon(input: string): string;
    protected upSpgodingCommand(input: string): {
        command: string;
        warnings: string[];
    };
    protected upSpgodingEntityNbt(input: NbtCompound): NbtCompound;
    static upEntityNbtWithType(nbt: NbtCompound, entityType: string): {
        nbt: NbtCompound;
        type: string;
    };
    protected upSpgodingTargetSelector(input: string): string;
}
