import { SpuScriptExecutor, WheelChief } from "../utils/wheel_chief/wheel_chief";
import { Commands113 } from "./commands";

export class SpuScriptExecutor113To114 implements SpuScriptExecutor {
    public execute(script: string, args: string[]): string {
        let splited = script.split(' ')

        for (let i = 0; i < splited.length; i++) {
            if (splited[i].slice(0, 1) === '%') {
                splited[i] = args[parseInt(splited[i].slice(1))]
            } else if (splited[i].slice(0, 1) === '$') {
                let params = splited[i].slice(1).split('%')
                switch (params[0]) {
                    case 'toTick':
                        splited[i] = `${args[parseInt(params[1])]}t`
                        break
                    default:
                        throw `Unexpected script method: '${params[0]}'.`
                }
            }
        }

        return splited.join(' ')
    }
}

export default class Updater113To114 {
    public static upLine(input: string) {
        return WheelChief.update(input, Commands113.commands,
            new SpuScriptExecutor113To114())
    }
}