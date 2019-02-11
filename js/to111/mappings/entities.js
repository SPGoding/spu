"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils/utils");
class Entities {
    static to111(input) {
        const arr = Entities.NominalID19_NominalID111.find(v => v[0] === input);
        if (arr) {
            return arr[1];
        }
        else {
            return utils_1.completeNamespace(input.replace(/([^^])([A-Z])/g, '$1_$2').toLowerCase());
        }
    }
}
Entities.NominalID19_NominalID111 = [
    ['Cauldron', 'minecraft:brewing_stand'],
    ['MinecartChest', 'minecraft:chest_minecart'],
    ['Control', 'minecraft:command_block'],
    ['MinecartCommandBlock', 'minecraft:commandblock_minecart'],
    ['DLDetector', 'minecraft:daylight_detector'],
    ['Trap', 'minecraft:dispenser'],
    ['DragonFireball', 'minecraft:dragon_fireball'],
    ['ThrownEgg', 'minecraft:egg'],
    ['EnchantTable', 'minecraft:enchanting_table'],
    ['AirPortal', 'minecraft:end_portal'],
    ['ThrownEnderpearl', 'minecraft:ender_pearl'],
    ['EyeOfEnderSignal', 'minecraft:eye_of_ender_signal'],
    ['FallingSand', 'minecraft:falling_block'],
    ['FireworksRocketEntity', 'minecraft:fireworks_rocket'],
    ['MinecartFurnace', 'minecraft:furnace_minecart'],
    ['MinecartHopper', 'minecraft:hopper_minecart'],
    ['EntityHorse', 'minecraft:horse'],
    ['RecordPlayer', 'minecraft:jukebox'],
    ['LavaSlime', 'minecraft:magma_cube'],
    ['MinecartRideable', 'minecraft:minecart'],
    ['MushroomCow', 'minecraft:mooshroom'],
    ['Music', 'minecraft:noteblock'],
    ['Ozelot', 'minecraft:ocelot'],
    ['ThrownPotion', 'minecraft:potion'],
    ['MinecartSpawner', 'minecraft:spawner_minecart'],
    ['Structure', 'minecraft:structure_block'],
    ['PrimedTnt', 'minecraft:tnt'],
    ['MinecartTNT', 'minecraft:tnt_minecart'],
    ['WitherBoss', 'minecraft:wither'],
    ['ThrownExpBottle', 'minecraft:xp_bottle'],
    ['XPOrb', 'minecraft:xp_orb'],
    ['PigZombie', 'minecraft:zombie_pigman']
];
exports.default = Entities;
