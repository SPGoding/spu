import { SpuScriptExecutor, WheelChief, Argument } from '../utils/wheel_chief/wheel_chief'
import { Updater } from '../utils/wheel_chief/updater'
import { UpdateResult, isNumeric, getNbtList, getNbtCompound } from '../utils/utils'
import { Commands18To19 } from './commands'
import { ArgumentParser } from '../utils/wheel_chief/parser'
import { TargetSelector } from './target_selector'
import { NbtCompound, NbtFloat, NbtInt, NbtList, NbtString } from '../utils/nbt/nbt'
import Items from './mappings/items'
import Blocks from './mappings/blocks'

class SpuScriptExecutor18To19 implements SpuScriptExecutor {
    public execute(script: string, args: Argument[]) {
        const splited = script.split(' ')

        for (let i = 0; i < splited.length; i++) {
            if (splited[i].slice(0, 1) === '%') {
                splited[i] = args[parseInt(splited[i].slice(1))].value
            } else if (splited[i].slice(0, 1) === '$') {
                const params = splited[i].slice(1).split('%')
                const index1 = parseInt(params[1])
                const index2 = parseInt(params[2])
                const param1 = args[index1] ? args[index1].value : ''
                const param2 = args[index2] ? args[index2].value : ''
                switch (params[0]) {
                    case 'setTypeByNbt': {
                        const nbt = getNbtCompound(param1, 'before 1.12')
                        const riding = nbt.get('Riding')
                        if (riding instanceof NbtCompound) {
                            const id = riding.get('id')
                            if (id instanceof NbtString) {
                                splited[i] = id.get()
                            } else {
                                splited[i] = 'spgoding:undefined'
                            }
                        } else {
                            splited[i] = 'spgoding:undefined'
                        }
                        break
                    }
                    case 'setNbtWithType': {
                        const passenger = getNbtCompound(param1, 'before 1.12')
                        const ridden = passenger.get('Riding')
                        passenger.del('Riding')
                        passenger.set('id', new NbtString(param2))
                        if (ridden instanceof NbtCompound) {
                            ridden.del('id')
                            const passengers = new NbtList()
                            passengers.add(passenger)
                            ridden.set('Passengers', passengers)
                            splited[i] = ridden.toString()
                        } else {
                            splited[i] = '{}'
                        }
                        break
                    }
                    default:
                        throw `Unexpected script method: '${params[0]}'.`
                }
            }
        }

        return splited.join(' ')
    }
}

class ArgumentParser18To19 extends ArgumentParser {
    public parseArgument(parser: string, splited: string[], index: number, properties: any) {
        switch (parser) {
            case 'spgoding:nbt_contains_riding':
                return this.parseSpgodingNbtContainsRiding(splited, index)
            default:
                return super.parseArgument(parser, splited, index, properties)
        }
    }

    protected parseMinecraftEntity(splited: string[], index: number): number {
        let join = splited[index]
        let result = ''

        if (join.charAt(0) !== '@') {
            return 1
        }

        result = TargetSelector.tryParse(join)

        if (result === 'VALID') {
            return 1
        } else {
            for (let i = index + 1; i < splited.length; i++) {
                join += ` ${splited[i]}`
                result = TargetSelector.tryParse(join)
                if (result === 'VALID') {
                    return i - index + 1
                } else {
                    continue
                }
            }
            throw `Expected an entity selector: ${result}`
        }
    }

    protected parseMinecraftNbt(splited: string[], index: number): number {
        let exception
        for (let endIndex = splited.length; endIndex > index; endIndex--) {
            const test = splited.slice(index, endIndex).join(' ')
            try {
                getNbtCompound(test, 'before 1.12')
                return endIndex - index
            } catch (e) {
                exception = e
                continue
            }
        }
        throw exception
    }

    protected parseSpgodingNbtContainsRiding(splited: string[], index: number): number {
        let exception
        for (let endIndex = splited.length; endIndex > index; endIndex--) {
            const test = splited.slice(index, endIndex).join(' ')
            try {
                const nbt = getNbtCompound(test, 'before 1.12')
                if (nbt.get('Riding') instanceof NbtCompound) {
                    return endIndex - index
                } else {
                    throw "Should contain 'Riding'."
                }
            } catch (e) {
                exception = e
                continue
            }
        }
        throw exception
    }
}

