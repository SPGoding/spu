import { ArgumentParser } from './argument_parsers';
import { UpdateResult } from '../utils';
import { Updater } from './updater';
export declare type Property = {
    [propertyName: string]: any;
};
declare type Children = {
    [nodeName: string]: CmdNode;
};
export interface CmdNode {
    type: 'root' | 'literal' | 'argument';
    children?: Children;
    parser?: string;
    updater?: string;
    properties?: Property;
    executable?: boolean;
    redirect?: string[];
    spu_script?: string;
    warning?: string;
}
export interface Command {
    args: Argument[];
    spuScript: string;
    warning: string;
}
export interface Argument {
    value: string;
    updater?: string;
}
export interface ParseResult {
    command: Command;
    index: number;
    splited: string[];
}
export interface SpuScriptExecutor {
    execute(script: string, args: Argument[]): string;
}
export declare class WheelChief {
    static update(input: string, rootNode: CmdNode, parser: ArgumentParser, updater: Updater, executor: SpuScriptExecutor): UpdateResult;
    static parseCmdNode(input: ParseResult, nodeName: string, node: CmdNode, rootNode: CmdNode, parser: ArgumentParser): ParseResult;
    private static recurse;
    private static parseChildren;
}
export {};
