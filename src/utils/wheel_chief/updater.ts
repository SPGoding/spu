import { getNbtCompound } from '../utils'
import { NbtString, NbtList, NbtCompound, NbtValue } from '../nbt/nbt'
import { TargetSelector } from '../target_selector'
import { BlockState } from '../block_state';
import { ItemStack } from '../item_stack';

export class Updater {
    public upArgument(input: string, updater: string): string {
        switch (updater) {
            case 'minecraft:block_predicate':
            case 'minecraft:block_state':
                return this.upMinecraftBlockState(new BlockState(input)).toString()
            case 'minecraft:component':
                return this.upMinecraftComponent(input)
            case 'minecraft:entity':
            case 'minecraft:game_profile':
            case 'minecraft:score_holder':
                return this.upMinecraftEntity(input)
            case 'minecraft:entity_summon':
                return this.upMinecraftEntitySummon(input)
            case 'minecraft:item_predicate':
            case 'minecraft:item_stack':
                return this.upMinecraftItemStack(new ItemStack(input)).toString()
            case 'minecraft:item_slot':
                return this.upMinecraftItemSlot(input)
            case 'minecraft:message':
                return this.upMinecraftMessage(input)
            case 'spgoding:block_name':
                return this.upSpgodingBlockName(input)
            case 'spgoding:block_nbt':
                return this.upSpgodingBlockNbt(getNbtCompound(input)).toString()
            case 'spgoding:command':
                return this.upSpgodingCommand(input)
            case 'spgoding:entity_nbt':
                return this.upSpgodingEntityNbt(getNbtCompound(input)).toString()
            case 'spgoding:item_name':
                return this.upSpgodingItemName(input)
            case 'spgoding:item_nbt':
                return this.upSpgodingItemNbt(getNbtCompound(input)).toString()
            case 'spgoding:item_tag_nbt':
                return this.upSpgodingItemTagNbt(getNbtCompound(input)).toString()
            default:
                return input
        }
    }

    public static upLine(input: string, from: string) {
        return input
    }

    protected upMinecraftBlockState(input: BlockState) {
        input.name = this.upSpgodingBlockName(input.name)
        if (input.nbt !== undefined) {
            input.nbt = this.upSpgodingBlockNbt(input.nbt)
        }

        return input
    }

    protected upMinecraftComponent(input: string) {
        if (input.slice(0, 1) === '"') {
            return input
        } else if (input.slice(0, 1) === '[') {
            let json = JSON.parse(input)
            let result: string[] = []
            for (const i of json) {
                result.push(this.upMinecraftComponent(JSON.stringify(i)))
            }
            return `[${result.join()}]`
        } else {
            let json = JSON.parse(input)
            if (json.selector) {
                json.selector = this.upSpgodingTargetSelector(json.selector)
            }

            if (
                json.clickEvent &&
                json.clickEvent.action &&
                (json.clickEvent.action === 'run_command' || json.clickEvent.action === 'suggest_command') &&
                json.clickEvent.value &&
                json.clickEvent.value.slice(0, 1) === '/'
            ) {
                try {
                    json.clickEvent.value = this.upSpgodingCommand(json.clickEvent.value)
                } catch {
                    // That's ok. Take it easy.
                }
            }

            if (json.extra) {
                json.extra = JSON.parse(this.upMinecraftComponent(JSON.stringify(json.extra)))
            }

            return JSON.stringify(json).replace(/§/g, '\\u00a7')
        }
    }

    protected upMinecraftEntity(input: string) {
        try {
            const selector = new TargetSelector(input)
            return this.upSpgodingTargetSelector(selector).toString()
        } catch {
            return input
        }
    }

    protected upMinecraftEntitySummon(input: string) {
        return input
    }

    protected upMinecraftItemStack(input: ItemStack) {
        input.name = this.upSpgodingItemName(input.name)
        if (input.nbt !== undefined) {
            input.nbt = this.upSpgodingItemTagNbt(input.nbt)
        }

        return input
    }

    protected upMinecraftItemSlot(input: string) {
        return input
    }

    protected upMinecraftMessage(input: string) {
        let parts = input.split('@')
        for (let i = 1; i < parts.length; i++) {
            try {
                const selector = new TargetSelector(`@${parts[i]}`)
                parts[i] = this.upSpgodingTargetSelector(selector).toString().slice(1)
            } catch {
                continue
            }
        }

        return parts.join('@')
    }

