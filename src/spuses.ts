/**
 * Store a map providing old command spus and new command spus.
 */
export default class Spus {
    static spuses = new Map([
        [
            'advancement grant %entity only %string',
            'advancement grant %0 only %1'
        ], [
            'advancement grant %entity only %string %string',
            'advancement grant %0 only %1 %2'
        ], [
            'advancement revoke %entity only %string',
            'advancement revoke %0 only %1'
        ], [
            'advancement revoke %entity only %string %string',
            'advancement revoke %0 only %1 %2'
        ], [
            'advancement grant %entity until %string',
            'advancement grant %0 until %1'
        ], [
            'advancement grant %entity from %string',
            'advancement grant %0 from %1'
        ], [
            'advancement grant %entity through %string',
            'advancement grant %0 through %1'
        ], [
            'advancement revoke %entity until %string',
            'advancement revoke %0 until %1'
        ], [
            'advancement revoke %entity from %string',
            'advancement revoke %0 from %1'
        ], [
            'advancement revoke %entity through %string',
            'advancement revoke %0 through %1'
        ], [
            'advancement grant %entity everything',
            'advancement grant %0 everything'
        ], [
            'advancement revoke %entity everything',
            'advancement revoke %0 everything'
        ], [
            'advancement test %entity %string',
            'execute if entity %0$adv%1'
        ], [
            'advancement test %entity %string %string',
            'execute if entity %0$adv%1%2'
        ]
        ])
    
    private static isArgumentMatch(cmdArg: string, spusArg: string) {
        if (spusArg.charAt(0) === '%') {
            switch (spusArg.slice(1)) {
                case 'entity':
                    return Spus.isEntity(cmdArg)
                case 'string':
                    return Spus.isString(cmdArg)
                case 'number':
                    return Spus.isNumber(cmdArg)
                case 'selector':
                    return Spus.isTargetSelector(cmdArg)
                case 'uuid':
                    return Spus.isUuid(cmdArg)
                default:
                    throw `Unknown argument type: ${spusArg.slice(1)}`
                // TODO
            }
        } else {
            return cmdArg === spusArg
        }
    }

    private static isEntity(input: string) {
        return Spus.isTargetSelector(input) || Spus.isString(input) || Spus.isUuid(input)
    }

    private static isString(input: string) {
        return /^\w*$/.test(input)
    }

    private static isUuid(input: string) {
        return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/.test(input)
    }

    private static isNumber(input: string) {
        return /^[+-]?[0-9]+\.?[0-9]*$/.test(input)
    }

    private static isTargetSelector(input: string) {
        return Spus.TargetSelector.isValid(input)
    }
}
