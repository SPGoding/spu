"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils/utils");
class Entities {
    static to113(input) {
        input = utils_1.completeNamespace(input);
        const arr = Entities.Nominal112_Nominal113.find(v => v[0] === input);
        if (arr) {
            return arr[1];
        }
        else {
            return input;
        }
    }
    static to112(fucking) {
        fucking = utils_1.completeNamespace(fucking);
        const arr = Entities.FuckingID110_NominalID112.find(v => v[0] === fucking);
        if (arr) {
            return arr[1];
        }
        else {
            return fucking.replace(/([^^])([A-Z])/g, '$1_$2').toLowerCase();
        }
    }
}
Entities.Nominal112_Nominal113 = [
    ['minecraft:xp_orb', 'minecraft:experience_orb'],
    ['minecraft:xp_bottle', 'minecraft:experience_bottle'],
    ['minecraft:eye_of_ender_signal', 'minecraft:eye_of_ender'],
    ['minecraft:ender_crystal', 'minecraft:end_crystal'],
    ['minecraft:fireworks_rocket', 'minecraft:firework_rocket'],
    ['minecraft:commandblock_minecart', 'minecraft:command_block_minecart'],
    ['minecraft:snowman', 'minecraft:snow_golem'],
    ['minecraft:villager_golem', 'minecraft:iron_golem'],
    ['minecraft:evocation_fangs', 'minecraft:evoker_fangs'],
    ['minecraft:vindication_illager', 'minecraft:vindicator'],
    ['minecraft:evocation_illager', 'minecraft:evoker'],
    ['minecraft:illusion_illager', 'minecraft:illusioner']
];
Entities.FuckingID110_NominalID112 = [
    ['AreaEffectCloud', 'area_effect_cloud'],
    ['ArmorStand', 'armor_stand'],
    ['Cauldron', 'brewing_stand'],
    ['CaveSpider', 'cave_spider'],
    ['MinecartChest', 'chest_minecart'],
    ['Control', 'command_block'],
    ['MinecartCommandBlock', 'commandblock_minecart'],
    ['DLDetector', 'daylight_detector'],
    ['Trap', 'dispenser'],
    ['DragonFireball', 'dragon_fireball'],
    ['ThrownEgg', 'egg'],
    ['EnchantTable', 'enchanting_table'],
    ['EndGateway', 'end_gateway'],
    ['AirPortal', 'end_portal'],
    ['EnderChest', 'ender_chest'],
    ['EnderCrystal', 'ender_crystal'],
    ['EnderDragon', 'ender_dragon'],
    ['ThrownEnderpearl', 'ender_pearl'],
    ['EyeOfEnderSignal', 'eye_of_ender_signal'],
    ['FallingSand', 'falling_block'],
    ['FireworksRocketEntity', 'fireworks_rocket'],
    ['FlowerPot', 'flower_pot'],
    ['MinecartFurnace', 'furnace_minecart'],
    ['MinecartHopper', 'hopper_minecart'],
    ['EntityHorse', 'horse'],
    ['ItemFrame', 'item_frame'],
    ['RecordPlayer', 'jukebox'],
    ['LeashKnot', 'leash_knot'],
    ['LightningBolt', 'lightning_bolt'],
    ['LavaSlime', 'magma_cube'],
    ['MinecartRideable', 'minecart'],
    ['MobSpawner', 'mob_spawner'],
    ['MushroomCow', 'mooshroom'],
    ['Music', 'noteblock'],
    ['Ozelot', 'ocelot'],
    ['PolarBear', 'polar_bear'],
    ['ShulkerBullet', 'shulker_bullet'],
    ['SmallFireball', 'small_fireball'],
    ['SpectralArrow', 'spectral_arrow'],
    ['ThrownPotion', 'potion'],
    ['MinecartSpawner', 'spawner_minecart'],
    ['Structure', 'structure_block'],
    ['PrimedTnt', 'tnt'],
    ['MinecartTNT', 'tnt_minecart'],
    ['VillagerGolem', 'villager_golem'],
    ['WitherBoss', 'wither'],
    ['WitherSkull', 'wither_skull'],
    ['ThrownExpBottle', 'xp_bottle'],
    ['XPOrb', 'xp_orb'],
    ['PigZombie', 'zombie_pigman']
];
exports.default = Entities;
