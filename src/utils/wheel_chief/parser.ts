import { isNumeric, getNbtCompound } from '../utils'
import { BlockState } from '../block_state'
import { TargetSelector as TargetSelector113 } from '../selector'
import { ItemStack } from '../item_stack'


export class ArgumentParser {
    private readonly ResourceLocation = /^([a-zA-Z0-9\_\-\.]+:)?([a-zA-Z0-9\_\-\.]+\/)*[a-zA-Z0-9\_\-\.]+$/
    private readonly ScoreboardCriteria = /^\w+(\.\w+:\w+\.\w+)?$/
    private readonly IntRange = /^([-+]?\d*(\.\d*)?)?(\.\.)?([-+]?\d*(\.\d*)?)?$/
    private readonly Swizzle = /^[xyz]+$/

    // The vec regex is coppied from
    // https://github.com/pca006132/datapack-helper/blob/master/src/command-node/format.ts
    // Dressed pca, I love you!!!
    private readonly Vec2 = /^((((~?[+-]?(\d*(\.\d*)?)|\.\d+)|(~))(\s|$)){2})$/
    private readonly Vec3 = /^((((~?[+-]?(\d*(\.\d*)?)|\.\d*)|(~))(\s|$)){3}|(\^([+-]?(\d*(\.\d*)?|\.\d*))?(\s|$)){3})$/

    public parseArgument(parser: string, splited: string[], index: number, properties: any): number {
        if (properties === undefined) {
            properties = {}
        }
        switch (parser) {
            case 'brigadier:bool':
                return this.parseBrigadierBool(splited, index)
            case 'brigadier:double':
                return this.parseBrigadierDouble(splited, index, properties.min, properties.max)
            case 'brigadier:float':
                return this.parseBrigadierFloat(splited, index, properties.min, properties.max)
            case 'brigadier:integer':
                return this.parseBrigadierInteger(splited, index, properties.min, properties.max, properties.acceptsAsterisk)
            case 'brigadier:string':
                return this.parseBrigadierString(splited, index, properties.type)
            case 'minecraft:block_pos':
                return this.parseMinecraftBlockPos(splited, index)
            case 'minecraft:block_predicate':
                return this.parseBlockPredicate(splited, index)
            case 'minecraft:block_state':
                return this.parseBlockState(splited, index)
            case 'minecraft:color':
                return this.parseMinecraftColor(splited, index)
            case 'minecraft:column_pos':
                return this.parseMinecraftColumnPos(splited, index)
            case 'minecraft:component':
                return this.parseMinecraftComponent(splited, index)
            case 'minecraft:entity':
                return this.parseMinecraftEntity(splited, index, properties.amount, properties.type)
            case 'minecraft:entity_anchor':
                return this.parseMinecraftEntityAnchor(splited, index)
            case 'minecraft:entity_summon':
                return this.parseMinecraftEntitySummon(splited, index)
            case 'minecraft:function':
                return this.parseMinecraftFunction(splited, index)
            case 'minecraft:game_profile':
                return this.parseMinecraftGameProfile(splited, index)
            case 'minecraft:int_range':
                return this.parseMinecraftIntRange(splited, index)
            case 'minecraft:item_enchantment':
                return this.parseMinecraftItemEnchantment(splited, index)
            case 'minecraft:item_predicate':
                return this.parseMinecraftItemPredicate(splited, index)
            case 'minecraft:item_slot':
                return this.parseMinecraftItemSlot(splited, index)
            case 'minecraft:item_stack':
                return this.parseMinecraftItemStack(splited, index)
            case 'minecraft:message':
                return this.parseMinecraftMessage(splited, index)
            case 'minecraft:mob_effect':
                return this.parseMinecraftMobEffect(splited, index)
            case 'minecraft:nbt':
                return this.parseMinecraftNbt(splited, index)
            case 'minecraft:nbt_path':
                return this.parseMinecraftNbtPath(splited, index)
            case 'minecraft:objective':
                return this.parseMinecraftObjective(splited, index)
            case 'minecraft:objective_criteria':
                return this.parseMinecraftObjectiveCriteria(splited, index)
            case 'minecraft:operation':
                return this.parseMinecraftOperation(splited, index)
            case 'minecraft:particle':
                return this.parseMinecraftParticle(splited, index)
            case 'minecraft:resource_location':
                return this.parseMinecraftResourceLocation(splited, index)
            case 'minecraft:rotation':
                return this.parseMinecraftRotation(splited, index)
            case 'minecraft:score_holder':
                return this.parseMinecraftScoreHolder(splited, index, properties.amount)
            case 'minecraft:scoreboard_slot':
                return this.parseMinecraftScoreboardSlot(splited, index)
            case 'minecraft:swizzle':
                return this.parseMinecraftSwizzle(splited, index)
            case 'minecraft:team':
                return this.parseMinecraftTeam(splited, index)
            case 'minecraft:vec2':
                return this.parseMinecraftVec2(splited, index)
            case 'minecraft:vec3':
                return this.parseMinecraftVec3(splited, index)
            default:
                throw `Unknown parser: '${parser}'.`
        }
    }

