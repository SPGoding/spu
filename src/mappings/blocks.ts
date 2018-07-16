import { NbtCompound, NbtList, NbtString, NbtInt, NbtByte, NbtValue, NbtShort } from '../utils/nbt/nbt'
import Updater from '../updater'
import Items from './items'
import { getNbt } from '../utils/utils'
import { Number_Number_String_StringArray } from './mapping';

export class StdBlock {
    private name: string
    private states: string[]
    private nbt: NbtCompound

    public constructor(name: string, states: string[], nbt: NbtCompound) {
        this.name = name
        this.states = states.sort()
        this.nbt = nbt
    }

    public getName() {
        return this.name
    }

    public getStates() {
        return this.states
    }

    public getNbt() {
        return this.nbt
    }

    public getFull() {
        let state = ''
        let nbt = ''
        if (this.hasStates()) {
            state = `[${this.states.join()}]`
        }
        if (this.hasNbt()) {
            nbt = this.nbt.toString()
        }
        return `${this.name}${state}${nbt}`
    }

    public getNominal() {
        let state = ''
        if (this.hasStates()) {
            state = `[${this.states.join()}]`
        }
        return `${this.name}${state}`
    }

    public hasStates() {
        return this.states.length >= 1
    }

    public hasNbt() {
        return this.nbt.toString() !== '{}'
    }
}

/**
 * Providing a map storing old block IDs and new block IDs.
 */
export default class Blocks {
    public static std1_12(id?: number, name?: string, data?: number, state?: string, nbt?: string): StdBlock {
        let ansName: string
        let ansStates: string[]
        let ansNbt: NbtCompound
        if (id && !name && !state) {
            if (!data) {
                data = 0
                while (id > 255) {
                    data += 1
                    id -= 4096
                }
            }
            if (!nbt) {
                nbt = '{}'
            }
            const arr = Blocks.ID_Data_Name_States.find(v => v[0] === id && v[1] === data)
            if (arr) {
                ansName = arr[2]
                ansStates = arr[3]
            } else {
                throw `Unknown block ID: '${id}:${data}'.`
            }
        } else if (name && !id) {
            if (name.slice(0, 10) !== 'minecraft:') {
                name = `minecraft:${name}`
            }
            ansName = name
            if (!nbt) {
                nbt = '{}'
            }
            if (!data && !state) {
                const arr = Blocks.ID_Data_Name_States.find(v => v[2] === name)
                if (arr) {
                    ansStates = arr[3]
                } else {
                    throw `Unknown block ID: '${name}'.`
                }
            } else if (!data && state) {
                const arr = Blocks.ID_Data_Name_States.find(v => v[2] === name)
                if (arr) {
                    const defaultStates = arr[3]
                    ansStates = Blocks.combineStates(defaultStates, state.split(','))
                } else {
                    throw `Unknown block ID: '${name}'.`
                }
            } else if (data && !state) {
                const arr = Blocks.ID_Data_Name_States.find(v => v[1] === data && v[2] === name)
                if (arr) {
                    ansStates = arr[3]
                } else {
                    throw `Unknown block ID: '${name}:${data}'.`
                }
            } else {
                throw `Argument Error! Used ${id ? 'id, ' : ''}${data ? 'data, ' : ''}${name ? 'name, ' : ''}${
                    state ? 'state, ' : ''
                }${nbt ? 'nbt, ' : ''}.`
            }
        } else {
            throw `Argument Error! Used ${id ? 'id, ' : ''}${data ? 'data, ' : ''}${name ? 'name, ' : ''}${
                state ? 'state, ' : ''
            }${nbt && nbt !== '{}' ? 'nbt, ' : ''}.`
        }
        ansNbt = getNbt(nbt)
        return new StdBlock(ansName, ansStates, ansNbt)
    }

    public static to1_13(std: StdBlock): StdBlock {
        let ansName = std.getName()
        let ansStates = std.getStates()
        let ansNbt = std.getNbt()

        const arr = Blocks.Nominal1_12_Nominal1_13.find(v => v.indexOf(std.getNominal()) >= 1)
        if (arr) {
            ansName = arr[0].split('[')[0]
            ansStates = Blocks.getStatesFromNominal(arr[0])
        }
        switch (ansName) {
            case 'minecraft:black_banner':
            case 'minecraft:white_banner': {
                /* CustomName */ {
                    const customName = ansNbt.get('CustomName')
                    if (customName instanceof NbtString) {
                        customName.set(Updater.upPreJson(customName.get()))
                    }
                }
                /* Base */ {
                    const base = ansNbt.get('Base')
                    ansNbt.del('Base')
                    if (base instanceof NbtInt) {
                        ansName = `${Items.toNominalColor(15 - base.get(), 'banner')}`
                    }
                }
                /* Patterns[n].Color */ {
                    const patterns = ansNbt.get('Patterns')
                    if (patterns instanceof NbtList) {
                        patterns.forEach((p: NbtValue) => {
                            if (p instanceof NbtCompound) {
                                const color = p.get('Color')
                                if (color instanceof NbtInt) {
                                    color.set(15 - color.get())
                                }
                            }
                        })
                    }
                }
                break
            }
            case 'minecraft:white_wall_banner': {
                /* CustomName */ {
                    const customName = ansNbt.get('CustomName')
                    if (customName instanceof NbtString) {
                        customName.set(Updater.upPreJson(customName.get()))
                    }
                }
                /* Base */ {
                    const base = ansNbt.get('Base')
                    ansNbt.del('Base')
                    if (base instanceof NbtInt) {
                        ansName = `${Items.toNominalColor(base.get(), 'wall_banner')}`
                    }
                }
                /* Patterns[n].Color */ {
                    const patterns = ansNbt.get('Patterns')
                    if (patterns instanceof NbtList) {
                        patterns.forEach((p: NbtValue) => {
                            if (p instanceof NbtCompound) {
                                const color = p.get('Color')
                                if (color instanceof NbtInt) {
                                    color.set(15 - color.get())
                                }
                            }
                        })
                    }
                }
                break
            }
            case 'minecraft:enchanting_table': {
                /* CustomName */ {
                    const customName = ansNbt.get('CustomName')
                    if (customName instanceof NbtString) {
                        customName.set(Updater.upPreJson(customName.get()))
                    }
                }
                break
            }
            case 'minecraft:red_bed': {
                /* color */ {
                    const color = ansNbt.get('color')
                    ansNbt.del('color')
                    if (color instanceof NbtInt) {
                        ansName = Items.toNominalColor(color.get(), 'bed')
                    }
                }
                break
            }
            case 'minecraft:cauldron': {
                /* Items */ {
                    const items = ansNbt.get('Items')
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
                    const customName = ansNbt.get('CustomName')
                    if (customName instanceof NbtString) {
                        customName.set(Updater.upPreJson(customName.get()))
                    }
                }
                /* Items */ {
                    const items = ansNbt.get('Items')
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
            case 'minecraft:command_block':
            case 'minecraft:repeating_command_block':
            case 'minecraft:chain_command_block': {
                /* CustomName */ {
                    const customName = ansNbt.get('CustomName')
                    if (customName instanceof NbtString) {
                        customName.set(Updater.upPreJson(customName.get()))
                    }
                }
                /* Command */ {
                    const command = ansNbt.get('Command')
                    if (command instanceof NbtString) {
                        command.set(Updater.upCommand(command.get(), false))
                    }
                }
                break
            }
            case 'minecraft:potted_cactus': {
                /* Item & Data */ {
                    const item = ansNbt.get('Item')
                    const data = ansNbt.get('Data')
                    if (item instanceof NbtString && data instanceof NbtInt) {
                        ansName = `minecraft:potted_${Blocks.to1_13(Blocks.std1_12(undefined, item.get(), data.get()))
                            .getName()
                            .replace('minecraft:', '')}`
                    }
                }
                break
            }
            case 'minecraft:jukebox': {
                /* Record */ {
                    ansNbt.del('Record')
                }
                /* RecordItem */ {
                    let item = ansNbt.get('RecordItem')
                    if (item instanceof NbtString) {
                        item = getNbt(Updater.upItemNbt(item.toString()))
                        ansNbt.set('RecordItem', item)
                    }
                }
                break
            }
            case 'minecraft:mob_spawner': {
                /* SpawnPotentials */ {
                    const spawnPotentials = ansNbt.get('SpawnPotentials')
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
                    let spawnData = ansNbt.get('SpawnData')
                    if (spawnData instanceof NbtCompound) {
                        spawnData = getNbt(Updater.upEntityNbt(spawnData.toString()))
                        ansNbt.set('SpawnData', spawnData)
                    }
                }
                break
            }
            case 'minecraft:note_block': {
                /* note & powered */ {
                    const note = ansNbt.get('note')
                    const powered = ansNbt.get('powered')
                    if (
                        (note instanceof NbtByte || note instanceof NbtInt) &&
                        (powered instanceof NbtByte || powered instanceof NbtInt)
                    ) {
                        ansStates = Blocks.combineStates(ansStates, [
                            `pitch=${note.get()}`,
                            `powered=${powered.get() !== 0}`
                        ])
                    } else if (note instanceof NbtByte || note instanceof NbtInt) {
                        ansStates = Blocks.combineStates(ansStates, [`pitch=${note.get()}`])
                    } else if (powered instanceof NbtByte || powered instanceof NbtInt) {
                        ansStates = Blocks.combineStates(ansStates, [`powered=${powered.get() !== 0}`])
                    }
                }
                break
            }
            case 'minecraft:piston': {
                /* blockId & blockData */ {
                    const blockID = ansNbt.get('blockId')
                    const blockData = ansNbt.get('blockData')
                    ansNbt.del('blockId')
                    ansNbt.del('blockData')
                    if (blockID instanceof NbtInt && (blockData instanceof NbtInt || blockData === undefined)) {
                        const blockState = Blocks.upNumericToBlockState(blockID, blockData)
                        ansNbt.set('blockState', blockState)
                    }
                }
                break
            }
            case 'minecraft:sign': {
                /* Text1 */ {
                    const text = ansNbt.get('Text1')
                    if (text instanceof NbtString) {
                        text.set(Updater.upJson(text.get()))
                    }
                }
                /* Text2 */ {
                    const text = ansNbt.get('Text2')
                    if (text instanceof NbtString) {
                        text.set(Updater.upJson(text.get()))
                    }
                }
                /* Text3 */ {
                    const text = ansNbt.get('Text3')
                    if (text instanceof NbtString) {
                        text.set(Updater.upJson(text.get()))
                    }
                }
                /* Text4 */ {
                    const text = ansNbt.get('Text4')
                    if (text instanceof NbtString) {
                        text.set(Updater.upJson(text.get()))
                    }
                }
                break
            }
            case 'minecraft:skeleton_skull': {
                /* SkullType & Rot */ {
                    const skullType = ansNbt.get('SkullType')
                    const rot = ansNbt.get('Rot')
                    ansNbt.del('SkullType')
                    ansNbt.del('Rot')

                    let skullIDPrefix: 'skeleton' | 'wither_skeleton' | 'zombie' | 'player' | 'creeper' | 'dragon'
                    let skullIDSuffix: 'skull' | 'head'

                    if (skullType instanceof NbtByte || skullType instanceof NbtInt) {
                        switch (skullType.get()) {
                            case 0:
                                skullIDPrefix = 'skeleton'
                                skullIDSuffix = 'skull'
                                break
                            case 1:
                                skullIDPrefix = 'wither_skeleton'
                                skullIDSuffix = 'skull'
                                break
                            case 2:
                                skullIDPrefix = 'zombie'
                                skullIDSuffix = 'head'
                                break
                            case 3:
                                skullIDPrefix = 'player'
                                skullIDSuffix = 'head'
                                break
                            case 4:
                                skullIDPrefix = 'creeper'
                                skullIDSuffix = 'head'
                                break
                            case 5:
                                skullIDPrefix = 'dragon'
                                skullIDSuffix = 'head'
                                break
                            default:
                                skullIDPrefix = 'skeleton'
                                skullIDSuffix = 'skull'
                                break
                        }
                    } else {
                        skullIDPrefix = 'skeleton'
                        skullIDSuffix = 'skull'
                    }
                    if (std.getStates().indexOf('facing=up') !== -1 || std.getStates().indexOf('facing=down') !== -1) {
                        // Floor
                        ansName = `${skullIDPrefix}_${skullIDSuffix}`
                        if (rot instanceof NbtByte || rot instanceof NbtInt) {
                            ansStates = [`rotation=${rot.get()}`]
                        } else {
                            ansStates = [`rotation=0`]
                        }
                    } else {
                        // Wall
                        const arr = std.getStates().find(v => v.slice(0, 7) === 'facing=')
                        let facing = 'north'
                        if (arr) {
                            facing = arr.split('=')[1]
                        }
                        ansName = `${skullIDPrefix}_wall_${skullIDSuffix}`
                        ansStates = [`facing=${facing}`]
                    }
                }
                break
            }
            default:
                break
        }

        return new StdBlock(ansName, ansStates, ansNbt)
    }

    public static upNumericToBlockState(id: NbtShort | NbtInt, data?: NbtShort | NbtInt) {
        const blockState = new NbtCompound()
        const name = new NbtString()
        const properties = new NbtCompound()
        const metadata = data ? data.get() : 0
        const std = Blocks.to1_13(Blocks.std1_12(id.get(), undefined, metadata))
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

    public static upStringToBlockState(id: NbtString, data?: NbtByte | NbtInt) {
        const blockState = new NbtCompound()
        const name = new NbtString()
        const properties = new NbtCompound()
        const metadata = data ? data.get() : 0
        const std = Blocks.to1_13(Blocks.std1_12(undefined, id.get(), metadata))
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

    private static getStatesFromNominal(input: string) {
        let arr = input.split('[')
        if (arr.length === 2) {
            return arr[1].slice(0, -1).split(',')
        } else {
            return []
        }
    }

    /**
     * @param defaultStates Defualt states without square('[' and ']').
     * @param customStates Custom states. Will replace the default states.
     */
    public static combineStates(defaultStates: string[], customStates: string[]) {
        let ans: string[] = []
        for (const i of defaultStates) {
            const str = customStates.find(v => v.split('=')[0] === i.split('=')[0])
            if (str) {
                ans.push(str)
            } else {
                ans.push(i)
            }
        }

        return ans
    }

    /**
     * @example
     * [
     *     ['1.13 Nominal ID', ..'1.12 Normlaize ID']
     * ]
     */
    public static Nominal1_12_Nominal1_13: string[][] = [
        ['minecraft:air', 'minecraft:air'],
        ['minecraft:stone', 'minecraft:stone[variant=stone]'],
        ['minecraft:granite', 'minecraft:stone[variant=granite]'],
        ['minecraft:polished_granite', 'minecraft:stone[variant=smooth_granite]'],
        ['minecraft:diorite', 'minecraft:stone[variant=diorite]'],
        ['minecraft:polished_diorite', 'minecraft:stone[variant=smooth_diorite]'],
        ['minecraft:andesite', 'minecraft:stone[variant=andesite]'],
        ['minecraft:polished_andesite', 'minecraft:stone[variant=smooth_andesite]'],
        ['minecraft:grass_block[snowy=false]', 'minecraft:grass[snowy=false]', 'minecraft:grass[snowy=true]'],
        ['minecraft:dirt', 'minecraft:dirt[snowy=false,variant=dirt]', 'minecraft:dirt[snowy=true,variant=dirt]'],
        [
            'minecraft:coarse_dirt',
            'minecraft:dirt[snowy=false,variant=coarse_dirt]',
            'minecraft:dirt[snowy=true,variant=coarse_dirt]'
        ],
        [
            'minecraft:podzol[snowy=false]',
            'minecraft:dirt[snowy=false,variant=podzol]',
            'minecraft:dirt[snowy=true,variant=podzol]'
        ],
        ['minecraft:cobblestone', 'minecraft:cobblestone'],
        ['minecraft:oak_planks', 'minecraft:planks[variant=oak]'],
        ['minecraft:spruce_planks', 'minecraft:planks[variant=spruce]'],
        ['minecraft:birch_planks', 'minecraft:planks[variant=birch]'],
        ['minecraft:jungle_planks', 'minecraft:planks[variant=jungle]'],
        ['minecraft:acacia_planks', 'minecraft:planks[variant=acacia]'],
        ['minecraft:dark_oak_planks', 'minecraft:planks[variant=dark_oak]'],
        ['minecraft:oak_sapling[stage=0]', 'minecraft:sapling[stage=0,type=oak]'],
        ['minecraft:spruce_sapling[stage=0]', 'minecraft:sapling[stage=0,type=spruce]'],
        ['minecraft:birch_sapling[stage=0]', 'minecraft:sapling[stage=0,type=birch]'],
        ['minecraft:jungle_sapling[stage=0]', 'minecraft:sapling[stage=0,type=jungle]'],
        ['minecraft:acacia_sapling[stage=0]', 'minecraft:sapling[stage=0,type=acacia]'],
        ['minecraft:dark_oak_sapling[stage=0]', 'minecraft:sapling[stage=0,type=dark_oak]'],
        ['minecraft:oak_sapling[stage=1]', 'minecraft:sapling[stage=1,type=oak]'],
        ['minecraft:spruce_sapling[stage=1]', 'minecraft:sapling[stage=1,type=spruce]'],
        ['minecraft:birch_sapling[stage=1]', 'minecraft:sapling[stage=1,type=birch]'],
        ['minecraft:jungle_sapling[stage=1]', 'minecraft:sapling[stage=1,type=jungle]'],
        ['minecraft:acacia_sapling[stage=1]', 'minecraft:sapling[stage=1,type=acacia]'],
        ['minecraft:dark_oak_sapling[stage=1]', 'minecraft:sapling[stage=1,type=dark_oak]'],
        ['minecraft:bedrock', 'minecraft:bedrock'],
        ['minecraft:water[level=0]', 'minecraft:flowing_water[level=0]'],
        ['minecraft:water[level=1]', 'minecraft:flowing_water[level=1]'],
        ['minecraft:water[level=2]', 'minecraft:flowing_water[level=2]'],
        ['minecraft:water[level=3]', 'minecraft:flowing_water[level=3]'],
        ['minecraft:water[level=4]', 'minecraft:flowing_water[level=4]'],
        ['minecraft:water[level=5]', 'minecraft:flowing_water[level=5]'],
        ['minecraft:water[level=6]', 'minecraft:flowing_water[level=6]'],
        ['minecraft:water[level=7]', 'minecraft:flowing_water[level=7]'],
        ['minecraft:water[level=8]', 'minecraft:flowing_water[level=8]'],
        ['minecraft:water[level=9]', 'minecraft:flowing_water[level=9]'],
        ['minecraft:water[level=10]', 'minecraft:flowing_water[level=10]'],
        ['minecraft:water[level=11]', 'minecraft:flowing_water[level=11]'],
        ['minecraft:water[level=12]', 'minecraft:flowing_water[level=12]'],
        ['minecraft:water[level=13]', 'minecraft:flowing_water[level=13]'],
        ['minecraft:water[level=14]', 'minecraft:flowing_water[level=14]'],
        ['minecraft:water[level=15]', 'minecraft:flowing_water[level=15]'],
        ['minecraft:water[level=0]', 'minecraft:water[level=0]'],
        ['minecraft:water[level=1]', 'minecraft:water[level=1]'],
        ['minecraft:water[level=2]', 'minecraft:water[level=2]'],
        ['minecraft:water[level=3]', 'minecraft:water[level=3]'],
        ['minecraft:water[level=4]', 'minecraft:water[level=4]'],
        ['minecraft:water[level=5]', 'minecraft:water[level=5]'],
        ['minecraft:water[level=6]', 'minecraft:water[level=6]'],
        ['minecraft:water[level=7]', 'minecraft:water[level=7]'],
        ['minecraft:water[level=8]', 'minecraft:water[level=8]'],
        ['minecraft:water[level=9]', 'minecraft:water[level=9]'],
        ['minecraft:water[level=10]', 'minecraft:water[level=10]'],
        ['minecraft:water[level=11]', 'minecraft:water[level=11]'],
        ['minecraft:water[level=12]', 'minecraft:water[level=12]'],
        ['minecraft:water[level=13]', 'minecraft:water[level=13]'],
        ['minecraft:water[level=14]', 'minecraft:water[level=14]'],
        ['minecraft:water[level=15]', 'minecraft:water[level=15]'],
        ['minecraft:lava[level=0]', 'minecraft:flowing_lava[level=0]'],
        ['minecraft:lava[level=1]', 'minecraft:flowing_lava[level=1]'],
        ['minecraft:lava[level=2]', 'minecraft:flowing_lava[level=2]'],
        ['minecraft:lava[level=3]', 'minecraft:flowing_lava[level=3]'],
        ['minecraft:lava[level=4]', 'minecraft:flowing_lava[level=4]'],
        ['minecraft:lava[level=5]', 'minecraft:flowing_lava[level=5]'],
        ['minecraft:lava[level=6]', 'minecraft:flowing_lava[level=6]'],
        ['minecraft:lava[level=7]', 'minecraft:flowing_lava[level=7]'],
        ['minecraft:lava[level=8]', 'minecraft:flowing_lava[level=8]'],
        ['minecraft:lava[level=9]', 'minecraft:flowing_lava[level=9]'],
        ['minecraft:lava[level=10]', 'minecraft:flowing_lava[level=10]'],
        ['minecraft:lava[level=11]', 'minecraft:flowing_lava[level=11]'],
        ['minecraft:lava[level=12]', 'minecraft:flowing_lava[level=12]'],
        ['minecraft:lava[level=13]', 'minecraft:flowing_lava[level=13]'],
        ['minecraft:lava[level=14]', 'minecraft:flowing_lava[level=14]'],
        ['minecraft:lava[level=15]', 'minecraft:flowing_lava[level=15]'],
        ['minecraft:lava[level=0]', 'minecraft:lava[level=0]'],
        ['minecraft:lava[level=1]', 'minecraft:lava[level=1]'],
        ['minecraft:lava[level=2]', 'minecraft:lava[level=2]'],
        ['minecraft:lava[level=3]', 'minecraft:lava[level=3]'],
        ['minecraft:lava[level=4]', 'minecraft:lava[level=4]'],
        ['minecraft:lava[level=5]', 'minecraft:lava[level=5]'],
        ['minecraft:lava[level=6]', 'minecraft:lava[level=6]'],
        ['minecraft:lava[level=7]', 'minecraft:lava[level=7]'],
        ['minecraft:lava[level=8]', 'minecraft:lava[level=8]'],
        ['minecraft:lava[level=9]', 'minecraft:lava[level=9]'],
        ['minecraft:lava[level=10]', 'minecraft:lava[level=10]'],
        ['minecraft:lava[level=11]', 'minecraft:lava[level=11]'],
        ['minecraft:lava[level=12]', 'minecraft:lava[level=12]'],
        ['minecraft:lava[level=13]', 'minecraft:lava[level=13]'],
        ['minecraft:lava[level=14]', 'minecraft:lava[level=14]'],
        ['minecraft:lava[level=15]', 'minecraft:lava[level=15]'],
        ['minecraft:sand', 'minecraft:sand[variant=sand]'],
        ['minecraft:red_sand', 'minecraft:sand[variant=red_sand]'],
        ['minecraft:gravel', 'minecraft:gravel'],
        ['minecraft:gold_ore', 'minecraft:gold_ore'],
        ['minecraft:iron_ore', 'minecraft:iron_ore'],
        ['minecraft:coal_ore', 'minecraft:coal_ore'],
        ['minecraft:oak_log[axis=y]', 'minecraft:log[axis=y,variant=oak]'],
        ['minecraft:spruce_log[axis=y]', 'minecraft:log[axis=y,variant=spruce]'],
        ['minecraft:birch_log[axis=y]', 'minecraft:log[axis=y,variant=birch]'],
        ['minecraft:jungle_log[axis=y]', 'minecraft:log[axis=y,variant=jungle]'],
        ['minecraft:oak_log[axis=x]', 'minecraft:log[axis=x,variant=oak]'],
        ['minecraft:spruce_log[axis=x]', 'minecraft:log[axis=x,variant=spruce]'],
        ['minecraft:birch_log[axis=x]', 'minecraft:log[axis=x,variant=birch]'],
        ['minecraft:jungle_log[axis=x]', 'minecraft:log[axis=x,variant=jungle]'],
        ['minecraft:oak_log[axis=z]', 'minecraft:log[axis=z,variant=oak]'],
        ['minecraft:spruce_log[axis=z]', 'minecraft:log[axis=z,variant=spruce]'],
        ['minecraft:birch_log[axis=z]', 'minecraft:log[axis=z,variant=birch]'],
        ['minecraft:jungle_log[axis=z]', 'minecraft:log[axis=z,variant=jungle]'],
        ['minecraft:oak_wood', 'minecraft:log[axis=none,variant=oak]'],
        ['minecraft:spruce_wood', 'minecraft:log[axis=none,variant=spruce]'],
        ['minecraft:birch_wood', 'minecraft:log[axis=none,variant=birch]'],
        ['minecraft:jungle_wood', 'minecraft:log[axis=none,variant=jungle]'],
        [
            'minecraft:oak_leaves[check_decay=false,decayable=true]',
            'minecraft:leaves[check_decay=false,decayable=true,variant=oak]'
        ],
        [
            'minecraft:spruce_leaves[check_decay=false,decayable=true]',
            'minecraft:leaves[check_decay=false,decayable=true,variant=spruce]'
        ],
        [
            'minecraft:birch_leaves[check_decay=false,decayable=true]',
            'minecraft:leaves[check_decay=false,decayable=true,variant=birch]'
        ],
        [
            'minecraft:jungle_leaves[check_decay=false,decayable=true]',
            'minecraft:leaves[check_decay=false,decayable=true,variant=jungle]'
        ],
        [
            'minecraft:oak_leaves[check_decay=false,decayable=false]',
            'minecraft:leaves[check_decay=false,decayable=false,variant=oak]'
        ],
        [
            'minecraft:spruce_leaves[check_decay=false,decayable=false]',
            'minecraft:leaves[check_decay=false,decayable=false,variant=spruce]'
        ],
        [
            'minecraft:birch_leaves[check_decay=false,decayable=false]',
            'minecraft:leaves[check_decay=false,decayable=false,variant=birch]'
        ],
        [
            'minecraft:jungle_leaves[check_decay=false,decayable=false]',
            'minecraft:leaves[check_decay=false,decayable=false,variant=jungle]'
        ],
        [
            'minecraft:oak_leaves[check_decay=true,decayable=true]',
            'minecraft:leaves[check_decay=true,decayable=true,variant=oak]'
        ],
        [
            'minecraft:spruce_leaves[check_decay=true,decayable=true]',
            'minecraft:leaves[check_decay=true,decayable=true,variant=spruce]'
        ],
        [
            'minecraft:birch_leaves[check_decay=true,decayable=true]',
            'minecraft:leaves[check_decay=true,decayable=true,variant=birch]'
        ],
        [
            'minecraft:jungle_leaves[check_decay=true,decayable=true]',
            'minecraft:leaves[check_decay=true,decayable=true,variant=jungle]'
        ],
        [
            'minecraft:oak_leaves[check_decay=true,decayable=false]',
            'minecraft:leaves[check_decay=true,decayable=false,variant=oak]'
        ],
        [
            'minecraft:spruce_leaves[check_decay=true,decayable=false]',
            'minecraft:leaves[check_decay=true,decayable=false,variant=spruce]'
        ],
        [
            'minecraft:birch_leaves[check_decay=true,decayable=false]',
            'minecraft:leaves[check_decay=true,decayable=false,variant=birch]'
        ],
        [
            'minecraft:jungle_leaves[check_decay=true,decayable=false]',
            'minecraft:leaves[check_decay=true,decayable=false,variant=jungle]'
        ],
        ['minecraft:sponge', 'minecraft:sponge[wet=false]'],
        ['minecraft:wet_sponge', 'minecraft:sponge[wet=true]'],
        ['minecraft:glass', 'minecraft:glass'],
        ['minecraft:lapis_ore', 'minecraft:lapis_ore'],
        ['minecraft:lapis_block', 'minecraft:lapis_block'],
        ['minecraft:dispenser[facing=down,triggered=false]', 'minecraft:dispenser[facing=down,triggered=false]'],
        ['minecraft:dispenser[facing=up,triggered=false]', 'minecraft:dispenser[facing=up,triggered=false]'],
        ['minecraft:dispenser[facing=north,triggered=false]', 'minecraft:dispenser[facing=north,triggered=false]'],
        ['minecraft:dispenser[facing=south,triggered=false]', 'minecraft:dispenser[facing=south,triggered=false]'],
        ['minecraft:dispenser[facing=west,triggered=false]', 'minecraft:dispenser[facing=west,triggered=false]'],
        ['minecraft:dispenser[facing=east,triggered=false]', 'minecraft:dispenser[facing=east,triggered=false]'],
        ['minecraft:dispenser[facing=down,triggered=true]', 'minecraft:dispenser[facing=down,triggered=true]'],
        ['minecraft:dispenser[facing=up,triggered=true]', 'minecraft:dispenser[facing=up,triggered=true]'],
        ['minecraft:dispenser[facing=north,triggered=true]', 'minecraft:dispenser[facing=north,triggered=true]'],
        ['minecraft:dispenser[facing=south,triggered=true]', 'minecraft:dispenser[facing=south,triggered=true]'],
        ['minecraft:dispenser[facing=west,triggered=true]', 'minecraft:dispenser[facing=west,triggered=true]'],
        ['minecraft:dispenser[facing=east,triggered=true]', 'minecraft:dispenser[facing=east,triggered=true]'],
        ['minecraft:sandstone', 'minecraft:sandstone[type=sandstone]'],
        ['minecraft:chiseled_sandstone', 'minecraft:sandstone[type=chiseled_sandstone]'],
        ['minecraft:cut_sandstone', 'minecraft:sandstone[type=smooth_sandstone]'],
        ['minecraft:note_block', 'minecraft:noteblock'],
        [
            'minecraft:red_bed[facing=south,occupied=false,part=foot]',
            'minecraft:bed[facing=south,occupied=false,part=foot]',
            'minecraft:bed[facing=south,occupied=true,part=foot]'
        ],
        [
            'minecraft:red_bed[facing=west,occupied=false,part=foot]',
            'minecraft:bed[facing=west,occupied=false,part=foot]',
            'minecraft:bed[facing=west,occupied=true,part=foot]'
        ],
        [
            'minecraft:red_bed[facing=north,occupied=false,part=foot]',
            'minecraft:bed[facing=north,occupied=false,part=foot]',
            'minecraft:bed[facing=north,occupied=true,part=foot]'
        ],
        [
            'minecraft:red_bed[facing=east,occupied=false,part=foot]',
            'minecraft:bed[facing=east,occupied=false,part=foot]',
            'minecraft:bed[facing=east,occupied=true,part=foot]'
        ],
        [
            'minecraft:red_bed[facing=south,occupied=false,part=head]',
            'minecraft:bed[facing=south,occupied=false,part=head]'
        ],
        [
            'minecraft:red_bed[facing=west,occupied=false,part=head]',
            'minecraft:bed[facing=west,occupied=false,part=head]'
        ],
        [
            'minecraft:red_bed[facing=north,occupied=false,part=head]',
            'minecraft:bed[facing=north,occupied=false,part=head]'
        ],
        [
            'minecraft:red_bed[facing=east,occupied=false,part=head]',
            'minecraft:bed[facing=east,occupied=false,part=head]'
        ],
        [
            'minecraft:red_bed[facing=south,occupied=true,part=head]',
            'minecraft:bed[facing=south,occupied=true,part=head]'
        ],
        [
            'minecraft:red_bed[facing=west,occupied=true,part=head]',
            'minecraft:bed[facing=west,occupied=true,part=head]'
        ],
        [
            'minecraft:red_bed[facing=north,occupied=true,part=head]',
            'minecraft:bed[facing=north,occupied=true,part=head]'
        ],
        [
            'minecraft:red_bed[facing=east,occupied=true,part=head]',
            'minecraft:bed[facing=east,occupied=true,part=head]'
        ],
        [
            'minecraft:powered_rail[powered=false,shape=north_south]',
            'minecraft:golden_rail[powered=false,shape=north_south]'
        ],
        [
            'minecraft:powered_rail[powered=false,shape=east_west]',
            'minecraft:golden_rail[powered=false,shape=east_west]'
        ],
        [
            'minecraft:powered_rail[powered=false,shape=ascending_east]',
            'minecraft:golden_rail[powered=false,shape=ascending_east]'
        ],
        [
            'minecraft:powered_rail[powered=false,shape=ascending_west]',
            'minecraft:golden_rail[powered=false,shape=ascending_west]'
        ],
        [
            'minecraft:powered_rail[powered=false,shape=ascending_north]',
            'minecraft:golden_rail[powered=false,shape=ascending_north]'
        ],
        [
            'minecraft:powered_rail[powered=false,shape=ascending_south]',
            'minecraft:golden_rail[powered=false,shape=ascending_south]'
        ],
        [
            'minecraft:powered_rail[powered=true,shape=north_south]',
            'minecraft:golden_rail[powered=true,shape=north_south]'
        ],
        ['minecraft:powered_rail[powered=true,shape=east_west]', 'minecraft:golden_rail[powered=true,shape=east_west]'],
        [
            'minecraft:powered_rail[powered=true,shape=ascending_east]',
            'minecraft:golden_rail[powered=true,shape=ascending_east]'
        ],
        [
            'minecraft:powered_rail[powered=true,shape=ascending_west]',
            'minecraft:golden_rail[powered=true,shape=ascending_west]'
        ],
        [
            'minecraft:powered_rail[powered=true,shape=ascending_north]',
            'minecraft:golden_rail[powered=true,shape=ascending_north]'
        ],
        [
            'minecraft:powered_rail[powered=true,shape=ascending_south]',
            'minecraft:golden_rail[powered=true,shape=ascending_south]'
        ],
        [
            'minecraft:detector_rail[powered=false,shape=north_south]',
            'minecraft:detector_rail[powered=false,shape=north_south]'
        ],
        [
            'minecraft:detector_rail[powered=false,shape=east_west]',
            'minecraft:detector_rail[powered=false,shape=east_west]'
        ],
        [
            'minecraft:detector_rail[powered=false,shape=ascending_east]',
            'minecraft:detector_rail[powered=false,shape=ascending_east]'
        ],
        [
            'minecraft:detector_rail[powered=false,shape=ascending_west]',
            'minecraft:detector_rail[powered=false,shape=ascending_west]'
        ],
        [
            'minecraft:detector_rail[powered=false,shape=ascending_north]',
            'minecraft:detector_rail[powered=false,shape=ascending_north]'
        ],
        [
            'minecraft:detector_rail[powered=false,shape=ascending_south]',
            'minecraft:detector_rail[powered=false,shape=ascending_south]'
        ],
        [
            'minecraft:detector_rail[powered=true,shape=north_south]',
            'minecraft:detector_rail[powered=true,shape=north_south]'
        ],
        [
            'minecraft:detector_rail[powered=true,shape=east_west]',
            'minecraft:detector_rail[powered=true,shape=east_west]'
        ],
        [
            'minecraft:detector_rail[powered=true,shape=ascending_east]',
            'minecraft:detector_rail[powered=true,shape=ascending_east]'
        ],
        [
            'minecraft:detector_rail[powered=true,shape=ascending_west]',
            'minecraft:detector_rail[powered=true,shape=ascending_west]'
        ],
        [
            'minecraft:detector_rail[powered=true,shape=ascending_north]',
            'minecraft:detector_rail[powered=true,shape=ascending_north]'
        ],
        [
            'minecraft:detector_rail[powered=true,shape=ascending_south]',
            'minecraft:detector_rail[powered=true,shape=ascending_south]'
        ],
        ['minecraft:sticky_piston[extended=false,facing=down]', 'minecraft:sticky_piston[extended=false,facing=down]'],
        ['minecraft:sticky_piston[extended=false,facing=up]', 'minecraft:sticky_piston[extended=false,facing=up]'],
        [
            'minecraft:sticky_piston[extended=false,facing=north]',
            'minecraft:sticky_piston[extended=false,facing=north]'
        ],
        [
            'minecraft:sticky_piston[extended=false,facing=south]',
            'minecraft:sticky_piston[extended=false,facing=south]'
        ],
        ['minecraft:sticky_piston[extended=false,facing=west]', 'minecraft:sticky_piston[extended=false,facing=west]'],
        ['minecraft:sticky_piston[extended=false,facing=east]', 'minecraft:sticky_piston[extended=false,facing=east]'],
        ['minecraft:sticky_piston[extended=true,facing=down]', 'minecraft:sticky_piston[extended=true,facing=down]'],
        ['minecraft:sticky_piston[extended=true,facing=up]', 'minecraft:sticky_piston[extended=true,facing=up]'],
        ['minecraft:sticky_piston[extended=true,facing=north]', 'minecraft:sticky_piston[extended=true,facing=north]'],
        ['minecraft:sticky_piston[extended=true,facing=south]', 'minecraft:sticky_piston[extended=true,facing=south]'],
        ['minecraft:sticky_piston[extended=true,facing=west]', 'minecraft:sticky_piston[extended=true,facing=west]'],
        ['minecraft:sticky_piston[extended=true,facing=east]', 'minecraft:sticky_piston[extended=true,facing=east]'],
        ['minecraft:cobweb', 'minecraft:web'],
        ['minecraft:dead_bush', 'minecraft:tallgrass[type=dead_bush]'],
        ['minecraft:grass', 'minecraft:tallgrass[type=tall_grass]'],
        ['minecraft:fern', 'minecraft:tallgrass[type=fern]'],
        ['minecraft:dead_bush', 'minecraft:deadbush'],
        ['minecraft:piston[extended=false,facing=down]', 'minecraft:piston[extended=false,facing=down]'],
        ['minecraft:piston[extended=false,facing=up]', 'minecraft:piston[extended=false,facing=up]'],
        ['minecraft:piston[extended=false,facing=north]', 'minecraft:piston[extended=false,facing=north]'],
        ['minecraft:piston[extended=false,facing=south]', 'minecraft:piston[extended=false,facing=south]'],
        ['minecraft:piston[extended=false,facing=west]', 'minecraft:piston[extended=false,facing=west]'],
        ['minecraft:piston[extended=false,facing=east]', 'minecraft:piston[extended=false,facing=east]'],
        ['minecraft:piston[extended=true,facing=down]', 'minecraft:piston[extended=true,facing=down]'],
        ['minecraft:piston[extended=true,facing=up]', 'minecraft:piston[extended=true,facing=up]'],
        ['minecraft:piston[extended=true,facing=north]', 'minecraft:piston[extended=true,facing=north]'],
        ['minecraft:piston[extended=true,facing=south]', 'minecraft:piston[extended=true,facing=south]'],
        ['minecraft:piston[extended=true,facing=west]', 'minecraft:piston[extended=true,facing=west]'],
        ['minecraft:piston[extended=true,facing=east]', 'minecraft:piston[extended=true,facing=east]'],
        [
            'minecraft:piston_head[facing=down,short=false,type=normal]',
            'minecraft:piston_head[facing=down,short=false,type=normal]',
            'minecraft:piston_head[facing=down,short=true,type=normal]'
        ],
        [
            'minecraft:piston_head[facing=up,short=false,type=normal]',
            'minecraft:piston_head[facing=up,short=false,type=normal]',
            'minecraft:piston_head[facing=up,short=true,type=normal]'
        ],
        [
            'minecraft:piston_head[facing=north,short=false,type=normal]',
            'minecraft:piston_head[facing=north,short=false,type=normal]',
            'minecraft:piston_head[facing=north,short=true,type=normal]'
        ],
        [
            'minecraft:piston_head[facing=south,short=false,type=normal]',
            'minecraft:piston_head[facing=south,short=false,type=normal]',
            'minecraft:piston_head[facing=south,short=true,type=normal]'
        ],
        [
            'minecraft:piston_head[facing=west,short=false,type=normal]',
            'minecraft:piston_head[facing=west,short=false,type=normal]',
            'minecraft:piston_head[facing=west,short=true,type=normal]'
        ],
        [
            'minecraft:piston_head[facing=east,short=false,type=normal]',
            'minecraft:piston_head[facing=east,short=false,type=normal]',
            'minecraft:piston_head[facing=east,short=true,type=normal]'
        ],
        [
            'minecraft:piston_head[facing=down,short=false,type=sticky]',
            'minecraft:piston_head[facing=down,short=false,type=sticky]',
            'minecraft:piston_head[facing=down,short=true,type=sticky]'
        ],
        [
            'minecraft:piston_head[facing=up,short=false,type=sticky]',
            'minecraft:piston_head[facing=up,short=false,type=sticky]',
            'minecraft:piston_head[facing=up,short=true,type=sticky]'
        ],
        [
            'minecraft:piston_head[facing=north,short=false,type=sticky]',
            'minecraft:piston_head[facing=north,short=false,type=sticky]',
            'minecraft:piston_head[facing=north,short=true,type=sticky]'
        ],
        [
            'minecraft:piston_head[facing=south,short=false,type=sticky]',
            'minecraft:piston_head[facing=south,short=false,type=sticky]',
            'minecraft:piston_head[facing=south,short=true,type=sticky]'
        ],
        [
            'minecraft:piston_head[facing=west,short=false,type=sticky]',
            'minecraft:piston_head[facing=west,short=false,type=sticky]',
            'minecraft:piston_head[facing=west,short=true,type=sticky]'
        ],
        [
            'minecraft:piston_head[facing=east,short=false,type=sticky]',
            'minecraft:piston_head[facing=east,short=false,type=sticky]',
            'minecraft:piston_head[facing=east,short=true,type=sticky]'
        ],
        ['minecraft:white_wool', 'minecraft:wool[color=white]'],
        ['minecraft:orange_wool', 'minecraft:wool[color=orange]'],
        ['minecraft:magenta_wool', 'minecraft:wool[color=magenta]'],
        ['minecraft:light_blue_wool', 'minecraft:wool[color=light_blue]'],
        ['minecraft:yellow_wool', 'minecraft:wool[color=yellow]'],
        ['minecraft:lime_wool', 'minecraft:wool[color=lime]'],
        ['minecraft:pink_wool', 'minecraft:wool[color=pink]'],
        ['minecraft:gray_wool', 'minecraft:wool[color=gray]'],
        ['minecraft:light_gray_wool', 'minecraft:wool[color=silver]'],
        ['minecraft:cyan_wool', 'minecraft:wool[color=cyan]'],
        ['minecraft:purple_wool', 'minecraft:wool[color=purple]'],
        ['minecraft:blue_wool', 'minecraft:wool[color=blue]'],
        ['minecraft:brown_wool', 'minecraft:wool[color=brown]'],
        ['minecraft:green_wool', 'minecraft:wool[color=green]'],
        ['minecraft:red_wool', 'minecraft:wool[color=red]'],
        ['minecraft:black_wool', 'minecraft:wool[color=black]'],
        ['minecraft:moving_piston[facing=down,type=normal]', 'minecraft:piston_extension[facing=down,type=normal]'],
        ['minecraft:moving_piston[facing=up,type=normal]', 'minecraft:piston_extension[facing=up,type=normal]'],
        ['minecraft:moving_piston[facing=north,type=normal]', 'minecraft:piston_extension[facing=north,type=normal]'],
        ['minecraft:moving_piston[facing=south,type=normal]', 'minecraft:piston_extension[facing=south,type=normal]'],
        ['minecraft:moving_piston[facing=west,type=normal]', 'minecraft:piston_extension[facing=west,type=normal]'],
        ['minecraft:moving_piston[facing=east,type=normal]', 'minecraft:piston_extension[facing=east,type=normal]'],
        ['minecraft:moving_piston[facing=down,type=sticky]', 'minecraft:piston_extension[facing=down,type=sticky]'],
        ['minecraft:moving_piston[facing=up,type=sticky]', 'minecraft:piston_extension[facing=up,type=sticky]'],
        ['minecraft:moving_piston[facing=north,type=sticky]', 'minecraft:piston_extension[facing=north,type=sticky]'],
        ['minecraft:moving_piston[facing=south,type=sticky]', 'minecraft:piston_extension[facing=south,type=sticky]'],
        ['minecraft:moving_piston[facing=west,type=sticky]', 'minecraft:piston_extension[facing=west,type=sticky]'],
        ['minecraft:moving_piston[facing=east,type=sticky]', 'minecraft:piston_extension[facing=east,type=sticky]'],
        ['minecraft:dandelion', 'minecraft:yellow_flower[type=dandelion]'],
        ['minecraft:poppy', 'minecraft:red_flower[type=poppy]'],
        ['minecraft:blue_orchid', 'minecraft:red_flower[type=blue_orchid]'],
        ['minecraft:allium', 'minecraft:red_flower[type=allium]'],
        ['minecraft:azure_bluet', 'minecraft:red_flower[type=houstonia]'],
        ['minecraft:red_tulip', 'minecraft:red_flower[type=red_tulip]'],
        ['minecraft:orange_tulip', 'minecraft:red_flower[type=orange_tulip]'],
        ['minecraft:white_tulip', 'minecraft:red_flower[type=white_tulip]'],
        ['minecraft:pink_tulip', 'minecraft:red_flower[type=pink_tulip]'],
        ['minecraft:oxeye_daisy', 'minecraft:red_flower[type=oxeye_daisy]'],
        ['minecraft:brown_mushroom', 'minecraft:brown_mushroom'],
        ['minecraft:red_mushroom', 'minecraft:red_mushroom'],
        ['minecraft:gold_block', 'minecraft:gold_block'],
        ['minecraft:iron_block', 'minecraft:iron_block'],
        ['minecraft:stone_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=stone]'],
        ['minecraft:sandstone_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=sandstone]'],
        ['minecraft:petrified_oak_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=wood_old]'],
        ['minecraft:cobblestone_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=cobblestone]'],
        ['minecraft:brick_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=brick]'],
        ['minecraft:stone_brick_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=stone_brick]'],
        [
            'minecraft:nether_brick_slab[type=double]',
            'minecraft:double_stone_slab[seamless=false,variant=nether_brick]'
        ],
        ['minecraft:quartz_slab[type=double]', 'minecraft:double_stone_slab[seamless=false,variant=quartz]'],
        ['minecraft:smooth_stone', 'minecraft:double_stone_slab[seamless=true,variant=stone]'],
        ['minecraft:smooth_sandstone', 'minecraft:double_stone_slab[seamless=true,variant=sandstone]'],
        ['minecraft:petrified_oak_slab[type=double]', 'minecraft:double_stone_slab[seamless=true,variant=wood_old]'],
        ['minecraft:cobblestone_slab[type=double]', 'minecraft:double_stone_slab[seamless=true,variant=cobblestone]'],
        ['minecraft:brick_slab[type=double]', 'minecraft:double_stone_slab[seamless=true,variant=brick]'],
        ['minecraft:stone_brick_slab[type=double]', 'minecraft:double_stone_slab[seamless=true,variant=stone_brick]'],
        ['minecraft:nether_brick_slab[type=double]', 'minecraft:double_stone_slab[seamless=true,variant=nether_brick]'],
        ['minecraft:smooth_quartz', 'minecraft:double_stone_slab[seamless=true,variant=quartz]'],
        ['minecraft:stone_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=stone]'],
        ['minecraft:sandstone_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=sandstone]'],
        ['minecraft:petrified_oak_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=wood_old]'],
        ['minecraft:cobblestone_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=cobblestone]'],
        ['minecraft:brick_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=brick]'],
        ['minecraft:stone_brick_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=stone_brick]'],
        ['minecraft:nether_brick_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=nether_brick]'],
        ['minecraft:quartz_slab[type=bottom]', 'minecraft:stone_slab[half=bottom,variant=quartz]'],
        ['minecraft:stone_slab[type=top]', 'minecraft:stone_slab[half=top,variant=stone]'],
        ['minecraft:sandstone_slab[type=top]', 'minecraft:stone_slab[half=top,variant=sandstone]'],
        ['minecraft:petrified_oak_slab[type=top]', 'minecraft:stone_slab[half=top,variant=wood_old]'],
        ['minecraft:cobblestone_slab[type=top]', 'minecraft:stone_slab[half=top,variant=cobblestone]'],
        ['minecraft:brick_slab[type=top]', 'minecraft:stone_slab[half=top,variant=brick]'],
        ['minecraft:stone_brick_slab[type=top]', 'minecraft:stone_slab[half=top,variant=stone_brick]'],
        ['minecraft:nether_brick_slab[type=top]', 'minecraft:stone_slab[half=top,variant=nether_brick]'],
        ['minecraft:quartz_slab[type=top]', 'minecraft:stone_slab[half=top,variant=quartz]'],
        ['minecraft:bricks', 'minecraft:brick_block'],
        ['minecraft:tnt[explode=false]', 'minecraft:tnt[explode=false]'],
        ['minecraft:tnt[explode=true]', 'minecraft:tnt[explode=true]'],
        ['minecraft:bookshelf', 'minecraft:bookshelf'],
        ['minecraft:mossy_cobblestone', 'minecraft:mossy_cobblestone'],
        ['minecraft:obsidian', 'minecraft:obsidian'],
        ['minecraft:wall_torch[facing=east]', 'minecraft:torch[facing=east]'],
        ['minecraft:wall_torch[facing=west]', 'minecraft:torch[facing=west]'],
        ['minecraft:wall_torch[facing=south]', 'minecraft:torch[facing=south]'],
        ['minecraft:wall_torch[facing=north]', 'minecraft:torch[facing=north]'],
        ['minecraft:torch', 'minecraft:torch[facing=up]'],
        [
            'minecraft:fire[age=0,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=0,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=0,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=0,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=0,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=0,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=0,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=0,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=0,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=0,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=0,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=0,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=0,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=0,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=0,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=0,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=0,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=0,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=0,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=0,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=0,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=0,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=0,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=0,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=0,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=0,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=0,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=0,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=0,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=0,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=0,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=0,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=0,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=1,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=1,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=1,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=1,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=1,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=1,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=1,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=1,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=1,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=1,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=1,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=1,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=1,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=1,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=1,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=1,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=1,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=1,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=1,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=1,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=1,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=1,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=1,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=1,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=1,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=1,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=1,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=1,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=1,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=1,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=1,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=1,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=1,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=2,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=2,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=2,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=2,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=2,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=2,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=2,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=2,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=2,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=2,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=2,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=2,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=2,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=2,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=2,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=2,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=2,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=2,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=2,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=2,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=2,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=2,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=2,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=2,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=2,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=2,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=2,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=2,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=2,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=2,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=2,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=2,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=2,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=3,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=3,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=3,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=3,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=3,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=3,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=3,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=3,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=3,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=3,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=3,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=3,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=3,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=3,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=3,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=3,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=3,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=3,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=3,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=3,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=3,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=3,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=3,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=3,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=3,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=3,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=3,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=3,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=3,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=3,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=3,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=3,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=3,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=4,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=4,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=4,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=4,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=4,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=4,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=4,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=4,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=4,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=4,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=4,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=4,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=4,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=4,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=4,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=4,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=4,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=4,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=4,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=4,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=4,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=4,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=4,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=4,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=4,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=4,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=4,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=4,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=4,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=4,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=4,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=4,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=4,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=5,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=5,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=5,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=5,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=5,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=5,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=5,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=5,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=5,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=5,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=5,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=5,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=5,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=5,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=5,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=5,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=5,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=5,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=5,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=5,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=5,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=5,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=5,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=5,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=5,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=5,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=5,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=5,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=5,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=5,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=5,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=5,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=5,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=6,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=6,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=6,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=6,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=6,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=6,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=6,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=6,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=6,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=6,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=6,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=6,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=6,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=6,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=6,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=6,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=6,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=6,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=6,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=6,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=6,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=6,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=6,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=6,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=6,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=6,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=6,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=6,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=6,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=6,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=6,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=6,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=6,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=7,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=7,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=7,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=7,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=7,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=7,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=7,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=7,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=7,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=7,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=7,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=7,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=7,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=7,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=7,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=7,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=7,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=7,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=7,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=7,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=7,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=7,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=7,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=7,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=7,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=7,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=7,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=7,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=7,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=7,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=7,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=7,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=7,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=8,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=8,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=8,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=8,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=8,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=8,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=8,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=8,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=8,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=8,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=8,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=8,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=8,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=8,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=8,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=8,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=8,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=8,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=8,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=8,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=8,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=8,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=8,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=8,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=8,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=8,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=8,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=8,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=8,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=8,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=8,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=8,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=8,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=9,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=9,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=9,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=9,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=9,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=9,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=9,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=9,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=9,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=9,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=9,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=9,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=9,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=9,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=9,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=9,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=9,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=9,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=9,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=9,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=9,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=9,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=9,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=9,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=9,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=9,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=9,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=9,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=9,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=9,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=9,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=9,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=9,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=10,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=10,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=10,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=10,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=10,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=10,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=10,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=10,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=10,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=10,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=10,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=10,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=10,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=10,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=10,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=10,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=10,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=10,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=10,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=10,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=10,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=10,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=10,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=10,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=10,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=10,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=10,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=10,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=10,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=10,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=10,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=10,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=10,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=11,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=11,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=11,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=11,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=11,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=11,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=11,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=11,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=11,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=11,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=11,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=11,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=11,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=11,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=11,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=11,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=11,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=11,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=11,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=11,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=11,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=11,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=11,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=11,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=11,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=11,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=11,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=11,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=11,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=11,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=11,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=11,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=11,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=12,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=12,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=12,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=12,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=12,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=12,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=12,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=12,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=12,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=12,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=12,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=12,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=12,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=12,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=12,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=12,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=12,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=12,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=12,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=12,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=12,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=12,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=12,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=12,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=12,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=12,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=12,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=12,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=12,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=12,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=12,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=12,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=12,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=13,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=13,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=13,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=13,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=13,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=13,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=13,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=13,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=13,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=13,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=13,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=13,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=13,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=13,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=13,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=13,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=13,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=13,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=13,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=13,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=13,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=13,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=13,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=13,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=13,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=13,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=13,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=13,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=13,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=13,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=13,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=13,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=13,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=14,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=14,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=14,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=14,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=14,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=14,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=14,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=14,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=14,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=14,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=14,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=14,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=14,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=14,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=14,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=14,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=14,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=14,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=14,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=14,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=14,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=14,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=14,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=14,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=14,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=14,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=14,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=14,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=14,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=14,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=14,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=14,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=14,east=true,north:true,south=true,up:true,west=true]'
        ],
        [
            'minecraft:fire[age=15,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=15,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=15,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=15,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=15,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=15,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=15,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=15,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=15,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=15,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=15,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=15,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=15,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=15,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=15,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=15,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=15,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:fire[age=15,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:fire[age=15,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:fire[age=15,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:fire[age=15,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:fire[age=15,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:fire[age=15,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:fire[age=15,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:fire[age=15,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:fire[age=15,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:fire[age=15,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:fire[age=15,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:fire[age=15,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:fire[age=15,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:fire[age=15,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:fire[age=15,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:fire[age=15,east=true,north:true,south=true,up:true,west=true]'
        ],
        ['minecraft:mob_spawner', 'minecraft:spawner'],
        [
            'minecraft:oak_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:oak_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:oak_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:oak_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:oak_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:oak_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:oak_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:oak_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:oak_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:oak_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:oak_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:oak_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:oak_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:oak_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:oak_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:oak_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:oak_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:oak_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:oak_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:oak_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:oak_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:oak_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:oak_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:oak_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:oak_stairs[facing=east,half=top,shape=straight]',
            'minecraft:oak_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:oak_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:oak_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:oak_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:oak_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:oak_stairs[facing=west,half=top,shape=straight]',
            'minecraft:oak_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:oak_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:oak_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:oak_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:oak_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:oak_stairs[facing=south,half=top,shape=straight]',
            'minecraft:oak_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:oak_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:oak_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:oak_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:oak_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:oak_stairs[facing=north,half=top,shape=straight]',
            'minecraft:oak_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:oak_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:oak_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:oak_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:oak_stairs[facing=north,half=top,shape=straight]'
        ],
        ['minecraft:chest[facing=north,type=single]', 'minecraft:chest[facing=north]'],
        ['minecraft:chest[facing=south,type=single]', 'minecraft:chest[facing=south]'],
        ['minecraft:chest[facing=west,type=single]', 'minecraft:chest[facing=west]'],
        ['minecraft:chest[facing=east,type=single]', 'minecraft:chest[facing=east]'],
        [
            'minecraft:redstone_wire[east=none,north=none,power:0,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:0,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:0,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:0,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:0,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:0,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:0,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:0,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:0,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:0,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:0,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:0,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:0,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:0,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:0,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:0,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:0,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:0,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:0,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:0,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:0,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:0,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:0,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:0,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:0,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:0,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:0,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:0,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:0,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:0,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:0,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:0,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:0,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:0,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:0,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:0,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:0,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:0,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:0,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:0,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:0,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:0,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:0,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:0,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:0,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:0,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:0,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:0,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:0,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:0,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:0,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:0,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:0,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:0,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:0,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:0,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:0,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:0,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:0,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:0,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:0,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:0,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:0,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:0,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:0,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:0,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:0,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:0,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:0,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:0,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:0,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:0,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:0,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:0,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:0,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:0,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:0,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:0,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:0,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:0,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:0,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:0,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:1,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:1,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:1,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:1,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:1,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:1,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:1,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:1,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:1,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:1,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:1,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:1,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:1,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:1,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:1,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:1,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:1,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:1,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:1,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:1,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:1,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:1,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:1,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:1,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:1,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:1,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:1,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:1,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:1,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:1,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:1,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:1,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:1,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:1,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:1,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:1,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:1,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:1,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:1,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:1,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:1,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:1,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:1,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:1,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:1,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:1,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:1,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:1,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:1,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:1,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:1,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:1,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:1,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:1,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:1,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:1,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:1,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:1,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:1,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:1,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:1,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:1,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:1,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:1,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:1,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:1,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:1,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:1,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:1,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:1,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:1,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:1,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:1,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:1,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:1,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:1,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:1,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:1,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:1,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:1,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:1,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:1,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:2,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:2,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:2,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:2,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:2,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:2,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:2,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:2,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:2,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:2,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:2,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:2,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:2,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:2,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:2,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:2,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:2,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:2,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:2,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:2,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:2,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:2,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:2,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:2,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:2,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:2,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:2,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:2,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:2,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:2,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:2,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:2,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:2,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:2,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:2,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:2,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:2,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:2,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:2,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:2,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:2,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:2,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:2,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:2,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:2,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:2,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:2,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:2,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:2,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:2,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:2,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:2,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:2,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:2,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:2,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:2,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:2,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:2,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:2,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:2,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:2,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:2,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:2,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:2,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:2,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:2,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:2,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:2,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:2,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:2,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:2,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:2,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:2,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:2,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:2,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:2,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:2,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:2,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:2,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:2,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:2,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:2,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:3,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:3,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:3,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:3,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:3,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:3,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:3,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:3,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:3,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:3,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:3,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:3,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:3,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:3,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:3,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:3,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:3,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:3,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:3,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:3,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:3,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:3,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:3,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:3,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:3,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:3,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:3,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:3,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:3,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:3,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:3,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:3,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:3,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:3,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:3,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:3,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:3,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:3,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:3,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:3,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:3,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:3,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:3,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:3,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:3,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:3,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:3,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:3,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:3,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:3,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:3,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:3,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:3,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:3,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:3,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:3,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:3,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:3,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:3,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:3,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:3,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:3,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:3,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:3,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:3,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:3,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:3,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:3,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:3,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:3,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:3,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:3,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:3,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:3,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:3,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:3,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:3,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:3,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:3,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:3,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:3,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:3,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:4,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:4,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:4,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:4,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:4,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:4,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:4,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:4,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:4,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:4,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:4,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:4,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:4,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:4,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:4,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:4,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:4,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:4,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:4,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:4,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:4,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:4,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:4,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:4,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:4,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:4,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:4,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:4,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:4,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:4,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:4,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:4,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:4,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:4,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:4,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:4,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:4,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:4,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:4,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:4,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:4,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:4,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:4,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:4,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:4,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:4,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:4,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:4,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:4,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:4,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:4,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:4,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:4,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:4,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:4,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:4,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:4,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:4,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:4,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:4,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:4,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:4,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:4,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:4,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:4,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:4,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:4,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:4,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:4,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:4,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:4,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:4,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:4,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:4,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:4,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:4,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:4,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:4,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:4,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:4,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:4,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:4,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:5,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:5,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:5,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:5,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:5,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:5,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:5,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:5,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:5,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:5,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:5,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:5,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:5,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:5,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:5,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:5,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:5,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:5,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:5,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:5,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:5,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:5,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:5,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:5,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:5,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:5,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:5,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:5,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:5,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:5,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:5,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:5,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:5,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:5,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:5,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:5,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:5,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:5,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:5,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:5,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:5,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:5,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:5,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:5,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:5,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:5,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:5,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:5,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:5,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:5,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:5,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:5,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:5,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:5,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:5,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:5,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:5,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:5,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:5,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:5,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:5,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:5,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:5,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:5,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:5,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:5,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:5,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:5,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:5,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:5,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:5,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:5,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:5,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:5,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:5,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:5,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:5,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:5,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:5,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:5,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:5,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:5,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:6,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:6,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:6,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:6,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:6,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:6,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:6,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:6,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:6,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:6,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:6,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:6,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:6,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:6,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:6,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:6,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:6,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:6,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:6,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:6,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:6,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:6,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:6,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:6,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:6,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:6,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:6,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:6,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:6,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:6,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:6,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:6,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:6,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:6,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:6,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:6,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:6,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:6,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:6,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:6,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:6,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:6,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:6,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:6,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:6,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:6,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:6,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:6,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:6,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:6,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:6,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:6,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:6,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:6,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:6,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:6,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:6,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:6,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:6,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:6,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:6,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:6,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:6,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:6,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:6,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:6,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:6,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:6,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:6,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:6,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:6,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:6,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:6,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:6,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:6,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:6,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:6,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:6,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:6,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:6,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:6,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:6,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:7,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:7,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:7,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:7,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:7,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:7,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:7,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:7,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:7,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:7,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:7,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:7,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:7,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:7,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:7,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:7,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:7,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:7,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:7,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:7,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:7,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:7,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:7,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:7,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:7,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:7,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:7,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:7,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:7,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:7,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:7,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:7,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:7,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:7,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:7,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:7,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:7,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:7,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:7,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:7,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:7,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:7,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:7,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:7,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:7,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:7,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:7,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:7,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:7,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:7,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:7,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:7,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:7,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:7,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:7,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:7,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:7,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:7,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:7,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:7,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:7,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:7,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:7,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:7,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:7,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:7,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:7,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:7,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:7,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:7,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:7,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:7,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:7,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:7,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:7,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:7,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:7,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:7,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:7,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:7,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:7,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:7,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:8,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:8,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:8,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:8,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:8,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:8,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:8,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:8,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:8,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:8,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:8,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:8,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:8,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:8,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:8,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:8,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:8,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:8,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:8,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:8,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:8,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:8,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:8,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:8,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:8,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:8,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:8,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:8,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:8,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:8,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:8,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:8,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:8,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:8,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:8,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:8,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:8,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:8,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:8,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:8,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:8,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:8,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:8,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:8,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:8,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:8,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:8,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:8,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:8,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:8,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:8,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:8,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:8,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:8,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:8,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:8,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:8,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:8,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:8,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:8,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:8,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:8,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:8,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:8,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:8,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:8,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:8,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:8,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:8,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:8,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:8,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:8,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:8,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:8,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:8,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:8,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:8,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:8,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:8,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:8,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:8,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:8,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:9,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:9,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:9,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:9,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:9,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:9,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:9,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:9,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:9,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:9,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:9,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:9,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:9,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:9,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:9,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:9,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:9,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:9,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:9,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:9,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:9,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:9,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:9,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:9,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:9,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:9,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:9,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:9,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:9,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:9,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:9,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:9,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:9,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:9,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:9,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:9,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:9,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:9,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:9,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:9,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:9,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:9,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:9,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:9,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:9,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:9,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:9,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:9,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:9,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:9,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:9,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:9,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:9,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:9,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:9,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:9,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:9,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:9,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:9,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:9,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:9,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:9,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:9,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:9,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:9,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:9,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:9,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:9,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:9,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:9,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:9,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:9,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:9,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:9,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:9,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:9,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:9,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:9,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:9,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:9,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:9,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:9,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:10,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:10,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:10,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:10,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:10,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:10,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:10,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:10,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:10,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:10,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:10,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:10,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:10,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:10,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:10,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:10,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:10,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:10,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:10,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:10,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:10,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:10,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:10,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:10,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:10,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:10,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:10,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:10,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:10,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:10,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:10,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:10,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:10,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:10,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:10,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:10,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:10,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:10,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:10,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:10,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:10,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:10,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:10,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:10,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:10,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:10,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:10,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:10,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:10,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:10,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:10,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:10,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:10,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:10,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:10,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:10,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:10,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:10,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:10,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:10,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:10,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:10,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:10,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:10,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:10,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:10,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:10,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:10,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:10,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:10,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:10,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:10,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:10,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:10,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:10,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:10,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:10,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:10,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:10,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:10,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:10,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:10,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:11,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:11,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:11,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:11,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:11,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:11,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:11,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:11,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:11,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:11,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:11,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:11,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:11,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:11,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:11,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:11,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:11,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:11,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:11,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:11,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:11,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:11,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:11,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:11,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:11,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:11,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:11,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:11,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:11,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:11,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:11,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:11,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:11,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:11,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:11,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:11,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:11,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:11,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:11,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:11,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:11,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:11,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:11,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:11,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:11,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:11,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:11,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:11,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:11,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:11,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:11,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:11,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:11,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:11,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:11,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:11,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:11,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:11,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:11,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:11,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:11,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:11,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:11,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:11,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:11,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:11,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:11,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:11,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:11,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:11,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:11,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:11,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:11,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:11,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:11,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:11,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:11,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:11,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:11,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:11,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:11,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:11,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:12,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:12,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:12,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:12,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:12,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:12,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:12,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:12,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:12,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:12,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:12,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:12,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:12,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:12,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:12,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:12,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:12,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:12,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:12,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:12,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:12,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:12,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:12,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:12,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:12,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:12,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:12,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:12,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:12,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:12,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:12,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:12,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:12,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:12,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:12,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:12,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:12,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:12,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:12,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:12,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:12,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:12,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:12,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:12,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:12,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:12,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:12,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:12,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:12,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:12,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:12,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:12,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:12,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:12,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:12,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:12,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:12,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:12,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:12,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:12,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:12,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:12,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:12,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:12,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:12,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:12,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:12,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:12,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:12,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:12,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:12,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:12,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:12,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:12,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:12,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:12,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:12,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:12,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:12,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:12,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:12,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:12,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:13,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:13,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:13,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:13,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:13,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:13,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:13,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:13,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:13,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:13,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:13,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:13,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:13,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:13,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:13,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:13,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:13,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:13,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:13,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:13,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:13,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:13,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:13,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:13,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:13,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:13,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:13,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:13,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:13,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:13,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:13,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:13,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:13,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:13,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:13,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:13,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:13,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:13,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:13,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:13,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:13,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:13,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:13,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:13,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:13,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:13,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:13,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:13,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:13,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:13,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:13,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:13,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:13,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:13,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:13,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:13,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:13,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:13,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:13,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:13,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:13,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:13,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:13,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:13,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:13,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:13,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:13,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:13,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:13,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:13,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:13,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:13,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:13,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:13,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:13,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:13,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:13,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:13,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:13,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:13,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:13,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:13,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:14,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:14,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:14,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:14,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:14,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:14,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:14,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:14,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:14,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:14,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:14,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:14,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:14,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:14,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:14,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:14,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:14,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:14,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:14,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:14,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:14,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:14,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:14,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:14,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:14,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:14,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:14,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:14,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:14,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:14,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:14,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:14,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:14,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:14,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:14,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:14,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:14,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:14,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:14,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:14,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:14,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:14,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:14,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:14,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:14,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:14,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:14,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:14,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:14,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:14,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:14,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:14,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:14,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:14,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:14,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:14,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:14,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:14,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:14,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:14,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:14,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:14,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:14,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:14,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:14,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:14,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:14,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:14,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:14,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:14,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:14,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:14,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:14,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:14,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:14,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:14,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:14,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:14,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:14,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:14,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:14,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:14,south=up,west=up]'
        ],
        [
            'minecraft:redstone_wire[east=none,north=none,power:15,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:15,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:15,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:15,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:15,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:15,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:15,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=none,power:15,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=none,power:15,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=none,power:15,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:15,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:15,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:15,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:15,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:15,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:15,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=side,power:15,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=side,power:15,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=side,power:15,south=up,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:15,south=none,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:15,south=none,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:15,south=none,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:15,south=side,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:15,south=side,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:15,south=side,west=up]',
            'minecraft:redstone_wire[east=none,north=up,power:15,south=up,west=none]',
            'minecraft:redstone_wire[east=none,north=up,power:15,south=up,west=side]',
            'minecraft:redstone_wire[east=none,north=up,power:15,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:15,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:15,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:15,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:15,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:15,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:15,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=none,power:15,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=none,power:15,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=none,power:15,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:15,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:15,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:15,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:15,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:15,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:15,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=side,power:15,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=side,power:15,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=side,power:15,south=up,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:15,south=none,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:15,south=none,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:15,south=none,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:15,south=side,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:15,south=side,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:15,south=side,west=up]',
            'minecraft:redstone_wire[east=side,north=up,power:15,south=up,west=none]',
            'minecraft:redstone_wire[east=side,north=up,power:15,south=up,west=side]',
            'minecraft:redstone_wire[east=side,north=up,power:15,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:15,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:15,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:15,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:15,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:15,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:15,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=none,power:15,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=none,power:15,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=none,power:15,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:15,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:15,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:15,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:15,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:15,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:15,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=side,power:15,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=side,power:15,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=side,power:15,south=up,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:15,south=none,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:15,south=none,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:15,south=none,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:15,south=side,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:15,south=side,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:15,south=side,west=up]',
            'minecraft:redstone_wire[east=up,north=up,power:15,south=up,west=none]',
            'minecraft:redstone_wire[east=up,north=up,power:15,south=up,west=side]',
            'minecraft:redstone_wire[east=up,north=up,power:15,south=up,west=up]'
        ],
        ['minecraft:diamond_ore', 'minecraft:diamond_ore'],
        ['minecraft:diamond_block', 'minecraft:diamond_block'],
        ['minecraft:crafting_table', 'minecraft:crafting_table'],
        ['minecraft:wheat[age=0]', 'minecraft:wheat[age=0]'],
        ['minecraft:wheat[age=1]', 'minecraft:wheat[age=1]'],
        ['minecraft:wheat[age=2]', 'minecraft:wheat[age=2]'],
        ['minecraft:wheat[age=3]', 'minecraft:wheat[age=3]'],
        ['minecraft:wheat[age=4]', 'minecraft:wheat[age=4]'],
        ['minecraft:wheat[age=5]', 'minecraft:wheat[age=5]'],
        ['minecraft:wheat[age=6]', 'minecraft:wheat[age=6]'],
        ['minecraft:wheat[age=7]', 'minecraft:wheat[age=7]'],
        ['minecraft:farmland[moisture=0]', 'minecraft:farmland[moisture=0]'],
        ['minecraft:farmland[moisture=1]', 'minecraft:farmland[moisture=1]'],
        ['minecraft:farmland[moisture=2]', 'minecraft:farmland[moisture=2]'],
        ['minecraft:farmland[moisture=3]', 'minecraft:farmland[moisture=3]'],
        ['minecraft:farmland[moisture=4]', 'minecraft:farmland[moisture=4]'],
        ['minecraft:farmland[moisture=5]', 'minecraft:farmland[moisture=5]'],
        ['minecraft:farmland[moisture=6]', 'minecraft:farmland[moisture=6]'],
        ['minecraft:farmland[moisture=7]', 'minecraft:farmland[moisture=7]'],
        ['minecraft:furnace[facing=north,lit=false]', 'minecraft:furnace[facing=north]'],
        ['minecraft:furnace[facing=south,lit=false]', 'minecraft:furnace[facing=south]'],
        ['minecraft:furnace[facing=west,lit=false]', 'minecraft:furnace[facing=west]'],
        ['minecraft:furnace[facing=east,lit=false]', 'minecraft:furnace[facing=east]'],
        ['minecraft:furnace[facing=north,lit=true]', 'minecraft:lit_furnace[facing=north]'],
        ['minecraft:furnace[facing=south,lit=true]', 'minecraft:lit_furnace[facing=south]'],
        ['minecraft:furnace[facing=west,lit=true]', 'minecraft:lit_furnace[facing=west]'],
        ['minecraft:furnace[facing=east,lit=true]', 'minecraft:lit_furnace[facing=east]'],
        ['minecraft:sign[rotation=0]', 'minecraft:standing_sign[rotation=0]'],
        ['minecraft:sign[rotation=1]', 'minecraft:standing_sign[rotation=1]'],
        ['minecraft:sign[rotation=2]', 'minecraft:standing_sign[rotation=2]'],
        ['minecraft:sign[rotation=3]', 'minecraft:standing_sign[rotation=3]'],
        ['minecraft:sign[rotation=4]', 'minecraft:standing_sign[rotation=4]'],
        ['minecraft:sign[rotation=5]', 'minecraft:standing_sign[rotation=5]'],
        ['minecraft:sign[rotation=6]', 'minecraft:standing_sign[rotation=6]'],
        ['minecraft:sign[rotation=7]', 'minecraft:standing_sign[rotation=7]'],
        ['minecraft:sign[rotation=8]', 'minecraft:standing_sign[rotation=8]'],
        ['minecraft:sign[rotation=9]', 'minecraft:standing_sign[rotation=9]'],
        ['minecraft:sign[rotation=10]', 'minecraft:standing_sign[rotation=10]'],
        ['minecraft:sign[rotation=11]', 'minecraft:standing_sign[rotation=11]'],
        ['minecraft:sign[rotation=12]', 'minecraft:standing_sign[rotation=12]'],
        ['minecraft:sign[rotation=13]', 'minecraft:standing_sign[rotation=13]'],
        ['minecraft:sign[rotation=14]', 'minecraft:standing_sign[rotation=14]'],
        ['minecraft:sign[rotation=15]', 'minecraft:standing_sign[rotation=15]'],
        [
            'minecraft:oak_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:wooden_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:wooden_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:wooden_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:wooden_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:oak_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:wooden_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:wooden_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:wooden_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:wooden_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:oak_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:wooden_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:wooden_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:wooden_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:wooden_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:oak_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:wooden_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:wooden_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:wooden_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:wooden_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:oak_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:wooden_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:wooden_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:wooden_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:wooden_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:oak_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:wooden_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:wooden_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:wooden_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:wooden_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:oak_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:wooden_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:wooden_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:wooden_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:wooden_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:oak_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:wooden_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:wooden_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:wooden_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:wooden_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:oak_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:wooden_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:wooden_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:wooden_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:wooden_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:wooden_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:wooden_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:wooden_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:wooden_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
        ],
        [
            'minecraft:oak_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:wooden_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:wooden_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:wooden_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:wooden_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:wooden_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:wooden_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:wooden_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:wooden_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
        ],
        [
            'minecraft:oak_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:wooden_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:wooden_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:wooden_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:wooden_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:wooden_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:wooden_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:wooden_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:wooden_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
        ],
        [
            'minecraft:oak_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:wooden_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:wooden_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:wooden_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:wooden_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:wooden_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:wooden_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:wooden_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:wooden_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
        ],
        ['minecraft:ladder[facing=north]', 'minecraft:ladder[facing=north]'],
        ['minecraft:ladder[facing=south]', 'minecraft:ladder[facing=south]'],
        ['minecraft:ladder[facing=west]', 'minecraft:ladder[facing=west]'],
        ['minecraft:ladder[facing=east]', 'minecraft:ladder[facing=east]'],
        ['minecraft:rail[shape=north_south]', 'minecraft:rail[shape=north_south]'],
        ['minecraft:rail[shape=east_west]', 'minecraft:rail[shape=east_west]'],
        ['minecraft:rail[shape=ascending_east]', 'minecraft:rail[shape=ascending_east]'],
        ['minecraft:rail[shape=ascending_west]', 'minecraft:rail[shape=ascending_west]'],
        ['minecraft:rail[shape=ascending_north]', 'minecraft:rail[shape=ascending_north]'],
        ['minecraft:rail[shape=ascending_south]', 'minecraft:rail[shape=ascending_south]'],
        ['minecraft:rail[shape=south_east]', 'minecraft:rail[shape=south_east]'],
        ['minecraft:rail[shape=south_west]', 'minecraft:rail[shape=south_west]'],
        ['minecraft:rail[shape=north_west]', 'minecraft:rail[shape=north_west]'],
        ['minecraft:rail[shape=north_east]', 'minecraft:rail[shape=north_east]'],
        [
            'minecraft:cobblestone_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:stone_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:stone_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:stone_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:stone_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:stone_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:cobblestone_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:stone_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:stone_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:stone_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:stone_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:stone_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:cobblestone_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:stone_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:stone_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:stone_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:stone_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:stone_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:cobblestone_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:stone_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:stone_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:stone_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:stone_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:stone_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:cobblestone_stairs[facing=east,half=top,shape=straight]',
            'minecraft:stone_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:stone_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:stone_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:stone_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:stone_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:cobblestone_stairs[facing=west,half=top,shape=straight]',
            'minecraft:stone_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:stone_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:stone_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:stone_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:stone_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:cobblestone_stairs[facing=south,half=top,shape=straight]',
            'minecraft:stone_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:stone_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:stone_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:stone_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:stone_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:cobblestone_stairs[facing=north,half=top,shape=straight]',
            'minecraft:stone_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:stone_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:stone_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:stone_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:stone_stairs[facing=north,half=top,shape=straight]'
        ],
        ['minecraft:wall_sign[facing=north]', 'minecraft:wall_sign[facing=north]'],
        ['minecraft:wall_sign[facing=south]', 'minecraft:wall_sign[facing=south]'],
        ['minecraft:wall_sign[facing=west]', 'minecraft:wall_sign[facing=west]'],
        ['minecraft:wall_sign[facing=east]', 'minecraft:wall_sign[facing=east]'],
        ['minecraft:lever[face=ceiling,facing=west,powered=false]', 'minecraft:lever[facing=down_x,powered=false]'],
        ['minecraft:lever[face=wall,facing=east,powered=false]', 'minecraft:lever[facing=east,powered=false]'],
        ['minecraft:lever[face=wall,facing=west,powered=false]', 'minecraft:lever[facing=west,powered=false]'],
        ['minecraft:lever[face=wall,facing=south,powered=false]', 'minecraft:lever[facing=south,powered=false]'],
        ['minecraft:lever[face=wall,facing=north,powered=false]', 'minecraft:lever[facing=north,powered=false]'],
        ['minecraft:lever[face=floor,facing=north,powered=false]', 'minecraft:lever[facing=up_z,powered=false]'],
        ['minecraft:lever[face=floor,facing=west,powered=false]', 'minecraft:lever[facing=up_x,powered=false]'],
        ['minecraft:lever[face=ceiling,facing=north,powered=false]', 'minecraft:lever[facing=down_z,powered=false]'],
        ['minecraft:lever[face=ceiling,facing=west,powered=true]', 'minecraft:lever[facing=down_x,powered=true]'],
        ['minecraft:lever[face=wall,facing=east,powered=true]', 'minecraft:lever[facing=east,powered=true]'],
        ['minecraft:lever[face=wall,facing=west,powered=true]', 'minecraft:lever[facing=west,powered=true]'],
        ['minecraft:lever[face=wall,facing=south,powered=true]', 'minecraft:lever[facing=south,powered=true]'],
        ['minecraft:lever[face=wall,facing=north,powered=true]', 'minecraft:lever[facing=north,powered=true]'],
        ['minecraft:lever[face=floor,facing=north,powered=true]', 'minecraft:lever[facing=up_z,powered=true]'],
        ['minecraft:lever[face=floor,facing=west,powered=true]', 'minecraft:lever[facing=up_x,powered=true]'],
        ['minecraft:lever[face=ceiling,facing=north,powered=true]', 'minecraft:lever[facing=down_z,powered=true]'],
        ['minecraft:stone_pressure_plate[powered=false]', 'minecraft:stone_pressure_plate[powered=false]'],
        ['minecraft:stone_pressure_plate[powered=true]', 'minecraft:stone_pressure_plate[powered=true]'],
        [
            'minecraft:iron_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:iron_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:iron_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:iron_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:iron_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:iron_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:iron_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:iron_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:iron_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:iron_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:iron_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:iron_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:iron_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:iron_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:iron_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:iron_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:iron_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:iron_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:iron_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:iron_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:iron_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:iron_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:iron_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:iron_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:iron_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:iron_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:iron_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:iron_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:iron_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:iron_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:iron_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:iron_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:iron_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:iron_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:iron_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:iron_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:iron_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:iron_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:iron_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:iron_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:iron_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:iron_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:iron_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:iron_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:iron_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:iron_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:iron_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:iron_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:iron_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
        ],
        [
            'minecraft:iron_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:iron_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:iron_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:iron_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:iron_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:iron_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:iron_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:iron_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:iron_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
        ],
        [
            'minecraft:iron_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:iron_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:iron_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:iron_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:iron_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:iron_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:iron_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:iron_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:iron_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
        ],
        [
            'minecraft:iron_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:iron_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:iron_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:iron_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:iron_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:iron_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:iron_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:iron_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:iron_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
        ],
        ['minecraft:oak_pressure_plate[powered=false]', 'minecraft:wooden_pressure_plate[powered=false]'],
        ['minecraft:oak_pressure_plate[powered=true]', 'minecraft:wooden_pressure_plate[powered=true]'],
        ['minecraft:redstone_ore[lit=false]', 'minecraft:redstone_ore'],
        ['minecraft:redstone_ore[lit=true]', 'minecraft:lit_redstone_ore'],
        ['minecraft:redstone_wall_torch[facing=east,lit=false]', 'minecraft:unlit_redstone_torch[facing=east]'],
        ['minecraft:redstone_wall_torch[facing=west,lit=false]', 'minecraft:unlit_redstone_torch[facing=west]'],
        ['minecraft:redstone_wall_torch[facing=south,lit=false]', 'minecraft:unlit_redstone_torch[facing=south]'],
        ['minecraft:redstone_wall_torch[facing=north,lit=false]', 'minecraft:unlit_redstone_torch[facing=north]'],
        ['minecraft:redstone_torch[lit=false]', 'minecraft:unlit_redstone_torch[facing=up]'],
        ['minecraft:redstone_wall_torch[facing=east,lit=true]', 'minecraft:redstone_torch[facing=east]'],
        ['minecraft:redstone_wall_torch[facing=west,lit=true]', 'minecraft:redstone_torch[facing=west]'],
        ['minecraft:redstone_wall_torch[facing=south,lit=true]', 'minecraft:redstone_torch[facing=south]'],
        ['minecraft:redstone_wall_torch[facing=north,lit=true]', 'minecraft:redstone_torch[facing=north]'],
        ['minecraft:redstone_torch[lit=true]', 'minecraft:redstone_torch[facing=up]'],
        [
            'minecraft:stone_button[face=ceiling,facing=north,powered=false]',
            'minecraft:stone_button[facing=down,powered=false]'
        ],
        [
            'minecraft:stone_button[face=wall,facing=east,powered=false]',
            'minecraft:stone_button[facing=east,powered=false]'
        ],
        [
            'minecraft:stone_button[face=wall,facing=west,powered=false]',
            'minecraft:stone_button[facing=west,powered=false]'
        ],
        [
            'minecraft:stone_button[face=wall,facing=south,powered=false]',
            'minecraft:stone_button[facing=south,powered=false]'
        ],
        [
            'minecraft:stone_button[face=wall,facing=north,powered=false]',
            'minecraft:stone_button[facing=north,powered=false]'
        ],
        [
            'minecraft:stone_button[face=floor,facing=north,powered=false]',
            'minecraft:stone_button[facing=up,powered=false]'
        ],
        [
            'minecraft:stone_button[face=ceiling,facing=north,powered=true]',
            'minecraft:stone_button[facing=down,powered=true]'
        ],
        [
            'minecraft:stone_button[face=wall,facing=east,powered=true]',
            'minecraft:stone_button[facing=east,powered=true]'
        ],
        [
            'minecraft:stone_button[face=wall,facing=west,powered=true]',
            'minecraft:stone_button[facing=west,powered=true]'
        ],
        [
            'minecraft:stone_button[face=wall,facing=south,powered=true]',
            'minecraft:stone_button[facing=south,powered=true]'
        ],
        [
            'minecraft:stone_button[face=wall,facing=north,powered=true]',
            'minecraft:stone_button[facing=north,powered=true]'
        ],
        [
            'minecraft:stone_button[face=floor,facing=north,powered=true]',
            'minecraft:stone_button[facing=up,powered=true]'
        ],
        ['minecraft:snow[layers=1]', 'minecraft:snow_layer[layers=1]'],
        ['minecraft:snow[layers=2]', 'minecraft:snow_layer[layers=2]'],
        ['minecraft:snow[layers=3]', 'minecraft:snow_layer[layers=3]'],
        ['minecraft:snow[layers=4]', 'minecraft:snow_layer[layers=4]'],
        ['minecraft:snow[layers=5]', 'minecraft:snow_layer[layers=5]'],
        ['minecraft:snow[layers=6]', 'minecraft:snow_layer[layers=6]'],
        ['minecraft:snow[layers=7]', 'minecraft:snow_layer[layers=7]'],
        ['minecraft:snow[layers=8]', 'minecraft:snow_layer[layers=8]'],
        ['minecraft:ice', 'minecraft:ice'],
        ['minecraft:snow_block', 'minecraft:snow'],
        ['minecraft:cactus[age=0]', 'minecraft:cactus[age=0]'],
        ['minecraft:cactus[age=1]', 'minecraft:cactus[age=1]'],
        ['minecraft:cactus[age=2]', 'minecraft:cactus[age=2]'],
        ['minecraft:cactus[age=3]', 'minecraft:cactus[age=3]'],
        ['minecraft:cactus[age=4]', 'minecraft:cactus[age=4]'],
        ['minecraft:cactus[age=5]', 'minecraft:cactus[age=5]'],
        ['minecraft:cactus[age=6]', 'minecraft:cactus[age=6]'],
        ['minecraft:cactus[age=7]', 'minecraft:cactus[age=7]'],
        ['minecraft:cactus[age=8]', 'minecraft:cactus[age=8]'],
        ['minecraft:cactus[age=9]', 'minecraft:cactus[age=9]'],
        ['minecraft:cactus[age=10]', 'minecraft:cactus[age=10]'],
        ['minecraft:cactus[age=11]', 'minecraft:cactus[age=11]'],
        ['minecraft:cactus[age=12]', 'minecraft:cactus[age=12]'],
        ['minecraft:cactus[age=13]', 'minecraft:cactus[age=13]'],
        ['minecraft:cactus[age=14]', 'minecraft:cactus[age=14]'],
        ['minecraft:cactus[age=15]', 'minecraft:cactus[age=15]'],
        ['minecraft:clay', 'minecraft:clay'],
        ['minecraft:sugar_cane[age=0]', 'minecraft:reeds[age=0]'],
        ['minecraft:sugar_cane[age=1]', 'minecraft:reeds[age=1]'],
        ['minecraft:sugar_cane[age=2]', 'minecraft:reeds[age=2]'],
        ['minecraft:sugar_cane[age=3]', 'minecraft:reeds[age=3]'],
        ['minecraft:sugar_cane[age=4]', 'minecraft:reeds[age=4]'],
        ['minecraft:sugar_cane[age=5]', 'minecraft:reeds[age=5]'],
        ['minecraft:sugar_cane[age=6]', 'minecraft:reeds[age=6]'],
        ['minecraft:sugar_cane[age=7]', 'minecraft:reeds[age=7]'],
        ['minecraft:sugar_cane[age=8]', 'minecraft:reeds[age=8]'],
        ['minecraft:sugar_cane[age=9]', 'minecraft:reeds[age=9]'],
        ['minecraft:sugar_cane[age=10]', 'minecraft:reeds[age=10]'],
        ['minecraft:sugar_cane[age=11]', 'minecraft:reeds[age=11]'],
        ['minecraft:sugar_cane[age=12]', 'minecraft:reeds[age=12]'],
        ['minecraft:sugar_cane[age=13]', 'minecraft:reeds[age=13]'],
        ['minecraft:sugar_cane[age=14]', 'minecraft:reeds[age=14]'],
        ['minecraft:sugar_cane[age=15]', 'minecraft:reeds[age=15]'],
        ['minecraft:jukebox[has_record=false]', 'minecraft:jukebox[has_record=false]'],
        ['minecraft:jukebox[has_record=true]', 'minecraft:jukebox[has_record=true]'],
        [
            'minecraft:oak_fence[east=false,north=false,south:false,west=false]',
            'minecraft:fence[east=false,north=false,south:false,west=false]',
            'minecraft:fence[east=false,north=false,south:false,west=true]',
            'minecraft:fence[east=false,north=false,south:true,west=false]',
            'minecraft:fence[east=false,north=false,south:true,west=true]',
            'minecraft:fence[east=false,north=true,south:false,west=false]',
            'minecraft:fence[east=false,north=true,south:false,west=true]',
            'minecraft:fence[east=false,north=true,south:true,west=false]',
            'minecraft:fence[east=false,north=true,south:true,west=true]',
            'minecraft:fence[east=true,north=false,south:false,west=false]',
            'minecraft:fence[east=true,north=false,south:false,west=true]',
            'minecraft:fence[east=true,north=false,south:true,west=false]',
            'minecraft:fence[east=true,north=false,south:true,west=true]',
            'minecraft:fence[east=true,north=true,south:false,west=false]',
            'minecraft:fence[east=true,north=true,south:false,west=true]',
            'minecraft:fence[east=true,north=true,south:true,west=false]',
            'minecraft:fence[east=true,north=true,south:true,west=true]'
        ],
        ['minecraft:carved_pumpkin[facing=south]', 'minecraft:pumpkin[facing=south]'],
        ['minecraft:carved_pumpkin[facing=west]', 'minecraft:pumpkin[facing=west]'],
        ['minecraft:carved_pumpkin[facing=north]', 'minecraft:pumpkin[facing=north]'],
        ['minecraft:carved_pumpkin[facing=east]', 'minecraft:pumpkin[facing=east]'],
        ['minecraft:netherrack', 'minecraft:netherrack'],
        ['minecraft:soul_sand', 'minecraft:soul_sand'],
        ['minecraft:glowstone', 'minecraft:glowstone'],
        ['minecraft:portal[axis=x]', 'minecraft:nether_portal[axis=x]'],
        ['minecraft:portal[axis=z]', 'minecraft:nether_portal[axis=z]'],
        ['minecraft:jack_o_lantern[facing=south]', 'minecraft:lit_pumpkin[facing=south]'],
        ['minecraft:jack_o_lantern[facing=west]', 'minecraft:lit_pumpkin[facing=west]'],
        ['minecraft:jack_o_lantern[facing=north]', 'minecraft:lit_pumpkin[facing=north]'],
        ['minecraft:jack_o_lantern[facing=east]', 'minecraft:lit_pumpkin[facing=east]'],
        ['minecraft:cake[bites=0]', 'minecraft:cake[bites=0]'],
        ['minecraft:cake[bites=1]', 'minecraft:cake[bites=1]'],
        ['minecraft:cake[bites=2]', 'minecraft:cake[bites=2]'],
        ['minecraft:cake[bites=3]', 'minecraft:cake[bites=3]'],
        ['minecraft:cake[bites=4]', 'minecraft:cake[bites=4]'],
        ['minecraft:cake[bites=5]', 'minecraft:cake[bites=5]'],
        ['minecraft:cake[bites=6]', 'minecraft:cake[bites=6]'],
        [
            'minecraft:repeater[delay=1,facing=south,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=1,facing=south,locked=false]',
            'minecraft:unpowered_repeater[delay=1,facing=south,locked=true]'
        ],
        [
            'minecraft:repeater[delay=1,facing=west,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=1,facing=west,locked=false]',
            'minecraft:unpowered_repeater[delay=1,facing=west,locked=true]'
        ],
        [
            'minecraft:repeater[delay=1,facing=north,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=1,facing=north,locked=false]',
            'minecraft:unpowered_repeater[delay=1,facing=north,locked=true]'
        ],
        [
            'minecraft:repeater[delay=1,facing=east,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=1,facing=east,locked=false]',
            'minecraft:unpowered_repeater[delay=1,facing=east,locked=true]'
        ],
        [
            'minecraft:repeater[delay=2,facing=south,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=2,facing=south,locked=false]',
            'minecraft:unpowered_repeater[delay=2,facing=south,locked=true]'
        ],
        [
            'minecraft:repeater[delay=2,facing=west,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=2,facing=west,locked=false]',
            'minecraft:unpowered_repeater[delay=2,facing=west,locked=true]'
        ],
        [
            'minecraft:repeater[delay=2,facing=north,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=2,facing=north,locked=false]',
            'minecraft:unpowered_repeater[delay=2,facing=north,locked=true]'
        ],
        [
            'minecraft:repeater[delay=2,facing=east,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=2,facing=east,locked=false]',
            'minecraft:unpowered_repeater[delay=2,facing=east,locked=true]'
        ],
        [
            'minecraft:repeater[delay=3,facing=south,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=3,facing=south,locked=false]',
            'minecraft:unpowered_repeater[delay=3,facing=south,locked=true]'
        ],
        [
            'minecraft:repeater[delay=3,facing=west,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=3,facing=west,locked=false]',
            'minecraft:unpowered_repeater[delay=3,facing=west,locked=true]'
        ],
        [
            'minecraft:repeater[delay=3,facing=north,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=3,facing=north,locked=false]',
            'minecraft:unpowered_repeater[delay=3,facing=north,locked=true]'
        ],
        [
            'minecraft:repeater[delay=3,facing=east,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=3,facing=east,locked=false]',
            'minecraft:unpowered_repeater[delay=3,facing=east,locked=true]'
        ],
        [
            'minecraft:repeater[delay=4,facing=south,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=4,facing=south,locked=false]',
            'minecraft:unpowered_repeater[delay=4,facing=south,locked=true]'
        ],
        [
            'minecraft:repeater[delay=4,facing=west,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=4,facing=west,locked=false]',
            'minecraft:unpowered_repeater[delay=4,facing=west,locked=true]'
        ],
        [
            'minecraft:repeater[delay=4,facing=north,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=4,facing=north,locked=false]',
            'minecraft:unpowered_repeater[delay=4,facing=north,locked=true]'
        ],
        [
            'minecraft:repeater[delay=4,facing=east,locked:false,powered=false]',
            'minecraft:unpowered_repeater[delay=4,facing=east,locked=false]',
            'minecraft:unpowered_repeater[delay=4,facing=east,locked=true]'
        ],
        [
            'minecraft:repeater[delay=1,facing=south,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=1,facing=south,locked=false]',
            'minecraft:powered_repeater[delay=1,facing=south,locked=true]'
        ],
        [
            'minecraft:repeater[delay=1,facing=west,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=1,facing=west,locked=false]',
            'minecraft:powered_repeater[delay=1,facing=west,locked=true]'
        ],
        [
            'minecraft:repeater[delay=1,facing=north,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=1,facing=north,locked=false]',
            'minecraft:powered_repeater[delay=1,facing=north,locked=true]'
        ],
        [
            'minecraft:repeater[delay=1,facing=east,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=1,facing=east,locked=false]',
            'minecraft:powered_repeater[delay=1,facing=east,locked=true]'
        ],
        [
            'minecraft:repeater[delay=2,facing=south,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=2,facing=south,locked=false]',
            'minecraft:powered_repeater[delay=2,facing=south,locked=true]'
        ],
        [
            'minecraft:repeater[delay=2,facing=west,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=2,facing=west,locked=false]',
            'minecraft:powered_repeater[delay=2,facing=west,locked=true]'
        ],
        [
            'minecraft:repeater[delay=2,facing=north,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=2,facing=north,locked=false]',
            'minecraft:powered_repeater[delay=2,facing=north,locked=true]'
        ],
        [
            'minecraft:repeater[delay=2,facing=east,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=2,facing=east,locked=false]',
            'minecraft:powered_repeater[delay=2,facing=east,locked=true]'
        ],
        [
            'minecraft:repeater[delay=3,facing=south,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=3,facing=south,locked=false]',
            'minecraft:powered_repeater[delay=3,facing=south,locked=true]'
        ],
        [
            'minecraft:repeater[delay=3,facing=west,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=3,facing=west,locked=false]',
            'minecraft:powered_repeater[delay=3,facing=west,locked=true]'
        ],
        [
            'minecraft:repeater[delay=3,facing=north,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=3,facing=north,locked=false]',
            'minecraft:powered_repeater[delay=3,facing=north,locked=true]'
        ],
        [
            'minecraft:repeater[delay=3,facing=east,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=3,facing=east,locked=false]',
            'minecraft:powered_repeater[delay=3,facing=east,locked=true]'
        ],
        [
            'minecraft:repeater[delay=4,facing=south,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=4,facing=south,locked=false]',
            'minecraft:powered_repeater[delay=4,facing=south,locked=true]'
        ],
        [
            'minecraft:repeater[delay=4,facing=west,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=4,facing=west,locked=false]',
            'minecraft:powered_repeater[delay=4,facing=west,locked=true]'
        ],
        [
            'minecraft:repeater[delay=4,facing=north,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=4,facing=north,locked=false]',
            'minecraft:powered_repeater[delay=4,facing=north,locked=true]'
        ],
        [
            'minecraft:repeater[delay=4,facing=east,locked:false,powered=true]',
            'minecraft:powered_repeater[delay=4,facing=east,locked=false]',
            'minecraft:powered_repeater[delay=4,facing=east,locked=true]'
        ],
        ['minecraft:white_stained_glass', 'minecraft:stained_glass[color=white]'],
        ['minecraft:orange_stained_glass', 'minecraft:stained_glass[color=orange]'],
        ['minecraft:magenta_stained_glass', 'minecraft:stained_glass[color=magenta]'],
        ['minecraft:light_blue_stained_glass', 'minecraft:stained_glass[color=light_blue]'],
        ['minecraft:yellow_stained_glass', 'minecraft:stained_glass[color=yellow]'],
        ['minecraft:lime_stained_glass', 'minecraft:stained_glass[color=lime]'],
        ['minecraft:pink_stained_glass', 'minecraft:stained_glass[color=pink]'],
        ['minecraft:gray_stained_glass', 'minecraft:stained_glass[color=gray]'],
        ['minecraft:light_gray_stained_glass', 'minecraft:stained_glass[color=silver]'],
        ['minecraft:cyan_stained_glass', 'minecraft:stained_glass[color=cyan]'],
        ['minecraft:purple_stained_glass', 'minecraft:stained_glass[color=purple]'],
        ['minecraft:blue_stained_glass', 'minecraft:stained_glass[color=blue]'],
        ['minecraft:brown_stained_glass', 'minecraft:stained_glass[color=brown]'],
        ['minecraft:green_stained_glass', 'minecraft:stained_glass[color=green]'],
        ['minecraft:red_stained_glass', 'minecraft:stained_glass[color=red]'],
        ['minecraft:black_stained_glass', 'minecraft:stained_glass[color=black]'],
        [
            'minecraft:oak_trapdoor[facing=north,half=bottom,open=false]',
            'minecraft:trapdoor[facing=north,half=bottom,open=false]'
        ],
        [
            'minecraft:oak_trapdoor[facing=south,half=bottom,open=false]',
            'minecraft:trapdoor[facing=south,half=bottom,open=false]'
        ],
        [
            'minecraft:oak_trapdoor[facing=west,half=bottom,open=false]',
            'minecraft:trapdoor[facing=west,half=bottom,open=false]'
        ],
        [
            'minecraft:oak_trapdoor[facing=east,half=bottom,open=false]',
            'minecraft:trapdoor[facing=east,half=bottom,open=false]'
        ],
        [
            'minecraft:oak_trapdoor[facing=north,half=bottom,open=true]',
            'minecraft:trapdoor[facing=north,half=bottom,open=true]'
        ],
        [
            'minecraft:oak_trapdoor[facing=south,half=bottom,open=true]',
            'minecraft:trapdoor[facing=south,half=bottom,open=true]'
        ],
        [
            'minecraft:oak_trapdoor[facing=west,half=bottom,open=true]',
            'minecraft:trapdoor[facing=west,half=bottom,open=true]'
        ],
        [
            'minecraft:oak_trapdoor[facing=east,half=bottom,open=true]',
            'minecraft:trapdoor[facing=east,half=bottom,open=true]'
        ],
        [
            'minecraft:oak_trapdoor[facing=north,half=top,open=false]',
            'minecraft:trapdoor[facing=north,half=top,open=false]'
        ],
        [
            'minecraft:oak_trapdoor[facing=south,half=top,open=false]',
            'minecraft:trapdoor[facing=south,half=top,open=false]'
        ],
        [
            'minecraft:oak_trapdoor[facing=west,half=top,open=false]',
            'minecraft:trapdoor[facing=west,half=top,open=false]'
        ],
        [
            'minecraft:oak_trapdoor[facing=east,half=top,open=false]',
            'minecraft:trapdoor[facing=east,half=top,open=false]'
        ],
        [
            'minecraft:oak_trapdoor[facing=north,half=top,open=true]',
            'minecraft:trapdoor[facing=north,half=top,open=true]'
        ],
        [
            'minecraft:oak_trapdoor[facing=south,half=top,open=true]',
            'minecraft:trapdoor[facing=south,half=top,open=true]'
        ],
        [
            'minecraft:oak_trapdoor[facing=west,half=top,open=true]',
            'minecraft:trapdoor[facing=west,half=top,open=true]'
        ],
        [
            'minecraft:oak_trapdoor[facing=east,half=top,open=true]',
            'minecraft:trapdoor[facing=east,half=top,open=true]'
        ],
        ['minecraft:infested_stone', 'minecraft:monster_egg[variant=stone]'],
        ['minecraft:infested_cobblestone', 'minecraft:monster_egg[variant=cobblestone]'],
        ['minecraft:infested_stone_bricks', 'minecraft:monster_egg[variant=stone_brick]'],
        ['minecraft:infested_mossy_stone_bricks', 'minecraft:monster_egg[variant=mossy_brick]'],
        ['minecraft:infested_cracked_stone_bricks', 'minecraft:monster_egg[variant=cracked_brick]'],
        ['minecraft:infested_chiseled_stone_bricks', 'minecraft:monster_egg[variant=chiseled_brick]'],
        ['minecraft:stone_bricks', 'minecraft:stonebrick[variant=stonebrick]'],
        ['minecraft:mossy_stone_bricks', 'minecraft:stonebrick[variant=mossy_stonebrick]'],
        ['minecraft:cracked_stone_bricks', 'minecraft:stonebrick[variant=cracked_stonebrick]'],
        ['minecraft:chiseled_stone_bricks', 'minecraft:stonebrick[variant=chiseled_stonebrick]'],
        [
            'minecraft:brown_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]',
            'minecraft:brown_mushroom_block[variant=all_inside]'
        ],
        [
            'minecraft:brown_mushroom_block[north=true,east=false,south:false,west=true,up:true,down=false]',
            'minecraft:brown_mushroom_block[variant=north_west]'
        ],
        [
            'minecraft:brown_mushroom_block[north=true,east=false,south:false,west=false,up:true,down=false]',
            'minecraft:brown_mushroom_block[variant=north]'
        ],
        [
            'minecraft:brown_mushroom_block[north=true,east=true,south:false,west=false,up:true,down=false]',
            'minecraft:brown_mushroom_block[variant=north_east]'
        ],
        [
            'minecraft:brown_mushroom_block[north=false,east=false,south:false,west=true,up:true,down=false]',
            'minecraft:brown_mushroom_block[variant=west]'
        ],
        [
            'minecraft:brown_mushroom_block[north=false,east=false,south:false,west=false,up:true,down=false]',
            'minecraft:brown_mushroom_block[variant=center]'
        ],
        [
            'minecraft:brown_mushroom_block[north=false,east=true,south:false,west=false,up:true,down=false]',
            'minecraft:brown_mushroom_block[variant=east]'
        ],
        [
            'minecraft:brown_mushroom_block[north=false,east=false,south:true,west=true,up:true,down=false]',
            'minecraft:brown_mushroom_block[variant=south_west]'
        ],
        [
            'minecraft:brown_mushroom_block[north=false,east=false,south:true,west=false,up:true,down=false]',
            'minecraft:brown_mushroom_block[variant=south]'
        ],
        [
            'minecraft:brown_mushroom_block[north=false,east=true,south:true,west=false,up:true,down=false]',
            'minecraft:brown_mushroom_block[variant=south_east]'
        ],
        [
            'minecraft:mushroom_stem[north=true,east=true,south:true,west=true,up:false,down=false]',
            'minecraft:brown_mushroom_block[variant=stem]'
        ],
        ['minecraft:brown_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]', ''],
        ['minecraft:brown_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]', ''],
        ['minecraft:brown_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]', ''],
        [
            'minecraft:brown_mushroom_block[north=true,east=true,south:true,west=true,up:true,down=true]',
            'minecraft:brown_mushroom_block[variant=all_outside]'
        ],
        [
            'minecraft:mushroom_stem[north=true,east=true,south:true,west=true,up:true,down=true]',
            'minecraft:brown_mushroom_block[variant=all_stem]'
        ],
        [
            'minecraft:red_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]',
            'minecraft:red_mushroom_block[variant=all_inside]'
        ],
        [
            'minecraft:red_mushroom_block[north=true,east=false,south:false,west=true,up:true,down=false]',
            'minecraft:red_mushroom_block[variant=north_west]'
        ],
        [
            'minecraft:red_mushroom_block[north=true,east=false,south:false,west=false,up:true,down=false]',
            'minecraft:red_mushroom_block[variant=north]'
        ],
        [
            'minecraft:red_mushroom_block[north=true,east=true,south:false,west=false,up:true,down=false]',
            'minecraft:red_mushroom_block[variant=north_east]'
        ],
        [
            'minecraft:red_mushroom_block[north=false,east=false,south:false,west=true,up:true,down=false]',
            'minecraft:red_mushroom_block[variant=west]'
        ],
        [
            'minecraft:red_mushroom_block[north=false,east=false,south:false,west=false,up:true,down=false]',
            'minecraft:red_mushroom_block[variant=center]'
        ],
        [
            'minecraft:red_mushroom_block[north=false,east=true,south:false,west=false,up:true,down=false]',
            'minecraft:red_mushroom_block[variant=east]'
        ],
        [
            'minecraft:red_mushroom_block[north=false,east=false,south:true,west=true,up:true,down=false]',
            'minecraft:red_mushroom_block[variant=south_west]'
        ],
        [
            'minecraft:red_mushroom_block[north=false,east=false,south:true,west=false,up:true,down=false]',
            'minecraft:red_mushroom_block[variant=south]'
        ],
        [
            'minecraft:red_mushroom_block[north=false,east=true,south:true,west=false,up:true,down=false]',
            'minecraft:red_mushroom_block[variant=south_east]'
        ],
        [
            'minecraft:mushroom_stem[north=true,east=true,south:true,west=true,up:false,down=false]',
            'minecraft:red_mushroom_block[variant=stem]'
        ],
        ['minecraft:red_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]', ''],
        ['minecraft:red_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]', ''],
        ['minecraft:red_mushroom_block[north=false,east=false,south:false,west=false,up:false,down=false]', ''],
        [
            'minecraft:red_mushroom_block[north=true,east=true,south:true,west=true,up:true,down=true]',
            'minecraft:red_mushroom_block[variant=all_outside]'
        ],
        [
            'minecraft:mushroom_stem[north=true,east=true,south:true,west=true,up:true,down=true]',
            'minecraft:red_mushroom_block[variant=all_stem]'
        ],
        [
            'minecraft:iron_bars[east=false,north=false,south:false,west=false]',
            'minecraft:iron_bars[east=false,north=false,south:false,west=false]',
            'minecraft:iron_bars[east=false,north=false,south:false,west=true]',
            'minecraft:iron_bars[east=false,north=false,south:true,west=false]',
            'minecraft:iron_bars[east=false,north=false,south:true,west=true]',
            'minecraft:iron_bars[east=false,north=true,south:false,west=false]',
            'minecraft:iron_bars[east=false,north=true,south:false,west=true]',
            'minecraft:iron_bars[east=false,north=true,south:true,west=false]',
            'minecraft:iron_bars[east=false,north=true,south:true,west=true]',
            'minecraft:iron_bars[east=true,north=false,south:false,west=false]',
            'minecraft:iron_bars[east=true,north=false,south:false,west=true]',
            'minecraft:iron_bars[east=true,north=false,south:true,west=false]',
            'minecraft:iron_bars[east=true,north=false,south:true,west=true]',
            'minecraft:iron_bars[east=true,north=true,south:false,west=false]',
            'minecraft:iron_bars[east=true,north=true,south:false,west=true]',
            'minecraft:iron_bars[east=true,north=true,south:true,west=false]',
            'minecraft:iron_bars[east=true,north=true,south:true,west=true]'
        ],
        [
            'minecraft:glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:glass_pane[east=false,north=false,south:false,west=true]',
            'minecraft:glass_pane[east=false,north=false,south:true,west=false]',
            'minecraft:glass_pane[east=false,north=false,south:true,west=true]',
            'minecraft:glass_pane[east=false,north=true,south:false,west=false]',
            'minecraft:glass_pane[east=false,north=true,south:false,west=true]',
            'minecraft:glass_pane[east=false,north=true,south:true,west=false]',
            'minecraft:glass_pane[east=false,north=true,south:true,west=true]',
            'minecraft:glass_pane[east=true,north=false,south:false,west=false]',
            'minecraft:glass_pane[east=true,north=false,south:false,west=true]',
            'minecraft:glass_pane[east=true,north=false,south:true,west=false]',
            'minecraft:glass_pane[east=true,north=false,south:true,west=true]',
            'minecraft:glass_pane[east=true,north=true,south:false,west=false]',
            'minecraft:glass_pane[east=true,north=true,south:false,west=true]',
            'minecraft:glass_pane[east=true,north=true,south:true,west=false]',
            'minecraft:glass_pane[east=true,north=true,south:true,west=true]'
        ],
        ['minecraft:melon_block', 'minecraft:melon_block'],
        [
            'minecraft:pumpkin_stem[age=0]',
            'minecraft:pumpkin_stem[age=0,facing=east]',
            'minecraft:pumpkin_stem[age=0,facing=north]',
            'minecraft:pumpkin_stem[age=0,facing=south]',
            'minecraft:pumpkin_stem[age=0,facing=up]',
            'minecraft:pumpkin_stem[age=0,facing=west]'
        ],
        [
            'minecraft:pumpkin_stem[age=1]',
            'minecraft:pumpkin_stem[age=1,facing=east]',
            'minecraft:pumpkin_stem[age=1,facing=north]',
            'minecraft:pumpkin_stem[age=1,facing=south]',
            'minecraft:pumpkin_stem[age=1,facing=up]',
            'minecraft:pumpkin_stem[age=1,facing=west]'
        ],
        [
            'minecraft:pumpkin_stem[age=2]',
            'minecraft:pumpkin_stem[age=2,facing=east]',
            'minecraft:pumpkin_stem[age=2,facing=north]',
            'minecraft:pumpkin_stem[age=2,facing=south]',
            'minecraft:pumpkin_stem[age=2,facing=up]',
            'minecraft:pumpkin_stem[age=2,facing=west]'
        ],
        [
            'minecraft:pumpkin_stem[age=3]',
            'minecraft:pumpkin_stem[age=3,facing=east]',
            'minecraft:pumpkin_stem[age=3,facing=north]',
            'minecraft:pumpkin_stem[age=3,facing=south]',
            'minecraft:pumpkin_stem[age=3,facing=up]',
            'minecraft:pumpkin_stem[age=3,facing=west]'
        ],
        [
            'minecraft:pumpkin_stem[age=4]',
            'minecraft:pumpkin_stem[age=4,facing=east]',
            'minecraft:pumpkin_stem[age=4,facing=north]',
            'minecraft:pumpkin_stem[age=4,facing=south]',
            'minecraft:pumpkin_stem[age=4,facing=up]',
            'minecraft:pumpkin_stem[age=4,facing=west]'
        ],
        [
            'minecraft:pumpkin_stem[age=5]',
            'minecraft:pumpkin_stem[age=5,facing=east]',
            'minecraft:pumpkin_stem[age=5,facing=north]',
            'minecraft:pumpkin_stem[age=5,facing=south]',
            'minecraft:pumpkin_stem[age=5,facing=up]',
            'minecraft:pumpkin_stem[age=5,facing=west]'
        ],
        [
            'minecraft:pumpkin_stem[age=6]',
            'minecraft:pumpkin_stem[age=6,facing=east]',
            'minecraft:pumpkin_stem[age=6,facing=north]',
            'minecraft:pumpkin_stem[age=6,facing=south]',
            'minecraft:pumpkin_stem[age=6,facing=up]',
            'minecraft:pumpkin_stem[age=6,facing=west]'
        ],
        [
            'minecraft:pumpkin_stem[age=7]',
            'minecraft:pumpkin_stem[age=7,facing=east]',
            'minecraft:pumpkin_stem[age=7,facing=north]',
            'minecraft:pumpkin_stem[age=7,facing=south]',
            'minecraft:pumpkin_stem[age=7,facing=up]',
            'minecraft:pumpkin_stem[age=7,facing=west]'
        ],
        [
            'minecraft:melon_stem[age=0]',
            'minecraft:melon_stem[age=0,facing=east]',
            'minecraft:melon_stem[age=0,facing=north]',
            'minecraft:melon_stem[age=0,facing=south]',
            'minecraft:melon_stem[age=0,facing=up]',
            'minecraft:melon_stem[age=0,facing=west]'
        ],
        [
            'minecraft:melon_stem[age=1]',
            'minecraft:melon_stem[age=1,facing=east]',
            'minecraft:melon_stem[age=1,facing=north]',
            'minecraft:melon_stem[age=1,facing=south]',
            'minecraft:melon_stem[age=1,facing=up]',
            'minecraft:melon_stem[age=1,facing=west]'
        ],
        [
            'minecraft:melon_stem[age=2]',
            'minecraft:melon_stem[age=2,facing=east]',
            'minecraft:melon_stem[age=2,facing=north]',
            'minecraft:melon_stem[age=2,facing=south]',
            'minecraft:melon_stem[age=2,facing=up]',
            'minecraft:melon_stem[age=2,facing=west]'
        ],
        [
            'minecraft:melon_stem[age=3]',
            'minecraft:melon_stem[age=3,facing=east]',
            'minecraft:melon_stem[age=3,facing=north]',
            'minecraft:melon_stem[age=3,facing=south]',
            'minecraft:melon_stem[age=3,facing=up]',
            'minecraft:melon_stem[age=3,facing=west]'
        ],
        [
            'minecraft:melon_stem[age=4]',
            'minecraft:melon_stem[age=4,facing=east]',
            'minecraft:melon_stem[age=4,facing=north]',
            'minecraft:melon_stem[age=4,facing=south]',
            'minecraft:melon_stem[age=4,facing=up]',
            'minecraft:melon_stem[age=4,facing=west]'
        ],
        [
            'minecraft:melon_stem[age=5]',
            'minecraft:melon_stem[age=5,facing=east]',
            'minecraft:melon_stem[age=5,facing=north]',
            'minecraft:melon_stem[age=5,facing=south]',
            'minecraft:melon_stem[age=5,facing=up]',
            'minecraft:melon_stem[age=5,facing=west]'
        ],
        [
            'minecraft:melon_stem[age=6]',
            'minecraft:melon_stem[age=6,facing=east]',
            'minecraft:melon_stem[age=6,facing=north]',
            'minecraft:melon_stem[age=6,facing=south]',
            'minecraft:melon_stem[age=6,facing=up]',
            'minecraft:melon_stem[age=6,facing=west]'
        ],
        [
            'minecraft:melon_stem[age=7]',
            'minecraft:melon_stem[age=7,facing=east]',
            'minecraft:melon_stem[age=7,facing=north]',
            'minecraft:melon_stem[age=7,facing=south]',
            'minecraft:melon_stem[age=7,facing=up]',
            'minecraft:melon_stem[age=7,facing=west]'
        ],
        [
            'minecraft:vine[east=false,north=false,south:false,up=true,west=false]',
            'minecraft:vine[east=false,north=false,south:false,up=false,west=false]',
            'minecraft:vine[east=false,north=false,south:false,up=true,west=false]'
        ],
        [
            'minecraft:vine[east=false,north=false,south:true,up=true,west=false]',
            'minecraft:vine[east=false,north=false,south:true,up=false,west=false]',
            'minecraft:vine[east=false,north=false,south:true,up=true,west=false]'
        ],
        [
            'minecraft:vine[east=false,north=false,south:false,up=true,west=true]',
            'minecraft:vine[east=false,north=false,south:false,up=false,west=true]',
            'minecraft:vine[east=false,north=false,south:false,up=true,west=true]'
        ],
        [
            'minecraft:vine[east=false,north=false,south:true,up=true,west=true]',
            'minecraft:vine[east=false,north=false,south:true,up=false,west=true]',
            'minecraft:vine[east=false,north=false,south:true,up=true,west=true]'
        ],
        [
            'minecraft:vine[east=false,north=true,south:false,up=true,west=false]',
            'minecraft:vine[east=false,north=true,south:false,up=false,west=false]',
            'minecraft:vine[east=false,north=true,south:false,up=true,west=false]'
        ],
        [
            'minecraft:vine[east=false,north=true,south:true,up=true,west=false]',
            'minecraft:vine[east=false,north=true,south:true,up=false,west=false]',
            'minecraft:vine[east=false,north=true,south:true,up=true,west=false]'
        ],
        [
            'minecraft:vine[east=false,north=true,south:false,up=true,west=true]',
            'minecraft:vine[east=false,north=true,south:false,up=false,west=true]',
            'minecraft:vine[east=false,north=true,south:false,up=true,west=true]'
        ],
        [
            'minecraft:vine[east=false,north=true,south:true,up=true,west=true]',
            'minecraft:vine[east=false,north=true,south:true,up=false,west=true]',
            'minecraft:vine[east=false,north=true,south:true,up=true,west=true]'
        ],
        [
            'minecraft:vine[east=true,north=false,south:false,up=true,west=false]',
            'minecraft:vine[east=true,north=false,south:false,up=false,west=false]',
            'minecraft:vine[east=true,north=false,south:false,up=true,west=false]'
        ],
        [
            'minecraft:vine[east=true,north=false,south:true,up=true,west=false]',
            'minecraft:vine[east=true,north=false,south:true,up=false,west=false]',
            'minecraft:vine[east=true,north=false,south:true,up=true,west=false]'
        ],
        [
            'minecraft:vine[east=true,north=false,south:false,up=true,west=true]',
            'minecraft:vine[east=true,north=false,south:false,up=false,west=true]',
            'minecraft:vine[east=true,north=false,south:false,up=true,west=true]'
        ],
        [
            'minecraft:vine[east=true,north=false,south:true,up=true,west=true]',
            'minecraft:vine[east=true,north=false,south:true,up=false,west=true]',
            'minecraft:vine[east=true,north=false,south:true,up=true,west=true]'
        ],
        [
            'minecraft:vine[east=true,north=true,south:false,up=true,west=false]',
            'minecraft:vine[east=true,north=true,south:false,up=false,west=false]',
            'minecraft:vine[east=true,north=true,south:false,up=true,west=false]'
        ],
        [
            'minecraft:vine[east=true,north=true,south:true,up=true,west=false]',
            'minecraft:vine[east=true,north=true,south:true,up=false,west=false]',
            'minecraft:vine[east=true,north=true,south:true,up=true,west=false]'
        ],
        [
            'minecraft:vine[east=true,north=true,south:false,up=true,west=true]',
            'minecraft:vine[east=true,north=true,south:false,up=false,west=true]',
            'minecraft:vine[east=true,north=true,south:false,up=true,west=true]'
        ],
        [
            'minecraft:vine[east=true,north=true,south:true,up=true,west=true]',
            'minecraft:vine[east=true,north=true,south:true,up=false,west=true]',
            'minecraft:vine[east=true,north=true,south:true,up=true,west=true]'
        ],
        [
            'minecraft:oak_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
            'minecraft:fence_gate[facing=south,in_wall=false,open:false,powered=false]',
            'minecraft:fence_gate[facing=south,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:oak_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
            'minecraft:fence_gate[facing=west,in_wall=false,open:false,powered=false]',
            'minecraft:fence_gate[facing=west,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:oak_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
            'minecraft:fence_gate[facing=north,in_wall=false,open:false,powered=false]',
            'minecraft:fence_gate[facing=north,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:oak_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
            'minecraft:fence_gate[facing=east,in_wall=false,open:false,powered=false]',
            'minecraft:fence_gate[facing=east,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:oak_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
            'minecraft:fence_gate[facing=south,in_wall=false,open:true,powered=false]',
            'minecraft:fence_gate[facing=south,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:oak_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
            'minecraft:fence_gate[facing=west,in_wall=false,open:true,powered=false]',
            'minecraft:fence_gate[facing=west,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:oak_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
            'minecraft:fence_gate[facing=north,in_wall=false,open:true,powered=false]',
            'minecraft:fence_gate[facing=north,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:oak_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
            'minecraft:fence_gate[facing=east,in_wall=false,open:true,powered=false]',
            'minecraft:fence_gate[facing=east,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:oak_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
            'minecraft:fence_gate[facing=south,in_wall=false,open:false,powered=true]',
            'minecraft:fence_gate[facing=south,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:oak_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
            'minecraft:fence_gate[facing=west,in_wall=false,open:false,powered=true]',
            'minecraft:fence_gate[facing=west,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:oak_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
            'minecraft:fence_gate[facing=north,in_wall=false,open:false,powered=true]',
            'minecraft:fence_gate[facing=north,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:oak_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
            'minecraft:fence_gate[facing=east,in_wall=false,open:false,powered=true]',
            'minecraft:fence_gate[facing=east,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:oak_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
            'minecraft:fence_gate[facing=south,in_wall=false,open:true,powered=true]',
            'minecraft:fence_gate[facing=south,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:oak_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
            'minecraft:fence_gate[facing=west,in_wall=false,open:true,powered=true]',
            'minecraft:fence_gate[facing=west,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:oak_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
            'minecraft:fence_gate[facing=north,in_wall=false,open:true,powered=true]',
            'minecraft:fence_gate[facing=north,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:oak_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
            'minecraft:fence_gate[facing=east,in_wall=false,open:true,powered=true]',
            'minecraft:fence_gate[facing=east,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:brick_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:brick_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:brick_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:brick_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:brick_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:brick_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:brick_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:brick_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:brick_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:brick_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:brick_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:brick_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:brick_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:brick_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:brick_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:brick_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:brick_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:brick_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:brick_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:brick_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:brick_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:brick_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:brick_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:brick_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:brick_stairs[facing=east,half=top,shape=straight]',
            'minecraft:brick_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:brick_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:brick_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:brick_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:brick_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:brick_stairs[facing=west,half=top,shape=straight]',
            'minecraft:brick_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:brick_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:brick_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:brick_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:brick_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:brick_stairs[facing=south,half=top,shape=straight]',
            'minecraft:brick_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:brick_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:brick_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:brick_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:brick_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:brick_stairs[facing=north,half=top,shape=straight]',
            'minecraft:brick_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:brick_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:brick_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:brick_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:brick_stairs[facing=north,half=top,shape=straight]'
        ],
        [
            'minecraft:stone_brick_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:stone_brick_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:stone_brick_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:stone_brick_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:stone_brick_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:stone_brick_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:stone_brick_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:stone_brick_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:stone_brick_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:stone_brick_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:stone_brick_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:stone_brick_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:stone_brick_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:stone_brick_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:stone_brick_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:stone_brick_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:stone_brick_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:stone_brick_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:stone_brick_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:stone_brick_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:stone_brick_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:stone_brick_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:stone_brick_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:stone_brick_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:stone_brick_stairs[facing=east,half=top,shape=straight]',
            'minecraft:stone_brick_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:stone_brick_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:stone_brick_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:stone_brick_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:stone_brick_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:stone_brick_stairs[facing=west,half=top,shape=straight]',
            'minecraft:stone_brick_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:stone_brick_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:stone_brick_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:stone_brick_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:stone_brick_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:stone_brick_stairs[facing=south,half=top,shape=straight]',
            'minecraft:stone_brick_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:stone_brick_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:stone_brick_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:stone_brick_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:stone_brick_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:stone_brick_stairs[facing=north,half=top,shape=straight]',
            'minecraft:stone_brick_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:stone_brick_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:stone_brick_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:stone_brick_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:stone_brick_stairs[facing=north,half=top,shape=straight]'
        ],
        ['minecraft:mycelium[snowy=false]', 'minecraft:mycelium[snowy=false]', 'minecraft:mycelium[snowy=true]'],
        ['minecraft:lily_pad', 'minecraft:waterlily'],
        ['minecraft:nether_bricks', 'minecraft:nether_brick'],
        [
            'minecraft:nether_brick_fence[east=false,north=false,south:false,west=false]',
            'minecraft:nether_brick_fence[east=false,north=false,south:false,west=false]',
            'minecraft:nether_brick_fence[east=false,north=false,south:false,west=true]',
            'minecraft:nether_brick_fence[east=false,north=false,south:true,west=false]',
            'minecraft:nether_brick_fence[east=false,north=false,south:true,west=true]',
            'minecraft:nether_brick_fence[east=false,north=true,south:false,west=false]',
            'minecraft:nether_brick_fence[east=false,north=true,south:false,west=true]',
            'minecraft:nether_brick_fence[east=false,north=true,south:true,west=false]',
            'minecraft:nether_brick_fence[east=false,north=true,south:true,west=true]',
            'minecraft:nether_brick_fence[east=true,north=false,south:false,west=false]',
            'minecraft:nether_brick_fence[east=true,north=false,south:false,west=true]',
            'minecraft:nether_brick_fence[east=true,north=false,south:true,west=false]',
            'minecraft:nether_brick_fence[east=true,north=false,south:true,west=true]',
            'minecraft:nether_brick_fence[east=true,north=true,south:false,west=false]',
            'minecraft:nether_brick_fence[east=true,north=true,south:false,west=true]',
            'minecraft:nether_brick_fence[east=true,north=true,south:true,west=false]',
            'minecraft:nether_brick_fence[east=true,north=true,south:true,west=true]'
        ],
        [
            'minecraft:nether_brick_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:nether_brick_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:nether_brick_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:nether_brick_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:nether_brick_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:nether_brick_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:nether_brick_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:nether_brick_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:nether_brick_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:nether_brick_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:nether_brick_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:nether_brick_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:nether_brick_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:nether_brick_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:nether_brick_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:nether_brick_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:nether_brick_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:nether_brick_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:nether_brick_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:nether_brick_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:nether_brick_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:nether_brick_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:nether_brick_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:nether_brick_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:nether_brick_stairs[facing=east,half=top,shape=straight]',
            'minecraft:nether_brick_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:nether_brick_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:nether_brick_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:nether_brick_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:nether_brick_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:nether_brick_stairs[facing=west,half=top,shape=straight]',
            'minecraft:nether_brick_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:nether_brick_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:nether_brick_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:nether_brick_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:nether_brick_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:nether_brick_stairs[facing=south,half=top,shape=straight]',
            'minecraft:nether_brick_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:nether_brick_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:nether_brick_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:nether_brick_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:nether_brick_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:nether_brick_stairs[facing=north,half=top,shape=straight]',
            'minecraft:nether_brick_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:nether_brick_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:nether_brick_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:nether_brick_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:nether_brick_stairs[facing=north,half=top,shape=straight]'
        ],
        ['minecraft:nether_wart[age=0]', 'minecraft:nether_wart[age=0]'],
        ['minecraft:nether_wart[age=1]', 'minecraft:nether_wart[age=1]'],
        ['minecraft:nether_wart[age=2]', 'minecraft:nether_wart[age=2]'],
        ['minecraft:nether_wart[age=3]', 'minecraft:nether_wart[age=3]'],
        ['minecraft:enchanting_table', 'minecraft:enchanting_table'],
        [
            'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=false,has_bottle_2=false]',
            'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=false,has_bottle_2=false]'
        ],
        [
            'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=false,has_bottle_2=false]',
            'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=false,has_bottle_2=false]'
        ],
        [
            'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=true,has_bottle_2=false]',
            'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=true,has_bottle_2=false]'
        ],
        [
            'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=true,has_bottle_2=false]',
            'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=true,has_bottle_2=false]'
        ],
        [
            'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=false,has_bottle_2=true]',
            'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=false,has_bottle_2=true]'
        ],
        [
            'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=false,has_bottle_2=true]',
            'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=false,has_bottle_2=true]'
        ],
        [
            'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=true,has_bottle_2=true]',
            'minecraft:brewing_stand[has_bottle_0=false,has_bottle_1=true,has_bottle_2=true]'
        ],
        [
            'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=true,has_bottle_2=true]',
            'minecraft:brewing_stand[has_bottle_0=true,has_bottle_1=true,has_bottle_2=true]'
        ],
        ['minecraft:cauldron[level=0]', 'minecraft:cauldron[level=0]'],
        ['minecraft:cauldron[level=1]', 'minecraft:cauldron[level=1]'],
        ['minecraft:cauldron[level=2]', 'minecraft:cauldron[level=2]'],
        ['minecraft:cauldron[level=3]', 'minecraft:cauldron[level=3]'],
        ['minecraft:end_portal', 'minecraft:end_portal'],
        ['minecraft:end_portal_frame[eye=false,facing=south]', 'minecraft:end_portal_frame[eye=false,facing=south]'],
        ['minecraft:end_portal_frame[eye=false,facing=west]', 'minecraft:end_portal_frame[eye=false,facing=west]'],
        ['minecraft:end_portal_frame[eye=false,facing=north]', 'minecraft:end_portal_frame[eye=false,facing=north]'],
        ['minecraft:end_portal_frame[eye=false,facing=east]', 'minecraft:end_portal_frame[eye=false,facing=east]'],
        ['minecraft:end_portal_frame[eye=true,facing=south]', 'minecraft:end_portal_frame[eye=true,facing=south]'],
        ['minecraft:end_portal_frame[eye=true,facing=west]', 'minecraft:end_portal_frame[eye=true,facing=west]'],
        ['minecraft:end_portal_frame[eye=true,facing=north]', 'minecraft:end_portal_frame[eye=true,facing=north]'],
        ['minecraft:end_portal_frame[eye=true,facing=east]', 'minecraft:end_portal_frame[eye=true,facing=east]'],
        ['minecraft:end_stone', 'minecraft:end_stone'],
        ['minecraft:dragon_egg', 'minecraft:dragon_egg'],
        ['minecraft:redstone_lamp[lit=false]', 'minecraft:redstone_lamp'],
        ['minecraft:redstone_lamp[lit=true]', 'minecraft:lit_redstone_lamp'],
        ['minecraft:oak_slab[type=double]', 'minecraft:double_wooden_slab[variant=oak]'],
        ['minecraft:spruce_slab[type=double]', 'minecraft:double_wooden_slab[variant=spruce]'],
        ['minecraft:birch_slab[type=double]', 'minecraft:double_wooden_slab[variant=birch]'],
        ['minecraft:jungle_slab[type=double]', 'minecraft:double_wooden_slab[variant=jungle]'],
        ['minecraft:acacia_slab[type=double]', 'minecraft:double_wooden_slab[variant=acacia]'],
        ['minecraft:dark_oak_slab[type=double]', 'minecraft:double_wooden_slab[variant=dark_oak]'],
        ['minecraft:oak_slab[type=bottom]', 'minecraft:wooden_slab[half=bottom,variant=oak]'],
        ['minecraft:spruce_slab[type=bottom]', 'minecraft:wooden_slab[half=bottom,variant=spruce]'],
        ['minecraft:birch_slab[type=bottom]', 'minecraft:wooden_slab[half=bottom,variant=birch]'],
        ['minecraft:jungle_slab[type=bottom]', 'minecraft:wooden_slab[half=bottom,variant=jungle]'],
        ['minecraft:acacia_slab[type=bottom]', 'minecraft:wooden_slab[half=bottom,variant=acacia]'],
        ['minecraft:dark_oak_slab[type=bottom]', 'minecraft:wooden_slab[half=bottom,variant=dark_oak]'],
        ['minecraft:oak_slab[type=top]', 'minecraft:wooden_slab[half=top,variant=oak]'],
        ['minecraft:spruce_slab[type=top]', 'minecraft:wooden_slab[half=top,variant=spruce]'],
        ['minecraft:birch_slab[type=top]', 'minecraft:wooden_slab[half=top,variant=birch]'],
        ['minecraft:jungle_slab[type=top]', 'minecraft:wooden_slab[half=top,variant=jungle]'],
        ['minecraft:acacia_slab[type=top]', 'minecraft:wooden_slab[half=top,variant=acacia]'],
        ['minecraft:dark_oak_slab[type=top]', 'minecraft:wooden_slab[half=top,variant=dark_oak]'],
        ['minecraft:cocoa[age=0,facing=south]', 'minecraft:cocoa[age=0,facing=south]'],
        ['minecraft:cocoa[age=0,facing=west]', 'minecraft:cocoa[age=0,facing=west]'],
        ['minecraft:cocoa[age=0,facing=north]', 'minecraft:cocoa[age=0,facing=north]'],
        ['minecraft:cocoa[age=0,facing=east]', 'minecraft:cocoa[age=0,facing=east]'],
        ['minecraft:cocoa[age=1,facing=south]', 'minecraft:cocoa[age=1,facing=south]'],
        ['minecraft:cocoa[age=1,facing=west]', 'minecraft:cocoa[age=1,facing=west]'],
        ['minecraft:cocoa[age=1,facing=north]', 'minecraft:cocoa[age=1,facing=north]'],
        ['minecraft:cocoa[age=1,facing=east]', 'minecraft:cocoa[age=1,facing=east]'],
        ['minecraft:cocoa[age=2,facing=south]', 'minecraft:cocoa[age=2,facing=south]'],
        ['minecraft:cocoa[age=2,facing=west]', 'minecraft:cocoa[age=2,facing=west]'],
        ['minecraft:cocoa[age=2,facing=north]', 'minecraft:cocoa[age=2,facing=north]'],
        ['minecraft:cocoa[age=2,facing=east]', 'minecraft:cocoa[age=2,facing=east]'],
        [
            'minecraft:sandstone_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:sandstone_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:sandstone_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:sandstone_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:sandstone_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:sandstone_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:sandstone_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:sandstone_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:sandstone_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:sandstone_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:sandstone_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:sandstone_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:sandstone_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:sandstone_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:sandstone_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:sandstone_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:sandstone_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:sandstone_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:sandstone_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:sandstone_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:sandstone_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:sandstone_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:sandstone_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:sandstone_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:sandstone_stairs[facing=east,half=top,shape=straight]',
            'minecraft:sandstone_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:sandstone_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:sandstone_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:sandstone_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:sandstone_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:sandstone_stairs[facing=west,half=top,shape=straight]',
            'minecraft:sandstone_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:sandstone_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:sandstone_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:sandstone_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:sandstone_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:sandstone_stairs[facing=south,half=top,shape=straight]',
            'minecraft:sandstone_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:sandstone_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:sandstone_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:sandstone_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:sandstone_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:sandstone_stairs[facing=north,half=top,shape=straight]',
            'minecraft:sandstone_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:sandstone_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:sandstone_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:sandstone_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:sandstone_stairs[facing=north,half=top,shape=straight]'
        ],
        ['minecraft:emerald_ore', 'minecraft:emerald_ore'],
        ['minecraft:ender_chest[facing=north]', 'minecraft:ender_chest[facing=north]'],
        ['minecraft:ender_chest[facing=south]', 'minecraft:ender_chest[facing=south]'],
        ['minecraft:ender_chest[facing=west]', 'minecraft:ender_chest[facing=west]'],
        ['minecraft:ender_chest[facing=east]', 'minecraft:ender_chest[facing=east]'],
        [
            'minecraft:tripwire_hook[attached=false,facing=south,powered=false]',
            'minecraft:tripwire_hook[attached=false,facing=south,powered=false]'
        ],
        [
            'minecraft:tripwire_hook[attached=false,facing=west,powered=false]',
            'minecraft:tripwire_hook[attached=false,facing=west,powered=false]'
        ],
        [
            'minecraft:tripwire_hook[attached=false,facing=north,powered=false]',
            'minecraft:tripwire_hook[attached=false,facing=north,powered=false]'
        ],
        [
            'minecraft:tripwire_hook[attached=false,facing=east,powered=false]',
            'minecraft:tripwire_hook[attached=false,facing=east,powered=false]'
        ],
        [
            'minecraft:tripwire_hook[attached=true,facing=south,powered=false]',
            'minecraft:tripwire_hook[attached=true,facing=south,powered=false]'
        ],
        [
            'minecraft:tripwire_hook[attached=true,facing=west,powered=false]',
            'minecraft:tripwire_hook[attached=true,facing=west,powered=false]'
        ],
        [
            'minecraft:tripwire_hook[attached=true,facing=north,powered=false]',
            'minecraft:tripwire_hook[attached=true,facing=north,powered=false]'
        ],
        [
            'minecraft:tripwire_hook[attached=true,facing=east,powered=false]',
            'minecraft:tripwire_hook[attached=true,facing=east,powered=false]'
        ],
        [
            'minecraft:tripwire_hook[attached=false,facing=south,powered=true]',
            'minecraft:tripwire_hook[attached=false,facing=south,powered=true]'
        ],
        [
            'minecraft:tripwire_hook[attached=false,facing=west,powered=true]',
            'minecraft:tripwire_hook[attached=false,facing=west,powered=true]'
        ],
        [
            'minecraft:tripwire_hook[attached=false,facing=north,powered=true]',
            'minecraft:tripwire_hook[attached=false,facing=north,powered=true]'
        ],
        [
            'minecraft:tripwire_hook[attached=false,facing=east,powered=true]',
            'minecraft:tripwire_hook[attached=false,facing=east,powered=true]'
        ],
        [
            'minecraft:tripwire_hook[attached=true,facing=south,powered=true]',
            'minecraft:tripwire_hook[attached=true,facing=south,powered=true]'
        ],
        [
            'minecraft:tripwire_hook[attached=true,facing=west,powered=true]',
            'minecraft:tripwire_hook[attached=true,facing=west,powered=true]'
        ],
        [
            'minecraft:tripwire_hook[attached=true,facing=north,powered=true]',
            'minecraft:tripwire_hook[attached=true,facing=north,powered=true]'
        ],
        [
            'minecraft:tripwire_hook[attached=true,facing=east,powered=true]',
            'minecraft:tripwire_hook[attached=true,facing=east,powered=true]'
        ],
        [
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:false,south=true,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:false,south=true,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:false,south=true,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:false,south=true,west=true]'
        ],
        [
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:true,south=true,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=true,powered:true,south=true,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=false,powered:true,south=true,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=false,east:true,north=true,powered:true,south=true,west=true]'
        ],
        [
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:false,south=false,west=false]',
            ''
        ],
        [
            'minecraft:tripwire[attached=false,disarmed=false,east:false,north=false,powered:true,south=false,west=false]',
            ''
        ],
        [
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:false,south=true,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:false,south=true,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:false,south=true,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:false,south=true,west=true]'
        ],
        [
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:true,south=true,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=true,powered:true,south=true,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=false,powered:true,south=true,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=false,east:true,north=true,powered:true,south=true,west=true]'
        ],
        [
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:false,south=false,west=false]',
            ''
        ],
        [
            'minecraft:tripwire[attached=true,disarmed=false,east:false,north=false,powered:true,south=false,west=false]',
            ''
        ],
        [
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:false,south=true,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:false,south=true,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:false,south=true,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:false,south=true,west=true]'
        ],
        [
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:true,south=true,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=true,powered:true,south=true,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=false,powered:true,south=true,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=false,disarmed=true,east:true,north=true,powered:true,south=true,west=true]'
        ],
        [
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:false,south=false,west=false]',
            ''
        ],
        [
            'minecraft:tripwire[attached=false,disarmed=true,east:false,north=false,powered:true,south=false,west=false]',
            ''
        ],
        [
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:false,south=true,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:false,south=true,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:false,south=true,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:false,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:false,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:false,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:false,south=true,west=true]'
        ],
        [
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:true,south=true,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=true,powered:true,south=true,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=false,powered:true,south=true,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:true,south=false,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:true,south=false,west=true]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:true,south=true,west=false]',
            'minecraft:tripwire[attached=true,disarmed=true,east:true,north=true,powered:true,south=true,west=true]'
        ],
        [
            'minecraft:tripwire[attached=true,disarmed=true,east:false,north=false,powered:false,south=false,west=false]',
            ''
        ],
        ['minecraft:emerald_block', 'minecraft:emerald_block'],
        [
            'minecraft:spruce_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:spruce_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:spruce_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:spruce_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:spruce_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:spruce_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:spruce_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:spruce_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:spruce_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:spruce_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:spruce_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:spruce_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:spruce_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:spruce_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:spruce_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:spruce_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:spruce_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:spruce_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:spruce_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:spruce_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:spruce_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:spruce_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:spruce_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:spruce_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:spruce_stairs[facing=east,half=top,shape=straight]',
            'minecraft:spruce_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:spruce_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:spruce_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:spruce_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:spruce_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:spruce_stairs[facing=west,half=top,shape=straight]',
            'minecraft:spruce_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:spruce_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:spruce_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:spruce_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:spruce_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:spruce_stairs[facing=south,half=top,shape=straight]',
            'minecraft:spruce_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:spruce_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:spruce_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:spruce_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:spruce_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:spruce_stairs[facing=north,half=top,shape=straight]',
            'minecraft:spruce_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:spruce_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:spruce_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:spruce_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:spruce_stairs[facing=north,half=top,shape=straight]'
        ],
        [
            'minecraft:birch_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:birch_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:birch_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:birch_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:birch_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:birch_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:birch_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:birch_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:birch_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:birch_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:birch_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:birch_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:birch_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:birch_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:birch_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:birch_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:birch_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:birch_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:birch_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:birch_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:birch_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:birch_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:birch_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:birch_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:birch_stairs[facing=east,half=top,shape=straight]',
            'minecraft:birch_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:birch_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:birch_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:birch_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:birch_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:birch_stairs[facing=west,half=top,shape=straight]',
            'minecraft:birch_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:birch_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:birch_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:birch_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:birch_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:birch_stairs[facing=south,half=top,shape=straight]',
            'minecraft:birch_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:birch_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:birch_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:birch_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:birch_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:birch_stairs[facing=north,half=top,shape=straight]',
            'minecraft:birch_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:birch_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:birch_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:birch_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:birch_stairs[facing=north,half=top,shape=straight]'
        ],
        [
            'minecraft:jungle_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:jungle_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:jungle_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:jungle_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:jungle_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:jungle_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:jungle_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:jungle_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:jungle_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:jungle_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:jungle_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:jungle_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:jungle_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:jungle_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:jungle_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:jungle_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:jungle_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:jungle_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:jungle_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:jungle_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:jungle_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:jungle_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:jungle_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:jungle_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:jungle_stairs[facing=east,half=top,shape=straight]',
            'minecraft:jungle_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:jungle_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:jungle_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:jungle_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:jungle_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:jungle_stairs[facing=west,half=top,shape=straight]',
            'minecraft:jungle_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:jungle_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:jungle_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:jungle_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:jungle_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:jungle_stairs[facing=south,half=top,shape=straight]',
            'minecraft:jungle_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:jungle_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:jungle_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:jungle_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:jungle_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:jungle_stairs[facing=north,half=top,shape=straight]',
            'minecraft:jungle_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:jungle_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:jungle_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:jungle_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:jungle_stairs[facing=north,half=top,shape=straight]'
        ],
        [
            'minecraft:command_block[conditional=false,facing=down]',
            'minecraft:command_block[conditional=false,facing=down]'
        ],
        [
            'minecraft:command_block[conditional=false,facing=up]',
            'minecraft:command_block[conditional=false,facing=up]'
        ],
        [
            'minecraft:command_block[conditional=false,facing=north]',
            'minecraft:command_block[conditional=false,facing=north]'
        ],
        [
            'minecraft:command_block[conditional=false,facing=south]',
            'minecraft:command_block[conditional=false,facing=south]'
        ],
        [
            'minecraft:command_block[conditional=false,facing=west]',
            'minecraft:command_block[conditional=false,facing=west]'
        ],
        [
            'minecraft:command_block[conditional=false,facing=east]',
            'minecraft:command_block[conditional=false,facing=east]'
        ],
        [
            'minecraft:command_block[conditional=true,facing=down]',
            'minecraft:command_block[conditional=true,facing=down]'
        ],
        ['minecraft:command_block[conditional=true,facing=up]', 'minecraft:command_block[conditional=true,facing=up]'],
        [
            'minecraft:command_block[conditional=true,facing=north]',
            'minecraft:command_block[conditional=true,facing=north]'
        ],
        [
            'minecraft:command_block[conditional=true,facing=south]',
            'minecraft:command_block[conditional=true,facing=south]'
        ],
        [
            'minecraft:command_block[conditional=true,facing=west]',
            'minecraft:command_block[conditional=true,facing=west]'
        ],
        [
            'minecraft:command_block[conditional=true,facing=east]',
            'minecraft:command_block[conditional=true,facing=east]'
        ],
        ['minecraft:beacon', 'minecraft:beacon'],
        [
            'minecraft:cobblestone_wall[east=false,north=false,south:false,up=false,west=false]',
            'minecraft:cobblestone_wall[east=false,north=false,south:false,up=false,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=false,south:false,up=false,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=false,south:false,up=true,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=false,south:false,up=true,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=false,south:true,up=false,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=false,south:true,up=false,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=false,south:true,up=true,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=false,south:true,up=true,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=true,south:false,up=false,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=true,south:false,up=false,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=true,south:false,up=true,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=true,south:false,up=true,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=true,south:true,up=false,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=true,south:true,up=false,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=true,south:true,up=true,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=true,south:true,up=true,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=false,south:false,up=false,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=false,south:false,up=false,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=false,south:false,up=true,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=false,south:false,up=true,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=false,south:true,up=false,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=false,south:true,up=false,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=false,south:true,up=true,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=false,south:true,up=true,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=true,south:false,up=false,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=true,south:false,up=false,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=true,south:false,up=true,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=true,south:false,up=true,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=true,south:true,up=false,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=true,south:true,up=false,variant:cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=true,south:true,up=true,variant:cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=true,south:true,up=true,variant:cobblestone,west=true]'
        ],
        [
            'minecraft:mossy_cobblestone_wall[east=false,north=false,south:false,up=false,west=false]',
            'minecraft:cobblestone_wall[east=false,north=false,south:false,up=false,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=false,south:false,up=false,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=false,south:false,up=true,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=false,south:false,up=true,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=false,south:true,up=false,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=false,south:true,up=false,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=false,south:true,up=true,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=false,south:true,up=true,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=true,south:false,up=false,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=true,south:false,up=false,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=true,south:false,up=true,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=true,south:false,up=true,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=true,south:true,up=false,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=true,south:true,up=false,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=false,north=true,south:true,up=true,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=false,north=true,south:true,up=true,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=false,south:false,up=false,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=false,south:false,up=false,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=false,south:false,up=true,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=false,south:false,up=true,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=false,south:true,up=false,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=false,south:true,up=false,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=false,south:true,up=true,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=false,south:true,up=true,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=true,south:false,up=false,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=true,south:false,up=false,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=true,south:false,up=true,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=true,south:false,up=true,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=true,south:true,up=false,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=true,south:true,up=false,variant:mossy_cobblestone,west=true]',
            'minecraft:cobblestone_wall[east=true,north=true,south:true,up=true,variant:mossy_cobblestone,west=false]',
            'minecraft:cobblestone_wall[east=true,north=true,south:true,up=true,variant:mossy_cobblestone,west=true]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=0]',
            'minecraft:flower_pot[contents=allium,legacy_data=0]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=0]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=0]',
            'minecraft:flower_pot[contents=cactus,legacy_data=0]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=0]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=0]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=0]',
            'minecraft:flower_pot[contents=empty,legacy_data=0]',
            'minecraft:flower_pot[contents=fern,legacy_data=0]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=0]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=0]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=0]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=0]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=0]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=0]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=0]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=0]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=0]',
            'minecraft:flower_pot[contents=rose,legacy_data=0]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=0]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=0]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=1]',
            'minecraft:flower_pot[contents=allium,legacy_data=1]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=1]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=1]',
            'minecraft:flower_pot[contents=cactus,legacy_data=1]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=1]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=1]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=1]',
            'minecraft:flower_pot[contents=empty,legacy_data=1]',
            'minecraft:flower_pot[contents=fern,legacy_data=1]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=1]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=1]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=1]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=1]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=1]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=1]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=1]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=1]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=1]',
            'minecraft:flower_pot[contents=rose,legacy_data=1]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=1]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=1]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=2]',
            'minecraft:flower_pot[contents=allium,legacy_data=2]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=2]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=2]',
            'minecraft:flower_pot[contents=cactus,legacy_data=2]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=2]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=2]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=2]',
            'minecraft:flower_pot[contents=empty,legacy_data=2]',
            'minecraft:flower_pot[contents=fern,legacy_data=2]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=2]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=2]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=2]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=2]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=2]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=2]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=2]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=2]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=2]',
            'minecraft:flower_pot[contents=rose,legacy_data=2]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=2]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=2]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=3]',
            'minecraft:flower_pot[contents=allium,legacy_data=3]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=3]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=3]',
            'minecraft:flower_pot[contents=cactus,legacy_data=3]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=3]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=3]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=3]',
            'minecraft:flower_pot[contents=empty,legacy_data=3]',
            'minecraft:flower_pot[contents=fern,legacy_data=3]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=3]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=3]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=3]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=3]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=3]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=3]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=3]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=3]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=3]',
            'minecraft:flower_pot[contents=rose,legacy_data=3]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=3]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=3]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=4]',
            'minecraft:flower_pot[contents=allium,legacy_data=4]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=4]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=4]',
            'minecraft:flower_pot[contents=cactus,legacy_data=4]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=4]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=4]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=4]',
            'minecraft:flower_pot[contents=empty,legacy_data=4]',
            'minecraft:flower_pot[contents=fern,legacy_data=4]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=4]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=4]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=4]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=4]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=4]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=4]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=4]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=4]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=4]',
            'minecraft:flower_pot[contents=rose,legacy_data=4]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=4]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=4]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=5]',
            'minecraft:flower_pot[contents=allium,legacy_data=5]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=5]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=5]',
            'minecraft:flower_pot[contents=cactus,legacy_data=5]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=5]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=5]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=5]',
            'minecraft:flower_pot[contents=empty,legacy_data=5]',
            'minecraft:flower_pot[contents=fern,legacy_data=5]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=5]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=5]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=5]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=5]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=5]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=5]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=5]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=5]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=5]',
            'minecraft:flower_pot[contents=rose,legacy_data=5]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=5]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=5]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=6]',
            'minecraft:flower_pot[contents=allium,legacy_data=6]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=6]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=6]',
            'minecraft:flower_pot[contents=cactus,legacy_data=6]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=6]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=6]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=6]',
            'minecraft:flower_pot[contents=empty,legacy_data=6]',
            'minecraft:flower_pot[contents=fern,legacy_data=6]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=6]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=6]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=6]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=6]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=6]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=6]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=6]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=6]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=6]',
            'minecraft:flower_pot[contents=rose,legacy_data=6]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=6]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=6]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=7]',
            'minecraft:flower_pot[contents=allium,legacy_data=7]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=7]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=7]',
            'minecraft:flower_pot[contents=cactus,legacy_data=7]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=7]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=7]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=7]',
            'minecraft:flower_pot[contents=empty,legacy_data=7]',
            'minecraft:flower_pot[contents=fern,legacy_data=7]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=7]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=7]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=7]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=7]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=7]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=7]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=7]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=7]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=7]',
            'minecraft:flower_pot[contents=rose,legacy_data=7]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=7]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=7]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=8]',
            'minecraft:flower_pot[contents=allium,legacy_data=8]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=8]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=8]',
            'minecraft:flower_pot[contents=cactus,legacy_data=8]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=8]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=8]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=8]',
            'minecraft:flower_pot[contents=empty,legacy_data=8]',
            'minecraft:flower_pot[contents=fern,legacy_data=8]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=8]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=8]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=8]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=8]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=8]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=8]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=8]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=8]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=8]',
            'minecraft:flower_pot[contents=rose,legacy_data=8]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=8]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=8]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=9]',
            'minecraft:flower_pot[contents=allium,legacy_data=9]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=9]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=9]',
            'minecraft:flower_pot[contents=cactus,legacy_data=9]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=9]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=9]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=9]',
            'minecraft:flower_pot[contents=empty,legacy_data=9]',
            'minecraft:flower_pot[contents=fern,legacy_data=9]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=9]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=9]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=9]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=9]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=9]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=9]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=9]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=9]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=9]',
            'minecraft:flower_pot[contents=rose,legacy_data=9]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=9]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=9]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=10]',
            'minecraft:flower_pot[contents=allium,legacy_data=10]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=10]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=10]',
            'minecraft:flower_pot[contents=cactus,legacy_data=10]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=10]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=10]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=10]',
            'minecraft:flower_pot[contents=empty,legacy_data=10]',
            'minecraft:flower_pot[contents=fern,legacy_data=10]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=10]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=10]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=10]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=10]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=10]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=10]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=10]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=10]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=10]',
            'minecraft:flower_pot[contents=rose,legacy_data=10]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=10]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=10]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=11]',
            'minecraft:flower_pot[contents=allium,legacy_data=11]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=11]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=11]',
            'minecraft:flower_pot[contents=cactus,legacy_data=11]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=11]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=11]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=11]',
            'minecraft:flower_pot[contents=empty,legacy_data=11]',
            'minecraft:flower_pot[contents=fern,legacy_data=11]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=11]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=11]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=11]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=11]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=11]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=11]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=11]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=11]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=11]',
            'minecraft:flower_pot[contents=rose,legacy_data=11]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=11]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=11]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=12]',
            'minecraft:flower_pot[contents=allium,legacy_data=12]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=12]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=12]',
            'minecraft:flower_pot[contents=cactus,legacy_data=12]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=12]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=12]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=12]',
            'minecraft:flower_pot[contents=empty,legacy_data=12]',
            'minecraft:flower_pot[contents=fern,legacy_data=12]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=12]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=12]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=12]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=12]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=12]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=12]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=12]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=12]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=12]',
            'minecraft:flower_pot[contents=rose,legacy_data=12]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=12]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=12]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=13]',
            'minecraft:flower_pot[contents=allium,legacy_data=13]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=13]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=13]',
            'minecraft:flower_pot[contents=cactus,legacy_data=13]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=13]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=13]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=13]',
            'minecraft:flower_pot[contents=empty,legacy_data=13]',
            'minecraft:flower_pot[contents=fern,legacy_data=13]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=13]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=13]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=13]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=13]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=13]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=13]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=13]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=13]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=13]',
            'minecraft:flower_pot[contents=rose,legacy_data=13]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=13]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=13]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=14]',
            'minecraft:flower_pot[contents=allium,legacy_data=14]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=14]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=14]',
            'minecraft:flower_pot[contents=cactus,legacy_data=14]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=14]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=14]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=14]',
            'minecraft:flower_pot[contents=empty,legacy_data=14]',
            'minecraft:flower_pot[contents=fern,legacy_data=14]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=14]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=14]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=14]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=14]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=14]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=14]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=14]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=14]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=14]',
            'minecraft:flower_pot[contents=rose,legacy_data=14]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=14]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=14]'
        ],
        [
            'minecraft:potted_cactus',
            'minecraft:flower_pot[contents=acacia_sapling,legacy_data=15]',
            'minecraft:flower_pot[contents=allium,legacy_data=15]',
            'minecraft:flower_pot[contents=birch_sapling,legacy_data=15]',
            'minecraft:flower_pot[contents=blue_orchid,legacy_data=15]',
            'minecraft:flower_pot[contents=cactus,legacy_data=15]',
            'minecraft:flower_pot[contents=dandelion,legacy_data=15]',
            'minecraft:flower_pot[contents=dark_oak_sapling,legacy_data=15]',
            'minecraft:flower_pot[contents=dead_bush,legacy_data=15]',
            'minecraft:flower_pot[contents=empty,legacy_data=15]',
            'minecraft:flower_pot[contents=fern,legacy_data=15]',
            'minecraft:flower_pot[contents=houstonia,legacy_data=15]',
            'minecraft:flower_pot[contents=jungle_sapling,legacy_data=15]',
            'minecraft:flower_pot[contents=mushroom_brown,legacy_data=15]',
            'minecraft:flower_pot[contents=mushroom_red,legacy_data=15]',
            'minecraft:flower_pot[contents=oak_sapling,legacy_data=15]',
            'minecraft:flower_pot[contents=orange_tulip,legacy_data=15]',
            'minecraft:flower_pot[contents=oxeye_daisy,legacy_data=15]',
            'minecraft:flower_pot[contents=pink_tulip,legacy_data=15]',
            'minecraft:flower_pot[contents=red_tulip,legacy_data=15]',
            'minecraft:flower_pot[contents=rose,legacy_data=15]',
            'minecraft:flower_pot[contents=spruce_sapling,legacy_data=15]',
            'minecraft:flower_pot[contents=white_tulip,legacy_data=15]'
        ],
        ['minecraft:carrots[age=0]', 'minecraft:carrots[age=0]'],
        ['minecraft:carrots[age=1]', 'minecraft:carrots[age=1]'],
        ['minecraft:carrots[age=2]', 'minecraft:carrots[age=2]'],
        ['minecraft:carrots[age=3]', 'minecraft:carrots[age=3]'],
        ['minecraft:carrots[age=4]', 'minecraft:carrots[age=4]'],
        ['minecraft:carrots[age=5]', 'minecraft:carrots[age=5]'],
        ['minecraft:carrots[age=6]', 'minecraft:carrots[age=6]'],
        ['minecraft:carrots[age=7]', 'minecraft:carrots[age=7]'],
        ['minecraft:potatoes[age=0]', 'minecraft:potatoes[age=0]'],
        ['minecraft:potatoes[age=1]', 'minecraft:potatoes[age=1]'],
        ['minecraft:potatoes[age=2]', 'minecraft:potatoes[age=2]'],
        ['minecraft:potatoes[age=3]', 'minecraft:potatoes[age=3]'],
        ['minecraft:potatoes[age=4]', 'minecraft:potatoes[age=4]'],
        ['minecraft:potatoes[age=5]', 'minecraft:potatoes[age=5]'],
        ['minecraft:potatoes[age=6]', 'minecraft:potatoes[age=6]'],
        ['minecraft:potatoes[age=7]', 'minecraft:potatoes[age=7]'],
        [
            'minecraft:oak_button[face=ceiling,facing=north,powered=false]',
            'minecraft:wooden_button[facing=down,powered=false]'
        ],
        [
            'minecraft:oak_button[face=wall,facing=east,powered=false]',
            'minecraft:wooden_button[facing=east,powered=false]'
        ],
        [
            'minecraft:oak_button[face=wall,facing=west,powered=false]',
            'minecraft:wooden_button[facing=west,powered=false]'
        ],
        [
            'minecraft:oak_button[face=wall,facing=south,powered=false]',
            'minecraft:wooden_button[facing=south,powered=false]'
        ],
        [
            'minecraft:oak_button[face=wall,facing=north,powered=false]',
            'minecraft:wooden_button[facing=north,powered=false]'
        ],
        [
            'minecraft:oak_button[face=floor,facing=north,powered=false]',
            'minecraft:wooden_button[facing=up,powered=false]'
        ],
        [
            'minecraft:oak_button[face=ceiling,facing=north,powered=true]',
            'minecraft:wooden_button[facing=down,powered=true]'
        ],
        [
            'minecraft:oak_button[face=wall,facing=east,powered=true]',
            'minecraft:wooden_button[facing=east,powered=true]'
        ],
        [
            'minecraft:oak_button[face=wall,facing=west,powered=true]',
            'minecraft:wooden_button[facing=west,powered=true]'
        ],
        [
            'minecraft:oak_button[face=wall,facing=south,powered=true]',
            'minecraft:wooden_button[facing=south,powered=true]'
        ],
        [
            'minecraft:oak_button[face=wall,facing=north,powered=true]',
            'minecraft:wooden_button[facing=north,powered=true]'
        ],
        [
            'minecraft:oak_button[face=floor,facing=north,powered=true]',
            'minecraft:wooden_button[facing=up,powered=true]'
        ],
        ['minecraft:skeleton_skull[facing=down,nodrop=false]', 'minecraft:skull[facing=down,nodrop=false]'],
        ['minecraft:skeleton_skull[facing=up,nodrop=false]', 'minecraft:skull[facing=up,nodrop=false]'],
        ['minecraft:skeleton_skull[facing=north,nodrop=false]', 'minecraft:skull[facing=north,nodrop=false]'],
        ['minecraft:skeleton_skull[facing=south,nodrop=false]', 'minecraft:skull[facing=south,nodrop=false]'],
        ['minecraft:skeleton_skull[facing=west,nodrop=false]', 'minecraft:skull[facing=west,nodrop=false]'],
        ['minecraft:skeleton_skull[facing=east,nodrop=false]', 'minecraft:skull[facing=east,nodrop=false]'],
        ['minecraft:skeleton_skull[facing=down,nodrop=true]', 'minecraft:skull[facing=down,nodrop=true]'],
        ['minecraft:skeleton_skull[facing=up,nodrop=true]', 'minecraft:skull[facing=up,nodrop=true]'],
        ['minecraft:skeleton_skull[facing=north,nodrop=true]', 'minecraft:skull[facing=north,nodrop=true]'],
        ['minecraft:skeleton_skull[facing=south,nodrop=true]', 'minecraft:skull[facing=south,nodrop=true]'],
        ['minecraft:skeleton_skull[facing=west,nodrop=true]', 'minecraft:skull[facing=west,nodrop=true]'],
        ['minecraft:skeleton_skull[facing=east,nodrop=true]', 'minecraft:skull[facing=east,nodrop=true]'],
        ['minecraft:anvil[facing=south]', 'minecraft:anvil[damage=0,facing=south]'],
        ['minecraft:anvil[facing=west]', 'minecraft:anvil[damage=0,facing=west]'],
        ['minecraft:anvil[facing=north]', 'minecraft:anvil[damage=0,facing=north]'],
        ['minecraft:anvil[facing=east]', 'minecraft:anvil[damage=0,facing=east]'],
        ['minecraft:chipped_anvil[facing=south]', 'minecraft:anvil[damage=1,facing=south]'],
        ['minecraft:chipped_anvil[facing=west]', 'minecraft:anvil[damage=1,facing=west]'],
        ['minecraft:chipped_anvil[facing=north]', 'minecraft:anvil[damage=1,facing=north]'],
        ['minecraft:chipped_anvil[facing=east]', 'minecraft:anvil[damage=1,facing=east]'],
        ['minecraft:damaged_anvil[facing=south]', 'minecraft:anvil[damage=2,facing=south]'],
        ['minecraft:damaged_anvil[facing=west]', 'minecraft:anvil[damage=2,facing=west]'],
        ['minecraft:damaged_anvil[facing=north]', 'minecraft:anvil[damage=2,facing=north]'],
        ['minecraft:damaged_anvil[facing=east]', 'minecraft:anvil[damage=2,facing=east]'],
        ['minecraft:trapped_chest[facing=north,type=single]', 'minecraft:trapped_chest[facing=north]'],
        ['minecraft:trapped_chest[facing=south,type=single]', 'minecraft:trapped_chest[facing=south]'],
        ['minecraft:trapped_chest[facing=west,type=single]', 'minecraft:trapped_chest[facing=west]'],
        ['minecraft:trapped_chest[facing=east,type=single]', 'minecraft:trapped_chest[facing=east]'],
        ['minecraft:light_weighted_pressure_plate[power=0]', 'minecraft:light_weighted_pressure_plate[power=0]'],
        ['minecraft:light_weighted_pressure_plate[power=1]', 'minecraft:light_weighted_pressure_plate[power=1]'],
        ['minecraft:light_weighted_pressure_plate[power=2]', 'minecraft:light_weighted_pressure_plate[power=2]'],
        ['minecraft:light_weighted_pressure_plate[power=3]', 'minecraft:light_weighted_pressure_plate[power=3]'],
        ['minecraft:light_weighted_pressure_plate[power=4]', 'minecraft:light_weighted_pressure_plate[power=4]'],
        ['minecraft:light_weighted_pressure_plate[power=5]', 'minecraft:light_weighted_pressure_plate[power=5]'],
        ['minecraft:light_weighted_pressure_plate[power=6]', 'minecraft:light_weighted_pressure_plate[power=6]'],
        ['minecraft:light_weighted_pressure_plate[power=7]', 'minecraft:light_weighted_pressure_plate[power=7]'],
        ['minecraft:light_weighted_pressure_plate[power=8]', 'minecraft:light_weighted_pressure_plate[power=8]'],
        ['minecraft:light_weighted_pressure_plate[power=9]', 'minecraft:light_weighted_pressure_plate[power=9]'],
        ['minecraft:light_weighted_pressure_plate[power=10]', 'minecraft:light_weighted_pressure_plate[power=10]'],
        ['minecraft:light_weighted_pressure_plate[power=11]', 'minecraft:light_weighted_pressure_plate[power=11]'],
        ['minecraft:light_weighted_pressure_plate[power=12]', 'minecraft:light_weighted_pressure_plate[power=12]'],
        ['minecraft:light_weighted_pressure_plate[power=13]', 'minecraft:light_weighted_pressure_plate[power=13]'],
        ['minecraft:light_weighted_pressure_plate[power=14]', 'minecraft:light_weighted_pressure_plate[power=14]'],
        ['minecraft:light_weighted_pressure_plate[power=15]', 'minecraft:light_weighted_pressure_plate[power=15]'],
        ['minecraft:heavy_weighted_pressure_plate[power=0]', 'minecraft:heavy_weighted_pressure_plate[power=0]'],
        ['minecraft:heavy_weighted_pressure_plate[power=1]', 'minecraft:heavy_weighted_pressure_plate[power=1]'],
        ['minecraft:heavy_weighted_pressure_plate[power=2]', 'minecraft:heavy_weighted_pressure_plate[power=2]'],
        ['minecraft:heavy_weighted_pressure_plate[power=3]', 'minecraft:heavy_weighted_pressure_plate[power=3]'],
        ['minecraft:heavy_weighted_pressure_plate[power=4]', 'minecraft:heavy_weighted_pressure_plate[power=4]'],
        ['minecraft:heavy_weighted_pressure_plate[power=5]', 'minecraft:heavy_weighted_pressure_plate[power=5]'],
        ['minecraft:heavy_weighted_pressure_plate[power=6]', 'minecraft:heavy_weighted_pressure_plate[power=6]'],
        ['minecraft:heavy_weighted_pressure_plate[power=7]', 'minecraft:heavy_weighted_pressure_plate[power=7]'],
        ['minecraft:heavy_weighted_pressure_plate[power=8]', 'minecraft:heavy_weighted_pressure_plate[power=8]'],
        ['minecraft:heavy_weighted_pressure_plate[power=9]', 'minecraft:heavy_weighted_pressure_plate[power=9]'],
        ['minecraft:heavy_weighted_pressure_plate[power=10]', 'minecraft:heavy_weighted_pressure_plate[power=10]'],
        ['minecraft:heavy_weighted_pressure_plate[power=11]', 'minecraft:heavy_weighted_pressure_plate[power=11]'],
        ['minecraft:heavy_weighted_pressure_plate[power=12]', 'minecraft:heavy_weighted_pressure_plate[power=12]'],
        ['minecraft:heavy_weighted_pressure_plate[power=13]', 'minecraft:heavy_weighted_pressure_plate[power=13]'],
        ['minecraft:heavy_weighted_pressure_plate[power=14]', 'minecraft:heavy_weighted_pressure_plate[power=14]'],
        ['minecraft:heavy_weighted_pressure_plate[power=15]', 'minecraft:heavy_weighted_pressure_plate[power=15]'],
        [
            'minecraft:comparator[facing=south,mode=compare,powered=false]',
            'minecraft:unpowered_comparator[facing=south,mode=compare,powered=false]'
        ],
        [
            'minecraft:comparator[facing=west,mode=compare,powered=false]',
            'minecraft:unpowered_comparator[facing=west,mode=compare,powered=false]'
        ],
        [
            'minecraft:comparator[facing=north,mode=compare,powered=false]',
            'minecraft:unpowered_comparator[facing=north,mode=compare,powered=false]'
        ],
        [
            'minecraft:comparator[facing=east,mode=compare,powered=false]',
            'minecraft:unpowered_comparator[facing=east,mode=compare,powered=false]'
        ],
        [
            'minecraft:comparator[facing=south,mode=subtract,powered=false]',
            'minecraft:unpowered_comparator[facing=south,mode=subtract,powered=false]'
        ],
        [
            'minecraft:comparator[facing=west,mode=subtract,powered=false]',
            'minecraft:unpowered_comparator[facing=west,mode=subtract,powered=false]'
        ],
        [
            'minecraft:comparator[facing=north,mode=subtract,powered=false]',
            'minecraft:unpowered_comparator[facing=north,mode=subtract,powered=false]'
        ],
        [
            'minecraft:comparator[facing=east,mode=subtract,powered=false]',
            'minecraft:unpowered_comparator[facing=east,mode=subtract,powered=false]'
        ],
        [
            'minecraft:comparator[facing=south,mode=compare,powered=true]',
            'minecraft:unpowered_comparator[facing=south,mode=compare,powered=true]'
        ],
        [
            'minecraft:comparator[facing=west,mode=compare,powered=true]',
            'minecraft:unpowered_comparator[facing=west,mode=compare,powered=true]'
        ],
        [
            'minecraft:comparator[facing=north,mode=compare,powered=true]',
            'minecraft:unpowered_comparator[facing=north,mode=compare,powered=true]'
        ],
        [
            'minecraft:comparator[facing=east,mode=compare,powered=true]',
            'minecraft:unpowered_comparator[facing=east,mode=compare,powered=true]'
        ],
        [
            'minecraft:comparator[facing=south,mode=subtract,powered=true]',
            'minecraft:unpowered_comparator[facing=south,mode=subtract,powered=true]'
        ],
        [
            'minecraft:comparator[facing=west,mode=subtract,powered=true]',
            'minecraft:unpowered_comparator[facing=west,mode=subtract,powered=true]'
        ],
        [
            'minecraft:comparator[facing=north,mode=subtract,powered=true]',
            'minecraft:unpowered_comparator[facing=north,mode=subtract,powered=true]'
        ],
        [
            'minecraft:comparator[facing=east,mode=subtract,powered=true]',
            'minecraft:unpowered_comparator[facing=east,mode=subtract,powered=true]'
        ],
        [
            'minecraft:comparator[facing=south,mode=compare,powered=false]',
            'minecraft:powered_comparator[facing=south,mode=compare,powered=false]'
        ],
        [
            'minecraft:comparator[facing=west,mode=compare,powered=false]',
            'minecraft:powered_comparator[facing=west,mode=compare,powered=false]'
        ],
        [
            'minecraft:comparator[facing=north,mode=compare,powered=false]',
            'minecraft:powered_comparator[facing=north,mode=compare,powered=false]'
        ],
        [
            'minecraft:comparator[facing=east,mode=compare,powered=false]',
            'minecraft:powered_comparator[facing=east,mode=compare,powered=false]'
        ],
        [
            'minecraft:comparator[facing=south,mode=subtract,powered=false]',
            'minecraft:powered_comparator[facing=south,mode=subtract,powered=false]'
        ],
        [
            'minecraft:comparator[facing=west,mode=subtract,powered=false]',
            'minecraft:powered_comparator[facing=west,mode=subtract,powered=false]'
        ],
        [
            'minecraft:comparator[facing=north,mode=subtract,powered=false]',
            'minecraft:powered_comparator[facing=north,mode=subtract,powered=false]'
        ],
        [
            'minecraft:comparator[facing=east,mode=subtract,powered=false]',
            'minecraft:powered_comparator[facing=east,mode=subtract,powered=false]'
        ],
        [
            'minecraft:comparator[facing=south,mode=compare,powered=true]',
            'minecraft:powered_comparator[facing=south,mode=compare,powered=true]'
        ],
        [
            'minecraft:comparator[facing=west,mode=compare,powered=true]',
            'minecraft:powered_comparator[facing=west,mode=compare,powered=true]'
        ],
        [
            'minecraft:comparator[facing=north,mode=compare,powered=true]',
            'minecraft:powered_comparator[facing=north,mode=compare,powered=true]'
        ],
        [
            'minecraft:comparator[facing=east,mode=compare,powered=true]',
            'minecraft:powered_comparator[facing=east,mode=compare,powered=true]'
        ],
        [
            'minecraft:comparator[facing=south,mode=subtract,powered=true]',
            'minecraft:powered_comparator[facing=south,mode=subtract,powered=true]'
        ],
        [
            'minecraft:comparator[facing=west,mode=subtract,powered=true]',
            'minecraft:powered_comparator[facing=west,mode=subtract,powered=true]'
        ],
        [
            'minecraft:comparator[facing=north,mode=subtract,powered=true]',
            'minecraft:powered_comparator[facing=north,mode=subtract,powered=true]'
        ],
        [
            'minecraft:comparator[facing=east,mode=subtract,powered=true]',
            'minecraft:powered_comparator[facing=east,mode=subtract,powered=true]'
        ],
        ['minecraft:daylight_detector[inverted=false,power=0]', 'minecraft:daylight_detector[power=0]'],
        ['minecraft:daylight_detector[inverted=false,power=1]', 'minecraft:daylight_detector[power=1]'],
        ['minecraft:daylight_detector[inverted=false,power=2]', 'minecraft:daylight_detector[power=2]'],
        ['minecraft:daylight_detector[inverted=false,power=3]', 'minecraft:daylight_detector[power=3]'],
        ['minecraft:daylight_detector[inverted=false,power=4]', 'minecraft:daylight_detector[power=4]'],
        ['minecraft:daylight_detector[inverted=false,power=5]', 'minecraft:daylight_detector[power=5]'],
        ['minecraft:daylight_detector[inverted=false,power=6]', 'minecraft:daylight_detector[power=6]'],
        ['minecraft:daylight_detector[inverted=false,power=7]', 'minecraft:daylight_detector[power=7]'],
        ['minecraft:daylight_detector[inverted=false,power=8]', 'minecraft:daylight_detector[power=8]'],
        ['minecraft:daylight_detector[inverted=false,power=9]', 'minecraft:daylight_detector[power=9]'],
        ['minecraft:daylight_detector[inverted=false,power=10]', 'minecraft:daylight_detector[power=10]'],
        ['minecraft:daylight_detector[inverted=false,power=11]', 'minecraft:daylight_detector[power=11]'],
        ['minecraft:daylight_detector[inverted=false,power=12]', 'minecraft:daylight_detector[power=12]'],
        ['minecraft:daylight_detector[inverted=false,power=13]', 'minecraft:daylight_detector[power=13]'],
        ['minecraft:daylight_detector[inverted=false,power=14]', 'minecraft:daylight_detector[power=14]'],
        ['minecraft:daylight_detector[inverted=false,power=15]', 'minecraft:daylight_detector[power=15]'],
        ['minecraft:redstone_block', 'minecraft:redstone_block'],
        ['minecraft:nether_quartz_ore', 'minecraft:quartz_ore'],
        ['minecraft:hopper[enabled=true,facing=down]', 'minecraft:hopper[enabled=true,facing=down]'],
        ['minecraft:hopper[enabled=true,facing=north]', 'minecraft:hopper[enabled=true,facing=north]'],
        ['minecraft:hopper[enabled=true,facing=south]', 'minecraft:hopper[enabled=true,facing=south]'],
        ['minecraft:hopper[enabled=true,facing=west]', 'minecraft:hopper[enabled=true,facing=west]'],
        ['minecraft:hopper[enabled=true,facing=east]', 'minecraft:hopper[enabled=true,facing=east]'],
        ['minecraft:hopper[enabled=false,facing=down]', 'minecraft:hopper[enabled=false,facing=down]'],
        ['minecraft:hopper[enabled=false,facing=north]', 'minecraft:hopper[enabled=false,facing=north]'],
        ['minecraft:hopper[enabled=false,facing=south]', 'minecraft:hopper[enabled=false,facing=south]'],
        ['minecraft:hopper[enabled=false,facing=west]', 'minecraft:hopper[enabled=false,facing=west]'],
        ['minecraft:hopper[enabled=false,facing=east]', 'minecraft:hopper[enabled=false,facing=east]'],
        ['minecraft:quartz_block', 'minecraft:quartz_block[variant=default]'],
        ['minecraft:chiseled_quartz_block', 'minecraft:quartz_block[variant=chiseled]'],
        ['minecraft:quartz_pillar[axis=y]', 'minecraft:quartz_block[variant=lines_y]'],
        ['minecraft:quartz_pillar[axis=x]', 'minecraft:quartz_block[variant=lines_x]'],
        ['minecraft:quartz_pillar[axis=z]', 'minecraft:quartz_block[variant=lines_z]'],
        [
            'minecraft:quartz_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:quartz_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:quartz_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:quartz_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:quartz_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:quartz_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:quartz_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:quartz_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:quartz_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:quartz_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:quartz_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:quartz_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:quartz_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:quartz_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:quartz_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:quartz_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:quartz_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:quartz_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:quartz_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:quartz_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:quartz_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:quartz_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:quartz_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:quartz_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:quartz_stairs[facing=east,half=top,shape=straight]',
            'minecraft:quartz_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:quartz_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:quartz_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:quartz_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:quartz_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:quartz_stairs[facing=west,half=top,shape=straight]',
            'minecraft:quartz_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:quartz_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:quartz_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:quartz_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:quartz_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:quartz_stairs[facing=south,half=top,shape=straight]',
            'minecraft:quartz_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:quartz_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:quartz_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:quartz_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:quartz_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:quartz_stairs[facing=north,half=top,shape=straight]',
            'minecraft:quartz_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:quartz_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:quartz_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:quartz_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:quartz_stairs[facing=north,half=top,shape=straight]'
        ],
        [
            'minecraft:activator_rail[powered=false,shape=north_south]',
            'minecraft:activator_rail[powered=false,shape=north_south]'
        ],
        [
            'minecraft:activator_rail[powered=false,shape=east_west]',
            'minecraft:activator_rail[powered=false,shape=east_west]'
        ],
        [
            'minecraft:activator_rail[powered=false,shape=ascending_east]',
            'minecraft:activator_rail[powered=false,shape=ascending_east]'
        ],
        [
            'minecraft:activator_rail[powered=false,shape=ascending_west]',
            'minecraft:activator_rail[powered=false,shape=ascending_west]'
        ],
        [
            'minecraft:activator_rail[powered=false,shape=ascending_north]',
            'minecraft:activator_rail[powered=false,shape=ascending_north]'
        ],
        [
            'minecraft:activator_rail[powered=false,shape=ascending_south]',
            'minecraft:activator_rail[powered=false,shape=ascending_south]'
        ],
        [
            'minecraft:activator_rail[powered=true,shape=north_south]',
            'minecraft:activator_rail[powered=true,shape=north_south]'
        ],
        [
            'minecraft:activator_rail[powered=true,shape=east_west]',
            'minecraft:activator_rail[powered=true,shape=east_west]'
        ],
        [
            'minecraft:activator_rail[powered=true,shape=ascending_east]',
            'minecraft:activator_rail[powered=true,shape=ascending_east]'
        ],
        [
            'minecraft:activator_rail[powered=true,shape=ascending_west]',
            'minecraft:activator_rail[powered=true,shape=ascending_west]'
        ],
        [
            'minecraft:activator_rail[powered=true,shape=ascending_north]',
            'minecraft:activator_rail[powered=true,shape=ascending_north]'
        ],
        [
            'minecraft:activator_rail[powered=true,shape=ascending_south]',
            'minecraft:activator_rail[powered=true,shape=ascending_south]'
        ],
        ['minecraft:dropper[facing=down,triggered=false]', 'minecraft:dropper[facing=down,triggered=false]'],
        ['minecraft:dropper[facing=up,triggered=false]', 'minecraft:dropper[facing=up,triggered=false]'],
        ['minecraft:dropper[facing=north,triggered=false]', 'minecraft:dropper[facing=north,triggered=false]'],
        ['minecraft:dropper[facing=south,triggered=false]', 'minecraft:dropper[facing=south,triggered=false]'],
        ['minecraft:dropper[facing=west,triggered=false]', 'minecraft:dropper[facing=west,triggered=false]'],
        ['minecraft:dropper[facing=east,triggered=false]', 'minecraft:dropper[facing=east,triggered=false]'],
        ['minecraft:dropper[facing=down,triggered=true]', 'minecraft:dropper[facing=down,triggered=true]'],
        ['minecraft:dropper[facing=up,triggered=true]', 'minecraft:dropper[facing=up,triggered=true]'],
        ['minecraft:dropper[facing=north,triggered=true]', 'minecraft:dropper[facing=north,triggered=true]'],
        ['minecraft:dropper[facing=south,triggered=true]', 'minecraft:dropper[facing=south,triggered=true]'],
        ['minecraft:dropper[facing=west,triggered=true]', 'minecraft:dropper[facing=west,triggered=true]'],
        ['minecraft:dropper[facing=east,triggered=true]', 'minecraft:dropper[facing=east,triggered=true]'],
        ['minecraft:white_terracotta', 'minecraft:stained_hardened_clay[color=white]'],
        ['minecraft:orange_terracotta', 'minecraft:stained_hardened_clay[color=orange]'],
        ['minecraft:magenta_terracotta', 'minecraft:stained_hardened_clay[color=magenta]'],
        ['minecraft:light_blue_terracotta', 'minecraft:stained_hardened_clay[color=light_blue]'],
        ['minecraft:yellow_terracotta', 'minecraft:stained_hardened_clay[color=yellow]'],
        ['minecraft:lime_terracotta', 'minecraft:stained_hardened_clay[color=lime]'],
        ['minecraft:pink_terracotta', 'minecraft:stained_hardened_clay[color=pink]'],
        ['minecraft:gray_terracotta', 'minecraft:stained_hardened_clay[color=gray]'],
        ['minecraft:light_gray_terracotta', 'minecraft:stained_hardened_clay[color=silver]'],
        ['minecraft:cyan_terracotta', 'minecraft:stained_hardened_clay[color=cyan]'],
        ['minecraft:purple_terracotta', 'minecraft:stained_hardened_clay[color=purple]'],
        ['minecraft:blue_terracotta', 'minecraft:stained_hardened_clay[color=blue]'],
        ['minecraft:brown_terracotta', 'minecraft:stained_hardened_clay[color=brown]'],
        ['minecraft:green_terracotta', 'minecraft:stained_hardened_clay[color=green]'],
        ['minecraft:red_terracotta', 'minecraft:stained_hardened_clay[color=red]'],
        ['minecraft:black_terracotta', 'minecraft:stained_hardened_clay[color=black]'],
        [
            'minecraft:white_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=white,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=white,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=white,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=white,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=white,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=white,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=white,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=white,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=white,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=white,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=white,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=white,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=white,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=white,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=white,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=white,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:orange_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=orange,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=orange,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=orange,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=orange,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=orange,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=orange,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=orange,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=orange,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=orange,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=orange,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=orange,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=orange,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=orange,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=orange,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=orange,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=orange,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:magenta_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=magenta,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=magenta,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=magenta,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=magenta,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=magenta,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=magenta,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=magenta,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=magenta,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=magenta,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=magenta,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=magenta,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=magenta,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=magenta,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=magenta,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=magenta,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=magenta,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:light_blue_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=light_blue,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=light_blue,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=light_blue,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=light_blue,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=light_blue,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=light_blue,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=light_blue,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=light_blue,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=light_blue,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=light_blue,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=light_blue,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=light_blue,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=light_blue,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=light_blue,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=light_blue,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=light_blue,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:yellow_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=yellow,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=yellow,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=yellow,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=yellow,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=yellow,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=yellow,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=yellow,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=yellow,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=yellow,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=yellow,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=yellow,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=yellow,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=yellow,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=yellow,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=yellow,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=yellow,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:lime_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=lime,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=lime,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=lime,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=lime,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=lime,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=lime,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=lime,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=lime,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=lime,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=lime,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=lime,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=lime,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=lime,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=lime,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=lime,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=lime,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:pink_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=pink,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=pink,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=pink,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=pink,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=pink,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=pink,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=pink,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=pink,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=pink,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=pink,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=pink,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=pink,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=pink,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=pink,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=pink,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=pink,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:gray_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=gray,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=gray,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=gray,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=gray,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=gray,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=gray,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=gray,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=gray,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=gray,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=gray,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=gray,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=gray,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=gray,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=gray,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=gray,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=gray,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:light_gray_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=silver,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=silver,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=silver,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=silver,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=silver,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=silver,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=silver,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=silver,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=silver,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=silver,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=silver,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=silver,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=silver,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=silver,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=silver,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=silver,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:cyan_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=cyan,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=cyan,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=cyan,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=cyan,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=cyan,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=cyan,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=cyan,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=cyan,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=cyan,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=cyan,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=cyan,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=cyan,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=cyan,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=cyan,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=cyan,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=cyan,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:purple_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=purple,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=purple,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=purple,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=purple,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=purple,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=purple,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=purple,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=purple,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=purple,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=purple,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=purple,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=purple,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=purple,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=purple,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=purple,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=purple,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:blue_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=blue,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=blue,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=blue,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=blue,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=blue,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=blue,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=blue,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=blue,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=blue,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=blue,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=blue,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=blue,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=blue,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=blue,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=blue,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=blue,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:brown_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=brown,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=brown,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=brown,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=brown,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=brown,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=brown,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=brown,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=brown,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=brown,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=brown,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=brown,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=brown,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=brown,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=brown,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=brown,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=brown,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:green_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=green,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=green,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=green,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=green,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=green,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=green,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=green,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=green,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=green,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=green,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=green,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=green,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=green,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=green,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=green,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=green,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:red_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=red,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=red,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=red,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=red,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=red,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=red,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=red,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=red,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=red,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=red,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=red,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=red,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=red,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=red,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=red,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=red,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:black_stained_glass_pane[east=false,north=false,south:false,west=false]',
            'minecraft:stained_glass_pane[color=black,east=false,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=black,east=false,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=black,east=false,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=black,east=false,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=black,east=false,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=black,east=false,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=black,east=false,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=black,east=false,north:true,south=true,west=true]',
            'minecraft:stained_glass_pane[color=black,east=true,north:false,south=false,west=false]',
            'minecraft:stained_glass_pane[color=black,east=true,north:false,south=false,west=true]',
            'minecraft:stained_glass_pane[color=black,east=true,north:false,south=true,west=false]',
            'minecraft:stained_glass_pane[color=black,east=true,north:false,south=true,west=true]',
            'minecraft:stained_glass_pane[color=black,east=true,north:true,south=false,west=false]',
            'minecraft:stained_glass_pane[color=black,east=true,north:true,south=false,west=true]',
            'minecraft:stained_glass_pane[color=black,east=true,north:true,south=true,west=false]',
            'minecraft:stained_glass_pane[color=black,east=true,north:true,south=true,west=true]'
        ],
        [
            'minecraft:acacia_leaves[check_decay=false,decayable=true]',
            '{Name:minecraft:leaves2,Properties:{check_decay:false,decayable=true,variant=acacia]'
        ],
        [
            'minecraft:dark_oak_leaves[check_decay=false,decayable=true]',
            '{Name:minecraft:leaves2,Properties:{check_decay:false,decayable=true,variant=dark_oak]'
        ],
        [
            'minecraft:acacia_leaves[check_decay=false,decayable=false]',
            '{Name:minecraft:leaves2,Properties:{check_decay:false,decayable=false,variant=acacia]'
        ],
        [
            'minecraft:dark_oak_leaves[check_decay=false,decayable=false]',
            '{Name:minecraft:leaves2,Properties:{check_decay:false,decayable=false,variant=dark_oak]'
        ],
        [
            'minecraft:acacia_leaves[check_decay=true,decayable=true]',
            '{Name:minecraft:leaves2,Properties:{check_decay:true,decayable=true,variant=acacia]'
        ],
        [
            'minecraft:dark_oak_leaves[check_decay=true,decayable=true]',
            '{Name:minecraft:leaves2,Properties:{check_decay:true,decayable=true,variant=dark_oak]'
        ],
        [
            'minecraft:acacia_leaves[check_decay=true,decayable=false]',
            '{Name:minecraft:leaves2,Properties:{check_decay:true,decayable=false,variant=acacia]'
        ],
        [
            'minecraft:dark_oak_leaves[check_decay=true,decayable=false]',
            '{Name:minecraft:leaves2,Properties:{check_decay:true,decayable=false,variant=dark_oak]'
        ],
        ['minecraft:acacia_log[axis=y]', '{Name:minecraft:log2,Properties:{axis:y,variant=acacia]'],
        ['minecraft:dark_oak_log[axis=y]', '{Name:minecraft:log2,Properties:{axis:y,variant=dark_oak]'],
        ['minecraft:acacia_log[axis=x]', '{Name:minecraft:log2,Properties:{axis:x,variant=acacia]'],
        ['minecraft:dark_oak_log[axis=x]', '{Name:minecraft:log2,Properties:{axis:x,variant=dark_oak]'],
        ['minecraft:acacia_log[axis=z]', '{Name:minecraft:log2,Properties:{axis:z,variant=acacia]'],
        ['minecraft:dark_oak_log[axis=z]', '{Name:minecraft:log2,Properties:{axis:z,variant=dark_oak]'],
        ['minecraft:acacia_wood', '{Name:minecraft:log2,Properties:{axis:none,variant=acacia]'],
        ['minecraft:dark_oak_wood', '{Name:minecraft:log2,Properties:{axis:none,variant=dark_oak]'],
        [
            'minecraft:acacia_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:acacia_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:acacia_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:acacia_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:acacia_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:acacia_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:acacia_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:acacia_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:acacia_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:acacia_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:acacia_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:acacia_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:acacia_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:acacia_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:acacia_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:acacia_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:acacia_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:acacia_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:acacia_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:acacia_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:acacia_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:acacia_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:acacia_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:acacia_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:acacia_stairs[facing=east,half=top,shape=straight]',
            'minecraft:acacia_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:acacia_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:acacia_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:acacia_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:acacia_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:acacia_stairs[facing=west,half=top,shape=straight]',
            'minecraft:acacia_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:acacia_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:acacia_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:acacia_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:acacia_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:acacia_stairs[facing=south,half=top,shape=straight]',
            'minecraft:acacia_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:acacia_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:acacia_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:acacia_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:acacia_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:acacia_stairs[facing=north,half=top,shape=straight]',
            'minecraft:acacia_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:acacia_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:acacia_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:acacia_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:acacia_stairs[facing=north,half=top,shape=straight]'
        ],
        [
            'minecraft:dark_oak_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:dark_oak_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:dark_oak_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:dark_oak_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:dark_oak_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:dark_oak_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:dark_oak_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:dark_oak_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:dark_oak_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:dark_oak_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:dark_oak_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:dark_oak_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:dark_oak_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:dark_oak_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:dark_oak_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:dark_oak_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:dark_oak_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:dark_oak_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:dark_oak_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:dark_oak_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:dark_oak_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:dark_oak_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:dark_oak_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:dark_oak_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:dark_oak_stairs[facing=east,half=top,shape=straight]',
            'minecraft:dark_oak_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:dark_oak_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:dark_oak_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:dark_oak_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:dark_oak_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:dark_oak_stairs[facing=west,half=top,shape=straight]',
            'minecraft:dark_oak_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:dark_oak_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:dark_oak_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:dark_oak_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:dark_oak_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:dark_oak_stairs[facing=south,half=top,shape=straight]',
            'minecraft:dark_oak_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:dark_oak_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:dark_oak_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:dark_oak_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:dark_oak_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:dark_oak_stairs[facing=north,half=top,shape=straight]',
            'minecraft:dark_oak_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:dark_oak_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:dark_oak_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:dark_oak_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:dark_oak_stairs[facing=north,half=top,shape=straight]'
        ],
        ['minecraft:slime_block', 'minecraft:slime'],
        ['minecraft:barrier', 'minecraft:barrier'],
        [
            'minecraft:iron_trapdoor[facing=north,half=bottom,open=false]',
            'minecraft:iron_trapdoor[facing=north,half=bottom,open=false]'
        ],
        [
            'minecraft:iron_trapdoor[facing=south,half=bottom,open=false]',
            'minecraft:iron_trapdoor[facing=south,half=bottom,open=false]'
        ],
        [
            'minecraft:iron_trapdoor[facing=west,half=bottom,open=false]',
            'minecraft:iron_trapdoor[facing=west,half=bottom,open=false]'
        ],
        [
            'minecraft:iron_trapdoor[facing=east,half=bottom,open=false]',
            'minecraft:iron_trapdoor[facing=east,half=bottom,open=false]'
        ],
        [
            'minecraft:iron_trapdoor[facing=north,half=bottom,open=true]',
            'minecraft:iron_trapdoor[facing=north,half=bottom,open=true]'
        ],
        [
            'minecraft:iron_trapdoor[facing=south,half=bottom,open=true]',
            'minecraft:iron_trapdoor[facing=south,half=bottom,open=true]'
        ],
        [
            'minecraft:iron_trapdoor[facing=west,half=bottom,open=true]',
            'minecraft:iron_trapdoor[facing=west,half=bottom,open=true]'
        ],
        [
            'minecraft:iron_trapdoor[facing=east,half=bottom,open=true]',
            'minecraft:iron_trapdoor[facing=east,half=bottom,open=true]'
        ],
        [
            'minecraft:iron_trapdoor[facing=north,half=top,open=false]',
            'minecraft:iron_trapdoor[facing=north,half=top,open=false]'
        ],
        [
            'minecraft:iron_trapdoor[facing=south,half=top,open=false]',
            'minecraft:iron_trapdoor[facing=south,half=top,open=false]'
        ],
        [
            'minecraft:iron_trapdoor[facing=west,half=top,open=false]',
            'minecraft:iron_trapdoor[facing=west,half=top,open=false]'
        ],
        [
            'minecraft:iron_trapdoor[facing=east,half=top,open=false]',
            'minecraft:iron_trapdoor[facing=east,half=top,open=false]'
        ],
        [
            'minecraft:iron_trapdoor[facing=north,half=top,open=true]',
            'minecraft:iron_trapdoor[facing=north,half=top,open=true]'
        ],
        [
            'minecraft:iron_trapdoor[facing=south,half=top,open=true]',
            'minecraft:iron_trapdoor[facing=south,half=top,open=true]'
        ],
        [
            'minecraft:iron_trapdoor[facing=west,half=top,open=true]',
            'minecraft:iron_trapdoor[facing=west,half=top,open=true]'
        ],
        [
            'minecraft:iron_trapdoor[facing=east,half=top,open=true]',
            'minecraft:iron_trapdoor[facing=east,half=top,open=true]'
        ],
        ['minecraft:prismarine', 'minecraft:prismarine[variant=prismarine]'],
        ['minecraft:prismarine_bricks', 'minecraft:prismarine[variant=prismarine_bricks]'],
        ['minecraft:dark_prismarine', 'minecraft:prismarine[variant=dark_prismarine]'],
        ['minecraft:sea_lantern', 'minecraft:sea_lantern'],
        ['minecraft:hay_block[axis=y]', 'minecraft:hay_block[axis=y]'],
        ['minecraft:hay_block[axis=x]', 'minecraft:hay_block[axis=x]'],
        ['minecraft:hay_block[axis=z]', 'minecraft:hay_block[axis=z]'],
        ['minecraft:white_carpet', 'minecraft:carpet[color=white]'],
        ['minecraft:orange_carpet', 'minecraft:carpet[color=orange]'],
        ['minecraft:magenta_carpet', 'minecraft:carpet[color=magenta]'],
        ['minecraft:light_blue_carpet', 'minecraft:carpet[color=light_blue]'],
        ['minecraft:yellow_carpet', 'minecraft:carpet[color=yellow]'],
        ['minecraft:lime_carpet', 'minecraft:carpet[color=lime]'],
        ['minecraft:pink_carpet', 'minecraft:carpet[color=pink]'],
        ['minecraft:gray_carpet', 'minecraft:carpet[color=gray]'],
        ['minecraft:light_gray_carpet', 'minecraft:carpet[color=silver]'],
        ['minecraft:cyan_carpet', 'minecraft:carpet[color=cyan]'],
        ['minecraft:purple_carpet', 'minecraft:carpet[color=purple]'],
        ['minecraft:blue_carpet', 'minecraft:carpet[color=blue]'],
        ['minecraft:brown_carpet', 'minecraft:carpet[color=brown]'],
        ['minecraft:green_carpet', 'minecraft:carpet[color=green]'],
        ['minecraft:red_carpet', 'minecraft:carpet[color=red]'],
        ['minecraft:black_carpet', 'minecraft:carpet[color=black]'],
        ['minecraft:terracotta', 'minecraft:hardened_clay'],
        ['minecraft:coal_block', 'minecraft:coal_block'],
        ['minecraft:packed_ice', 'minecraft:packed_ice'],
        [
            'minecraft:sunflower[half=lower]',
            'minecraft:double_plant[facing=east,half=lower,variant=sunflower]',
            'minecraft:double_plant[facing=north,half=lower,variant=sunflower]',
            'minecraft:double_plant[facing=south,half=lower,variant=sunflower]',
            'minecraft:double_plant[facing=west,half=lower,variant=sunflower]'
        ],
        [
            'minecraft:lilac[half=lower]',
            'minecraft:double_plant[facing=east,half=lower,variant=syringa]',
            'minecraft:double_plant[facing=north,half=lower,variant=syringa]',
            'minecraft:double_plant[facing=south,half=lower,variant=syringa]',
            'minecraft:double_plant[facing=west,half=lower,variant=syringa]'
        ],
        [
            'minecraft:tall_grass[half=lower]',
            'minecraft:double_plant[facing=east,half=lower,variant=double_grass]',
            'minecraft:double_plant[facing=north,half=lower,variant=double_grass]',
            'minecraft:double_plant[facing=south,half=lower,variant=double_grass]',
            'minecraft:double_plant[facing=west,half=lower,variant=double_grass]'
        ],
        [
            'minecraft:large_fern[half=lower]',
            'minecraft:double_plant[facing=east,half=lower,variant=double_fern]',
            'minecraft:double_plant[facing=north,half=lower,variant=double_fern]',
            'minecraft:double_plant[facing=south,half=lower,variant=double_fern]',
            'minecraft:double_plant[facing=west,half=lower,variant=double_fern]'
        ],
        [
            'minecraft:rose_bush[half=lower]',
            'minecraft:double_plant[facing=east,half=lower,variant=double_rose]',
            'minecraft:double_plant[facing=north,half=lower,variant=double_rose]',
            'minecraft:double_plant[facing=south,half=lower,variant=double_rose]',
            'minecraft:double_plant[facing=west,half=lower,variant=double_rose]'
        ],
        [
            'minecraft:peony[half=lower]',
            'minecraft:double_plant[facing=east,half=lower,variant=paeonia]',
            'minecraft:double_plant[facing=north,half=lower,variant=paeonia]',
            'minecraft:double_plant[facing=south,half=lower,variant=paeonia]',
            'minecraft:double_plant[facing=west,half=lower,variant=paeonia]'
        ],
        [
            'minecraft:peony[half=upper]',
            'minecraft:double_plant[facing=south,half=upper,variant=double_fern]',
            'minecraft:double_plant[facing=south,half=upper,variant=double_grass]',
            'minecraft:double_plant[facing=south,half=upper,variant=double_rose]',
            'minecraft:double_plant[facing=south,half=upper,variant=paeonia]',
            'minecraft:double_plant[facing=south,half=upper,variant=sunflower]',
            'minecraft:double_plant[facing=south,half=upper,variant=syringa]'
        ],
        [
            'minecraft:peony[half=upper]',
            'minecraft:double_plant[facing=west,half=upper,variant=double_fern]',
            'minecraft:double_plant[facing=west,half=upper,variant=double_grass]',
            'minecraft:double_plant[facing=west,half=upper,variant=double_rose]',
            'minecraft:double_plant[facing=west,half=upper,variant=paeonia]',
            'minecraft:double_plant[facing=west,half=upper,variant=sunflower]',
            'minecraft:double_plant[facing=west,half=upper,variant=syringa]'
        ],
        [
            'minecraft:peony[half=upper]',
            'minecraft:double_plant[facing=north,half=upper,variant=double_fern]',
            'minecraft:double_plant[facing=north,half=upper,variant=double_grass]',
            'minecraft:double_plant[facing=north,half=upper,variant=double_rose]',
            'minecraft:double_plant[facing=north,half=upper,variant=paeonia]',
            'minecraft:double_plant[facing=north,half=upper,variant=sunflower]',
            'minecraft:double_plant[facing=north,half=upper,variant=syringa]'
        ],
        [
            'minecraft:peony[half=upper]',
            'minecraft:double_plant[facing=east,half=upper,variant=double_fern]',
            'minecraft:double_plant[facing=east,half=upper,variant=double_grass]',
            'minecraft:double_plant[facing=east,half=upper,variant=double_rose]',
            'minecraft:double_plant[facing=east,half=upper,variant=paeonia]',
            'minecraft:double_plant[facing=east,half=upper,variant=sunflower]',
            'minecraft:double_plant[facing=east,half=upper,variant=syringa]'
        ],
        ['minecraft:white_banner[rotation=0]', 'minecraft:standing_banner[rotation=0]'],
        ['minecraft:white_banner[rotation=1]', 'minecraft:standing_banner[rotation=1]'],
        ['minecraft:white_banner[rotation=2]', 'minecraft:standing_banner[rotation=2]'],
        ['minecraft:white_banner[rotation=3]', 'minecraft:standing_banner[rotation=3]'],
        ['minecraft:white_banner[rotation=4]', 'minecraft:standing_banner[rotation=4]'],
        ['minecraft:white_banner[rotation=5]', 'minecraft:standing_banner[rotation=5]'],
        ['minecraft:white_banner[rotation=6]', 'minecraft:standing_banner[rotation=6]'],
        ['minecraft:white_banner[rotation=7]', 'minecraft:standing_banner[rotation=7]'],
        ['minecraft:white_banner[rotation=8]', 'minecraft:standing_banner[rotation=8]'],
        ['minecraft:white_banner[rotation=9]', 'minecraft:standing_banner[rotation=9]'],
        ['minecraft:white_banner[rotation=10]', 'minecraft:standing_banner[rotation=10]'],
        ['minecraft:white_banner[rotation=11]', 'minecraft:standing_banner[rotation=11]'],
        ['minecraft:white_banner[rotation=12]', 'minecraft:standing_banner[rotation=12]'],
        ['minecraft:white_banner[rotation=13]', 'minecraft:standing_banner[rotation=13]'],
        ['minecraft:white_banner[rotation=14]', 'minecraft:standing_banner[rotation=14]'],
        ['minecraft:white_banner[rotation=15]', 'minecraft:standing_banner[rotation=15]'],
        ['minecraft:white_wall_banner[facing=north]', 'minecraft:wall_banner[facing=north]'],
        ['minecraft:white_wall_banner[facing=south]', 'minecraft:wall_banner[facing=south]'],
        ['minecraft:white_wall_banner[facing=west]', 'minecraft:wall_banner[facing=west]'],
        ['minecraft:white_wall_banner[facing=east]', 'minecraft:wall_banner[facing=east]'],
        ['minecraft:daylight_detector[inverted=true,power=0]', 'minecraft:daylight_detector_inverted[power=0]'],
        ['minecraft:daylight_detector[inverted=true,power=1]', 'minecraft:daylight_detector_inverted[power=1]'],
        ['minecraft:daylight_detector[inverted=true,power=2]', 'minecraft:daylight_detector_inverted[power=2]'],
        ['minecraft:daylight_detector[inverted=true,power=3]', 'minecraft:daylight_detector_inverted[power=3]'],
        ['minecraft:daylight_detector[inverted=true,power=4]', 'minecraft:daylight_detector_inverted[power=4]'],
        ['minecraft:daylight_detector[inverted=true,power=5]', 'minecraft:daylight_detector_inverted[power=5]'],
        ['minecraft:daylight_detector[inverted=true,power=6]', 'minecraft:daylight_detector_inverted[power=6]'],
        ['minecraft:daylight_detector[inverted=true,power=7]', 'minecraft:daylight_detector_inverted[power=7]'],
        ['minecraft:daylight_detector[inverted=true,power=8]', 'minecraft:daylight_detector_inverted[power=8]'],
        ['minecraft:daylight_detector[inverted=true,power=9]', 'minecraft:daylight_detector_inverted[power=9]'],
        ['minecraft:daylight_detector[inverted=true,power=10]', 'minecraft:daylight_detector_inverted[power=10]'],
        ['minecraft:daylight_detector[inverted=true,power=11]', 'minecraft:daylight_detector_inverted[power=11]'],
        ['minecraft:daylight_detector[inverted=true,power=12]', 'minecraft:daylight_detector_inverted[power=12]'],
        ['minecraft:daylight_detector[inverted=true,power=13]', 'minecraft:daylight_detector_inverted[power=13]'],
        ['minecraft:daylight_detector[inverted=true,power=14]', 'minecraft:daylight_detector_inverted[power=14]'],
        ['minecraft:daylight_detector[inverted=true,power=15]', 'minecraft:daylight_detector_inverted[power=15]'],
        ['minecraft:red_sandstone', 'minecraft:red_sandstone[type=red_sandstone]'],
        ['minecraft:chiseled_red_sandstone', 'minecraft:red_sandstone[type=chiseled_red_sandstone]'],
        ['minecraft:cut_red_sandstone', 'minecraft:red_sandstone[type=smooth_red_sandstone]'],
        [
            'minecraft:red_sandstone_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:red_sandstone_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:red_sandstone_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:red_sandstone_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:red_sandstone_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:red_sandstone_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:red_sandstone_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:red_sandstone_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:red_sandstone_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:red_sandstone_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:red_sandstone_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:red_sandstone_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:red_sandstone_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:red_sandstone_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:red_sandstone_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:red_sandstone_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:red_sandstone_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:red_sandstone_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:red_sandstone_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:red_sandstone_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:red_sandstone_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:red_sandstone_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:red_sandstone_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:red_sandstone_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:red_sandstone_stairs[facing=east,half=top,shape=straight]',
            'minecraft:red_sandstone_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:red_sandstone_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:red_sandstone_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:red_sandstone_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:red_sandstone_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:red_sandstone_stairs[facing=west,half=top,shape=straight]',
            'minecraft:red_sandstone_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:red_sandstone_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:red_sandstone_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:red_sandstone_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:red_sandstone_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:red_sandstone_stairs[facing=south,half=top,shape=straight]',
            'minecraft:red_sandstone_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:red_sandstone_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:red_sandstone_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:red_sandstone_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:red_sandstone_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:red_sandstone_stairs[facing=north,half=top,shape=straight]',
            'minecraft:red_sandstone_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:red_sandstone_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:red_sandstone_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:red_sandstone_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:red_sandstone_stairs[facing=north,half=top,shape=straight]'
        ],
        [
            'minecraft:red_sandstone_slab[type=double]',
            '{Name:minecraft:double_stone_slab2,Properties:{seamless:false,variant=red_sandstone]'
        ],
        [
            'minecraft:smooth_red_sandstone',
            '{Name:minecraft:double_stone_slab2,Properties:{seamless:true,variant=red_sandstone]'
        ],
        [
            'minecraft:red_sandstone_slab[type=bottom]',
            '{Name:minecraft:stone_slab2,Properties:{half:bottom,variant=red_sandstone]'
        ],
        [
            'minecraft:red_sandstone_slab[type=top]',
            '{Name:minecraft:stone_slab2,Properties:{half:top,variant=red_sandstone]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
            'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
            'minecraft:spruce_fence_gate[facing=south,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
            'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
            'minecraft:spruce_fence_gate[facing=west,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
            'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
            'minecraft:spruce_fence_gate[facing=north,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
            'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
            'minecraft:spruce_fence_gate[facing=east,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
            'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
            'minecraft:spruce_fence_gate[facing=south,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
            'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
            'minecraft:spruce_fence_gate[facing=west,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
            'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
            'minecraft:spruce_fence_gate[facing=north,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
            'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
            'minecraft:spruce_fence_gate[facing=east,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
            'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
            'minecraft:spruce_fence_gate[facing=south,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
            'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
            'minecraft:spruce_fence_gate[facing=west,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
            'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
            'minecraft:spruce_fence_gate[facing=north,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
            'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
            'minecraft:spruce_fence_gate[facing=east,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
            'minecraft:spruce_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
            'minecraft:spruce_fence_gate[facing=south,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
            'minecraft:spruce_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
            'minecraft:spruce_fence_gate[facing=west,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
            'minecraft:spruce_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
            'minecraft:spruce_fence_gate[facing=north,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
            'minecraft:spruce_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
            'minecraft:spruce_fence_gate[facing=east,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:birch_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
            'minecraft:birch_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
            'minecraft:birch_fence_gate[facing=south,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:birch_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
            'minecraft:birch_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
            'minecraft:birch_fence_gate[facing=west,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:birch_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
            'minecraft:birch_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
            'minecraft:birch_fence_gate[facing=north,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:birch_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
            'minecraft:birch_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
            'minecraft:birch_fence_gate[facing=east,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:birch_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
            'minecraft:birch_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
            'minecraft:birch_fence_gate[facing=south,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:birch_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
            'minecraft:birch_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
            'minecraft:birch_fence_gate[facing=west,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:birch_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
            'minecraft:birch_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
            'minecraft:birch_fence_gate[facing=north,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:birch_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
            'minecraft:birch_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
            'minecraft:birch_fence_gate[facing=east,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:birch_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
            'minecraft:birch_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
            'minecraft:birch_fence_gate[facing=south,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:birch_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
            'minecraft:birch_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
            'minecraft:birch_fence_gate[facing=west,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:birch_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
            'minecraft:birch_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
            'minecraft:birch_fence_gate[facing=north,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:birch_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
            'minecraft:birch_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
            'minecraft:birch_fence_gate[facing=east,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:birch_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
            'minecraft:birch_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
            'minecraft:birch_fence_gate[facing=south,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:birch_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
            'minecraft:birch_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
            'minecraft:birch_fence_gate[facing=west,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:birch_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
            'minecraft:birch_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
            'minecraft:birch_fence_gate[facing=north,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:birch_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
            'minecraft:birch_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
            'minecraft:birch_fence_gate[facing=east,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
            'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
            'minecraft:jungle_fence_gate[facing=south,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
            'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
            'minecraft:jungle_fence_gate[facing=west,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
            'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
            'minecraft:jungle_fence_gate[facing=north,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
            'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
            'minecraft:jungle_fence_gate[facing=east,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
            'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
            'minecraft:jungle_fence_gate[facing=south,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
            'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
            'minecraft:jungle_fence_gate[facing=west,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
            'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
            'minecraft:jungle_fence_gate[facing=north,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
            'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
            'minecraft:jungle_fence_gate[facing=east,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
            'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
            'minecraft:jungle_fence_gate[facing=south,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
            'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
            'minecraft:jungle_fence_gate[facing=west,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
            'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
            'minecraft:jungle_fence_gate[facing=north,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
            'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
            'minecraft:jungle_fence_gate[facing=east,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
            'minecraft:jungle_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
            'minecraft:jungle_fence_gate[facing=south,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
            'minecraft:jungle_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
            'minecraft:jungle_fence_gate[facing=west,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
            'minecraft:jungle_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
            'minecraft:jungle_fence_gate[facing=north,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
            'minecraft:jungle_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
            'minecraft:jungle_fence_gate[facing=east,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=south,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=west,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=north,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=east,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=south,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=west,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=north,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
            'minecraft:dark_oak_fence_gate[facing=east,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=south,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=west,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=north,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=east,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=south,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=west,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=north,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
            'minecraft:dark_oak_fence_gate[facing=east,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
            'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:false,powered=false]',
            'minecraft:acacia_fence_gate[facing=south,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
            'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:false,powered=false]',
            'minecraft:acacia_fence_gate[facing=west,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
            'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:false,powered=false]',
            'minecraft:acacia_fence_gate[facing=north,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
            'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:false,powered=false]',
            'minecraft:acacia_fence_gate[facing=east,in_wall=true,open:false,powered=false]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
            'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:true,powered=false]',
            'minecraft:acacia_fence_gate[facing=south,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
            'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:true,powered=false]',
            'minecraft:acacia_fence_gate[facing=west,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
            'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:true,powered=false]',
            'minecraft:acacia_fence_gate[facing=north,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
            'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:true,powered=false]',
            'minecraft:acacia_fence_gate[facing=east,in_wall=true,open:true,powered=false]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
            'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:false,powered=true]',
            'minecraft:acacia_fence_gate[facing=south,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
            'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:false,powered=true]',
            'minecraft:acacia_fence_gate[facing=west,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
            'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:false,powered=true]',
            'minecraft:acacia_fence_gate[facing=north,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
            'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:false,powered=true]',
            'minecraft:acacia_fence_gate[facing=east,in_wall=true,open:false,powered=true]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
            'minecraft:acacia_fence_gate[facing=south,in_wall=false,open:true,powered=true]',
            'minecraft:acacia_fence_gate[facing=south,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
            'minecraft:acacia_fence_gate[facing=west,in_wall=false,open:true,powered=true]',
            'minecraft:acacia_fence_gate[facing=west,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
            'minecraft:acacia_fence_gate[facing=north,in_wall=false,open:true,powered=true]',
            'minecraft:acacia_fence_gate[facing=north,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
            'minecraft:acacia_fence_gate[facing=east,in_wall=false,open:true,powered=true]',
            'minecraft:acacia_fence_gate[facing=east,in_wall=true,open:true,powered=true]'
        ],
        [
            'minecraft:spruce_fence[east=false,north=false,south:false,west=false]',
            'minecraft:spruce_fence[east=false,north=false,south:false,west=false]',
            'minecraft:spruce_fence[east=false,north=false,south:false,west=true]',
            'minecraft:spruce_fence[east=false,north=false,south:true,west=false]',
            'minecraft:spruce_fence[east=false,north=false,south:true,west=true]',
            'minecraft:spruce_fence[east=false,north=true,south:false,west=false]',
            'minecraft:spruce_fence[east=false,north=true,south:false,west=true]',
            'minecraft:spruce_fence[east=false,north=true,south:true,west=false]',
            'minecraft:spruce_fence[east=false,north=true,south:true,west=true]',
            'minecraft:spruce_fence[east=true,north=false,south:false,west=false]',
            'minecraft:spruce_fence[east=true,north=false,south:false,west=true]',
            'minecraft:spruce_fence[east=true,north=false,south:true,west=false]',
            'minecraft:spruce_fence[east=true,north=false,south:true,west=true]',
            'minecraft:spruce_fence[east=true,north=true,south:false,west=false]',
            'minecraft:spruce_fence[east=true,north=true,south:false,west=true]',
            'minecraft:spruce_fence[east=true,north=true,south:true,west=false]',
            'minecraft:spruce_fence[east=true,north=true,south:true,west=true]'
        ],
        [
            'minecraft:birch_fence[east=false,north=false,south:false,west=false]',
            'minecraft:birch_fence[east=false,north=false,south:false,west=false]',
            'minecraft:birch_fence[east=false,north=false,south:false,west=true]',
            'minecraft:birch_fence[east=false,north=false,south:true,west=false]',
            'minecraft:birch_fence[east=false,north=false,south:true,west=true]',
            'minecraft:birch_fence[east=false,north=true,south:false,west=false]',
            'minecraft:birch_fence[east=false,north=true,south:false,west=true]',
            'minecraft:birch_fence[east=false,north=true,south:true,west=false]',
            'minecraft:birch_fence[east=false,north=true,south:true,west=true]',
            'minecraft:birch_fence[east=true,north=false,south:false,west=false]',
            'minecraft:birch_fence[east=true,north=false,south:false,west=true]',
            'minecraft:birch_fence[east=true,north=false,south:true,west=false]',
            'minecraft:birch_fence[east=true,north=false,south:true,west=true]',
            'minecraft:birch_fence[east=true,north=true,south:false,west=false]',
            'minecraft:birch_fence[east=true,north=true,south:false,west=true]',
            'minecraft:birch_fence[east=true,north=true,south:true,west=false]',
            'minecraft:birch_fence[east=true,north=true,south:true,west=true]'
        ],
        [
            'minecraft:jungle_fence[east=false,north=false,south:false,west=false]',
            'minecraft:jungle_fence[east=false,north=false,south:false,west=false]',
            'minecraft:jungle_fence[east=false,north=false,south:false,west=true]',
            'minecraft:jungle_fence[east=false,north=false,south:true,west=false]',
            'minecraft:jungle_fence[east=false,north=false,south:true,west=true]',
            'minecraft:jungle_fence[east=false,north=true,south:false,west=false]',
            'minecraft:jungle_fence[east=false,north=true,south:false,west=true]',
            'minecraft:jungle_fence[east=false,north=true,south:true,west=false]',
            'minecraft:jungle_fence[east=false,north=true,south:true,west=true]',
            'minecraft:jungle_fence[east=true,north=false,south:false,west=false]',
            'minecraft:jungle_fence[east=true,north=false,south:false,west=true]',
            'minecraft:jungle_fence[east=true,north=false,south:true,west=false]',
            'minecraft:jungle_fence[east=true,north=false,south:true,west=true]',
            'minecraft:jungle_fence[east=true,north=true,south:false,west=false]',
            'minecraft:jungle_fence[east=true,north=true,south:false,west=true]',
            'minecraft:jungle_fence[east=true,north=true,south:true,west=false]',
            'minecraft:jungle_fence[east=true,north=true,south:true,west=true]'
        ],
        [
            'minecraft:dark_oak_fence[east=false,north=false,south:false,west=false]',
            'minecraft:dark_oak_fence[east=false,north=false,south:false,west=false]',
            'minecraft:dark_oak_fence[east=false,north=false,south:false,west=true]',
            'minecraft:dark_oak_fence[east=false,north=false,south:true,west=false]',
            'minecraft:dark_oak_fence[east=false,north=false,south:true,west=true]',
            'minecraft:dark_oak_fence[east=false,north=true,south:false,west=false]',
            'minecraft:dark_oak_fence[east=false,north=true,south:false,west=true]',
            'minecraft:dark_oak_fence[east=false,north=true,south:true,west=false]',
            'minecraft:dark_oak_fence[east=false,north=true,south:true,west=true]',
            'minecraft:dark_oak_fence[east=true,north=false,south:false,west=false]',
            'minecraft:dark_oak_fence[east=true,north=false,south:false,west=true]',
            'minecraft:dark_oak_fence[east=true,north=false,south:true,west=false]',
            'minecraft:dark_oak_fence[east=true,north=false,south:true,west=true]',
            'minecraft:dark_oak_fence[east=true,north=true,south:false,west=false]',
            'minecraft:dark_oak_fence[east=true,north=true,south:false,west=true]',
            'minecraft:dark_oak_fence[east=true,north=true,south:true,west=false]',
            'minecraft:dark_oak_fence[east=true,north=true,south:true,west=true]'
        ],
        [
            'minecraft:acacia_fence[east=false,north=false,south:false,west=false]',
            'minecraft:acacia_fence[east=false,north=false,south:false,west=false]',
            'minecraft:acacia_fence[east=false,north=false,south:false,west=true]',
            'minecraft:acacia_fence[east=false,north=false,south:true,west=false]',
            'minecraft:acacia_fence[east=false,north=false,south:true,west=true]',
            'minecraft:acacia_fence[east=false,north=true,south:false,west=false]',
            'minecraft:acacia_fence[east=false,north=true,south:false,west=true]',
            'minecraft:acacia_fence[east=false,north=true,south:true,west=false]',
            'minecraft:acacia_fence[east=false,north=true,south:true,west=true]',
            'minecraft:acacia_fence[east=true,north=false,south:false,west=false]',
            'minecraft:acacia_fence[east=true,north=false,south:false,west=true]',
            'minecraft:acacia_fence[east=true,north=false,south:true,west=false]',
            'minecraft:acacia_fence[east=true,north=false,south:true,west=true]',
            'minecraft:acacia_fence[east=true,north=true,south:false,west=false]',
            'minecraft:acacia_fence[east=true,north=true,south:false,west=true]',
            'minecraft:acacia_fence[east=true,north=true,south:true,west=false]',
            'minecraft:acacia_fence[east=true,north=true,south:true,west=true]'
        ],
        [
            'minecraft:spruce_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:spruce_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:spruce_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:spruce_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:spruce_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:spruce_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:spruce_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:spruce_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:spruce_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:spruce_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:spruce_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:spruce_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:spruce_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:spruce_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:spruce_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:spruce_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:spruce_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:spruce_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:spruce_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:spruce_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:spruce_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:spruce_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:spruce_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:spruce_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:spruce_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:spruce_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:spruce_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:spruce_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:spruce_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:spruce_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:spruce_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:spruce_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:spruce_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:spruce_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:spruce_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:spruce_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:spruce_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:spruce_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:spruce_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:spruce_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:spruce_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:spruce_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:spruce_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:spruce_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:spruce_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:spruce_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:spruce_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:spruce_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:spruce_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
        ],
        [
            'minecraft:spruce_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:spruce_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:spruce_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:spruce_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:spruce_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:spruce_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:spruce_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:spruce_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:spruce_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
        ],
        [
            'minecraft:spruce_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:spruce_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:spruce_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:spruce_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:spruce_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:spruce_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:spruce_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:spruce_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:spruce_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
        ],
        [
            'minecraft:spruce_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:spruce_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:spruce_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:spruce_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:spruce_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:spruce_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:spruce_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:spruce_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:spruce_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:birch_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:birch_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:birch_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:birch_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:birch_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:birch_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:birch_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:birch_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:birch_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:birch_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:birch_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:birch_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:birch_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:birch_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:birch_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:birch_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:birch_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:birch_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:birch_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:birch_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:birch_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:birch_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:birch_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:birch_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:birch_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:birch_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:birch_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:birch_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:birch_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:birch_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:birch_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:birch_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:birch_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:birch_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:birch_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:birch_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:birch_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:birch_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:birch_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:birch_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:birch_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:birch_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:birch_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:birch_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:birch_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:birch_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:birch_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:birch_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:birch_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
        ],
        [
            'minecraft:birch_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:birch_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:birch_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:birch_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:birch_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:birch_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:birch_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:birch_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:birch_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
        ],
        [
            'minecraft:birch_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:birch_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:birch_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:birch_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:birch_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:birch_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:birch_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:birch_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:birch_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
        ],
        [
            'minecraft:birch_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:birch_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:birch_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:birch_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:birch_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:birch_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:birch_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:birch_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:birch_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:jungle_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:jungle_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:jungle_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:jungle_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:jungle_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:jungle_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:jungle_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:jungle_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:jungle_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:jungle_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:jungle_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:jungle_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:jungle_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:jungle_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:jungle_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:jungle_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:jungle_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:jungle_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:jungle_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:jungle_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:jungle_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:jungle_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:jungle_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:jungle_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:jungle_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:jungle_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:jungle_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:jungle_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:jungle_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:jungle_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:jungle_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:jungle_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:jungle_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:jungle_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:jungle_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:jungle_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:jungle_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:jungle_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:jungle_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:jungle_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:jungle_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:jungle_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:jungle_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:jungle_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:jungle_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:jungle_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:jungle_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:jungle_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:jungle_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
        ],
        [
            'minecraft:jungle_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:jungle_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:jungle_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:jungle_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:jungle_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:jungle_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:jungle_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:jungle_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:jungle_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
        ],
        [
            'minecraft:jungle_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:jungle_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:jungle_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:jungle_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:jungle_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:jungle_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:jungle_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:jungle_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:jungle_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
        ],
        [
            'minecraft:jungle_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:jungle_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:jungle_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:jungle_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:jungle_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:jungle_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:jungle_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:jungle_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:jungle_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:acacia_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:acacia_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:acacia_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:acacia_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:acacia_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:acacia_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:acacia_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:acacia_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:acacia_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:acacia_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:acacia_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:acacia_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:acacia_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:acacia_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:acacia_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:acacia_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:acacia_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:acacia_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:acacia_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:acacia_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:acacia_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:acacia_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:acacia_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:acacia_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:acacia_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:acacia_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:acacia_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:acacia_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:acacia_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:acacia_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:acacia_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:acacia_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:acacia_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:acacia_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:acacia_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:acacia_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:acacia_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:acacia_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:acacia_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:acacia_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:acacia_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:acacia_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:acacia_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:acacia_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:acacia_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:acacia_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:acacia_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:acacia_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:acacia_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
        ],
        [
            'minecraft:acacia_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:acacia_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:acacia_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:acacia_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:acacia_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:acacia_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:acacia_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:acacia_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:acacia_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
        ],
        [
            'minecraft:acacia_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:acacia_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:acacia_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:acacia_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:acacia_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:acacia_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:acacia_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:acacia_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:acacia_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
        ],
        [
            'minecraft:acacia_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:acacia_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:acacia_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:acacia_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:acacia_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:acacia_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:acacia_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:acacia_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:acacia_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:dark_oak_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=east,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=east,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=east,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=east,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:dark_oak_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=south,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=south,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=south,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=south,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:dark_oak_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=west,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=west,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=west,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=west,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:dark_oak_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=north,half=lower,hinge:left,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=north,half=lower,hinge:left,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=north,half=lower,hinge:right,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=north,half=lower,hinge:right,open=false,powered=true]'
        ],
        [
            'minecraft:dark_oak_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=east,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=east,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:dark_oak_door[facing=east,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=east,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:dark_oak_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=south,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=south,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:dark_oak_door[facing=south,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=south,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:dark_oak_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=west,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=west,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:dark_oak_door[facing=west,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=west,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:dark_oak_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=north,half=lower,hinge:left,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=north,half=lower,hinge:left,open=true,powered=true]',
            'minecraft:dark_oak_door[facing=north,half=lower,hinge:right,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=north,half=lower,hinge:right,open=true,powered=true]'
        ],
        [
            'minecraft:dark_oak_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=east,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=east,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=north,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=north,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=south,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=south,half=upper,hinge:left,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=west,half=upper,hinge:left,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=west,half=upper,hinge:left,open=true,powered=false]'
        ],
        [
            'minecraft:dark_oak_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=east,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=east,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=north,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=north,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=south,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=south,half=upper,hinge:right,open=true,powered=false]',
            'minecraft:dark_oak_door[facing=west,half=upper,hinge:right,open=false,powered=false]',
            'minecraft:dark_oak_door[facing=west,half=upper,hinge:right,open=true,powered=false]'
        ],
        [
            'minecraft:dark_oak_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=east,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=east,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:dark_oak_door[facing=north,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=north,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:dark_oak_door[facing=south,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=south,half=upper,hinge:left,open=true,powered=true]',
            'minecraft:dark_oak_door[facing=west,half=upper,hinge:left,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=west,half=upper,hinge:left,open=true,powered=true]'
        ],
        [
            'minecraft:dark_oak_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=east,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=east,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:dark_oak_door[facing=north,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=north,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:dark_oak_door[facing=south,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=south,half=upper,hinge:right,open=true,powered=true]',
            'minecraft:dark_oak_door[facing=west,half=upper,hinge:right,open=false,powered=true]',
            'minecraft:dark_oak_door[facing=west,half=upper,hinge:right,open=true,powered=true]'
        ],
        ['minecraft:end_rod[facing=down]', 'minecraft:end_rod[facing=down]'],
        ['minecraft:end_rod[facing=up]', 'minecraft:end_rod[facing=up]'],
        ['minecraft:end_rod[facing=north]', 'minecraft:end_rod[facing=north]'],
        ['minecraft:end_rod[facing=south]', 'minecraft:end_rod[facing=south]'],
        ['minecraft:end_rod[facing=west]', 'minecraft:end_rod[facing=west]'],
        ['minecraft:end_rod[facing=east]', 'minecraft:end_rod[facing=east]'],
        [
            'minecraft:chorus_plant[down=false,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:chorus_plant[down=false,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:chorus_plant[down=false,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:chorus_plant[down=false,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:chorus_plant[down=false,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:chorus_plant[down=false,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:chorus_plant[down=false,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:chorus_plant[down=false,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:chorus_plant[down=false,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:chorus_plant[down=false,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:chorus_plant[down=false,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:chorus_plant[down=false,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:chorus_plant[down=false,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:chorus_plant[down=false,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:chorus_plant[down=false,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:chorus_plant[down=false,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:chorus_plant[down=false,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:chorus_plant[down=false,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:chorus_plant[down=false,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:chorus_plant[down=false,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:chorus_plant[down=false,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:chorus_plant[down=false,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:chorus_plant[down=false,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:chorus_plant[down=false,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:chorus_plant[down=false,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:chorus_plant[down=false,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:chorus_plant[down=false,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:chorus_plant[down=false,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:chorus_plant[down=false,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:chorus_plant[down=false,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:chorus_plant[down=false,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:chorus_plant[down=false,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:chorus_plant[down=false,east=true,north:true,south=true,up:true,west=true]',
            'minecraft:chorus_plant[down=true,east=false,north:false,south=false,up:false,west=false]',
            'minecraft:chorus_plant[down=true,east=false,north:false,south=false,up:false,west=true]',
            'minecraft:chorus_plant[down=true,east=false,north:false,south=false,up:true,west=false]',
            'minecraft:chorus_plant[down=true,east=false,north:false,south=false,up:true,west=true]',
            'minecraft:chorus_plant[down=true,east=false,north:false,south=true,up:false,west=false]',
            'minecraft:chorus_plant[down=true,east=false,north:false,south=true,up:false,west=true]',
            'minecraft:chorus_plant[down=true,east=false,north:false,south=true,up:true,west=false]',
            'minecraft:chorus_plant[down=true,east=false,north:false,south=true,up:true,west=true]',
            'minecraft:chorus_plant[down=true,east=false,north:true,south=false,up:false,west=false]',
            'minecraft:chorus_plant[down=true,east=false,north:true,south=false,up:false,west=true]',
            'minecraft:chorus_plant[down=true,east=false,north:true,south=false,up:true,west=false]',
            'minecraft:chorus_plant[down=true,east=false,north:true,south=false,up:true,west=true]',
            'minecraft:chorus_plant[down=true,east=false,north:true,south=true,up:false,west=false]',
            'minecraft:chorus_plant[down=true,east=false,north:true,south=true,up:false,west=true]',
            'minecraft:chorus_plant[down=true,east=false,north:true,south=true,up:true,west=false]',
            'minecraft:chorus_plant[down=true,east=false,north:true,south=true,up:true,west=true]',
            'minecraft:chorus_plant[down=true,east=true,north:false,south=false,up:false,west=false]',
            'minecraft:chorus_plant[down=true,east=true,north:false,south=false,up:false,west=true]',
            'minecraft:chorus_plant[down=true,east=true,north:false,south=false,up:true,west=false]',
            'minecraft:chorus_plant[down=true,east=true,north:false,south=false,up:true,west=true]',
            'minecraft:chorus_plant[down=true,east=true,north:false,south=true,up:false,west=false]',
            'minecraft:chorus_plant[down=true,east=true,north:false,south=true,up:false,west=true]',
            'minecraft:chorus_plant[down=true,east=true,north:false,south=true,up:true,west=false]',
            'minecraft:chorus_plant[down=true,east=true,north:false,south=true,up:true,west=true]',
            'minecraft:chorus_plant[down=true,east=true,north:true,south=false,up:false,west=false]',
            'minecraft:chorus_plant[down=true,east=true,north:true,south=false,up:false,west=true]',
            'minecraft:chorus_plant[down=true,east=true,north:true,south=false,up:true,west=false]',
            'minecraft:chorus_plant[down=true,east=true,north:true,south=false,up:true,west=true]',
            'minecraft:chorus_plant[down=true,east=true,north:true,south=true,up:false,west=false]',
            'minecraft:chorus_plant[down=true,east=true,north:true,south=true,up:false,west=true]',
            'minecraft:chorus_plant[down=true,east=true,north:true,south=true,up:true,west=false]',
            'minecraft:chorus_plant[down=true,east=true,north:true,south=true,up:true,west=true]'
        ],
        ['minecraft:chorus_flower[age=0]', 'minecraft:chorus_flower[age=0]'],
        ['minecraft:chorus_flower[age=1]', 'minecraft:chorus_flower[age=1]'],
        ['minecraft:chorus_flower[age=2]', 'minecraft:chorus_flower[age=2]'],
        ['minecraft:chorus_flower[age=3]', 'minecraft:chorus_flower[age=3]'],
        ['minecraft:chorus_flower[age=4]', 'minecraft:chorus_flower[age=4]'],
        ['minecraft:chorus_flower[age=5]', 'minecraft:chorus_flower[age=5]'],
        ['minecraft:purpur_block', 'minecraft:purpur_block'],
        ['minecraft:purpur_pillar[axis=y]', 'minecraft:purpur_pillar[axis=y]'],
        ['minecraft:purpur_pillar[axis=x]', 'minecraft:purpur_pillar[axis=x]'],
        ['minecraft:purpur_pillar[axis=z]', 'minecraft:purpur_pillar[axis=z]'],
        [
            'minecraft:purpur_stairs[facing=east,half=bottom,shape=straight]',
            'minecraft:purpur_stairs[facing=east,half=bottom,shape=inner_left]',
            'minecraft:purpur_stairs[facing=east,half=bottom,shape=inner_right]',
            'minecraft:purpur_stairs[facing=east,half=bottom,shape=outer_left]',
            'minecraft:purpur_stairs[facing=east,half=bottom,shape=outer_right]',
            'minecraft:purpur_stairs[facing=east,half=bottom,shape=straight]'
        ],
        [
            'minecraft:purpur_stairs[facing=west,half=bottom,shape=straight]',
            'minecraft:purpur_stairs[facing=west,half=bottom,shape=inner_left]',
            'minecraft:purpur_stairs[facing=west,half=bottom,shape=inner_right]',
            'minecraft:purpur_stairs[facing=west,half=bottom,shape=outer_left]',
            'minecraft:purpur_stairs[facing=west,half=bottom,shape=outer_right]',
            'minecraft:purpur_stairs[facing=west,half=bottom,shape=straight]'
        ],
        [
            'minecraft:purpur_stairs[facing=south,half=bottom,shape=straight]',
            'minecraft:purpur_stairs[facing=south,half=bottom,shape=inner_left]',
            'minecraft:purpur_stairs[facing=south,half=bottom,shape=inner_right]',
            'minecraft:purpur_stairs[facing=south,half=bottom,shape=outer_left]',
            'minecraft:purpur_stairs[facing=south,half=bottom,shape=outer_right]',
            'minecraft:purpur_stairs[facing=south,half=bottom,shape=straight]'
        ],
        [
            'minecraft:purpur_stairs[facing=north,half=bottom,shape=straight]',
            'minecraft:purpur_stairs[facing=north,half=bottom,shape=inner_left]',
            'minecraft:purpur_stairs[facing=north,half=bottom,shape=inner_right]',
            'minecraft:purpur_stairs[facing=north,half=bottom,shape=outer_left]',
            'minecraft:purpur_stairs[facing=north,half=bottom,shape=outer_right]',
            'minecraft:purpur_stairs[facing=north,half=bottom,shape=straight]'
        ],
        [
            'minecraft:purpur_stairs[facing=east,half=top,shape=straight]',
            'minecraft:purpur_stairs[facing=east,half=top,shape=inner_left]',
            'minecraft:purpur_stairs[facing=east,half=top,shape=inner_right]',
            'minecraft:purpur_stairs[facing=east,half=top,shape=outer_left]',
            'minecraft:purpur_stairs[facing=east,half=top,shape=outer_right]',
            'minecraft:purpur_stairs[facing=east,half=top,shape=straight]'
        ],
        [
            'minecraft:purpur_stairs[facing=west,half=top,shape=straight]',
            'minecraft:purpur_stairs[facing=west,half=top,shape=inner_left]',
            'minecraft:purpur_stairs[facing=west,half=top,shape=inner_right]',
            'minecraft:purpur_stairs[facing=west,half=top,shape=outer_left]',
            'minecraft:purpur_stairs[facing=west,half=top,shape=outer_right]',
            'minecraft:purpur_stairs[facing=west,half=top,shape=straight]'
        ],
        [
            'minecraft:purpur_stairs[facing=south,half=top,shape=straight]',
            'minecraft:purpur_stairs[facing=south,half=top,shape=inner_left]',
            'minecraft:purpur_stairs[facing=south,half=top,shape=inner_right]',
            'minecraft:purpur_stairs[facing=south,half=top,shape=outer_left]',
            'minecraft:purpur_stairs[facing=south,half=top,shape=outer_right]',
            'minecraft:purpur_stairs[facing=south,half=top,shape=straight]'
        ],
        [
            'minecraft:purpur_stairs[facing=north,half=top,shape=straight]',
            'minecraft:purpur_stairs[facing=north,half=top,shape=inner_left]',
            'minecraft:purpur_stairs[facing=north,half=top,shape=inner_right]',
            'minecraft:purpur_stairs[facing=north,half=top,shape=outer_left]',
            'minecraft:purpur_stairs[facing=north,half=top,shape=outer_right]',
            'minecraft:purpur_stairs[facing=north,half=top,shape=straight]'
        ],
        ['minecraft:purpur_slab[type=double]', 'minecraft:purpur_double_slab[variant=default]'],
        ['minecraft:purpur_slab[type=bottom]', 'minecraft:purpur_slab[half=bottom,variant=default]'],
        ['minecraft:purpur_slab[type=top]', 'minecraft:purpur_slab[half=top,variant=default]'],
        ['minecraft:end_stone_bricks', 'minecraft:end_bricks'],
        ['minecraft:beetroots[age=0]', 'minecraft:beetroots[age=0]'],
        ['minecraft:beetroots[age=1]', 'minecraft:beetroots[age=1]'],
        ['minecraft:beetroots[age=2]', 'minecraft:beetroots[age=2]'],
        ['minecraft:beetroots[age=3]', 'minecraft:beetroots[age=3]'],
        ['minecraft:grass_path', 'minecraft:grass_path'],
        ['minecraft:end_gateway', 'minecraft:end_gateway'],
        [
            'minecraft:repeating_command_block[conditional=false,facing=down]',
            'minecraft:repeating_command_block[conditional=false,facing=down]'
        ],
        [
            'minecraft:repeating_command_block[conditional=false,facing=up]',
            'minecraft:repeating_command_block[conditional=false,facing=up]'
        ],
        [
            'minecraft:repeating_command_block[conditional=false,facing=north]',
            'minecraft:repeating_command_block[conditional=false,facing=north]'
        ],
        [
            'minecraft:repeating_command_block[conditional=false,facing=south]',
            'minecraft:repeating_command_block[conditional=false,facing=south]'
        ],
        [
            'minecraft:repeating_command_block[conditional=false,facing=west]',
            'minecraft:repeating_command_block[conditional=false,facing=west]'
        ],
        [
            'minecraft:repeating_command_block[conditional=false,facing=east]',
            'minecraft:repeating_command_block[conditional=false,facing=east]'
        ],
        [
            'minecraft:repeating_command_block[conditional=true,facing=down]',
            'minecraft:repeating_command_block[conditional=true,facing=down]'
        ],
        [
            'minecraft:repeating_command_block[conditional=true,facing=up]',
            'minecraft:repeating_command_block[conditional=true,facing=up]'
        ],
        [
            'minecraft:repeating_command_block[conditional=true,facing=north]',
            'minecraft:repeating_command_block[conditional=true,facing=north]'
        ],
        [
            'minecraft:repeating_command_block[conditional=true,facing=south]',
            'minecraft:repeating_command_block[conditional=true,facing=south]'
        ],
        [
            'minecraft:repeating_command_block[conditional=true,facing=west]',
            'minecraft:repeating_command_block[conditional=true,facing=west]'
        ],
        [
            'minecraft:repeating_command_block[conditional=true,facing=east]',
            'minecraft:repeating_command_block[conditional=true,facing=east]'
        ],
        [
            'minecraft:chain_command_block[conditional=false,facing=down]',
            'minecraft:chain_command_block[conditional=false,facing=down]'
        ],
        [
            'minecraft:chain_command_block[conditional=false,facing=up]',
            'minecraft:chain_command_block[conditional=false,facing=up]'
        ],
        [
            'minecraft:chain_command_block[conditional=false,facing=north]',
            'minecraft:chain_command_block[conditional=false,facing=north]'
        ],
        [
            'minecraft:chain_command_block[conditional=false,facing=south]',
            'minecraft:chain_command_block[conditional=false,facing=south]'
        ],
        [
            'minecraft:chain_command_block[conditional=false,facing=west]',
            'minecraft:chain_command_block[conditional=false,facing=west]'
        ],
        [
            'minecraft:chain_command_block[conditional=false,facing=east]',
            'minecraft:chain_command_block[conditional=false,facing=east]'
        ],
        [
            'minecraft:chain_command_block[conditional=true,facing=down]',
            'minecraft:chain_command_block[conditional=true,facing=down]'
        ],
        [
            'minecraft:chain_command_block[conditional=true,facing=up]',
            'minecraft:chain_command_block[conditional=true,facing=up]'
        ],
        [
            'minecraft:chain_command_block[conditional=true,facing=north]',
            'minecraft:chain_command_block[conditional=true,facing=north]'
        ],
        [
            'minecraft:chain_command_block[conditional=true,facing=south]',
            'minecraft:chain_command_block[conditional=true,facing=south]'
        ],
        [
            'minecraft:chain_command_block[conditional=true,facing=west]',
            'minecraft:chain_command_block[conditional=true,facing=west]'
        ],
        [
            'minecraft:chain_command_block[conditional=true,facing=east]',
            'minecraft:chain_command_block[conditional=true,facing=east]'
        ],
        ['minecraft:frosted_ice[age=0]', 'minecraft:frosted_ice[age=0]'],
        ['minecraft:frosted_ice[age=1]', 'minecraft:frosted_ice[age=1]'],
        ['minecraft:frosted_ice[age=2]', 'minecraft:frosted_ice[age=2]'],
        ['minecraft:frosted_ice[age=3]', 'minecraft:frosted_ice[age=3]'],
        ['minecraft:magma_block', 'minecraft:magma'],
        ['minecraft:nether_wart_block', 'minecraft:nether_wart_block'],
        ['minecraft:red_nether_bricks', 'minecraft:red_nether_brick'],
        ['minecraft:bone_block[axis=y]', 'minecraft:bone_block[axis=y]'],
        ['minecraft:bone_block[axis=x]', 'minecraft:bone_block[axis=x]'],
        ['minecraft:bone_block[axis=z]', 'minecraft:bone_block[axis=z]'],
        ['minecraft:structure_void', 'minecraft:structure_void'],
        ['minecraft:observer[facing=down,powered=false]', 'minecraft:observer[facing=down,powered=false]'],
        ['minecraft:observer[facing=up,powered=false]', 'minecraft:observer[facing=up,powered=false]'],
        ['minecraft:observer[facing=north,powered=false]', 'minecraft:observer[facing=north,powered=false]'],
        ['minecraft:observer[facing=south,powered=false]', 'minecraft:observer[facing=south,powered=false]'],
        ['minecraft:observer[facing=west,powered=false]', 'minecraft:observer[facing=west,powered=false]'],
        ['minecraft:observer[facing=east,powered=false]', 'minecraft:observer[facing=east,powered=false]'],
        ['minecraft:observer[facing=down,powered=true]', 'minecraft:observer[facing=down,powered=true]'],
        ['minecraft:observer[facing=up,powered=true]', 'minecraft:observer[facing=up,powered=true]'],
        ['minecraft:observer[facing=north,powered=true]', 'minecraft:observer[facing=north,powered=true]'],
        ['minecraft:observer[facing=south,powered=true]', 'minecraft:observer[facing=south,powered=true]'],
        ['minecraft:observer[facing=west,powered=true]', 'minecraft:observer[facing=west,powered=true]'],
        ['minecraft:observer[facing=east,powered=true]', 'minecraft:observer[facing=east,powered=true]'],
        ['minecraft:white_shulker_box[facing=down]', 'minecraft:white_shulker_box[facing=down]'],
        ['minecraft:white_shulker_box[facing=up]', 'minecraft:white_shulker_box[facing=up]'],
        ['minecraft:white_shulker_box[facing=north]', 'minecraft:white_shulker_box[facing=north]'],
        ['minecraft:white_shulker_box[facing=south]', 'minecraft:white_shulker_box[facing=south]'],
        ['minecraft:white_shulker_box[facing=west]', 'minecraft:white_shulker_box[facing=west]'],
        ['minecraft:white_shulker_box[facing=east]', 'minecraft:white_shulker_box[facing=east]'],
        ['minecraft:orange_shulker_box[facing=down]', 'minecraft:orange_shulker_box[facing=down]'],
        ['minecraft:orange_shulker_box[facing=up]', 'minecraft:orange_shulker_box[facing=up]'],
        ['minecraft:orange_shulker_box[facing=north]', 'minecraft:orange_shulker_box[facing=north]'],
        ['minecraft:orange_shulker_box[facing=south]', 'minecraft:orange_shulker_box[facing=south]'],
        ['minecraft:orange_shulker_box[facing=west]', 'minecraft:orange_shulker_box[facing=west]'],
        ['minecraft:orange_shulker_box[facing=east]', 'minecraft:orange_shulker_box[facing=east]'],
        ['minecraft:magenta_shulker_box[facing=down]', 'minecraft:magenta_shulker_box[facing=down]'],
        ['minecraft:magenta_shulker_box[facing=up]', 'minecraft:magenta_shulker_box[facing=up]'],
        ['minecraft:magenta_shulker_box[facing=north]', 'minecraft:magenta_shulker_box[facing=north]'],
        ['minecraft:magenta_shulker_box[facing=south]', 'minecraft:magenta_shulker_box[facing=south]'],
        ['minecraft:magenta_shulker_box[facing=west]', 'minecraft:magenta_shulker_box[facing=west]'],
        ['minecraft:magenta_shulker_box[facing=east]', 'minecraft:magenta_shulker_box[facing=east]'],
        ['minecraft:light_blue_shulker_box[facing=down]', 'minecraft:light_blue_shulker_box[facing=down]'],
        ['minecraft:light_blue_shulker_box[facing=up]', 'minecraft:light_blue_shulker_box[facing=up]'],
        ['minecraft:light_blue_shulker_box[facing=north]', 'minecraft:light_blue_shulker_box[facing=north]'],
        ['minecraft:light_blue_shulker_box[facing=south]', 'minecraft:light_blue_shulker_box[facing=south]'],
        ['minecraft:light_blue_shulker_box[facing=west]', 'minecraft:light_blue_shulker_box[facing=west]'],
        ['minecraft:light_blue_shulker_box[facing=east]', 'minecraft:light_blue_shulker_box[facing=east]'],
        ['minecraft:yellow_shulker_box[facing=down]', 'minecraft:yellow_shulker_box[facing=down]'],
        ['minecraft:yellow_shulker_box[facing=up]', 'minecraft:yellow_shulker_box[facing=up]'],
        ['minecraft:yellow_shulker_box[facing=north]', 'minecraft:yellow_shulker_box[facing=north]'],
        ['minecraft:yellow_shulker_box[facing=south]', 'minecraft:yellow_shulker_box[facing=south]'],
        ['minecraft:yellow_shulker_box[facing=west]', 'minecraft:yellow_shulker_box[facing=west]'],
        ['minecraft:yellow_shulker_box[facing=east]', 'minecraft:yellow_shulker_box[facing=east]'],
        ['minecraft:lime_shulker_box[facing=down]', 'minecraft:lime_shulker_box[facing=down]'],
        ['minecraft:lime_shulker_box[facing=up]', 'minecraft:lime_shulker_box[facing=up]'],
        ['minecraft:lime_shulker_box[facing=north]', 'minecraft:lime_shulker_box[facing=north]'],
        ['minecraft:lime_shulker_box[facing=south]', 'minecraft:lime_shulker_box[facing=south]'],
        ['minecraft:lime_shulker_box[facing=west]', 'minecraft:lime_shulker_box[facing=west]'],
        ['minecraft:lime_shulker_box[facing=east]', 'minecraft:lime_shulker_box[facing=east]'],
        ['minecraft:pink_shulker_box[facing=down]', 'minecraft:pink_shulker_box[facing=down]'],
        ['minecraft:pink_shulker_box[facing=up]', 'minecraft:pink_shulker_box[facing=up]'],
        ['minecraft:pink_shulker_box[facing=north]', 'minecraft:pink_shulker_box[facing=north]'],
        ['minecraft:pink_shulker_box[facing=south]', 'minecraft:pink_shulker_box[facing=south]'],
        ['minecraft:pink_shulker_box[facing=west]', 'minecraft:pink_shulker_box[facing=west]'],
        ['minecraft:pink_shulker_box[facing=east]', 'minecraft:pink_shulker_box[facing=east]'],
        ['minecraft:gray_shulker_box[facing=down]', 'minecraft:gray_shulker_box[facing=down]'],
        ['minecraft:gray_shulker_box[facing=up]', 'minecraft:gray_shulker_box[facing=up]'],
        ['minecraft:gray_shulker_box[facing=north]', 'minecraft:gray_shulker_box[facing=north]'],
        ['minecraft:gray_shulker_box[facing=south]', 'minecraft:gray_shulker_box[facing=south]'],
        ['minecraft:gray_shulker_box[facing=west]', 'minecraft:gray_shulker_box[facing=west]'],
        ['minecraft:gray_shulker_box[facing=east]', 'minecraft:gray_shulker_box[facing=east]'],
        ['minecraft:light_gray_shulker_box[facing=down]', 'minecraft:silver_shulker_box[facing=down]'],
        ['minecraft:light_gray_shulker_box[facing=up]', 'minecraft:silver_shulker_box[facing=up]'],
        ['minecraft:light_gray_shulker_box[facing=north]', 'minecraft:silver_shulker_box[facing=north]'],
        ['minecraft:light_gray_shulker_box[facing=south]', 'minecraft:silver_shulker_box[facing=south]'],
        ['minecraft:light_gray_shulker_box[facing=west]', 'minecraft:silver_shulker_box[facing=west]'],
        ['minecraft:light_gray_shulker_box[facing=east]', 'minecraft:silver_shulker_box[facing=east]'],
        ['minecraft:cyan_shulker_box[facing=down]', 'minecraft:cyan_shulker_box[facing=down]'],
        ['minecraft:cyan_shulker_box[facing=up]', 'minecraft:cyan_shulker_box[facing=up]'],
        ['minecraft:cyan_shulker_box[facing=north]', 'minecraft:cyan_shulker_box[facing=north]'],
        ['minecraft:cyan_shulker_box[facing=south]', 'minecraft:cyan_shulker_box[facing=south]'],
        ['minecraft:cyan_shulker_box[facing=west]', 'minecraft:cyan_shulker_box[facing=west]'],
        ['minecraft:cyan_shulker_box[facing=east]', 'minecraft:cyan_shulker_box[facing=east]'],
        ['minecraft:purple_shulker_box[facing=down]', 'minecraft:purple_shulker_box[facing=down]'],
        ['minecraft:purple_shulker_box[facing=up]', 'minecraft:purple_shulker_box[facing=up]'],
        ['minecraft:purple_shulker_box[facing=north]', 'minecraft:purple_shulker_box[facing=north]'],
        ['minecraft:purple_shulker_box[facing=south]', 'minecraft:purple_shulker_box[facing=south]'],
        ['minecraft:purple_shulker_box[facing=west]', 'minecraft:purple_shulker_box[facing=west]'],
        ['minecraft:purple_shulker_box[facing=east]', 'minecraft:purple_shulker_box[facing=east]'],
        ['minecraft:blue_shulker_box[facing=down]', 'minecraft:blue_shulker_box[facing=down]'],
        ['minecraft:blue_shulker_box[facing=up]', 'minecraft:blue_shulker_box[facing=up]'],
        ['minecraft:blue_shulker_box[facing=north]', 'minecraft:blue_shulker_box[facing=north]'],
        ['minecraft:blue_shulker_box[facing=south]', 'minecraft:blue_shulker_box[facing=south]'],
        ['minecraft:blue_shulker_box[facing=west]', 'minecraft:blue_shulker_box[facing=west]'],
        ['minecraft:blue_shulker_box[facing=east]', 'minecraft:blue_shulker_box[facing=east]'],
        ['minecraft:brown_shulker_box[facing=down]', 'minecraft:brown_shulker_box[facing=down]'],
        ['minecraft:brown_shulker_box[facing=up]', 'minecraft:brown_shulker_box[facing=up]'],
        ['minecraft:brown_shulker_box[facing=north]', 'minecraft:brown_shulker_box[facing=north]'],
        ['minecraft:brown_shulker_box[facing=south]', 'minecraft:brown_shulker_box[facing=south]'],
        ['minecraft:brown_shulker_box[facing=west]', 'minecraft:brown_shulker_box[facing=west]'],
        ['minecraft:brown_shulker_box[facing=east]', 'minecraft:brown_shulker_box[facing=east]'],
        ['minecraft:green_shulker_box[facing=down]', 'minecraft:green_shulker_box[facing=down]'],
        ['minecraft:green_shulker_box[facing=up]', 'minecraft:green_shulker_box[facing=up]'],
        ['minecraft:green_shulker_box[facing=north]', 'minecraft:green_shulker_box[facing=north]'],
        ['minecraft:green_shulker_box[facing=south]', 'minecraft:green_shulker_box[facing=south]'],
        ['minecraft:green_shulker_box[facing=west]', 'minecraft:green_shulker_box[facing=west]'],
        ['minecraft:green_shulker_box[facing=east]', 'minecraft:green_shulker_box[facing=east]'],
        ['minecraft:red_shulker_box[facing=down]', 'minecraft:red_shulker_box[facing=down]'],
        ['minecraft:red_shulker_box[facing=up]', 'minecraft:red_shulker_box[facing=up]'],
        ['minecraft:red_shulker_box[facing=north]', 'minecraft:red_shulker_box[facing=north]'],
        ['minecraft:red_shulker_box[facing=south]', 'minecraft:red_shulker_box[facing=south]'],
        ['minecraft:red_shulker_box[facing=west]', 'minecraft:red_shulker_box[facing=west]'],
        ['minecraft:red_shulker_box[facing=east]', 'minecraft:red_shulker_box[facing=east]'],
        ['minecraft:black_shulker_box[facing=down]', 'minecraft:black_shulker_box[facing=down]'],
        ['minecraft:black_shulker_box[facing=up]', 'minecraft:black_shulker_box[facing=up]'],
        ['minecraft:black_shulker_box[facing=north]', 'minecraft:black_shulker_box[facing=north]'],
        ['minecraft:black_shulker_box[facing=south]', 'minecraft:black_shulker_box[facing=south]'],
        ['minecraft:black_shulker_box[facing=west]', 'minecraft:black_shulker_box[facing=west]'],
        ['minecraft:black_shulker_box[facing=east]', 'minecraft:black_shulker_box[facing=east]'],
        ['minecraft:white_glazed_terracotta[facing=south]', 'minecraft:white_glazed_terracotta[facing=south]'],
        ['minecraft:white_glazed_terracotta[facing=west]', 'minecraft:white_glazed_terracotta[facing=west]'],
        ['minecraft:white_glazed_terracotta[facing=north]', 'minecraft:white_glazed_terracotta[facing=north]'],
        ['minecraft:white_glazed_terracotta[facing=east]', 'minecraft:white_glazed_terracotta[facing=east]'],
        ['minecraft:orange_glazed_terracotta[facing=south]', 'minecraft:orange_glazed_terracotta[facing=south]'],
        ['minecraft:orange_glazed_terracotta[facing=west]', 'minecraft:orange_glazed_terracotta[facing=west]'],
        ['minecraft:orange_glazed_terracotta[facing=north]', 'minecraft:orange_glazed_terracotta[facing=north]'],
        ['minecraft:orange_glazed_terracotta[facing=east]', 'minecraft:orange_glazed_terracotta[facing=east]'],
        ['minecraft:magenta_glazed_terracotta[facing=south]', 'minecraft:magenta_glazed_terracotta[facing=south]'],
        ['minecraft:magenta_glazed_terracotta[facing=west]', 'minecraft:magenta_glazed_terracotta[facing=west]'],
        ['minecraft:magenta_glazed_terracotta[facing=north]', 'minecraft:magenta_glazed_terracotta[facing=north]'],
        ['minecraft:magenta_glazed_terracotta[facing=east]', 'minecraft:magenta_glazed_terracotta[facing=east]'],
        [
            'minecraft:light_blue_glazed_terracotta[facing=south]',
            'minecraft:light_blue_glazed_terracotta[facing=south]'
        ],
        ['minecraft:light_blue_glazed_terracotta[facing=west]', 'minecraft:light_blue_glazed_terracotta[facing=west]'],
        [
            'minecraft:light_blue_glazed_terracotta[facing=north]',
            'minecraft:light_blue_glazed_terracotta[facing=north]'
        ],
        ['minecraft:light_blue_glazed_terracotta[facing=east]', 'minecraft:light_blue_glazed_terracotta[facing=east]'],
        ['minecraft:yellow_glazed_terracotta[facing=south]', 'minecraft:yellow_glazed_terracotta[facing=south]'],
        ['minecraft:yellow_glazed_terracotta[facing=west]', 'minecraft:yellow_glazed_terracotta[facing=west]'],
        ['minecraft:yellow_glazed_terracotta[facing=north]', 'minecraft:yellow_glazed_terracotta[facing=north]'],
        ['minecraft:yellow_glazed_terracotta[facing=east]', 'minecraft:yellow_glazed_terracotta[facing=east]'],
        ['minecraft:lime_glazed_terracotta[facing=south]', 'minecraft:lime_glazed_terracotta[facing=south]'],
        ['minecraft:lime_glazed_terracotta[facing=west]', 'minecraft:lime_glazed_terracotta[facing=west]'],
        ['minecraft:lime_glazed_terracotta[facing=north]', 'minecraft:lime_glazed_terracotta[facing=north]'],
        ['minecraft:lime_glazed_terracotta[facing=east]', 'minecraft:lime_glazed_terracotta[facing=east]'],
        ['minecraft:pink_glazed_terracotta[facing=south]', 'minecraft:pink_glazed_terracotta[facing=south]'],
        ['minecraft:pink_glazed_terracotta[facing=west]', 'minecraft:pink_glazed_terracotta[facing=west]'],
        ['minecraft:pink_glazed_terracotta[facing=north]', 'minecraft:pink_glazed_terracotta[facing=north]'],
        ['minecraft:pink_glazed_terracotta[facing=east]', 'minecraft:pink_glazed_terracotta[facing=east]'],
        ['minecraft:gray_glazed_terracotta[facing=south]', 'minecraft:gray_glazed_terracotta[facing=south]'],
        ['minecraft:gray_glazed_terracotta[facing=west]', 'minecraft:gray_glazed_terracotta[facing=west]'],
        ['minecraft:gray_glazed_terracotta[facing=north]', 'minecraft:gray_glazed_terracotta[facing=north]'],
        ['minecraft:gray_glazed_terracotta[facing=east]', 'minecraft:gray_glazed_terracotta[facing=east]'],
        ['minecraft:light_gray_glazed_terracotta[facing=south]', 'minecraft:silver_glazed_terracotta[facing=south]'],
        ['minecraft:light_gray_glazed_terracotta[facing=west]', 'minecraft:silver_glazed_terracotta[facing=west]'],
        ['minecraft:light_gray_glazed_terracotta[facing=north]', 'minecraft:silver_glazed_terracotta[facing=north]'],
        ['minecraft:light_gray_glazed_terracotta[facing=east]', 'minecraft:silver_glazed_terracotta[facing=east]'],
        ['minecraft:cyan_glazed_terracotta[facing=south]', 'minecraft:cyan_glazed_terracotta[facing=south]'],
        ['minecraft:cyan_glazed_terracotta[facing=west]', 'minecraft:cyan_glazed_terracotta[facing=west]'],
        ['minecraft:cyan_glazed_terracotta[facing=north]', 'minecraft:cyan_glazed_terracotta[facing=north]'],
        ['minecraft:cyan_glazed_terracotta[facing=east]', 'minecraft:cyan_glazed_terracotta[facing=east]'],
        ['minecraft:purple_glazed_terracotta[facing=south]', 'minecraft:purple_glazed_terracotta[facing=south]'],
        ['minecraft:purple_glazed_terracotta[facing=west]', 'minecraft:purple_glazed_terracotta[facing=west]'],
        ['minecraft:purple_glazed_terracotta[facing=north]', 'minecraft:purple_glazed_terracotta[facing=north]'],
        ['minecraft:purple_glazed_terracotta[facing=east]', 'minecraft:purple_glazed_terracotta[facing=east]'],
        ['minecraft:blue_glazed_terracotta[facing=south]', 'minecraft:blue_glazed_terracotta[facing=south]'],
        ['minecraft:blue_glazed_terracotta[facing=west]', 'minecraft:blue_glazed_terracotta[facing=west]'],
        ['minecraft:blue_glazed_terracotta[facing=north]', 'minecraft:blue_glazed_terracotta[facing=north]'],
        ['minecraft:blue_glazed_terracotta[facing=east]', 'minecraft:blue_glazed_terracotta[facing=east]'],
        ['minecraft:brown_glazed_terracotta[facing=south]', 'minecraft:brown_glazed_terracotta[facing=south]'],
        ['minecraft:brown_glazed_terracotta[facing=west]', 'minecraft:brown_glazed_terracotta[facing=west]'],
        ['minecraft:brown_glazed_terracotta[facing=north]', 'minecraft:brown_glazed_terracotta[facing=north]'],
        ['minecraft:brown_glazed_terracotta[facing=east]', 'minecraft:brown_glazed_terracotta[facing=east]'],
        ['minecraft:green_glazed_terracotta[facing=south]', 'minecraft:green_glazed_terracotta[facing=south]'],
        ['minecraft:green_glazed_terracotta[facing=west]', 'minecraft:green_glazed_terracotta[facing=west]'],
        ['minecraft:green_glazed_terracotta[facing=north]', 'minecraft:green_glazed_terracotta[facing=north]'],
        ['minecraft:green_glazed_terracotta[facing=east]', 'minecraft:green_glazed_terracotta[facing=east]'],
        ['minecraft:red_glazed_terracotta[facing=south]', 'minecraft:red_glazed_terracotta[facing=south]'],
        ['minecraft:red_glazed_terracotta[facing=west]', 'minecraft:red_glazed_terracotta[facing=west]'],
        ['minecraft:red_glazed_terracotta[facing=north]', 'minecraft:red_glazed_terracotta[facing=north]'],
        ['minecraft:red_glazed_terracotta[facing=east]', 'minecraft:red_glazed_terracotta[facing=east]'],
        ['minecraft:black_glazed_terracotta[facing=south]', 'minecraft:black_glazed_terracotta[facing=south]'],
        ['minecraft:black_glazed_terracotta[facing=west]', 'minecraft:black_glazed_terracotta[facing=west]'],
        ['minecraft:black_glazed_terracotta[facing=north]', 'minecraft:black_glazed_terracotta[facing=north]'],
        ['minecraft:black_glazed_terracotta[facing=east]', 'minecraft:black_glazed_terracotta[facing=east]'],
        ['minecraft:white_concrete', 'minecraft:concrete[color=white]'],
        ['minecraft:orange_concrete', 'minecraft:concrete[color=orange]'],
        ['minecraft:magenta_concrete', 'minecraft:concrete[color=magenta]'],
        ['minecraft:light_blue_concrete', 'minecraft:concrete[color=light_blue]'],
        ['minecraft:yellow_concrete', 'minecraft:concrete[color=yellow]'],
        ['minecraft:lime_concrete', 'minecraft:concrete[color=lime]'],
        ['minecraft:pink_concrete', 'minecraft:concrete[color=pink]'],
        ['minecraft:gray_concrete', 'minecraft:concrete[color=gray]'],
        ['minecraft:light_gray_concrete', 'minecraft:concrete[color=silver]'],
        ['minecraft:cyan_concrete', 'minecraft:concrete[color=cyan]'],
        ['minecraft:purple_concrete', 'minecraft:concrete[color=purple]'],
        ['minecraft:blue_concrete', 'minecraft:concrete[color=blue]'],
        ['minecraft:brown_concrete', 'minecraft:concrete[color=brown]'],
        ['minecraft:green_concrete', 'minecraft:concrete[color=green]'],
        ['minecraft:red_concrete', 'minecraft:concrete[color=red]'],
        ['minecraft:black_concrete', 'minecraft:concrete[color=black]'],
        ['minecraft:white_concrete_powder', 'minecraft:concrete_powder[color=white]'],
        ['minecraft:orange_concrete_powder', 'minecraft:concrete_powder[color=orange]'],
        ['minecraft:magenta_concrete_powder', 'minecraft:concrete_powder[color=magenta]'],
        ['minecraft:light_blue_concrete_powder', 'minecraft:concrete_powder[color=light_blue]'],
        ['minecraft:yellow_concrete_powder', 'minecraft:concrete_powder[color=yellow]'],
        ['minecraft:lime_concrete_powder', 'minecraft:concrete_powder[color=lime]'],
        ['minecraft:pink_concrete_powder', 'minecraft:concrete_powder[color=pink]'],
        ['minecraft:gray_concrete_powder', 'minecraft:concrete_powder[color=gray]'],
        ['minecraft:light_gray_concrete_powder', 'minecraft:concrete_powder[color=silver]'],
        ['minecraft:cyan_concrete_powder', 'minecraft:concrete_powder[color=cyan]'],
        ['minecraft:purple_concrete_powder', 'minecraft:concrete_powder[color=purple]'],
        ['minecraft:blue_concrete_powder', 'minecraft:concrete_powder[color=blue]'],
        ['minecraft:brown_concrete_powder', 'minecraft:concrete_powder[color=brown]'],
        ['minecraft:green_concrete_powder', 'minecraft:concrete_powder[color=green]'],
        ['minecraft:red_concrete_powder', 'minecraft:concrete_powder[color=red]'],
        ['minecraft:black_concrete_powder', 'minecraft:concrete_powder[color=black]'],
        ['minecraft:structure_block[mode=save]', 'minecraft:structure_block[mode=save]'],
        ['minecraft:structure_block[mode=load]', 'minecraft:structure_block[mode=load]'],
        ['minecraft:structure_block[mode=corner]', 'minecraft:structure_block[mode=corner]'],
        ['minecraft:structure_block[mode=data]', 'minecraft:structure_block[mode=data]']
    ]

    /**
     * Thank MCEdit: https://github.com/mcedit/mcedit2/blob/master/src/mceditlib/blocktypes/idmapping_raw_1_12.json
     * Thank pca for introducing it to me.
     */
    public static ID_Data_Name_States: Number_Number_String_StringArray[] = [
        [0, 0, 'minecraft:air', []],
        [1, 0, 'minecraft:stone', ['variant=stone']],
        [1, 1, 'minecraft:stone', ['variant=granite']],
        [1, 2, 'minecraft:stone', ['variant=smooth_granite']],
        [1, 3, 'minecraft:stone', ['variant=diorite']],
        [1, 4, 'minecraft:stone', ['variant=smooth_diorite']],
        [1, 5, 'minecraft:stone', ['variant=andesite']],
        [1, 6, 'minecraft:stone', ['variant=smooth_andesite']],
        [2, 0, 'minecraft:grass', ['snowy=false']],
        [3, 0, 'minecraft:dirt', ['snowy=false', 'variant=dirt']],
        [3, 1, 'minecraft:dirt', ['snowy=false', 'variant=coarse_dirt']],
        [3, 2, 'minecraft:dirt', ['snowy=false', 'variant=podzol']],
        [4, 0, 'minecraft:cobblestone', []],
        [5, 0, 'minecraft:planks', ['variant=oak']],
        [5, 1, 'minecraft:planks', ['variant=spruce']],
        [5, 2, 'minecraft:planks', ['variant=birch']],
        [5, 3, 'minecraft:planks', ['variant=jungle']],
        [5, 4, 'minecraft:planks', ['variant=acacia']],
        [5, 5, 'minecraft:planks', ['variant=dark_oak']],
        [6, 0, 'minecraft:sapling', ['stage=0', 'type=oak']],
        [6, 1, 'minecraft:sapling', ['stage=0', 'type=spruce']],
        [6, 2, 'minecraft:sapling', ['stage=0', 'type=birch']],
        [6, 3, 'minecraft:sapling', ['stage=0', 'type=jungle']],
        [6, 4, 'minecraft:sapling', ['stage=0', 'type=acacia']],
        [6, 5, 'minecraft:sapling', ['stage=0', 'type=dark_oak']],
        [6, 8, 'minecraft:sapling', ['stage=1', 'type=oak']],
        [6, 9, 'minecraft:sapling', ['stage=1', 'type=spruce']],
        [6, 10, 'minecraft:sapling', ['stage=1', 'type=birch']],
        [6, 11, 'minecraft:sapling', ['stage=1', 'type=jungle']],
        [6, 12, 'minecraft:sapling', ['stage=1', 'type=acacia']],
        [6, 13, 'minecraft:sapling', ['stage=1', 'type=dark_oak']],
        [7, 0, 'minecraft:bedrock', []],
        [8, 0, 'minecraft:flowing_water', ['level=0']],
        [8, 1, 'minecraft:flowing_water', ['level=1']],
        [8, 2, 'minecraft:flowing_water', ['level=2']],
        [8, 3, 'minecraft:flowing_water', ['level=3']],
        [8, 4, 'minecraft:flowing_water', ['level=4']],
        [8, 5, 'minecraft:flowing_water', ['level=5']],
        [8, 6, 'minecraft:flowing_water', ['level=6']],
        [8, 7, 'minecraft:flowing_water', ['level=7']],
        [8, 8, 'minecraft:flowing_water', ['level=8']],
        [8, 9, 'minecraft:flowing_water', ['level=9']],
        [8, 10, 'minecraft:flowing_water', ['level=10']],
        [8, 11, 'minecraft:flowing_water', ['level=11']],
        [8, 12, 'minecraft:flowing_water', ['level=12']],
        [8, 13, 'minecraft:flowing_water', ['level=13']],
        [8, 14, 'minecraft:flowing_water', ['level=14']],
        [8, 15, 'minecraft:flowing_water', ['level=15']],
        [9, 0, 'minecraft:water', ['level=0']],
        [9, 1, 'minecraft:water', ['level=1']],
        [9, 2, 'minecraft:water', ['level=2']],
        [9, 3, 'minecraft:water', ['level=3']],
        [9, 4, 'minecraft:water', ['level=4']],
        [9, 5, 'minecraft:water', ['level=5']],
        [9, 6, 'minecraft:water', ['level=6']],
        [9, 7, 'minecraft:water', ['level=7']],
        [9, 8, 'minecraft:water', ['level=8']],
        [9, 9, 'minecraft:water', ['level=9']],
        [9, 10, 'minecraft:water', ['level=10']],
        [9, 11, 'minecraft:water', ['level=11']],
        [9, 12, 'minecraft:water', ['level=12']],
        [9, 13, 'minecraft:water', ['level=13']],
        [9, 14, 'minecraft:water', ['level=14']],
        [9, 15, 'minecraft:water', ['level=15']],
        [10, 0, 'minecraft:flowing_lava', ['level=0']],
        [10, 1, 'minecraft:flowing_lava', ['level=1']],
        [10, 2, 'minecraft:flowing_lava', ['level=2']],
        [10, 3, 'minecraft:flowing_lava', ['level=3']],
        [10, 4, 'minecraft:flowing_lava', ['level=4']],
        [10, 5, 'minecraft:flowing_lava', ['level=5']],
        [10, 6, 'minecraft:flowing_lava', ['level=6']],
        [10, 7, 'minecraft:flowing_lava', ['level=7']],
        [10, 8, 'minecraft:flowing_lava', ['level=8']],
        [10, 9, 'minecraft:flowing_lava', ['level=9']],
        [10, 10, 'minecraft:flowing_lava', ['level=10']],
        [10, 11, 'minecraft:flowing_lava', ['level=11']],
        [10, 12, 'minecraft:flowing_lava', ['level=12']],
        [10, 13, 'minecraft:flowing_lava', ['level=13']],
        [10, 14, 'minecraft:flowing_lava', ['level=14']],
        [10, 15, 'minecraft:flowing_lava', ['level=15']],
        [11, 0, 'minecraft:lava', ['level=0']],
        [11, 1, 'minecraft:lava', ['level=1']],
        [11, 2, 'minecraft:lava', ['level=2']],
        [11, 3, 'minecraft:lava', ['level=3']],
        [11, 4, 'minecraft:lava', ['level=4']],
        [11, 5, 'minecraft:lava', ['level=5']],
        [11, 6, 'minecraft:lava', ['level=6']],
        [11, 7, 'minecraft:lava', ['level=7']],
        [11, 8, 'minecraft:lava', ['level=8']],
        [11, 9, 'minecraft:lava', ['level=9']],
        [11, 10, 'minecraft:lava', ['level=10']],
        [11, 11, 'minecraft:lava', ['level=11']],
        [11, 12, 'minecraft:lava', ['level=12']],
        [11, 13, 'minecraft:lava', ['level=13']],
        [11, 14, 'minecraft:lava', ['level=14']],
        [11, 15, 'minecraft:lava', ['level=15']],
        [12, 0, 'minecraft:sand', ['variant=sand']],
        [12, 1, 'minecraft:sand', ['variant=red_sand']],
        [13, 0, 'minecraft:gravel', []],
        [14, 0, 'minecraft:gold_ore', []],
        [15, 0, 'minecraft:iron_ore', []],
        [16, 0, 'minecraft:coal_ore', []],
        [17, 0, 'minecraft:log', ['axis=y', 'variant=oak']],
        [17, 1, 'minecraft:log', ['axis=y', 'variant=spruce']],
        [17, 2, 'minecraft:log', ['axis=y', 'variant=birch']],
        [17, 3, 'minecraft:log', ['axis=y', 'variant=jungle']],
        [17, 4, 'minecraft:log', ['axis=x', 'variant=oak']],
        [17, 5, 'minecraft:log', ['axis=x', 'variant=spruce']],
        [17, 6, 'minecraft:log', ['axis=x', 'variant=birch']],
        [17, 7, 'minecraft:log', ['axis=x', 'variant=jungle']],
        [17, 8, 'minecraft:log', ['axis=z', 'variant=oak']],
        [17, 9, 'minecraft:log', ['axis=z', 'variant=spruce']],
        [17, 10, 'minecraft:log', ['axis=z', 'variant=birch']],
        [17, 11, 'minecraft:log', ['axis=z', 'variant=jungle']],
        [17, 12, 'minecraft:log', ['axis=none', 'variant=oak']],
        [17, 13, 'minecraft:log', ['axis=none', 'variant=spruce']],
        [17, 14, 'minecraft:log', ['axis=none', 'variant=birch']],
        [17, 15, 'minecraft:log', ['axis=none', 'variant=jungle']],
        [18, 0, 'minecraft:leaves', ['check_decay=false', 'decayable=true', 'variant=oak']],
        [18, 1, 'minecraft:leaves', ['check_decay=false', 'decayable=true', 'variant=spruce']],
        [18, 2, 'minecraft:leaves', ['check_decay=false', 'decayable=true', 'variant=birch']],
        [18, 3, 'minecraft:leaves', ['check_decay=false', 'decayable=true', 'variant=jungle']],
        [18, 4, 'minecraft:leaves', ['check_decay=false', 'decayable=false', 'variant=oak']],
        [18, 5, 'minecraft:leaves', ['check_decay=false', 'decayable=false', 'variant=spruce']],
        [18, 6, 'minecraft:leaves', ['check_decay=false', 'decayable=false', 'variant=birch']],
        [18, 7, 'minecraft:leaves', ['check_decay=false', 'decayable=false', 'variant=jungle']],
        [18, 8, 'minecraft:leaves', ['check_decay=true', 'decayable=true', 'variant=oak']],
        [18, 9, 'minecraft:leaves', ['check_decay=true', 'decayable=true', 'variant=spruce']],
        [18, 10, 'minecraft:leaves', ['check_decay=true', 'decayable=true', 'variant=birch']],
        [18, 11, 'minecraft:leaves', ['check_decay=true', 'decayable=true', 'variant=jungle']],
        [18, 12, 'minecraft:leaves', ['check_decay=true', 'decayable=false', 'variant=oak']],
        [18, 13, 'minecraft:leaves', ['check_decay=true', 'decayable=false', 'variant=spruce']],
        [18, 14, 'minecraft:leaves', ['check_decay=true', 'decayable=false', 'variant=birch']],
        [18, 15, 'minecraft:leaves', ['check_decay=true', 'decayable=false', 'variant=jungle']],
        [19, 0, 'minecraft:sponge', ['wet=false']],
        [19, 1, 'minecraft:sponge', ['wet=true']],
        [20, 0, 'minecraft:glass', []],
        [21, 0, 'minecraft:lapis_ore', []],
        [22, 0, 'minecraft:lapis_block', []],
        [23, 0, 'minecraft:dispenser', ['facing=down', 'triggered=false']],
        [23, 1, 'minecraft:dispenser', ['facing=up', 'triggered=false']],
        [23, 2, 'minecraft:dispenser', ['facing=north', 'triggered=false']],
        [23, 3, 'minecraft:dispenser', ['facing=south', 'triggered=false']],
        [23, 4, 'minecraft:dispenser', ['facing=west', 'triggered=false']],
        [23, 5, 'minecraft:dispenser', ['facing=east', 'triggered=false']],
        [23, 8, 'minecraft:dispenser', ['facing=down', 'triggered=true']],
        [23, 9, 'minecraft:dispenser', ['facing=up', 'triggered=true']],
        [23, 10, 'minecraft:dispenser', ['facing=north', 'triggered=true']],
        [23, 11, 'minecraft:dispenser', ['facing=south', 'triggered=true']],
        [23, 12, 'minecraft:dispenser', ['facing=west', 'triggered=true']],
        [23, 13, 'minecraft:dispenser', ['facing=east', 'triggered=true']],
        [24, 0, 'minecraft:sandstone', ['type=sandstone']],
        [24, 1, 'minecraft:sandstone', ['type=chiseled_sandstone']],
        [24, 2, 'minecraft:sandstone', ['type=smooth_sandstone']],
        [25, 0, 'minecraft:noteblock', []],
        [26, 0, 'minecraft:bed', ['facing=south', 'occupied=false', 'part=foot']],
        [26, 1, 'minecraft:bed', ['facing=west', 'occupied=false', 'part=foot']],
        [26, 2, 'minecraft:bed', ['facing=north', 'occupied=false', 'part=foot']],
        [26, 3, 'minecraft:bed', ['facing=east', 'occupied=false', 'part=foot']],
        [26, 8, 'minecraft:bed', ['facing=south', 'occupied=false', 'part=head']],
        [26, 9, 'minecraft:bed', ['facing=west', 'occupied=false', 'part=head']],
        [26, 10, 'minecraft:bed', ['facing=north', 'occupied=false', 'part=head']],
        [26, 11, 'minecraft:bed', ['facing=east', 'occupied=false', 'part=head']],
        [26, 12, 'minecraft:bed', ['facing=south', 'occupied=true', 'part=head']],
        [26, 13, 'minecraft:bed', ['facing=west', 'occupied=true', 'part=head']],
        [26, 14, 'minecraft:bed', ['facing=north', 'occupied=true', 'part=head']],
        [26, 15, 'minecraft:bed', ['facing=east', 'occupied=true', 'part=head']],
        [27, 0, 'minecraft:golden_rail', ['powered=false', 'shape=north_south']],
        [27, 1, 'minecraft:golden_rail', ['powered=false', 'shape=east_west']],
        [27, 2, 'minecraft:golden_rail', ['powered=false', 'shape=ascending_east']],
        [27, 3, 'minecraft:golden_rail', ['powered=false', 'shape=ascending_west']],
        [27, 4, 'minecraft:golden_rail', ['powered=false', 'shape=ascending_north']],
        [27, 5, 'minecraft:golden_rail', ['powered=false', 'shape=ascending_south']],
        [27, 8, 'minecraft:golden_rail', ['powered=true', 'shape=north_south']],
        [27, 9, 'minecraft:golden_rail', ['powered=true', 'shape=east_west']],
        [27, 10, 'minecraft:golden_rail', ['powered=true', 'shape=ascending_east']],
        [27, 11, 'minecraft:golden_rail', ['powered=true', 'shape=ascending_west']],
        [27, 12, 'minecraft:golden_rail', ['powered=true', 'shape=ascending_north']],
        [27, 13, 'minecraft:golden_rail', ['powered=true', 'shape=ascending_south']],
        [28, 0, 'minecraft:detector_rail', ['powered=false', 'shape=north_south']],
        [28, 1, 'minecraft:detector_rail', ['powered=false', 'shape=east_west']],
        [28, 2, 'minecraft:detector_rail', ['powered=false', 'shape=ascending_east']],
        [28, 3, 'minecraft:detector_rail', ['powered=false', 'shape=ascending_west']],
        [28, 4, 'minecraft:detector_rail', ['powered=false', 'shape=ascending_north']],
        [28, 5, 'minecraft:detector_rail', ['powered=false', 'shape=ascending_south']],
        [28, 8, 'minecraft:detector_rail', ['powered=true', 'shape=north_south']],
        [28, 9, 'minecraft:detector_rail', ['powered=true', 'shape=east_west']],
        [28, 10, 'minecraft:detector_rail', ['powered=true', 'shape=ascending_east']],
        [28, 11, 'minecraft:detector_rail', ['powered=true', 'shape=ascending_west']],
        [28, 12, 'minecraft:detector_rail', ['powered=true', 'shape=ascending_north']],
        [28, 13, 'minecraft:detector_rail', ['powered=true', 'shape=ascending_south']],
        [29, 0, 'minecraft:sticky_piston', ['extended=false', 'facing=down']],
        [29, 1, 'minecraft:sticky_piston', ['extended=false', 'facing=up']],
        [29, 2, 'minecraft:sticky_piston', ['extended=false', 'facing=north']],
        [29, 3, 'minecraft:sticky_piston', ['extended=false', 'facing=south']],
        [29, 4, 'minecraft:sticky_piston', ['extended=false', 'facing=west']],
        [29, 5, 'minecraft:sticky_piston', ['extended=false', 'facing=east']],
        [29, 8, 'minecraft:sticky_piston', ['extended=true', 'facing=down']],
        [29, 9, 'minecraft:sticky_piston', ['extended=true', 'facing=up']],
        [29, 10, 'minecraft:sticky_piston', ['extended=true', 'facing=north']],
        [29, 11, 'minecraft:sticky_piston', ['extended=true', 'facing=south']],
        [29, 12, 'minecraft:sticky_piston', ['extended=true', 'facing=west']],
        [29, 13, 'minecraft:sticky_piston', ['extended=true', 'facing=east']],
        [30, 0, 'minecraft:web', []],
        [31, 0, 'minecraft:tallgrass', ['type=dead_bush']],
        [31, 1, 'minecraft:tallgrass', ['type=tall_grass']],
        [31, 2, 'minecraft:tallgrass', ['type=fern']],
        [32, 0, 'minecraft:deadbush', []],
        [33, 0, 'minecraft:piston', ['extended=false', 'facing=down']],
        [33, 1, 'minecraft:piston', ['extended=false', 'facing=up']],
        [33, 2, 'minecraft:piston', ['extended=false', 'facing=north']],
        [33, 3, 'minecraft:piston', ['extended=false', 'facing=south']],
        [33, 4, 'minecraft:piston', ['extended=false', 'facing=west']],
        [33, 5, 'minecraft:piston', ['extended=false', 'facing=east']],
        [33, 8, 'minecraft:piston', ['extended=true', 'facing=down']],
        [33, 9, 'minecraft:piston', ['extended=true', 'facing=up']],
        [33, 10, 'minecraft:piston', ['extended=true', 'facing=north']],
        [33, 11, 'minecraft:piston', ['extended=true', 'facing=south']],
        [33, 12, 'minecraft:piston', ['extended=true', 'facing=west']],
        [33, 13, 'minecraft:piston', ['extended=true', 'facing=east']],
        [34, 0, 'minecraft:piston_head', ['facing=down', 'short=false', 'type=normal']],
        [34, 1, 'minecraft:piston_head', ['facing=up', 'short=false', 'type=normal']],
        [34, 2, 'minecraft:piston_head', ['facing=north', 'short=false', 'type=normal']],
        [34, 3, 'minecraft:piston_head', ['facing=south', 'short=false', 'type=normal']],
        [34, 4, 'minecraft:piston_head', ['facing=west', 'short=false', 'type=normal']],
        [34, 5, 'minecraft:piston_head', ['facing=east', 'short=false', 'type=normal']],
        [34, 8, 'minecraft:piston_head', ['facing=down', 'short=false', 'type=sticky']],
        [34, 9, 'minecraft:piston_head', ['facing=up', 'short=false', 'type=sticky']],
        [34, 10, 'minecraft:piston_head', ['facing=north', 'short=false', 'type=sticky']],
        [34, 11, 'minecraft:piston_head', ['facing=south', 'short=false', 'type=sticky']],
        [34, 12, 'minecraft:piston_head', ['facing=west', 'short=false', 'type=sticky']],
        [34, 13, 'minecraft:piston_head', ['facing=east', 'short=false', 'type=sticky']],
        [35, 0, 'minecraft:wool', ['color=white']],
        [35, 1, 'minecraft:wool', ['color=orange']],
        [35, 2, 'minecraft:wool', ['color=magenta']],
        [35, 3, 'minecraft:wool', ['color=light_blue']],
        [35, 4, 'minecraft:wool', ['color=yellow']],
        [35, 5, 'minecraft:wool', ['color=lime']],
        [35, 6, 'minecraft:wool', ['color=pink']],
        [35, 7, 'minecraft:wool', ['color=gray']],
        [35, 8, 'minecraft:wool', ['color=silver']],
        [35, 9, 'minecraft:wool', ['color=cyan']],
        [35, 10, 'minecraft:wool', ['color=purple']],
        [35, 11, 'minecraft:wool', ['color=blue']],
        [35, 12, 'minecraft:wool', ['color=brown']],
        [35, 13, 'minecraft:wool', ['color=green']],
        [35, 14, 'minecraft:wool', ['color=red']],
        [35, 15, 'minecraft:wool', ['color=black']],
        [36, 0, 'minecraft:piston_extension', ['facing=down', 'type=normal']],
        [36, 1, 'minecraft:piston_extension', ['facing=up', 'type=normal']],
        [36, 2, 'minecraft:piston_extension', ['facing=north', 'type=normal']],
        [36, 3, 'minecraft:piston_extension', ['facing=south', 'type=normal']],
        [36, 4, 'minecraft:piston_extension', ['facing=west', 'type=normal']],
        [36, 5, 'minecraft:piston_extension', ['facing=east', 'type=normal']],
        [36, 8, 'minecraft:piston_extension', ['facing=down', 'type=sticky']],
        [36, 9, 'minecraft:piston_extension', ['facing=up', 'type=sticky']],
        [36, 10, 'minecraft:piston_extension', ['facing=north', 'type=sticky']],
        [36, 11, 'minecraft:piston_extension', ['facing=south', 'type=sticky']],
        [36, 12, 'minecraft:piston_extension', ['facing=west', 'type=sticky']],
        [36, 13, 'minecraft:piston_extension', ['facing=east', 'type=sticky']],
        [37, 0, 'minecraft:yellow_flower', ['type=dandelion']],
        [38, 0, 'minecraft:red_flower', ['type=poppy']],
        [38, 1, 'minecraft:red_flower', ['type=blue_orchid']],
        [38, 2, 'minecraft:red_flower', ['type=allium']],
        [38, 3, 'minecraft:red_flower', ['type=houstonia']],
        [38, 4, 'minecraft:red_flower', ['type=red_tulip']],
        [38, 5, 'minecraft:red_flower', ['type=orange_tulip']],
        [38, 6, 'minecraft:red_flower', ['type=white_tulip']],
        [38, 7, 'minecraft:red_flower', ['type=pink_tulip']],
        [38, 8, 'minecraft:red_flower', ['type=oxeye_daisy']],
        [39, 0, 'minecraft:brown_mushroom', []],
        [40, 0, 'minecraft:red_mushroom', []],
        [41, 0, 'minecraft:gold_block', []],
        [42, 0, 'minecraft:iron_block', []],
        [43, 0, 'minecraft:double_stone_slab', ['seamless=false', 'variant=stone']],
        [43, 1, 'minecraft:double_stone_slab', ['seamless=false', 'variant=sandstone']],
        [43, 2, 'minecraft:double_stone_slab', ['seamless=false', 'variant=wood_old']],
        [43, 3, 'minecraft:double_stone_slab', ['seamless=false', 'variant=cobblestone']],
        [43, 4, 'minecraft:double_stone_slab', ['seamless=false', 'variant=brick']],
        [43, 5, 'minecraft:double_stone_slab', ['seamless=false', 'variant=stone_brick']],
        [43, 6, 'minecraft:double_stone_slab', ['seamless=false', 'variant=nether_brick']],
        [43, 7, 'minecraft:double_stone_slab', ['seamless=false', 'variant=quartz']],
        [43, 8, 'minecraft:double_stone_slab', ['seamless=true', 'variant=stone']],
        [43, 9, 'minecraft:double_stone_slab', ['seamless=true', 'variant=sandstone']],
        [43, 10, 'minecraft:double_stone_slab', ['seamless=true', 'variant=wood_old']],
        [43, 11, 'minecraft:double_stone_slab', ['seamless=true', 'variant=cobblestone']],
        [43, 12, 'minecraft:double_stone_slab', ['seamless=true', 'variant=brick']],
        [43, 13, 'minecraft:double_stone_slab', ['seamless=true', 'variant=stone_brick']],
        [43, 14, 'minecraft:double_stone_slab', ['seamless=true', 'variant=nether_brick']],
        [43, 15, 'minecraft:double_stone_slab', ['seamless=true', 'variant=quartz']],
        [44, 0, 'minecraft:stone_slab', ['half=bottom', 'variant=stone']],
        [44, 1, 'minecraft:stone_slab', ['half=bottom', 'variant=sandstone']],
        [44, 2, 'minecraft:stone_slab', ['half=bottom', 'variant=wood_old']],
        [44, 3, 'minecraft:stone_slab', ['half=bottom', 'variant=cobblestone']],
        [44, 4, 'minecraft:stone_slab', ['half=bottom', 'variant=brick']],
        [44, 5, 'minecraft:stone_slab', ['half=bottom', 'variant=stone_brick']],
        [44, 6, 'minecraft:stone_slab', ['half=bottom', 'variant=nether_brick']],
        [44, 7, 'minecraft:stone_slab', ['half=bottom', 'variant=quartz']],
        [44, 8, 'minecraft:stone_slab', ['half=top', 'variant=stone']],
        [44, 9, 'minecraft:stone_slab', ['half=top', 'variant=sandstone']],
        [44, 10, 'minecraft:stone_slab', ['half=top', 'variant=wood_old']],
        [44, 11, 'minecraft:stone_slab', ['half=top', 'variant=cobblestone']],
        [44, 12, 'minecraft:stone_slab', ['half=top', 'variant=brick']],
        [44, 13, 'minecraft:stone_slab', ['half=top', 'variant=stone_brick']],
        [44, 14, 'minecraft:stone_slab', ['half=top', 'variant=nether_brick']],
        [44, 15, 'minecraft:stone_slab', ['half=top', 'variant=quartz']],
        [45, 0, 'minecraft:brick_block', []],
        [46, 0, 'minecraft:tnt', ['explode=false']],
        [46, 1, 'minecraft:tnt', ['explode=true']],
        [47, 0, 'minecraft:bookshelf', []],
        [48, 0, 'minecraft:mossy_cobblestone', []],
        [49, 0, 'minecraft:obsidian', []],
        [50, 0, 'minecraft:torch', ['facing=up']],
        [50, 1, 'minecraft:torch', ['facing=east']],
        [50, 2, 'minecraft:torch', ['facing=west']],
        [50, 3, 'minecraft:torch', ['facing=south']],
        [50, 4, 'minecraft:torch', ['facing=north']],
        [51, 0, 'minecraft:fire', ['age=0', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 1, 'minecraft:fire', ['age=1', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 2, 'minecraft:fire', ['age=2', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 3, 'minecraft:fire', ['age=3', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 4, 'minecraft:fire', ['age=4', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 5, 'minecraft:fire', ['age=5', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 6, 'minecraft:fire', ['age=6', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 7, 'minecraft:fire', ['age=7', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 8, 'minecraft:fire', ['age=8', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 9, 'minecraft:fire', ['age=9', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 10, 'minecraft:fire', ['age=10', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 11, 'minecraft:fire', ['age=11', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 12, 'minecraft:fire', ['age=12', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 13, 'minecraft:fire', ['age=13', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 14, 'minecraft:fire', ['age=14', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [51, 15, 'minecraft:fire', ['age=15', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [52, 0, 'minecraft:mob_spawner', []],
        [53, 0, 'minecraft:oak_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [53, 1, 'minecraft:oak_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [53, 2, 'minecraft:oak_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [53, 3, 'minecraft:oak_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [53, 4, 'minecraft:oak_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [53, 5, 'minecraft:oak_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [53, 6, 'minecraft:oak_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [53, 7, 'minecraft:oak_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [54, 0, 'minecraft:chest', ['facing=north']],
        [54, 3, 'minecraft:chest', ['facing=south']],
        [54, 4, 'minecraft:chest', ['facing=west']],
        [54, 5, 'minecraft:chest', ['facing=east']],
        [55, 0, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=0', 'south=none', 'west=none']],
        [55, 1, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=1', 'south=none', 'west=none']],
        [55, 2, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=2', 'south=none', 'west=none']],
        [55, 3, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=3', 'south=none', 'west=none']],
        [55, 4, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=4', 'south=none', 'west=none']],
        [55, 5, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=5', 'south=none', 'west=none']],
        [55, 6, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=6', 'south=none', 'west=none']],
        [55, 7, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=7', 'south=none', 'west=none']],
        [55, 8, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=8', 'south=none', 'west=none']],
        [55, 9, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=9', 'south=none', 'west=none']],
        [55, 10, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=10', 'south=none', 'west=none']],
        [55, 11, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=11', 'south=none', 'west=none']],
        [55, 12, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=12', 'south=none', 'west=none']],
        [55, 13, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=13', 'south=none', 'west=none']],
        [55, 14, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=14', 'south=none', 'west=none']],
        [55, 15, 'minecraft:redstone_wire', ['east=none', 'north=none', 'power=15', 'south=none', 'west=none']],
        [56, 0, 'minecraft:diamond_ore', []],
        [57, 0, 'minecraft:diamond_block', []],
        [58, 0, 'minecraft:crafting_table', []],
        [59, 0, 'minecraft:wheat', ['age=0']],
        [59, 1, 'minecraft:wheat', ['age=1']],
        [59, 2, 'minecraft:wheat', ['age=2']],
        [59, 3, 'minecraft:wheat', ['age=3']],
        [59, 4, 'minecraft:wheat', ['age=4']],
        [59, 5, 'minecraft:wheat', ['age=5']],
        [59, 6, 'minecraft:wheat', ['age=6']],
        [59, 7, 'minecraft:wheat', ['age=7']],
        [60, 0, 'minecraft:farmland', ['moisture=0']],
        [60, 1, 'minecraft:farmland', ['moisture=1']],
        [60, 2, 'minecraft:farmland', ['moisture=2']],
        [60, 3, 'minecraft:farmland', ['moisture=3']],
        [60, 4, 'minecraft:farmland', ['moisture=4']],
        [60, 5, 'minecraft:farmland', ['moisture=5']],
        [60, 6, 'minecraft:farmland', ['moisture=6']],
        [60, 7, 'minecraft:farmland', ['moisture=7']],
        [61, 0, 'minecraft:furnace', ['facing=north']],
        [61, 3, 'minecraft:furnace', ['facing=south']],
        [61, 4, 'minecraft:furnace', ['facing=west']],
        [61, 5, 'minecraft:furnace', ['facing=east']],
        [62, 0, 'minecraft:lit_furnace', ['facing=north']],
        [62, 3, 'minecraft:lit_furnace', ['facing=south']],
        [62, 4, 'minecraft:lit_furnace', ['facing=west']],
        [62, 5, 'minecraft:lit_furnace', ['facing=east']],
        [63, 0, 'minecraft:standing_sign', ['rotation=0']],
        [63, 1, 'minecraft:standing_sign', ['rotation=1']],
        [63, 2, 'minecraft:standing_sign', ['rotation=2']],
        [63, 3, 'minecraft:standing_sign', ['rotation=3']],
        [63, 4, 'minecraft:standing_sign', ['rotation=4']],
        [63, 5, 'minecraft:standing_sign', ['rotation=5']],
        [63, 6, 'minecraft:standing_sign', ['rotation=6']],
        [63, 7, 'minecraft:standing_sign', ['rotation=7']],
        [63, 8, 'minecraft:standing_sign', ['rotation=8']],
        [63, 9, 'minecraft:standing_sign', ['rotation=9']],
        [63, 10, 'minecraft:standing_sign', ['rotation=10']],
        [63, 11, 'minecraft:standing_sign', ['rotation=11']],
        [63, 12, 'minecraft:standing_sign', ['rotation=12']],
        [63, 13, 'minecraft:standing_sign', ['rotation=13']],
        [63, 14, 'minecraft:standing_sign', ['rotation=14']],
        [63, 15, 'minecraft:standing_sign', ['rotation=15']],
        [64, 0, 'minecraft:wooden_door', ['facing=east', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [64, 1, 'minecraft:wooden_door', ['facing=south', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [64, 2, 'minecraft:wooden_door', ['facing=west', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [64, 3, 'minecraft:wooden_door', ['facing=north', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [64, 4, 'minecraft:wooden_door', ['facing=east', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [64, 5, 'minecraft:wooden_door', ['facing=south', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [64, 6, 'minecraft:wooden_door', ['facing=west', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [64, 7, 'minecraft:wooden_door', ['facing=north', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [64, 8, 'minecraft:wooden_door', ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=false']],
        [64, 9, 'minecraft:wooden_door', ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=false']],
        [64, 10, 'minecraft:wooden_door', ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=true']],
        [64, 11, 'minecraft:wooden_door', ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=true']],
        [65, 0, 'minecraft:ladder', ['facing=north']],
        [65, 3, 'minecraft:ladder', ['facing=south']],
        [65, 4, 'minecraft:ladder', ['facing=west']],
        [65, 5, 'minecraft:ladder', ['facing=east']],
        [66, 0, 'minecraft:rail', ['shape=north_south']],
        [66, 1, 'minecraft:rail', ['shape=east_west']],
        [66, 2, 'minecraft:rail', ['shape=ascending_east']],
        [66, 3, 'minecraft:rail', ['shape=ascending_west']],
        [66, 4, 'minecraft:rail', ['shape=ascending_north']],
        [66, 5, 'minecraft:rail', ['shape=ascending_south']],
        [66, 6, 'minecraft:rail', ['shape=south_east']],
        [66, 7, 'minecraft:rail', ['shape=south_west']],
        [66, 8, 'minecraft:rail', ['shape=north_west']],
        [66, 9, 'minecraft:rail', ['shape=north_east']],
        [67, 0, 'minecraft:stone_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [67, 1, 'minecraft:stone_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [67, 2, 'minecraft:stone_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [67, 3, 'minecraft:stone_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [67, 4, 'minecraft:stone_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [67, 5, 'minecraft:stone_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [67, 6, 'minecraft:stone_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [67, 7, 'minecraft:stone_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [68, 0, 'minecraft:wall_sign', ['facing=north']],
        [68, 3, 'minecraft:wall_sign', ['facing=south']],
        [68, 4, 'minecraft:wall_sign', ['facing=west']],
        [68, 5, 'minecraft:wall_sign', ['facing=east']],
        [69, 0, 'minecraft:lever', ['facing=down_x', 'powered=false']],
        [69, 1, 'minecraft:lever', ['facing=east', 'powered=false']],
        [69, 2, 'minecraft:lever', ['facing=west', 'powered=false']],
        [69, 3, 'minecraft:lever', ['facing=south', 'powered=false']],
        [69, 4, 'minecraft:lever', ['facing=north', 'powered=false']],
        [69, 5, 'minecraft:lever', ['facing=up_z', 'powered=false']],
        [69, 6, 'minecraft:lever', ['facing=up_x', 'powered=false']],
        [69, 7, 'minecraft:lever', ['facing=down_z', 'powered=false']],
        [69, 8, 'minecraft:lever', ['facing=down_x', 'powered=true']],
        [69, 9, 'minecraft:lever', ['facing=east', 'powered=true']],
        [69, 10, 'minecraft:lever', ['facing=west', 'powered=true']],
        [69, 11, 'minecraft:lever', ['facing=south', 'powered=true']],
        [69, 12, 'minecraft:lever', ['facing=north', 'powered=true']],
        [69, 13, 'minecraft:lever', ['facing=up_z', 'powered=true']],
        [69, 14, 'minecraft:lever', ['facing=up_x', 'powered=true']],
        [69, 15, 'minecraft:lever', ['facing=down_z', 'powered=true']],
        [70, 0, 'minecraft:stone_pressure_plate', ['powered=false']],
        [70, 1, 'minecraft:stone_pressure_plate', ['powered=true']],
        [71, 0, 'minecraft:iron_door', ['facing=east', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [71, 1, 'minecraft:iron_door', ['facing=south', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [71, 2, 'minecraft:iron_door', ['facing=west', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [71, 3, 'minecraft:iron_door', ['facing=north', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [71, 4, 'minecraft:iron_door', ['facing=east', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [71, 5, 'minecraft:iron_door', ['facing=south', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [71, 6, 'minecraft:iron_door', ['facing=west', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [71, 7, 'minecraft:iron_door', ['facing=north', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [71, 8, 'minecraft:iron_door', ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=false']],
        [71, 9, 'minecraft:iron_door', ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=false']],
        [71, 10, 'minecraft:iron_door', ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=true']],
        [71, 11, 'minecraft:iron_door', ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=true']],
        [72, 0, 'minecraft:wooden_pressure_plate', ['powered=false']],
        [72, 1, 'minecraft:wooden_pressure_plate', ['powered=true']],
        [73, 0, 'minecraft:redstone_ore', []],
        [74, 0, 'minecraft:lit_redstone_ore', []],
        [75, 0, 'minecraft:unlit_redstone_torch', ['facing=up']],
        [75, 1, 'minecraft:unlit_redstone_torch', ['facing=east']],
        [75, 2, 'minecraft:unlit_redstone_torch', ['facing=west']],
        [75, 3, 'minecraft:unlit_redstone_torch', ['facing=south']],
        [75, 4, 'minecraft:unlit_redstone_torch', ['facing=north']],
        [76, 0, 'minecraft:redstone_torch', ['facing=up']],
        [76, 1, 'minecraft:redstone_torch', ['facing=east']],
        [76, 2, 'minecraft:redstone_torch', ['facing=west']],
        [76, 3, 'minecraft:redstone_torch', ['facing=south']],
        [76, 4, 'minecraft:redstone_torch', ['facing=north']],
        [77, 0, 'minecraft:stone_button', ['facing=down', 'powered=false']],
        [77, 1, 'minecraft:stone_button', ['facing=east', 'powered=false']],
        [77, 2, 'minecraft:stone_button', ['facing=west', 'powered=false']],
        [77, 3, 'minecraft:stone_button', ['facing=south', 'powered=false']],
        [77, 4, 'minecraft:stone_button', ['facing=north', 'powered=false']],
        [77, 5, 'minecraft:stone_button', ['facing=up', 'powered=false']],
        [77, 8, 'minecraft:stone_button', ['facing=down', 'powered=true']],
        [77, 9, 'minecraft:stone_button', ['facing=east', 'powered=true']],
        [77, 10, 'minecraft:stone_button', ['facing=west', 'powered=true']],
        [77, 11, 'minecraft:stone_button', ['facing=south', 'powered=true']],
        [77, 12, 'minecraft:stone_button', ['facing=north', 'powered=true']],
        [77, 13, 'minecraft:stone_button', ['facing=up', 'powered=true']],
        [78, 0, 'minecraft:snow_layer', ['layers=1']],
        [78, 1, 'minecraft:snow_layer', ['layers=2']],
        [78, 2, 'minecraft:snow_layer', ['layers=3']],
        [78, 3, 'minecraft:snow_layer', ['layers=4']],
        [78, 4, 'minecraft:snow_layer', ['layers=5']],
        [78, 5, 'minecraft:snow_layer', ['layers=6']],
        [78, 6, 'minecraft:snow_layer', ['layers=7']],
        [78, 7, 'minecraft:snow_layer', ['layers=8']],
        [79, 0, 'minecraft:ice', []],
        [80, 0, 'minecraft:snow', []],
        [81, 0, 'minecraft:cactus', ['age=0']],
        [81, 1, 'minecraft:cactus', ['age=1']],
        [81, 2, 'minecraft:cactus', ['age=2']],
        [81, 3, 'minecraft:cactus', ['age=3']],
        [81, 4, 'minecraft:cactus', ['age=4']],
        [81, 5, 'minecraft:cactus', ['age=5']],
        [81, 6, 'minecraft:cactus', ['age=6']],
        [81, 7, 'minecraft:cactus', ['age=7']],
        [81, 8, 'minecraft:cactus', ['age=8']],
        [81, 9, 'minecraft:cactus', ['age=9']],
        [81, 10, 'minecraft:cactus', ['age=10']],
        [81, 11, 'minecraft:cactus', ['age=11']],
        [81, 12, 'minecraft:cactus', ['age=12']],
        [81, 13, 'minecraft:cactus', ['age=13']],
        [81, 14, 'minecraft:cactus', ['age=14']],
        [81, 15, 'minecraft:cactus', ['age=15']],
        [82, 0, 'minecraft:clay', []],
        [83, 0, 'minecraft:reeds', ['age=0']],
        [83, 1, 'minecraft:reeds', ['age=1']],
        [83, 2, 'minecraft:reeds', ['age=2']],
        [83, 3, 'minecraft:reeds', ['age=3']],
        [83, 4, 'minecraft:reeds', ['age=4']],
        [83, 5, 'minecraft:reeds', ['age=5']],
        [83, 6, 'minecraft:reeds', ['age=6']],
        [83, 7, 'minecraft:reeds', ['age=7']],
        [83, 8, 'minecraft:reeds', ['age=8']],
        [83, 9, 'minecraft:reeds', ['age=9']],
        [83, 10, 'minecraft:reeds', ['age=10']],
        [83, 11, 'minecraft:reeds', ['age=11']],
        [83, 12, 'minecraft:reeds', ['age=12']],
        [83, 13, 'minecraft:reeds', ['age=13']],
        [83, 14, 'minecraft:reeds', ['age=14']],
        [83, 15, 'minecraft:reeds', ['age=15']],
        [84, 0, 'minecraft:jukebox', ['has_record=false']],
        [84, 1, 'minecraft:jukebox', ['has_record=true']],
        [85, 0, 'minecraft:fence', ['east=false', 'north=false', 'south=false', 'west=false']],
        [86, 0, 'minecraft:pumpkin', ['facing=south']],
        [86, 1, 'minecraft:pumpkin', ['facing=west']],
        [86, 2, 'minecraft:pumpkin', ['facing=north']],
        [86, 3, 'minecraft:pumpkin', ['facing=east']],
        [87, 0, 'minecraft:netherrack', []],
        [88, 0, 'minecraft:soul_sand', []],
        [89, 0, 'minecraft:glowstone', []],
        [90, 0, 'minecraft:portal', ['axis=x']],
        [90, 2, 'minecraft:portal', ['axis=z']],
        [91, 0, 'minecraft:lit_pumpkin', ['facing=south']],
        [91, 1, 'minecraft:lit_pumpkin', ['facing=west']],
        [91, 2, 'minecraft:lit_pumpkin', ['facing=north']],
        [91, 3, 'minecraft:lit_pumpkin', ['facing=east']],
        [92, 0, 'minecraft:cake', ['bites=0']],
        [92, 1, 'minecraft:cake', ['bites=1']],
        [92, 2, 'minecraft:cake', ['bites=2']],
        [92, 3, 'minecraft:cake', ['bites=3']],
        [92, 4, 'minecraft:cake', ['bites=4']],
        [92, 5, 'minecraft:cake', ['bites=5']],
        [92, 6, 'minecraft:cake', ['bites=6']],
        [93, 0, 'minecraft:unpowered_repeater', ['delay=1', 'facing=south', 'locked=false']],
        [93, 1, 'minecraft:unpowered_repeater', ['delay=1', 'facing=west', 'locked=false']],
        [93, 2, 'minecraft:unpowered_repeater', ['delay=1', 'facing=north', 'locked=false']],
        [93, 3, 'minecraft:unpowered_repeater', ['delay=1', 'facing=east', 'locked=false']],
        [93, 4, 'minecraft:unpowered_repeater', ['delay=2', 'facing=south', 'locked=false']],
        [93, 5, 'minecraft:unpowered_repeater', ['delay=2', 'facing=west', 'locked=false']],
        [93, 6, 'minecraft:unpowered_repeater', ['delay=2', 'facing=north', 'locked=false']],
        [93, 7, 'minecraft:unpowered_repeater', ['delay=2', 'facing=east', 'locked=false']],
        [93, 8, 'minecraft:unpowered_repeater', ['delay=3', 'facing=south', 'locked=false']],
        [93, 9, 'minecraft:unpowered_repeater', ['delay=3', 'facing=west', 'locked=false']],
        [93, 10, 'minecraft:unpowered_repeater', ['delay=3', 'facing=north', 'locked=false']],
        [93, 11, 'minecraft:unpowered_repeater', ['delay=3', 'facing=east', 'locked=false']],
        [93, 12, 'minecraft:unpowered_repeater', ['delay=4', 'facing=south', 'locked=false']],
        [93, 13, 'minecraft:unpowered_repeater', ['delay=4', 'facing=west', 'locked=false']],
        [93, 14, 'minecraft:unpowered_repeater', ['delay=4', 'facing=north', 'locked=false']],
        [93, 15, 'minecraft:unpowered_repeater', ['delay=4', 'facing=east', 'locked=false']],
        [94, 0, 'minecraft:powered_repeater', ['delay=1', 'facing=south', 'locked=false']],
        [94, 1, 'minecraft:powered_repeater', ['delay=1', 'facing=west', 'locked=false']],
        [94, 2, 'minecraft:powered_repeater', ['delay=1', 'facing=north', 'locked=false']],
        [94, 3, 'minecraft:powered_repeater', ['delay=1', 'facing=east', 'locked=false']],
        [94, 4, 'minecraft:powered_repeater', ['delay=2', 'facing=south', 'locked=false']],
        [94, 5, 'minecraft:powered_repeater', ['delay=2', 'facing=west', 'locked=false']],
        [94, 6, 'minecraft:powered_repeater', ['delay=2', 'facing=north', 'locked=false']],
        [94, 7, 'minecraft:powered_repeater', ['delay=2', 'facing=east', 'locked=false']],
        [94, 8, 'minecraft:powered_repeater', ['delay=3', 'facing=south', 'locked=false']],
        [94, 9, 'minecraft:powered_repeater', ['delay=3', 'facing=west', 'locked=false']],
        [94, 10, 'minecraft:powered_repeater', ['delay=3', 'facing=north', 'locked=false']],
        [94, 11, 'minecraft:powered_repeater', ['delay=3', 'facing=east', 'locked=false']],
        [94, 12, 'minecraft:powered_repeater', ['delay=4', 'facing=south', 'locked=false']],
        [94, 13, 'minecraft:powered_repeater', ['delay=4', 'facing=west', 'locked=false']],
        [94, 14, 'minecraft:powered_repeater', ['delay=4', 'facing=north', 'locked=false']],
        [94, 15, 'minecraft:powered_repeater', ['delay=4', 'facing=east', 'locked=false']],
        [95, 0, 'minecraft:stained_glass', ['color=white']],
        [95, 1, 'minecraft:stained_glass', ['color=orange']],
        [95, 2, 'minecraft:stained_glass', ['color=magenta']],
        [95, 3, 'minecraft:stained_glass', ['color=light_blue']],
        [95, 4, 'minecraft:stained_glass', ['color=yellow']],
        [95, 5, 'minecraft:stained_glass', ['color=lime']],
        [95, 6, 'minecraft:stained_glass', ['color=pink']],
        [95, 7, 'minecraft:stained_glass', ['color=gray']],
        [95, 8, 'minecraft:stained_glass', ['color=silver']],
        [95, 9, 'minecraft:stained_glass', ['color=cyan']],
        [95, 10, 'minecraft:stained_glass', ['color=purple']],
        [95, 11, 'minecraft:stained_glass', ['color=blue']],
        [95, 12, 'minecraft:stained_glass', ['color=brown']],
        [95, 13, 'minecraft:stained_glass', ['color=green']],
        [95, 14, 'minecraft:stained_glass', ['color=red']],
        [95, 15, 'minecraft:stained_glass', ['color=black']],
        [96, 0, 'minecraft:trapdoor', ['facing=north', 'half=bottom', 'open=false']],
        [96, 1, 'minecraft:trapdoor', ['facing=south', 'half=bottom', 'open=false']],
        [96, 2, 'minecraft:trapdoor', ['facing=west', 'half=bottom', 'open=false']],
        [96, 3, 'minecraft:trapdoor', ['facing=east', 'half=bottom', 'open=false']],
        [96, 4, 'minecraft:trapdoor', ['facing=north', 'half=bottom', 'open=true']],
        [96, 5, 'minecraft:trapdoor', ['facing=south', 'half=bottom', 'open=true']],
        [96, 6, 'minecraft:trapdoor', ['facing=west', 'half=bottom', 'open=true']],
        [96, 7, 'minecraft:trapdoor', ['facing=east', 'half=bottom', 'open=true']],
        [96, 8, 'minecraft:trapdoor', ['facing=north', 'half=top', 'open=false']],
        [96, 9, 'minecraft:trapdoor', ['facing=south', 'half=top', 'open=false']],
        [96, 10, 'minecraft:trapdoor', ['facing=west', 'half=top', 'open=false']],
        [96, 11, 'minecraft:trapdoor', ['facing=east', 'half=top', 'open=false']],
        [96, 12, 'minecraft:trapdoor', ['facing=north', 'half=top', 'open=true']],
        [96, 13, 'minecraft:trapdoor', ['facing=south', 'half=top', 'open=true']],
        [96, 14, 'minecraft:trapdoor', ['facing=west', 'half=top', 'open=true']],
        [96, 15, 'minecraft:trapdoor', ['facing=east', 'half=top', 'open=true']],
        [97, 0, 'minecraft:monster_egg', ['variant=stone']],
        [97, 1, 'minecraft:monster_egg', ['variant=cobblestone']],
        [97, 2, 'minecraft:monster_egg', ['variant=stone_brick']],
        [97, 3, 'minecraft:monster_egg', ['variant=mossy_brick']],
        [97, 4, 'minecraft:monster_egg', ['variant=cracked_brick']],
        [97, 5, 'minecraft:monster_egg', ['variant=chiseled_brick']],
        [98, 0, 'minecraft:stonebrick', ['variant=stonebrick']],
        [98, 1, 'minecraft:stonebrick', ['variant=mossy_stonebrick']],
        [98, 2, 'minecraft:stonebrick', ['variant=cracked_stonebrick']],
        [98, 3, 'minecraft:stonebrick', ['variant=chiseled_stonebrick']],
        [99, 0, 'minecraft:brown_mushroom_block', ['variant=all_inside']],
        [99, 1, 'minecraft:brown_mushroom_block', ['variant=north_west']],
        [99, 2, 'minecraft:brown_mushroom_block', ['variant=north']],
        [99, 3, 'minecraft:brown_mushroom_block', ['variant=north_east']],
        [99, 4, 'minecraft:brown_mushroom_block', ['variant=west']],
        [99, 5, 'minecraft:brown_mushroom_block', ['variant=center']],
        [99, 6, 'minecraft:brown_mushroom_block', ['variant=east']],
        [99, 7, 'minecraft:brown_mushroom_block', ['variant=south_west']],
        [99, 8, 'minecraft:brown_mushroom_block', ['variant=south']],
        [99, 9, 'minecraft:brown_mushroom_block', ['variant=south_east']],
        [99, 10, 'minecraft:brown_mushroom_block', ['variant=stem']],
        [99, 14, 'minecraft:brown_mushroom_block', ['variant=all_outside']],
        [99, 15, 'minecraft:brown_mushroom_block', ['variant=all_stem']],
        [100, 0, 'minecraft:red_mushroom_block', ['variant=all_inside']],
        [100, 1, 'minecraft:red_mushroom_block', ['variant=north_west']],
        [100, 2, 'minecraft:red_mushroom_block', ['variant=north']],
        [100, 3, 'minecraft:red_mushroom_block', ['variant=north_east']],
        [100, 4, 'minecraft:red_mushroom_block', ['variant=west']],
        [100, 5, 'minecraft:red_mushroom_block', ['variant=center']],
        [100, 6, 'minecraft:red_mushroom_block', ['variant=east']],
        [100, 7, 'minecraft:red_mushroom_block', ['variant=south_west']],
        [100, 8, 'minecraft:red_mushroom_block', ['variant=south']],
        [100, 9, 'minecraft:red_mushroom_block', ['variant=south_east']],
        [100, 10, 'minecraft:red_mushroom_block', ['variant=stem']],
        [100, 14, 'minecraft:red_mushroom_block', ['variant=all_outside']],
        [100, 15, 'minecraft:red_mushroom_block', ['variant=all_stem']],
        [101, 0, 'minecraft:iron_bars', ['east=false', 'north=false', 'south=false', 'west=false']],
        [102, 0, 'minecraft:glass_pane', ['east=false', 'north=false', 'south=false', 'west=false']],
        [103, 0, 'minecraft:melon_block', []],
        [104, 0, 'minecraft:pumpkin_stem', ['age=0', 'facing=up']],
        [104, 1, 'minecraft:pumpkin_stem', ['age=1', 'facing=up']],
        [104, 2, 'minecraft:pumpkin_stem', ['age=2', 'facing=up']],
        [104, 3, 'minecraft:pumpkin_stem', ['age=3', 'facing=up']],
        [104, 4, 'minecraft:pumpkin_stem', ['age=4', 'facing=up']],
        [104, 5, 'minecraft:pumpkin_stem', ['age=5', 'facing=up']],
        [104, 6, 'minecraft:pumpkin_stem', ['age=6', 'facing=up']],
        [104, 7, 'minecraft:pumpkin_stem', ['age=7', 'facing=up']],
        [105, 0, 'minecraft:melon_stem', ['age=0', 'facing=up']],
        [105, 1, 'minecraft:melon_stem', ['age=1', 'facing=up']],
        [105, 2, 'minecraft:melon_stem', ['age=2', 'facing=up']],
        [105, 3, 'minecraft:melon_stem', ['age=3', 'facing=up']],
        [105, 4, 'minecraft:melon_stem', ['age=4', 'facing=up']],
        [105, 5, 'minecraft:melon_stem', ['age=5', 'facing=up']],
        [105, 6, 'minecraft:melon_stem', ['age=6', 'facing=up']],
        [105, 7, 'minecraft:melon_stem', ['age=7', 'facing=up']],
        [106, 0, 'minecraft:vine', ['east=false', 'north=false', 'south=false', 'up=false', 'west=false']],
        [106, 1, 'minecraft:vine', ['east=false', 'north=false', 'south=true', 'up=false', 'west=false']],
        [106, 2, 'minecraft:vine', ['east=false', 'north=false', 'south=false', 'up=false', 'west=true']],
        [106, 3, 'minecraft:vine', ['east=false', 'north=false', 'south=true', 'up=false', 'west=true']],
        [106, 4, 'minecraft:vine', ['east=false', 'north=true', 'south=false', 'up=false', 'west=false']],
        [106, 5, 'minecraft:vine', ['east=false', 'north=true', 'south=true', 'up=false', 'west=false']],
        [106, 6, 'minecraft:vine', ['east=false', 'north=true', 'south=false', 'up=false', 'west=true']],
        [106, 7, 'minecraft:vine', ['east=false', 'north=true', 'south=true', 'up=false', 'west=true']],
        [106, 8, 'minecraft:vine', ['east=true', 'north=false', 'south=false', 'up=false', 'west=false']],
        [106, 9, 'minecraft:vine', ['east=true', 'north=false', 'south=true', 'up=false', 'west=false']],
        [106, 10, 'minecraft:vine', ['east=true', 'north=false', 'south=false', 'up=false', 'west=true']],
        [106, 11, 'minecraft:vine', ['east=true', 'north=false', 'south=true', 'up=false', 'west=true']],
        [106, 12, 'minecraft:vine', ['east=true', 'north=true', 'south=false', 'up=false', 'west=false']],
        [106, 13, 'minecraft:vine', ['east=true', 'north=true', 'south=true', 'up=false', 'west=false']],
        [106, 14, 'minecraft:vine', ['east=true', 'north=true', 'south=false', 'up=false', 'west=true']],
        [106, 15, 'minecraft:vine', ['east=true', 'north=true', 'south=true', 'up=false', 'west=true']],
        [107, 0, 'minecraft:fence_gate', ['facing=south', 'in_wall=false', 'open=false', 'powered=false']],
        [107, 1, 'minecraft:fence_gate', ['facing=west', 'in_wall=false', 'open=false', 'powered=false']],
        [107, 2, 'minecraft:fence_gate', ['facing=north', 'in_wall=false', 'open=false', 'powered=false']],
        [107, 3, 'minecraft:fence_gate', ['facing=east', 'in_wall=false', 'open=false', 'powered=false']],
        [107, 4, 'minecraft:fence_gate', ['facing=south', 'in_wall=false', 'open=true', 'powered=false']],
        [107, 5, 'minecraft:fence_gate', ['facing=west', 'in_wall=false', 'open=true', 'powered=false']],
        [107, 6, 'minecraft:fence_gate', ['facing=north', 'in_wall=false', 'open=true', 'powered=false']],
        [107, 7, 'minecraft:fence_gate', ['facing=east', 'in_wall=false', 'open=true', 'powered=false']],
        [107, 8, 'minecraft:fence_gate', ['facing=south', 'in_wall=false', 'open=false', 'powered=true']],
        [107, 9, 'minecraft:fence_gate', ['facing=west', 'in_wall=false', 'open=false', 'powered=true']],
        [107, 10, 'minecraft:fence_gate', ['facing=north', 'in_wall=false', 'open=false', 'powered=true']],
        [107, 11, 'minecraft:fence_gate', ['facing=east', 'in_wall=false', 'open=false', 'powered=true']],
        [107, 12, 'minecraft:fence_gate', ['facing=south', 'in_wall=false', 'open=true', 'powered=true']],
        [107, 13, 'minecraft:fence_gate', ['facing=west', 'in_wall=false', 'open=true', 'powered=true']],
        [107, 14, 'minecraft:fence_gate', ['facing=north', 'in_wall=false', 'open=true', 'powered=true']],
        [107, 15, 'minecraft:fence_gate', ['facing=east', 'in_wall=false', 'open=true', 'powered=true']],
        [108, 0, 'minecraft:brick_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [108, 1, 'minecraft:brick_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [108, 2, 'minecraft:brick_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [108, 3, 'minecraft:brick_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [108, 4, 'minecraft:brick_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [108, 5, 'minecraft:brick_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [108, 6, 'minecraft:brick_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [108, 7, 'minecraft:brick_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [109, 0, 'minecraft:stone_brick_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [109, 1, 'minecraft:stone_brick_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [109, 2, 'minecraft:stone_brick_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [109, 3, 'minecraft:stone_brick_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [109, 4, 'minecraft:stone_brick_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [109, 5, 'minecraft:stone_brick_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [109, 6, 'minecraft:stone_brick_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [109, 7, 'minecraft:stone_brick_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [110, 0, 'minecraft:mycelium', ['snowy=false']],
        [111, 0, 'minecraft:waterlily', []],
        [112, 0, 'minecraft:nether_brick', []],
        [113, 0, 'minecraft:nether_brick_fence', ['east=false', 'north=false', 'south=false', 'west=false']],
        [114, 0, 'minecraft:nether_brick_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [114, 1, 'minecraft:nether_brick_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [114, 2, 'minecraft:nether_brick_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [114, 3, 'minecraft:nether_brick_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [114, 4, 'minecraft:nether_brick_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [114, 5, 'minecraft:nether_brick_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [114, 6, 'minecraft:nether_brick_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [114, 7, 'minecraft:nether_brick_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [115, 0, 'minecraft:nether_wart', ['age=0']],
        [115, 1, 'minecraft:nether_wart', ['age=1']],
        [115, 2, 'minecraft:nether_wart', ['age=2']],
        [115, 3, 'minecraft:nether_wart', ['age=3']],
        [116, 0, 'minecraft:enchanting_table', []],
        [117, 0, 'minecraft:brewing_stand', ['has_bottle_0=false', 'has_bottle_1=false', 'has_bottle_2=false']],
        [117, 1, 'minecraft:brewing_stand', ['has_bottle_0=true', 'has_bottle_1=false', 'has_bottle_2=false']],
        [117, 2, 'minecraft:brewing_stand', ['has_bottle_0=false', 'has_bottle_1=true', 'has_bottle_2=false']],
        [117, 3, 'minecraft:brewing_stand', ['has_bottle_0=true', 'has_bottle_1=true', 'has_bottle_2=false']],
        [117, 4, 'minecraft:brewing_stand', ['has_bottle_0=false', 'has_bottle_1=false', 'has_bottle_2=true']],
        [117, 5, 'minecraft:brewing_stand', ['has_bottle_0=true', 'has_bottle_1=false', 'has_bottle_2=true']],
        [117, 6, 'minecraft:brewing_stand', ['has_bottle_0=false', 'has_bottle_1=true', 'has_bottle_2=true']],
        [117, 7, 'minecraft:brewing_stand', ['has_bottle_0=true', 'has_bottle_1=true', 'has_bottle_2=true']],
        [118, 0, 'minecraft:cauldron', ['level=0']],
        [118, 1, 'minecraft:cauldron', ['level=1']],
        [118, 2, 'minecraft:cauldron', ['level=2']],
        [118, 3, 'minecraft:cauldron', ['level=3']],
        [119, 0, 'minecraft:end_portal', []],
        [120, 0, 'minecraft:end_portal_frame', ['eye=false', 'facing=south']],
        [120, 1, 'minecraft:end_portal_frame', ['eye=false', 'facing=west']],
        [120, 2, 'minecraft:end_portal_frame', ['eye=false', 'facing=north']],
        [120, 3, 'minecraft:end_portal_frame', ['eye=false', 'facing=east']],
        [120, 4, 'minecraft:end_portal_frame', ['eye=true', 'facing=south']],
        [120, 5, 'minecraft:end_portal_frame', ['eye=true', 'facing=west']],
        [120, 6, 'minecraft:end_portal_frame', ['eye=true', 'facing=north']],
        [120, 7, 'minecraft:end_portal_frame', ['eye=true', 'facing=east']],
        [121, 0, 'minecraft:end_stone', []],
        [122, 0, 'minecraft:dragon_egg', []],
        [123, 0, 'minecraft:redstone_lamp', []],
        [124, 0, 'minecraft:lit_redstone_lamp', []],
        [125, 0, 'minecraft:double_wooden_slab', ['variant=oak']],
        [125, 1, 'minecraft:double_wooden_slab', ['variant=spruce']],
        [125, 2, 'minecraft:double_wooden_slab', ['variant=birch']],
        [125, 3, 'minecraft:double_wooden_slab', ['variant=jungle']],
        [125, 4, 'minecraft:double_wooden_slab', ['variant=acacia']],
        [125, 5, 'minecraft:double_wooden_slab', ['variant=dark_oak']],
        [126, 0, 'minecraft:wooden_slab', ['half=bottom', 'variant=oak']],
        [126, 1, 'minecraft:wooden_slab', ['half=bottom', 'variant=spruce']],
        [126, 2, 'minecraft:wooden_slab', ['half=bottom', 'variant=birch']],
        [126, 3, 'minecraft:wooden_slab', ['half=bottom', 'variant=jungle']],
        [126, 4, 'minecraft:wooden_slab', ['half=bottom', 'variant=acacia']],
        [126, 5, 'minecraft:wooden_slab', ['half=bottom', 'variant=dark_oak']],
        [126, 8, 'minecraft:wooden_slab', ['half=top', 'variant=oak']],
        [126, 9, 'minecraft:wooden_slab', ['half=top', 'variant=spruce']],
        [126, 10, 'minecraft:wooden_slab', ['half=top', 'variant=birch']],
        [126, 11, 'minecraft:wooden_slab', ['half=top', 'variant=jungle']],
        [126, 12, 'minecraft:wooden_slab', ['half=top', 'variant=acacia']],
        [126, 13, 'minecraft:wooden_slab', ['half=top', 'variant=dark_oak']],
        [127, 0, 'minecraft:cocoa', ['age=0', 'facing=south']],
        [127, 1, 'minecraft:cocoa', ['age=0', 'facing=west']],
        [127, 2, 'minecraft:cocoa', ['age=0', 'facing=north']],
        [127, 3, 'minecraft:cocoa', ['age=0', 'facing=east']],
        [127, 4, 'minecraft:cocoa', ['age=1', 'facing=south']],
        [127, 5, 'minecraft:cocoa', ['age=1', 'facing=west']],
        [127, 6, 'minecraft:cocoa', ['age=1', 'facing=north']],
        [127, 7, 'minecraft:cocoa', ['age=1', 'facing=east']],
        [127, 8, 'minecraft:cocoa', ['age=2', 'facing=south']],
        [127, 9, 'minecraft:cocoa', ['age=2', 'facing=west']],
        [127, 10, 'minecraft:cocoa', ['age=2', 'facing=north']],
        [127, 11, 'minecraft:cocoa', ['age=2', 'facing=east']],
        [128, 0, 'minecraft:sandstone_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [128, 1, 'minecraft:sandstone_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [128, 2, 'minecraft:sandstone_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [128, 3, 'minecraft:sandstone_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [128, 4, 'minecraft:sandstone_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [128, 5, 'minecraft:sandstone_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [128, 6, 'minecraft:sandstone_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [128, 7, 'minecraft:sandstone_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [129, 0, 'minecraft:emerald_ore', []],
        [130, 0, 'minecraft:ender_chest', ['facing=north']],
        [130, 3, 'minecraft:ender_chest', ['facing=south']],
        [130, 4, 'minecraft:ender_chest', ['facing=west']],
        [130, 5, 'minecraft:ender_chest', ['facing=east']],
        [131, 0, 'minecraft:tripwire_hook', ['attached=false', 'facing=south', 'powered=false']],
        [131, 1, 'minecraft:tripwire_hook', ['attached=false', 'facing=west', 'powered=false']],
        [131, 2, 'minecraft:tripwire_hook', ['attached=false', 'facing=north', 'powered=false']],
        [131, 3, 'minecraft:tripwire_hook', ['attached=false', 'facing=east', 'powered=false']],
        [131, 4, 'minecraft:tripwire_hook', ['attached=true', 'facing=south', 'powered=false']],
        [131, 5, 'minecraft:tripwire_hook', ['attached=true', 'facing=west', 'powered=false']],
        [131, 6, 'minecraft:tripwire_hook', ['attached=true', 'facing=north', 'powered=false']],
        [131, 7, 'minecraft:tripwire_hook', ['attached=true', 'facing=east', 'powered=false']],
        [131, 8, 'minecraft:tripwire_hook', ['attached=false', 'facing=south', 'powered=true']],
        [131, 9, 'minecraft:tripwire_hook', ['attached=false', 'facing=west', 'powered=true']],
        [131, 10, 'minecraft:tripwire_hook', ['attached=false', 'facing=north', 'powered=true']],
        [131, 11, 'minecraft:tripwire_hook', ['attached=false', 'facing=east', 'powered=true']],
        [131, 12, 'minecraft:tripwire_hook', ['attached=true', 'facing=south', 'powered=true']],
        [131, 13, 'minecraft:tripwire_hook', ['attached=true', 'facing=west', 'powered=true']],
        [131, 14, 'minecraft:tripwire_hook', ['attached=true', 'facing=north', 'powered=true']],
        [131, 15, 'minecraft:tripwire_hook', ['attached=true', 'facing=east', 'powered=true']],
        [
            132,
            0,
            'minecraft:tripwire',
            [
                'attached=false',
                'disarmed=false',
                'east=false',
                'north=false',
                'powered=false',
                'south=false',
                'west=false'
            ]
        ],
        [
            132,
            1,
            'minecraft:tripwire',
            [
                'attached=false',
                'disarmed=false',
                'east=false',
                'north=false',
                'powered=true',
                'south=false',
                'west=false'
            ]
        ],
        [
            132,
            4,
            'minecraft:tripwire',
            [
                'attached=true',
                'disarmed=false',
                'east=false',
                'north=false',
                'powered=false',
                'south=false',
                'west=false'
            ]
        ],
        [
            132,
            5,
            'minecraft:tripwire',
            [
                'attached=true',
                'disarmed=false',
                'east=false',
                'north=false',
                'powered=true',
                'south=false',
                'west=false'
            ]
        ],
        [
            132,
            8,
            'minecraft:tripwire',
            [
                'attached=false',
                'disarmed=true',
                'east=false',
                'north=false',
                'powered=false',
                'south=false',
                'west=false'
            ]
        ],
        [
            132,
            9,
            'minecraft:tripwire',
            [
                'attached=false',
                'disarmed=true',
                'east=false',
                'north=false',
                'powered=true',
                'south=false',
                'west=false'
            ]
        ],
        [
            132,
            12,
            'minecraft:tripwire',
            [
                'attached=true',
                'disarmed=true',
                'east=false',
                'north=false',
                'powered=false',
                'south=false',
                'west=false'
            ]
        ],
        [
            132,
            13,
            'minecraft:tripwire',
            ['attached=true', 'disarmed=true', 'east=false', 'north=false', 'powered=true', 'south=false', 'west=false']
        ],
        [133, 0, 'minecraft:emerald_block', []],
        [134, 0, 'minecraft:spruce_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [134, 1, 'minecraft:spruce_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [134, 2, 'minecraft:spruce_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [134, 3, 'minecraft:spruce_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [134, 4, 'minecraft:spruce_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [134, 5, 'minecraft:spruce_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [134, 6, 'minecraft:spruce_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [134, 7, 'minecraft:spruce_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [135, 0, 'minecraft:birch_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [135, 1, 'minecraft:birch_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [135, 2, 'minecraft:birch_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [135, 3, 'minecraft:birch_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [135, 4, 'minecraft:birch_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [135, 5, 'minecraft:birch_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [135, 6, 'minecraft:birch_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [135, 7, 'minecraft:birch_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [136, 0, 'minecraft:jungle_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [136, 1, 'minecraft:jungle_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [136, 2, 'minecraft:jungle_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [136, 3, 'minecraft:jungle_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [136, 4, 'minecraft:jungle_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [136, 5, 'minecraft:jungle_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [136, 6, 'minecraft:jungle_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [136, 7, 'minecraft:jungle_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [137, 0, 'minecraft:command_block', ['conditional=false', 'facing=down']],
        [137, 1, 'minecraft:command_block', ['conditional=false', 'facing=up']],
        [137, 2, 'minecraft:command_block', ['conditional=false', 'facing=north']],
        [137, 3, 'minecraft:command_block', ['conditional=false', 'facing=south']],
        [137, 4, 'minecraft:command_block', ['conditional=false', 'facing=west']],
        [137, 5, 'minecraft:command_block', ['conditional=false', 'facing=east']],
        [137, 8, 'minecraft:command_block', ['conditional=true', 'facing=down']],
        [137, 9, 'minecraft:command_block', ['conditional=true', 'facing=up']],
        [137, 10, 'minecraft:command_block', ['conditional=true', 'facing=north']],
        [137, 11, 'minecraft:command_block', ['conditional=true', 'facing=south']],
        [137, 12, 'minecraft:command_block', ['conditional=true', 'facing=west']],
        [137, 13, 'minecraft:command_block', ['conditional=true', 'facing=east']],
        [138, 0, 'minecraft:beacon', []],
        [
            139,
            0,
            'minecraft:cobblestone_wall',
            ['east=false', 'north=false', 'south=false', 'up=false', 'variant=cobblestone', 'west=false']
        ],
        [
            139,
            1,
            'minecraft:cobblestone_wall',
            ['east=false', 'north=false', 'south=false', 'up=false', 'variant=mossy_cobblestone', 'west=false']
        ],
        [140, 0, 'minecraft:flower_pot', ['contents=empty', 'legacy_data=0']],
        [141, 0, 'minecraft:carrots', ['age=0']],
        [141, 1, 'minecraft:carrots', ['age=1']],
        [141, 2, 'minecraft:carrots', ['age=2']],
        [141, 3, 'minecraft:carrots', ['age=3']],
        [141, 4, 'minecraft:carrots', ['age=4']],
        [141, 5, 'minecraft:carrots', ['age=5']],
        [141, 6, 'minecraft:carrots', ['age=6']],
        [141, 7, 'minecraft:carrots', ['age=7']],
        [142, 0, 'minecraft:potatoes', ['age=0']],
        [142, 1, 'minecraft:potatoes', ['age=1']],
        [142, 2, 'minecraft:potatoes', ['age=2']],
        [142, 3, 'minecraft:potatoes', ['age=3']],
        [142, 4, 'minecraft:potatoes', ['age=4']],
        [142, 5, 'minecraft:potatoes', ['age=5']],
        [142, 6, 'minecraft:potatoes', ['age=6']],
        [142, 7, 'minecraft:potatoes', ['age=7']],
        [143, 0, 'minecraft:wooden_button', ['facing=down', 'powered=false']],
        [143, 1, 'minecraft:wooden_button', ['facing=east', 'powered=false']],
        [143, 2, 'minecraft:wooden_button', ['facing=west', 'powered=false']],
        [143, 3, 'minecraft:wooden_button', ['facing=south', 'powered=false']],
        [143, 4, 'minecraft:wooden_button', ['facing=north', 'powered=false']],
        [143, 5, 'minecraft:wooden_button', ['facing=up', 'powered=false']],
        [143, 8, 'minecraft:wooden_button', ['facing=down', 'powered=true']],
        [143, 9, 'minecraft:wooden_button', ['facing=east', 'powered=true']],
        [143, 10, 'minecraft:wooden_button', ['facing=west', 'powered=true']],
        [143, 11, 'minecraft:wooden_button', ['facing=south', 'powered=true']],
        [143, 12, 'minecraft:wooden_button', ['facing=north', 'powered=true']],
        [143, 13, 'minecraft:wooden_button', ['facing=up', 'powered=true']],
        [144, 0, 'minecraft:skull', ['facing=down', 'nodrop=false']],
        [144, 1, 'minecraft:skull', ['facing=up', 'nodrop=false']],
        [144, 2, 'minecraft:skull', ['facing=north', 'nodrop=false']],
        [144, 3, 'minecraft:skull', ['facing=south', 'nodrop=false']],
        [144, 4, 'minecraft:skull', ['facing=west', 'nodrop=false']],
        [144, 5, 'minecraft:skull', ['facing=east', 'nodrop=false']],
        [144, 8, 'minecraft:skull', ['facing=down', 'nodrop=true']],
        [144, 9, 'minecraft:skull', ['facing=up', 'nodrop=true']],
        [144, 10, 'minecraft:skull', ['facing=north', 'nodrop=true']],
        [144, 11, 'minecraft:skull', ['facing=south', 'nodrop=true']],
        [144, 12, 'minecraft:skull', ['facing=west', 'nodrop=true']],
        [144, 13, 'minecraft:skull', ['facing=east', 'nodrop=true']],
        [145, 0, 'minecraft:anvil', ['damage=0', 'facing=south']],
        [145, 1, 'minecraft:anvil', ['damage=0', 'facing=west']],
        [145, 2, 'minecraft:anvil', ['damage=0', 'facing=north']],
        [145, 3, 'minecraft:anvil', ['damage=0', 'facing=east']],
        [145, 4, 'minecraft:anvil', ['damage=1', 'facing=south']],
        [145, 5, 'minecraft:anvil', ['damage=1', 'facing=west']],
        [145, 6, 'minecraft:anvil', ['damage=1', 'facing=north']],
        [145, 7, 'minecraft:anvil', ['damage=1', 'facing=east']],
        [145, 8, 'minecraft:anvil', ['damage=2', 'facing=south']],
        [145, 9, 'minecraft:anvil', ['damage=2', 'facing=west']],
        [145, 10, 'minecraft:anvil', ['damage=2', 'facing=north']],
        [145, 11, 'minecraft:anvil', ['damage=2', 'facing=east']],
        [146, 0, 'minecraft:trapped_chest', ['facing=north']],
        [146, 3, 'minecraft:trapped_chest', ['facing=south']],
        [146, 4, 'minecraft:trapped_chest', ['facing=west']],
        [146, 5, 'minecraft:trapped_chest', ['facing=east']],
        [147, 0, 'minecraft:light_weighted_pressure_plate', ['power=0']],
        [147, 1, 'minecraft:light_weighted_pressure_plate', ['power=1']],
        [147, 2, 'minecraft:light_weighted_pressure_plate', ['power=2']],
        [147, 3, 'minecraft:light_weighted_pressure_plate', ['power=3']],
        [147, 4, 'minecraft:light_weighted_pressure_plate', ['power=4']],
        [147, 5, 'minecraft:light_weighted_pressure_plate', ['power=5']],
        [147, 6, 'minecraft:light_weighted_pressure_plate', ['power=6']],
        [147, 7, 'minecraft:light_weighted_pressure_plate', ['power=7']],
        [147, 8, 'minecraft:light_weighted_pressure_plate', ['power=8']],
        [147, 9, 'minecraft:light_weighted_pressure_plate', ['power=9']],
        [147, 10, 'minecraft:light_weighted_pressure_plate', ['power=10']],
        [147, 11, 'minecraft:light_weighted_pressure_plate', ['power=11']],
        [147, 12, 'minecraft:light_weighted_pressure_plate', ['power=12']],
        [147, 13, 'minecraft:light_weighted_pressure_plate', ['power=13']],
        [147, 14, 'minecraft:light_weighted_pressure_plate', ['power=14']],
        [147, 15, 'minecraft:light_weighted_pressure_plate', ['power=15']],
        [148, 0, 'minecraft:heavy_weighted_pressure_plate', ['power=0']],
        [148, 1, 'minecraft:heavy_weighted_pressure_plate', ['power=1']],
        [148, 2, 'minecraft:heavy_weighted_pressure_plate', ['power=2']],
        [148, 3, 'minecraft:heavy_weighted_pressure_plate', ['power=3']],
        [148, 4, 'minecraft:heavy_weighted_pressure_plate', ['power=4']],
        [148, 5, 'minecraft:heavy_weighted_pressure_plate', ['power=5']],
        [148, 6, 'minecraft:heavy_weighted_pressure_plate', ['power=6']],
        [148, 7, 'minecraft:heavy_weighted_pressure_plate', ['power=7']],
        [148, 8, 'minecraft:heavy_weighted_pressure_plate', ['power=8']],
        [148, 9, 'minecraft:heavy_weighted_pressure_plate', ['power=9']],
        [148, 10, 'minecraft:heavy_weighted_pressure_plate', ['power=10']],
        [148, 11, 'minecraft:heavy_weighted_pressure_plate', ['power=11']],
        [148, 12, 'minecraft:heavy_weighted_pressure_plate', ['power=12']],
        [148, 13, 'minecraft:heavy_weighted_pressure_plate', ['power=13']],
        [148, 14, 'minecraft:heavy_weighted_pressure_plate', ['power=14']],
        [148, 15, 'minecraft:heavy_weighted_pressure_plate', ['power=15']],
        [149, 0, 'minecraft:unpowered_comparator', ['facing=south', 'mode=compare', 'powered=false']],
        [149, 1, 'minecraft:unpowered_comparator', ['facing=west', 'mode=compare', 'powered=false']],
        [149, 2, 'minecraft:unpowered_comparator', ['facing=north', 'mode=compare', 'powered=false']],
        [149, 3, 'minecraft:unpowered_comparator', ['facing=east', 'mode=compare', 'powered=false']],
        [149, 4, 'minecraft:unpowered_comparator', ['facing=south', 'mode=subtract', 'powered=false']],
        [149, 5, 'minecraft:unpowered_comparator', ['facing=west', 'mode=subtract', 'powered=false']],
        [149, 6, 'minecraft:unpowered_comparator', ['facing=north', 'mode=subtract', 'powered=false']],
        [149, 7, 'minecraft:unpowered_comparator', ['facing=east', 'mode=subtract', 'powered=false']],
        [149, 8, 'minecraft:unpowered_comparator', ['facing=south', 'mode=compare', 'powered=true']],
        [149, 9, 'minecraft:unpowered_comparator', ['facing=west', 'mode=compare', 'powered=true']],
        [149, 10, 'minecraft:unpowered_comparator', ['facing=north', 'mode=compare', 'powered=true']],
        [149, 11, 'minecraft:unpowered_comparator', ['facing=east', 'mode=compare', 'powered=true']],
        [149, 12, 'minecraft:unpowered_comparator', ['facing=south', 'mode=subtract', 'powered=true']],
        [149, 13, 'minecraft:unpowered_comparator', ['facing=west', 'mode=subtract', 'powered=true']],
        [149, 14, 'minecraft:unpowered_comparator', ['facing=north', 'mode=subtract', 'powered=true']],
        [149, 15, 'minecraft:unpowered_comparator', ['facing=east', 'mode=subtract', 'powered=true']],
        [150, 0, 'minecraft:powered_comparator', ['facing=south', 'mode=compare', 'powered=false']],
        [150, 1, 'minecraft:powered_comparator', ['facing=west', 'mode=compare', 'powered=false']],
        [150, 2, 'minecraft:powered_comparator', ['facing=north', 'mode=compare', 'powered=false']],
        [150, 3, 'minecraft:powered_comparator', ['facing=east', 'mode=compare', 'powered=false']],
        [150, 4, 'minecraft:powered_comparator', ['facing=south', 'mode=subtract', 'powered=false']],
        [150, 5, 'minecraft:powered_comparator', ['facing=west', 'mode=subtract', 'powered=false']],
        [150, 6, 'minecraft:powered_comparator', ['facing=north', 'mode=subtract', 'powered=false']],
        [150, 7, 'minecraft:powered_comparator', ['facing=east', 'mode=subtract', 'powered=false']],
        [150, 8, 'minecraft:powered_comparator', ['facing=south', 'mode=compare', 'powered=true']],
        [150, 9, 'minecraft:powered_comparator', ['facing=west', 'mode=compare', 'powered=true']],
        [150, 10, 'minecraft:powered_comparator', ['facing=north', 'mode=compare', 'powered=true']],
        [150, 11, 'minecraft:powered_comparator', ['facing=east', 'mode=compare', 'powered=true']],
        [150, 12, 'minecraft:powered_comparator', ['facing=south', 'mode=subtract', 'powered=true']],
        [150, 13, 'minecraft:powered_comparator', ['facing=west', 'mode=subtract', 'powered=true']],
        [150, 14, 'minecraft:powered_comparator', ['facing=north', 'mode=subtract', 'powered=true']],
        [150, 15, 'minecraft:powered_comparator', ['facing=east', 'mode=subtract', 'powered=true']],
        [151, 0, 'minecraft:daylight_detector', ['power=0']],
        [151, 1, 'minecraft:daylight_detector', ['power=1']],
        [151, 2, 'minecraft:daylight_detector', ['power=2']],
        [151, 3, 'minecraft:daylight_detector', ['power=3']],
        [151, 4, 'minecraft:daylight_detector', ['power=4']],
        [151, 5, 'minecraft:daylight_detector', ['power=5']],
        [151, 6, 'minecraft:daylight_detector', ['power=6']],
        [151, 7, 'minecraft:daylight_detector', ['power=7']],
        [151, 8, 'minecraft:daylight_detector', ['power=8']],
        [151, 9, 'minecraft:daylight_detector', ['power=9']],
        [151, 10, 'minecraft:daylight_detector', ['power=10']],
        [151, 11, 'minecraft:daylight_detector', ['power=11']],
        [151, 12, 'minecraft:daylight_detector', ['power=12']],
        [151, 13, 'minecraft:daylight_detector', ['power=13']],
        [151, 14, 'minecraft:daylight_detector', ['power=14']],
        [151, 15, 'minecraft:daylight_detector', ['power=15']],
        [152, 0, 'minecraft:redstone_block', []],
        [153, 0, 'minecraft:quartz_ore', []],
        [154, 0, 'minecraft:hopper', ['enabled=true', 'facing=down']],
        [154, 2, 'minecraft:hopper', ['enabled=true', 'facing=north']],
        [154, 3, 'minecraft:hopper', ['enabled=true', 'facing=south']],
        [154, 4, 'minecraft:hopper', ['enabled=true', 'facing=west']],
        [154, 5, 'minecraft:hopper', ['enabled=true', 'facing=east']],
        [154, 8, 'minecraft:hopper', ['enabled=false', 'facing=down']],
        [154, 10, 'minecraft:hopper', ['enabled=false', 'facing=north']],
        [154, 11, 'minecraft:hopper', ['enabled=false', 'facing=south']],
        [154, 12, 'minecraft:hopper', ['enabled=false', 'facing=west']],
        [154, 13, 'minecraft:hopper', ['enabled=false', 'facing=east']],
        [155, 0, 'minecraft:quartz_block', ['variant=default']],
        [155, 1, 'minecraft:quartz_block', ['variant=chiseled']],
        [155, 2, 'minecraft:quartz_block', ['variant=lines_y']],
        [155, 3, 'minecraft:quartz_block', ['variant=lines_x']],
        [155, 4, 'minecraft:quartz_block', ['variant=lines_z']],
        [156, 0, 'minecraft:quartz_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [156, 1, 'minecraft:quartz_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [156, 2, 'minecraft:quartz_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [156, 3, 'minecraft:quartz_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [156, 4, 'minecraft:quartz_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [156, 5, 'minecraft:quartz_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [156, 6, 'minecraft:quartz_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [156, 7, 'minecraft:quartz_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [157, 0, 'minecraft:activator_rail', ['powered=false', 'shape=north_south']],
        [157, 1, 'minecraft:activator_rail', ['powered=false', 'shape=east_west']],
        [157, 2, 'minecraft:activator_rail', ['powered=false', 'shape=ascending_east']],
        [157, 3, 'minecraft:activator_rail', ['powered=false', 'shape=ascending_west']],
        [157, 4, 'minecraft:activator_rail', ['powered=false', 'shape=ascending_north']],
        [157, 5, 'minecraft:activator_rail', ['powered=false', 'shape=ascending_south']],
        [157, 8, 'minecraft:activator_rail', ['powered=true', 'shape=north_south']],
        [157, 9, 'minecraft:activator_rail', ['powered=true', 'shape=east_west']],
        [157, 10, 'minecraft:activator_rail', ['powered=true', 'shape=ascending_east']],
        [157, 11, 'minecraft:activator_rail', ['powered=true', 'shape=ascending_west']],
        [157, 12, 'minecraft:activator_rail', ['powered=true', 'shape=ascending_north']],
        [157, 13, 'minecraft:activator_rail', ['powered=true', 'shape=ascending_south']],
        [158, 0, 'minecraft:dropper', ['facing=down', 'triggered=false']],
        [158, 1, 'minecraft:dropper', ['facing=up', 'triggered=false']],
        [158, 2, 'minecraft:dropper', ['facing=north', 'triggered=false']],
        [158, 3, 'minecraft:dropper', ['facing=south', 'triggered=false']],
        [158, 4, 'minecraft:dropper', ['facing=west', 'triggered=false']],
        [158, 5, 'minecraft:dropper', ['facing=east', 'triggered=false']],
        [158, 8, 'minecraft:dropper', ['facing=down', 'triggered=true']],
        [158, 9, 'minecraft:dropper', ['facing=up', 'triggered=true']],
        [158, 10, 'minecraft:dropper', ['facing=north', 'triggered=true']],
        [158, 11, 'minecraft:dropper', ['facing=south', 'triggered=true']],
        [158, 12, 'minecraft:dropper', ['facing=west', 'triggered=true']],
        [158, 13, 'minecraft:dropper', ['facing=east', 'triggered=true']],
        [159, 0, 'minecraft:stained_hardened_clay', ['color=white']],
        [159, 1, 'minecraft:stained_hardened_clay', ['color=orange']],
        [159, 2, 'minecraft:stained_hardened_clay', ['color=magenta']],
        [159, 3, 'minecraft:stained_hardened_clay', ['color=light_blue']],
        [159, 4, 'minecraft:stained_hardened_clay', ['color=yellow']],
        [159, 5, 'minecraft:stained_hardened_clay', ['color=lime']],
        [159, 6, 'minecraft:stained_hardened_clay', ['color=pink']],
        [159, 7, 'minecraft:stained_hardened_clay', ['color=gray']],
        [159, 8, 'minecraft:stained_hardened_clay', ['color=silver']],
        [159, 9, 'minecraft:stained_hardened_clay', ['color=cyan']],
        [159, 10, 'minecraft:stained_hardened_clay', ['color=purple']],
        [159, 11, 'minecraft:stained_hardened_clay', ['color=blue']],
        [159, 12, 'minecraft:stained_hardened_clay', ['color=brown']],
        [159, 13, 'minecraft:stained_hardened_clay', ['color=green']],
        [159, 14, 'minecraft:stained_hardened_clay', ['color=red']],
        [159, 15, 'minecraft:stained_hardened_clay', ['color=black']],
        [
            160,
            0,
            'minecraft:stained_glass_pane',
            ['color=white', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            1,
            'minecraft:stained_glass_pane',
            ['color=orange', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            2,
            'minecraft:stained_glass_pane',
            ['color=magenta', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            3,
            'minecraft:stained_glass_pane',
            ['color=light_blue', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            4,
            'minecraft:stained_glass_pane',
            ['color=yellow', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            5,
            'minecraft:stained_glass_pane',
            ['color=lime', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            6,
            'minecraft:stained_glass_pane',
            ['color=pink', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            7,
            'minecraft:stained_glass_pane',
            ['color=gray', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            8,
            'minecraft:stained_glass_pane',
            ['color=silver', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            9,
            'minecraft:stained_glass_pane',
            ['color=cyan', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            10,
            'minecraft:stained_glass_pane',
            ['color=purple', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            11,
            'minecraft:stained_glass_pane',
            ['color=blue', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            12,
            'minecraft:stained_glass_pane',
            ['color=brown', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            13,
            'minecraft:stained_glass_pane',
            ['color=green', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            14,
            'minecraft:stained_glass_pane',
            ['color=red', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [
            160,
            15,
            'minecraft:stained_glass_pane',
            ['color=black', 'east=false', 'north=false', 'south=false', 'west=false']
        ],
        [161, 0, 'minecraft:leaves2', ['check_decay=false', 'decayable=true', 'variant=acacia']],
        [161, 1, 'minecraft:leaves2', ['check_decay=false', 'decayable=true', 'variant=dark_oak']],
        [161, 4, 'minecraft:leaves2', ['check_decay=false', 'decayable=false', 'variant=acacia']],
        [161, 5, 'minecraft:leaves2', ['check_decay=false', 'decayable=false', 'variant=dark_oak']],
        [161, 8, 'minecraft:leaves2', ['check_decay=true', 'decayable=true', 'variant=acacia']],
        [161, 9, 'minecraft:leaves2', ['check_decay=true', 'decayable=true', 'variant=dark_oak']],
        [161, 12, 'minecraft:leaves2', ['check_decay=true', 'decayable=false', 'variant=acacia']],
        [161, 13, 'minecraft:leaves2', ['check_decay=true', 'decayable=false', 'variant=dark_oak']],
        [162, 0, 'minecraft:log2', ['axis=y', 'variant=acacia']],
        [162, 1, 'minecraft:log2', ['axis=y', 'variant=dark_oak']],
        [162, 4, 'minecraft:log2', ['axis=x', 'variant=acacia']],
        [162, 5, 'minecraft:log2', ['axis=x', 'variant=dark_oak']],
        [162, 8, 'minecraft:log2', ['axis=z', 'variant=acacia']],
        [162, 9, 'minecraft:log2', ['axis=z', 'variant=dark_oak']],
        [162, 12, 'minecraft:log2', ['axis=none', 'variant=acacia']],
        [162, 13, 'minecraft:log2', ['axis=none', 'variant=dark_oak']],
        [163, 0, 'minecraft:acacia_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [163, 1, 'minecraft:acacia_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [163, 2, 'minecraft:acacia_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [163, 3, 'minecraft:acacia_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [163, 4, 'minecraft:acacia_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [163, 5, 'minecraft:acacia_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [163, 6, 'minecraft:acacia_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [163, 7, 'minecraft:acacia_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [164, 0, 'minecraft:dark_oak_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [164, 1, 'minecraft:dark_oak_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [164, 2, 'minecraft:dark_oak_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [164, 3, 'minecraft:dark_oak_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [164, 4, 'minecraft:dark_oak_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [164, 5, 'minecraft:dark_oak_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [164, 6, 'minecraft:dark_oak_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [164, 7, 'minecraft:dark_oak_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [165, 0, 'minecraft:slime', []],
        [166, 0, 'minecraft:barrier', []],
        [167, 0, 'minecraft:iron_trapdoor', ['facing=north', 'half=bottom', 'open=false']],
        [167, 1, 'minecraft:iron_trapdoor', ['facing=south', 'half=bottom', 'open=false']],
        [167, 2, 'minecraft:iron_trapdoor', ['facing=west', 'half=bottom', 'open=false']],
        [167, 3, 'minecraft:iron_trapdoor', ['facing=east', 'half=bottom', 'open=false']],
        [167, 4, 'minecraft:iron_trapdoor', ['facing=north', 'half=bottom', 'open=true']],
        [167, 5, 'minecraft:iron_trapdoor', ['facing=south', 'half=bottom', 'open=true']],
        [167, 6, 'minecraft:iron_trapdoor', ['facing=west', 'half=bottom', 'open=true']],
        [167, 7, 'minecraft:iron_trapdoor', ['facing=east', 'half=bottom', 'open=true']],
        [167, 8, 'minecraft:iron_trapdoor', ['facing=north', 'half=top', 'open=false']],
        [167, 9, 'minecraft:iron_trapdoor', ['facing=south', 'half=top', 'open=false']],
        [167, 10, 'minecraft:iron_trapdoor', ['facing=west', 'half=top', 'open=false']],
        [167, 11, 'minecraft:iron_trapdoor', ['facing=east', 'half=top', 'open=false']],
        [167, 12, 'minecraft:iron_trapdoor', ['facing=north', 'half=top', 'open=true']],
        [167, 13, 'minecraft:iron_trapdoor', ['facing=south', 'half=top', 'open=true']],
        [167, 14, 'minecraft:iron_trapdoor', ['facing=west', 'half=top', 'open=true']],
        [167, 15, 'minecraft:iron_trapdoor', ['facing=east', 'half=top', 'open=true']],
        [168, 0, 'minecraft:prismarine', ['variant=prismarine']],
        [168, 1, 'minecraft:prismarine', ['variant=prismarine_bricks']],
        [168, 2, 'minecraft:prismarine', ['variant=dark_prismarine']],
        [169, 0, 'minecraft:sea_lantern', []],
        [170, 0, 'minecraft:hay_block', ['axis=y']],
        [170, 4, 'minecraft:hay_block', ['axis=x']],
        [170, 8, 'minecraft:hay_block', ['axis=z']],
        [171, 0, 'minecraft:carpet', ['color=white']],
        [171, 1, 'minecraft:carpet', ['color=orange']],
        [171, 2, 'minecraft:carpet', ['color=magenta']],
        [171, 3, 'minecraft:carpet', ['color=light_blue']],
        [171, 4, 'minecraft:carpet', ['color=yellow']],
        [171, 5, 'minecraft:carpet', ['color=lime']],
        [171, 6, 'minecraft:carpet', ['color=pink']],
        [171, 7, 'minecraft:carpet', ['color=gray']],
        [171, 8, 'minecraft:carpet', ['color=silver']],
        [171, 9, 'minecraft:carpet', ['color=cyan']],
        [171, 10, 'minecraft:carpet', ['color=purple']],
        [171, 11, 'minecraft:carpet', ['color=blue']],
        [171, 12, 'minecraft:carpet', ['color=brown']],
        [171, 13, 'minecraft:carpet', ['color=green']],
        [171, 14, 'minecraft:carpet', ['color=red']],
        [171, 15, 'minecraft:carpet', ['color=black']],
        [172, 0, 'minecraft:hardened_clay', []],
        [173, 0, 'minecraft:coal_block', []],
        [174, 0, 'minecraft:packed_ice', []],
        [175, 0, 'minecraft:double_plant', ['facing=north', 'half=lower', 'variant=sunflower']],
        [175, 1, 'minecraft:double_plant', ['facing=north', 'half=lower', 'variant=syringa']],
        [175, 2, 'minecraft:double_plant', ['facing=north', 'half=lower', 'variant=double_grass']],
        [175, 3, 'minecraft:double_plant', ['facing=north', 'half=lower', 'variant=double_fern']],
        [175, 4, 'minecraft:double_plant', ['facing=north', 'half=lower', 'variant=double_rose']],
        [175, 5, 'minecraft:double_plant', ['facing=north', 'half=lower', 'variant=paeonia']],
        [175, 8, 'minecraft:double_plant', ['facing=north', 'half=upper', 'variant=sunflower']],
        [176, 0, 'minecraft:standing_banner', ['rotation=0']],
        [176, 1, 'minecraft:standing_banner', ['rotation=1']],
        [176, 2, 'minecraft:standing_banner', ['rotation=2']],
        [176, 3, 'minecraft:standing_banner', ['rotation=3']],
        [176, 4, 'minecraft:standing_banner', ['rotation=4']],
        [176, 5, 'minecraft:standing_banner', ['rotation=5']],
        [176, 6, 'minecraft:standing_banner', ['rotation=6']],
        [176, 7, 'minecraft:standing_banner', ['rotation=7']],
        [176, 8, 'minecraft:standing_banner', ['rotation=8']],
        [176, 9, 'minecraft:standing_banner', ['rotation=9']],
        [176, 10, 'minecraft:standing_banner', ['rotation=10']],
        [176, 11, 'minecraft:standing_banner', ['rotation=11']],
        [176, 12, 'minecraft:standing_banner', ['rotation=12']],
        [176, 13, 'minecraft:standing_banner', ['rotation=13']],
        [176, 14, 'minecraft:standing_banner', ['rotation=14']],
        [176, 15, 'minecraft:standing_banner', ['rotation=15']],
        [177, 0, 'minecraft:wall_banner', ['facing=north']],
        [177, 3, 'minecraft:wall_banner', ['facing=south']],
        [177, 4, 'minecraft:wall_banner', ['facing=west']],
        [177, 5, 'minecraft:wall_banner', ['facing=east']],
        [178, 0, 'minecraft:daylight_detector_inverted', ['power=0']],
        [178, 1, 'minecraft:daylight_detector_inverted', ['power=1']],
        [178, 2, 'minecraft:daylight_detector_inverted', ['power=2']],
        [178, 3, 'minecraft:daylight_detector_inverted', ['power=3']],
        [178, 4, 'minecraft:daylight_detector_inverted', ['power=4']],
        [178, 5, 'minecraft:daylight_detector_inverted', ['power=5']],
        [178, 6, 'minecraft:daylight_detector_inverted', ['power=6']],
        [178, 7, 'minecraft:daylight_detector_inverted', ['power=7']],
        [178, 8, 'minecraft:daylight_detector_inverted', ['power=8']],
        [178, 9, 'minecraft:daylight_detector_inverted', ['power=9']],
        [178, 10, 'minecraft:daylight_detector_inverted', ['power=10']],
        [178, 11, 'minecraft:daylight_detector_inverted', ['power=11']],
        [178, 12, 'minecraft:daylight_detector_inverted', ['power=12']],
        [178, 13, 'minecraft:daylight_detector_inverted', ['power=13']],
        [178, 14, 'minecraft:daylight_detector_inverted', ['power=14']],
        [178, 15, 'minecraft:daylight_detector_inverted', ['power=15']],
        [179, 0, 'minecraft:red_sandstone', ['type=red_sandstone']],
        [179, 1, 'minecraft:red_sandstone', ['type=chiseled_red_sandstone']],
        [179, 2, 'minecraft:red_sandstone', ['type=smooth_red_sandstone']],
        [180, 0, 'minecraft:red_sandstone_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [180, 1, 'minecraft:red_sandstone_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [180, 2, 'minecraft:red_sandstone_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [180, 3, 'minecraft:red_sandstone_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [180, 4, 'minecraft:red_sandstone_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [180, 5, 'minecraft:red_sandstone_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [180, 6, 'minecraft:red_sandstone_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [180, 7, 'minecraft:red_sandstone_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [181, 0, 'minecraft:double_stone_slab2', ['seamless=false', 'variant=red_sandstone']],
        [181, 8, 'minecraft:double_stone_slab2', ['seamless=true', 'variant=red_sandstone']],
        [182, 0, 'minecraft:stone_slab2', ['half=bottom', 'variant=red_sandstone']],
        [182, 8, 'minecraft:stone_slab2', ['half=top', 'variant=red_sandstone']],
        [183, 0, 'minecraft:spruce_fence_gate', ['facing=south', 'in_wall=false', 'open=false', 'powered=false']],
        [183, 1, 'minecraft:spruce_fence_gate', ['facing=west', 'in_wall=false', 'open=false', 'powered=false']],
        [183, 2, 'minecraft:spruce_fence_gate', ['facing=north', 'in_wall=false', 'open=false', 'powered=false']],
        [183, 3, 'minecraft:spruce_fence_gate', ['facing=east', 'in_wall=false', 'open=false', 'powered=false']],
        [183, 4, 'minecraft:spruce_fence_gate', ['facing=south', 'in_wall=false', 'open=true', 'powered=false']],
        [183, 5, 'minecraft:spruce_fence_gate', ['facing=west', 'in_wall=false', 'open=true', 'powered=false']],
        [183, 6, 'minecraft:spruce_fence_gate', ['facing=north', 'in_wall=false', 'open=true', 'powered=false']],
        [183, 7, 'minecraft:spruce_fence_gate', ['facing=east', 'in_wall=false', 'open=true', 'powered=false']],
        [183, 8, 'minecraft:spruce_fence_gate', ['facing=south', 'in_wall=false', 'open=false', 'powered=true']],
        [183, 9, 'minecraft:spruce_fence_gate', ['facing=west', 'in_wall=false', 'open=false', 'powered=true']],
        [183, 10, 'minecraft:spruce_fence_gate', ['facing=north', 'in_wall=false', 'open=false', 'powered=true']],
        [183, 11, 'minecraft:spruce_fence_gate', ['facing=east', 'in_wall=false', 'open=false', 'powered=true']],
        [183, 12, 'minecraft:spruce_fence_gate', ['facing=south', 'in_wall=false', 'open=true', 'powered=true']],
        [183, 13, 'minecraft:spruce_fence_gate', ['facing=west', 'in_wall=false', 'open=true', 'powered=true']],
        [183, 14, 'minecraft:spruce_fence_gate', ['facing=north', 'in_wall=false', 'open=true', 'powered=true']],
        [183, 15, 'minecraft:spruce_fence_gate', ['facing=east', 'in_wall=false', 'open=true', 'powered=true']],
        [184, 0, 'minecraft:birch_fence_gate', ['facing=south', 'in_wall=false', 'open=false', 'powered=false']],
        [184, 1, 'minecraft:birch_fence_gate', ['facing=west', 'in_wall=false', 'open=false', 'powered=false']],
        [184, 2, 'minecraft:birch_fence_gate', ['facing=north', 'in_wall=false', 'open=false', 'powered=false']],
        [184, 3, 'minecraft:birch_fence_gate', ['facing=east', 'in_wall=false', 'open=false', 'powered=false']],
        [184, 4, 'minecraft:birch_fence_gate', ['facing=south', 'in_wall=false', 'open=true', 'powered=false']],
        [184, 5, 'minecraft:birch_fence_gate', ['facing=west', 'in_wall=false', 'open=true', 'powered=false']],
        [184, 6, 'minecraft:birch_fence_gate', ['facing=north', 'in_wall=false', 'open=true', 'powered=false']],
        [184, 7, 'minecraft:birch_fence_gate', ['facing=east', 'in_wall=false', 'open=true', 'powered=false']],
        [184, 8, 'minecraft:birch_fence_gate', ['facing=south', 'in_wall=false', 'open=false', 'powered=true']],
        [184, 9, 'minecraft:birch_fence_gate', ['facing=west', 'in_wall=false', 'open=false', 'powered=true']],
        [184, 10, 'minecraft:birch_fence_gate', ['facing=north', 'in_wall=false', 'open=false', 'powered=true']],
        [184, 11, 'minecraft:birch_fence_gate', ['facing=east', 'in_wall=false', 'open=false', 'powered=true']],
        [184, 12, 'minecraft:birch_fence_gate', ['facing=south', 'in_wall=false', 'open=true', 'powered=true']],
        [184, 13, 'minecraft:birch_fence_gate', ['facing=west', 'in_wall=false', 'open=true', 'powered=true']],
        [184, 14, 'minecraft:birch_fence_gate', ['facing=north', 'in_wall=false', 'open=true', 'powered=true']],
        [184, 15, 'minecraft:birch_fence_gate', ['facing=east', 'in_wall=false', 'open=true', 'powered=true']],
        [185, 0, 'minecraft:jungle_fence_gate', ['facing=south', 'in_wall=false', 'open=false', 'powered=false']],
        [185, 1, 'minecraft:jungle_fence_gate', ['facing=west', 'in_wall=false', 'open=false', 'powered=false']],
        [185, 2, 'minecraft:jungle_fence_gate', ['facing=north', 'in_wall=false', 'open=false', 'powered=false']],
        [185, 3, 'minecraft:jungle_fence_gate', ['facing=east', 'in_wall=false', 'open=false', 'powered=false']],
        [185, 4, 'minecraft:jungle_fence_gate', ['facing=south', 'in_wall=false', 'open=true', 'powered=false']],
        [185, 5, 'minecraft:jungle_fence_gate', ['facing=west', 'in_wall=false', 'open=true', 'powered=false']],
        [185, 6, 'minecraft:jungle_fence_gate', ['facing=north', 'in_wall=false', 'open=true', 'powered=false']],
        [185, 7, 'minecraft:jungle_fence_gate', ['facing=east', 'in_wall=false', 'open=true', 'powered=false']],
        [185, 8, 'minecraft:jungle_fence_gate', ['facing=south', 'in_wall=false', 'open=false', 'powered=true']],
        [185, 9, 'minecraft:jungle_fence_gate', ['facing=west', 'in_wall=false', 'open=false', 'powered=true']],
        [185, 10, 'minecraft:jungle_fence_gate', ['facing=north', 'in_wall=false', 'open=false', 'powered=true']],
        [185, 11, 'minecraft:jungle_fence_gate', ['facing=east', 'in_wall=false', 'open=false', 'powered=true']],
        [185, 12, 'minecraft:jungle_fence_gate', ['facing=south', 'in_wall=false', 'open=true', 'powered=true']],
        [185, 13, 'minecraft:jungle_fence_gate', ['facing=west', 'in_wall=false', 'open=true', 'powered=true']],
        [185, 14, 'minecraft:jungle_fence_gate', ['facing=north', 'in_wall=false', 'open=true', 'powered=true']],
        [185, 15, 'minecraft:jungle_fence_gate', ['facing=east', 'in_wall=false', 'open=true', 'powered=true']],
        [186, 0, 'minecraft:dark_oak_fence_gate', ['facing=south', 'in_wall=false', 'open=false', 'powered=false']],
        [186, 1, 'minecraft:dark_oak_fence_gate', ['facing=west', 'in_wall=false', 'open=false', 'powered=false']],
        [186, 2, 'minecraft:dark_oak_fence_gate', ['facing=north', 'in_wall=false', 'open=false', 'powered=false']],
        [186, 3, 'minecraft:dark_oak_fence_gate', ['facing=east', 'in_wall=false', 'open=false', 'powered=false']],
        [186, 4, 'minecraft:dark_oak_fence_gate', ['facing=south', 'in_wall=false', 'open=true', 'powered=false']],
        [186, 5, 'minecraft:dark_oak_fence_gate', ['facing=west', 'in_wall=false', 'open=true', 'powered=false']],
        [186, 6, 'minecraft:dark_oak_fence_gate', ['facing=north', 'in_wall=false', 'open=true', 'powered=false']],
        [186, 7, 'minecraft:dark_oak_fence_gate', ['facing=east', 'in_wall=false', 'open=true', 'powered=false']],
        [186, 8, 'minecraft:dark_oak_fence_gate', ['facing=south', 'in_wall=false', 'open=false', 'powered=true']],
        [186, 9, 'minecraft:dark_oak_fence_gate', ['facing=west', 'in_wall=false', 'open=false', 'powered=true']],
        [186, 10, 'minecraft:dark_oak_fence_gate', ['facing=north', 'in_wall=false', 'open=false', 'powered=true']],
        [186, 11, 'minecraft:dark_oak_fence_gate', ['facing=east', 'in_wall=false', 'open=false', 'powered=true']],
        [186, 12, 'minecraft:dark_oak_fence_gate', ['facing=south', 'in_wall=false', 'open=true', 'powered=true']],
        [186, 13, 'minecraft:dark_oak_fence_gate', ['facing=west', 'in_wall=false', 'open=true', 'powered=true']],
        [186, 14, 'minecraft:dark_oak_fence_gate', ['facing=north', 'in_wall=false', 'open=true', 'powered=true']],
        [186, 15, 'minecraft:dark_oak_fence_gate', ['facing=east', 'in_wall=false', 'open=true', 'powered=true']],
        [187, 0, 'minecraft:acacia_fence_gate', ['facing=south', 'in_wall=false', 'open=false', 'powered=false']],
        [187, 1, 'minecraft:acacia_fence_gate', ['facing=west', 'in_wall=false', 'open=false', 'powered=false']],
        [187, 2, 'minecraft:acacia_fence_gate', ['facing=north', 'in_wall=false', 'open=false', 'powered=false']],
        [187, 3, 'minecraft:acacia_fence_gate', ['facing=east', 'in_wall=false', 'open=false', 'powered=false']],
        [187, 4, 'minecraft:acacia_fence_gate', ['facing=south', 'in_wall=false', 'open=true', 'powered=false']],
        [187, 5, 'minecraft:acacia_fence_gate', ['facing=west', 'in_wall=false', 'open=true', 'powered=false']],
        [187, 6, 'minecraft:acacia_fence_gate', ['facing=north', 'in_wall=false', 'open=true', 'powered=false']],
        [187, 7, 'minecraft:acacia_fence_gate', ['facing=east', 'in_wall=false', 'open=true', 'powered=false']],
        [187, 8, 'minecraft:acacia_fence_gate', ['facing=south', 'in_wall=false', 'open=false', 'powered=true']],
        [187, 9, 'minecraft:acacia_fence_gate', ['facing=west', 'in_wall=false', 'open=false', 'powered=true']],
        [187, 10, 'minecraft:acacia_fence_gate', ['facing=north', 'in_wall=false', 'open=false', 'powered=true']],
        [187, 11, 'minecraft:acacia_fence_gate', ['facing=east', 'in_wall=false', 'open=false', 'powered=true']],
        [187, 12, 'minecraft:acacia_fence_gate', ['facing=south', 'in_wall=false', 'open=true', 'powered=true']],
        [187, 13, 'minecraft:acacia_fence_gate', ['facing=west', 'in_wall=false', 'open=true', 'powered=true']],
        [187, 14, 'minecraft:acacia_fence_gate', ['facing=north', 'in_wall=false', 'open=true', 'powered=true']],
        [187, 15, 'minecraft:acacia_fence_gate', ['facing=east', 'in_wall=false', 'open=true', 'powered=true']],
        [188, 0, 'minecraft:spruce_fence', ['east=false', 'north=false', 'south=false', 'west=false']],
        [189, 0, 'minecraft:birch_fence', ['east=false', 'north=false', 'south=false', 'west=false']],
        [190, 0, 'minecraft:jungle_fence', ['east=false', 'north=false', 'south=false', 'west=false']],
        [191, 0, 'minecraft:dark_oak_fence', ['east=false', 'north=false', 'south=false', 'west=false']],
        [192, 0, 'minecraft:acacia_fence', ['east=false', 'north=false', 'south=false', 'west=false']],
        [193, 0, 'minecraft:spruce_door', ['facing=east', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [193, 1, 'minecraft:spruce_door', ['facing=south', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [193, 2, 'minecraft:spruce_door', ['facing=west', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [193, 3, 'minecraft:spruce_door', ['facing=north', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [193, 4, 'minecraft:spruce_door', ['facing=east', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [193, 5, 'minecraft:spruce_door', ['facing=south', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [193, 6, 'minecraft:spruce_door', ['facing=west', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [193, 7, 'minecraft:spruce_door', ['facing=north', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [193, 8, 'minecraft:spruce_door', ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=false']],
        [193, 9, 'minecraft:spruce_door', ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=false']],
        [193, 10, 'minecraft:spruce_door', ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=true']],
        [193, 11, 'minecraft:spruce_door', ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=true']],
        [194, 0, 'minecraft:birch_door', ['facing=east', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [194, 1, 'minecraft:birch_door', ['facing=south', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [194, 2, 'minecraft:birch_door', ['facing=west', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [194, 3, 'minecraft:birch_door', ['facing=north', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [194, 4, 'minecraft:birch_door', ['facing=east', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [194, 5, 'minecraft:birch_door', ['facing=south', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [194, 6, 'minecraft:birch_door', ['facing=west', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [194, 7, 'minecraft:birch_door', ['facing=north', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [194, 8, 'minecraft:birch_door', ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=false']],
        [194, 9, 'minecraft:birch_door', ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=false']],
        [194, 10, 'minecraft:birch_door', ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=true']],
        [194, 11, 'minecraft:birch_door', ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=true']],
        [195, 0, 'minecraft:jungle_door', ['facing=east', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [195, 1, 'minecraft:jungle_door', ['facing=south', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [195, 2, 'minecraft:jungle_door', ['facing=west', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [195, 3, 'minecraft:jungle_door', ['facing=north', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [195, 4, 'minecraft:jungle_door', ['facing=east', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [195, 5, 'minecraft:jungle_door', ['facing=south', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [195, 6, 'minecraft:jungle_door', ['facing=west', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [195, 7, 'minecraft:jungle_door', ['facing=north', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [195, 8, 'minecraft:jungle_door', ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=false']],
        [195, 9, 'minecraft:jungle_door', ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=false']],
        [195, 10, 'minecraft:jungle_door', ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=true']],
        [195, 11, 'minecraft:jungle_door', ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=true']],
        [196, 0, 'minecraft:acacia_door', ['facing=east', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [196, 1, 'minecraft:acacia_door', ['facing=south', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [196, 2, 'minecraft:acacia_door', ['facing=west', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [196, 3, 'minecraft:acacia_door', ['facing=north', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [196, 4, 'minecraft:acacia_door', ['facing=east', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [196, 5, 'minecraft:acacia_door', ['facing=south', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [196, 6, 'minecraft:acacia_door', ['facing=west', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [196, 7, 'minecraft:acacia_door', ['facing=north', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [196, 8, 'minecraft:acacia_door', ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=false']],
        [196, 9, 'minecraft:acacia_door', ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=false']],
        [196, 10, 'minecraft:acacia_door', ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=true']],
        [196, 11, 'minecraft:acacia_door', ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=true']],
        [197, 0, 'minecraft:dark_oak_door', ['facing=east', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [
            197,
            1,
            'minecraft:dark_oak_door',
            ['facing=south', 'half=lower', 'hinge=left', 'open=false', 'powered=false']
        ],
        [197, 2, 'minecraft:dark_oak_door', ['facing=west', 'half=lower', 'hinge=left', 'open=false', 'powered=false']],
        [
            197,
            3,
            'minecraft:dark_oak_door',
            ['facing=north', 'half=lower', 'hinge=left', 'open=false', 'powered=false']
        ],
        [197, 4, 'minecraft:dark_oak_door', ['facing=east', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [197, 5, 'minecraft:dark_oak_door', ['facing=south', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [197, 6, 'minecraft:dark_oak_door', ['facing=west', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [197, 7, 'minecraft:dark_oak_door', ['facing=north', 'half=lower', 'hinge=left', 'open=true', 'powered=false']],
        [
            197,
            8,
            'minecraft:dark_oak_door',
            ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=false']
        ],
        [
            197,
            9,
            'minecraft:dark_oak_door',
            ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=false']
        ],
        [
            197,
            10,
            'minecraft:dark_oak_door',
            ['facing=north', 'half=upper', 'hinge=left', 'open=false', 'powered=true']
        ],
        [
            197,
            11,
            'minecraft:dark_oak_door',
            ['facing=north', 'half=upper', 'hinge=right', 'open=false', 'powered=true']
        ],
        [198, 0, 'minecraft:end_rod', ['facing=down']],
        [198, 1, 'minecraft:end_rod', ['facing=up']],
        [198, 2, 'minecraft:end_rod', ['facing=north']],
        [198, 3, 'minecraft:end_rod', ['facing=south']],
        [198, 4, 'minecraft:end_rod', ['facing=west']],
        [198, 5, 'minecraft:end_rod', ['facing=east']],
        [
            199,
            0,
            'minecraft:chorus_plant',
            ['down=false', 'east=false', 'north=false', 'south=false', 'up=false', 'west=false']
        ],
        [200, 0, 'minecraft:chorus_flower', ['age=0']],
        [200, 1, 'minecraft:chorus_flower', ['age=1']],
        [200, 2, 'minecraft:chorus_flower', ['age=2']],
        [200, 3, 'minecraft:chorus_flower', ['age=3']],
        [200, 4, 'minecraft:chorus_flower', ['age=4']],
        [200, 5, 'minecraft:chorus_flower', ['age=5']],
        [201, 0, 'minecraft:purpur_block', []],
        [202, 0, 'minecraft:purpur_pillar', ['axis=y']],
        [202, 4, 'minecraft:purpur_pillar', ['axis=x']],
        [202, 8, 'minecraft:purpur_pillar', ['axis=z']],
        [203, 0, 'minecraft:purpur_stairs', ['facing=east', 'half=bottom', 'shape=straight']],
        [203, 1, 'minecraft:purpur_stairs', ['facing=west', 'half=bottom', 'shape=straight']],
        [203, 2, 'minecraft:purpur_stairs', ['facing=south', 'half=bottom', 'shape=straight']],
        [203, 3, 'minecraft:purpur_stairs', ['facing=north', 'half=bottom', 'shape=straight']],
        [203, 4, 'minecraft:purpur_stairs', ['facing=east', 'half=top', 'shape=straight']],
        [203, 5, 'minecraft:purpur_stairs', ['facing=west', 'half=top', 'shape=straight']],
        [203, 6, 'minecraft:purpur_stairs', ['facing=south', 'half=top', 'shape=straight']],
        [203, 7, 'minecraft:purpur_stairs', ['facing=north', 'half=top', 'shape=straight']],
        [204, 0, 'minecraft:purpur_double_slab', ['variant=default']],
        [205, 0, 'minecraft:purpur_slab', ['half=bottom', 'variant=default']],
        [205, 8, 'minecraft:purpur_slab', ['half=top', 'variant=default']],
        [206, 0, 'minecraft:end_bricks', []],
        [207, 0, 'minecraft:beetroots', ['age=0']],
        [207, 1, 'minecraft:beetroots', ['age=1']],
        [207, 2, 'minecraft:beetroots', ['age=2']],
        [207, 3, 'minecraft:beetroots', ['age=3']],
        [208, 0, 'minecraft:grass_path', []],
        [209, 0, 'minecraft:end_gateway', []],
        [210, 0, 'minecraft:repeating_command_block', ['conditional=false', 'facing=down']],
        [210, 1, 'minecraft:repeating_command_block', ['conditional=false', 'facing=up']],
        [210, 2, 'minecraft:repeating_command_block', ['conditional=false', 'facing=north']],
        [210, 3, 'minecraft:repeating_command_block', ['conditional=false', 'facing=south']],
        [210, 4, 'minecraft:repeating_command_block', ['conditional=false', 'facing=west']],
        [210, 5, 'minecraft:repeating_command_block', ['conditional=false', 'facing=east']],
        [210, 8, 'minecraft:repeating_command_block', ['conditional=true', 'facing=down']],
        [210, 9, 'minecraft:repeating_command_block', ['conditional=true', 'facing=up']],
        [210, 10, 'minecraft:repeating_command_block', ['conditional=true', 'facing=north']],
        [210, 11, 'minecraft:repeating_command_block', ['conditional=true', 'facing=south']],
        [210, 12, 'minecraft:repeating_command_block', ['conditional=true', 'facing=west']],
        [210, 13, 'minecraft:repeating_command_block', ['conditional=true', 'facing=east']],
        [211, 0, 'minecraft:chain_command_block', ['conditional=false', 'facing=down']],
        [211, 1, 'minecraft:chain_command_block', ['conditional=false', 'facing=up']],
        [211, 2, 'minecraft:chain_command_block', ['conditional=false', 'facing=north']],
        [211, 3, 'minecraft:chain_command_block', ['conditional=false', 'facing=south']],
        [211, 4, 'minecraft:chain_command_block', ['conditional=false', 'facing=west']],
        [211, 5, 'minecraft:chain_command_block', ['conditional=false', 'facing=east']],
        [211, 8, 'minecraft:chain_command_block', ['conditional=true', 'facing=down']],
        [211, 9, 'minecraft:chain_command_block', ['conditional=true', 'facing=up']],
        [211, 10, 'minecraft:chain_command_block', ['conditional=true', 'facing=north']],
        [211, 11, 'minecraft:chain_command_block', ['conditional=true', 'facing=south']],
        [211, 12, 'minecraft:chain_command_block', ['conditional=true', 'facing=west']],
        [211, 13, 'minecraft:chain_command_block', ['conditional=true', 'facing=east']],
        [212, 0, 'minecraft:frosted_ice', ['age=0']],
        [212, 1, 'minecraft:frosted_ice', ['age=1']],
        [212, 2, 'minecraft:frosted_ice', ['age=2']],
        [212, 3, 'minecraft:frosted_ice', ['age=3']],
        [213, 0, 'minecraft:magma', []],
        [214, 0, 'minecraft:nether_wart_block', []],
        [215, 0, 'minecraft:red_nether_brick', []],
        [216, 0, 'minecraft:bone_block', ['axis=y']],
        [216, 4, 'minecraft:bone_block', ['axis=x']],
        [216, 8, 'minecraft:bone_block', ['axis=z']],
        [217, 0, 'minecraft:structure_void', []],
        [218, 0, 'minecraft:observer', ['facing=down', 'powered=false']],
        [218, 1, 'minecraft:observer', ['facing=up', 'powered=false']],
        [218, 2, 'minecraft:observer', ['facing=north', 'powered=false']],
        [218, 3, 'minecraft:observer', ['facing=south', 'powered=false']],
        [218, 4, 'minecraft:observer', ['facing=west', 'powered=false']],
        [218, 5, 'minecraft:observer', ['facing=east', 'powered=false']],
        [219, 0, 'minecraft:white_shulker_box', ['facing=down']],
        [219, 1, 'minecraft:white_shulker_box', ['facing=up']],
        [219, 2, 'minecraft:white_shulker_box', ['facing=north']],
        [219, 3, 'minecraft:white_shulker_box', ['facing=south']],
        [219, 4, 'minecraft:white_shulker_box', ['facing=west']],
        [219, 5, 'minecraft:white_shulker_box', ['facing=east']],
        [220, 0, 'minecraft:orange_shulker_box', ['facing=down']],
        [220, 1, 'minecraft:orange_shulker_box', ['facing=up']],
        [220, 2, 'minecraft:orange_shulker_box', ['facing=north']],
        [220, 3, 'minecraft:orange_shulker_box', ['facing=south']],
        [220, 4, 'minecraft:orange_shulker_box', ['facing=west']],
        [220, 5, 'minecraft:orange_shulker_box', ['facing=east']],
        [221, 0, 'minecraft:magenta_shulker_box', ['facing=down']],
        [221, 1, 'minecraft:magenta_shulker_box', ['facing=up']],
        [221, 2, 'minecraft:magenta_shulker_box', ['facing=north']],
        [221, 3, 'minecraft:magenta_shulker_box', ['facing=south']],
        [221, 4, 'minecraft:magenta_shulker_box', ['facing=west']],
        [221, 5, 'minecraft:magenta_shulker_box', ['facing=east']],
        [222, 0, 'minecraft:light_blue_shulker_box', ['facing=down']],
        [222, 1, 'minecraft:light_blue_shulker_box', ['facing=up']],
        [222, 2, 'minecraft:light_blue_shulker_box', ['facing=north']],
        [222, 3, 'minecraft:light_blue_shulker_box', ['facing=south']],
        [222, 4, 'minecraft:light_blue_shulker_box', ['facing=west']],
        [222, 5, 'minecraft:light_blue_shulker_box', ['facing=east']],
        [223, 0, 'minecraft:yellow_shulker_box', ['facing=down']],
        [223, 1, 'minecraft:yellow_shulker_box', ['facing=up']],
        [223, 2, 'minecraft:yellow_shulker_box', ['facing=north']],
        [223, 3, 'minecraft:yellow_shulker_box', ['facing=south']],
        [223, 4, 'minecraft:yellow_shulker_box', ['facing=west']],
        [223, 5, 'minecraft:yellow_shulker_box', ['facing=east']],
        [224, 0, 'minecraft:lime_shulker_box', ['facing=down']],
        [224, 1, 'minecraft:lime_shulker_box', ['facing=up']],
        [224, 2, 'minecraft:lime_shulker_box', ['facing=north']],
        [224, 3, 'minecraft:lime_shulker_box', ['facing=south']],
        [224, 4, 'minecraft:lime_shulker_box', ['facing=west']],
        [224, 5, 'minecraft:lime_shulker_box', ['facing=east']],
        [225, 0, 'minecraft:pink_shulker_box', ['facing=down']],
        [225, 1, 'minecraft:pink_shulker_box', ['facing=up']],
        [225, 2, 'minecraft:pink_shulker_box', ['facing=north']],
        [225, 3, 'minecraft:pink_shulker_box', ['facing=south']],
        [225, 4, 'minecraft:pink_shulker_box', ['facing=west']],
        [225, 5, 'minecraft:pink_shulker_box', ['facing=east']],
        [226, 0, 'minecraft:gray_shulker_box', ['facing=down']],
        [226, 1, 'minecraft:gray_shulker_box', ['facing=up']],
        [226, 2, 'minecraft:gray_shulker_box', ['facing=north']],
        [226, 3, 'minecraft:gray_shulker_box', ['facing=south']],
        [226, 4, 'minecraft:gray_shulker_box', ['facing=west']],
        [226, 5, 'minecraft:gray_shulker_box', ['facing=east']],
        [227, 0, 'minecraft:silver_shulker_box', ['facing=down']],
        [227, 1, 'minecraft:silver_shulker_box', ['facing=up']],
        [227, 2, 'minecraft:silver_shulker_box', ['facing=north']],
        [227, 3, 'minecraft:silver_shulker_box', ['facing=south']],
        [227, 4, 'minecraft:silver_shulker_box', ['facing=west']],
        [227, 5, 'minecraft:silver_shulker_box', ['facing=east']],
        [228, 0, 'minecraft:cyan_shulker_box', ['facing=down']],
        [228, 1, 'minecraft:cyan_shulker_box', ['facing=up']],
        [228, 2, 'minecraft:cyan_shulker_box', ['facing=north']],
        [228, 3, 'minecraft:cyan_shulker_box', ['facing=south']],
        [228, 4, 'minecraft:cyan_shulker_box', ['facing=west']],
        [228, 5, 'minecraft:cyan_shulker_box', ['facing=east']],
        [229, 0, 'minecraft:purple_shulker_box', ['facing=down']],
        [229, 1, 'minecraft:purple_shulker_box', ['facing=up']],
        [229, 2, 'minecraft:purple_shulker_box', ['facing=north']],
        [229, 3, 'minecraft:purple_shulker_box', ['facing=south']],
        [229, 4, 'minecraft:purple_shulker_box', ['facing=west']],
        [229, 5, 'minecraft:purple_shulker_box', ['facing=east']],
        [230, 0, 'minecraft:blue_shulker_box', ['facing=down']],
        [230, 1, 'minecraft:blue_shulker_box', ['facing=up']],
        [230, 2, 'minecraft:blue_shulker_box', ['facing=north']],
        [230, 3, 'minecraft:blue_shulker_box', ['facing=south']],
        [230, 4, 'minecraft:blue_shulker_box', ['facing=west']],
        [230, 5, 'minecraft:blue_shulker_box', ['facing=east']],
        [231, 0, 'minecraft:brown_shulker_box', ['facing=down']],
        [231, 1, 'minecraft:brown_shulker_box', ['facing=up']],
        [231, 2, 'minecraft:brown_shulker_box', ['facing=north']],
        [231, 3, 'minecraft:brown_shulker_box', ['facing=south']],
        [231, 4, 'minecraft:brown_shulker_box', ['facing=west']],
        [231, 5, 'minecraft:brown_shulker_box', ['facing=east']],
        [232, 0, 'minecraft:green_shulker_box', ['facing=down']],
        [232, 1, 'minecraft:green_shulker_box', ['facing=up']],
        [232, 2, 'minecraft:green_shulker_box', ['facing=north']],
        [232, 3, 'minecraft:green_shulker_box', ['facing=south']],
        [232, 4, 'minecraft:green_shulker_box', ['facing=west']],
        [232, 5, 'minecraft:green_shulker_box', ['facing=east']],
        [233, 0, 'minecraft:red_shulker_box', ['facing=down']],
        [233, 1, 'minecraft:red_shulker_box', ['facing=up']],
        [233, 2, 'minecraft:red_shulker_box', ['facing=north']],
        [233, 3, 'minecraft:red_shulker_box', ['facing=south']],
        [233, 4, 'minecraft:red_shulker_box', ['facing=west']],
        [233, 5, 'minecraft:red_shulker_box', ['facing=east']],
        [234, 0, 'minecraft:black_shulker_box', ['facing=down']],
        [234, 1, 'minecraft:black_shulker_box', ['facing=up']],
        [234, 2, 'minecraft:black_shulker_box', ['facing=north']],
        [234, 3, 'minecraft:black_shulker_box', ['facing=south']],
        [234, 4, 'minecraft:black_shulker_box', ['facing=west']],
        [234, 5, 'minecraft:black_shulker_box', ['facing=east']],
        [235, 0, 'minecraft:white_glazed_terracotta', ['facing=south']],
        [235, 1, 'minecraft:white_glazed_terracotta', ['facing=west']],
        [235, 2, 'minecraft:white_glazed_terracotta', ['facing=north']],
        [235, 3, 'minecraft:white_glazed_terracotta', ['facing=east']],
        [236, 0, 'minecraft:orange_glazed_terracotta', ['facing=south']],
        [236, 1, 'minecraft:orange_glazed_terracotta', ['facing=west']],
        [236, 2, 'minecraft:orange_glazed_terracotta', ['facing=north']],
        [236, 3, 'minecraft:orange_glazed_terracotta', ['facing=east']],
        [237, 0, 'minecraft:magenta_glazed_terracotta', ['facing=south']],
        [237, 1, 'minecraft:magenta_glazed_terracotta', ['facing=west']],
        [237, 2, 'minecraft:magenta_glazed_terracotta', ['facing=north']],
        [237, 3, 'minecraft:magenta_glazed_terracotta', ['facing=east']],
        [238, 0, 'minecraft:light_blue_glazed_terracotta', ['facing=south']],
        [238, 1, 'minecraft:light_blue_glazed_terracotta', ['facing=west']],
        [238, 2, 'minecraft:light_blue_glazed_terracotta', ['facing=north']],
        [238, 3, 'minecraft:light_blue_glazed_terracotta', ['facing=east']],
        [239, 0, 'minecraft:yellow_glazed_terracotta', ['facing=south']],
        [239, 1, 'minecraft:yellow_glazed_terracotta', ['facing=west']],
        [239, 2, 'minecraft:yellow_glazed_terracotta', ['facing=north']],
        [239, 3, 'minecraft:yellow_glazed_terracotta', ['facing=east']],
        [240, 0, 'minecraft:lime_glazed_terracotta', ['facing=south']],
        [240, 1, 'minecraft:lime_glazed_terracotta', ['facing=west']],
        [240, 2, 'minecraft:lime_glazed_terracotta', ['facing=north']],
        [240, 3, 'minecraft:lime_glazed_terracotta', ['facing=east']],
        [241, 0, 'minecraft:pink_glazed_terracotta', ['facing=south']],
        [241, 1, 'minecraft:pink_glazed_terracotta', ['facing=west']],
        [241, 2, 'minecraft:pink_glazed_terracotta', ['facing=north']],
        [241, 3, 'minecraft:pink_glazed_terracotta', ['facing=east']],
        [242, 0, 'minecraft:gray_glazed_terracotta', ['facing=south']],
        [242, 1, 'minecraft:gray_glazed_terracotta', ['facing=west']],
        [242, 2, 'minecraft:gray_glazed_terracotta', ['facing=north']],
        [242, 3, 'minecraft:gray_glazed_terracotta', ['facing=east']],
        [243, 0, 'minecraft:silver_glazed_terracotta', ['facing=south']],
        [243, 1, 'minecraft:silver_glazed_terracotta', ['facing=west']],
        [243, 2, 'minecraft:silver_glazed_terracotta', ['facing=north']],
        [243, 3, 'minecraft:silver_glazed_terracotta', ['facing=east']],
        [244, 0, 'minecraft:cyan_glazed_terracotta', ['facing=south']],
        [244, 1, 'minecraft:cyan_glazed_terracotta', ['facing=west']],
        [244, 2, 'minecraft:cyan_glazed_terracotta', ['facing=north']],
        [244, 3, 'minecraft:cyan_glazed_terracotta', ['facing=east']],
        [245, 0, 'minecraft:purple_glazed_terracotta', ['facing=south']],
        [245, 1, 'minecraft:purple_glazed_terracotta', ['facing=west']],
        [245, 2, 'minecraft:purple_glazed_terracotta', ['facing=north']],
        [245, 3, 'minecraft:purple_glazed_terracotta', ['facing=east']],
        [246, 0, 'minecraft:blue_glazed_terracotta', ['facing=south']],
        [246, 1, 'minecraft:blue_glazed_terracotta', ['facing=west']],
        [246, 2, 'minecraft:blue_glazed_terracotta', ['facing=north']],
        [246, 3, 'minecraft:blue_glazed_terracotta', ['facing=east']],
        [247, 0, 'minecraft:brown_glazed_terracotta', ['facing=south']],
        [247, 1, 'minecraft:brown_glazed_terracotta', ['facing=west']],
        [247, 2, 'minecraft:brown_glazed_terracotta', ['facing=north']],
        [247, 3, 'minecraft:brown_glazed_terracotta', ['facing=east']],
        [248, 0, 'minecraft:green_glazed_terracotta', ['facing=south']],
        [248, 1, 'minecraft:green_glazed_terracotta', ['facing=west']],
        [248, 2, 'minecraft:green_glazed_terracotta', ['facing=north']],
        [248, 3, 'minecraft:green_glazed_terracotta', ['facing=east']],
        [249, 0, 'minecraft:red_glazed_terracotta', ['facing=south']],
        [249, 1, 'minecraft:red_glazed_terracotta', ['facing=west']],
        [249, 2, 'minecraft:red_glazed_terracotta', ['facing=north']],
        [249, 3, 'minecraft:red_glazed_terracotta', ['facing=east']],
        [250, 0, 'minecraft:black_glazed_terracotta', ['facing=south']],
        [250, 1, 'minecraft:black_glazed_terracotta', ['facing=west']],
        [250, 2, 'minecraft:black_glazed_terracotta', ['facing=north']],
        [250, 3, 'minecraft:black_glazed_terracotta', ['facing=east']],
        [251, 0, 'minecraft:concrete', ['color=white']],
        [251, 1, 'minecraft:concrete', ['color=orange']],
        [251, 2, 'minecraft:concrete', ['color=magenta']],
        [251, 3, 'minecraft:concrete', ['color=light_blue']],
        [251, 4, 'minecraft:concrete', ['color=yellow']],
        [251, 5, 'minecraft:concrete', ['color=lime']],
        [251, 6, 'minecraft:concrete', ['color=pink']],
        [251, 7, 'minecraft:concrete', ['color=gray']],
        [251, 8, 'minecraft:concrete', ['color=silver']],
        [251, 9, 'minecraft:concrete', ['color=cyan']],
        [251, 10, 'minecraft:concrete', ['color=purple']],
        [251, 11, 'minecraft:concrete', ['color=blue']],
        [251, 12, 'minecraft:concrete', ['color=brown']],
        [251, 13, 'minecraft:concrete', ['color=green']],
        [251, 14, 'minecraft:concrete', ['color=red']],
        [251, 15, 'minecraft:concrete', ['color=black']],
        [252, 0, 'minecraft:concrete_powder', ['color=white']],
        [252, 1, 'minecraft:concrete_powder', ['color=orange']],
        [252, 2, 'minecraft:concrete_powder', ['color=magenta']],
        [252, 3, 'minecraft:concrete_powder', ['color=light_blue']],
        [252, 4, 'minecraft:concrete_powder', ['color=yellow']],
        [252, 5, 'minecraft:concrete_powder', ['color=lime']],
        [252, 6, 'minecraft:concrete_powder', ['color=pink']],
        [252, 7, 'minecraft:concrete_powder', ['color=gray']],
        [252, 8, 'minecraft:concrete_powder', ['color=silver']],
        [252, 9, 'minecraft:concrete_powder', ['color=cyan']],
        [252, 10, 'minecraft:concrete_powder', ['color=purple']],
        [252, 11, 'minecraft:concrete_powder', ['color=blue']],
        [252, 12, 'minecraft:concrete_powder', ['color=brown']],
        [252, 13, 'minecraft:concrete_powder', ['color=green']],
        [252, 14, 'minecraft:concrete_powder', ['color=red']],
        [252, 15, 'minecraft:concrete_powder', ['color=black']],
        [255, 0, 'minecraft:structure_block', ['mode=save']],
        [255, 1, 'minecraft:structure_block', ['mode=load']],
        [255, 2, 'minecraft:structure_block', ['mode=corner']],
        [255, 3, 'minecraft:structure_block', ['mode=data']]
    ]
}
