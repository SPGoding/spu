import { SpuScriptExecutor, WheelChief, Argument } from '../utils/wheel_chief/wheel_chief'
import { Commands112To113 } from './commands'
import { Updater } from '../utils/wheel_chief/updater'
import { escape, completeNamespace, isNumeric, getNbtCompound, getUuidLeastUuidMost } from '../utils/utils'
import { NbtCompound, NbtString, NbtShort, NbtInt, NbtByte, NbtLong, NbtList } from '../utils/nbt/nbt'
import { Updater111To112 } from '../bad_practice/111to112/updater'
import { Updater19To111 } from '../bad_practice/19to111/updater'
import { Updater18To19 } from '../bad_practice/18to19/updater'
import { TargetSelector as TargetSelector112 } from './target_selector'
import { TargetSelector as TargetSelector113 } from '../utils/target_selector'
import Blocks from './mappings/blocks'
import Items from './mappings/items'
import ScoreboardCriterias from './mappings/scoreboard_criterias'
import Effects from './mappings/effects'
import Enchantments from './mappings/enchantments'
import Particles from './mappings/particles'
import Entities from './mappings/entities'

export class SpuScriptExecutor112To113 implements SpuScriptExecutor {
    public execute(script: string, args: Argument[]) {
        let splited = script.split(' ')

        for (let i = 0; i < splited.length; i++) {
            if (splited[i].slice(0, 1) === '%') {
                splited[i] = args[parseInt(splited[i].slice(1))].value
            } else if (splited[i].slice(0, 1) === '$') {
                let params = splited[i].slice(1).split('%')
                let index1 = parseInt(params[1])
                let index2 = parseInt(params[2])
                let index3 = parseInt(params[3])
                let param1 = args[index1] ? args[index1].value : ''
                let param2 = args[index2] ? args[index2].value : ''
                let param3 = args[index3] ? args[index3].value : ''
                if (args[parseInt(params[2])]) {
                    param2 = args[parseInt(params[2])].value
                }
                if (args[parseInt(params[3])]) {
                    param3 = args[parseInt(params[3])].value
                }
                switch (params[0]) {
                    case 'setBlockParam':
                        splited[i] = Blocks.to113(Blocks.std112(parseInt(param1))).getFull()
                        break
                    case 'setItemParams':
                        splited[i] = Items.to113(Items.std112(parseInt(param1), undefined, parseInt(param2))).getNominal()
                        break
                    case 'setNameToItemStack':
                        splited[i] = Items.to113(Items.std112(undefined, param1)).getNominal()
                        break
                    case 'setNameDataToItemStack':
                        splited[i] = Items.to113(Items.std112(undefined, param1, parseInt(param2))).getNominal()
                        break
                    case 'setNameDataNbtToItemStack':
                        splited[i] = Items.to113(Items.std112(undefined, param1, parseInt(param2), param3)).getNominal()
                        break
                    case 'setNameToBlockState':
                        splited[i] = Blocks.to113(Blocks.std112(undefined, param1)).getFull()
                        break
                    case 'setNameStatesToBlockState':
                        if (isNumeric(param2)) {
                            splited[i] = Blocks.to113(Blocks.std112(undefined, param1, parseInt(param2))).getFull()
                        } else {
                            splited[i] = Blocks.to113(Blocks.std112(undefined, param1, undefined, param2)).getFull()
                        }
                        break
                    case 'setNameStatesNbtToBlockState':
                        if (isNumeric(param2)) {
                            splited[i] = Blocks.to113(Blocks.std112(undefined, param1, parseInt(param2), undefined, param3)).getFull()
                        } else {
                            splited[i] = Blocks.to113(Blocks.std112(undefined, param1, undefined, param2, param3)).getFull()
                        }
                        break
                    case 'setNbtToSelector':
                        let sel112 = new TargetSelector112()
                        sel112.parse(param1)
                        let sel113 = new TargetSelector113(sel112.to113())
                        sel113.nbt = getNbtCompound(param2)
                        splited[i] = sel113.toString()
                        break
                    default:
                        throw `Unexpected script method: '${params[0]}'.`
                }
            }
        }

        return splited.join(' ')
    }
}

