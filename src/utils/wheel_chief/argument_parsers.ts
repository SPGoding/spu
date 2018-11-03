import { isNumeric, getNbtCompound } from '../utils'
import { BlockState } from '../block_state';
import { TargetSelector } from '../target_selector';
import { ItemStack } from '../item_stack';

const ResourceLocation = /^(\w+:)?[\w\.]+$/
const BlockStateOrItemStack = /^(\w+:)?\w+(\[.*\])?({.*})?$/
const ScoreboardCriteria = /^\w+(\.\w+:\w+\.\w+)?$/
const IntRange = /^(\d*(\.\d*)?)?(\.\.)?(\d*(\.\d*)?)?$/
const Swizzle = /^[xyz]+$/

// The vec regex is coppied from
// https://github.com/pca006132/datapack-helper/blob/master/src/command-node/format.ts
// Dressed pca, I love you!!!
const Vec2 = /^((((~?[+-]?(\d*(\.\d*)?)|\.\d+)|(~))(\s|$)){2})$/
const Vec3 = /^((((~?[+-]?(\d*(\.\d*)?)|\.\d*)|(~))(\s|$)){3}|(\^([+-]?(\d*(\.\d*)?|\.\d*))?(\s|$)){3})$/

/**
 * A brigadier parser.
 */
export interface ArgumentParser {
    canParse(splited: string[], index: number): number
}

/**
 * brigadier:bool
 * @property N/A
 */
export class BrigadierBoolParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (['false', 'true'].indexOf(splited[index]) !== -1) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * brigadier:double
 * @property min
 * @property max
 */
export class BrigadierDoubleParser implements ArgumentParser {
    private min: number | undefined
    private max: number | undefined

    public constructor(min?: number, max?: number) {
        this.min = min
        this.max = max
    }

    public canParse(splited: string[], index: number): number {
        if (
            isNumeric(splited[index]) &&
            (this.min === undefined || parseFloat(splited[index]) >= this.min) &&
            (this.max === undefined || parseFloat(splited[index]) <= this.max)
        ) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * brigadier:float
 * @property min
 * @property max
 */
export class BrigadierFloatParser implements ArgumentParser {
    private min: number | undefined
    private max: number | undefined

    public constructor(min?: number, max?: number) {
        this.min = min
        this.max = max
    }

    public canParse(splited: string[], index: number): number {
        if (
            isNumeric(splited[index]) &&
            (this.min === undefined || parseFloat(splited[index]) >= this.min) &&
            (this.max === undefined || parseFloat(splited[index]) <= this.max)
        ) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * brigadier:integer
 * @property min
 * @property max
 */
export class BrigadierIntegerParser implements ArgumentParser {
    private min: number | undefined
    private max: number | undefined

    public constructor(min?: number, max?: number) {
        this.min = min
        this.max = max
    }

    public canParse(splited: string[], index: number): number {
        if (
            isNumeric(splited[index]) &&
            parseInt(splited[index]) === parseFloat(splited[index]) &&
            (this.min === undefined || parseFloat(splited[index]) >= this.min) &&
            (this.max === undefined || parseFloat(splited[index]) <= this.max)
        ) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * brigadier:string
 * @property type: Can be one of the following values: 'greedy', 'phrase' and 'word'.
 */
export class BrigadierStringParser implements ArgumentParser {
    private type: 'greedy' | 'phrase' | 'word' | undefined

    public constructor(type: 'greedy' | 'phrase' | 'word' = 'word') {
        this.type = type
    }

    public canParse(splited: string[], index: number): number {
        switch (this.type) {
            case 'greedy':
                return splited.length - index
            case 'phrase':
                if (splited[index].slice(0, 1) === '"') {
                    let endIndex: number | undefined
                    for (let i = index; i < splited.length; i++) {
                        const arg = splited[i]
                        if (arg.slice(-1) === '"' && arg.slice(-2, -1) !== '\\') {
                            endIndex = i
                            break
                        }
                    }
                    if (endIndex !== undefined) {
                        return endIndex - index + 1
                    } else {
                        return 0
                    }
                } else {
                    return 1
                }
            case 'word':
            default:
                return 1
        }
    }
}

/**
 * minecraft:block_pos
 * @property N/A
 */
export class MinecraftBlockPosParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (Vec3.test(`${splited[index]} ${splited[index + 1]} ${splited[index + 2]}`)) {
            return 3
        } else {
            return 0
        }
    }
}

/**
 * minecraft:block_predicate
 * @property N/A
 */
export class MinecraftBlockPredicateParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        let join = splited[index]
        try {
            new BlockState(join)
            return 1
        } catch {
            for (let i = index + 1; i < splited.length; i++) {
                join += ' ' + splited[i]
                try {
                    new BlockState(join)
                    return i - index + 1
                } catch {
                    continue
                }
            }
            return 0
        }
    }
}

/**
 * minecraft:block_state
 * @property N/A
 */
export class MinecraftBlockStateParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        let join = splited[index]
        try {
            new BlockState(join)
            return 1
        } catch {
            for (let i = index + 1; i < splited.length; i++) {
                join += ' ' + splited[i]
                try {
                    new BlockState(join)
                    return i - index + 1
                } catch {
                    continue
                }
            }
            return 0
        }
    }
}

