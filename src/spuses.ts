/**
 * Providing a map storing old spus and new spus.
 */
export default class Spuses {
    static pairs = new Map([
        ['advancement grant %entity only %adv', 'advancement grant %0 only %1'],
        ['advancement grant %entity only %adv %adv_cri', 'advancement grant %0 only %1 %2'],
        ['advancement revoke %entity only %adv', 'advancement revoke %0 only %1'],
        ['advancement revoke %entity only %adv %adv_cri', 'advancement revoke %0 only %1 %2'],
        ['advancement grant %entity until %adv', 'advancement grant %0 until %1'],
        ['advancement grant %entity from %adv', 'advancement grant %0 from %1'],
        ['advancement grant %entity through %adv', 'advancement grant %0 through %1'],
        ['advancement revoke %entity until %adv', 'advancement revoke %0 until %1'],
        ['advancement revoke %entity from %adv', 'advancement revoke %0 from %1'],
        ['advancement revoke %entity through %adv', 'advancement revoke %0 through %1'],
        ['advancement grant %entity everything', 'advancement grant %0 everything'],
        ['advancement revoke %entity everything', 'advancement revoke %0 everything'],
        ['advancement test %entity %adv', 'execute if entity %0$addAdv%1'],
        ['advancement test %entity %adv %adv_crit', 'execute if entity %0$addAdv%1%2'],
        ['ban %entity', 'ban %0'],
        ['ban %entity %string', 'ban %0 %1'],
        ['ban-ip %entity', 'ban-ip %0'],
        ['ban-ip %entity %string', 'ban-ip %0 %1'],
        ['ban-ip %ip', 'ban-ip %0'],
        ['ban-ip %ip %string', 'ban-ip %0 %1'],
        ['banlist %word', 'banlist %0'],
        ['blockdata %position %nbt', 'data merge block %0 %1'],
        ['clear', 'clear'],
        ['clear %entity', 'clear %0'],
        ['clear %entity %item', 'clear %0 %1'],
        ['clear %entity %item_with_data', 'clear %0 %1'],
        ['clear %entity %item_with_data %num', 'clear %0 %1 %2 %'],
        ['clear %entity %item_with_data %num %nbt', 'clear %0$addNbt%3 %1 %2'],
        ['clone %position %position %position', 'clone %0 %1 %2'],
        ['clone %position %position %position %word', 'clone %0 %1 %2 %3'],
        ['clone %position %position %position %word %word', 'clone %0 %1 %2 %3 %4'],
        ['clone %position %position %position %word %word %block', 'clone %0 %1 %2 %3 %5 %4'],
        [
            'clone %position %position %position %word %word %block_with_data',
            'clone %0 %1 %2 %3 %5 %4'
        ],
        ['debug %word', 'debug %0'],
        ['defaultgamemode %mode', 'defaultgamemode %0'],
        ['deop %entity', 'deop %0'],
        ['difficulty %difficulty', 'difficulty %0'],
        ['effect %entity clear', 'effect clear %0'],
        ['effect %entity %buff', 'effect give %0 %1'],
        ['effect %entity %buff %num', 'effect give %0 %1 %2'],
        ['effect %entity %buff %num %num', 'effect give %0 %1 %2 %3'],
        ['effect %entity %buff %num %num %bool', 'effect give %0 %1 %2 %3 %4'],
        ['enchant %entity %ench', 'enchant %0 %1'],
        ['enchant %entity %ench %num', 'enchant %0 %1 %2'],
        ['entitydata %entity %nbt', 'execute as %0 run data merge entity @s %1'],
        ['execute %entity %position %command', 'execute as %0 at @s positioned %1 run %2'],
        [
            'execute %entity %position detect %position %block_with_data %command',
            'execute as %0 at @s positioned %1 if block %2 %3 run %4'
        ],
        [
            // TODO: fill
            '',
            ''
        ],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', '']
    ])
}
