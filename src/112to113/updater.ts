import ArgumentReader from '../utils/argument_reader'
import Selector from './selector'
import Spuses from './mappings/spuses'
import SpuScript from '../spu_script'
import Checker from './checker'
import Blocks from './mappings/blocks'
import Effects from './mappings/effects'
import Enchantments from './mappings/enchantments'
import Entities from './mappings/entities'
import Items from './mappings/items'
import Particles from './mappings/particles'
import ScoreboardCriterias from './mappings/scoreboard_criterias'
import { isNumeric, getNbt, escape, getUuidLeastUuidMost } from '../utils/utils'
import { NbtString, NbtCompound, NbtShort, NbtList, NbtInt, NbtByte, NbtValue, NbtLong } from '../utils/nbt/nbt'

/**
 * Provides methods to convert commands in a mcf file from minecraft 1.12 to 1.13.
 * @author SPGoding
 */
export default class Updater {
    /**
     * Returns an result map from an 1.12 command and an 1.12 spus.
     * @param cmd An 1.12 minecraft command.
     * @param spus An 1.12 spus defined in spuses.ts.
     * @returns NULLABLE. A map filled with converted value.
     * @example {'%n': 'converted value'}.
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

            if (spusArg.charAt(0) === '%') {
                map.set(`%${cnt++}`, Updater.upArgument(cmdArg, spusArg))
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

    public static upLine(input: string, positionCorrect: boolean = false) {
        if (input.charAt(0) === '#' || /^\s*$/.test(input)) {
            return input
        } else {
            return Updater.upCommand(input, positionCorrect)
        }
    }

    public static upCommand(input: string, positionCorrect: boolean = false, allowSlash: boolean = true) {
        let slash = false

        if (input.slice(0, 1) === '/') {
            input = input.slice(1)
            slash = true
        }

        for (const spusOld of Spuses.pairs.keys()) {
            let map = Updater.getResultMap(input, spusOld)
            if (map) {
                let spusNew = Spuses.pairs.get(spusOld)
                if (spusNew) {
                    let spus = new SpuScript(spusNew)
                    let result = spus.compileWith(map)
                    if (positionCorrect) {
                        return `execute positioned 0.0 0.0 0.0 run ${result}`
                    } else {
                        if (slash && allowSlash && result.slice(0, 1) !== '#') {
                            result = '/' + result
                        }
                        return result
                    }
                }
            }
        }
        throw `Unknown command: ${input}`
    }

    public static upArgument(arg: string, spus: string) {
        switch (spus.slice(1)) {
            case 'adv':
                return arg
            case 'adv_crit':
                return arg
            case 'block':
                return arg
            case 'block_dust_param':
                return Updater.upBlockDustParam(arg)
            case 'block_metadata_or_state':
                return arg
            case 'block_nbt':
                return arg
            case 'bool':
                return arg
            case 'command':
                return Updater.upCommand(arg, false)
            case 'difficulty':
                return Updater.upDifficulty(arg)
            case 'effect':
                return Updater.upEffect(arg)
            case 'entity':
                return Updater.upEntity(arg)
            case 'entity_nbt':
                return Updater.upEntityNbt(arg)
            case 'ench':
                return Updater.upEnch(arg)
            case 'entity_type':
                return Updater.upEntityType(arg)
            case 'execute_command':
                return Updater.upCommand(arg, false, false)
            case 'func':
                return arg
            case 'gamemode':
                return Updater.upGamemode(arg)
            case 'ip':
                return arg
            case 'item':
                return arg
            case 'item_data':
                return arg
            case 'item_dust_params':
                return Updater.upItemDustParams(arg)
            case 'item_nbt':
                return arg
            case 'item_tag_nbt':
                return arg
            case 'json':
                return Updater.upJson(arg)
            case 'literal':
                return arg.toLowerCase()
            case 'num':
                return arg
            case 'num_l':
                return arg.slice(0, -1)
            case 'num_or_star':
                return arg
            case 'no_slash_command':
                return Updater.upCommand(arg, false, false)
            case 'particle':
                return Updater.upParticle(arg)
            case 'pre_json':
                return Updater.upPreJson(arg)
            case 'recipe':
                return arg
            case 'say_string':
                return Updater.upSayString(arg)
            case 'scb_crit':
                return Updater.upScbCrit(arg)
            case 'slot':
                return Updater.upSlot(arg)
            case 'sound':
                return Updater.upSound(arg)
            case 'source':
                return arg
            case 'string':
                return arg
            case 'team_option':
                return Updater.upTeamOption(arg)
            case 'uuid':
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

    public static upBlockDustParam(input: string) {
        const num = Number(input)
        const nominal = Blocks.to113(Blocks.std112(num)).getFull()
        return nominal
    }

    public static upDifficulty(input: string) {
        switch (input) {
            case '0':
            case 'p':
            case 'peaceful':
                return 'peaceful'
            case '1':
            case 'e':
            case 'easy':
                return 'easy'
            case '2':
            case 'n':
            case 'normal':
                return 'normal'
            case '3':
            case 'h':
            case 'hard':
                return 'hard'
            default:
                throw `Unknown difficulty: ${input}`
        }
    }

    public static upEffect(input: string) {
        if (isNumeric(input)) {
            return Effects.to113(Number(input))
        } else {
            return input
        }
    }

    public static upEnch(input: string) {
        if (isNumeric(input)) {
            return Enchantments.to113(Number(input))
        } else {
            return input
        }
    }

    public static upEntity(input: string) {
        let sel = new Selector()
        if (Checker.isSelector(input)) {
            sel.parse112(input)
        } else if (Checker.isWord(input)) {
            sel.parse112(`@p[name=${input}]`)
        } else {
            return input
        }
        return sel.to113()
    }

    public static upEntityNbt(input: string) {
        // https://minecraft.gamepedia.com/Chunk_format#Entity_format

        const root = getNbt(input)

        /* id */ {
            const id = root.get('id')
            if (id instanceof NbtString) {
                id.set(Entities.to113(id.get()))
            }
        }
        /* CustomName */ {
            const value = root.get('CustomName')
            if (value instanceof NbtString) {
                value.set(`{"text":"${escape(value.get())}"}`)
            }
        }
        /* Passengers */ {
            const passengers = root.get('Passengers')
            if (passengers instanceof NbtList) {
                for (let i = 0; i < passengers.length; i++) {
                    let passenger = passengers.get(i)
                    passenger = getNbt(Updater.upEntityNbt(passenger.toString()))
                    passengers.set(i, passenger)
                }
            }
        }
        /* Offers.Recipes[n].buy &
           Offers.Recipes[n].buyB & 
           Offers.Recipes[n].sell */ {
            const offers = root.get('Offers')
            if (offers instanceof NbtCompound) {
                const recipes = offers.get('Recipes')
                if (recipes instanceof NbtList) {
                    recipes.forEach((v: NbtValue) => {
                        if (v instanceof NbtCompound) {
                            let buy = v.get('buy')
                            let buyB = v.get('buyB')
                            let sell = v.get('sell')
                            if (buy instanceof NbtCompound) {
                                buy = Updater.upItemNbt(buy)
                                v.set('buy', buy)
                            }
                            if (buyB instanceof NbtCompound) {
                                buyB = Updater.upItemNbt(buyB)
                                v.set('buyB', buyB)
                            }
                            if (sell instanceof NbtCompound) {
                                sell = Updater.upItemNbt(sell)
                                v.set('sell', sell)
                            }
                        }
                    })
                }
            }
        }
        /* HandItems */ {
            const handItems = root.get('HandItems')
            if (handItems instanceof NbtList) {
                for (let i = 0; i < handItems.length; i++) {
                    let item = handItems.get(i)
                    item = Updater.upItemNbt(item)

                    handItems.set(i, item)
                }
            }
        }
        /* ArmorItems */ {
            const armorItems = root.get('ArmorItems')
            if (armorItems instanceof NbtList) {
                for (let i = 0; i < armorItems.length; i++) {
                    let item = armorItems.get(i)
                    item = Updater.upItemNbt(item)
                    armorItems.set(i, item)
                }
            }
        }
        /* ArmorItem */ {
            let armorItem = root.get('ArmorItem')
            if (armorItem instanceof NbtCompound) {
                armorItem = Updater.upItemNbt(armorItem)
                root.set('ArmorItem', armorItem)
            }
        }
        /* SaddleItem */ {
            let saddleItem = root.get('SaddleItem')
            if (saddleItem instanceof NbtCompound) {
                saddleItem = Updater.upItemNbt(saddleItem)
                root.set('SaddleItem', saddleItem)
            }
        }
        /* Items */ {
            const items = root.get('Items')
            if (items instanceof NbtList) {
                for (let i = 0; i < items.length; i++) {
                    let item = items.get(i)
                    item = Updater.upItemNbt(item)
                    items.set(i, item)
                }
            }
        }
        /* carried & carriedData */ {
            const carried = root.get('carried')
            const carriedData = root.get('carriedData')
            root.del('carried')
            root.del('carriedData')
            if (
                (carried instanceof NbtShort || carried instanceof NbtInt) &&
                (carriedData instanceof NbtShort || carriedData instanceof NbtInt || typeof carriedData === 'undefined')
            ) {
                const carriedBlockState = Updater.upBlockNumericIDToBlockState(carried, carriedData)
                root.set('carriedBlockState', carriedBlockState)
            }
        }
        /* DecorItem */ {
            let decorItem = root.get('DecorItem')
            if (decorItem instanceof NbtCompound) {
                decorItem = Updater.upItemNbt(decorItem)
                root.set('DecorItem', decorItem)
            }
        }
        /* Inventory */ {
            const inventory = root.get('Inventory')
            if (inventory instanceof NbtList) {
                for (let i = 0; i < inventory.length; i++) {
                    let item = inventory.get(i)
                    item = Updater.upItemNbt(item)
                    inventory.set(i, item)
                }
            }
        }
        /* inTile */ {
            const inTile = root.get('inTile')
            root.del('inTile')
            if (inTile instanceof NbtString) {
                const inBlockState = Blocks.upStringToBlockState(inTile)
                root.set('inBlockState', inBlockState)
            }
        }
        /* Item */ {
            let item = root.get('Item')
            if (item instanceof NbtCompound) {
                item = Updater.upItemNbt(item)
                root.set('Item', item)
            }
        }
        /* SelectedItem */ {
            let selectedItem = root.get('SelectedItem')
            if (selectedItem instanceof NbtCompound) {
                selectedItem = Updater.upItemNbt(selectedItem)
                root.set('SelectedItem', selectedItem)
            }
        }
        /* FireworksItem */ {
            let fireworksItem = root.get('FireworksItem')
            if (fireworksItem instanceof NbtCompound) {
                fireworksItem = Updater.upItemNbt(fireworksItem)
                root.set('FireworksItem', fireworksItem)
            }
        }
        /* Command */ {
            const command = root.get('Command')
            if (command instanceof NbtString) {
                command.set(Updater.upCommand(command.get(), false))
            }
        }
        /* SpawnPotentials */ {
            const spawnPotentials = root.get('SpawnPotentials')
            if (spawnPotentials instanceof NbtList) {
                for (let i = 0; i < spawnPotentials.length; i++) {
                    const potential = spawnPotentials.get(i)
                    if (potential instanceof NbtCompound) {
                        let entity = potential.get('Entity')
                        if (entity instanceof NbtCompound) {
                            entity = getNbt(Updater.upEntityNbt(entity.toString()))
                            potential.set('Entity', entity)
                        }
                    }
                }
            }
        }
        /* SpawnData */ {
            let spawnData = root.get('SpawnData')
            if (spawnData instanceof NbtCompound) {
                spawnData = getNbt(Updater.upEntityNbt(spawnData.toString()))
                root.set('SpawnData', spawnData)
            }
        }
        /* Block & Data & TileEntityData */ {
            const block = root.get('Block')
            const data = root.get('Data')
            root.del('Block')
            root.del('Data')
            if (
                block instanceof NbtString &&
                (data instanceof NbtByte || data instanceof NbtInt || typeof data === 'undefined')
            ) {
                const blockState = Blocks.upStringToBlockState(block, data)
                root.set('BlockState', blockState)
            }

            let tileEntityData = root.get('TileEntityData')
            if (
                block instanceof NbtString &&
                tileEntityData instanceof NbtCompound &&
                (data instanceof NbtInt || data instanceof NbtByte || data === undefined)
            ) {
                tileEntityData = Blocks.to113(
                    Blocks.std112(undefined, block.get(), data ? data.get() : 0, undefined, tileEntityData.toString())
                ).getNbt()
                root.set('TileEntityData', tileEntityData)
            }
        }
        /* DisplayTile & DisplayData */ {
            const displayTile = root.get('DisplayTile')
            const displayData = root.get('DisplayData')
            root.del('DisplayTile')
            root.del('DisplayData')
            if (
                displayTile instanceof NbtString &&
                (displayData instanceof NbtInt || typeof displayData === 'undefined')
            ) {
                const displayState = Blocks.upStringToBlockState(displayTile, displayData)
                root.set('DisplayState', displayState)
            }
        }
        /* Particle & ParticleParam1 & ParticleParam2 */ {
            const particle = root.get('Particle')
            const particleParam1 = root.get('ParticleParam1')
            const particleParam2 = root.get('ParticleParam2')
            root.del('ParticleParam1')
            root.del('ParticleParam2')
            if (particle instanceof NbtString) {
                particle.set(Updater.upParticle(particle.get()))
                if (particle.get() === 'block') {
                    if (particleParam1 instanceof NbtInt) {
                        particle.set(particle.get() + ' ' + Updater.upBlockDustParam(particleParam1.get().toString()))
                    }
                } else if (particle.get() === 'item') {
                    if (particleParam1 instanceof NbtInt && particleParam2 instanceof NbtInt) {
                        particle.set(
                            particle.get() +
                            ' ' +
                            Updater.upItemDustParams(
                                particleParam1.get().toString() + ' ' + particleParam2.get().toString()
                            )
                        )
                    }
                }
            }
        }
        /* Owner */ {
            let owner = root.get('Owner')
            root.del('Owner')
            if (owner instanceof NbtString) {
                const uuid = getUuidLeastUuidMost(owner.get())
                const m = new NbtLong(uuid.M)
                const l = new NbtLong(uuid.L)
                owner = new NbtCompound()
                owner.set('M', m)
                owner.set('L', l)
                root.set('Owner', owner)
            }
        }
        /* owner */ {
            let owner = root.get('owner')
            root.del('owner')
            if (owner instanceof NbtString) {
                const uuid = getUuidLeastUuidMost(owner.get())
                const m = new NbtLong(uuid.M)
                const l = new NbtLong(uuid.L)
                owner = new NbtCompound()
                owner.set('M', m)
                owner.set('L', l)
                root.set('owner', owner)
            }
        }
        /* Thrower */ {
            let thrower = root.get('Thrower')
            root.del('Thrower')
            if (thrower instanceof NbtString) {
                const uuid = getUuidLeastUuidMost(thrower.get())
                const m = new NbtLong(uuid.M)
                const l = new NbtLong(uuid.L)
                thrower = new NbtCompound()
                thrower.set('M', m)
                thrower.set('L', l)
                root.set('Thrower', thrower)
            }
        }

