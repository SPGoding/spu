import { getNbtCompound } from "../utils";
import { NbtString, NbtList, NbtCompound, NbtValue } from "../nbt/nbt";

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
                                buy = this.upItemNbt(buy.get())
                                v.set('buy', buy)
                            }
                            if (buyB instanceof NbtCompound) {
                                buyB = this.upItemNbt(buyB)
                                v.set('buyB', buyB)
                            }
                            if (sell instanceof NbtCompound) {
                                sell = this.upItemNbt(sell)
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
                    item = this.upItemNbt(item)

                    handItems.set(i, item)
                }
            }
        }
        /* ArmorItems */ {
            const armorItems = root.get('ArmorItems')
            if (armorItems instanceof NbtList) {
                for (let i = 0; i < armorItems.length; i++) {
                    let item = armorItems.get(i)
                    item = this.upItemNbt(item)
                    armorItems.set(i, item)
                }
            }
        }
        /* ArmorItem */ {
            let armorItem = root.get('ArmorItem')
            if (armorItem instanceof NbtCompound) {
                armorItem = this.upItemNbt(armorItem)
                root.set('ArmorItem', armorItem)
            }
        }
        /* SaddleItem */ {
            let saddleItem = root.get('SaddleItem')
            if (saddleItem instanceof NbtCompound) {
                saddleItem = this.upItemNbt(saddleItem)
                root.set('SaddleItem', saddleItem)
            }
        }
        /* Items */ {
            const items = root.get('Items')
            if (items instanceof NbtList) {
                for (let i = 0; i < items.length; i++) {
                    let item = items.get(i)
                    item = this.upItemNbt(item)
                    items.set(i, item)
                }
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
        /* Item */ {
            let item = root.get('Item')
            if (item instanceof NbtCompound) {
                item = this.upItemNbt(item)
                root.set('Item', item)
            }
        }
        /* SelectedItem */ {
            let selectedItem = root.get('SelectedItem')
            if (selectedItem instanceof NbtCompound) {
                selectedItem = this.upItemNbt(selectedItem)
                root.set('SelectedItem', selectedItem)
            }
        }
        /* FireworksItem */ {
            let fireworksItem = root.get('FireworksItem')
            if (fireworksItem instanceof NbtCompound) {
                fireworksItem = this.upItemNbt(fireworksItem)
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
                blockEntityTag = this.upBlockNbt(input)
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
}