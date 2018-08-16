/**
 * Providing a map storing old spus and new spus.
 */
export default class Spuses {
    /**
     * =====TYPES=====
     * %adv
     * %adv_crit
     * %block
     * %block_dust_param
     * %block_metadata_or_state
     * %block_nbt
     * %bool
     * %command
     * %difficulty
     * %effect
     * %ench
     * %entity
     * %entity_nbt
     * %entity_type
     * %func
     * %gamemode
     * %ip
     * %item
     * %item_data
     * %item_dust_params
     * %item_nbt
     * %item_tag_nbt
     * %json
     * %literal
     * %num
     * %num_l
     * %num_or_star
     * %particle
     * %pre_json
     * %recipe
     * %say_string
     * %scb_crit
     * %slot
     * %sound
     * %source
     * %string
     * %team_option
     * %uuid
     * %vec_2
     * %vec_3
     * %word
     *
     * =====FUNCS=====
     * $addAdvToEntity
     * $addDataToItem
     * $addDataAndNbtToItem
     * $addDataOrStateToBlock
     * $addDataOrStateAndNbtToBlock
     * $addNbtToEntity
     * $addScbMaxToEntity
     * $addScbMinToEntity
     * $fuckItemItself
     * $fuckBlockItself
     * $setLimitOfSelector
     */
    static pairs = new Map([
        ['advancement test %entity %adv', 'execute if entity %0$addAdvToEntity%1'],
        ['advancement test %entity %adv %adv_crit', 'execute if entity %0$addAdvToEntity%1%2'],
        ['advancement %literal %entity %literal %adv', 'advancement %0 %1 %2 %3'],
        ['advancement %literal %entity only %adv %adv_crit', 'advancement %0 %1 only %2 %3'],
        ['advancement %literal %entity everything', 'advancement %0 %1 everything'],
        ['ban %word', 'ban %0'],
        ['ban %word %string', 'ban %0 %1'],
        ['ban-ip %word', 'ban-ip %0'],
        ['ban-ip %word %string', 'ban-ip %0 %1'],
        ['ban-ip %ip', 'ban-ip %0'],
        ['ban-ip %ip %string', 'ban-ip %0 %1'],
        ['banlist %literal', 'banlist %0'],
        ['blockdata %vec_3 %block_nbt', 'data merge block %0 %1'],
        ['clear', 'clear'],
        ['clear %entity', 'clear %0'],
        ['clear %entity %item', 'clear %0 %1$fuckItemItself'],
        ['clear %entity %item %item_data', 'clear %0 %1$addDataToItem%2'],
        ['clear %entity %item %item_data %num', 'clear %0 %1$addDataToItem%2 %3'],
        ['clear %entity %item %item_data %num %entity_nbt', 'clear %0 %1$addDataAndNbtToItem%2%4'],
        ['clone %vec_3 %vec_3 %vec_3', 'clone %0 %1 %2'],
        ['clone %vec_3 %vec_3 %vec_3 %literal', 'clone %0 %1 %2 %3'],
        ['clone %vec_3 %vec_3 %vec_3 %literal %literal', 'clone %0 %1 %2 %3 %4'],
        ['clone %vec_3 %vec_3 %vec_3 %literal %literal %block', 'clone %0 %1 %2 %3 %5$fuckBlockItself %4'],
        [
            'clone %vec_3 %vec_3 %vec_3 %literal %literal %block %block_metadata_or_state',
            'clone %0 %1 %2 %3 %5$addDataOrStateToBlock%6 %4'
        ],
        ['debug %literal', 'debug %0'],
        ['defaultgamemode %gamemode', 'defaultgamemode %0'],
        ['deop %word', 'deop %0'],
        ['difficulty %difficulty', 'difficulty %0'],
        ['effect %entity clear', 'effect clear %0'],
        ['effect %entity %effect', 'effect give %0 %1'],
        ['effect %entity %effect %num', 'effect give %0 %1 %2'],
        ['effect %entity %effect %num %num', 'effect give %0 %1 %2 %3'],
        ['effect %entity %effect %num %num %bool', 'effect give %0 %1 %2 %3 %4'],
        ['enchant %entity %ench', 'enchant %0 %1'],
        ['enchant %entity %ench %num', 'enchant %0 %1 %2'],
        ['entitydata %entity %entity_nbt', 'execute as %0 run data merge entity @s %1'],
        ['execute %entity ~ ~ ~ %command', 'execute as %0 at @s run %1'],
        ['execute %entity %vec_3 %command', 'execute as %0 at @s positioned %1 run %2'],
        [
            'execute %entity ~ ~ ~ detect %vec_3 %block %block_metadata_or_state %command',
            'execute as %0 at @s if block %1 %2$addDataOrStateToBlock%3 run %4'
        ],
        [
            'execute %entity %vec_3 detect %vec_3 %block %block_metadata_or_state %command',
            'execute as %0 at @s positioned %1 if block %2 %3$addDataOrStateToBlock%4 run %5'
        ],
        ['fill %vec_3 %vec_3 %block', 'fill %0 %1 %2$fuckBlockItself'],
        ['fill %vec_3 %vec_3 %block %block_metadata_or_state', 'fill %0 %1 %2$addDataOrStateToBlock%3'],
        ['fill %vec_3 %vec_3 %block %block_metadata_or_state %literal', 'fill %0 %1 %2$addDataOrStateToBlock%3 %4'],
        [
            'fill %vec_3 %vec_3 %block %block_metadata_or_state %literal %block_nbt',
            'fill %0 %1 %2$addDataOrStateAndNbtToBlock%3%5 %4'
        ],
        [
            'fill %vec_3 %vec_3 %block %block_metadata_or_state replace %block',
            'fill %0 %1 %2$addDataOrStateToBlock%3 replace %4'
        ],
        [
            'fill %vec_3 %vec_3 %block %block_metadata_or_state replace %block %block_metadata_or_state',
            'fill %0 %1 %2$addDataOrStateToBlock%3 replace %4$addDataOrStateToBlock%5'
        ],
        ['function %func', 'function %0'],
        ['function %func %literal %entity', 'execute %1 entity %2 run function %0'],
        ['gamemode %gamemode', 'gamemode %0'],
        ['gamemode %gamemode %entity', 'gamemode %0 %1'],
        ['gamerule %word', 'gamerule %0'],
        [
            'gamerule gameLoopFunction %func',
            "# gamerule gameLoopFunction %0 !>Please add function %0 to function tag '#minecraft:tick'."
        ],
        ['gamerule %word %word', 'gamerule %0 %1'],
        ['give %entity %item', 'give %0 %1$fuckItemItself'],
        ['give %entity %item %num', 'give %0 %1$fuckItemItself %2'],
        ['give %entity %item %num %item_data', 'give %0 %1$addDataToItem%3 %2'],
        ['give %entity %item %num %item_data %item_tag_nbt', 'give %0 %1$addDataAndNbtToItem%3%4 %2'],
        ['kick %word', 'kick %0'],
        ['kick %word %string', 'kick %0 %1'],
        ['kill', 'kill @s'],
        ['kill %entity', 'kill %0'],
        ['list', 'list'],
        ['list %uuid', 'list %0'],
        ['locate Temple', 'locate Desert_Pyramid\nlocate Igloo\nlocate Jungle_Pyramid\nlocate Swamp_hut'],
        ['locate %word', 'locate %0'],
        ['me %string', 'me %0'],
        ['op %word', 'op %0'],
        ['pardon %word', 'pardon %0'],
        ['pardon-ip %ip', 'pardon-ip %0'],
        ['particle %particle %vec_3 %vec_3 %num', 'particle %0 %1 %2 %3'],
        ['particle %particle %vec_3 %vec_3 %num %num', 'particle %0 %1 %2 %3 %4'],
        ['particle %particle %vec_3 %vec_3 %num %num %literal', 'particle %0 %1 %2 %3 %4 %5'],
        ['particle %particle %vec_3 %vec_3 %num %num %literal %entity', 'particle %0 %1 %2 %3 %4 %5 %6'],
        [
            'particle %particle %vec_3 %vec_3 %num %num %literal %entity %block_dust_param',
            'particle %0 %7 %1 %2 %3 %4 %5 %6'
        ],
        [
            'particle %particle %vec_3 %vec_3 %num %num %literal %entity %item_dust_params',
            'particle %0 %7 %1 %2 %3 %4 %5 %6'
        ],
        ['playsound %sound %source %entity', 'playsound %0 %1 %2'],
        ['playsound %sound %source %entity %vec_3', 'playsound %0 %1 %2 %3'],
        ['playsound %sound %source %entity %vec_3 %num', 'playsound %0 %1 %2 %3 %4'],
        ['playsound %sound %source %entity %vec_3 %num %num', 'playsound %0 %1 %2 %3 %4 %5'],
        ['playsound %sound %source %entity %vec_3 %num %num %num', 'playsound %0 %1 %2 %3 %4 %5 %6'],
        ['publish', 'publish'],
        ['recipe %literal %recipe', 'recipe %0 %1'],
        ['recipe %literal %entity %recipe', 'recipe %0 %1 %2'],
        ['reload', 'reload'],
        ['replaceitem block %vec_3 %slot %item', 'replaceitem block %0 %1 %2$fuckItemItself'],
        ['replaceitem block %vec_3 %slot %item %num', 'replaceitem block %0 %1 %2$fuckItemItself %3'],
        ['replaceitem block %vec_3 %slot %item %num %item_data', 'replaceitem block %0 %1 %2$addDataToItem%4 %3'],
        [
            'replaceitem block %vec_3 %slot %item %num %item_data %item_tag_nbt',
            'replaceitem block %0 %1 %2$addDataAndNbtToItem%4%5 %3'
        ],
        ['replaceitem entity %entity %slot %item', 'replaceitem block %0 %1 %2$fuckItemItself'],
        ['replaceitem entity %entity %slot %item %num', 'replaceitem block %0 %1 %2$fuckItemItself %3'],
        ['replaceitem entity %entity %slot %item %num %item_data', 'replaceitem block %0 %1 %2$addDataToItem%4 %3'],
        [
            'replaceitem entity %entity %slot %item %num %item_data %item_tag_nbt',
            'replaceitem block %0 %1 %2$addDataAndNbtToItem%4%5 %3'
        ],
        ['save-all', 'save-all'],
        ['save-all %literal', 'save-all %0'],
        ['save-off', 'save-off'],
        ['save-on', 'save-on'],
        ['say %say_string', 'say %0'],
        ['scoreboard objectives list', 'scoreboard objectives list'],
        ['scoreboard objectives add %word %scb_crit', 'scoreboard objectives add %0 %1'],
        ['scoreboard objectives add %word %scb_crit %pre_json', 'scoreboard objectives add %0 %1 %2'],
        ['scoreboard objectives remove %word', 'scoreboard objectives remove %0'],
        ['scoreboard objectives setdisplay %word', 'scoreboard objectives setdisplay %0'],
        ['scoreboard objectives setdisplay %word %word', 'scoreboard objectives setdisplay %0 %1'],
        ['scoreboard players %literal', 'scoreboard players %0'],
        ['scoreboard players %literal %entity', 'scoreboard players %0 %1'],
        ['scoreboard players %literal %entity %word', 'scoreboard players %0 %1 %2'],
        ['scoreboard players test %entity %word %num', 'execute if entity %0$addScbMinToEntity%1%2'],
        [
            'scoreboard players test %entity %word %num_or_star %num_or_star',
            'execute if entity %0$addScbMinToEntity%1%2$addScbMaxToEntity%1%3'
        ],
        [   
            'scoreboard players operation %entity %word %word %entity %word', 
            'scoreboard players operation %0 %1 %2 %3 %4'
        ],
        ['scoreboard players %literal %entity %word %num', 'scoreboard players %0 %1 %2 %3'],
        [
            'scoreboard players %literal %entity %word %num %entity_nbt',
            'scoreboard players %0 %1$addNbtToEntity%4 %2 %3'
        ],
        ['scoreboard players tag %entity list', 'tag %0 list'],
        ['scoreboard players tag %entity %literal %word', 'tag %0 %1 %2'],
        ['scoreboard players tag %entity %literal %word %entity_nbt', 'tag %0$addNbtToEntity%3 %1 %2'],
        ['scoreboard teams list', 'team list'],
        ['scoreboard teams list %word', 'team list %0'],
        ['scoreboard teams add %word', 'team add %0'],
        ['scoreboard teams add %word %pre_json', 'team add %0 %1'],
        ['scoreboard teams remove %word', 'team remove %0'],
        ['scoreboard teams empty %word', 'team empty %0'],
        ['scoreboard teams join %word', 'team join %0'],
        ['scoreboard teams join %word %entity', 'team join %0 %1'],
        ['scoreboard teams leave', 'team leave'],
        ['scoreboard teams leave %entity', 'team leave %0'],
        ['scoreboard teams option %word %team_option %word', 'team modify %0 %1 %2'],
        ['seed', 'seed'],
        ['setblock %vec_3 %block', 'setblock %0 %1$fuckBlockItself'],
        ['setblock %vec_3 %block %block_metadata_or_state', 'setblock %0 %1$addDataOrStateToBlock%2'],
        ['setblock %vec_3 %block %block_metadata_or_state %literal', 'setblock %0 %1$addDataOrStateToBlock%2 %3'],
        [
            'setblock %vec_3 %block %block_metadata_or_state %literal %block_nbt',
            'setblock %0 %1$addDataOrStateAndNbtToBlock%2%4 %3'
        ],
        ['setidletimeout %num', 'setidletimeout %0'],
        ['setworldspawn', 'setworldspawn'],
        ['setworldspawn %vec_3', 'setworldspawn %0'],
        ['spawnpoint', 'spawnpoint'],
        ['spawnpoint %entity', 'spawnpoint %0'],
        ['spawnpoint %entity %vec_3', 'spawnpoint %0 %1'],
        ['spreadplayers %vec_2 %num %num %bool %entity', 'spreadplayers %0 %1 %2 %3 %4'],
        ['stats %string', "# stat %0 !>Use 'execute store ...'"],
        ['stop', 'stop'],
        ['stopsound %entity', 'stopsound %0'],
        ['stopsound %entity %source', 'stopsound %0 %1'],
        ['stopsound %entity %source %sound', 'stopsound %0 %1 %2'],
        ['summon %entity_type', 'summon %0'],
        ['summon %entity_type %vec_3', 'summon %0 %1'],
        ['summon %entity_type %vec_3 %entity_nbt', 'summon %0 %1 %2'],
        ['teleport %entity %vec_3', 'teleport %0 %1'],
        ['teleport %entity %vec_3 %vec_2', 'teleport %0 %1 %2'],
        ['tell %entity %string', 'tell %0 %1'],
        ['msg %entity %string', 'msg %0 %1'],
        ['w %entity %string', 'w %0 %1'],
        ['tellraw %entity %json', 'tellraw %0 %1'],
        ['testfor %entity', 'execute if entity %0'],
        ['testfor %entity %entity_nbt', 'execute if entity %0$addNbtToEntity%1'],
        ['testforblock %vec_3 %block', 'execute if block %0 %1$fuckBlockItself'],
        ['testforblock %vec_3 %block %block_metadata_or_state', 'execute if block %0 %1$addDataOrStateToBlock%2'],
        [
            'testforblock %vec_3 %block %block_metadata_or_state %block_nbt',
            'execute if block %0 %1$addDataOrStateAndNbtToBlock%2%3'
        ],
        ['testforblocks %vec_3 %vec_3 %vec_3', 'execute if blocks %0 %1 %2 all'],
        ['testforblocks %vec_3 %vec_3 %vec_3 %literal', 'execute if blocks %0 %1 %2 %3'],
        ['time %literal %word', 'time %0 %1'],
        ['title %entity %word', 'title %0 %1'],
        ['title %entity %word %json', 'title %0 %1 %2'],
        ['title %entity times %num %num %num', 'title %0 times %1 %2 %3'],
        [
            'toggledownfall',
            "weather clear !>'Toggledownfall' could toggle the weather, but 'weather clear' can only set the weather to clear."
        ],
        ['tp %entity', 'teleport %0'],
        ['tp %entity %entity', 'teleport %0 %1$setLimitOfSelector'],
        ['tp %vec_3', 'teleport %0'],
        ['tp %entity %vec_3', 'execute as %0 at @s run teleport @s %1'],
        ['tp %entity %vec_3 %vec_2', 'execute as %0 at @s run teleport @s %1 %2'],
        ['trigger %word %literal %num', 'trigger %0 %1 %2'],
        ['weather %literal', 'weather %0'],
        ['weather %literal %num', 'weather %0 %1'],
        ['whitelist %literal', 'whitelist %0'],
        ['whitelist %literal %entity', 'whitelist %0 %1'],
        ['worldborder add %num', 'worldborder add %0'],
        ['worldborder add %num %num', 'worldborder add %0 %1'],
        ['worldborder center %vec_2', 'worldborder center %0'],
        ['worldborder damage %literal %num', 'worldborder damage %0 %1'],
        ['worldborder get', 'worldborder get'],
        ['worldborder set %num', 'worldborder set %0'],
        ['worldborder set %num %num', 'worldborder set %0 %1'],
        ['worldborder warning %literal %num', 'worldborder warning %0 %1'],
        ['xp %num', 'experience add @s %0 points'],
        ['xp %num %entity', 'experience add %1 %0 points'],
        ['xp %num_l', 'experience add @s %0 levels'],
        ['xp %num_l %entity', 'experience add %1 %0 levels']
    ])
}
