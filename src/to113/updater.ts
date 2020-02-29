import { WheelChief } from '../utils/wheel_chief/wheel_chief'
import { Commands112To113 } from './commands'
import { Updater } from '../utils/wheel_chief/updater'
import { escape, completeNamespace, isNumeric, getUuidLeastUuidMost, UpdateResult } from '../utils/utils'
import { NbtCompound, NbtString, NbtShort, NbtInt, NbtByte, NbtLong, NbtList } from '../utils/nbt/nbt'
import { UpdaterTo112 } from '../to112/updater'
import { Selector113 as TargetSelector112 } from './utils/selector'
import { TargetSelector as TargetSelector113 } from '../utils/selector'
import Blocks from './mappings/blocks'
import Items from './mappings/items'
import ScoreboardCriterias from './mappings/scoreboard_criterias'
import Effects from './mappings/effects'
import Enchantments from './mappings/enchantments'
import Particles from './mappings/particles'
import Entities from './mappings/entities'
import { SpuScriptExecutor112To113 } from './executor'
import { ArgumentParser112To113 } from './parser'

export class UpdaterTo113 extends Updater {
    public static upLine(input: string, from: string): UpdateResult {
        const ans: UpdateResult = { command: input, warnings: [] }

        if (['18', '19', '111'].indexOf(from) !== -1) {
            const result = UpdaterTo112.upLine(ans.command, from)
            ans.command = result.command
            ans.warnings = result.warnings
        } else if (from !== '112') {
            throw `Expected from version: '18', '19', '111' or '112' but got '${from}'.`
        }

        const result = new UpdaterTo113().upSpgodingCommand(ans.command)

        ans.command = result.command
        ans.warnings = ans.warnings.concat(result.warnings)

        return ans
    }

    public upArgument(input: string, updater: string) {
        switch (updater) {
            case 'spgoding:difficulty':
                return this.upSpgodingDifficulty(input)
            case 'spgoding:effect':
                return this.upSpgodingEffect(input)
            case 'spgoding:enchantment':
                return this.upSpgodingEnchantment(input)
            case 'spgoding:gamemode':
                return this.upSpgodingGamemode(input)
            case 'spgoding:item_slot':
                return this.upSpgodingItemSlot(input)
            case 'spgoding:particle':
                return this.upSpgodingParticle(input)
            case 'spgoding:points_or_levels':
                return this.upSpgodingPointsOrLevels(input)
            case 'spgoding:pre_json':
                return this.upSpgodingPreJson(input)
            case 'spgoding:scoreboard_criteria':
                return this.upSpgodingScoreboardCriteria(input)
            case 'spgoding:single_selector':
                return this.upSpgodingSingleSelector(input)
            case 'spgoding:sound':
                return this.upSpgodingSound(input)
            case 'spgoding:to_literal_replace':
                return this.upSpgodingToLiteralReplace(input)
            default:
                return super.upArgument(input, updater)
        }
    }

    protected upMinecraftEntitySummon(input: string) {
        input = super.upMinecraftEntitySummon(input)

        input = Entities.to113(input)

        return input
    }

    protected upSpgodingBlockNbt(input: NbtCompound) {
        let ans = super.upSpgodingBlockNbt(input)

        /* CustomName */ {
            const customName = ans.get('CustomName')
            if (customName instanceof NbtString) {
                customName.set(this.upSpgodingPreJson(customName.get()))
            }
        }

        ans = Blocks.to113(Blocks.std112(undefined, undefined, undefined, undefined, input.toString())).getNbt()

        return ans
    }

    protected upSpgodingBlockParam(input: string) {
        return Blocks.to113(Blocks.std112(parseInt(input))).getFull()
    }

    protected upSpgodingCommand(input: string) {
        const result = WheelChief.update(input, Commands112To113.commands,
            new ArgumentParser112To113(), this, new SpuScriptExecutor112To113())
        return {
            command: result.command.charAt(0) === '/' ? result.command.slice(1) : result.command,
            warnings: result.warnings
        }
    }

