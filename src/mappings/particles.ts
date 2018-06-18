export default class Particles {
    public static get1_13NominalIDFrom1_12NominalID(input: string) {
        const arr = Particles.NominalID_NominalID.find(v => v[0] === input)
        if (arr) {
            if (arr[1] === 'removed') {
                throw `Removed particle: '${input}'`
            }
            return arr[1]
        } else {
            return input
        }
    }

    static NominalID_NominalID = [
        ['mobSpellAmbient', 'ambient_entity_effect'],
        ['angryVillager', 'angry_villager'],
        ['blockcrack', 'block'],
        ['blockdust', 'block'],
        ['damageIndicator', 'damage_indicator'],
        ['dragonbreath', 'dragon_breath'],
        ['dripLava', 'dripping_lava'],
        ['dripWater', 'dripping_water'],
        ['reddust', 'dust'],
        ['spell', 'effect'],
        ['mobappearance', 'elder_guardian'],
        ['enchantmenttable', 'enchant'],
        ['magicCrit', 'enchanted_hit'],
        ['endRod', 'end_rod'],
        ['mobSpell', 'entity_effect'],
        ['largeexplosion', 'explosion'],
        ['hugeexplosion', 'explosion_emitter'],
        ['fallingdust', 'falling_dust'],
        ['fireworksSpark', 'firework'],
        ['wake', 'fishing'],
        ['happyVillager', 'happy_villager'],
        ['instantSpell', 'instant_effect'],
        ['iconcrack', 'item'],
        ['slime', 'item_slime'],
        ['snowballpoof', 'item_snowball'],
        ['largesmoke', 'large_smoke'],
        ['townaura', 'mycelium'],
        ['explode', 'poof'],
        ['snowshovel', 'poof'],
        ['droplet', 'rain'],
        ['sweepAttack', 'sweep_attack'],
        ['totem', 'totem_of_undying'],
        ['suspended', 'underwater'],
        ['witchMagic', 'witch'],
        ['take', 'removed'],
        ['footstep', 'removed'],
        ['depthsuspend', 'removed']
    ]
}
