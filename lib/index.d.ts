export interface Result {
    /**
     * All updated commands.
     */
    commands: string[];
    /**
     * Human-readable logs.
     */
    logs: string[];
    /**
     * `success` means success.
     * `warning` means that the commands are correct but spu can't update it cuz of some reasons, like Minecraft totally removed them in further versions.
     * `error` means that the commands have syntax error(s).
     */
    state: 'success' | 'warning' | 'error';
}
/**
 * Update command(s).
 * @param commands The command(s) that will be updated. Support blank lines and comments. Support slashes(`/`) before commands.
 * @param from The original version of the command(s). `X` stands for *Minecraft Java Edition 1.X*.
 * @param to The target version. `X` stands for *Minecraft Java Edition 1.X*.
 */
export declare function update(commands: string[], from: number, to: number): Result;
