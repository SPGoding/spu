import { ArgumentParser } from './parser';
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
/**
 * WheelChief
 * 「旅长」命令解析系统的轮子 —— 「轮长」命令解析系统
 */
export declare class WheelChief {
    static update(input: string, rootNode: CmdNode, parser: ArgumentParser, updater: Updater, executor: SpuScriptExecutor): UpdateResult;
    /**
     * 尝试解析一个节点。
     * @param input 输入。
     * @param nodeName 解析的当前节点的名称。用于 `literal` 的相等检测。
     * @param node 当前要解析的节点。
     * @param rootNode 根节点。可以理解为整个 `commands.json`，用于 `redirect` 的正确操作。
     * @throws 如果该节点不能解析此处的命令参数，将会抛出异常。异常应由 `parseChildren()` 捕获。
     */
    static parseCmdNode(input: ParseResult, nodeName: string, node: CmdNode, rootNode: CmdNode, parser: ArgumentParser): ParseResult;
    /**
     * 尝试向下解析 `children`，`executable` 或 `redirect`。
     * @param result 输出（可被直接舍弃，不对原输入造成影响）。
     * @param input 输入。
     * @param node 当前节点。
     * @param rootNode 根节点。
     */
    private static recurse;
    /**
     * 尝试按一整个 `children` 解析。
     * @param children `children`。
     * @param result 输出（可被直接舍弃，不对原输入造成影响）。
     * @param rootNode 根节点。
     */
    private static parseChildren;
}
export {};