        return root.toString()
    }

    private static upBlockNumericIDToBlockState(id: NbtShort | NbtInt, data?: NbtShort | NbtInt) {
        const blockState = new NbtCompound()
        const name = new NbtString()
        const properties = new NbtCompound()
        const metadata = data ? data.get() : 0
        const std = Blocks.to113(Blocks.std112(id.get(), undefined, metadata))
        name.set(std.getName())
        if (std.hasStates()) {
            std.getStates().forEach(v => {
                const val = new NbtString()
                const pairs = v.split('=')
                val.set(pairs[1])
                properties.set(pairs[0], val)
            })
            blockState.set('Properties', properties)
        }
        blockState.set('Name', name)
        return blockState
    }

    public static upEntityType(input: string) {
        return Entities.to113(input)
    }

    public static upGamemode(input: string) {
        switch (input) {
            case '0':
            case 's':
            case 'survival':
                return 'survival'
            case '1':
            case 'c':
            case 'creative':
                return 'creative'
            case '2':
            case 'a':
            case 'adventure':
                return 'adventure'
            case '3':
            case 'sp':
            case 'spectator':
                return 'spectator'
            default:
                throw `Unknown gamemode: ${input}`
        }
    }

    public static upItemDustParams(input: string) {
        const params = input.split(' ').map(x => Number(x))
        return Items.to113(Items.std112(params[0], undefined, params[1])).getNominal()
    }

    public static upItemNbt(item: NbtValue) {
        return Items.to113(Items.std112(undefined, undefined, undefined, undefined, item.toString())).getNbt()
    }

    public static upJson(input: string) {
        if (input.slice(0, 1) === '"') {
            return input
        } else if (input.slice(0, 1) === '[') {
            let json = JSON.parse(input)
            let result: string[] = []
            for (const i of json) {
                result.push(Updater.upJson(JSON.stringify(i)))
            }
            return `[${result.join()}]`
        } else {
            let json = JSON.parse(input)
            if (json.selector) {
                let sel = new Selector()
                sel.parse112(json.selector)
                json.selector = sel.to113()
            }

            if (
                json.clickEvent &&
                json.clickEvent.action &&
                (json.clickEvent.action === 'run_command' || json.clickEvent.action === 'suggest_command') &&
                json.clickEvent.value
            ) {
                json.clickEvent.value = Updater.upCommand(json.clickEvent.value, false)
            }

            if (json.extra) {
                json.extra = JSON.parse(Updater.upJson(JSON.stringify(json.extra)))
            }

            return JSON.stringify(json).replace(/§/g, '\\u00a7')
        }
    }

    public static upParticle(input: string) {
        return Particles.to113(input)
    }

    public static upPreJson(input: string) {
        return `{"text":"${escape(input)}"}`
    }

    public static upSayString(input: string) {
        let arr = input.split(' ')
        let ans: string[] = []
        for (const i of arr) {
            if (Checker.isSelector(i)) {
                ans.push(Updater.upEntity(i))
            } else {
                ans.push(i)
            }
        }
        return ans.join(' ')
    }

    public static upScbCrit(input: string) {
        if (input.slice(0, 5) === 'stat.') {
            const subs = input.split(/\./g)
            const newCrit = ScoreboardCriterias.to113(subs[1])
            switch (subs[1]) {
                case 'mineBlock':
                    let block = ''
                    if (isNumeric(subs[2])) {
                        block = Blocks.to113(Blocks.std112(Number(subs[2])))
                            .getName()
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '')
                    } else {
                        block = Blocks.to113(Blocks.std112(undefined, `${subs[2]}:${subs[3]}`))
                            .getName()
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '')
                    }
                    return `minecraft.${newCrit}:${block}`
                case 'craftItem':
                case 'useItem':
                case 'breakItem':
                case 'pickup':
                case 'drop':
                    let item = ''
                    if (isNumeric(subs[2])) {
                        item = Items.to113(Items.std112(Number(subs[2])))
                            .getName()
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '')
                    } else {
                        item = Items.to113(Items.std112(undefined, `${subs[2]}:${subs[3]}`))
                            .getName()
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '')
                    }
                    return `minecraft.${newCrit}:${item}`
                case 'killEntity':
                case 'entityKilledBy':
                    const entity = Entities.to113(Entities.to112(subs[2])).replace(/:/g, '.')
                    return `minecraft.${newCrit}:${entity}`
                default:
                    return `minecraft.custom:minecraft.${subs[1]}`
            }
        } else {
            return input
        }
    }

    public static upSlot(input: string) {
        return input.slice(5)
    }

    public static upSound(input: string) {
        if (input.slice(0, 10) !== "minecraft:") {
            input = `minecraft:${input}`
        }
        input = input.replace('minecraft:entity.endermen', 'minecraft:entity.enderman')
        input = input.replace('minecraft:entity.enderdragon', 'minecraft:entity.ender_dragon')

        return input
    }

    public static upTeamOption(input: string) {
        switch (input) {
            case 'friendlyfire':
                return 'friendlyFire'
            default:
                return input
        }
    }
}