    protected upSpgodingBlockName(input: string) {
        return input
    }

    protected upSpgodingBlockNbt(input: NbtCompound) {
        /* Command */ {
            const command = input.get('Command')
            if (command instanceof NbtString) {
                command.set(this.upSpgodingCommand(command.get()))
            }
        }
        /* Items */ {
            const items = input.get('Items')
            if (items instanceof NbtList) {
                for (let i = 0; i < items.length; i++) {
                    let item = items.get(i)
                    if (item instanceof NbtCompound) {
                        item = this.upSpgodingItemNbt(item)
                        items.set(i, item)
                    }
                }
            }
        }
        /* RecordItem */ {
            let item = input.get('RecordItem')
            if (item instanceof NbtCompound) {
                item = this.upSpgodingItemNbt(item)
            }
        }
        /* TextN */ {
            let text1 = input.get('Text1')
            let text2 = input.get('Text2')
            let text3 = input.get('Text3')
            let text4 = input.get('Text4')
            if (text1 instanceof NbtString) {
                text1.set(this.upMinecraftComponent(text1.get()))
            }
            if (text2 instanceof NbtString) {
                text2.set(this.upMinecraftComponent(text2.get()))
            }
            if (text3 instanceof NbtString) {
                text3.set(this.upMinecraftComponent(text3.get()))
            }
            if (text4 instanceof NbtString) {
                text4.set(this.upMinecraftComponent(text4.get()))
            }
        }

        return input
    }

    protected upSpgodingCommand(input: string) {
        return input
    }

