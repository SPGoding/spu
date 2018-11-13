import { ArgumentParser } from './argument_parsers'
import { isWhiteSpace, UpdateResult } from '../utils'
import { Updater } from './updater'

export type Property = { [propertyName: string]: any }
type Children = { [nodeName: string]: CmdNode }

export interface CmdNode {
    type: 'root' | 'literal' | 'argument'
    children?: Children
    parser?: string
    updater?: string
    properties?: Property
    executable?: boolean
    redirect?: string[]
    spu_script?: string
    warning?: string
}

export interface Command {
    args: Argument[]
    spuScript: string
    warning: string
}

export interface Argument {
    value: string
    updater?: string
}

export interface ParseResult {
    command: Command
    index: number
    splited: string[]
}

export interface SpuScriptExecutor {
    execute(script: string, args: Argument[]): string
}

/**
 * WheelChief
 * 「旅长」命令解析系统的轮子 —— 「轮长」命令解析系统
 */
export class WheelChief {
    public static update(input: string, rootNode: CmdNode,
        parser: ArgumentParser, updater: Updater, executor: SpuScriptExecutor): UpdateResult {
        const slash = input.charAt(0) === '/'
        if (slash) {
            input = input.slice(1)
        }

        // 把输入的命令解析为 `Command`
        const command = WheelChief.parseCmdNode(
            {
                command: {
                    args: [],
                    spuScript: '',
                    warning: ''
                },
                index: 0,
                splited: input.split(' ')
            },
            'N/A',
            rootNode,
            rootNode,
            parser
        ).command

        let ans = ''

        // 对参数根据 updater/parser 进行升级
        for (const arg of command.args) {
            if (arg.updater) {
                arg.value = updater.upArgument(arg.value, arg.updater)
            }
        }

        // 最后执行针对整条命令的 spu script 以调整命令语序以及其他内容
        if (command.spuScript) {
            ans = executor.execute(command.spuScript, command.args)
        } else {
            for (const argument of command.args) {
                ans += `${argument.value} `
            }
            ans = ans.slice(0, -1)
        }

        if (slash) {
            ans = `/${ans}`
        }

        return { command: ans, warnings: [command.warning] }
    }

    /**
     * 尝试解析一个节点。
     * @param input 输入。
     * @param nodeName 解析的当前节点的名称。用于 `literal` 的相等检测。
     * @param node 当前要解析的节点。
     * @param rootNode 根节点。可以理解为整个 `commands.json`，用于 `redirect` 的正确操作。
     * @throws 如果该节点不能解析此处的命令参数，将会抛出异常。异常应由 `parseChildren()` 捕获。
     */
    public static parseCmdNode(input: ParseResult, nodeName: string, node: CmdNode, rootNode: CmdNode, parser: ArgumentParser): ParseResult {
        let result: ParseResult = {
            command: { args: input.command.args.slice(0), spuScript: input.command.spuScript, warning: input.command.warning },
            index: input.index,
            splited: input.splited.slice(0)
        }
        if (node.type === 'root') {
            if (node.children) {
                if (node.children[input.splited[input.index]]) {
                    result.command.args.push({ value: input.splited[input.index] })
                    result.index += 1
                    result = WheelChief.recurse(result, input, node.children[input.splited[input.index]], rootNode, parser)
                } else {
                    throw `Unknown command: '${input.splited[input.index]}'.`
                }
            } else {
                throw `Expected 'children' for the root node.`
            }
        } else if (node.type === 'literal') {
            if (nodeName === input.splited[input.index]) {
                if (node.updater) {
                    result.command.args.push({ value: nodeName, updater: node.updater })
                } else {
                    result.command.args.push({ value: nodeName })
                }
                result.index += 1
                result = WheelChief.recurse(result, input, node, rootNode, parser)
            } else {
                throw `Expected literal '${nodeName}' but got '${input.splited[input.index]}'.`
            }
        } else if (node.type === 'argument') {
            if (node.parser) {
                try {
                    let canBeParsed = parser.parseArgument(node.parser, input.splited, input.index, node.properties)
                    result.command.args.push({
                        value: input.splited.slice(input.index, input.index + canBeParsed).join(' '),
                        updater: node.updater ? node.updater : node.parser
                    })
                    result.index += canBeParsed
                } catch (e) {
                    throw `Parser '${node.parser}' failed to parse '${input.splited.slice(input.index).join(' ')}': ${e}`
                }
                result = WheelChief.recurse(result, input, node, rootNode, parser)
            } else {
                throw `Expected 'parser' for the argument node.`
            }
        } else {
            throw `Unknown type: '${node.type}'. Can be one of the following values: 'root', 'literal' and 'argument'.`
        }
        return result
    }

    /**
     * 尝试向下解析 `children`，`executable` 或 `redirect`。
     * @param result 输出（可被直接舍弃，不对原输入造成影响）。
     * @param input 输入。
     * @param node 当前节点。
     * @param rootNode 根节点。
     */
    private static recurse(result: ParseResult, input: ParseResult, node: CmdNode, rootNode: CmdNode, parser: ArgumentParser) {
        if (result.index >= input.splited.length) {
            if (node.executable) {
                if (node.spu_script) {
                    result.command.spuScript = node.spu_script
                }
                if (node.warning) {
                    result.command.warning = node.warning
                }
            } else {
                throw `Expected executable command but got EOF.`
            }
        } else {
            if (node.children) {
                result = WheelChief.parseChildren(node.children, result, rootNode, parser)
            } else if (node.redirect) {
                if (rootNode.children) {
                    let children = rootNode.children[node.redirect[0]].children
                    if (children) {
                        result = WheelChief.parseChildren(children, result, rootNode, parser)
                    } else {
                        throw `Expected redirect node: '${node.redirect[0]}' but got nothing.`
                    }
                } else {
                    throw `Expected 'children' for the root node.`
                }
            } else if (node.executable === true) {
                throw `Expected EOF but got trailing data.`
            } else {
                if (rootNode.children) {
                    result = WheelChief.parseChildren(rootNode.children, result, rootNode, parser)
                } else {
                    throw `Expected 'children' for the root node.`
                }
            }
        }
        return result
    }

    /**
     * 尝试按一整个 `children` 解析。
     * @param children `children`。
     * @param result 输出（可被直接舍弃，不对原输入造成影响）。
     * @param rootNode 根节点。
     */
    private static parseChildren(children: Children, result: ParseResult, rootNode: CmdNode, parser: ArgumentParser) {
        let operated = false
        let exception: string[] = []
        for (const name in children) {
            if (children.hasOwnProperty(name)) {
                const child = children[name]
                try {
                    result = WheelChief.parseCmdNode(result, name, child, rootNode, parser)
                    operated = true
                    break
                } catch (e) {
                    exception.push(e.replace(/Failed to parse '.*': \<br \/\>/g, ''))
                    continue
                }
            }
        }
        if (!operated) {
            throw `Failed to parse '${result.splited.join(' ')}': <br />${exception.join('<br />')}`
        }
        return result
    }
}
