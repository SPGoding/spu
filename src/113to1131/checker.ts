export default class Checker {
    public static isArgumentMatch(cmdArg: string, spusArg: string) {
        if (spusArg.charAt(0) === '%') {
            switch (spusArg.slice(1)) {
                case 'entity':
                    throw `qwq`
                case 'string':
                    return true
                default:
                    throw `Unknown argument type: ${spusArg.slice(1)}`
            }
        } else {
            return cmdArg === spusArg
        }
    }
}