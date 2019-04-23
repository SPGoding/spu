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
    private parseScores;
    private parseScore;
    private parseAdvancements;
    private parseAdvancement;
    private parseAdvancementCriterias;
    private parseAdvancementCriteria;
    private parseNbt;
}
declare class Range {
    min: number | null;
    max: number | null;
    constructor(str: string);
    toString(): string;
}
export {};
