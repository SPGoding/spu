"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const nbt_1 = require("../nbt/nbt");
const target_selector_1 = require("../target_selector");
const block_state_1 = require("../block_state");
const item_stack_1 = require("../item_stack");
class Updater {
    upArgument(input, updater) {
        switch (updater) {
            case 'minecraft:block_predicate':
            case 'minecraft:block_state':
                return this.upMinecraftBlockState(new block_state_1.BlockState(input)).toString();
            case 'minecraft:component':
                return this.upMinecraftComponent(input);
            case 'minecraft:entity':
            case 'minecraft:game_profile':
            case 'minecraft:score_holder':
                return this.upMinecraftEntity(input);
            case 'minecraft:entity_summon':
                return this.upMinecraftEntitySummon(input);
            case 'minecraft:item_predicate':
            case 'minecraft:item_stack':
                return this.upMinecraftItemStack(new item_stack_1.ItemStack(input)).toString();
            case 'minecraft:item_slot':
                return this.upMinecraftItemSlot(input);
            case 'minecraft:message':
                return this.upMinecraftMessage(input);
            case 'spgoding:block_name':
                return this.upSpgodingBlockName(input);
            case 'spgoding:block_nbt':
                return this.upSpgodingBlockNbt(utils_1.getNbtCompound(input)).toString();
            case 'spgoding:command':
                return this.upSpgodingCommand(input).command;
            case 'spgoding:entity_nbt':
                return this.upSpgodingEntityNbt(utils_1.getNbtCompound(input)).toString();
            case 'spgoding:item_name':
                return this.upSpgodingItemName(input);
            case 'spgoding:item_nbt':
                return this.upSpgodingItemNbt(utils_1.getNbtCompound(input)).toString();
            case 'spgoding:item_tag_nbt':
                return this.upSpgodingItemTagNbt(utils_1.getNbtCompound(input)).toString();
            default:
                return input;
        }
    }
    static upLine(input, _from) {
        return { command: input, warnings: [] };
    }
    upMinecraftBlockState(input) {
        input.name = this.upSpgodingBlockName(input.name);
        if (input.nbt !== undefined) {
            input.nbt = this.upSpgodingBlockNbt(input.nbt);
        }
        return input;
    }
    upMinecraftComponent(input) {
        if (input.slice(0, 1) === '"' || utils_1.isNumeric(input) || input === 'true' || input === 'false') {
            return input;
        }
        else if (input.slice(0, 1) === '[') {
            const json = JSON.parse(input);
            const result = [];
            for (const i of json) {
                result.push(this.upMinecraftComponent(JSON.stringify(i)));
            }
            return `[${result.join()}]`;
        }
        else {
            const json = JSON.parse(input);
            if (json.selector) {
                json.selector = this.upMinecraftEntity(json.selector);
            }
            if (json.clickEvent &&
                json.clickEvent.action &&
                (json.clickEvent.action === 'run_command' || json.clickEvent.action === 'suggest_command') &&
                json.clickEvent.value &&
                json.clickEvent.value.slice(0, 1) === '/') {
                try {
                    json.clickEvent.value = this.upSpgodingCommand(json.clickEvent.value).command;
                }
                catch (_a) {
                    // That's ok. Take it easy.
                }
            }
            if (json.extra) {
                json.extra = JSON.parse(this.upMinecraftComponent(JSON.stringify(json.extra)));
            }
            return JSON.stringify(json).replace(/§/g, '\\u00a7');
        }
    }
    upMinecraftEntity(input) {
        try {
            return this.upSpgodingTargetSelector(input);
        }
        catch (_a) {
            return input;
        }
    }
    upMinecraftEntitySummon(input) {
        return input;
    }
    upMinecraftItemStack(input) {
        input.name = this.upSpgodingItemName(input.name);
        if (input.nbt !== undefined) {
            input.nbt = this.upSpgodingItemTagNbt(input.nbt);
        }
        return input;
    }
    upMinecraftItemSlot(input) {
        return input;
    }
    upMinecraftMessage(input) {
        // let parts = input.split('@')
        // for (let i = 1; i < parts.length; i++) {
        //     try {
        //         parts[i] = this.upSpgodingTargetSelector(`@${parts[i]}`).slice(1)
        //     } catch {
        //         continue
        //     }
        // }
        // return parts.join('@')
        // FAILED FAILED FAILED
        // I have tried my best.
        // Trust me if you will.
        return input;
    }
    upSpgodingBlockName(input) {
        return input;
    }
    upSpgodingBlockNbt(input) {
        /* Command */ {
            const command = input.get('Command');
            if (command instanceof nbt_1.NbtString) {
                command.set(this.upSpgodingCommand(command.get()).command);
            }
        }
        /* Items */ {
            const items = input.get('Items');
            if (items instanceof nbt_1.NbtList) {
                for (let i = 0; i < items.length; i++) {
                    let item = items.get(i);
                    if (item instanceof nbt_1.NbtCompound) {
                        item = this.upSpgodingItemNbt(item);
                        items.set(i, item);
                    }
                }
            }
        }
        /* RecordItem */ {
            let item = input.get('RecordItem');
            if (item instanceof nbt_1.NbtCompound) {
                item = this.upSpgodingItemNbt(item);
            }
        }
        /* TextN */ {
            const text1 = input.get('Text1');
            const text2 = input.get('Text2');
            const text3 = input.get('Text3');
            const text4 = input.get('Text4');
            if (text1 instanceof nbt_1.NbtString) {
                text1.set(this.upMinecraftComponent(text1.get()));
            }
            if (text2 instanceof nbt_1.NbtString) {
                text2.set(this.upMinecraftComponent(text2.get()));
            }
            if (text3 instanceof nbt_1.NbtString) {
                text3.set(this.upMinecraftComponent(text3.get()));
            }
            if (text4 instanceof nbt_1.NbtString) {
                text4.set(this.upMinecraftComponent(text4.get()));
            }
        }
        return input;
    }
    upSpgodingCommand(input) {
        return { command: input, warnings: [] };
    }
    upSpgodingEntityNbt(input) {
        /* id */ {
            const id = input.get('id');
            if (id instanceof nbt_1.NbtString) {
                id.set(this.upMinecraftEntitySummon(id.get()));
            }
        }
        /* Passengers */ {
            const passengers = input.get('Passengers');
            if (passengers instanceof nbt_1.NbtList) {
                for (let i = 0; i < passengers.length; i++) {
                    let passenger = passengers.get(i);
                    if (passenger instanceof nbt_1.NbtCompound) {
                        passenger = this.upSpgodingEntityNbt(passenger);
                        passengers.set(i, passenger);
                    }
                }
            }
        }
        /* Offers.Recipes[n].buy &
           Offers.Recipes[n].buyB &
           Offers.Recipes[n].sell */ {
            const offers = input.get('Offers');
            if (offers instanceof nbt_1.NbtCompound) {
                const recipes = offers.get('Recipes');
                if (recipes instanceof nbt_1.NbtList) {
                    recipes.forEach((v) => {
                        if (v instanceof nbt_1.NbtCompound) {
                            let buy = v.get('buy');
                            let buyB = v.get('buyB');
                            let sell = v.get('sell');
                            if (buy instanceof nbt_1.NbtCompound) {
                                buy = this.upSpgodingItemNbt(buy);
                                v.set('buy', buy);
                            }
                            if (buyB instanceof nbt_1.NbtCompound) {
                                buyB = this.upSpgodingItemNbt(buyB);
                                v.set('buyB', buyB);
                            }
                            if (sell instanceof nbt_1.NbtCompound) {
                                sell = this.upSpgodingItemNbt(sell);
                                v.set('sell', sell);
                            }
                        }
                    });
                }
            }
        }
        /* HandItems */ {
            const handItems = input.get('HandItems');
            if (handItems instanceof nbt_1.NbtList) {
                for (let i = 0; i < handItems.length; i++) {
                    let item = handItems.get(i);
                    if (item instanceof nbt_1.NbtCompound) {
                        item = this.upSpgodingItemNbt(item);
                        handItems.set(i, item);
                    }
                }
            }
        }
        /* ArmorItems */ {
            const armorItems = input.get('ArmorItems');
            if (armorItems instanceof nbt_1.NbtList) {
                for (let i = 0; i < armorItems.length; i++) {
                    let item = armorItems.get(i);
                    if (item instanceof nbt_1.NbtCompound) {
                        item = this.upSpgodingItemNbt(item);
                        armorItems.set(i, item);
                    }
                }
            }
        }
        /* ArmorItem */ {
            let armorItem = input.get('ArmorItem');
            if (armorItem instanceof nbt_1.NbtCompound) {
                armorItem = this.upSpgodingItemNbt(armorItem);
                input.set('ArmorItem', armorItem);
            }
        }
        /* SaddleItem */ {
            let saddleItem = input.get('SaddleItem');
            if (saddleItem instanceof nbt_1.NbtCompound) {
                saddleItem = this.upSpgodingItemNbt(saddleItem);
                input.set('SaddleItem', saddleItem);
            }
        }
        /* Items */ {
            const items = input.get('Items');
            if (items instanceof nbt_1.NbtList) {
                for (let i = 0; i < items.length; i++) {
                    let item = items.get(i);
                    if (item instanceof nbt_1.NbtCompound) {
                        item = this.upSpgodingItemNbt(item);
                        items.set(i, item);
                    }
                }
            }
        }
        /* DecorItem */ {
            let decorItem = input.get('DecorItem');
            if (decorItem instanceof nbt_1.NbtCompound) {
                decorItem = this.upSpgodingItemNbt(decorItem);
                input.set('DecorItem', decorItem);
            }
        }
        /* Inventory */ {
            const inventory = input.get('Inventory');
            if (inventory instanceof nbt_1.NbtList) {
                for (let i = 0; i < inventory.length; i++) {
                    let item = inventory.get(i);
                    if (item instanceof nbt_1.NbtCompound) {
                        item = this.upSpgodingItemNbt(item);
                        inventory.set(i, item);
                    }
                }
            }
        }
        /* Item */ {
            let item = input.get('Item');
            if (item instanceof nbt_1.NbtCompound) {
                item = this.upSpgodingItemNbt(item);
                input.set('Item', item);
            }
        }
        /* SelectedItem */ {
            let selectedItem = input.get('SelectedItem');
            if (selectedItem instanceof nbt_1.NbtCompound) {
                selectedItem = this.upSpgodingItemNbt(selectedItem);
                input.set('SelectedItem', selectedItem);
            }
        }
        /* FireworksItem */ {
            let fireworksItem = input.get('FireworksItem');
            if (fireworksItem instanceof nbt_1.NbtCompound) {
                fireworksItem = this.upSpgodingItemNbt(fireworksItem);
                input.set('FireworksItem', fireworksItem);
            }
        }
        /* Command */ {
            const command = input.get('Command');
            if (command instanceof nbt_1.NbtString) {
                command.set(this.upSpgodingCommand(command.get()).command);
            }
        }
        /* SpawnPotentials */ {
            const spawnPotentials = input.get('SpawnPotentials');
            if (spawnPotentials instanceof nbt_1.NbtList) {
                for (let i = 0; i < spawnPotentials.length; i++) {
                    const potential = spawnPotentials.get(i);
                    if (potential instanceof nbt_1.NbtCompound) {
                        let entity = potential.get('Entity');
                        if (entity instanceof nbt_1.NbtCompound) {
                            entity = this.upSpgodingEntityNbt(entity);
                            potential.set('Entity', entity);
                        }
                    }
                }
            }
        }
        /* SpawnData */ {
            let spawnData = input.get('SpawnData');
            if (spawnData instanceof nbt_1.NbtCompound) {
                spawnData = this.upSpgodingEntityNbt(spawnData);
                input.set('SpawnData', spawnData);
            }
        }
        /* TileEntityData */ {
            let tileEntityData = input.get('TileEntityData');
            if (tileEntityData instanceof nbt_1.NbtCompound) {
                tileEntityData = this.upSpgodingBlockNbt(tileEntityData);
                input.set('TileEntityData', tileEntityData);
            }
        }
        return input;
    }
    upSpgodingItemName(input) {
        return input;
    }
    upSpgodingItemNbt(input) {
        /* tag */ {
            let tag = input.get('tag');
            if (tag instanceof nbt_1.NbtCompound) {
                tag = this.upSpgodingItemTagNbt(tag);
                input.set('tag', tag);
            }
        }
        return input;
    }
    upSpgodingItemTagNbt(input) {
        /* BlockEntityTag */ {
            let blockEntityTag = input.get('BlockEntityTag');
            if (blockEntityTag instanceof nbt_1.NbtCompound) {
                blockEntityTag = this.upSpgodingBlockNbt(blockEntityTag);
                input.set('BlockEntityTag', blockEntityTag);
            }
        }
        /* EntityTag */ {
            let entityTag = input.get('EntityTag');
            if (entityTag instanceof nbt_1.NbtCompound) {
                entityTag = this.upSpgodingEntityNbt(entityTag);
                input.set('EntityTag', entityTag);
            }
        }
        /* CanPlaceOn */ {
            const canPlaceOn = input.get('CanPlaceOn');
            if (canPlaceOn instanceof nbt_1.NbtList) {
                for (let i = 0; i < canPlaceOn.length; i++) {
                    const block = canPlaceOn.get(i);
                    if (block instanceof nbt_1.NbtString) {
                        block.set(this.upSpgodingBlockName(block.get()));
                        canPlaceOn.set(i, block);
                    }
                }
            }
        }
        /* CanDestroy */ {
            const canDestroy = input.get('CanDestroy');
            if (canDestroy instanceof nbt_1.NbtList) {
                for (let i = 0; i < canDestroy.length; i++) {
                    const block = canDestroy.get(i);
                    if (block instanceof nbt_1.NbtString) {
                        block.set(this.upSpgodingBlockName(block.get()));
                        canDestroy.set(i, block);
                    }
                }
            }
        }
        return input;
    }
    upSpgodingTargetSelector(input) {
        const sel = new target_selector_1.TargetSelector(input);
        if (sel.nbt !== undefined) {
            sel.nbt = this.upSpgodingEntityNbt(sel.nbt);
        }
        return sel.toString();
    }
}
exports.Updater = Updater;
//# sourceMappingURL=updater.js.map