/**
 * minecraft:color
 * @property N/A
 */
export class MinecraftColorParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (
            [
                'black',
                'dark_blue',
                'dark_green',
                'dark_aqua',
                'dark_red',
                'dark_purple',
                'gold',
                'gray',
                'dark_gray',
                'blue',
                'green',
                'aqua',
                'red',
                'light_purple',
                'yellow',
                'white'
            ].indexOf(splited[index]) !== -1
        ) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:column_pos
 * @property N/A
 */
export class MinecraftColumnPosParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (Vec2.test(`${splited[index]} ${splited[index + 1]}`)) {
            return 2
        } else {
            return 0
        }
    }
}

/**
 * minecraft:component
 * @property N/A
 */
export class MinecraftComponentParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        try {
            JSON.parse(splited[index])
            return 1
        } catch {
            return 0
        }
    }
}

/**
 * minecraft:entity
 * @property N/A
 */
export class MinecraftEntityParser implements ArgumentParser {
    private amount: 'single' | 'multiple'
    private type: 'players' | 'entities'

    public constructor(amount: 'single' | 'multiple', type: 'players' | 'entities') {
        this.amount = amount
        this.type = type
    }

    public canParse(splited: string[], index: number): number {
        let join = splited[index]

        if (join.charAt(0) !== '@') {
            return 1
        }

        try {
            new TargetSelector(join)
            return 1
        } catch {
            for (let i = index + 1; i < splited.length; i++) {
                join += ' ' + splited[i]
                try {
                    new TargetSelector(join)
                    return i - index + 1
                } catch {
                    continue
                }
            }
            return 0
        }
    }
}

/**
 * minecraft:entity_anchor
 * @property N/A
 */
export class MinecraftEntityAnchorParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (['eyes', 'feet'].indexOf(splited[index]) !== -1) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:entity_summon
 * @property N/A
 */
export class MinecraftEntitySummonParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (ResourceLocation.test(splited[index])) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:function
 * @property N/A
 */
export class MinecraftFunctionParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (ResourceLocation.test(splited[index])) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:game_profile
 * @property N/A
 */
export class MinecraftGameProfileParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        return (new MinecraftEntityParser('multiple', 'players')).canParse(splited, index)
    }
}

/**
 * minecraft:item_enchantment
 * @property N/A
 */
export class MinecraftItemEnchantmentParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (ResourceLocation.test(splited[index])) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:item_predicate
 * @property N/A
 */
export class MinecraftItemPredicateParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        let join = splited[index]
        try {
            new ItemStack(join)
            return 1
        } catch {
            for (let i = index + 1; i < splited.length; i++) {
                join += ' ' + splited[i]
                try {
                    new ItemStack(join)
                    return i - index + 1
                } catch {
                    continue
                }
            }
            return 0
        }
    }
}

/**
 * minecraft:item_slot
 * @property N/A
 */
