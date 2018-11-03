import {
    BrigadierBoolParser,
    MinecraftColumnPosParser,
    BrigadierDoubleParser,
    BrigadierFloatParser,
    BrigadierIntegerParser,
    BrigadierStringParser,
    MinecraftBlockPosParser,
    MinecraftBlockPredicateParser,
    MinecraftBlockStateParser,
    MinecraftColorParser,
    MinecraftComponentParser,
    MinecraftEntityParser,
    MinecraftEntityAnchorParser,
    MinecraftEntitySummonParser,
    MinecraftFunctionParser,
    MinecraftGameProfileParser,
    MinecraftItemEnchantmentParser,
    MinecraftItemPredicateParser,
    MinecraftItemSlotParser,
    MinecraftItemStackParser,
    MinecraftMessageParser,
    MinecraftMobEffectParser,
    MinecraftNbtParser,
    MinecraftNbtPathParser,
    MinecraftObjectiveParser,
    MinecraftIntRangeParser,
    MinecraftObjectiveCriteriaParser,
    MinecraftOperationParser,
    MinecraftParticleParser,
    MinecraftResourceLocationParser,
    MinecraftRotationParser,
    MinecraftScoreHolderParser,
    MinecraftScoreboardSlotParser,
    MinecraftSwizzleParser,
    MinecraftTeamParser,
    MinecraftVec2Parser,
    MinecraftVec3Parser
} from './argument_parsers'
import { isWhiteSpace } from '../utils'
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
}

export interface Command {
    args: Argument[]
    spuScript: string
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
    public static update(input: string, rootNode: CmdNode, executor: SpuScriptExecutor, updater: Updater) {
        if (input.charAt(0) === '#' || isWhiteSpace(input)) {
            return input
        }

        const slash = input.charAt(0) === '/'
        if (slash) {
            input = input.slice(1)
        }

        // 把输入的命令解析为 `Command`
        const command = WheelChief.parseCmdNode(
            {
                command: {
                    args: [],
                    spuScript: ''
                },
                index: 0,
                splited: input.split(' ')
            },
            'N/A',
            rootNode,
            rootNode
        ).command

        let result = ''

        // 对参数根据 updater/parser 进行升级
        for (const arg of command.args) {
            if (arg.updater) {
                arg.value = updater.upArgument(arg.value, arg.updater)
            }
        }

        // 最后执行针对整条命令的 spu script 以调整命令语序以及其他内容
        if (command.spuScript) {
            result = executor.execute(command.spuScript, command.args)
        } else {
            for (const argument of command.args) {
                result += `${argument.value} `
            }
            result = result.slice(0, -1)
        }

        if (slash) {
            result = `/${result}`
        }

        return result
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
                if (node.children[input.splited[input.index]]) {
                    result.command.args.push({ value: input.splited[input.index] })
                    result.index += 1
                    result = WheelChief.recurse(result, input, node.children[input.splited[input.index]], rootNode)
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
                result = WheelChief.recurse(result, input, node, rootNode)
            } else {
                throw `Expected literal '${nodeName}' but got '${input.splited[input.index]}'.`
            }
        } else if (node.type === 'argument') {
            if (node.parser) {
                let canBeParsed = WheelChief.canBeParsed(input.splited, input.index, node.parser, node.properties)
                if (canBeParsed === 0) {
                    throw `Parser '${node.parser}' failed to parse '${input.splited.slice(input.index).join(' ')}'.`
                } else {
                    result.command.args.push({
                        value: input.splited.slice(input.index, input.index + canBeParsed).join(' '),
                        updater: node.updater ? node.updater : node.parser
                    })
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
            } else {
                throw `Expected executable command but got EOF.`
            }
        } else {
            if (node.children) {
                result = WheelChief.parseChildren(node.children, result, rootNode)
            } else if (node.redirect) {
                if (rootNode.children) {
                    let children = rootNode.children[node.redirect[0]].children
                    if (children) {
                        result = WheelChief.parseChildren(children, result, rootNode)
                    } else {
                        throw `Expected redirect node: '${node.redirect[0]}' but got nothing.`
                    }
                } else {
                    throw `Expected 'children' for the root node.`
                }
            } else {
                if (rootNode.children) {
                    result = WheelChief.parseChildren(rootNode.children, result, rootNode)
                } else {
                    throw `Expected 'children' for the root node.`
                }
            }
        }
        return result
    }