    protected upSpgodingEntityNbt(input: NbtCompound) {
        /* id */ {
            const id = input.get('id')
            if (id instanceof NbtString) {
                id.set(this.upMinecraftEntitySummon(id.get()))
            }
        }
        /* Passengers */ {
            const passengers = input.get('Passengers')
            if (passengers instanceof NbtList) {
                for (let i = 0; i < passengers.length; i++) {
                    let passenger = passengers.get(i)
                    if (passenger instanceof NbtCompound) {
                        passenger = this.upSpgodingEntityNbt(passenger)
                        passengers.set(i, passenger)
                    }
                }
            }
        }
        /* Offers.Recipes[n].buy &
           Offers.Recipes[n].buyB & 
           Offers.Recipes[n].sell */ {
            const offers = input.get('Offers')
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
        /* HandItems */ {
            const handItems = input.get('HandItems')
            if (handItems instanceof NbtList) {
                for (let i = 0; i < handItems.length; i++) {
                    let item = handItems.get(i)
                    if (item instanceof NbtCompound) {
                        item = this.upSpgodingItemNbt(item)
                        handItems.set(i, item)
                    }
                }
            }
        }
        /* ArmorItems */ {
            const armorItems = input.get('ArmorItems')
            if (armorItems instanceof NbtList) {
                for (let i = 0; i < armorItems.length; i++) {
                    let item = armorItems.get(i)
                    if (item instanceof NbtCompound) {
                        item = this.upSpgodingItemNbt(item)
                        armorItems.set(i, item)
                    }
                }
            }
        }
        /* ArmorItem */ {
            let armorItem = input.get('ArmorItem')
            if (armorItem instanceof NbtCompound) {
                armorItem = this.upSpgodingItemNbt(armorItem)
                input.set('ArmorItem', armorItem)
            }
        }
        /* SaddleItem */ {
            let saddleItem = input.get('SaddleItem')
            if (saddleItem instanceof NbtCompound) {
                saddleItem = this.upSpgodingItemNbt(saddleItem)
                input.set('SaddleItem', saddleItem)
            }
        }
        /* Items */ {
            const items = input.get('Items')
            if (items instanceof NbtList) {
                for (let i = 0; i < items.length; i++) {
                    let item = items.get(i)
                    if (item instanceof NbtCompound) {
                        item = this.upSpgodingItemNbt(item)
                        items.set(i, item)
                    }
                }
            }
        }
        /* DecorItem */ {
            let decorItem = input.get('DecorItem')
            if (decorItem instanceof NbtCompound) {
                decorItem = this.upSpgodingItemNbt(decorItem)
                input.set('DecorItem', decorItem)
            }
        }
        /* Inventory */ {
            const inventory = input.get('Inventory')
            if (inventory instanceof NbtList) {
                for (let i = 0; i < inventory.length; i++) {
                    let item = inventory.get(i)
                    if (item instanceof NbtCompound) {
                        item = this.upSpgodingItemNbt(item)
                        inventory.set(i, item)
                    }
                }
            }
        }
        /* Item */ {
            let item = input.get('Item')
            if (item instanceof NbtCompound) {
                item = this.upSpgodingItemNbt(item)
                input.set('Item', item)
            }
        }
        /* SelectedItem */ {
            let selectedItem = input.get('SelectedItem')
            if (selectedItem instanceof NbtCompound) {
                selectedItem = this.upSpgodingItemNbt(selectedItem)
                input.set('SelectedItem', selectedItem)
            }
        }
        /* FireworksItem */ {
            let fireworksItem = input.get('FireworksItem')
            if (fireworksItem instanceof NbtCompound) {
                fireworksItem = this.upSpgodingItemNbt(fireworksItem)
                input.set('FireworksItem', fireworksItem)
            }
        }
        /* Command */ {
            const command = input.get('Command')
            if (command instanceof NbtString) {
                command.set(this.upSpgodingCommand(command.get()))
            }
        }
        /* SpawnPotentials */ {
            const spawnPotentials = input.get('SpawnPotentials')
            if (spawnPotentials instanceof NbtList) {
                for (let i = 0; i < spawnPotentials.length; i++) {
                    const potential = spawnPotentials.get(i)
                    if (potential instanceof NbtCompound) {
                        let entity = potential.get('Entity')
                        if (entity instanceof NbtCompound) {
                            entity = this.upSpgodingEntityNbt(entity)
                            potential.set('Entity', entity)
                        }
                    }
                }
            }
        }
        /* SpawnData */ {
            let spawnData = input.get('SpawnData')
            if (spawnData instanceof NbtCompound) {
                spawnData = this.upSpgodingEntityNbt(spawnData)
                input.set('SpawnData', spawnData)
            }
        }

        return input
    }

    protected upSpgodingItemName(input: string) {
        return input
    }

    protected upSpgodingItemNbt(input: NbtCompound) {
        /* id */ {
            let id = input.get('id')
            if (id instanceof NbtString) {
                id.set(this.upSpgodingItemName(id.get()))
            }
        }
        /* tag */ {
            let tag = input.get('tag')
            if (tag instanceof NbtCompound) {
                tag = this.upSpgodingItemTagNbt(tag)
                input.set('tag', tag)
            }
        }

        return input
    }

    protected upSpgodingItemTagNbt(input: NbtCompound) {
        /* BlockEntityTag */ {
            let blockEntityTag = input.get('BlockEntityTag')
            if (blockEntityTag instanceof NbtCompound) {
                blockEntityTag = this.upSpgodingBlockNbt(input)
                input.set('BlockEntityTag', blockEntityTag)
            }
        }
        /* EntityTag */ {
            let entityTag = input.get('EntityTag')
            if (entityTag instanceof NbtCompound) {
                entityTag = this.upSpgodingEntityNbt(entityTag)
                input.set('EntityTag', entityTag)
            }
        }
        /* CanPlaceOn */ {
            let canPlaceOn = input.get('CanPlaceOn')
            if (canPlaceOn instanceof NbtList) {
                for (let i = 0; i < canPlaceOn.length; i++) {
                    const block = canPlaceOn.get(i)
                    if (block instanceof NbtString) {
                        block.set(this.upSpgodingBlockName(block.get()))
                        canPlaceOn.set(i, block)
                    }
                }
            }
        }
        /* CanDestroy */ {
            let canDestroy = input.get('CanDestroy')
            if (canDestroy instanceof NbtList) {
                for (let i = 0; i < canDestroy.length; i++) {
                    const block = canDestroy.get(i)
                    if (block instanceof NbtString) {
                        block.set(this.upSpgodingBlockName(block.get()))
                        canDestroy.set(i, block)
                    }
                }
            }
        }

        return input
    }

    protected upSpgodingTargetSelector(input: TargetSelector) {
        if (input.nbt !== undefined) {
            input.nbt = this.upSpgodingEntityNbt(input.nbt)
        }
        return input
    }
}
