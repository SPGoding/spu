export default class Entities {
    public static to111(input: string) {
        if (input.slice(0,10) !== 'minecraft:') {
            input = `minecraft:${input}`
        }
        const arr = Entities.NominalID19_NominalID111.find(v => v[0] === input)
        if (arr) {
            return arr[1]
        } else {
            return input.replace(/([^^])([A-Z])/g, '$1_$2').toLowerCase()
        }
    }

    static NominalID19_NominalID111 = [
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
    ]
}
