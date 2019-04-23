export declare class TargetSelector {
    variable: string;
    arguments: {
        [key: string]: any;
    };
    scores: {
        [objective: string]: number;
    };
    constructor(input: string);
    static tryParse(input: string): any;
    toString(): string;
    private parseHead;
    private parseArgument;
}