export class UpdaterTo19 extends Updater {
    public static upLine(input: string, from: string): UpdateResult {
        const ans: UpdateResult = { command: input, warnings: [] }

        const result = new UpdaterTo19().upSpgodingCommand(ans.command)

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

    protected upSpgodingCommand(input: string) {
        const result = WheelChief.update(input, Commands18To19.commands,
            new ArgumentParser18To19(), this, new SpuScriptExecutor18To19())
        return { command: result.command, warnings: result.warnings }
    }

    protected upSpgodingEntityNbt(input: NbtCompound) {
        let ans = input

        /* Healf */ {
            const healF = ans.get('HealF')
            if (healF instanceof NbtFloat || healF instanceof NbtInt) {
                ans.del('HealF')
                const health = new NbtInt(healF.get())
                ans.set('Health', health)
            }
        }
        /* DropChances */ {
            const dropChances = ans.get('DropChances')
            if (dropChances instanceof NbtList) {
                ans.del('DropChances')
                const armorDropChances = new NbtList()
                const handDropChances = new NbtList()
                armorDropChances.set(0, dropChances.get(0))
                armorDropChances.set(1, dropChances.get(1))
                armorDropChances.set(2, dropChances.get(2))
                armorDropChances.set(3, dropChances.get(3))
                handDropChances.set(0, dropChances.get(5))
                handDropChances.set(1, new NbtFloat(0))
                ans.set('ArmorDropChances', armorDropChances)
                ans.set('HandDropChances', handDropChances)
            }
        }
        /* Equipment */ {
            const equipment = ans.get('Equipment')
            if (equipment instanceof NbtList) {
                ans.del('Equipment')
                const armorItems = new NbtList()
                const handItems = new NbtList()
                const handItem0 = equipment.get(0)
                const armorItem0 = equipment.get(1)
                const armorItem1 = equipment.get(2)
                const armorItem2 = equipment.get(3)
                const armorItem3 = equipment.get(4)
                if (handItem0 instanceof NbtCompound) {
                    handItems.set(0, this.upSpgodingItemNbt(handItem0))
                    handItems.set(1, new NbtCompound())
                    ans.set('HandItems', handItems)
                }
                if (armorItem0 instanceof NbtCompound) {
                    armorItems.set(0, this.upSpgodingItemNbt(armorItem0))
                    if (armorItem1 instanceof NbtCompound) {
                        armorItems.set(1, this.upSpgodingItemNbt(armorItem1))
                        if (armorItem2 instanceof NbtCompound) {
                            armorItems.set(2, this.upSpgodingItemNbt(armorItem2))
                            if (armorItem3 instanceof NbtCompound) {
                                armorItems.set(3, this.upSpgodingItemNbt(armorItem3))
                            } else {
                                armorItems.set(3, new NbtCompound())
                            }
                        } else {
                            armorItems.set(2, new NbtCompound())
                            armorItems.set(3, new NbtCompound())
                        }
                    } else {
                        armorItems.set(1, new NbtCompound())
                        armorItems.set(2, new NbtCompound())
                        armorItems.set(3, new NbtCompound())
                    }
                    ans.set('ArmorItems', armorItems)
                }
            }
        }
        /* Properties (Type) */ {
            const properties = ans.get('Properties')
            if (properties instanceof NbtCompound) {
                ans.del('Properties')
                const type = ans.get('Type')
                const spawnData = properties
                if (type instanceof NbtString) {
                    ans.del('Type')
                    spawnData.set('id', type)
                }
                ans.set('SpawnData', spawnData)
            }
        }
        /* Type */ {
            const type = ans.get('Type')
            if (type instanceof NbtString) {
                ans.del('Type')
                const spawnData = new NbtCompound()
                spawnData.set('id', type)
                ans.set('SpawnData', spawnData)
            }
        }
        /* carried */ {
            const carried = ans.get('carried')
            if (carried instanceof NbtInt) {
                ans.del('carried')
                ans.set('carried', new NbtString(Items.to19(carried.get())))
            }
        }
        /* inTile */ {
            const inTile = ans.get('inTile')
            if (inTile instanceof NbtInt) {
                ans.del('inTile')
                ans.set('inTile', new NbtString(Blocks.to19(inTile.get())))
            }
        }
        /* TileID & TileEntityData */ {
            const tileId = ans.get('TileID')
            if (tileId instanceof NbtInt) {
                ans.del('TileID')
                ans.set('Block', new NbtString(Blocks.to19(tileId.get())))
            }

            let tileEntityData = ans.get('TileEntityData')
            if (tileEntityData instanceof NbtCompound) {
                tileEntityData = this.upSpgodingBlockNbt(tileEntityData)
                ans.set('TileEntityData', tileEntityData)
            }
        }
        /* DisplayTile */ {
            const displayTile = ans.get('DisplayTile')
            if (displayTile instanceof NbtInt) {
                ans.del('DisplayTile')
                ans.set('DisplayTile', new NbtString(Blocks.to19(displayTile.get())))
            }
        }
        /* Riding */ {
            let riding = ans.get('Riding')
            if (riding instanceof NbtCompound) {
                riding = this.upSpgodingEntityNbt(riding)
                ans.set('Riding', riding)
            }
        }

        ans = super.upSpgodingEntityNbt(ans)
        return ans
    }

    protected upSpgodingItemNbt(input: NbtCompound) {
        let ans = input

        /* id */ {
            const id = ans.get('id')
            if (id instanceof NbtInt) {
                ans.del('id')
                ans.set('id', new NbtString(Items.to19(id.get())))
            }
        }

        ans = super.upSpgodingItemNbt(input)

        return ans
    }

    protected upSpgodingTargetSelector(input: string) {
        const sel = new TargetSelector(input)

        return sel.toString()
    }
}