export class MinecraftItemSlotParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (
            [
                'armor.chest',
                'armor.feet',
                'armor.head',
                'armor.legs',
                'weapon.mainhand',
                'weapon.offhand',
                'container.0',
                'container.1',
                'container.2',
                'container.3',
                'container.4',
                'container.5',
                'container.6',
                'container.7',
                'container.8',
                'container.9',
                'container.10',
                'container.11',
                'container.12',
                'container.13',
                'container.14',
                'container.15',
                'container.16',
                'container.17',
                'container.18',
                'container.19',
                'container.20',
                'container.21',
                'container.22',
                'container.23',
                'container.24',
                'container.25',
                'container.26',
                'container.27',
                'container.28',
                'container.29',
                'container.30',
                'container.31',
                'container.32',
                'container.33',
                'container.34',
                'container.35',
                'container.36',
                'container.37',
                'container.38',
                'container.39',
                'container.40',
                'container.41',
                'container.42',
                'container.43',
                'container.44',
                'container.45',
                'container.46',
                'container.47',
                'container.48',
                'container.49',
                'container.50',
                'container.51',
                'container.52',
                'container.53',
                'enderchest.0',
                'enderchest.1',
                'enderchest.2',
                'enderchest.3',
                'enderchest.4',
                'enderchest.5',
                'enderchest.6',
                'enderchest.7',
                'enderchest.8',
                'enderchest.9',
                'enderchest.10',
                'enderchest.11',
                'enderchest.12',
                'enderchest.13',
                'enderchest.14',
                'enderchest.15',
                'enderchest.16',
                'enderchest.17',
                'enderchest.18',
                'enderchest.19',
                'enderchest.20',
                'enderchest.21',
                'enderchest.22',
                'enderchest.23',
                'enderchest.24',
                'enderchest.25',
                'enderchest.26',
                'inventory.0',
                'inventory.1',
                'inventory.2',
                'inventory.3',
                'inventory.4',
                'inventory.5',
                'inventory.6',
                'inventory.7',
                'inventory.8',
                'inventory.9',
                'inventory.10',
                'inventory.11',
                'inventory.12',
                'inventory.13',
                'inventory.14',
                'inventory.15',
                'inventory.16',
                'inventory.17',
                'inventory.18',
                'inventory.19',
                'inventory.20',
                'inventory.21',
                'inventory.22',
                'inventory.23',
                'inventory.24',
                'inventory.25',
                'inventory.26',
                'hotbar.0',
                'hotbar.1',
                'hotbar.2',
                'hotbar.3',
                'hotbar.4',
                'hotbar.5',
                'hotbar.6',
                'hotbar.7',
                'hotbar.8',
                'horse.saddle',
                'horse.chest',
                'horse.armor',
                'horse.0',
                'horse.1',
                'horse.2',
                'horse.3',
                'horse.4',
                'horse.5',
                'horse.6',
                'horse.7',
                'horse.8',
                'horse.9',
                'horse.10',
                'horse.11',
                'horse.12',
                'horse.13',
                'horse.14',
                'villager.0',
                'villager.1',
                'villager.2',
                'villager.3',
                'villager.4',
                'villager.5',
                'villager.6',
                'villager.7'
            ].indexOf(splited[index]) !== -1
        ) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:item_stack
 * @property N/A
 */
export class MinecraftItemStackParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        let join = splited[index]
        try {
            new ItemStack(join)
            return 1
        } catch {
            for (let i = index + 1; i < splited.length; i++) {
                join += ' ' + splited[i]
                try {
                    new ItemStack(join)
                    return i - index + 1
                } catch {
                    continue
                }
            }
            return 0
        }
    }
}

/**
 * minecraft:message
 * @property N/A
 */
export class MinecraftMessageParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        return splited.length - index
    }
}

/**
 * minecraft:mob_effect
 * @property N/A
 */
export class MinecraftMobeffectParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (ResourceLocation.test(splited[index])) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:mob_effect
 * @property N/A
 */
export class MinecraftMobEffectParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (ResourceLocation.test(splited[index])) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:nbt
 * @property N/A
 */
export class MinecraftNbtParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        for (let endIndex = splited.length; endIndex > index; endIndex--) {
            let test = splited.slice(index, endIndex).join(' ')
            try {
                getNbtCompound(test)
                return endIndex - index
            } catch {
                continue
            }
        }
        return 0
    }
}

/**
 * minecraft:nbt_path
 * @property N/A
 */
export class MinecraftNbtPathParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (/(^.*\.?)+$/.test(splited[index])) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:objective
 * @property N/A
 */