    protected parseBrigadierBool(splited: string[], index: number): number {
        if (['false', 'true'].indexOf(splited[index]) !== -1) {
            return 1
        } else {
            throw `Expected 'true' or 'false' but got '${splited[index]}'.`
        }
    }

    protected parseBrigadierDouble(splited: string[], index: number, min: number, max: number): number {
        if (isNumeric(splited[index])) {
            if ((min === undefined || parseFloat(splited[index]) >= min) &&
                (max === undefined || parseFloat(splited[index]) <= max)) {
                return 1
            }
            else {
                throw `Should between ${min}..${max} but got '${splited[index]}'.`
            }
        } else {
            throw `Expected a number but got '${splited[index]}'.`
        }
    }

    protected parseBrigadierFloat(splited: string[], index: number, min: number, max: number): number {
        if (isNumeric(splited[index])) {
            if ((min === undefined || parseFloat(splited[index]) >= min) &&
                (max === undefined || parseFloat(splited[index]) <= max)) {
                return 1
            }
            else {
                throw `Should between ${min}..${max} but got '${splited[index]}'.`
            }
        } else {
            throw `Expected a number but got '${splited[index]}'.`
        }
    }

    protected parseBrigadierInteger(splited: string[], index: number, min: number, max: number, acceptsAsterisk: boolean): number {
        if (isNumeric(splited[index])) {
            if (parseInt(splited[index]) === parseFloat(splited[index])) {
                if ((min === undefined || parseFloat(splited[index]) >= min) &&
                    (max === undefined || parseFloat(splited[index]) <= max)) {
                    return 1
                }
                else {
                    throw `Should between ${min}..${max} but got '${splited[index]}'.`
                }
            } else {
                throw `Expected an integer but got double '${splited[index]}'.`
            }
        } else if (acceptsAsterisk && splited[index] === '*') {
            return 1
        } else {
            throw `Expected a number but got '${splited[index]}'.`
        }
    }

