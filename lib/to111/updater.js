"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wheel_chief_1 = require("../utils/wheel_chief/wheel_chief");
const updater_1 = require("../utils/wheel_chief/updater");
const utils_1 = require("../utils/utils");
const commands_1 = require("./commands");
const selector_1 = require("./utils/selector");
const nbt_1 = require("../utils/nbt/nbt");
const entities_1 = require("./mappings/entities");
const updater_2 = require("../to19/updater");
const excutor_1 = require("./excutor");
const parser_1 = require("./parser");
class UpdaterTo111 extends updater_1.Updater {
    static upLine(input, from) {
        const ans = { command: input, warnings: [] };
        if (['18'].indexOf(from) !== -1) {
            const result = updater_2.UpdaterTo19.upLine(ans.command, from);
            ans.command = result.command;
            ans.warnings = result.warnings;
        }
        else if (from !== '19') {
            throw `Expected from version: '18' or '19' but got '${from}'.`;
        }
        const result = new UpdaterTo111().upSpgodingCommand(ans.command);
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
    upMinecraftEntitySummon(input) {
        return entities_1.default.to111(input);
    }
    upSpgodingCommand(input) {
        const result = wheel_chief_1.WheelChief.update(input, commands_1.Commands19To111.commands, new parser_1.ArgumentParser19To111(), this, new excutor_1.SpuScriptExecutor19To111());
        return { command: result.command, warnings: result.warnings };
    }
    upSpgodingEntityNbt(input) {
        let ans = input;
        /* id, Type, Elder, ZombieType, SkeletonType */ {
            const id = ans.get('id');
            if (id instanceof nbt_1.NbtString) {
                id.set(entities_1.default.to111(id.get()));
                const result = UpdaterTo111.upEntityNbtWithType(ans, id.get());
                ans = result.nbt;
                id.set(result.type);
            }
        }
        ans = super.upSpgodingEntityNbt(ans);
        return ans;
    }
    static upEntityNbtWithType(nbt, entityType) {
        switch (entityType) {
            case 'minecraft:horse': {
                const type = nbt.get('Type');
                if (type instanceof nbt_1.NbtInt) {
                    nbt.del('Type');
                    switch (type.get()) {
                        case 1:
                            entityType = 'minecraft:donkey';
                            break;
                        case 2:
                            entityType = 'minecraft:mule';
                            break;
                        case 3:
                            entityType = 'minecraft:zombie_horse';
                            break;
                        case 4:
                            entityType = 'minecraft:skeleton_horse';
                            break;
                        default:
                            break;
                    }
                }
                break;
            }
            case 'minecraft:guardian':
                {
                    const elder = nbt.get('Elder');
                    if (elder instanceof nbt_1.NbtByte || elder instanceof nbt_1.NbtInt) {
                        nbt.del('Elder');
                        switch (elder.get()) {
                            case 1:
                                entityType = 'minecraft:elder_guardian';
                                break;
                            default:
                                break;
                        }
                    }
                }
                break;
            case 'minecraft:zombie': {
                const zombieType = nbt.get('ZombieType');
                if (zombieType instanceof nbt_1.NbtInt) {
                    nbt.del('ZombieType');
                    switch (zombieType.get()) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                            entityType = 'minecraft:zombie_villager';
                            const profession = new nbt_1.NbtInt(zombieType.get());
                            nbt.set('Profession', profession);
                            break;
                        case 6:
                            entityType = 'minecraft:husk';
                            break;
                        default:
                            break;
                    }
                }
                break;
            }
            case 'minecraft:skeleton': {
                const skeletonType = nbt.get('SkeletonType');
                if (skeletonType instanceof nbt_1.NbtByte || skeletonType instanceof nbt_1.NbtInt) {
                    nbt.del('SkeletonType');
                    switch (skeletonType.get()) {
                        case 1:
                            entityType = 'minecraft:wither_skeleton';
                            break;
                        case 2:
                            entityType = 'minecraft:stray';
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        return { nbt: nbt, type: entityType };
    }
    upSpgodingTargetSelector(input) {
        const sel = new selector_1.Selector111(input);
        return sel.toString();
    }
}
exports.UpdaterTo111 = UpdaterTo111;
//# sourceMappingURL=updater.js.map