export class MinecraftObjectiveParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (/^\w+$/.test(splited[index])) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:objective_criteria
 * @property N/A
 */
export class MinecraftObjectiveCriteriaParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (ScoreboardCriteria.test(splited[index])) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:operation
 * @property N/A
 */
export class MinecraftOperationParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (['+=', '-=', '*=', '/=', '%=', '=', '<', '>', '><'].indexOf(splited[index]) !== -1) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:particle
 * @property N/A
 */
export class MinecraftParticleParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (ResourceLocation.test(splited[index])) {
            if (['dust', 'minecraft:dust'].indexOf(splited[index]) !== -1) {
                if (
                    isNumeric(splited[index + 1]) &&
                    isNumeric(splited[index + 2]) &&
                    isNumeric(splited[index + 3]) &&
                    isNumeric(splited[index + 4]) &&
                    parseFloat(splited[index + 1]) >= 0 &&
                    parseFloat(splited[index + 1]) <= 1 &&
                    parseFloat(splited[index + 2]) >= 0 &&
                    parseFloat(splited[index + 2]) <= 1 &&
                    parseFloat(splited[index + 3]) >= 0 &&
                    parseFloat(splited[index + 3]) <= 1 &&
                    parseFloat(splited[index + 4]) >= 0 &&
                    parseFloat(splited[index + 4]) <= 1
                ) {
                    return 5
                } else {
                    return 0
                }
            } else if (['item', 'minecraft:item', 'block', 'minecraft:block'].indexOf(splited[index]) !== -1) {
                if (BlockStateOrItemStack.test(splited[index + 1])) {
                    return 2
                } else {
                    return 0
                }
            } else {
                return 1
            }
        } else {
            return 0
        }
    }
}

/**
 * minecraft:int_range
 * @property N/A
 */
export class MinecraftIntRangeParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (IntRange.test(splited[index])) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:resource_location
 * @property N/A
 */
export class MinecraftResourceLocationParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (ResourceLocation.test(splited[index])) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:rotation
 * @property N/A
 */
export class MinecraftRotationParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (Vec2.test(`${splited[index]} ${splited[index + 1]}`)) {
            return 2
        } else {
            return 0
        }
    }
}

/**
 * minecraft:score_holder
 * @property amount Can be one of the following values: `single` and `multiple`.
 */
export class MinecraftScoreHolderParser implements ArgumentParser {
    private amount: 'single' | 'multiple'

    public constructor(amount: 'single' | 'multiple') {
        this.amount = amount
    }

    public canParse(splited: string[], index: number): number {
        return (new MinecraftEntityParser(this.amount, 'entities')).canParse(splited, index)
    }
}

/**
 * minecraft:scoreboard_slot
 * @property N/A
 */
export class MinecraftScoreboardSlotParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (
            [
                'list',
                'sidebar',
                'belowName',
                'sidebar.team.black',
                'sidebar.team.dark_blue',
                'sidebar.team.dark_green',
                'sidebar.team.dark_aqua',
                'sidebar.team.dark_red',
                'sidebar.team.dark_purple',
                'sidebar.team.gold',
                'sidebar.team.gray',
                'sidebar.team.dark_gray',
                'sidebar.team.blue',
                'sidebar.team.green',
                'sidebar.team.aqua',
                'sidebar.team.red',
                'sidebar.team.light_purple',
                'sidebar.team.yellow',
                'sidebar.team.white'
            ].indexOf(splited[index]) !== -1
        ) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:swizzle
 * @property N/A
 */
export class MinecraftSwizzleParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (Swizzle.test(splited[index])) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:team
 * @property N/A
 */
export class MinecraftTeamParser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (/^\w+$/.test(splited[index])) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * minecraft:vec2
 * @property N/A
 */
export class MinecraftVec2Parser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (Vec2.test(`${splited[index]} ${splited[index + 1]}`)) {
            return 2
        } else {
            return 0
        }
    }
}

/**
 * minecraft:vec3
 * @property N/A
 */
export class MinecraftVec3Parser implements ArgumentParser {
    public constructor() { }

    public canParse(splited: string[], index: number): number {
        if (Vec3.test(`${splited[index]} ${splited[index + 1]} ${splited[index + 2]}`)) {
            return 3
        } else {
            return 0
        }
    }
}
