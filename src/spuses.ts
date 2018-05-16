/**
 * Providing a map storing old spus and new spus.
 */
export default class Spuses {
    static pairs = new Map([
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
            'execute if entity %0$addAdvancement%1'
        ], [
            'advancement test %entity %string %string',
            'execute if entity %0$addAdvancement%1%2'
        ], [
            'ban %entity',
            'ban %0'
        ], [
            'ban %entity %string',
            'ban %0 %1'
        ], [
            'ban-ip %entity',
            'ban-ip %0'
        ], [
            'ban-ip %entity %string',
            'ban-ip %0 %1'
        ], [
            'ban-ip %string',
            'ban-ip %0'
        ], [
            'ban-ip %string %string',
            'ban-ip %0 %1'
        ], [
            'banlist %string',
            'banlist %0'
        ], [
            'blockdata %position %nbt',
            'data merge block %0 %1'
        ], [
            'clear',
            'clear'
        ], [
            'clear %entity',
            'clear %0'
        ], [
            'clear %entity %item',
            'clear %0 %1'
        ], [
            'clear %entity %itemWithData',
            'clear %0 %1'
        ], [
            'clear %entity %itemWithData %number',
            'clear %0 %1 %2 %'
        ], [
            'clear %entity %itemWithData %number %nbt',
            'clear %0$addNbt%3 %1 %2'
        ]
        ])
}
