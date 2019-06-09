"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wheel_chief_1 = require("../utils/wheel_chief/wheel_chief");
const updater_1 = require("../utils/wheel_chief/updater");
const utils_1 = require("../utils/utils");
const commands_1 = require("./commands");
const selector_1 = require("./utils/selector");
const nbt_1 = require("../utils/nbt/nbt");
const items_1 = require("./mappings/items");
const blocks_1 = require("./mappings/blocks");
const executor_1 = require("./executor");
const parser_1 = require("./parser");
class UpdaterTo19 extends updater_1.Updater {
    static upLine(input, from) {
        const ans = { command: input, warnings: [] };
        const result = new UpdaterTo19().upSpgodingCommand(ans.command);
        ans.command = result.command;
        ans.warnings = ans.warnings.concat(result.warnings);
        return ans;
    }
    upArgument(input, updater) {
        switch (updater) {
            case 'spgoding:block_nbt':
                return this.upSpgodingBlockNbt(utils_1.getNbtCompound(input, 'before 1.12')).toString();
            case 'spgoding:entity_nbt':
                return this.upSpgodingEntityNbt(utils_1.getNbtCompound(input, 'before 1.12')).toString();
            case 'spgoding:item_nbt':
                return this.upSpgodingItemNbt(utils_1.getNbtCompound(input, 'before 1.12')).toString();
            case 'spgoding:item_tag_nbt':
                return this.upSpgodingItemTagNbt(utils_1.getNbtCompound(input, 'before 1.12')).toString();
            default:
                return super.upArgument(input, updater);
        }
    }
    upMinecraftComponent(input) {
        if (input.slice(0, 1) === '"' || utils_1.isNumeric(input) || input === 'true' || input === 'false') {
            return input;
        }
        else if (input.slice(0, 1) === '[') {
            const json = JSON.parse(utils_1.getNbtList(input, 'before 1.12').toJson());
            const result = [];
            for (const i of json) {
                result.push(this.upMinecraftComponent(JSON.stringify(i)));
            }
            return `[${result.join()}]`;
        }
        else {
            const json = JSON.parse(utils_1.getNbtCompound(input, 'before 1.12').toJson());
            if (json.selector) {
                json.selector = this.upMinecraftEntity(json.selector);
            }
            if (json.clickEvent &&
                json.clickEvent.action &&
                (json.clickEvent.action === 'run_command' || json.clickEvent.action === 'suggest_command') &&
                json.clickEvent.value && json.clickEvent.value.slice(0, 1) === '/') {
                try {
                    json.clickEvent.value = this.upSpgodingCommand(json.clickEvent.value).command;
                }
                catch (ignored) {
                    // Take it easy.
                }
            }
            if (json.extra) {
                json.extra = JSON.parse(this.upMinecraftComponent(JSON.stringify(json.extra)));
            }
            return JSON.stringify(json).replace(/§/g, '\\u00a7');
        }
    }
    upSpgodingCommand(input) {
        const result = wheel_chief_1.WheelChief.update(input, commands_1.Commands18To19.commands, new parser_1.ArgumentParser18To19(), this, new executor_1.SpuScriptExecutor18To19());
        return { command: result.command, warnings: result.warnings };
    }
    upSpgodingEntityNbt(input) {
        let ans = input;
        /* Healf */ {
            const healF = ans.get('HealF');
            if (healF instanceof nbt_1.NbtFloat || healF instanceof nbt_1.NbtInt) {
                ans.del('HealF');
                const health = new nbt_1.NbtInt(healF.get());
                ans.set('Health', health);
            }
        }
        /* DropChances */ {
            const dropChances = ans.get('DropChances');
            if (dropChances instanceof nbt_1.NbtList) {
                ans.del('DropChances');
                const armorDropChances = new nbt_1.NbtList();
                const handDropChances = new nbt_1.NbtList();
                armorDropChances.set(0, dropChances.get(0));
                armorDropChances.set(1, dropChances.get(1));
                armorDropChances.set(2, dropChances.get(2));
                armorDropChances.set(3, dropChances.get(3));
                handDropChances.set(0, dropChances.get(5));
                handDropChances.set(1, new nbt_1.NbtFloat(0));
                ans.set('ArmorDropChances', armorDropChances);
                ans.set('HandDropChances', handDropChances);
            }
        }
        /* Equipment */ {
            const equipment = ans.get('Equipment');
            if (equipment instanceof nbt_1.NbtList) {
                ans.del('Equipment');
                const armorItems = new nbt_1.NbtList();
                const handItems = new nbt_1.NbtList();
                const handItem0 = equipment.get(0);
                const armorItem0 = equipment.get(1);
                const armorItem1 = equipment.get(2);
                const armorItem2 = equipment.get(3);
                const armorItem3 = equipment.get(4);
                if (handItem0 instanceof nbt_1.NbtCompound) {
                    handItems.set(0, this.upSpgodingItemNbt(handItem0));
                    handItems.set(1, new nbt_1.NbtCompound());
                    ans.set('HandItems', handItems);
                }
                if (armorItem0 instanceof nbt_1.NbtCompound) {
                    armorItems.set(0, this.upSpgodingItemNbt(armorItem0));
                    if (armorItem1 instanceof nbt_1.NbtCompound) {
                        armorItems.set(1, this.upSpgodingItemNbt(armorItem1));
                        if (armorItem2 instanceof nbt_1.NbtCompound) {
                            armorItems.set(2, this.upSpgodingItemNbt(armorItem2));
                            if (armorItem3 instanceof nbt_1.NbtCompound) {
                                armorItems.set(3, this.upSpgodingItemNbt(armorItem3));
                            }
                            else {
                                armorItems.set(3, new nbt_1.NbtCompound());
                            }
                        }
                        else {
                            armorItems.set(2, new nbt_1.NbtCompound());
                            armorItems.set(3, new nbt_1.NbtCompound());
                        }
                    }
                    else {
                        armorItems.set(1, new nbt_1.NbtCompound());
                        armorItems.set(2, new nbt_1.NbtCompound());
                        armorItems.set(3, new nbt_1.NbtCompound());
                    }
                    ans.set('ArmorItems', armorItems);
                }
            }
        }
        /* Properties (Type) */ {
            const properties = ans.get('Properties');
            if (properties instanceof nbt_1.NbtCompound) {
                ans.del('Properties');
                const type = ans.get('Type');
                const spawnData = properties;
                if (type instanceof nbt_1.NbtString) {
                    ans.del('Type');
                    spawnData.set('id', type);
                }
                ans.set('SpawnData', spawnData);
            }
        }
        /* Type */ {
            const type = ans.get('Type');
            if (type instanceof nbt_1.NbtString) {
                ans.del('Type');
                const spawnData = new nbt_1.NbtCompound();
                spawnData.set('id', type);
                ans.set('SpawnData', spawnData);
            }
        }
        /* carried */ {
            const carried = ans.get('carried');
            if (carried instanceof nbt_1.NbtInt) {
                ans.del('carried');
                ans.set('carried', new nbt_1.NbtString(items_1.default.to19(carried.get())));
            }
        }
        /* inTile */ {
            const inTile = ans.get('inTile');
            if (inTile instanceof nbt_1.NbtInt) {
                ans.del('inTile');
                ans.set('inTile', new nbt_1.NbtString(blocks_1.default.to19(inTile.get())));
            }
        }
        /* TileID & TileEntityData */ {
            const tileId = ans.get('TileID');
            if (tileId instanceof nbt_1.NbtInt) {
                ans.del('TileID');
                ans.set('Block', new nbt_1.NbtString(blocks_1.default.to19(tileId.get())));
            }
            let tileEntityData = ans.get('TileEntityData');
            if (tileEntityData instanceof nbt_1.NbtCompound) {
                tileEntityData = this.upSpgodingBlockNbt(tileEntityData);
                ans.set('TileEntityData', tileEntityData);
            }
        }
        /* DisplayTile */ {
            const displayTile = ans.get('DisplayTile');
            if (displayTile instanceof nbt_1.NbtInt) {
                ans.del('DisplayTile');
                ans.set('DisplayTile', new nbt_1.NbtString(blocks_1.default.to19(displayTile.get())));
            }
        }
        /* Riding */ {
            let riding = ans.get('Riding');
            if (riding instanceof nbt_1.NbtCompound) {
                riding = this.upSpgodingEntityNbt(riding);
                ans.set('Riding', riding);
            }
        }
        ans = super.upSpgodingEntityNbt(ans);
        return ans;
    }
    upSpgodingItemNbt(input) {
        let ans = input;
        /* id */ {
            const id = ans.get('id');
            if (id instanceof nbt_1.NbtInt) {
                ans.del('id');
                ans.set('id', new nbt_1.NbtString(items_1.default.to19(id.get())));
            }
        }
        ans = super.upSpgodingItemNbt(input);
        return ans;
    }
    upSpgodingTargetSelector(input) {
        const sel = new selector_1.Selector19(input);
        return sel.toString();
    }
}
exports.UpdaterTo19 = UpdaterTo19;
//# sourceMappingURL=updater.js.map