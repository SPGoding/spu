import { Updater } from '../utils/wheel_chief/updater';
import { UpdateResult } from '../utils/utils';
import { NbtCompound } from '../utils/nbt/nbt';
export declare class UpdaterTo113 extends Updater {
    static upLine(input: string, from: string): UpdateResult;
    upArgument(input: string, updater: string): string;
    protected upMinecraftEntitySummon(input: string): string;
    protected upSpgodingBlockName(input: string): string;
    protected upSpgodingBlockNbt(input: NbtCompound): NbtCompound;
    protected upSpgodingBlockParam(input: string): string;
    protected upSpgodingCommand(input: string): {
        command: string;
        warnings: string[];
    };
    protected upSpgodingDifficulty(input: string): "normal" | "peaceful" | "easy" | "hard";
    protected upSpgodingEffect(input: string): string;
    protected upSpgodingEnchantment(input: string): string;
    protected upSpgodingEntityNbt(input: NbtCompound): NbtCompound;
    private upBlockNumericIDToBlockState;
    upSpgodingGamemode(input: string): "survival" | "creative" | "adventure" | "spectator";
    protected upSpgodingItemNbt(input: NbtCompound): NbtCompound;
    protected upSpgodingItemTagNbt(input: NbtCompound): NbtCompound;
    protected upSpgodingItemParams(input: string): string;
    protected upSpgodingItemSlot(input: string): string;
    protected upSpgodingTargetSelector(input: string): string;
    protected upSpgodingParticle(input: string): string;
    protected upSpgodingPointsOrLevels(input: string): string;
    protected upSpgodingPreJson(input: string): string;
    protected upSpgodingScoreboardCriteria(input: string): string;
    protected upSpgodingSingleSelector(input: string): string;
    protected upSpgodingSound(input: string): string;
    protected upSpgodingToLiteralReplace(input: string): string;
}