    protected upSpgodingDifficulty(input: string) {
        switch (input) {
            case '0':
            case 'p':
            case 'peaceful':
                return 'peaceful'
            case '1':
            case 'e':
            case 'easy':
                return 'easy'
            case '2':
            case 'n':
            case 'normal':
                return 'normal'
            case '3':
            case 'h':
            case 'hard':
                return 'hard'
            default:
                throw `Unknown difficulty: ${input}`
        }
    }

    protected upSpgodingEffect(input: string) {
        if (isNumeric(input)) {
            return Effects.to113(Number(input))
        } else {
            return input
        }
    }

    protected upSpgodingEnchantment(input: string) {
        if (isNumeric(input)) {
            return Enchantments.to113(Number(input))
        } else {
            return input
        }
    }

    protected upSpgodingEntityNbt(input: NbtCompound) {
        const ans = super.upSpgodingEntityNbt(input)

        /* carried & carriedData */ {
            const carried = ans.get('carried')
            const carriedData = ans.get('carriedData')
            ans.del('carried')
            ans.del('carriedData')
            if (
                (carried instanceof NbtString) &&
                (carriedData instanceof NbtShort || carriedData instanceof NbtInt || typeof carriedData === 'undefined')
            ) {
                const carriedBlockState = Blocks.upStringToBlockState(carried, carriedData)
                ans.set('carriedBlockState', carriedBlockState)
            } else if (
                (carried instanceof NbtShort || carried instanceof NbtInt) &&
                (carriedData instanceof NbtShort || carriedData instanceof NbtInt || typeof carriedData === 'undefined')
            ) {
                const carriedBlockState = this.upBlockNumericIDToBlockState(carried, carriedData)
                ans.set('carriedBlockState', carriedBlockState)
            }
        }
        /* inTile */ {
            const inTile = ans.get('inTile')
            ans.del('inTile')
            if (inTile instanceof NbtString) {
                const inBlockState = Blocks.upStringToBlockState(inTile)
                ans.set('inBlockState', inBlockState)
            }
        }
        /* Block & Data & TileEntityData */ {
            const block = ans.get('Block')
            const data = ans.get('Data')
            ans.del('Block')
            ans.del('Data')
            if (
                block instanceof NbtString &&
                (data instanceof NbtByte || data instanceof NbtInt || typeof data === 'undefined')
            ) {
                const blockState = Blocks.upStringToBlockState(block, data)
                ans.set('BlockState', blockState)
            }

            let tileEntityData = ans.get('TileEntityData')
            if (
                block instanceof NbtString &&
                tileEntityData instanceof NbtCompound &&
                (data instanceof NbtInt || data instanceof NbtByte || data === undefined)
            ) {
                tileEntityData = Blocks.to113(
                    Blocks.std112(undefined, block.get(), data ? data.get() : 0, undefined, tileEntityData.toString())
                ).getNbt()
                ans.set('TileEntityData', tileEntityData)
            }
        }
        /* DisplayTile & DisplayData */ {
            const displayTile = ans.get('DisplayTile')
            const displayData = ans.get('DisplayData')
            ans.del('DisplayTile')
            ans.del('DisplayData')
            if (
                displayTile instanceof NbtString &&
                (displayData instanceof NbtInt || typeof displayData === 'undefined')
            ) {
                const displayState = Blocks.upStringToBlockState(displayTile, displayData)
                ans.set('DisplayState', displayState)
            }
        }
        /* Particle & ParticleParam1 & ParticleParam2 */ {
            const particle = ans.get('Particle')
            const particleParam1 = ans.get('ParticleParam1')
            const particleParam2 = ans.get('ParticleParam2')
            ans.del('ParticleParam1')
            ans.del('ParticleParam2')
            if (particle instanceof NbtString) {
                particle.set(this.upSpgodingParticle(particle.get()))
                if (particle.get() === 'block') {
                    if (particleParam1 instanceof NbtInt) {
                        particle.set(particle.get() + ' ' + this.upSpgodingBlockParam(particleParam1.get().toString()))
                    }
                } else if (particle.get() === 'item') {
                    if (particleParam1 instanceof NbtInt && particleParam2 instanceof NbtInt) {
                        particle.set(
                            particle.get() +
                            ' ' +
                            this.upSpgodingItemParams(
                                particleParam1.get().toString() + ' ' + particleParam2.get().toString()
                            )
                        )
                    }
                }
            }
        }
        /* Owner */ {
            let owner = ans.get('Owner')
            ans.del('Owner')
            if (owner instanceof NbtString) {
                const uuid = getUuidLeastUuidMost(owner.get())
                const m = new NbtLong(uuid.M)
                const l = new NbtLong(uuid.L)
                owner = new NbtCompound()
                owner.set('M', m)
                owner.set('L', l)
                ans.set('Owner', owner)
            }
        }
        /* owner */ {
            let owner = ans.get('owner')
            ans.del('owner')
            if (owner instanceof NbtString) {
                const uuid = getUuidLeastUuidMost(owner.get())
                const m = new NbtLong(uuid.M)
                const l = new NbtLong(uuid.L)
                owner = new NbtCompound()
                owner.set('M', m)
                owner.set('L', l)
                ans.set('owner', owner)
            }
        }
        /* Thrower */ {
            let thrower = ans.get('Thrower')
            ans.del('Thrower')
            if (thrower instanceof NbtString) {
                const uuid = getUuidLeastUuidMost(thrower.get())
                const m = new NbtLong(uuid.M)
                const l = new NbtLong(uuid.L)
                thrower = new NbtCompound()
                thrower.set('M', m)
                thrower.set('L', l)
                ans.set('Thrower', thrower)
            }
        }
        /* CustomName */{
            const customName = ans.get('CustomName')
            if (customName instanceof NbtString) {
                customName.set(this.upSpgodingPreJson(customName.get()))
            }

            return ans
        }
    }

