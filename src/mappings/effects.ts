export default class Effects {
    public static get1_12NominalIDFrom1_12NumericID(input: number) {
        const arr = Effects.NumericID_NominalID.find(v => v[0] === input)
        if (arr) {
            return arr[1]
        } else {
            throw `Unknwon ench ID: '${input}'`
        }
    }

    static NumericID_NominalID: NumericID_NominalID[] = [
        [1, 'minecraft:speed'],
        [2, 'minecraft:slowness'],
        [3, 'minecraft:haste'],
        [4, 'minecraft:mining_fatigue'],
        [5, 'minecraft:strength'],
        [6, 'minecraft:instant_health'],
        [7, 'minecraft:instant_damage'],
        [8, 'minecraft:jump_boost'],
        [9, 'minecraft:nausea'],
        [10, 'minecraft:regeneration'],
        [11, 'minecraft:resistance'],
        [12, 'minecraft:fire_resistance'],
        [13, 'minecraft:water_breathing'],
        [14, 'minecraft:invisibility'],
        [15, 'minecraft:blindness'],
        [16, 'minecraft:night_vision'],
        [17, 'minecraft:hunger'],
        [18, 'minecraft:weakness'],
        [19, 'minecraft:poison'],
        [20, 'minecraft:wither'],
        [21, 'minecraft:health_boost'],
        [22, 'minecraft:absorption'],
        [23, 'minecraft:saturation'],
        [24, 'minecraft:glowing'],
        [25, 'minecraft:levitation'],
        [26, 'minecraft:luck'],
        [27, 'minecraft:unluck']
    ]
}

interface NumericID_NominalID {
    0: number
    1: string
}
