"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wheel_chief_1 = require("../utils/wheel_chief/wheel_chief");
const commands_1 = require("./commands");
const updater_1 = require("../utils/wheel_chief/updater");
const utils_1 = require("../utils/utils");
const nbt_1 = require("../utils/nbt/nbt");
const updater_2 = require("../to112/updater");
const target_selector_1 = require("./target_selector");
const target_selector_2 = require("../utils/target_selector");
const blocks_1 = require("./mappings/blocks");
const items_1 = require("./mappings/items");
const scoreboard_criterias_1 = require("./mappings/scoreboard_criterias");
const effects_1 = require("./mappings/effects");
const enchantments_1 = require("./mappings/enchantments");
const particles_1 = require("./mappings/particles");
const entities_1 = require("./mappings/entities");
const argument_parsers_1 = require("../utils/wheel_chief/argument_parsers");
class SpuScriptExecutor112To113 {
    execute(script, args) {
        let splited = script.split(' ');
        for (let i = 0; i < splited.length; i++) {
            if (splited[i].slice(0, 1) === '%') {
                splited[i] = args[parseInt(splited[i].slice(1))].value;
            }
            else if (splited[i].slice(0, 1) === '$') {
                let params = splited[i].slice(1).split('%');
                let index1 = parseInt(params[1]);
                let index2 = parseInt(params[2]);
                let index3 = parseInt(params[3]);
                let param1 = args[index1] ? args[index1].value : '';
                let param2 = args[index2] ? args[index2].value : '';
                let param3 = args[index3] ? args[index3].value : '';
                switch (params[0]) {
                    case 'setBlockParam':
                        splited[i] = blocks_1.default.to113(blocks_1.default.std112(parseInt(param1))).getFull();
                        break;
                    case 'setItemParams':
                        splited[i] = items_1.default.to113(items_1.default.std112(parseInt(param1), undefined, parseInt(param2))).getNominal();
                        break;
                    case 'setNameToItemStack':
                        splited[i] = items_1.default.to113(items_1.default.std112(undefined, param1)).getNominal();
                        break;
                    case 'setNameDataToItemStack':
                        splited[i] = items_1.default.to113(items_1.default.std112(undefined, param1, parseInt(param2))).getNominal();
                        break;
                    case 'setNameDataNbtToItemStack':
                        splited[i] = items_1.default.to113(items_1.default.std112(undefined, param1, parseInt(param2), param3)).getNominal();
                        break;
                    case 'setNameToBlockState':
                        splited[i] = blocks_1.default.to113(blocks_1.default.std112(undefined, param1)).getFull();
                        break;
                    case 'setNameStatesToBlockState':
                        if (utils_1.isNumeric(param2)) {
                            splited[i] = blocks_1.default.to113(blocks_1.default.std112(undefined, param1, parseInt(param2))).getFull();
                        }
                        else {
                            splited[i] = blocks_1.default.to113(blocks_1.default.std112(undefined, param1, undefined, param2)).getFull();
                        }
                        break;
                    case 'setNameStatesNbtToBlockState':
                        if (utils_1.isNumeric(param2)) {
                            splited[i] = blocks_1.default.to113(blocks_1.default.std112(undefined, param1, parseInt(param2), undefined, param3)).getFull();
                        }
                        else {
                            splited[i] = blocks_1.default.to113(blocks_1.default.std112(undefined, param1, undefined, param2, param3)).getFull();
                        }
                        break;
                    case 'setNbtToSelector':
                        let sel112 = new target_selector_1.TargetSelector();
                        sel112.parse(param1);
                        let sel113 = new target_selector_2.TargetSelector(sel112.to113());
                        sel113.nbt = utils_1.getNbtCompound(param2);
                        splited[i] = sel113.toString();
                        break;
                    default:
                        throw `Unexpected script method: '${params[0]}'.`;
                }
            }
        }
        return splited.join(' ');
    }
}
class ArgumentParser112To113 extends argument_parsers_1.ArgumentParser {
    parseMinecraftEntity(splited, index) {
        let join = splited[index];
        if (join.charAt(0) !== '@') {
            return 1;
        }
        if (target_selector_1.TargetSelector.isValid(join)) {
            return 1;
        }
        else {
            for (let i = index + 1; i < splited.length; i++) {
                join += ' ' + splited[i];
                if (target_selector_1.TargetSelector.isValid(join)) {
                    return i - index + 1;
                }
                else {
                    continue;
                }
            }
            throw `Expected an entity selector.`;
        }
    }
}
class UpdaterTo113 extends updater_1.Updater {
    static upLine(input, from) {
        const ans = { command: input, warnings: [] };
        if (['18', '19', '111'].indexOf(from) !== -1) {
            const result = updater_2.UpdaterTo112.upLine(ans.command, from);
            ans.command = result.command;
            ans.warnings = result.warnings;
        }
        else if (from !== '112') {
            throw `Expected from version: '18', '19', '111' or '112' but got '${from}'.`;
        }
        const result = new UpdaterTo113().upSpgodingCommand(ans.command);
        ans.command = result.command;
        ans.warnings = ans.warnings.concat(result.warnings);
        return ans;
    }
    upArgument(input, updater) {
        switch (updater) {
            case 'spgoding:difficulty':
                return this.upSpgodingDifficulty(input);
            case 'spgoding:effect':
                return this.upSpgodingEffect(input);
            case 'spgoding:enchantment':
                return this.upSpgodingEnchantment(input);
            case 'spgoding:gamemode':
                return this.upSpgodingGamemode(input);
            case 'spgoding:item_slot':
                return this.upSpgodingItemSlot(input);
            case 'spgoding:particle':
                return this.upSpgodingParticle(input);
            case 'spgoding:points_or_levels':
                return this.upSpgodingPointsOrLevels(input);
            case 'spgoding:pre_json':
                return this.upSpgodingPreJson(input);
            case 'spgoding:scoreboard_criteria':
                return this.upSpgodingScoreboardCriteria(input);
            case 'spgoding:single_selector':
                return this.upSpgodingSingleSelector(input);
            case 'spgoding:sound':
                return this.upSpgodingSound(input);
            case 'spgoding:to_literal_replace':
                return this.upSpgodingToLiteralReplace(input);
            default:
                return super.upArgument(input, updater);
        }
    }
    upMinecraftEntitySummon(input) {
        input = super.upMinecraftEntitySummon(input);
        input = entities_1.default.to113(input);
        return input;
    }
    upSpgodingBlockName(input) {
        return blocks_1.default.to113(blocks_1.default.std112(undefined, input)).getName();
    }
    upSpgodingBlockNbt(input) {
        let ans = super.upSpgodingBlockNbt(input);
        {
            let customName = ans.get('CustomName');
            if (customName instanceof nbt_1.NbtString) {
                customName.set(this.upSpgodingPreJson(customName.get()));
            }
        }
        return ans;
    }
    upSpgodingBlockParam(input) {
        return blocks_1.default.to113(blocks_1.default.std112(parseInt(input))).getFull();
    }
    upSpgodingCommand(input) {
        const result = wheel_chief_1.WheelChief.update(input, commands_1.Commands112To113.commands, new ArgumentParser112To113(), this, new SpuScriptExecutor112To113());
        return { command: result.command, warnings: result.warnings };
    }
    upSpgodingDifficulty(input) {
        switch (input) {
            case '0':
            case 'p':
            case 'peaceful':
                return 'peaceful';
            case '1':
            case 'e':
            case 'easy':
                return 'easy';
            case '2':
            case 'n':
            case 'normal':
                return 'normal';
            case '3':
            case 'h':
            case 'hard':
                return 'hard';
            default:
                throw `Unknown difficulty: ${input}`;
        }
    }
    upSpgodingEffect(input) {
        if (utils_1.isNumeric(input)) {
            return effects_1.default.to113(Number(input));
        }
        else {
            return input;
        }
    }
    upSpgodingEnchantment(input) {
        if (utils_1.isNumeric(input)) {
            return enchantments_1.default.to113(Number(input));
        }
        else {
            return input;
        }
    }
    upSpgodingEntityNbt(input) {
        let ans = super.upSpgodingEntityNbt(input);
        {
            const carried = ans.get('carried');
            const carriedData = ans.get('carriedData');
            ans.del('carried');
            ans.del('carriedData');
            if ((carried instanceof nbt_1.NbtString) &&
                (carriedData instanceof nbt_1.NbtShort || carriedData instanceof nbt_1.NbtInt || typeof carriedData === 'undefined')) {
                const carriedBlockState = blocks_1.default.upStringToBlockState(carried, carriedData);
                ans.set('carriedBlockState', carriedBlockState);
            }
            else if ((carried instanceof nbt_1.NbtShort || carried instanceof nbt_1.NbtInt) &&
                (carriedData instanceof nbt_1.NbtShort || carriedData instanceof nbt_1.NbtInt || typeof carriedData === 'undefined')) {
                const carriedBlockState = this.upBlockNumericIDToBlockState(carried, carriedData);
                ans.set('carriedBlockState', carriedBlockState);
            }
        }
        {
            const inTile = ans.get('inTile');
            ans.del('inTile');
            if (inTile instanceof nbt_1.NbtString) {
                const inBlockState = blocks_1.default.upStringToBlockState(inTile);
                ans.set('inBlockState', inBlockState);
            }
        }
        {
            const block = ans.get('Block');
            const data = ans.get('Data');
            ans.del('Block');
            ans.del('Data');
            if (block instanceof nbt_1.NbtString &&
                (data instanceof nbt_1.NbtByte || data instanceof nbt_1.NbtInt || typeof data === 'undefined')) {
                const blockState = blocks_1.default.upStringToBlockState(block, data);
                ans.set('BlockState', blockState);
            }
            let tileEntityData = ans.get('TileEntityData');
            if (block instanceof nbt_1.NbtString &&
                tileEntityData instanceof nbt_1.NbtCompound &&
                (data instanceof nbt_1.NbtInt || data instanceof nbt_1.NbtByte || data === undefined)) {
                tileEntityData = blocks_1.default.to113(blocks_1.default.std112(undefined, block.get(), data ? data.get() : 0, undefined, tileEntityData.toString())).getNbt();
                ans.set('TileEntityData', tileEntityData);
            }
        }
        {
            const displayTile = ans.get('DisplayTile');
            const displayData = ans.get('DisplayData');
            ans.del('DisplayTile');
            ans.del('DisplayData');
            if (displayTile instanceof nbt_1.NbtString &&
                (displayData instanceof nbt_1.NbtInt || typeof displayData === 'undefined')) {
                const displayState = blocks_1.default.upStringToBlockState(displayTile, displayData);
                ans.set('DisplayState', displayState);
            }
        }
        {
            const particle = ans.get('Particle');
            const particleParam1 = ans.get('ParticleParam1');
            const particleParam2 = ans.get('ParticleParam2');
            ans.del('ParticleParam1');
            ans.del('ParticleParam2');
            if (particle instanceof nbt_1.NbtString) {
                particle.set(this.upSpgodingParticle(particle.get()));
                if (particle.get() === 'block') {
                    if (particleParam1 instanceof nbt_1.NbtInt) {
                        particle.set(particle.get() + ' ' + this.upSpgodingBlockParam(particleParam1.get().toString()));
                    }
                }
                else if (particle.get() === 'item') {
                    if (particleParam1 instanceof nbt_1.NbtInt && particleParam2 instanceof nbt_1.NbtInt) {
                        particle.set(particle.get() +
                            ' ' +
                            this.upSpgodingItemParams(particleParam1.get().toString() + ' ' + particleParam2.get().toString()));
                    }
                }
            }
        }
        {
            let owner = ans.get('Owner');
            ans.del('Owner');
            if (owner instanceof nbt_1.NbtString) {
                const uuid = utils_1.getUuidLeastUuidMost(owner.get());
                const m = new nbt_1.NbtLong(uuid.M);
                const l = new nbt_1.NbtLong(uuid.L);
                owner = new nbt_1.NbtCompound();
                owner.set('M', m);
                owner.set('L', l);
                ans.set('Owner', owner);
            }
        }
        {
            let owner = ans.get('owner');
            ans.del('owner');
            if (owner instanceof nbt_1.NbtString) {
                const uuid = utils_1.getUuidLeastUuidMost(owner.get());
                const m = new nbt_1.NbtLong(uuid.M);
                const l = new nbt_1.NbtLong(uuid.L);
                owner = new nbt_1.NbtCompound();
                owner.set('M', m);
                owner.set('L', l);
                ans.set('owner', owner);
            }
        }
        {
            let thrower = ans.get('Thrower');
            ans.del('Thrower');
            if (thrower instanceof nbt_1.NbtString) {
                const uuid = utils_1.getUuidLeastUuidMost(thrower.get());
                const m = new nbt_1.NbtLong(uuid.M);
                const l = new nbt_1.NbtLong(uuid.L);
                thrower = new nbt_1.NbtCompound();
                thrower.set('M', m);
                thrower.set('L', l);
                ans.set('Thrower', thrower);
            }
        }
        {
            let customName = ans.get('CustomName');
            if (customName instanceof nbt_1.NbtString) {
                customName.set(this.upSpgodingPreJson(customName.get()));
            }
            return ans;
        }
    }
    upBlockNumericIDToBlockState(id, data) {
        const blockState = new nbt_1.NbtCompound();
        const name = new nbt_1.NbtString();
        const properties = new nbt_1.NbtCompound();
        const metadata = data ? data.get() : 0;
        const std = blocks_1.default.to113(blocks_1.default.std112(id.get(), undefined, metadata));
        name.set(std.getName());
        if (std.hasStates()) {
            std.getStates().forEach(v => {
                const val = new nbt_1.NbtString();
                const pairs = v.split('=');
                val.set(pairs[1]);
                properties.set(pairs[0], val);
            });
            blockState.set('Properties', properties);
        }
        blockState.set('Name', name);
        return blockState;
    }
    upSpgodingGamemode(input) {
        switch (input) {
            case '0':
            case 's':
            case 'survival':
                return 'survival';
            case '1':
            case 'c':
            case 'creative':
                return 'creative';
            case '2':
            case 'a':
            case 'adventure':
                return 'adventure';
            case '3':
            case 'sp':
            case 'spectator':
                return 'spectator';
            default:
                throw `Unknown gamemode: ${input}`;
        }
    }
    upSpgodingItemName(input) {
        return items_1.default.to113(items_1.default.std112(undefined, input)).getName();
    }
    upSpgodingItemNbt(input) {
        input = super.upSpgodingItemNbt(input);
        input = items_1.default.to113(items_1.default.std112(undefined, undefined, undefined, undefined, input.toString())).getNbt();
        return input;
    }
    upSpgodingItemTagNbt(input) {
        input = super.upSpgodingItemTagNbt(input);
        {
            const enchantments = input.get('ench');
            input.del('ench');
            if (enchantments instanceof nbt_1.NbtList) {
                for (let i = 0; i < enchantments.length; i++) {
                    const enchantment = enchantments.get(i);
                    if (enchantment instanceof nbt_1.NbtCompound) {
                        let id = enchantment.get('id');
                        if (id instanceof nbt_1.NbtShort || id instanceof nbt_1.NbtInt) {
                            const strID = enchantments_1.default.to113(id.get());
                            id = new nbt_1.NbtString();
                            id.set(strID);
                            enchantment.set('id', id);
                        }
                        enchantments.set(i, enchantment);
                    }
                }
                input.set('Enchantments', enchantments);
            }
        }
        {
            const storedEnchantments = input.get('StoredEnchantments');
            if (storedEnchantments instanceof nbt_1.NbtList) {
                for (let i = 0; i < storedEnchantments.length; i++) {
                    const enchantment = storedEnchantments.get(i);
                    if (enchantment instanceof nbt_1.NbtCompound) {
                        let id = enchantment.get('id');
                        if (id instanceof nbt_1.NbtShort || id instanceof nbt_1.NbtInt) {
                            const strID = enchantments_1.default.to113(id.get());
                            id = new nbt_1.NbtString();
                            id.set(strID);
                            enchantment.set('id', id);
                        }
                        storedEnchantments.set(i, enchantment);
                    }
                }
                input.set('StoredEnchantments', storedEnchantments);
            }
        }
        {
            const display = input.get('display');
            if (display instanceof nbt_1.NbtCompound) {
                const name = display.get('Name');
                if (name instanceof nbt_1.NbtString) {
                    name.set(`{"text":"${utils_1.escape(name.get())}"}`);
                    display.set('Name', name);
                }
                const locName = display.get('LocName');
                display.del('LocName');
                if (locName instanceof nbt_1.NbtString) {
                    locName.set(`{"translate":"${locName.get()}"}`);
                    display.set('Name', locName);
                }
                input.set('display', display);
            }
        }
        return input;
    }
    upSpgodingItemParams(input) {
        return items_1.default.to113(items_1.default.std112(parseInt(input.split(' ')[0]), undefined, parseInt(input.split(' ')[1]))).getNominal();
    }
    upSpgodingItemSlot(input) {
        return input.slice(5);
    }
    upSpgodingTargetSelector(input) {
        const sel = new target_selector_1.TargetSelector();
        sel.parse(input);
        const ans = sel.to113();
        return ans;
    }
    upSpgodingParticle(input) {
        return particles_1.default.to113(input);
    }
    upSpgodingPointsOrLevels(input) {
        if (input.slice(-1).toUpperCase() === 'L') {
            return `${input.slice(0, -1)} levels`;
        }
        else {
            return `${input} points`;
        }
    }
    upSpgodingPreJson(input) {
        return `{"text":"${utils_1.escape(input)}"}`;
    }
    upSpgodingScoreboardCriteria(input) {
        if (input.slice(0, 5) === 'stat.') {
            const subs = input.split(/\./g);
            const newCrit = scoreboard_criterias_1.default.to113(subs[1]);
            switch (subs[1]) {
                case 'mineBlock':
                    let block = '';
                    if (utils_1.isNumeric(subs[2])) {
                        block = blocks_1.default.to113(blocks_1.default.std112(Number(subs[2])))
                            .getName()
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '');
                    }
                    else {
                        block = blocks_1.default.to113(blocks_1.default.std112(undefined, `${subs[2]}:${subs[3]}`))
                            .getName()
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '');
                    }
                    return `minecraft.${newCrit}:${block}`;
                case 'craftItem':
                case 'useItem':
                case 'breakItem':
                case 'pickup':
                case 'drop':
                    let item = '';
                    if (utils_1.isNumeric(subs[2])) {
                        item = items_1.default.to113(items_1.default.std112(Number(subs[2])))
                            .getName()
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '');
                    }
                    else {
                        item = items_1.default.to113(items_1.default.std112(undefined, `${subs[2]}:${subs[3]}`))
                            .getName()
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '');
                    }
                    return `minecraft.${newCrit}:${item}`;
                case 'killEntity':
                case 'entityKilledBy':
                    const entity = entities_1.default.to113(entities_1.default.to112(subs[2])).replace(/:/g, '.');
                    return `minecraft.${newCrit}:${entity}`;
                default:
                    return `minecraft.custom:minecraft.${subs[1]}`;
            }
        }
        else {
            return input;
        }
    }
    upSpgodingSingleSelector(input) {
        let sel = new target_selector_2.TargetSelector(input);
        if (sel.limit !== undefined || sel.variable === 'a' || sel.variable === 'e') {
            sel.limit = '1';
        }
        return sel.toString();
    }
    upSpgodingSound(input) {
        input = utils_1.completeNamespace(input)
            .replace('minecraft:entity.endermen', 'minecraft:entity.enderman')
            .replace('minecraft:entity.enderdragon', 'minecraft:entity.ender_dragon');
        return input;
    }
    upSpgodingToLiteralReplace(input) {
        if (['replace', 'keep', 'destroy'].indexOf(input) !== -1) {
            return input;
        }
        else {
            return 'replace';
        }
    }
}
exports.UpdaterTo113 = UpdaterTo113;
