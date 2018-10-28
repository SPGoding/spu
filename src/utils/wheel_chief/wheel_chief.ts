import { BrigadierBoolParser, BrigadierLiteralParser } from './argument_parsers'

export interface CommandsNode {
    type: 'root' | 'literal' | 'argument'
    children?: {
        [nodeName: string]: CommandsNode
    }
    parser?: string
    properties?: {
        [propertyName: string]: string
    }
    executable?: boolean
    redirect?: string
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
export default class WheelChief {
    public static update(command: string, nodes: CommandsNode) {
        let slash = command.slice(0, 1) === '/'
        if (slash) {
            command = command.slice(1)
        }
    }

    private static parseNode(
        input: ParseResult,
        nodeName: string,
        nodes: CommandsNode,
        rootNode: CommandsNode
    ): ParseResult {
        let result: ParseResult = {
            command: { args: input.command.args.slice(0), spuScript: input.command.spuScript },
            index: input.index,
            splited: input.splited.slice(0)
        }
        if (nodes.type === 'root') {
            if (nodes.children) {
                for (const name in nodes.children) {
                    if (nodes.children.hasOwnProperty(name)) {
                        const child = nodes.children[name]
                        try {
                            result = this.parseNode(result, name, child, rootNode)
                        } catch {
                            continue
                        }
                    }
                }
            } else {
                throw `Expected 'children' for the root node.`
            }
        } else if (nodes.type === 'literal') {
            if (nodeName === input.splited[input.index]) {
                result.command.args.push(nodeName)
                result.index += 1
                if (result.index >= input.splited.length) {
                    if (nodes.executable) {
                        if (nodes.spu_script) {
                            result.command.spuScript = nodes.spu_script
                        }
                    } else {
                        throw `Expected executable command.`
                    }
                } else {
                    if (nodes.children) {
                        let operated = false
                        for (const name in nodes.children) {
                            if (nodes.children.hasOwnProperty(name)) {
                                const child = nodes.children[name]
                                try {
                                    result = WheelChief.parseNode(result, name, child, rootNode)
                                    operated = true
                                } catch {
                                    continue
                                }
                            }
                        }
                        if (!operated) {
                            throw `Can't match.`
                        }
                    } else {
                        throw `Expected 'EndOfCommand'.`
                    }
                }
            } else {
                throw `Expected literal '${nodeName}' but get '${input.splited[input.index]}'.`
            }
        } else if (nodes.type === 'argument') {
            if (nodes.parser) {
                let canBeParsed = WheelChief.canBeParsed(input.splited[input.index], nodes.parser, nodes.properties)
            } else {
                throw `Expected 'parser' for the argument node.`
            }
        } else {
            throw `Unknown type: '${nodes.type}'. Can be one of the following values: 'root', 'literal' and 'argument'.`
        }
        return result
    }

    public static canBeParsed(
        value: string,
        parser: string,
        properties:
            | {
                  [propertyName: string]: string
              }
            | undefined
    ) {}
}
