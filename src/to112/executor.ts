import { SpuScriptExecutor, Argument } from '../utils/wheel_chief/wheel_chief'

export class SpuScriptExecutor111To112 implements SpuScriptExecutor {
    public execute(script: string, args: Argument[]) {
        const splited = script.split(' ')
        for (let i = 0; i < splited.length; i++) {
            if (splited[i].slice(0, 1) === '%') {
                splited[i] = args[parseInt(splited[i].slice(1))].value
            }
            else if (splited[i].slice(0, 1) === '$') {
                const params = splited[i].slice(1).split('%')
                switch (params[0]) {
                    default:
                        throw `Unexpected script method: '${params[0]}'.`
                }
            }
        }
        return splited.join(' ')
    }
}
