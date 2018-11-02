import { getNbtCompound } from "../utils";
import { NbtString, NbtList, NbtCompound, NbtValue } from "../nbt/nbt";
import { TargetSelector } from "../target_selector";

export class Updater {
    public upArgument(input: string, updater: string): string {
        switch (updater) {
            case 'spgoding:command':
                return this.upCommand(input)
            case 'spgoding:entity_nbt':
                return this.upEntityNbt(input)
            case 'spgoding:entity_type':
                return this.upEntityType(input)
            case 'spgoding:item_nbt':
                return this.upItemNbt(input)
            case 'spgoding:json_text':
                return this.upJsonText(input)
            default:
                return input
        }
    }

    public static upLine(input: string, from: string) {
        return input
    }

    protected upBlockNbt(input: string) {
        const root = getNbtCompound(input)

        /* Command */ {
            const command = root.get('Command')
            if (command instanceof NbtString) {
                command.set(this.upCommand(command.get()))
            }
        }
        /* Items */ {
            const items = root.get('Items')
            if (items instanceof NbtList) {
                items.forEach((item: NbtString) => {
                    item.set(this.upItemNbt(item.get()))
                })
            }
        }
        /* RecordItem */ {
            let item = root.get('RecordItem')
            if (item instanceof NbtString) {
                item.set(this.upItemNbt(item.get()))
            }
        }

        return root.toString()
    }

    protected upCommand(input: string) {
        return input
    }

