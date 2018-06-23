import ArgumentReader from './utils/argument_reader'
import Selector from './utils/selector'
import Spuses from './mappings/spuses'
import SpuScript from './spu_script'
import Checker from './checker'
import Blocks from './mappings/blocks'
import Effects from './mappings/effects'
import Enchantments from './mappings/enchantments'
import Entities from './mappings/entities'
import Items from './mappings/items'
import Particles from './mappings/particles'
import ScoreboardCriterias from './mappings/scoreboard_criterias'
import { isNumeric, getNbt, escape } from './utils/utils'
import { NbtString, NbtCompound, NbtShort, NbtList, NbtInt, NbtByte } from './utils/nbt/nbt'

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
        if (cmdArg === '') {
            // Match successfully.
            return map
        } else {
            return null
        }
    }

    public static upLine(input: string, positionCorrect: boolean) {
        if (input.charAt(0) === '#') {
            return input
        } else {
            return Updater.upCommand(input, positionCorrect)
        }
    }

    public static upCommand(input: string, positionCorrect: boolean) {
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
                return Updater.upItemNbt(arg)
            case 'item_tag_nbt':
                return arg
            case 'json':
                return Updater.upJson(arg)
            case 'literal':
                return arg.toLowerCase()
            case 'num':
                return arg
            case 'num_or_star':
                return arg
            case 'particle':
                return Updater.upParticle(arg)
            case 'recipe':
                return arg
            case 'scb_crit':
                return Updater.upScbCrit(arg)
            case 'slot':
                return Updater.upSlot(arg)
            case 'sound':
                return arg
            case 'source':
                return arg
            case 'string':
                return arg
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
        const id = Blocks.get1_13NominalIDFrom1_12NumericID(num)
        return id.toString()
    }

    public static upBlockNbt(nbt: string, block: string) {
        const root = getNbt(nbt)

        switch (block) {
            case 'minecraft:white_banner': {
                /* CustomName */ {
                    const value = root.get('CustomName')
                    if (value instanceof NbtString) {
                        value.set(`{"text":"${escape(value.get())}"}`)
                    }
                }
                /* Base */ {
                    const base = root.get('Base')
                    root.del('Base')
                    if (base instanceof NbtInt) {
                        return `$ID>${Items.getNominalColorFromNumericColor(base.get(), 'banner')}`
                    }
                }
                break
            }
            case 'minecraft:white_wall_banner': {
                /* CustomName */ {
                    const value = root.get('CustomName')
                    if (value instanceof NbtString) {
                        value.set(`{"text":"${escape(value.get())}"}`)
                    }
                }
                /* Base */ {
                    const base = root.get('Base')
                    root.del('Base')
                    if (base instanceof NbtInt) {
                        return `$ID>${Items.getNominalColorFromNumericColor(base.get(), 'wall_banner')}`
                    }
                }
                break
            }
            case 'minecraft:enchanting_table': {
                /* CustomName */ {
                    const value = root.get('CustomName')
                    if (value instanceof NbtString) {
                        value.set(`{"text":"${escape(value.get())}"}`)
                    }
                }
                break
            }
            case 'minecraft:red_bed': {
                /* color */ {
                    const color = root.get('color')
                    root.del('color')
                    if (color instanceof NbtInt) {
                        return `$ID>${Items.getNominalColorFromNumericColor(color.get(), 'bed')}`
                    }
                }
                break
            }
            case 'minecraft:cauldron': {
                /* Items */ {
                    const items = root.get('Items')
                    if (items instanceof NbtList) {
                        for (let i = 0; i < items.length; i++) {
                            let item = items.get(i)
                            item = getNbt(Updater.upItemNbt(item.toString()))
                            items.set(i, item)
                        }
                    }
                }
                break
            }
            case 'minecraft:brewing_stand':
            case 'minecraft:chest':
            case 'minecraft:dispenser':
            case 'minecraft:dropper':
            case 'minecraft:furnance':
            case 'minecraft:hopper':
            case 'minecraft:shulker_box': {
                /* CustomName */ {
                    const value = root.get('CustomName')
                    if (value instanceof NbtString) {
                        value.set(`{"text":"${escape(value.get())}"}`)
                    }
                }
                /* Items */ {
                    const items = root.get('Items')
                    if (items instanceof NbtList) {
                        for (let i = 0; i < items.length; i++) {
                            let item = items.get(i)
                            item = getNbt(Updater.upItemNbt(item.toString()))
                            items.set(i, item)
                        }
                    }
                }
                break
            }
            case 'minecraft:command_block': {
                /* CustomName */ {
                    const value = root.get('CustomName')
                    if (value instanceof NbtString) {
                        value.set(`{"text":"${escape(value.get())}"}`)
                    }
                }
                /* Command */ {
                    const command = root.get('Command')
                    if (command instanceof NbtString) {
                        command.set(Updater.upCommand(command.get(), false))
                    }
                }
                break
            }
            case 'minecraft:flower_pot': {
                // TODO: https://minecraft.gamepedia.com/1.13/Flattening flower pot
                break
            }
            case 'minecraft:jukebox': {
                /* Record */ {
                    root.del('Record')
                }
                /* RecordItem */ {
                    let item = root.get('RecordItem')
                    if (item instanceof NbtString) {
                        item = getNbt(Updater.upItemNbt(item.toString()))
                        root.set('RecordItem', item)
                    }
                }
                break
            }
            case 'minecraft:mob_spawner': {
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
                break
            }
            case 'minecraft:note_block': {
                // TODO: Removed.
                break
            }
            case 'minecraft:piston': {
                /* blockId & blockData */ {
                    const blockID = root.get('blockId')
                    const blockData = root.get('blockData')
                    root.del('blockId')
                    root.del('blockData')
                    if (
                        blockID instanceof NbtInt &&
                        (blockData instanceof NbtInt || typeof blockData === 'undefined')
                    ) {
                        const blockState = Updater.upBlockNumericIDToBlockState(blockID, blockData)
                        root.set('blockState', blockState)
                    }
                }
                break
            }
            case 'minecraft:skull': {
                // TODO: Removed SkullType & Rot
                break
            }
            default:
                break
        }

        return root.toString()
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
            return Effects.get1_12NominalIDFrom1_12NumericID(Number(input))
        } else {
            return input
        }
    }

    public static upEnch(input: string) {
        if (isNumeric(input)) {
            return Enchantments.get1_12NominalIDFrom1_12NumericID(Number(input))
        } else {
            return input
        }
    }

    public static upEntity(input: string) {
        let sel = new Selector()
        if (Checker.isSelector(input)) {
            sel.parse1_12(input)
        } else if (Checker.isWord(input)) {
            sel.parse1_12(`@p[name=${input}]`)
        } else {
            return input
        }
        return sel.get1_13()
    }

    public static upEntityNbt(input: string) {
        // https://minecraft.gamepedia.com/Chunk_format#Entity_format

        const root = getNbt(input)

        /* id */ {
            const id = root.get('id')
            if (id instanceof NbtString) {
                id.set(Entities.get1_13NominalIDFrom1_12NominalID(id.get()))
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
        /* HandItems */ {
            const handItems = root.get('HandItems')
            if (handItems instanceof NbtList) {
                for (let i = 0; i < handItems.length; i++) {
                    let item = handItems.get(i)
                    item = getNbt(Updater.upItemNbt(item.toString()))
                    handItems.set(i, item)
                }
            }
        }
        /* ArmorItems */ {
            const armorItems = root.get('ArmorItems')
            if (armorItems instanceof NbtList) {
                for (let i = 0; i < armorItems.length; i++) {
                    let item = armorItems.get(i)
                    item = getNbt(Updater.upItemNbt(item.toString()))
                    armorItems.set(i, item)
                }
            }
        }
        /* ArmorItem */ {
            let armorItem = root.get('ArmorItem')
            if (armorItem instanceof NbtCompound) {
                armorItem = getNbt(Updater.upItemNbt(armorItem.toString()))
                root.set('ArmorItem', armorItem)
            }
        }
        /* SaddleItem */ {
            let saddleItem = root.get('SaddleItem')
            if (saddleItem instanceof NbtCompound) {
                saddleItem = getNbt(Updater.upItemNbt(saddleItem.toString()))
                root.set('SaddleItem', saddleItem)
            }
        }
        /* Items */ {
            const items = root.get('Items')
            if (items instanceof NbtList) {
                for (let i = 0; i < items.length; i++) {
                    let item = items.get(i)
                    item = getNbt(Updater.upItemNbt(item.toString()))
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
                decorItem = getNbt(Updater.upItemNbt(decorItem.toString()))
                root.set('DecorItem', decorItem)
            }
        }
        /* Inventory */ {
            const inventory = root.get('Inventory')
            if (inventory instanceof NbtList) {
                for (let i = 0; i < inventory.length; i++) {
                    let item = inventory.get(i)
                    item = getNbt(Updater.upItemNbt(item.toString()))
                    inventory.set(i, item)
                }
            }
        }
        /* inTile */ {
            const inTile = root.get('inTile')
            root.del('inTile')
            if (inTile instanceof NbtString) {
                const inBlockState = Updater.upBlockStringIDToBlockState(inTile)
                root.set('inBlockState', inBlockState)
            }
        }
        /* Item */ {
            let item = root.get('Item')
            if (item instanceof NbtCompound) {
                item = getNbt(Updater.upItemNbt(item.toString()))
                root.set('Item', item)
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
                const blockState = Updater.upBlockStringIDToBlockState(block, data)
                root.set('BlockState', blockState)
            }

            let tileEntityData = root.get('TileEntityData')
            if (block instanceof NbtString && tileEntityData instanceof NbtCompound) {
                tileEntityData = getNbt(Updater.upBlockNbt(tileEntityData.toString(), block.get()))
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
                const displayState = Updater.upBlockStringIDToBlockState(displayTile, displayData)
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

        return root.toString()
    }

    private static upBlockNumericIDToBlockState(id: NbtShort | NbtInt, data?: NbtShort | NbtInt) {
        const carriedBlockState = new NbtCompound()
        const name = new NbtString()
        const properties = new NbtCompound()
        const metadata = data ? data.get() : 0
        const nominal = Blocks.get1_13NominalIDFrom1_12NumericID(id.get(), metadata)
        name.set(nominal.split('[')[0])
        if (nominal.indexOf('[') !== -1) {
            nominal
                .slice(nominal.indexOf('['), -1)
                .split(',')
                .forEach(v => {
                    const val = new NbtString()
                    const pairs = v.split('=')
                    val.set(pairs[1])
                    properties.set(pairs[0], val)
                })
            carriedBlockState.set('Properties', properties)
        }
        carriedBlockState.set('Name', name)
        return carriedBlockState
    }

    private static upBlockStringIDToBlockState(block: NbtString, data?: NbtByte | NbtInt) {
        const carriedBlockState = new NbtCompound()
        const name = new NbtString()
        const properties = new NbtCompound()
        const metadata = data ? data.get() : 0
        const nominal = Blocks.get1_13NominalIDFrom1_12NominalID(
            Blocks.get1_12NominalIDFrom1_12StringIDWithMetadata(block.get(), metadata)
        )
        name.set(nominal.split('[')[0])
        if (nominal.indexOf('[') !== -1) {
            nominal
                .slice(nominal.indexOf('['), -1)
                .split(',')
                .forEach(v => {
                    const val = new NbtString()
                    const pairs = v.split('=')
                    val.set(pairs[1])
                    properties.set(pairs[0], val)
                })
            carriedBlockState.set('Properties', properties)
        }
        carriedBlockState.set('Name', name)
        return carriedBlockState
    }

    public static upEntityType(input: string) {
        return Entities.get1_13NominalIDFrom1_12NominalID(input)
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
        const nominal = Items.get1_12NominalIDFrom1_12NumericID(params[0])
        return Items.get1_13NominalIDFrom1_12NominalIDWithDataValue(nominal, params[1])
    }

    public static upItemNbt(input: string) {
        const root = getNbt(input)
        const id = root.get('id')
        const damage = root.get('Damage')
        let tag = root.get('tag')

        if (id instanceof NbtString && damage instanceof NbtShort) {
            if (tag instanceof NbtCompound) {
                tag = getNbt(Updater.upItemTagNbt(tag.toString(), id.get()))
            }
            if (Items.isDamageItem(id.get())) {
                if (!(tag instanceof NbtCompound)) {
                    tag = new NbtCompound()
                }
                tag.set('Damage', damage)
            } else {
                const newID = Items.get1_13NominalIDFrom1_12NominalIDWithDataValue(id.get(), damage.get())
                id.set(newID)
                root.set('id', id)
            }
            root.del('Damage')
            if (tag instanceof NbtCompound) {
                root.set('tag', tag)
            }
        }

        return root.toString()
    }

    public static upItemTagNbt(nbt: string, item: string) {
        // https://minecraft.gamepedia.com/Player.dat_format#Item_structure

        // TODO: map added for maps.

        const root = getNbt(nbt)
        /* CanDestroy */ {
            const canDestroy = root.get('CanDestroy')
            if (canDestroy instanceof NbtList) {
                for (let i = 0; i < canDestroy.length; i++) {
                    const block = canDestroy.get(i)
                    if (block instanceof NbtString) {
                        block.set(
                            Blocks.get1_13NominalIDFrom1_12NominalID(
                                Blocks.get1_12NominalIDFrom1_12StringIDWithMetadata(block.get(), 0)
                            ).split('[')[0]
                        )
                        canDestroy.set(i, block)
                    }
                }
                root.set('CanDestroy', canDestroy)
            }
        }
        /* CanPlaceOn */ {
            const canPlaceOn = root.get('CanPlaceOn')
            if (canPlaceOn instanceof NbtList) {
                for (let i = 0; i < canPlaceOn.length; i++) {
                    const block = canPlaceOn.get(i)
                    if (block instanceof NbtString) {
                        block.set(
                            Blocks.get1_13NominalIDFrom1_12NominalID(
                                Blocks.get1_12NominalIDFrom1_12StringIDWithMetadata(block.get(), 0)
                            ).split('[')[0]
                        )
                    }
                    canPlaceOn.set(i, block)
                }
                root.set('CanPlaceOn', canPlaceOn)
            }
        }
        /* BlockEntityTag */ {
            if (Blocks.is1_12StringID(item)) {
                let blockEntityTag = root.get('BlockEntityTag')
                if (blockEntityTag instanceof NbtCompound) {
                    blockEntityTag = getNbt(Updater.upBlockNbt(blockEntityTag.toString(), item))
                    root.set('BlockEntityTag', blockEntityTag)
                }
            }
        }
        /* ench */ {
            const enchantments = root.get('ench')
            root.del('ench')
            if (enchantments instanceof NbtList) {
                for (let i = 0; i < enchantments.length; i++) {
                    const enchantment = enchantments.get(i)
                    if (enchantment instanceof NbtCompound) {
                        let id = enchantment.get('id')
                        if (id instanceof NbtShort || id instanceof NbtInt) {
                            const strID = Enchantments.get1_12NominalIDFrom1_12NumericID(id.get())
                            id = new NbtString()
                            id.set(strID)
                            enchantment.set('id', id)
                        }
                        enchantments.set(i, enchantment)
                    }
                }
                root.set('Enchantments', enchantments)
            }
        }
        /* StoredEnchantments */ {
            const storedEnchantments = root.get('StoredEnchantments')
            if (storedEnchantments instanceof NbtList) {
                for (let i = 0; i < storedEnchantments.length; i++) {
                    const enchantment = storedEnchantments.get(i)
                    if (enchantment instanceof NbtCompound) {
                        let id = enchantment.get('id')
                        if (id instanceof NbtShort || id instanceof NbtInt) {
                            const strID = Enchantments.get1_12NominalIDFrom1_12NumericID(id.get())
                            id = new NbtString()
                            id.set(strID)
                            enchantment.set('id', id)
                        }
                        storedEnchantments.set(i, enchantment)
                    }
                }
                root.set('Enchantments', storedEnchantments)
            }
        }
        /* display.(Name|LocName) */ {
            const display = root.get('display')
            if (display instanceof NbtCompound) {
                const name = display.get('Name')
                if (name instanceof NbtString) {
                    name.set(`{"text": "${escape(name.get())}"}`)
                    display.set('Name', name)
                }
                const locName = display.get('LocName')
                display.del('LocName')
                if (locName instanceof NbtString) {
                    locName.set(`{"translate": "${locName.get()}"}`)
                    display.set('Name', locName)
                }
                root.set('display', display)
            }
        }
        /* EntityTag */ {
            if (Items.hasEntityTag(item)) {
                let entityTag = root.get('EntityTag')
                if (entityTag instanceof NbtCompound) {
                    entityTag = getNbt(Updater.upEntityNbt(entityTag.toString()))
                    root.set('EntityTag', entityTag)
                }
            }
        }

        return root.toString()
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
                sel.parse1_12(json.selector)
                json.selector = sel.get1_13()
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

            return JSON.stringify(json)
        }
    }

    public static upParticle(input: string) {
        return Particles.get1_13NominalIDFrom1_12NominalID(input)
    }

    public static upScbCrit(input: string) {
        if (input.slice(0, 5) === 'stat.') {
            const subs = input.split(/\./g)
            const newCrit = ScoreboardCriterias.get1_13From1_12(subs[1])
            switch (subs[1]) {
                case 'mineBlock':
                    let block = ''
                    if (isNumeric(subs[2])) {
                        block = Blocks.get1_13NominalIDFrom1_12NumericID(Number(subs[2]))
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '')
                    } else {
                        block = Blocks.get1_13NominalIDFrom1_12NominalID(
                            Blocks.get1_12NominalIDFrom1_12StringID(`${subs[2]}:${subs[3]}`)
                        )
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
                        item = Items.get1_13NominalIDFrom1_12NominalIDWithDataValue(
                            Items.get1_12NominalIDFrom1_12NumericID(Number(subs[2]))
                        )
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '')
                    } else {
                        item = Items.get1_13NominalIDFrom1_12NominalIDWithDataValue(`${subs[2]}:${subs[3]}`)
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '')
                    }
                    return `minecraft.${newCrit}:${item}`
                case 'killEntity':
                case 'entityKilledBy':
                    const entity = Entities.get1_13NominalIDFrom1_12NominalID(
                        Entities.get1_12NominalIDFrom1_10FuckingID(subs[2])
                    ).replace(/:/g, '.')
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
}
