import { UpdateResult } from '../utils';
import { NbtCompound } from '../nbt/nbt';
import { BlockState } from '../block_state';
import { ItemStack } from '../item_stack';
export declare class Updater {
    upArgument(input: string, updater: string): string;
    static upLine(input: string, _from: string): UpdateResult;
    protected upMinecraftBlockState(input: BlockState): BlockState;
    protected upMinecraftComponent(input: string): string;
    protected upMinecraftEntity(input: string): string;
    protected upMinecraftEntitySummon(input: string): string;
    protected upMinecraftItemStack(input: ItemStack): ItemStack;
    protected upMinecraftItemSlot(input: string): string;
    protected upMinecraftMessage(input: string): string;
    protected upSpgodingBlockName(input: string): string;
    protected upSpgodingBlockNbt(input: NbtCompound): NbtCompound;
    protected upSpgodingCommand(input: string): UpdateResult;
    protected upSpgodingEntityNbt(input: NbtCompound): NbtCompound;
    protected upSpgodingItemName(input: string): string;
    protected upSpgodingItemNbt(input: NbtCompound): NbtCompound;
    protected upSpgodingItemTagNbt(input: NbtCompound): NbtCompound;
    protected upSpgodingTargetSelector(input: string): string;
}
