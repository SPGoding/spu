"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Enchantments {
    static to113(input) {
        const arr = Enchantments.Numeric_Nominal.find(v => v[0] === input);
        if (arr) {
            return arr[1];
        }
        else {
            throw `Unknwon ench ID: '${input}'`;
        }
    }
}
Enchantments.Numeric_Nominal = [
    [0, 'minecraft:protection'],
    [1, 'minecraft:fire_protection'],
    [2, 'minecraft:feather_falling'],
    [3, 'minecraft:blast_protection'],
    [4, 'minecraft:projectile_protection'],
    [5, 'minecraft:respiration'],
    [6, 'minecraft:aqua_affinity'],
    [7, 'minecraft:thorns'],
    [8, 'minecraft:depth_strider'],
    [9, 'minecraft:frost_walker'],
    [10, 'minecraft:binding_curse'],
    [16, 'minecraft:sharpness'],
    [17, 'minecraft:smite'],
    [18, 'minecraft:bane_of_arthropods'],
    [19, 'minecraft:knockback'],
    [20, 'minecraft:fire_aspect'],
    [21, 'minecraft:looting'],
    [22, 'minecraft:sweeping'],
    [32, 'minecraft:efficiency'],
    [33, 'minecraft:silk_touch'],
    [34, 'minecraft:unbreaking'],
    [35, 'minecraft:fortune'],
    [48, 'minecraft:power'],
    [49, 'minecraft:punch'],
    [50, 'minecraft:flame'],
    [51, 'minecraft:infinity'],
    [61, 'minecraft:luck_of_the_sea'],
    [62, 'minecraft:lure'],
    [70, 'minecraft:mending'],
    [71, 'minecraft:vanishing_curse']
];
exports.default = Enchantments;
