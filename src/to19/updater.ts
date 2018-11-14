import { SpuScriptExecutor, WheelChief, Argument } from '../utils/wheel_chief/wheel_chief'
import { Updater } from '../utils/wheel_chief/updater'
import { UpdateResult, isNumeric, getNbtList, getNbtCompound } from '../utils/utils';
import { Commands18To19 } from './commands';
import { ArgumentParser } from '../utils/wheel_chief/argument_parsers';
import { TargetSelector as TargetSelector19 } from './target_selector'
import { NbtCompound, NbtFloat, NbtInt, NbtList, NbtString, NbtValue } from '../utils/nbt/nbt';
import Items from './mappings/items';
import Blocks from './mappings/blocks';

class SpuScriptExecutor18To19 implements SpuScriptExecutor {
    public execute(script: string, args: Argument[]) {
        let splited = script.split(' ')

        for (let i = 0; i < splited.length; i++) {
            if (splited[i].slice(0, 1) === '%') {
                splited[i] = args[parseInt(splited[i].slice(1))].value
            } else if (splited[i].slice(0, 1) === '$') {
                let params = splited[i].slice(1).split('%')
                switch (params[0]) {
                    default:
                        throw `Unexpected script method: '${params[0]}'.`
                }
            }
        }

        return splited.join(' ')
    }
}

class ArgumentParser18To19 extends ArgumentParser {
    protected parseMinecraftEntity(splited: string[], index: number): number {
        let join = splited[index]
        let result = ''

        if (join.charAt(0) !== '@') {
            return 1
        }

        result = TargetSelector19.tryParse(join)

        if (result === 'VALID') {
            return 1
        } else {
            for (let i = index + 1; i < splited.length; i++) {
                join += ' ' + splited[i]
                result = TargetSelector19.tryParse(join)
                if (result === 'VALID') {
                    return i - index + 1
                } else {
                    continue
                }
            }
            throw `Expected an entity selector: ${result}`
        }
    }

    protected parseMinecraftNbt(splited: string[], index: number): number {
        let exception
        for (let endIndex = splited.length; endIndex > index; endIndex--) {
            let test = splited.slice(index, endIndex).join(' ')
            try {
                getNbtCompound(test, 'before 1.12')
                return endIndex - index
            } catch (e) {
                exception = e
                continue
            }
        }
        throw exception
    }
}

export class UpdaterTo19 extends Updater {
    public static upLine(input: string, from: string): UpdateResult {
        const ans: UpdateResult = { command: input, warnings: [] }

        const result = new UpdaterTo19().upSpgodingCommand(ans.command)

        ans.command = result.command
        ans.warnings = ans.warnings.concat(result.warnings)

        return ans
    }

    public upArgument(input: string, updater: string) {
        switch (updater) {
            case 'spgoding:block_nbt':
                return this.upSpgodingBlockNbt(getNbtCompound(input, 'before 1.12')).toString()
            case 'spgoding:entity_nbt':
                return this.upSpgodingEntityNbt(getNbtCompound(input, 'before 1.12')).toString()
            case 'spgoding:item_nbt':
                return this.upSpgodingItemNbt(getNbtCompound(input, 'before 1.12')).toString()
            case 'spgoding:item_tag_nbt':
                return this.upSpgodingItemTagNbt(getNbtCompound(input, 'before 1.12')).toString()
            default:
                return super.upArgument(input, updater)
        }
    }

    protected upMinecraftComponent(input: string) {
        if (input.slice(0, 1) === '"' || isNumeric(input) || input === 'true' || input === 'false') {
            return input
        } else if (input.slice(0, 1) === '[') {
            let json = JSON.parse(getNbtList(input, 'before 1.12').toJson())
            let result: string[] = []
            for (const i of json) {
                result.push(this.upMinecraftComponent(JSON.stringify(i)))
            }
            return `[${result.join()}]`
        } else {
            let json = JSON.parse(getNbtCompound(input, 'before 1.12').toJson())
            if (json.selector) {
                json.selector = this.upMinecraftEntity(json.selector)
            }

            if (
                json.clickEvent &&
                json.clickEvent.action &&
                (json.clickEvent.action === 'run_command' || json.clickEvent.action === 'suggest_command') &&
                json.clickEvent.value && json.clickEvent.value.slice(0, 1) === '/') {
                try {
                    json.clickEvent.value = this.upSpgodingCommand(json.clickEvent.value).command
                } catch (ignored) {
                    // Take it easy.
                }
            }
            
            if (json.extra) {
                json.extra = JSON.parse(this.upMinecraftComponent(JSON.stringify(json.extra)))
            }
            
            return JSON.stringify(json).replace(/§/g, '\\u00a7')
        }
    }
    
