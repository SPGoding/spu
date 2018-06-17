export default class Entities {
    public static get1_13NominalIDFrom1_12NominalID(input: string) {
        const arr = Entities.NominalID_NominalID.find(v => v[0] === input)
        if (arr) {
            return arr[1]
        } else {
            return input
        }
    }

    static NominalID_NominalID = [
        ['minecraft:xp_orb', 'minecraft:experience_orb'],
        ['minecraft:xp_bottle', 'minecraft:experience_bottle'],
        ['minecraft:eye_of_ender_signal', 'minecraft:eye_of_ender'],
        ['minecraft:ender_crystal', 'minecraft:end_crystal'],
        ['minecraft:fireworks_rocket', 'minecraft:firework_rocket'],
        ['minecraft:commandblock_minecart', 'minecraft:command_block_minecart'],
        ['minecraft:villager_golem', 'minecraft:iron_golem'],
        ['minecraft:vindication_illager', 'minecraft:vindicator'],
        ['minecraft:evocation_illager', 'minecraft:evoker'],
        ['minecraft:illusion_illager', 'minecraft:illusioner']
    ]
}
