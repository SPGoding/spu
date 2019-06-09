/**
 * Represent a target selector.
 * Provides methods to operate it.
 * @author SPGoding
 */
export declare class TargetSelector {
    private variable;
    private dx;
    private dy;
    private dz;
    private limit;
    private x;
    private y;
    private z;
    private sort;
    private readonly tag;
    private readonly team;
    private readonly name;
    private readonly type;
    private readonly gamemode;
    private readonly level;
    private readonly distance;
    private readonly x_rotation;
    private readonly y_rotation;
    private readonly scores;
    private readonly advancements;
    private readonly nbt;
    constructor();
    /**
     * Parses this selector according to a string in 1.12.
     * @param str An string representing a target selector.
     */
    parse(str: string): void;
    /**
     * Gets a string that can represent this target selector in 1.13.
     */
    to113(): string;
    /**
     * Returns if a target selector is valid.
     * @param input a target selector.
     */
    static isValid(input: string): boolean;
    private parseVariable;
    private parseProperties;
    private getProperties;
    setScore(objective: string, value: string, type: 'max' | 'min'): void;
    private parseScore;
    private getScores;
    private getAdvancements;
}
