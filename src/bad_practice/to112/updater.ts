import Spuses from "./mappings/spuses";
import SpuScript from "../spu_script";
import ArgumentReader from "../utils/argument_reader";
import Checker from "./checker";
import { getNbtCompound, UpdateResult } from "../../utils/utils";
import { UpdaterTo111 } from "../to111/updater";

export class UpdaterTo112 {
    /**
Returns an result map from an 1.12 command and an 1.12 spus.
@param cmd An 1.12 minecraft command.
@param spus An 1.12 spus defined in spuses.ts.
@returns NULLABLE. A map filled with converted value.
@example {'%n': 'converted value'}.
     */
    public static getResultMap(cmd: string, spus: string) {
        let spusReader = new ArgumentReader(spus)
        let spusArg = spusReader.next()
        let cmdSplited = cmd.split(' ')
        let begin: number = 0
        let end: number = cmdSplited.length
        let cmdArg = cmdSplited.slice(begin, end).join(' ')
        let map = new Map<string, string>()
        let cnt = 0
        while (spusArg !== '' && begin < cmdSplited.length) {
            while (!Checker.isArgumentMatch(cmdArg, spusArg)) {
                if (cmdArg !== '') {
                    end -= 1
                    cmdArg = cmdSplited.slice(begin, end).join(' ')
                } else {
                    // The cmdArg has sliced to ''.
                    // Still can't match.
                    return null
                }
            }

            begin = end
            end = cmdSplited.length

            if (spusArg[0] === '%') {
                map.set(`%${cnt++}`, UpdaterTo112.upArgument(cmdArg, spusArg))
            }
            spusArg = spusReader.next()
            cmdArg = cmdSplited.slice(begin, end).join(' ')
        }
        if (cmdArg === '' && spusArg === '') {
            // Match successfully.
            return map
        } else {
            return null
        }
    }

    public static upLine(input: string, from: string): UpdateResult {
        const ans: UpdateResult = { command: input, warnings: []}

        if (['18', '19'].indexOf(from) !== -1) {
            const result = UpdaterTo111.upLine(ans.command, from)
            ans.command = result.command
            ans.warnings = result.warnings
        } else if (from !== '111') {
            throw `Expected from version: '18', '19' or '111' but got '${from}'.`
        }

        ans.command = UpdaterTo112.upCommand(ans.command)

        if (ans.command.indexOf(' !> ') !== -1) {
            ans.warnings.push(ans.command.split(' !> ').slice(-1)[0])
            ans.command = ans.command.split(' !> ').slice(0, -1).join(' !> ')
        }

        return ans
    }

    private static upCommand(input: string) {
        let slash = false

        if (input.slice(0, 1) === '/') {
            input = input.slice(1)
            slash = true
        }

        for (const spusOld of Spuses.pairs.keys()) {
            let map = UpdaterTo112.getResultMap(input, spusOld)
            if (map) {
                let spusNew = Spuses.pairs.get(spusOld)
                if (spusNew) {
                    let spus = new SpuScript(spusNew)
                    let result = spus.compileWith(map)
                    if (slash) {
                        result = `/${result}`
                    }
                    return result
                }
            }
        }

        throw `Unknown command: ${input}`
    }

    private static upArgument(arg: string, spus: string) {
        switch (spus.slice(1)) {
            case 'block_nbt':
                return getNbtCompound(arg, 'before 1.12').toString()
            case 'bool':
                return arg
            case 'command':
                return UpdaterTo112.upCommand(arg)
            case 'entity':
                return arg
            case 'entity_nbt':
                return getNbtCompound(arg, 'before 1.12').toString()
            case 'entity_type':
                return arg
            case 'item_nbt':
                return getNbtCompound(arg, 'before 1.12').toString()
            case 'item_tag_nbt':
                return getNbtCompound(arg, 'before 1.12').toString()
            case 'json':
                return arg
            case 'literal':
                return arg
            case 'num':
                return arg
            case 'num_or_star':
                return arg
            case 'say_string':
                return arg
            case 'string':
                return arg
            case 'vec_2':
                return arg
            case 'vec_3':
                return arg
            case 'word':
                return arg
            default:
                throw `Unknown arg type: '${spus}'`
        }
    }
}