import { Updater } from '../utils/wheel_chief/updater';
import { UpdateResult } from '../utils/utils';
export declare class UpdaterTo112 extends Updater {
    static upLine(input: string, from: string): UpdateResult;
    protected upSpgodingCommand(input: string): {
        command: string;
        warnings: string[];
    };
    protected upSpgodingTargetSelector(input: string): string;
}