    protected upEntityNbt(input: string) {
        const root = getNbtCompound(input)

        /* id */ {
            const id = root.get('id')
            if (id instanceof NbtString) {
                id.set(this.upEntityType(id.get()))
            }
        }
        /* Passengers */ {
            const passengers = root.get('Passengers')
            if (passengers instanceof NbtList) {
                for (let i = 0; i < passengers.length; i++) {
                    let passenger = passengers.get(i)
                    passenger = getNbtCompound(this.upEntityNbt(passenger.toString()))
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
                                buy = getNbtCompound(this.upItemNbt(buy.toString()))
                                v.set('buy', buy)
                            }
                            if (buyB instanceof NbtCompound) {
                                buyB = getNbtCompound(this.upItemNbt(buyB.toString()))
                                v.set('buyB', buyB)
                            }
                            if (sell instanceof NbtCompound) {
                                sell = getNbtCompound(this.upItemNbt(sell.toString()))
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
                    item = getNbtCompound(this.upItemNbt(item.toString()))

                    handItems.set(i, item)
                }
            }
        }
        /* ArmorItems */ {
            const armorItems = root.get('ArmorItems')
            if (armorItems instanceof NbtList) {
                for (let i = 0; i < armorItems.length; i++) {
                    let item = armorItems.get(i)
                    item = getNbtCompound(this.upItemNbt(item.toString()))
                    armorItems.set(i, item)
                }
            }
        }
        /* ArmorItem */ {
            let armorItem = root.get('ArmorItem')
            if (armorItem instanceof NbtCompound) {
                armorItem = getNbtCompound(this.upItemNbt(armorItem.toString()))
                root.set('ArmorItem', armorItem)
            }
        }
        /* SaddleItem */ {
            let saddleItem = root.get('SaddleItem')
            if (saddleItem instanceof NbtCompound) {
                saddleItem = getNbtCompound(this.upItemNbt(saddleItem.toString()))
                root.set('SaddleItem', saddleItem)
            }
        }
        /* Items */ {
            const items = root.get('Items')
            if (items instanceof NbtList) {
                for (let i = 0; i < items.length; i++) {
                    let item = items.get(i)
                    item = getNbtCompound(this.upItemNbt(item.toString()))
                    items.set(i, item)
                }
            }
        }
        /* DecorItem */ {
            let decorItem = root.get('DecorItem')
            if (decorItem instanceof NbtCompound) {
                decorItem = getNbtCompound(this.upItemNbt(decorItem.toString()))
                root.set('DecorItem', decorItem)
            }
        }
        /* Inventory */ {
            const inventory = root.get('Inventory')
            if (inventory instanceof NbtList) {
                for (let i = 0; i < inventory.length; i++) {
                    let item = inventory.get(i)
                    item = getNbtCompound(this.upItemNbt(item.toString()))
                    inventory.set(i, item)
                }
            }
        }
        /* Item */ {
            let item = root.get('Item')
            if (item instanceof NbtCompound) {
                item = getNbtCompound(this.upItemNbt(item.toString()))
                root.set('Item', item)
            }
        }
        /* SelectedItem */ {
            let selectedItem = root.get('SelectedItem')
            if (selectedItem instanceof NbtCompound) {
                selectedItem = getNbtCompound(this.upItemNbt(selectedItem.toString()))
                root.set('SelectedItem', selectedItem)
            }
        }
        /* FireworksItem */ {
            let fireworksItem = root.get('FireworksItem')
            if (fireworksItem instanceof NbtCompound) {
                fireworksItem = getNbtCompound(this.upItemNbt(fireworksItem.toString()))
                root.set('FireworksItem', fireworksItem)
            }
        }
        /* Command */ {
            const command = root.get('Command')
            if (command instanceof NbtString) {
                command.set(this.upCommand(command.get()))
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
                            entity = getNbtCompound(this.upEntityNbt(entity.toString()))
                            potential.set('Entity', entity)
                        }
                    }
                }
            }
        }
        /* SpawnData */ {
            let spawnData = root.get('SpawnData')
            if (spawnData instanceof NbtCompound) {
                spawnData = getNbtCompound(this.upEntityNbt(spawnData.toString()))
                root.set('SpawnData', spawnData)
            }
        }

        return root.toString()
    }

    protected upEntityType(input: string) {
        return input
    }

    protected upItemNbt(input: string) {
        const root = getNbtCompound(input)

        /* BlockEntityTag */ {
            let blockEntityTag = root.get('BlockEntityTag')
            if (blockEntityTag instanceof NbtCompound) {
                blockEntityTag = getNbtCompound(this.upBlockNbt(input))
                root.set('BlockEntityTag', blockEntityTag)
            }
        }
        /* EntityTag */ {
            let entityTag = root.get('EntityTag')
            if (entityTag instanceof NbtCompound) {
                entityTag = getNbtCompound(this.upEntityNbt(entityTag.toString()))
                root.set('EntityTag', entityTag)
            }
        }

        return root.toString()
    }

    protected upJsonText(input: string) {
        if (input.slice(0, 1) === '"') {
            return input
        } else if (input.slice(0, 1) === '[') {
            let json = JSON.parse(input)
            let result: string[] = []
            for (const i of json) {
                result.push(this.upJsonText(JSON.stringify(i)))
            }
            return `[${result.join()}]`
        } else {
            let json = JSON.parse(input)
            if (json.selector) {
                json.selector = this.upTargetSelector(json.selector)
            }

            if (json.clickEvent &&
                json.clickEvent.action &&
                (json.clickEvent.action === 'run_command' || json.clickEvent.action === 'suggest_command') &&
                json.clickEvent.value && json.clickEvent.value.slice(0, 1) === '/') {
                try {
                    json.clickEvent.value = this.upCommand(json.clickEvent.value)
                } catch {
                    // That's ok. Take it easy.
                }
            }

            if (json.extra) {
                json.extra = JSON.parse(this.upJsonText(JSON.stringify(json.extra)))
            }

            return JSON.stringify(json).replace(/§/g, '\\u00a7')
        }
    }

    protected upTargetSelector(input: string) {
        let selector = new TargetSelector(input)
        selector.nbt = getNbtCompound(this.upEntityNbt(selector.nbt.toString()))
        return selector.toString()
    }
}