    protected upSpgodingCommand(input: string) {
        const result = WheelChief.update(input, Commands18To19.commands,
            new ArgumentParser18To19(), this, new SpuScriptExecutor18To19())
        return { command: result.command, warnings: result.warnings }
    }

    protected upSpgodingEntityNbt(input: NbtCompound) {
        let ans = input

        /* Healf */ {
            const healF = ans.get('HealF')
            ans.del('HealF')
            if (healF instanceof NbtFloat || healF instanceof NbtInt) {
                const health = new NbtInt(healF.get())
                ans.set('Health', health)
            }
        }
        /* DropChances */ {
            const dropChances = ans.get('DropChances')
            ans.del('DropChances')
            if (dropChances instanceof NbtList) {
                const armorDropChances = new NbtList()
                const handDropChances = new NbtList()
                armorDropChances.set(0, dropChances.get(0))
                armorDropChances.set(1, dropChances.get(1))
                armorDropChances.set(2, dropChances.get(2))
                armorDropChances.set(3, dropChances.get(3))
                handDropChances.set(0, dropChances.get(5))
                handDropChances.set(1, new NbtFloat(0))
                ans.set('ArmorDropChances', armorDropChances)
                ans.set('HandDropChances', handDropChances)
            }
        }
        /* Equipment */ {
            const equipment = ans.get('Equipment')
            ans.del('Equipment')
            if (equipment instanceof NbtList) {
                const armorItems = new NbtList()
                const handItems = new NbtList()
                const handItem0 = equipment.get(0)
                const armorItem0 = equipment.get(1)
                const armorItem1 = equipment.get(2)
                const armorItem2 = equipment.get(3)
                const armorItem3 = equipment.get(4)
                if (handItem0 instanceof NbtCompound) {
                    handItems.set(0, this.upSpgodingItemNbt(handItem0))
                    handItems.set(1, new NbtCompound())
                    ans.set('HandItems', handItems)
                }
                if (armorItem0 instanceof NbtCompound) {
                    armorItems.set(0, this.upSpgodingItemNbt(armorItem0))
                }
                if (armorItem1 instanceof NbtCompound) {
                    armorItems.set(1, this.upSpgodingItemNbt(armorItem1))
                }
                if (armorItem2 instanceof NbtCompound) {
                    armorItems.set(2, this.upSpgodingItemNbt(armorItem2))
                }
                if (armorItem3 instanceof NbtCompound) {
                    armorItems.set(3, this.upSpgodingItemNbt(armorItem3))
                }
                ans.set('ArmorItems', armorItems)
            }
        }
        /* Properties (Type) */ {
            const properties = ans.get('Properties')
            ans.del('Properties')
            if (properties instanceof NbtCompound) {
                const type = ans.get('Type')
                ans.del('Type')
                const spawnData = properties
                if (type instanceof NbtString) {
                    spawnData.set('id', type)
                }
                ans.set('SpawnData', spawnData)
            }
        }
        /* Type */ {
            const type = ans.get('Type')
            ans.del('Type')
            if (type instanceof NbtString) {
                const spawnData = new NbtCompound()
                spawnData.set('id', type)
                ans.set('SpawnData', spawnData)
            }
        }
        /* Offers.Recipes[n].buy &
           Offers.Recipes[n].buyB & 
           Offers.Recipes[n].sell */ {
            const offers = ans.get('Offers')
            if (offers instanceof NbtCompound) {
                const recipes = offers.get('Recipes')
                if (recipes instanceof NbtList) {
                    recipes.forEach((v: NbtValue) => {
                        if (v instanceof NbtCompound) {
                            let buy = v.get('buy')
                            let buyB = v.get('buyB')
                            let sell = v.get('sell')
                            if (buy instanceof NbtCompound) {
                                buy = this.upSpgodingItemNbt(buy)
                                v.set('buy', buy)
                            }
                            if (buyB instanceof NbtCompound) {
                                buyB = this.upSpgodingItemNbt(buyB)
                                v.set('buyB', buyB)
                            }
                            if (sell instanceof NbtCompound) {
                                sell = this.upSpgodingItemNbt(sell)
                                v.set('sell', sell)
                            }
                        }
                    })
                }
            }
        }
        /* Items */ {
            const items = ans.get('Items')
            if (items instanceof NbtList) {
                for (let i = 0; i < items.length; i++) {
                    let item = items.get(i)
                    if (item instanceof NbtCompound) {
                        item = this.upSpgodingItemNbt(item)
                    }
                    items.set(i, item)
                }
            }
        }
        /* carried */ {
            const carried = ans.get('carried')
            ans.del('carried')
            if (carried instanceof NbtInt) {
                ans.set('carried', new NbtString(Items.to19(carried.get())))
            }
        }
        /* DecorItem */ {
            let decorItem = ans.get('DecorItem')
            ans.del('DecorItem')
            if (decorItem instanceof NbtCompound) {
                ans.set('DecorItem', decorItem)
            }
        }
        /* Inventory */ {
            const inventory = ans.get('Inventory')
            if (inventory instanceof NbtList) {
                for (let i = 0; i < inventory.length; i++) {
                    let item = inventory.get(i)
                    if (item instanceof NbtCompound) {
                        item = this.upSpgodingItemNbt(item)
                    }
                    inventory.set(i, item)
                }
            }
        }
        /* inTile */ {
            const inTile = ans.get('inTile')
            ans.del('inTile')
            if (inTile instanceof NbtInt) {
                ans.set('inTile', new NbtString(Blocks.to19(inTile.get())))
            }
        }
        /* Item */ {
            let item = ans.get('Item')
            if (item instanceof NbtCompound) {
                item = this.upSpgodingItemNbt(item)
                ans.set('Item', item)
            }
        }
        /* SelectedItem */ {
            let selectedItem = ans.get('SelectedItem')
            if (selectedItem instanceof NbtCompound) {
                selectedItem = this.upSpgodingItemNbt(selectedItem)
                ans.set('SelectedItem', selectedItem)
            }
        }
        /* FireworksItem */ {
            let fireworksItem = ans.get('FireworksItem')
            if (fireworksItem instanceof NbtCompound) {
                fireworksItem = this.upSpgodingItemNbt(fireworksItem)
                ans.set('FireworksItem', fireworksItem)
            }
        }
        /* TileID & TileEntityData */ {
            const tileId = ans.get('TileID')
            ans.del('TileID')
            if (tileId instanceof NbtInt) {
                ans.set('TileID', new NbtString(Blocks.to19(tileId.get())))
            }

            let tileEntityData = ans.get('TileEntityData')
            if (tileEntityData instanceof NbtCompound) {
                tileEntityData = this.upSpgodingBlockNbt(tileEntityData)
                ans.set('TileEntityData', tileEntityData)
            }
        }
        /* DisplayTile */ {
            const displayTile = ans.get('DisplayTile')
            ans.del('DisplayTile')
            if (displayTile instanceof NbtInt) {
                ans.set('DisplayTile', new NbtString(Blocks.to19(displayTile.get())))
            }
        }
        /* Command */ {
            const command = ans.get('Command')
            if (command instanceof NbtString) {
                command.set(this.upSpgodingCommand(command.get()).command)
            }
        }

        ans = super.upSpgodingEntityNbt(ans)
        return ans
    }

    protected upSpgodingItemNbt(input: NbtCompound) {
        let ans = super.upSpgodingItemNbt(input)

        /* id */ {
            let id = ans.get('id')
            ans.del('id')
            if (id instanceof NbtInt) {
                ans.set('id', new NbtString(Items.to19(id.get())))
            }
        }

        return ans
    }

    protected upSpgodingTargetSelector(input: string) {
        const sel = new TargetSelector19(input)

        return sel.toString()
    }
}
