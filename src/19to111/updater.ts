import Spuses from "./mappings/spuses";
import SpuScript from "../spu_script";
import ArgumentReader from "../utils/argument_reader";
import Checker from "./checker";
import Entities from "./mappings/entities";
import Selector from "./selector";
import { getNbt } from "../utils/utils";
import { NbtCompound, NbtString, NbtList, NbtValue, NbtByte, NbtInt } from "../utils/nbt/nbt";

export default class Updater {
    /**
        Returns an result map from an 1.12 command and an 1.12 spus.
        @param cmd An 1.12 minecraft command.
        @param spus An 1.12 spus defined in spuses.ts.
        @returns NULLABLE. A map filled with converted value.
        @example {'%n': 'converted value'}.
     */
    public static getResultMap(cmd: string, spus: string) {
        let spusReader = new ArgumentReader(spus)
        let spusArg = spusReader.next()
        let cmdSplited = cmd.split(' ')
        let begin: number = 0
        let end: number = cmdSplited.length
        let cmdArg = cmdSplited.slice(begin, end).join(' ')
        let map = new Map<string, string>()
        let cnt = 0
        while (spusArg !== '' && begin < cmdSplited.length) {
            while (!Checker.isArgumentMatch(cmdArg, spusArg)) {
                if (cmdArg !== '') {
                    end -= 1
                    cmdArg = cmdSplited.slice(begin, end).join(' ')
                } else {
                    // The cmdArg has sliced to ''.
                    // Still can't match.
                    return null
                }
            }

            begin = end
            end = cmdSplited.length

            if (spusArg.charAt(0) === '%') {
                map.set(`%${cnt++}`, Updater.upArgument(cmdArg, spusArg))
            }
            spusArg = spusReader.next()
            cmdArg = cmdSplited.slice(begin, end).join(' ')
        }
        if (cmdArg === '' && spusArg === '') {
            // Match successfully.
            return map
        } else {
            return null
        }
    }

    public static upLine(input: string) {
        if (/^\s*$/.test(input)) {
            return input
        } else {
            return Updater.upCommand(input)
        }
    }

    private static upCommand(input: string) {
        let slash = false

        if (input.slice(0, 1) === '/') {
            input = input.slice(1)
            slash = true
        }

        for (const spusOld of Spuses.pairs.keys()) {
            let map = Updater.getResultMap(input, spusOld)
            if (map) {
                let spusNew = Spuses.pairs.get(spusOld)
                if (spusNew) {
                    let spus = new SpuScript(spusNew)
                    let result = spus.compileWith(map)
                    if (slash) {
                        result = `/${result}`
                    }
                    return result
                }
            }
        }

        throw `Unknown command: ${input}`
    }

    private static upArgument(arg: string, spus: string) {
        switch (spus.slice(1)) {
            case 'block_nbt':
                return Updater.upBlockNbt(arg)
            case 'bool':
                return arg
            case 'command':
                return Updater.upCommand(arg)
            case 'entity':
                return Updater.upEntity(arg)
            case 'entity_nbt':
                return Updater.upEntityNbt(arg)
            case 'entity_type':
                return Updater.upEntityType(arg)
            case 'item_nbt':
                return Updater.upItemNbt(arg)
            case 'item_tag_nbt':
                return Updater.upItemTagNbt(arg)
            case 'json':
                return Updater.upJson(arg)
            case 'literal':
                return arg
            case 'num':
                return arg
            case 'num_or_star':
                return arg
            case 'say_string':
                return arg
            case 'string':
                return arg
            case 'vec_2':
                return arg
            case 'vec_3':
                return arg
            case 'word':
                return arg
            default:
                throw `Unknown arg type: '${spus}'`
        }
    }

    private static upBlockNbt(input: string) {
        const nbt = getNbt(input, 'before 1.12')
        /* SpawnPotentials */ {
            const spawnPotentials = nbt.get('SpawnPotentials')
            if (spawnPotentials instanceof NbtList) {
                spawnPotentials.forEach((potential: NbtValue) => {
                    if (potential instanceof NbtCompound) {
                        let entity = potential.get('Entity')
                        if (entity instanceof NbtCompound) {
                            entity = getNbt(Updater.upEntityNbt(entity.toString()))
                            potential.set('Entity', entity)
                        }
                    }
                })
            }
        }
        /* SpawnData */ {
            let spawnData = nbt.get('SpawnData')
            if (spawnData instanceof NbtCompound) {
                spawnData = getNbt(Updater.upEntityNbt(spawnData.toString()))
                nbt.set('SpawnData', spawnData)
            }
        }
        return nbt.toString()
    }

    private static upEntity(input: string) {
        let sel = new Selector()
        sel.parse(input)
        return sel.to111()
    }

