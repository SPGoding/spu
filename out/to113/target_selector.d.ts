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
    parse(str: string): void;
    to113(): string;
    static isValid(input: string): boolean;
    private parseVariable;
    private parseProperties;
    private getProperties;
    setScore(objective: string, value: string, type: 'max' | 'min'): void;
    private parseScore;
    private getScores;
    private getAdvancements;
}
