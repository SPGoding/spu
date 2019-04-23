export interface Result {
    commands: string[];
    logs: string[];
    state: 'success' | 'warning' | 'error';
}
export declare function update(commands: string[], from: number, to: number): Result;