    private static upEntityNbt(input_nbt: string) {
        let nbt = getNbt(input_nbt, 'before 1.12')
        let id = nbt.get('id')
        /* id, Type, Elder, ZombieType, SkeletonType */ {
            if (id instanceof NbtString) {
                id.set(Entities.to111(id.get()))
                const ans = this.upEntityNbtWithType(nbt, id.get());
                nbt = ans.nbt
                id = nbt.get('id')
                if (id instanceof NbtString) {
                    id.set(ans.entityType)
                }
            }
        }
        /* Passengers */ {
            const passengers = nbt.get('Passengers')
            if (passengers instanceof NbtList) {
                for (let i = 0; i < passengers.length; i++) {
                    let passenger = passengers.get(i)
                    passenger = getNbt(Updater.upEntityNbt(passenger.toString()))
                    passengers.set(i, passenger)
                }
            }
        }
        /* SpawnPotentials */ {
            const spawnPotentials = nbt.get('SpawnPotentials')
            if (spawnPotentials instanceof NbtList) {
                spawnPotentials.forEach((potential: NbtValue) => {
                    if (potential instanceof NbtCompound) {
                        let entity = potential.get('Entity')
                        if (entity instanceof NbtCompound) {
                            entity = getNbt(Updater.upEntityNbt(entity.toString()))
                            potential.set('Entity', entity)
                        }
                    }
                })
            }
        }
        /* SpawnData */ {
            let spawnData = nbt.get('SpawnData')
            if (spawnData instanceof NbtCompound) {
                spawnData = getNbt(Updater.upEntityNbt(spawnData.toString()))
                nbt.set('SpawnData', spawnData)
            }
        }
        return nbt.toString()
    }

    public static upEntityNbtWithType(nbt: NbtCompound, entityType: string) {
        switch (entityType) {
            case 'minecraft:horse': {
                const type = nbt.get('Type')
                nbt.del('Type')
                if (type instanceof NbtInt) {
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
                nbt.del('Elder')
                if (elder instanceof NbtByte || elder instanceof NbtInt) {
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
                nbt.del('ZombieType')
                if (zombieType instanceof NbtInt) {
                    switch (zombieType.get()) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                            entityType = 'minecraft:zombie_villager'
                            let profession = new NbtInt(zombieType.get())
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
                nbt.del('SkeletonType')
                if (skeletonType instanceof NbtByte || skeletonType instanceof NbtInt) {
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

        return { nbt: nbt, entityType: entityType }
    }

    private static upEntityType(input: string) {
        return Entities.to111(input)
    }

    private static upItemNbt(input: string) {
        const nbt = getNbt(input, 'before 1.12')
        /* tag */ {
            let tag = nbt.get('tag')
            if (tag instanceof NbtCompound) {
                tag = getNbt(Updater.upItemTagNbt(tag.toString()))
                nbt.set('tag', tag)
            }
        }
        return nbt.toString()
    }

    private static upItemTagNbt(input: string) {
        const nbt = getNbt(input, 'before 1.12')
        /* EntityTag */ {
            let entityTag = nbt.get('EntityTag')
            if (entityTag instanceof NbtCompound) {
                entityTag = getNbt(Updater.upEntityNbt(entityTag.toString()))
                nbt.set('EntityTag', entityTag)
            }
        }
        /* BlockEntityTag */ {
            let blockEntityTag = nbt.get('BlockEntityTag')
            if (blockEntityTag instanceof NbtCompound) {
                blockEntityTag = getNbt(Updater.upBlockNbt(blockEntityTag.toString()))
                nbt.set('BlockEntityTag', blockEntityTag)
            }
        }
        return nbt.toString()
    }

    private static upJson(input: string) {
        if (input.slice(0, 1) === '"') {
            return input
        } else if (input.slice(0, 1) === '[') {
            let json = JSON.parse(input)
            let result: string[] = []
            for (const i of json) {
                result.push(Updater.upJson(JSON.stringify(i)))
            }
            return `[${result.join()}]`
        } else {
            let json = JSON.parse(input)
            if (json.selector) {
                let sel = new Selector()
                sel.parse(json.selector)
                json.selector = sel.to111()
            }

            if (
                json.clickEvent &&
                json.clickEvent.action &&
                (json.clickEvent.action === 'run_command' || json.clickEvent.action === 'suggest_command') &&
                json.clickEvent.value
            ) {
                json.clickEvent.value = Updater.upCommand(json.clickEvent.value)
            }

            if (json.extra) {
                json.extra = JSON.parse(Updater.upJson(JSON.stringify(json.extra)))
            }

            return JSON.stringify(json).replace(/§/g, '\\u00a7')
        }
    }
}