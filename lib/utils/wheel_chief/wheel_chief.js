"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WheelChief {
    static update(input, rootNode, parser, updater, executor) {
        const slash = input.charAt(0) === '/';
        if (slash) {
            input = input.slice(1);
        }
        const command = WheelChief.parseCmdNode({
            command: {
                args: [],
                spuScript: '',
                warning: ''
            },
            index: 0,
            splited: input.split(' ')
        }, 'N/A', rootNode, rootNode, parser).command;
        let ans = '';
        for (const arg of command.args) {
            if (arg.updater) {
                arg.value = updater.upArgument(arg.value, arg.updater);
            }
        }
        if (command.spuScript) {
            ans = executor.execute(command.spuScript, command.args);
        }
        else {
            for (const argument of command.args) {
                ans += `${argument.value} `;
            }
            ans = ans.slice(0, -1);
        }
        if (slash) {
            ans = `/${ans}`;
        }
        return { command: ans, warnings: [command.warning] };
    }
    static parseCmdNode(input, nodeName, node, rootNode, parser) {
        let result = {
            command: { args: input.command.args.slice(0), spuScript: input.command.spuScript, warning: input.command.warning },
            index: input.index,
            splited: input.splited.slice(0)
        };
        if (node.type === 'root') {
            if (node.children) {
                if (node.children[input.splited[input.index]]) {
                    result.command.args.push({ value: input.splited[input.index] });
                    result.index += 1;
                    result = WheelChief.recurse(result, input, node.children[input.splited[input.index]], rootNode, parser);
                }
                else {
                    throw `Unknown command: '${input.splited[input.index]}'.`;
                }
            }
            else {
                throw `Expected 'children' for the root node.`;
            }
        }
        else if (node.type === 'literal') {
            if (nodeName === input.splited[input.index]) {
                if (node.updater) {
                    result.command.args.push({ value: nodeName, updater: node.updater });
                }
                else {
                    result.command.args.push({ value: nodeName });
                }
                result.index += 1;
                result = WheelChief.recurse(result, input, node, rootNode, parser);
            }
            else {
                throw `Expected literal '${nodeName}' but got '${input.splited[input.index]}'.`;
            }
        }
        else if (node.type === 'argument') {
            if (node.parser) {
                try {
                    let canBeParsed = parser.parseArgument(node.parser, input.splited, input.index, node.properties);
                    result.command.args.push({
                        value: input.splited.slice(input.index, input.index + canBeParsed).join(' '),
                        updater: node.updater ? node.updater : node.parser
                    });
                    result.index += canBeParsed;
                }
                catch (e) {
                    throw `Parser '${node.parser}' failed to parse '${input.splited.slice(input.index).join(' ')}': ${e}`;
                }
                result = WheelChief.recurse(result, input, node, rootNode, parser);
            }
            else {
                throw `Expected 'parser' for the argument node.`;
            }
        }
        else {
            throw `Unknown type: '${node.type}'. Can be one of the following values: 'root', 'literal' and 'argument'.`;
        }
        return result;
    }
    static recurse(result, input, node, rootNode, parser) {
        if (result.index >= input.splited.length) {
            if (node.executable) {
                if (node.spu_script) {
                    result.command.spuScript = node.spu_script;
                }
                if (node.warning) {
                    result.command.warning = node.warning;
                }
            }
            else {
                throw `Expected executable command but got EOF.`;
            }
        }
        else {
            if (node.children) {
                result = WheelChief.parseChildren(node.children, result, rootNode, parser);
            }
            else if (node.redirect) {
                if (rootNode.children) {
                    let children = rootNode.children[node.redirect[0]].children;
                    if (children) {
                        result = WheelChief.parseChildren(children, result, rootNode, parser);
                    }
                    else {
                        throw `Expected redirect node: '${node.redirect[0]}' but got nothing.`;
                    }
                }
                else {
                    throw `Expected 'children' for the root node.`;
                }
            }
            else if (node.executable === true) {
                throw `Expected EOF but got trailing data.`;
            }
            else {
                if (rootNode.children) {
                    result = WheelChief.parseChildren(rootNode.children, result, rootNode, parser);
                }
                else {
                    throw `Expected 'children' for the root node.`;
                }
            }
        }
        return result;
    }
    static parseChildren(children, result, rootNode, parser) {
        let operated = false;
        let exception = [];
        for (const name in children) {
            if (children.hasOwnProperty(name)) {
                const child = children[name];
                try {
                    result = WheelChief.parseCmdNode(result, name, child, rootNode, parser);
                    operated = true;
                    break;
                }
                catch (e) {
                    exception.push(e.replace(/Failed to parse '.*': \<br \/\>/g, ''));
                    continue;
                }
            }
        }
        if (!operated) {
            throw `Failed to parse '${result.splited.join(' ')}': <br />${exception.join('<br />')}`;
        }
        return result;
    }
}
exports.WheelChief = WheelChief;
//# sourceMappingURL=wheel_chief.js.map