export class UpdaterTo113 extends Updater {
    public static upLine(input: string, from: string) {
        if (from === '18') {
            input = Updater111To112.upLine(
                Updater19To111.upLine(
                    Updater18To19.upLine(input).split(' !> ').slice(0, -1).join(' !> ')
                ).split(' !> ').slice(0, -1).join(' !> ')
            ).split(' !> ').slice(0, -1).join(' !> ')
        } else if (from === '19') {
            input = Updater111To112.upLine(
                Updater19To111.upLine(input).split(' !> ').slice(0, -1).join(' !> ')
            ).split(' !> ').slice(0, -1).join(' !> ')
        } else if (from === '111') {
            input = Updater111To112.upLine(input).split(' !> ').slice(0, -1).join(' !> ')
        } else if (from !== '112') {
            throw `Expected version: '18', '19', '111' or '112' but got '${from}'.`
        }

        return new UpdaterTo113().upSpgodingCommand(input)
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
                case 'spgoding:old_entity':
                    return this.upSpgodingOldEntity(input)
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

    protected upSpgodingBlockName(input: string) {
        return Blocks.to113(Blocks.std112(undefined, input)).getName()
    }

    protected upSpgodingBlockParam(input: string) {
        return Blocks.to113(Blocks.std112(parseInt(input))).getFull()
    }

    protected upSpgodingCommand(input: string): string {
        return WheelChief.update(input, Commands112To113.commands, new SpuScriptExecutor112To113(), this)
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
        input = super.upSpgodingEntityNbt(input)

        /* carried & carriedData */ {
            const carried = input.get('carried')
            const carriedData = input.get('carriedData')
            input.del('carried')
            input.del('carriedData')
            if (
                (carried instanceof NbtShort || carried instanceof NbtInt) &&
                (carriedData instanceof NbtShort || carriedData instanceof NbtInt || typeof carriedData === 'undefined')
            ) {
                const carriedBlockState = this.upBlockNumericIDToBlockState(carried, carriedData)
                input.set('carriedBlockState', carriedBlockState)
            }
        }
        /* inTile */ {
            const inTile = input.get('inTile')
            input.del('inTile')
            if (inTile instanceof NbtString) {
                const inBlockState = Blocks.upSpgodingBlockState(inTile)
                input.set('inBlockState', inBlockState)
            }
        }
        /* Block & Data & TileEntityData */ {
            const block = input.get('Block')
            const data = input.get('Data')
            input.del('Block')
            input.del('Data')
            if (
                block instanceof NbtString &&
                (data instanceof NbtByte || data instanceof NbtInt || typeof data === 'undefined')
            ) {
                const blockState = Blocks.upSpgodingBlockState(block, data)
                input.set('BlockState', blockState)
            }

            let tileEntityData = input.get('TileEntityData')
            if (
                block instanceof NbtString &&
                tileEntityData instanceof NbtCompound &&
                (data instanceof NbtInt || data instanceof NbtByte || data === undefined)
            ) {
                tileEntityData = Blocks.to113(
                    Blocks.std112(undefined, block.get(), data ? data.get() : 0, undefined, tileEntityData.toString())
                ).getNbt()
                input.set('TileEntityData', tileEntityData)
            }
        }
        /* DisplayTile & DisplayData */ {
            const displayTile = input.get('DisplayTile')
            const displayData = input.get('DisplayData')
            input.del('DisplayTile')
            input.del('DisplayData')
            if (
                displayTile instanceof NbtString &&
                (displayData instanceof NbtInt || typeof displayData === 'undefined')
            ) {
                const displayState = Blocks.upSpgodingBlockState(displayTile, displayData)
                input.set('DisplayState', displayState)
            }
        }
        /* Particle & ParticleParam1 & ParticleParam2 */ {
            const particle = input.get('Particle')
            const particleParam1 = input.get('ParticleParam1')
            const particleParam2 = input.get('ParticleParam2')
            input.del('ParticleParam1')
            input.del('ParticleParam2')
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
            let owner = input.get('Owner')
            input.del('Owner')
            if (owner instanceof NbtString) {
                const uuid = getUuidLeastUuidMost(owner.get())
                const m = new NbtLong(uuid.M)
                const l = new NbtLong(uuid.L)
                owner = new NbtCompound()
                owner.set('M', m)
                owner.set('L', l)
                input.set('Owner', owner)
            }
        }
        /* owner */ {
            let owner = input.get('owner')
            input.del('owner')
            if (owner instanceof NbtString) {
                const uuid = getUuidLeastUuidMost(owner.get())
                const m = new NbtLong(uuid.M)
                const l = new NbtLong(uuid.L)
                owner = new NbtCompound()
                owner.set('M', m)
                owner.set('L', l)
                input.set('owner', owner)
            }
        }
        /* Thrower */ {
            let thrower = input.get('Thrower')
            input.del('Thrower')
            if (thrower instanceof NbtString) {
                const uuid = getUuidLeastUuidMost(thrower.get())
                const m = new NbtLong(uuid.M)
                const l = new NbtLong(uuid.L)
                thrower = new NbtCompound()
                thrower.set('M', m)
                thrower.set('L', l)
                input.set('Thrower', thrower)
            }
        }

        return input
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

    protected upSpgodingItemName(input: string) {
        return Items.to113(Items.std112(undefined, input)).getName()
    }

    protected upSpgodingItemNbt(input: NbtCompound): NbtCompound {
        input = super.upSpgodingItemNbt(input)

        input = Items.to113(Items.std112(undefined, undefined, undefined, undefined, input.toString())).getNbt()

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

    protected upSpgodingOldEntity(input: string) {
        try {
            const sel112 = new TargetSelector112()
            sel112.parse(input)
            const sel113 = new TargetSelector113(sel112.to113())
            return this.upSpgodingTargetSelector(sel113).toString()
        } catch {
            return input
        }
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
        let sel = new TargetSelector113(input)
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
