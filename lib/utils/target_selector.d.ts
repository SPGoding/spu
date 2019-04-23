import { NbtCompound } from './nbt/nbt';
export declare class TargetSelector {
    variable: string;
    tag: string[];
    team: string[];
    gamemode: string[];
    name: string[];
    type: string[];
    distance: Range;
    level: Range;
    x_rotation: Range;
    y_rotation: Range;
    limit: string;
    x: string;
    y: string;
    z: string;
    dx: string;
    dy: string;
    dz: string;
    sort: string;
    advancements: Map<string, any>;
    scores: Map<string, Range>;
    nbt: NbtCompound;
    constructor(input: string);
    toString(): string;
    private parseHead;
    private parseArgument;
    /**
     * Parse the `scores` arugment.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of `scores` (should be `}`).
     */
    private parseScores;
    /**
     * Parse a single score.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of this score (should be `,` or `}`).
     */
    private parseScore;
    /**
     * Parse the `advancements` arugment.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of `advancements` (should be `}`).
     */
    private parseAdvancements;
    /**
     * Parse a single advancement.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of this advancement (should be `,` or `}`).
     */
    private parseAdvancement;
    /**
     * Parse advancement criterias.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of this `criterias` (should be `}`).
     */
    private parseAdvancementCriterias;
    /**
     * Parse a single advancement criteria.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of this criteria (should be `,` or `}`).
     */
    private parseAdvancementCriteria;
    /**
     * Parse the `nbt` argument.
     * @param input A target selector string.
     * @param index The beginning index.
     * @returns The end index of `nbt` (should be `}`).
     */
    private parseNbt;
}
/**
 * Represents a range in a target selector.
 */
declare class Range {
    min: number | null;
    max: number | null;
    constructor(str: string);
    toString(): string;
}
export {};
