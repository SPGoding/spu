import { BrigadierBoolParser, BrigadierDoubleParser, BrigadierFloatParser, BrigadierIntegerParser, BrigadierStringParser } from "./argument_parsers";

export type Property = { [propertyName: string]: any }
type Children = { [nodeName: string]: CmdNode }

export interface CmdNode {
    type: 'root' | 'literal' | 'argument'
    children?: Children
    parser?: string
    properties?: Property
    executable?: boolean
    redirect?: string[]
    spu_script?: string
}

export interface Command {
    args: string[]
    spuScript: string
}

export interface ParseResult {
    command: Command
    index: number
    splited: string[]
}

/**
 * WheelChief
 * 「旅长」命令解析系统的轮子 —— 「轮长」命令解析系统
 */
export class WheelChief {
    public static update(command: string, nodes: CmdNode) {
        let slash = command.slice(0, 1) === '/'
        if (slash) {
            command = command.slice(1)
        }
    }

    /**
     * 尝试解析一个节点。
     * @param input 输入。
     * @param nodeName 解析的当前节点的名称。用于 `literal` 的相等检测。
     * @param node 当前要解析的节点。
     * @param rootNode 根节点。可以理解为整个 `commands.json`，用于 `redirect` 的正确操作。
     * @throws 如果该节点不能解析此处的命令参数，将会抛出异常。异常应由 `parseChildren()` 捕获。
     */
    public static parseCmdNode(input: ParseResult, nodeName: string, node: CmdNode, rootNode: CmdNode): ParseResult {
        let result: ParseResult = {
            command: { args: input.command.args.slice(0), spuScript: input.command.spuScript },
            index: input.index,
            splited: input.splited.slice(0)
        }
        if (node.type === 'root') {
            if (node.children) {
                result = this.parseChildren(node.children, result, rootNode)
            } else {
                throw `Expected 'children' for the root node.`
            }
        } else if (node.type === 'literal') {
            if (nodeName === input.splited[input.index]) {
                result.command.args.push(nodeName)
                result.index += 1
                result = WheelChief.recurse(result, input, node, rootNode)
            } else {
                throw `Expected literal '${nodeName}' but get '${input.splited[input.index]}'.`
            }
        } else if (node.type === 'argument') {
            if (node.parser) {
                let canBeParsed = WheelChief.canBeParsed(input.splited, input.index, node.parser, node.properties)
                if (canBeParsed === 0) {
                    throw `Can't be parsed.`
                } else {
                    result.command.args.push(input.splited.slice(input.index, input.index + canBeParsed).join(' '))
                    result.index += canBeParsed
                }
                result = WheelChief.recurse(result, input, node, rootNode)
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
    private static recurse(result: ParseResult, input: ParseResult, node: CmdNode, rootNode: CmdNode) {
        if (result.index >= input.splited.length) {
            if (node.executable) {
                if (node.spu_script) {
                    result.command.spuScript = node.spu_script
                }
            }
            else {
                throw `Expected executable command.`
            }
        }
        else {
            if (node.children) {
                result = WheelChief.parseChildren(node.children, result, rootNode)
            }
            else if (node.redirect) {
                if (rootNode.children) {
                    let children = rootNode.children[node.redirect[0]].children
                    if (children) {
                        result = WheelChief.parseChildren(children, result, rootNode)
                    }
                    else {
                        throw `Expected redirect: '${node.redirect[0]}'.`
                    }
                } else {
                    throw `Expected 'children' for the root node.`
                }
            }
            else {
                if (rootNode.children) {
                    result = WheelChief.parseChildren(rootNode.children, result, rootNode)
                } else {
                    throw `Expected 'children' for the root node.`
                }
            }
        }
        return result;
    }

    /**
     * 尝试解析按一整个 `children` 解析。
     * @param children `children`。
     * @param result 输出（可被直接舍弃，不对原输入造成影响）。
     * @param rootNode 根节点。
     */
    private static parseChildren(children: Children, result: ParseResult, rootNode: CmdNode) {
        let operated = false
        for (const name in children) {
            if (children.hasOwnProperty(name)) {
                const child = children[name]
                try {
                    result = WheelChief.parseCmdNode(result, name, child, rootNode)
                    operated = true
                    break
                } catch {
                    continue
                }
            }
        }
        if (!operated) {
            throw `Can't match.`
        }
        return result
    }

    /**
     * @returns Parsed `splited` count.
     */
    public static canBeParsed(splited: string[], index: number, parser: string, properties: Property = {}) {
        let canBeParsed = 0

        switch (parser) {
            case 'brigadier:bool': {
                canBeParsed = new BrigadierBoolParser().canParse(splited, index)
                break
            }
            case 'brigadier:double': {
                canBeParsed = new BrigadierDoubleParser(properties.min, properties.max).canParse(splited, index)
                break
            }
            case 'brigadier:float': {
                canBeParsed = new BrigadierFloatParser(properties.min, properties.max).canParse(splited, index)
                break
            }
            case 'brigadier:integer': {
                canBeParsed = new BrigadierIntegerParser(properties.min, properties.max).canParse(splited, index)
                break
            }
            case 'brigadier:string': {
                canBeParsed = new BrigadierStringParser(properties.type).canParse(splited, index)
                break
            }
            default:
                throw `Unknown parser: '${parser}'.`
        }

        return canBeParsed
    }
}
