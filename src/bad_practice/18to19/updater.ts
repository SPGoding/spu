import Spuses from "./mappings/spuses";
import SpuScript from "../spu_script";
import ArgumentReader from "../utils/argument_reader";
import Checker from "./checker";
import Selector from "./selector";
import { getNbtCompound, getNbtList, isNumeric } from "../../utils/utils";
import { NbtCompound, NbtString, NbtList, NbtValue, NbtByte, NbtInt, NbtFloat } from "../../utils/nbt/nbt";
import Blocks from "./mappings/blocks";
import Items from "./mappings/items";

export class Updater18To19 {
    /**
        Returns an result map from an 1.12 command and an 1.12 spus.
        @param cmd An 1.12 minecraft command.
        @param spus An 1.12 spus defined in spuses.ts.
        @returns NULLABLE. A map filled with converted value.
        @example {'%n': 'converted value'}.
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

            if (spusArg[0] === '%') {
                map.set(`%${cnt++}`, Updater18To19.upArgument(cmdArg, spusArg))
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

    public static upLine(input: string) {
        if (/^\s*$/.test(input)) {
            return input
        } else {
            return Updater18To19.upCommand(input)
        }
    }

    private static upCommand(input: string) {
        let slash = false

        if (input.slice(0, 1) === '/') {
            input = input.slice(1)
            slash = true
        }

        for (const spusOld of Spuses.pairs.keys()) {
            let map = Updater18To19.getResultMap(input, spusOld)
            if (map) {
                let spusNew = Spuses.pairs.get(spusOld)
                if (spusNew) {
                    let spus = new SpuScript(spusNew)
                    let result = spus.compileWith(map)
                    if (slash) {
                        result = `/${result}`
                    }
                    return result
                }
            }
        }

        throw `Unknown command: ${input}`
    }

    private static upArgument(arg: string, spus: string) {
        switch (spus.slice(1)) {
            case 'block_nbt':
                return Updater18To19.upBlockNbt(arg)
            case 'bool':
                return arg
            case 'command':
                return Updater18To19.upCommand(arg)
            case 'entity':
                return arg
            case 'entity_nbt':
                return Updater18To19.upEntityNbt(arg)
            case 'entity_type':
                return arg
            case 'item_nbt':
                return Updater18To19.upItemNbt(arg)
            case 'item_tag_nbt':
                return Updater18To19.upItemTagNbt(arg)
            case 'json':
                return Updater18To19.upJson(arg)
            case 'literal':
                return arg
            case 'num':
                return arg
            case 'num_or_star':
                return arg
            case 'say_string':
                return arg
            case 'string':
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

    private static upBlockNbt(input: string) {
        const nbt = getNbtCompound(input, 'before 1.12')
        /* SpawnPotentials */ {
            const spawnPotentials = nbt.get('SpawnPotentials')
            if (spawnPotentials instanceof NbtList) {
                spawnPotentials.forEach((potential: NbtValue) => {
                    if (potential instanceof NbtCompound) {
                        let entity = potential.get('Entity')
                        if (entity instanceof NbtCompound) {
                            entity = getNbtCompound(Updater18To19.upEntityNbt(entity.toString()))
                            potential.set('Entity', entity)
                        }
                    }
                })
            }
        }
        /* SpawnData */ {
            let spawnData = nbt.get('SpawnData')
            if (spawnData instanceof NbtCompound) {
                spawnData = getNbtCompound(Updater18To19.upEntityNbt(spawnData.toString()))
                nbt.set('SpawnData', spawnData)
            }
        }
        return nbt.toString()
    }

    private static upEntityNbt(input_nbt: string) {
        let nbt = getNbtCompound(input_nbt, 'before 1.12')
        /* Riding */ {
            const riding = nbt.get('Riding')
            nbt.del('Riding')
            if (riding instanceof NbtCompound) {
                const passengers = new NbtList()
                const passenger = riding
                passengers.add(passenger)
                nbt.set('Passengers', passengers)
            }
        }
        /* Healf */ {
            const healF = nbt.get('HealF')
            nbt.del('HealF')
            if (healF instanceof NbtFloat || healF instanceof NbtInt) {
                const health = new NbtInt(healF.get())
                nbt.set('Health', health)
            }
        }
        /* DropChances */ {
            const dropChances = nbt.get('DropChances')
            nbt.del('DropChances')
            if (dropChances instanceof NbtList) {
                const armorDropChances = new NbtList()
                const handDropChances = new NbtList()
                armorDropChances.set(0, dropChances.get(0))
                armorDropChances.set(1, dropChances.get(1))
                armorDropChances.set(2, dropChances.get(2))
                armorDropChances.set(3, dropChances.get(3))
                handDropChances.set(0, dropChances.get(5))
                handDropChances.set(1, new NbtFloat(0))
                nbt.set('ArmorDropChances', armorDropChances)
                nbt.set('HandDropChances', handDropChances)
            }
        }
        /* Equipment */ {
            const equipment = nbt.get('Equipment')
            nbt.del('Equipment')
            if (equipment instanceof NbtList) {
                const armorItems = new NbtList()
                const handItems = new NbtList()
                armorItems.set(0, getNbtCompound(Updater18To19.upItemNbt(equipment.get(0).toString())))
                armorItems.set(1, getNbtCompound(Updater18To19.upItemNbt(equipment.get(1).toString())))
                armorItems.set(2, getNbtCompound(Updater18To19.upItemNbt(equipment.get(2).toString())))
                armorItems.set(3, getNbtCompound(Updater18To19.upItemNbt(equipment.get(3).toString())))
                handItems.set(0, getNbtCompound(Updater18To19.upItemNbt(equipment.get(4).toString())))
                handItems.set(1, new NbtCompound())
                nbt.set('ArmorItems', armorItems)
                nbt.set('HandItems', handItems)
            }
        }
        /* Properties (Type) */ {
            const properties = nbt.get('Properties')
            nbt.del('Properties')
            if (properties instanceof NbtCompound) {
                const type = nbt.get('Type')
                nbt.del('Type')
                const spawnData = properties
                if (type instanceof NbtString) {
                    spawnData.set('id', type)
                }
                nbt.set('SpawnData', spawnData)
            }
        }
        /* Type */ {
            const type = nbt.get('Type')
            nbt.del('Type')
            if (type instanceof NbtString) {
                const spawnData = new NbtCompound()
                spawnData.set('id', type)
                nbt.set('SpawnData', spawnData)
            }
        }
        /* Offers.Recipes[n].buy &
           Offers.Recipes[n].buyB & 
           Offers.Recipes[n].sell */ {
            const offers = nbt.get('Offers')
            if (offers instanceof NbtCompound) {
                const recipes = offers.get('Recipes')
                if (recipes instanceof NbtList) {
                    recipes.forEach((v: NbtValue) => {
                        if (v instanceof NbtCompound) {
                            let buy = v.get('buy')
                            let buyB = v.get('buyB')
                            let sell = v.get('sell')
                            if (buy instanceof NbtCompound) {
                                buy = getNbtCompound(Updater18To19.upItemNbt(buy.toString()))
                                v.set('buy', buy)
                            }
                            if (buyB instanceof NbtCompound) {
                                buyB = getNbtCompound(Updater18To19.upItemNbt(buyB.toString()))
                                v.set('buyB', buyB)
                            }
                            if (sell instanceof NbtCompound) {
                                sell = getNbtCompound(Updater18To19.upItemNbt(sell.toString()))
                                v.set('sell', sell)
                            }
                        }
                    })
                }
            }
        }
        /* Items */ {
            const items = nbt.get('Items')
            if (items instanceof NbtList) {
                for (let i = 0; i < items.length; i++) {
                    let item = items.get(i)
                    item = getNbtCompound(Updater18To19.upItemNbt(item.toString()))
                    items.set(i, item)
                }
            }
        }
        /* carried */ {
            const carried = nbt.get('carried')
            nbt.del('carried')
            if (carried instanceof NbtInt) {
                nbt.set('carried', new NbtString(Items.to19(carried.get())))
            }
        }
        /* DecorItem */ {
            let decorItem = nbt.get('DecorItem')
            nbt.del('DecorItem')
            if (decorItem instanceof NbtCompound) {
                nbt.set('DecorItem', getNbtCompound(decorItem.toString()))
            }
        }
        /* Inventory */ {
            const inventory = nbt.get('Inventory')
            if (inventory instanceof NbtList) {
                for (let i = 0; i < inventory.length; i++) {
                    let item = inventory.get(i)
                    item = getNbtCompound(Updater18To19.upItemNbt(item.toString()))
                    inventory.set(i, item)
                }
            }
        }
        /* inTile */ {
            const inTile = nbt.get('inTile')
            nbt.del('inTile')
            if (inTile instanceof NbtInt) {
                nbt.set('inTile', new NbtString(Blocks.to19(inTile.get())))
            }
        }
        /* Item */ {
            let item = nbt.get('Item')
            if (item instanceof NbtCompound) {
                item = getNbtCompound(Updater18To19.upItemNbt(item.toString()))
                nbt.set('Item', item)
            }
        }
        /* SelectedItem */ {
            let selectedItem = nbt.get('SelectedItem')
            if (selectedItem instanceof NbtCompound) {
                selectedItem = getNbtCompound(Updater18To19.upItemNbt(selectedItem.toString()))
                nbt.set('SelectedItem', selectedItem)
            }
        }
        /* FireworksItem */ {
            let fireworksItem = nbt.get('FireworksItem')
            if (fireworksItem instanceof NbtCompound) {
                fireworksItem = getNbtCompound(Updater18To19.upItemNbt(fireworksItem.toString()))
                nbt.set('FireworksItem', fireworksItem)
            }
        }
        /* TileID & TileEntityData */ {
            const tileId = nbt.get('TileID')
            nbt.del('TileID')
            if (tileId instanceof NbtInt) {
                nbt.set('TileID', new NbtString(Blocks.to19(tileId.get())))
            }

            let tileEntityData = nbt.get('TileEntityData')
            if (tileEntityData instanceof NbtCompound) {
                tileEntityData = getNbtCompound(Updater18To19.upBlockNbt(tileEntityData.toString()))
                nbt.set('TileEntityData', tileEntityData)
            }
        }
        /* DisplayTile */ {
            const displayTile = nbt.get('DisplayTile')
            nbt.del('DisplayTile')
            if (displayTile instanceof NbtInt) {
                nbt.set('DisplayTile', new NbtString(Blocks.to19(displayTile.get())))
            }
        }
        /* Command */ {
            const command = nbt.get('Command')
            if (command instanceof NbtString) {
                command.set(Updater18To19.upCommand(command.get()))
            }
        }
        return nbt.toString()
    }

    private static upItemNbt(input: string) {
        const nbt = getNbtCompound(input, 'before 1.12')
        /* tag */ {
            let tag = nbt.get('tag')
            if (tag instanceof NbtCompound) {
                tag = getNbtCompound(Updater18To19.upItemTagNbt(tag.toString()))
                nbt.set('tag', tag)
            }
        }
        /* id */ {
            let id = nbt.get('id')
            nbt.del('id')
            if (id instanceof NbtInt) {
                nbt.set('id', new NbtString(Blocks.to19(id.get())))
            }
        }
        return nbt.toString()
    }

    private static upItemTagNbt(input: string) {
        const nbt = getNbtCompound(input, 'before 1.12')
        /* EntityTag */ {
            let entityTag = nbt.get('EntityTag')
            if (entityTag instanceof NbtCompound) {
                entityTag = getNbtCompound(Updater18To19.upEntityNbt(entityTag.toString()))
                nbt.set('EntityTag', entityTag)
            }
        }
        /* BlockEntityTag */ {
            let blockEntityTag = nbt.get('BlockEntityTag')
            if (blockEntityTag instanceof NbtCompound) {
                blockEntityTag = getNbtCompound(Updater18To19.upBlockNbt(blockEntityTag.toString()))
                nbt.set('BlockEntityTag', blockEntityTag)
            }
        }
        return nbt.toString()
    }

    private static upJson(input: string) {
        if (input.slice(0, 1) === '"' || isNumeric(input) || Checker.isBool(input)) {
            return input
        } else if (input.slice(0, 1) === '[') {
            let json = JSON.parse(getNbtList(input, 'before 1.12').toJson())
            let result: string[] = []
            for (const i of json) {
                result.push(Updater18To19.upJson(JSON.stringify(i)))
            }
            return `[${result.join()}]`
        } else {
            let json = JSON.parse(getNbtCompound(input, 'before 1.12').toJson())
            if (json.selector) {
                let sel = new Selector()
                sel.parse(json.selector)
                json.selector = sel.to111()
            }

            if (
                json.clickEvent &&
                json.clickEvent.action &&
                (json.clickEvent.action === 'run_command' || json.clickEvent.action === 'suggest_command') &&
                json.clickEvent.value && json.clickEvent.value.slice(0, 1) === '/' && Checker.isCommand(json.clickEvent.value)
            ) {
                json.clickEvent.value = Updater18To19.upCommand(json.clickEvent.value)
            }

            if (json.extra) {
                json.extra = JSON.parse(Updater18To19.upJson(JSON.stringify(json.extra)))
            }

            return JSON.stringify(json).replace(/§/g, '\\u00a7')
        }
    }
}