    private upBlockNumericIDToBlockState(id: NbtShort | NbtInt, data?: NbtShort | NbtInt) {
        const blockState = new NbtCompound()
        const name = new NbtString()
        const properties = new NbtCompound()
        const metadata = data ? data.get() : 0
        const std = Blocks.to113(Blocks.std112(id.get(), undefined, metadata))
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

    public upSpgodingGamemode(input: string) {
        switch (input) {
            case '0':
            case 's':
            case 'survival':
                return 'survival'
            case '1':
            case 'c':
            case 'creative':
                return 'creative'
            case '2':
            case 'a':
            case 'adventure':
                return 'adventure'
            case '3':
            case 'sp':
            case 'spectator':
                return 'spectator'
            default:
                throw `Unknown gamemode: ${input}`
        }
    }

    protected upSpgodingItemNbt(input: NbtCompound): NbtCompound {
        input = super.upSpgodingItemNbt(input)

        const result = Items.to113(Items.std112(undefined, undefined, undefined, undefined, input.toString()))
        input = result.getNbt()

        return input
    }

    protected upSpgodingItemTagNbt(input: NbtCompound) {
        input = super.upSpgodingItemTagNbt(input)

        /* ench */ {
            const enchantments = input.get('ench')
            input.del('ench')
            if (enchantments instanceof NbtList) {
                for (let i = 0; i < enchantments.length; i++) {
                    const enchantment = enchantments.get(i)
                    if (enchantment instanceof NbtCompound) {
                        let id = enchantment.get('id')
                        if (id instanceof NbtShort || id instanceof NbtInt) {
                            const strID = Enchantments.to113(id.get())
                            id = new NbtString()
                            id.set(strID)
                            enchantment.set('id', id)
                        }
                        enchantments.set(i, enchantment)
                    }
                }
                input.set('Enchantments', enchantments)
            }
        }
        /* StoredEnchantments */ {
            const storedEnchantments = input.get('StoredEnchantments')
            if (storedEnchantments instanceof NbtList) {
                for (let i = 0; i < storedEnchantments.length; i++) {
                    const enchantment = storedEnchantments.get(i)
                    if (enchantment instanceof NbtCompound) {
                        let id = enchantment.get('id')
                        if (id instanceof NbtShort || id instanceof NbtInt) {
                            const strID = Enchantments.to113(id.get())
                            id = new NbtString()
                            id.set(strID)
                            enchantment.set('id', id)
                        }
                        storedEnchantments.set(i, enchantment)
                    }
                }
                input.set('StoredEnchantments', storedEnchantments)
            }
        }
        /* display.(Name|LocName) */ {
            const display = input.get('display')
            if (display instanceof NbtCompound) {
                const name = display.get('Name')
                if (name instanceof NbtString) {
                    name.set(`{"text":"${escape(name.get())}"}`)
                    display.set('Name', name)
                }
                const locName = display.get('LocName')
                display.del('LocName')
                if (locName instanceof NbtString) {
                    locName.set(`{"translate":"${locName.get()}"}`)
                    display.set('Name', locName)
                }
                input.set('display', display)
            }
        }

        return input
    }

    protected upSpgodingItemParams(input: string) {
        return Items.to113(Items.std112(parseInt(input.split(' ')[0]), undefined, parseInt(input.split(' ')[1]))).getNominal()
    }

    protected upSpgodingItemSlot(input: string) {
        return input.slice(5)
    }

    protected upSpgodingTargetSelector(input: string) {
        const sel = new TargetSelector112()
        sel.parse(input)
        const ans = sel.to113()
        return ans
    }

    protected upSpgodingParticle(input: string) {
        return Particles.to113(input)
    }

    protected upSpgodingPointsOrLevels(input: string) {
        if (input.slice(-1).toUpperCase() === 'L') {
            return `${input.slice(0, -1)} levels`
        } else {
            return `${input} points`
        }
    }

    protected upSpgodingPreJson(input: string) {
        return `{"text":"${escape(input)}"}`
    }

    protected upSpgodingScoreboardCriteria(input: string) {
        if (input.slice(0, 5) === 'stat.') {
            const subs = input.split(/\./g)
            const newCrit = ScoreboardCriterias.to113(subs[1])
            switch (subs[1]) {
                case 'mineBlock':
                    let block = ''
                    if (isNumeric(subs[2])) {
                        block = Blocks.to113(Blocks.std112(Number(subs[2])))
                            .getName()
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '')
                    } else {
                        block = Blocks.to113(Blocks.std112(undefined, `${subs[2]}:${subs[3]}`))
                            .getName()
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '')
                    }
                    return `minecraft.${newCrit}:${block}`
                case 'craftItem':
                case 'useItem':
                case 'breakItem':
                case 'pickup':
                case 'drop':
                    let item = ''
                    if (isNumeric(subs[2])) {
                        item = Items.to113(Items.std112(Number(subs[2])))
                            .getName()
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '')
                    } else {
                        item = Items.to113(Items.std112(undefined, `${subs[2]}:${subs[3]}`))
                            .getName()
                            .replace(/:/g, '.')
                            .replace(/\[.*$/g, '')
                    }
                    return `minecraft.${newCrit}:${item}`
                case 'killEntity':
                case 'entityKilledBy':
                    const entity = Entities.to113(Entities.to112(subs[2])).replace(/:/g, '.')
                    return `minecraft.${newCrit}:${entity}`
                default:
                    return `minecraft.custom:minecraft.${subs[1]}`
            }
        } else {
            return input
        }
    }

    protected upSpgodingSingleSelector(input: string) {
        const sel = new TargetSelector113(input)
        if (sel.limit !== undefined || sel.variable === 'a' || sel.variable === 'e') {
            sel.limit = '1'
        }

        return sel.toString()
    }

    protected upSpgodingSound(input: string) {
        input = completeNamespace(input)
            .replace('minecraft:entity.endermen', 'minecraft:entity.enderman')
            .replace('minecraft:entity.enderdragon', 'minecraft:entity.ender_dragon')

        return input
    }

    protected upSpgodingToLiteralReplace(input: string) {
        if (['replace', 'keep', 'destroy'].indexOf(input) !== -1) {
            return input
        } else {
            return 'replace'
        }
    }
}
