import { BrigadierBoolParser, BrigadierLiteralParser } from "./argument_parsers";

export interface CommandsNode {
    type: 'root' | 'literal' | 'argument'
    children?: {
        [nodeName: string]: CommandsNode
    }
    parser?: string
    properties?: object
    executable?: boolean
    redirect?: string[]
}

export interface Command {
    nodes: Node[]
    spuScript: string
}

export interface Node {
    name: string
    value: string
    parser: string
    deltaIndex: number
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

    private static parseNode(args: string[], argIndex: number, nodeName: string, nodes: CommandsNode): object {
        if (nodes.type === 'root') {
            if (nodes.children) {
                for (const name in nodes.children) {
                    if (nodes.children.hasOwnProperty(name)) {
                        const child = nodes.children[name]
                        return this.parseNode(args, argIndex, name, child)
                    }
                }
                throw ''
            } else {
                throw `Expected 'children' for root node.`
            }
        } else if (nodes.type === 'literal') {
            if (nodeName === args[argIndex]) {
                return { argIndex: argIndex++ }
            } else {
                throw ''
            }
        } else {
            throw ''
        }
    }

    public canBeParsed(parser: string, value: string) {

    }
}