    protected parseBrigadierString(splited: string[], index: number, type: string): number {
        switch (type) {
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
                        throw `Should be closed with '"'.`
                    }
                } else {
                    return 1
                }
            case 'word':
            default:
                return 1
        }
    }

    protected parseMinecraftBlockPos(splited: string[], index: number): number {
        if (this.Vec3.test(`${splited[index]} ${splited[index + 1]} ${splited[index + 2]}`)) {
            return 3
        } else {
            throw 'Expected a block pos.'
        }
    }

    protected parseBlockPredicate(splited: string[], index: number): number {
        let join = splited[index]
        let exception
        try {
            new BlockState(join)
            return 1
        } catch (e) {
            exception = e
            for (let i = index + 1; i < splited.length; i++) {
                join += ` ${splited[i]}`
                try {
                    new BlockState(join)
                    return i - index + 1
                } catch (e) {
                    exception = e
                    continue
                }
            }
            throw exception
        }
    }

    protected parseBlockState(splited: string[], index: number): number {
        let join = splited[index]
        let exception

        try {
            new BlockState(join)
            return 1
        } catch (e) {
            exception = e
            for (let i = index + 1; i < splited.length; i++) {
                join += ` ${splited[i]}`
                try {
                    new BlockState(join)
                    return i - index + 1
                } catch (e) {
                    exception = e
                    continue
                }
            }
            throw exception
        }
    }

    protected parseMinecraftColor(splited: string[], index: number): number {
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
            throw "Expected 'black', 'dark_blue', 'dark_green', 'dark_aqua', 'dark_red', 'dark_purple'" +
            ", 'gold', 'gray', 'dark_gray', 'blue', 'green', 'aqua', 'red', 'light_purple', 'yellow' or 'white' " +
            `but got '${splited[index]}'.`
        }
    }

    protected parseMinecraftColumnPos(splited: string[], index: number): number {
        if (this.Vec2.test(`${splited[index]} ${splited[index + 1]}`)) {
            return 2
        } else {
            throw 'Expected a column pos.'
        }
    }

    protected parseMinecraftComponent(splited: string[], index: number): number {
        return splited.length - index
    }

    protected parseMinecraftEntity(splited: string[], index: number, amount: 'single' | 'multiple', type: 'players' | 'entities'): number {
        let join = splited[index]

        if (join.charAt(0) !== '@') {
            return 1
        }

        let exception

        try {
            const sel = new TargetSelector113(join)
            if (amount === 'single' && (sel.variable === 'a' || sel.variable === 'e') && parseInt(sel.limit) !== 1) {
                throw 'Expected a single target.'
            }
            if (amount === 'single' && parseInt(sel.limit) > 1) {
                throw 'Expected a single target.'
            }
            if (type === 'players' && sel.variable === 'e' &&
                sel.type.indexOf('player') === -1 && sel.type.indexOf('minecraft:player') === -1) {
                throw 'Expected player(s).'
            }

            return 1
        } catch (e) {
            exception = e
            for (let i = index + 1; i < splited.length; i++) {
                join += ` ${splited[i]}`
                try {
                    const sel = new TargetSelector113(join)
                    if (amount === 'single' && (sel.variable === 'a' || sel.variable === 'e') && parseInt(sel.limit) !== 1) {
                        throw 'Expected a single target.'
                    }
                    if (amount === 'single' && parseInt(sel.limit) > 1) {
                        throw 'Expected a single target.'
                    }
                    if (type === 'players' && sel.variable === 'e' &&
                        sel.type.indexOf('player') === -1 && sel.type.indexOf('minecraft:player') === -1) {
                        throw 'Expected player(s).'
                    }
                    return i - index + 1
                } catch (e) {
                    exception = e
                    continue
                }
            }
            throw exception
        }
    }

    protected parseMinecraftEntityAnchor(splited: string[], index: number): number {
        if (['eyes', 'feet'].indexOf(splited[index]) !== -1) {
            return 1
        } else {
            throw `Expected 'eyes' or 'feet' but got '${splited[index]}'.`
        }
    }

    protected parseMinecraftEntitySummon(splited: string[], index: number): number {
        if (this.ResourceLocation.test(splited[index])) {
            return 1
        } else {
            throw 'Expected an resource location.'
        }
    }

    protected parseMinecraftFunction(splited: string[], index: number): number {
        if (this.ResourceLocation.test(splited[index])) {
            return 1
        } else {
            throw 'Expected an resource location.'
        }
    }

    protected parseMinecraftGameProfile(splited: string[], index: number): number {
        return this.parseMinecraftEntity(splited, index, 'multiple', 'players')
    }

    protected parseMinecraftItemEnchantment(splited: string[], index: number): number {
        if (this.ResourceLocation.test(splited[index])) {
            return 1
        } else {
            throw 'Expected an resource location.'
        }
    }

    protected parseMinecraftItemPredicate(splited: string[], index: number): number {
        let join = splited[index]
        let exception
        try {
            new ItemStack(join)
            return 1
        } catch (e) {
            exception = e
            for (let i = index + 1; i < splited.length; i++) {
                join += ` ${splited[i]}`
                try {
                    new ItemStack(join)
                    return i - index + 1
                } catch (e) {
                    exception = e
                    continue
                }
            }
            throw exception
        }
    }

    protected parseMinecraftItemSlot(splited: string[], index: number): number {
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
            throw 'Expected a slot.'
        }
    }

    protected parseMinecraftItemStack(splited: string[], index: number): number {
        let join = splited[index]
        let exception
        try {
            new ItemStack(join)
            return 1
        } catch (e) {
            exception = e
            for (let i = index + 1; i < splited.length; i++) {
                join += ` ${splited[i]}`
                try {
                    new ItemStack(join)
                    return i - index + 1
                } catch (e) {
                    exception = e
                    continue
                }
            }
            throw exception
        }
    }

    protected parseMinecraftMessage(splited: string[], index: number): number {
        return splited.length - index
    }

    protected parseMinecraftMobEffect(splited: string[], index: number): number {
        if (this.ResourceLocation.test(splited[index])) {
            return 1
        } else {
            throw 'Expected an resource location.'
        }
    }

    protected parseMinecraftNbt(splited: string[], index: number): number {
        let exception
        for (let endIndex = splited.length; endIndex > index; endIndex--) {
            const test = splited.slice(index, endIndex).join(' ')
            try {
                getNbtCompound(test)
                return endIndex - index
            } catch (e) {
                exception = e
                continue
            }
        }
        throw exception
    }

    protected parseMinecraftNbtPath(splited: string[], index: number): number {
        if (/(^.*\.?)+$/.test(splited[index])) {
            return 1
        } else {
            throw 'Expected a NBT path.'
        }
    }

    protected parseMinecraftObjective(splited: string[], index: number): number {
        if (/^\w+$/.test(splited[index])) {
            return 1
        } else {
            throw 'Expected an objective.'
        }
    }

    protected parseMinecraftObjectiveCriteria(splited: string[], index: number): number {
        if (this.ScoreboardCriteria.test(splited[index])) {
            return 1
        } else {
            throw 'Expected a scoreboard criteria.'
        }
    }

    protected parseMinecraftOperation(splited: string[], index: number): number {
        if (['+=', '-=', '*=', '/=', '%=', '=', '<', '>', '><'].indexOf(splited[index]) !== -1) {
            return 1
        } else {
            throw `Expected '+=', '-=', '*=', '/=', '%=', '=', '<', '>' or '><' but got '${splited[index]}'.`
        }
    }

    protected parseMinecraftParticle(splited: string[], index: number): number {
        if (this.ResourceLocation.test(splited[index])) {
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
                    throw "Expected four floats between 0.0..1.0 after particle 'minecraft:dust'."
                }
            } else if (['item', 'minecraft:item'].indexOf(splited[index]) !== -1) {
                let join = splited[index + 1]
                let exception
                try {
                    new ItemStack(join)
                    return 2
                } catch (e) {
                    exception = e
                    for (let i = index + 2; i < splited.length; i++) {
                        join += ` ${splited[i]}`
                        try {
                            new ItemStack(join)
                            return i - index + 1
                        } catch (e) {
                            exception = e
                            continue
                        }
                    }
                    throw exception
                }
            } else if (['block', 'minecraft:block'].indexOf(splited[index]) !== -1) {
                let join = splited[index + 1]
                let exception
                try {
                    new BlockState(join)
                    return 2
                } catch (e) {
                    exception = e
                    for (let i = index + 2; i < splited.length; i++) {
                        join += ` ${splited[i]}`
                        try {
                            new BlockState(join)
                            return i - index + 1
                        } catch (e) {
                            exception = e
                            continue
                        }
                    }
                    throw exception
                }
            } else {
                return 1
            }
        } else {
            throw 'Expected an resource location.'
        }
    }

    protected parseMinecraftIntRange(splited: string[], index: number): number {
        if (this.IntRange.test(splited[index])) {
            return 1
        } else {
            throw 'Expected an int range.'
        }
    }

    protected parseMinecraftResourceLocation(splited: string[], index: number): number {
        if (this.ResourceLocation.test(splited[index])) {
            return 1
        } else {
            throw 'Expected an resource location.'
        }
    }

    protected parseMinecraftRotation(splited: string[], index: number): number {
        if (this.Vec2.test(`${splited[index]} ${splited[index + 1]}`)) {
            return 2
        } else {
            throw 'Expected vec2.'
        }
    }

    protected parseMinecraftScoreHolder(splited: string[], index: number, amount: 'single' | 'multiple'): number {
        return this.parseMinecraftEntity(splited, index, amount, 'entities')
    }

    protected parseMinecraftScoreboardSlot(splited: string[], index: number): number {
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
            throw 'Expected a scoreboard display slot.'
        }
    }

    protected parseMinecraftSwizzle(splited: string[], index: number): number {
        if (this.Swizzle.test(splited[index])) {
            return 1
        } else {
            throw "Expected combination of 'x' 'y' and 'z'."
        }
    }

    protected parseMinecraftTeam(splited: string[], index: number): number {
        if (/^\w+$/.test(splited[index])) {
            return 1
        } else {
            throw 'Expected a team.'
        }
    }

    protected parseMinecraftVec2(splited: string[], index: number): number {
        if (this.Vec2.test(`${splited[index]} ${splited[index + 1]}`)) {
            return 2
        } else {
            throw 'Expected a vec2.'
        }
    }

    protected parseMinecraftVec3(splited: string[], index: number): number {
        if (this.Vec3.test(`${splited[index]} ${splited[index + 1]} ${splited[index + 2]}`)) {
            return 3
        } else {
            throw 'Expected a vec3.'
        }
    }
}
