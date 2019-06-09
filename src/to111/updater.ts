import { WheelChief } from '../utils/wheel_chief/wheel_chief'
import { Updater } from '../utils/wheel_chief/updater'
import { UpdateResult, isNumeric, getNbtList, getNbtCompound } from '../utils/utils'
import { Commands19To111 } from './commands'
import { Selector111 } from './utils/selector'
import { NbtCompound, NbtInt, NbtString, NbtByte } from '../utils/nbt/nbt'
import Entities from './mappings/entities'
import { UpdaterTo19 } from '../to19/updater'
import { SpuScriptExecutor19To111 } from './excutor'
import { ArgumentParser19To111 } from './parser'

export class UpdaterTo111 extends Updater {
    public static upLine(input: string, from: string): UpdateResult {
        const ans: UpdateResult = { command: input, warnings: [] }

        if (['18'].indexOf(from) !== -1) {
            const result = UpdaterTo19.upLine(ans.command, from)
            ans.command = result.command
            ans.warnings = result.warnings
        } else if (from !== '19') {
            throw `Expected from version: '18' or '19' but got '${from}'.`
        }

        const result = new UpdaterTo111().upSpgodingCommand(ans.command)

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
            const json = JSON.parse(getNbtList(input, 'before 1.12').toJson())
            const result: string[] = []
            for (const i of json) {
                result.push(this.upMinecraftComponent(JSON.stringify(i)))
            }
            return `[${result.join()}]`
        } else {
            const json = JSON.parse(getNbtCompound(input, 'before 1.12').toJson())
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

    protected upMinecraftEntitySummon(input: string) {
        return Entities.to111(input)
    }

    protected upSpgodingCommand(input: string) {
        const result = WheelChief.update(input, Commands19To111.commands,
            new ArgumentParser19To111(), this, new SpuScriptExecutor19To111())
        return { command: result.command, warnings: result.warnings }
    }

    protected upSpgodingEntityNbt(input: NbtCompound) {
        let ans = input

        /* id, Type, Elder, ZombieType, SkeletonType */ {
            const id = ans.get('id')
            if (id instanceof NbtString) {
                id.set(Entities.to111(id.get()))
                const result = UpdaterTo111.upEntityNbtWithType(ans, id.get())
                ans = result.nbt
                id.set(result.type)
            }
        }

        ans = super.upSpgodingEntityNbt(ans)
        return ans
    }

    public static upEntityNbtWithType(nbt: NbtCompound, entityType: string) {
        switch (entityType) {
            case 'minecraft:horse': {
                const type = nbt.get('Type')
                if (type instanceof NbtInt) {
                    nbt.del('Type')
                    switch (type.get()) {
                        case 1:
                            entityType = 'minecraft:donkey'
                            break
                        case 2:
                            entityType = 'minecraft:mule'
                            break
                        case 3:
                            entityType = 'minecraft:zombie_horse'
                            break
                        case 4:
                            entityType = 'minecraft:skeleton_horse'
                            break
                        default:
                            break
                    }
                }
                break
            } case 'minecraft:guardian': {
                const elder = nbt.get('Elder')
                if (elder instanceof NbtByte || elder instanceof NbtInt) {
                    nbt.del('Elder')
                    switch (elder.get()) {
                        case 1:
                            entityType = 'minecraft:elder_guardian'
                            break
                        default:
                            break
                    }
                }
            } break
            case 'minecraft:zombie': {
                const zombieType = nbt.get('ZombieType')
                if (zombieType instanceof NbtInt) {
                    nbt.del('ZombieType')
                    switch (zombieType.get()) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                            entityType = 'minecraft:zombie_villager'
                            const profession = new NbtInt(zombieType.get())
                            nbt.set('Profession', profession)
                            break
                        case 6:
                            entityType = 'minecraft:husk'
                            break
                        default:
                            break
                    }
                }
                break
            }
            case 'minecraft:skeleton': {
                const skeletonType = nbt.get('SkeletonType')
                if (skeletonType instanceof NbtByte || skeletonType instanceof NbtInt) {
                    nbt.del('SkeletonType')
                    switch (skeletonType.get()) {
                        case 1:
                            entityType = 'minecraft:wither_skeleton'
                            break
                        case 2:
                            entityType = 'minecraft:stray'
                            break
                        default:
                            break
                    }
                }
            }
        }

        return { nbt: nbt, type: entityType }
    }

    protected upSpgodingTargetSelector(input: string) {
        const sel = new Selector111(input)

        return sel.toString()
    }
}