    /**
     * 尝试解析按一整个 `children` 解析。
     * @param children `children`。
     * @param result 输出（可被直接舍弃，不对原输入造成影响）。
     * @param rootNode 根节点。
     */
    private static parseChildren(children: Children, result: ParseResult, rootNode: CmdNode) {
        let operated = false
        let exception: string[] = []
        for (const name in children) {
            if (children.hasOwnProperty(name)) {
                const child = children[name]
                try {
                    result = WheelChief.parseCmdNode(result, name, child, rootNode)
                    operated = true
                    break
                } catch (e) {
                    exception.push(e.replace(/Can't match: \<br \/\>/g, ''))
                    continue
                }
            }
        }
        if (!operated) {
            throw `Can't match: <br />${exception.join('<br />')}`
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
            case 'minecraft:block_pos': {
                canBeParsed = new MinecraftBlockPosParser().canParse(splited, index)
                break
            }
            case 'minecraft:block_predicate': {
                canBeParsed = new MinecraftBlockPredicateParser().canParse(splited, index)
                break
            }
            case 'minecraft:block_state': {
                canBeParsed = new MinecraftBlockStateParser().canParse(splited, index)
                break
            }
            case 'minecraft:color': {
                canBeParsed = new MinecraftColorParser().canParse(splited, index)
                break
            }
            case 'minecraft:column_pos': {
                canBeParsed = new MinecraftColumnPosParser().canParse(splited, index)
                break
            }
            case 'minecraft:component': {
                canBeParsed = new MinecraftComponentParser().canParse(splited, index)
                break
            }
            case 'minecraft:entity': {
                canBeParsed = new MinecraftEntityParser(properties.amount, properties.type).canParse(splited, index)
                break
            }
            case 'minecraft:entity_anchor': {
                canBeParsed = new MinecraftEntityAnchorParser().canParse(splited, index)
                break
            }
            case 'minecraft:entity_summon': {
                canBeParsed = new MinecraftEntitySummonParser().canParse(splited, index)
                break
            }
            case 'minecraft:function': {
                canBeParsed = new MinecraftFunctionParser().canParse(splited, index)
                break
            }
            case 'minecraft:game_profile': {
                canBeParsed = new MinecraftGameProfileParser().canParse(splited, index)
                break
            }
            case 'minecraft:int_range': {
                canBeParsed = new MinecraftIntRangeParser().canParse(splited, index)
                break
            }
            case 'minecraft:item_enchantment': {
                canBeParsed = new MinecraftItemEnchantmentParser().canParse(splited, index)
                break
            }
            case 'minecraft:item_predicate': {
                canBeParsed = new MinecraftItemPredicateParser().canParse(splited, index)
                break
            }
            case 'minecraft:item_slot': {
                canBeParsed = new MinecraftItemSlotParser().canParse(splited, index)
                break
            }
            case 'minecraft:item_stack': {
                canBeParsed = new MinecraftItemStackParser().canParse(splited, index)
                break
            }
            case 'minecraft:message': {
                canBeParsed = new MinecraftMessageParser().canParse(splited, index)
                break
            }
            case 'minecraft:mob_effect': {
                canBeParsed = new MinecraftMobEffectParser().canParse(splited, index)
                break
            }
            case 'minecraft:nbt': {
                canBeParsed = new MinecraftNbtParser().canParse(splited, index)
                break
            }
            case 'minecraft:nbt_path': {
                canBeParsed = new MinecraftNbtPathParser().canParse(splited, index)
                break
            }
            case 'minecraft:objective': {
                canBeParsed = new MinecraftObjectiveParser().canParse(splited, index)
                break
            }
            case 'minecraft:objective_criteria': {
                canBeParsed = new MinecraftObjectiveCriteriaParser().canParse(splited, index)
                break
            }
            case 'minecraft:operation': {
                canBeParsed = new MinecraftOperationParser().canParse(splited, index)
                break
            }
            case 'minecraft:particle': {
                canBeParsed = new MinecraftParticleParser().canParse(splited, index)
                break
            }
            case 'minecraft:resource_location': {
                canBeParsed = new MinecraftResourceLocationParser().canParse(splited, index)
                break
            }
            case 'minecraft:rotation': {
                canBeParsed = new MinecraftRotationParser().canParse(splited, index)
                break
            }
            case 'minecraft:score_holder': {
                canBeParsed = new MinecraftScoreHolderParser(properties.amount).canParse(splited, index)
                break
            }
            case 'minecraft:scoreboard_slot': {
                canBeParsed = new MinecraftScoreboardSlotParser().canParse(splited, index)
                break
            }
            case 'minecraft:swizzle': {
                canBeParsed = new MinecraftSwizzleParser().canParse(splited, index)
                break
            }
            case 'minecraft:team': {
                canBeParsed = new MinecraftTeamParser().canParse(splited, index)
                break
            }
            case 'minecraft:vec2': {
                canBeParsed = new MinecraftVec2Parser().canParse(splited, index)
                break
            }
            case 'minecraft:vec3': {
                canBeParsed = new MinecraftVec3Parser().canParse(splited, index)
                break
            }
            default:
                throw `Unknown parser: '${parser}'.`
        }

        return canBeParsed
    }
}
