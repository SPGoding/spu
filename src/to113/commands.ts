import { CmdNode } from '../utils/wheel_chief/wheel_chief'

/**
 * Written by SPGoding.
 * @version Minecraft: Java Editon 1.12.2
 */
export class Commands112To113 {
    static commands: CmdNode = {
        type: 'root',
        children: {
            advancement: {
                type: 'literal',
                children: {
                    grant: {
                        type: 'literal',
                        children: {
                            targets: {
                                type: 'argument',
                                parser: 'minecraft:entity',
                                children: {
                                    everything: {
                                        type: 'literal',
                                        executable: true
                                    },
                                    from: {
                                        type: 'literal',
                                        children: {
                                            advancement: {
                                                type: 'argument',
                                                parser: 'minecraft:resource_location',
                                                executable: true
                                            }
                                        }
                                    },
                                    only: {
                                        type: 'literal',
                                        children: {
                                            advancement: {
                                                type: 'argument',
                                                parser: 'minecraft:resource_location',
                                                children: {
                                                    criterion: {
                                                        type: 'argument',
                                                        parser: 'brigadier:string',
                                                        properties: {
                                                            type: 'greedy'
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        }
                                    },
                                    through: {
                                        type: 'literal',
                                        children: {
                                            advancement: {
                                                type: 'argument',
                                                parser: 'minecraft:resource_location',
                                                executable: true
                                            }
                                        }
                                    },
                                    until: {
                                        type: 'literal',
                                        children: {
                                            advancement: {
                                                type: 'argument',
                                                parser: 'minecraft:resource_location',
                                                executable: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    revoke: {
                        type: 'literal',
                        children: {
                            targets: {
                                type: 'argument',
                                parser: 'minecraft:entity',
                                children: {
                                    everything: {
                                        type: 'literal',
                                        executable: true
                                    },
                                    from: {
                                        type: 'literal',
                                        children: {
                                            advancement: {
                                                type: 'argument',
                                                parser: 'minecraft:resource_location',
                                                executable: true
                                            }
                                        }
                                    },
                                    only: {
                                        type: 'literal',
                                        children: {
                                            advancement: {
                                                type: 'argument',
                                                parser: 'minecraft:resource_location',
                                                children: {
                                                    criterion: {
                                                        type: 'argument',
                                                        parser: 'brigadier:string',
                                                        properties: {
                                                            type: 'greedy'
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        }
                                    },
                                    through: {
                                        type: 'literal',
                                        children: {
                                            advancement: {
                                                type: 'argument',
                                                parser: 'minecraft:resource_location',
                                                executable: true
                                            }
                                        }
                                    },
                                    until: {
                                        type: 'literal',
                                        children: {
                                            advancement: {
                                                type: 'argument',
                                                parser: 'minecraft:resource_location',
                                                executable: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            ban: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'word'
                        },
                        children: {
                            reason: {
                                type: 'argument',
                                parser: 'minecraft:message',
                                executable: true
                            }
                        },
                        executable: true
                    }
                }
            },
            'ban-ip': {
                type: 'literal',
                children: {
                    target: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'word'
                        },
                        children: {
                            reason: {
                                type: 'argument',
                                parser: 'minecraft:message',
                                executable: true
                            }
                        },
                        executable: true
                    }
                }
            },
            banlist: {
                type: 'literal',
                children: {
                    ips: {
                        type: 'literal',
                        executable: true
                    },
                    players: {
                        type: 'literal',
                        executable: true
                    }
                },
                executable: true
            },            
            blockdata: {
                type: 'literal',
                children: {
                    pos: {
                        type: 'argument',
                        parser: 'minecraft:block_pos',
                        children: {
                            '{}': {
                                type: 'literal',
                                executable: true,
                                spu_script: 'data get block %1'
                            },
                            nbt: {
                                type: 'argument',
                                parser: 'minecraft:nbt',
                                updater: 'spgoding:entity_nbt',
                                executable: true,
                                spu_script: 'data merge block %1 %2'
                            }
                        }
                    }
                }
            },
            clear: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            item: {
                                type: 'argument',
                                parser: 'minecraft:resource_location',
                                updater: 'spgoding:item_name',
                                children: {
                                    data: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        properties: {
                                            min: -1
                                        },
                                        children: {
                                            maxCount: {
                                                type: 'argument',
                                                parser: 'brigadier:integer',
                                                properties: {
                                                    min: 0
                                                },
                                                children: {
                                                    nbt: {
                                                        type: 'argument',
                                                        parser: 'minecraft:nbt',
                                                        updater: 'spgoding:item_tag_nbt',
                                                        executable: true,
                                                        spu_script: '%0 %1 $setNameDataNbtToItemStack%2%3%5 %4'
                                                    }
                                                },
                                                executable: true,
                                                spu_script: '%0 %1 $setNameDataToItemStack%2%3 %4'
                                            }
                                        },
                                        executable: true,
                                        spu_script: '%0 %1 $setNameDataToItemStack%2%3'
                                    }
                                },
                                executable: true,
                                spu_script: '%0 %1 $setNameToItemStack%2'
                            }
                        },
                        executable: true
                    }
                },
                executable: true
            },
            clone: {
                type: 'literal',
                children: {
                    begin: {
                        type: 'argument',
                        parser: 'minecraft:block_pos',
                        children: {
                            end: {
                                type: 'argument',
                                parser: 'minecraft:block_pos',
                                children: {
                                    destination: {
                                        type: 'argument',
                                        parser: 'minecraft:block_pos',
                                        children: {
                                            maskMode: {
                                                type: 'argument',
                                                parser: 'brigadier:string',
                                                properties: {
                                                    type: 'word'
                                                },
                                                children: {
                                                    cloneMode: {
                                                        type: 'argument',
                                                        parser: 'brigadier:string',
                                                        properties: {
                                                            type: 'word'
                                                        },
                                                        children: {
                                                            block: {
                                                                type: 'argument',
                                                                parser: 'minecraft:resource_location',
                                                                updater: 'spgoding:block_name',
                                                                children: {
                                                                    states: {
                                                                        type: 'argument',
                                                                        parser: 'brigadier:string',
                                                                        properties: {
                                                                            type: 'greedy'
                                                                        },
                                                                        executable: true,
                                                                        spu_script: '%0 %1 %2 %3 %4 $setNameStatesToBlockState%6%7 %5'
                                                                    }
                                                                },
                                                                executable: true,
                                                                spu_script: '%0 %1 %2 %3 %4 $setNameToBlockState%6 %5'
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        },
                                        executable: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            debug: {
                type: 'literal',
                children: {
                    start: {
                        type: 'literal',
                        executable: true
                    },
                    stop: {
                        type: 'literal',
                        executable: true
                    }
                }
            },
            defaultgamemode: {
                type: 'literal',
                children: {
                    mode: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'word'
                        },
                        updater: 'spgoding:gamemode',
                        executable: true
                    }
                }
            },
            deop: {
                type: 'literal',
                children: {
                    game_profile: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'word'
                        },
                        executable: true
                    }
                }
            },
            difficulty: {
                type: 'literal',
                children: {
                    difficulty: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'word'
                        },
                        updater: 'spgoding:difficulty',
                        executable: true
                    }
                }
            },
            effect: {
                type: 'literal',
                children: {
                    target: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            clear: {
                                type: 'literal',
                                executable: true,
                                spu_script: 'effect clear %1'
                            },
                            effect: {
                                type: 'argument',
                                parser: 'brigadier:string',
                                updater: 'spgoding:effect',
                                properties: {
                                    type: 'word'
                                },
                                children: {
                                    num: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        children: {
                                            num: {
                                                type: 'argument',
                                                parser: 'brigadier:integer',
                                                children: {
                                                    bool: {
                                                        type: 'argument',
                                                        parser: 'brigadier:bool',
                                                        executable: true,
                                                        spu_script: 'effect give %1 %2 %3 %4 %5'
                                                    }
                                                },
                                                executable: true,
                                                spu_script: 'effect give %1 %2 %3 %4'
                                            }
                                        },
                                        executable: true,
                                        spu_script: 'effect give %1 %2 %3'
                                    }
                                },
                                executable: true,
                                spu_script: 'effect give %1 %2'
                            }
                        }
                    }
                }
            },
            enchant: {
                type: 'literal',
                children: {
                    entity: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            ench: {
                                type: 'argument',
                                parser: 'brigadier:string',
                                properties: {
                                    type: 'word'
                                },
                                updater: 'spgoding:enchantment',
                                children: {
                                    level: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        executable: true
                                    }
                                },
                                executable: true
                            }
                        }
                    }
                }
            },
            entitydata: {
                type: 'literal',
                children: {
                    entity: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            '{}': {
                                type: 'literal',
                                executable: true,
                                spu_script: 'execute as %1 run data get entity @s'
                            },
                            nbt: {
                                type: 'argument',
                                parser: 'minecraft:nbt',
                                updater: 'spgoding:entity_nbt',
                                executable: true,
                                spu_script: 'execute as %1 run data merge entity @s %2'
                            }
                        }
                    }
                }
            },
            execute: {
                type: 'literal',
                children: {
                    entity: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            '~': {
                                type: 'literal',
                                children: {
                                    '~': {
                                        type: 'literal',
                                        children: {
                                            '~': {
                                                type: 'literal',
                                                children: {
                                                    detect: {
                                                        type: 'literal',
                                                        children: {
                                                            pos: {
                                                                type: 'argument',
                                                                parser: 'minecraft:block_pos',
                                                                children: {
                                                                    block: {
                                                                        type: 'argument',
                                                                        parser: 'minecraft:resource_location',
                                                                        updater: 'spgoding:block_name',
                                                                        children: {
                                                                            states: {
                                                                                type: 'argument',
                                                                                parser: 'brigadier:string',
                                                                                properties: {
                                                                                    type: 'word'
                                                                                },
                                                                                children: {
                                                                                    command: {
                                                                                        type: 'argument',
                                                                                        parser: 'brigadier:string',
                                                                                        properties: {
                                                                                            type: 'greedy'
                                                                                        },
                                                                                        updater: 'spgoding:command',
                                                                                        executable: true,
                                                                                        spu_script: 'execute as %1 at @s if block %6 $setNameStatesToBlockState%7%8 run %9'
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    command: {
                                                        type: 'argument',
                                                        parser: 'brigadier:string',
                                                        properties: {
                                                            type: 'greedy'
                                                        },
                                                        updater: 'spgoding:command',
                                                        executable: true,
                                                        spu_script: 'execute as %1 at @s run %5'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            pos: {
                                type: 'argument',
                                parser: 'minecraft:vec3',
                                children: {
                                    detect: {
                                        type: 'literal',
                                        children: {
                                            pos: {
                                                type: 'argument',
                                                parser: 'minecraft:block_pos',
                                                children: {
                                                    block: {
                                                        type: 'argument',
                                                        parser: 'minecraft:resource_location',
                                                        updater: 'spgoding:block_name',
                                                        children: {
                                                            states: {
                                                                type: 'argument',
                                                                parser: 'brigadier:string',
                                                                properties: {
                                                                    type: 'word'
                                                                },
                                                                children: {
                                                                    command: {
                                                                        type: 'argument',
                                                                        parser: 'brigadier:string',
                                                                        properties: {
                                                                            type: 'greedy'
                                                                        },
                                                                        updater: 'spgoding:command',
                                                                        executable: true,
                                                                        spu_script: 'execute as %1 at @s positioned %2 if block %4 $setNameStatesToBlockState%5%6 run %7'
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    command: {
                                        type: 'argument',
                                        parser: 'brigadier:string',
                                        properties: {
                                            type: 'greedy'
                                        },
                                        updater: 'spgoding:command',
                                        executable: true,
                                        spu_script: 'execute as %1 at @s positioned %2 run %3'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            fill: {
                type: 'literal',
                children: {
                    begin: {
                        type: 'argument',
                        parser: 'minecraft:block_pos',
                        children: {
                            end: {
                                type: 'argument',
                                parser: 'minecraft:block_pos',
                                children: {
                                    block: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        updater: 'spgoding:block_name',
                                        children: {
                                            states: {
                                                type: 'argument',
                                                parser: 'brigadier:string',
                                                properties: {
                                                    type: 'word'
                                                },
                                                children: {
                                                    replace: {
                                                        type: 'literal',
                                                        children: {
                                                            block: {
                                                                type: 'argument',
                                                                parser: 'minecraft:resource_location',
                                                                updater: 'spgoding:block_name',
                                                                children: {
                                                                    states: {
                                                                        type: 'argument',
                                                                        parser: 'brigadier:string',
                                                                        properties: {
                                                                            type: 'word'
                                                                        },
                                                                        executable: true,
                                                                        spu_script: '%0 %1 %2 $setNameStatesToBlockState%3%4 %5 $setNameStatesToBlockState%6%7'
                                                                    }
                                                                },
                                                                executable: true,
                                                                spu_script: '%0 %1 %2 $setNameStatesToBlockState%3%4 %5 $setNameToBlockState%6'
                                                            }
                                                        }
                                                    },
                                                    other: {
                                                        type: 'argument',
                                                        parser: 'brigadier:string',
                                                        properties: {
                                                            type: 'word'
                                                        },
                                                        children: {
                                                            nbt: {
                                                                type: 'argument',
                                                                parser: 'minecraft:nbt',
                                                                updater: 'spgoding:block_nbt',
                                                                executable: true,
                                                                spu_script: '%0 %1 %2 $setNameStatesNbtToBlockState%3%4%6 %5'
                                                            }
                                                        },
                                                        executable: true,
                                                        spu_script: '%0 %1 %2 $setNameStatesToBlockState%3%4 %5'
                                                    }
                                                },
                                                executable: true,
                                                spu_script: '%0 %1 %2 $setNameStatesToBlockState%3%4'
                                            }
                                        },
                                        executable: true,
                                        spu_script: '%0 %1 %2 $setNameToBlockState%3'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            function: {
                type: 'literal',
                children: {
                    func: {
                        type: 'argument',
                        parser: 'minecraft:resource_location',
                        children: {
                            condition: {
                                type: 'argument',
                                parser: 'brigadier:string',
                                properties: {
                                    type: 'word'
                                },
                                children: {
                                    entity: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        executable: true,
                                        spu_script: 'execute %2 entity %3 run %0 %1'
                                    }
                                }
                            }
                        },
                        executable: true
                    }
                }
            },
            gamemode: {
                type: 'literal',
                children: {
                    mode: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'word'
                        },
                        updater: 'spgoding:gamemode',
                        children: {
                            entity: {
                                type: 'argument',
                                parser: 'minecraft:entity',
                                executable: true
                            }
                        },
                        executable: true
                    }
                }
            },
            gamerule: {
                type: 'literal',
                children: {
                    gameLoopFunction: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:string',
                                properties: {
                                    type: 'word'
                                },
                                executable: true,
                                spu_script: '# %0 %1 %2',
                                warning: "The rule 'gameLoopFunction' has been removed. Please add function %2 to function tag '#minecraft:tick'."
                            }
                        },
                        executable: true,
                        spu_script: '# %0 %1',
                        warning: "The rule 'gameLoopFunction' has been removed."
                    },
                    announceAdvancements: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    commandBlockOutput: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    disableElytraMovementCheck: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    doDaylightCycle: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    doEntityDrops: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    doFireTick: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    doLimitedCrafting: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    doMobLoot: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    doMobSpawning: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    doTileDrops: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    doWeatherCycle: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    keepInventory: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    logAdminCommands: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    maxCommandChainLength: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:integer',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    maxEntityCramming: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:integer',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    mobGriefing: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    naturalRegeneration: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    randomTickSpeed: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:integer',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    reducedDebugInfo: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    sendCommandFeedback: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    showDeathMessages: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    spawnRadius: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:integer',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    spectatorsGenerateChunks: {
                        type: 'literal',
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                executable: true
                            }
                        },
                        executable: true
                    },
                    rule: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'word'
                        },
                        children: {
                            value: {
                                type: 'argument',
                                parser: 'brigadier:string',
                                properties: {
                                    type: 'word'
                                },
                                executable: true,
                                spu_script: '# %0 %1 %2',
                                warning: 'Minecraft has stopped supporting custom gamerules since 1.13. Please use scoreboards.'
                            }
                        },
                        executable: true,
                        spu_script: '# %0 %1',
                        warning: 'Minecraft has stopped supporting custom gamerules since 1.13. Please use scoreboards.'
                    }
                }
            },
            give: {
                type: 'literal',
                children: {
                    entity: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            item: {
                                type: 'argument',
                                parser: 'minecraft:resource_location',
                                updater: 'spgoding:item_name',
                                children: {
                                    num: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        children: {
                                            data: {
                                                type: 'argument',
                                                parser: 'brigadier:integer',
                                                properties: {
                                                    min: 0
                                                },
                                                children: {
                                                    nbt: {
                                                        type: 'argument',
                                                        parser: 'minecraft:nbt',
                                                        updater: 'spgoding:item_tag_nbt',
                                                        executable: true,
                                                        spu_script: '%0 %1 $setNameDataNbtToItemStack%2%4%5 %3'
                                                    }
                                                },
                                                executable: true,
                                                spu_script: '%0 %1 $setNameDataToItemStack%2%4 %3'
                                            }
                                        },
                                        executable: true,
                                        spu_script: '%0 %1 $setNameToItemStack%2 %3'
                                    }
                                },
                                executable: true,
                                spu_script: '%0 %1 $setNameToItemStack%2'
                            }
                        }
                    }
                }
            },
            help: {
                type: 'literal',
                children: {
                    command: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'greedy'
                        },
                        executable: true
                    }
                },
                executable: true
            },
            kick: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            reason: {
                                type: 'argument',
                                parser: 'minecraft:message',
                                executable: true
                            }
                        },
                        executable: true
                    }
                }
            },
            kill: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        executable: true
                    }
                },
                executable: true,
                spu_script: '%0 @s'
            },
            list: {
                type: 'literal',
                children: {
                    uuids: {
                        type: 'literal',
                        executable: true
                    }
                },
                executable: true
            },
            locate: {
                type: 'literal',
                children: {
                    Buried_Treasure: {
                        type: 'literal',
                        executable: true
                    },
                    EndCity: {
                        type: 'literal',
                        executable: true
                    },
                    Fortress: {
                        type: 'literal',
                        executable: true
                    },
                    Mansion: {
                        type: 'literal',
                        executable: true
                    },
                    Mineshaft: {
                        type: 'literal',
                        executable: true
                    },
                    Monument: {
                        type: 'literal',
                        executable: true
                    },
                    Ocean_Ruin: {
                        type: 'literal',
                        executable: true
                    },
                    Shipwreck: {
                        type: 'literal',
                        executable: true
                    },
                    Stronghold: {
                        type: 'literal',
                        executable: true
                    },
                    Temple: {
                        type: 'literal',
                        executable: true,
                        spu_script: '# %0 %1',
                        warning: "'Temple' has been separated into 'Desert_Pyramid', 'Igloo', 'Jungle_Pyramid' and 'Swamp_hut'"
                    },
                    Village: {
                        type: 'literal',
                        executable: true
                    }
                }
            },
            me: {
                type: 'literal',
                children: {
                    action: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'greedy'
                        },
                        executable: true
                    }
                }
            },
            msg: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            message: {
                                type: 'argument',
                                parser: 'minecraft:message',
                                executable: true
                            }
                        }
                    }
                }
            },
            op: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'word'
                        },
                        executable: true
                    }
                }
            },
            pardon: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'word'
                        },
                        executable: true
                    }
                }
            },
            'pardon-ip': {
                type: 'literal',
                children: {
                    target: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'word'
                        },
                        executable: true
                    }
                }
            },
            particle: {
                type: 'literal',
                children: {
                    name: {
                        type: 'argument',
                        parser: 'minecraft:resource_location',
                        updater: 'spgoding:particle',
                        children: {
                            pos: {
                                type: 'argument',
                                parser: 'minecraft:vec3',
                                children: {
                                    delta: {
                                        type: 'argument',
                                        parser: 'minecraft:vec3',
                                        children: {
                                            speed: {
                                                type: 'argument',
                                                parser: 'brigadier:float',
                                                properties: {
                                                    min: 0.0
                                                },
                                                children: {
                                                    count: {
                                                        type: 'argument',
                                                        parser: 'brigadier:integer',
                                                        properties: {
                                                            min: 0
                                                        },
                                                        children: {
                                                            mode: {
                                                                type: 'argument',
                                                                parser: 'brigadier:string',
                                                                properties: {
                                                                    type: 'word'
                                                                },
                                                                children: {
                                                                    entity: {
                                                                        type: 'argument',
                                                                        parser: 'minecraft:entity',
                                                                        children: {
                                                                            param: {
                                                                                type: 'argument',
                                                                                parser: 'brigadier:integer',
                                                                                children: {
                                                                                    param: {
                                                                                        type: 'argument',
                                                                                        parser: 'brigadier:integer',
                                                                                        executable: true,
                                                                                        spu_script: '%0 %1 $setItemParams%8%9 %2 %3 %4 %5 %6 %7'
                                                                                    }
                                                                                },
                                                                                executable: true,
                                                                                spu_script: '%0 %1 $setBlockParam%8 %2 %3 %4 %5 %6 %7'
                                                                            }
                                                                        },
                                                                        executable: true
                                                                    }
                                                                },
                                                                executable: true
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            playsound: {
                type: 'literal',
                children: {
                    sound: {
                        type: 'argument',
                        parser: 'minecraft:resource_location',
                        updater: 'spgoding:sound',
                        children: {
                            ambient: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            pos: {
                                                type: 'argument',
                                                parser: 'minecraft:vec3',
                                                children: {
                                                    volume: {
                                                        type: 'argument',
                                                        parser: 'brigadier:float',
                                                        properties: {
                                                            min: 0.0
                                                        },
                                                        children: {
                                                            pitch: {
                                                                type: 'argument',
                                                                parser: 'brigadier:float',
                                                                properties: {
                                                                    min: 0.0,
                                                                    max: 2.0
                                                                },
                                                                children: {
                                                                    minVolume: {
                                                                        type: 'argument',
                                                                        parser: 'brigadier:float',
                                                                        properties: {
                                                                            min: 0.0,
                                                                            max: 1.0
                                                                        },
                                                                        executable: true
                                                                    }
                                                                },
                                                                executable: true
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        },
                                        executable: true
                                    }
                                }
                            },
                            block: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            pos: {
                                                type: 'argument',
                                                parser: 'minecraft:vec3',
                                                children: {
                                                    volume: {
                                                        type: 'argument',
                                                        parser: 'brigadier:float',
                                                        properties: {
                                                            min: 0.0
                                                        },
                                                        children: {
                                                            pitch: {
                                                                type: 'argument',
                                                                parser: 'brigadier:float',
                                                                properties: {
                                                                    min: 0.0,
                                                                    max: 2.0
                                                                },
                                                                children: {
                                                                    minVolume: {
                                                                        type: 'argument',
                                                                        parser: 'brigadier:float',
                                                                        properties: {
                                                                            min: 0.0,
                                                                            max: 1.0
                                                                        },
                                                                        executable: true
                                                                    }
                                                                },
                                                                executable: true
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        },
                                        executable: true
                                    }
                                }
                            },
                            hostile: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            pos: {
                                                type: 'argument',
                                                parser: 'minecraft:vec3',
                                                children: {
                                                    volume: {
                                                        type: 'argument',
                                                        parser: 'brigadier:float',
                                                        properties: {
                                                            min: 0.0
                                                        },
                                                        children: {
                                                            pitch: {
                                                                type: 'argument',
                                                                parser: 'brigadier:float',
                                                                properties: {
                                                                    min: 0.0,
                                                                    max: 2.0
                                                                },
                                                                children: {
                                                                    minVolume: {
                                                                        type: 'argument',
                                                                        parser: 'brigadier:float',
                                                                        properties: {
                                                                            min: 0.0,
                                                                            max: 1.0
                                                                        },
                                                                        executable: true
                                                                    }
                                                                },
                                                                executable: true
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        },
                                        executable: true
                                    }
                                }
                            },
                            master: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            pos: {
                                                type: 'argument',
                                                parser: 'minecraft:vec3',
                                                children: {
                                                    volume: {
                                                        type: 'argument',
                                                        parser: 'brigadier:float',
                                                        properties: {
                                                            min: 0.0
                                                        },
                                                        children: {
                                                            pitch: {
                                                                type: 'argument',
                                                                parser: 'brigadier:float',
                                                                properties: {
                                                                    min: 0.0,
                                                                    max: 2.0
                                                                },
                                                                children: {
                                                                    minVolume: {
                                                                        type: 'argument',
                                                                        parser: 'brigadier:float',
                                                                        properties: {
                                                                            min: 0.0,
                                                                            max: 1.0
                                                                        },
                                                                        executable: true
                                                                    }
                                                                },
                                                                executable: true
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        },
                                        executable: true
                                    }
                                }
                            },
                            music: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            pos: {
                                                type: 'argument',
                                                parser: 'minecraft:vec3',
                                                children: {
                                                    volume: {
                                                        type: 'argument',
                                                        parser: 'brigadier:float',
                                                        properties: {
                                                            min: 0.0
                                                        },
                                                        children: {
                                                            pitch: {
                                                                type: 'argument',
                                                                parser: 'brigadier:float',
                                                                properties: {
                                                                    min: 0.0,
                                                                    max: 2.0
                                                                },
                                                                children: {
                                                                    minVolume: {
                                                                        type: 'argument',
                                                                        parser: 'brigadier:float',
                                                                        properties: {
                                                                            min: 0.0,
                                                                            max: 1.0
                                                                        },
                                                                        executable: true
                                                                    }
                                                                },
                                                                executable: true
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        },
                                        executable: true
                                    }
                                }
                            },
                            neutral: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            pos: {
                                                type: 'argument',
                                                parser: 'minecraft:vec3',
                                                children: {
                                                    volume: {
                                                        type: 'argument',
                                                        parser: 'brigadier:float',
                                                        properties: {
                                                            min: 0.0
                                                        },
                                                        children: {
                                                            pitch: {
                                                                type: 'argument',
                                                                parser: 'brigadier:float',
                                                                properties: {
                                                                    min: 0.0,
                                                                    max: 2.0
                                                                },
                                                                children: {
                                                                    minVolume: {
                                                                        type: 'argument',
                                                                        parser: 'brigadier:float',
                                                                        properties: {
                                                                            min: 0.0,
                                                                            max: 1.0
                                                                        },
                                                                        executable: true
                                                                    }
                                                                },
                                                                executable: true
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        },
                                        executable: true
                                    }
                                }
                            },
                            player: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            pos: {
                                                type: 'argument',
                                                parser: 'minecraft:vec3',
                                                children: {
                                                    volume: {
                                                        type: 'argument',
                                                        parser: 'brigadier:float',
                                                        properties: {
                                                            min: 0.0
                                                        },
                                                        children: {
                                                            pitch: {
                                                                type: 'argument',
                                                                parser: 'brigadier:float',
                                                                properties: {
                                                                    min: 0.0,
                                                                    max: 2.0
                                                                },
                                                                children: {
                                                                    minVolume: {
                                                                        type: 'argument',
                                                                        parser: 'brigadier:float',
                                                                        properties: {
                                                                            min: 0.0,
                                                                            max: 1.0
                                                                        },
                                                                        executable: true
                                                                    }
                                                                },
                                                                executable: true
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        },
                                        executable: true
                                    }
                                }
                            },
                            record: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            pos: {
                                                type: 'argument',
                                                parser: 'minecraft:vec3',
                                                children: {
                                                    volume: {
                                                        type: 'argument',
                                                        parser: 'brigadier:float',
                                                        properties: {
                                                            min: 0.0
                                                        },
                                                        children: {
                                                            pitch: {
                                                                type: 'argument',
                                                                parser: 'brigadier:float',
                                                                properties: {
                                                                    min: 0.0,
                                                                    max: 2.0
                                                                },
                                                                children: {
                                                                    minVolume: {
                                                                        type: 'argument',
                                                                        parser: 'brigadier:float',
                                                                        properties: {
                                                                            min: 0.0,
                                                                            max: 1.0
                                                                        },
                                                                        executable: true
                                                                    }
                                                                },
                                                                executable: true
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        },
                                        executable: true
                                    }
                                }
                            },
                            voice: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            pos: {
                                                type: 'argument',
                                                parser: 'minecraft:vec3',
                                                children: {
                                                    volume: {
                                                        type: 'argument',
                                                        parser: 'brigadier:float',
                                                        properties: {
                                                            min: 0.0
                                                        },
                                                        children: {
                                                            pitch: {
                                                                type: 'argument',
                                                                parser: 'brigadier:float',
                                                                properties: {
                                                                    min: 0.0,
                                                                    max: 2.0
                                                                },
                                                                children: {
                                                                    minVolume: {
                                                                        type: 'argument',
                                                                        parser: 'brigadier:float',
                                                                        properties: {
                                                                            min: 0.0,
                                                                            max: 1.0
                                                                        },
                                                                        executable: true
                                                                    }
                                                                },
                                                                executable: true
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        },
                                        executable: true
                                    }
                                }
                            },
                            weather: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            pos: {
                                                type: 'argument',
                                                parser: 'minecraft:vec3',
                                                children: {
                                                    volume: {
                                                        type: 'argument',
                                                        parser: 'brigadier:float',
                                                        properties: {
                                                            min: 0.0
                                                        },
                                                        children: {
                                                            pitch: {
                                                                type: 'argument',
                                                                parser: 'brigadier:float',
                                                                properties: {
                                                                    min: 0.0,
                                                                    max: 2.0
                                                                },
                                                                children: {
                                                                    minVolume: {
                                                                        type: 'argument',
                                                                        parser: 'brigadier:float',
                                                                        properties: {
                                                                            min: 0.0,
                                                                            max: 1.0
                                                                        },
                                                                        executable: true
                                                                    }
                                                                },
                                                                executable: true
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        },
                                        executable: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            publish: {
                type: 'literal',
                children: {
                    port: {
                        type: 'argument',
                        parser: 'brigadier:integer',
                        properties: {
                            min: 0,
                            max: 65535
                        },
                        executable: true
                    }
                },
                executable: true
            },
            recipe: {
                type: 'literal',
                children: {
                    give: {
                        type: 'literal',
                        children: {
                            targets: {
                                type: 'argument',
                                parser: 'minecraft:entity',
                                children: {
                                    '*': {
                                        type: 'literal',
                                        executable: true
                                    },
                                    recipe: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        executable: true
                                    }
                                }
                            }
                        }
                    },
                    take: {
                        type: 'literal',
                        children: {
                            targets: {
                                type: 'argument',
                                parser: 'minecraft:entity',
                                children: {
                                    '*': {
                                        type: 'literal',
                                        executable: true
                                    },
                                    recipe: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        executable: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            reload: {
                type: 'literal',
                executable: true
            },
            replaceitem: {
                type: 'literal',
                children: {
                    block: {
                        type: 'literal',
                        children: {
                            pos: {
                                type: 'argument',
                                parser: 'minecraft:block_pos',
                                children: {
                                    slot: {
                                        type: 'argument',
                                        parser: 'brigadier:string',
                                        properties: {
                                            type: 'word'
                                        },
                                        updater: 'spgoding:item_slot',
                                        children: {
                                            item: {
                                                type: 'argument',
                                                parser: 'minecraft:resource_location',
                                                updater: 'spgoding:item_name',
                                                children: {
                                                    count: {
                                                        type: 'argument',
                                                        parser: 'brigadier:integer',
                                                        properties: {
                                                            min: 1,
                                                            max: 64
                                                        },
                                                        children: {
                                                            data: {
                                                                type: 'argument',
                                                                parser: 'brigadier:integer',
                                                                properties: {
                                                                    min: 0
                                                                },
                                                                children: {
                                                                    nbt: {
                                                                        type: 'argument',
                                                                        parser: 'minecraft:nbt',
                                                                        updater: 'spgoding:item_tag_nbt',
                                                                        executable: true,
                                                                        spu_script: '%0 %1 %2 %3 $setNameDataNbtToItemStack%4%6%7 %5'
                                                                    }
                                                                },
                                                                executable: true,
                                                                spu_script: '%0 %1 %2 %3 $setNameDataToItemStack%4%6 %5'
                                                            }
                                                        },
                                                        executable: true,
                                                        spu_script: '%0 %1 %2 %3 $setNameToItemStack%4 %5'
                                                    }
                                                },
                                                executable: true,
                                                spu_script: '%0 %1 %2 %3 $setNameToItemStack%4'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    entity: {
                        type: 'literal',
                        children: {
                            targets: {
                                type: 'argument',
                                parser: 'minecraft:entity',
                                children: {
                                    slot: {
                                        type: 'argument',
                                        parser: 'brigadier:string',
                                        properties: {
                                            type: 'word'
                                        },
                                        updater: 'spgoding:item_slot',
                                        children: {
                                            item: {
                                                type: 'argument',
                                                parser: 'minecraft:resource_location',
                                                updater: 'spgoding:item_name',
                                                children: {
                                                    count: {
                                                        type: 'argument',
                                                        parser: 'brigadier:integer',
                                                        properties: {
                                                            min: 1,
                                                            max: 64
                                                        },
                                                        children: {
                                                            data: {
                                                                type: 'argument',
                                                                parser: 'brigadier:integer',
                                                                properties: {
                                                                    min: 0
                                                                },
                                                                children: {
                                                                    nbt: {
                                                                        type: 'argument',
                                                                        parser: 'minecraft:nbt',
                                                                        updater: 'spgoding:item_tag_nbt',
                                                                        executable: true,
                                                                        spu_script: '%0 %1 %2 %3 $setNameDataNbtToItemStack%4%6%7 %5'
                                                                    }
                                                                },
                                                                executable: true,
                                                                spu_script: '%0 %1 %2 %3 $setNameDataToItemStack%4%6 %5'
                                                            }
                                                        },
                                                        executable: true,
                                                        spu_script: '%0 %1 %2 %3 $setNameToItemStack%4 %5'
                                                    }
                                                },
                                                executable: true,
                                                spu_script: '%0 %1 %2 %3 $setNameToItemStack%4'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            'save-all': {
                type: 'literal',
                children: {
                    flush: {
                        type: 'literal',
                        executable: true
                    }
                },
                executable: true
            },
            'save-off': {
                type: 'literal',
                executable: true
            },
            'save-on': {
                type: 'literal',
                executable: true
            },
            say: {
                type: 'literal',
                children: {
                    message: {
                        type: 'argument',
                        parser: 'minecraft:message',
                        executable: true
                    }
                }
            },
            scoreboard: {
                type: 'literal',
                children: {
                    objectives: {
                        type: 'literal',
                        children: {
                            list: {
                                type: 'literal',
                                executable: true
                            },
                            add: {
                                type: 'literal',
                                children: {
                                    name: {
                                        type: 'argument',
                                        parser: 'brigadier:string',
                                        properties: {
                                            type: 'word'
                                        },
                                        children: {
                                            criteria: {
                                                type: 'argument',
                                                parser: 'brigadier:string',
                                                properties: {
                                                    type: 'word'
                                                },
                                                updater: 'spgoding:scoreboard_criteria',
                                                children: {
                                                    displayName: {
                                                        type: 'argument',
                                                        parser: 'brigadier:string',
                                                        properties: {
                                                            type: 'greedy'
                                                        },
                                                        updater: 'spgoding:pre_json',
                                                        executable: true
                                                    }
                                                },
                                                executable: true
                                            }
                                        }
                                    }
                                }
                            },
                            remove: {
                                type: 'literal',
                                children: {
                                    name: {
                                        type: 'argument',
                                        parser: 'brigadier:string',
                                        properties: {
                                            type: 'word'
                                        },
                                        executable: true
                                    }
                                }
                            },
                            setdisplay: {
                                type: 'literal',
                                children: {
                                    slot: {
                                        type: 'argument',
                                        parser: 'brigadier:string',
                                        properties: {
                                            type: 'word'
                                        },
                                        children: {
                                            objective: {
                                                type: 'argument',
                                                parser: 'brigadier:string',
                                                properties: {
                                                    type: 'word'
                                                },
                                            }
                                        },
                                        executable: true
                                    }
                                }
                            }
                        }
                    },
                    players: {
                        type: 'literal',
                        children: {
                            tag: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            add: {
                                                type: 'literal',
                                                children: {
                                                    name: {
                                                        type: 'argument',
                                                        parser: 'brigadier:string',
                                                        properties: {
                                                            type: 'word'
                                                        },
                                                        children: {
                                                            nbt: {
                                                                type: 'argument',
                                                                parser: 'minecraft:nbt',
                                                                updater: 'spgoding:entity_nbt',
                                                                executable: true,
                                                                spu_script: 'tag $setNbtToSelector%3%6 %4 %5'
                                                            }
                                                        },
                                                        executable: true,
                                                        spu_script: 'tag %3 %4 %5'
                                                    }
                                                }
                                            },
                                            list: {
                                                type: 'literal',
                                                executable: true,
                                                spu_script: 'tag %3 %4'
                                            },
                                            remove: {
                                                type: 'literal',
                                                children: {
                                                    name: {
                                                        type: 'argument',
                                                        parser: 'brigadier:string',
                                                        properties: {
                                                            type: 'word'
                                                        },
                                                        children: {
                                                            nbt: {
                                                                type: 'argument',
                                                                parser: 'minecraft:nbt',
                                                                updater: 'spgoding:entity_nbt',
                                                                executable: true,
                                                                spu_script: 'tag $setNbtToSelector%3%6 %4 %5'
                                                            }
                                                        },
                                                        executable: true,
                                                        spu_script: 'tag %3 %4 %5'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            add: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            objective: {
                                                type: 'argument',
                                                parser: 'minecraft:objective',
                                                children: {
                                                    score: {
                                                        type: 'argument',
                                                        parser: 'brigadier:integer',
                                                        properties: {
                                                            min: 0
                                                        },
                                                        children: {
                                                            nbt: {
                                                                type: 'argument',
                                                                parser: 'minecraft:nbt',
                                                                updater: 'spgoding:entity_nbt',
                                                                executable: true,
                                                                spu_script: '%0 %1 %2 $setNbtToSelector%3%6 %4 %5'
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            enable: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            objective: {
                                                type: 'argument',
                                                parser: 'minecraft:objective',
                                                children: {
                                                    nbt: {
                                                        type: 'argument',
                                                        parser: 'minecraft:nbt',
                                                        updater: 'spgoding:entity_nbt',
                                                        executable: true,
                                                        spu_script: '%0 %1 %2 $setNbtToSelector%3%6 %4 %5'
                                                    }
                                                },
                                                executable: true
                                            }
                                        }
                                    }
                                }
                            },
                            get: {
                                type: 'literal',
                                children: {
                                    target: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            objective: {
                                                type: 'argument',
                                                parser: 'minecraft:objective',
                                                children: {
                                                    nbt: {
                                                        type: 'argument',
                                                        parser: 'minecraft:nbt',
                                                        updater: 'spgoding:entity_nbt',
                                                        executable: true,
                                                        spu_script: '%0 %1 %2 $setNbtToSelector%3%6 %4 %5'
                                                    }
                                                },
                                                executable: true
                                            }
                                        }
                                    }
                                }
                            },
                            list: {
                                type: 'literal',
                                children: {
                                    target: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        executable: true
                                    }
                                },
                                executable: true
                            },
                            operation: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            targetObjective: {
                                                type: 'argument',
                                                parser: 'minecraft:objective',
                                                children: {
                                                    operation: {
                                                        type: 'argument',
                                                        parser: 'minecraft:operation',
                                                        children: {
                                                            source: {
                                                                type: 'argument',
                                                                parser: 'minecraft:entity',
                                                                children: {
                                                                    sourceObjective: {
                                                                        type: 'argument',
                                                                        parser: 'minecraft:objective',
                                                                        children: {
                                                                            nbt: {
                                                                                type: 'argument',
                                                                                parser: 'minecraft:nbt',
                                                                                updater: 'spgoding:entity_nbt',
                                                                                executable: true,
                                                                                spu_script: '%0 %1 %2 $setNbtToSelector%3%8 %4 %5 %6 %7'
                                                                            }
                                                                        },
                                                                        executable: true
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            remove: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            objective: {
                                                type: 'argument',
                                                parser: 'minecraft:objective',
                                                children: {
                                                    score: {
                                                        type: 'argument',
                                                        parser: 'brigadier:integer',
                                                        properties: {
                                                            min: 0
                                                        },
                                                        children: {
                                                            nbt: {
                                                                type: 'argument',
                                                                parser: 'minecraft:nbt',
                                                                updater: 'spgoding:entity_nbt',
                                                                executable: true,
                                                                spu_script: '%0 %1 %2 $setNbtToSelector%3%6 %4 %5'
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            reset: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            objective: {
                                                type: 'argument',
                                                parser: 'minecraft:objective',
                                                executable: true
                                            }
                                        },
                                        executable: true
                                    }
                                }
                            },
                            set: {
                                type: 'literal',
                                children: {
                                    targets: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        children: {
                                            objective: {
                                                type: 'argument',
                                                parser: 'minecraft:objective',
                                                children: {
                                                    score: {
                                                        type: 'argument',
                                                        parser: 'brigadier:integer',
                                                        children: {
                                                            nbt: {
                                                                type: 'argument',
                                                                parser: 'minecraft:nbt',
                                                                updater: 'spgoding:entity_nbt',
                                                                executable: true,
                                                                spu_script: '%0 %1 %2 $setNbtToSelector%3%6 %4 %5'
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    teams: {
                        type: 'literal',
                        children: {
                            add: {
                                type: 'literal',
                                children: {
                                    team: {
                                        type: 'argument',
                                        parser: 'brigadier:string',
                                        properties: {
                                            type: 'word'
                                        },
                                        children: {
                                            displayName: {
                                                type: 'argument',
                                                parser: 'brigadier:string',
                                                properties: {
                                                    type: 'greedy'
                                                },
                                                updater: 'spgoding:pre_json',
                                                executable: true,
                                                spu_script: 'team %2 %3 %4'
                                            }
                                        },
                                        executable: true,
                                        spu_script: 'team %2 %3'
                                    }
                                }
                            },
                            empty: {
                                type: 'literal',
                                children: {
                                    team: {
                                        type: 'argument',
                                        parser: 'minecraft:team',
                                        executable: true,
                                        spu_script: 'team %2 %3'
                                    }
                                }
                            },
                            join: {
                                type: 'literal',
                                children: {
                                    team: {
                                        type: 'argument',
                                        parser: 'minecraft:team',
                                        children: {
                                            members: {
                                                type: 'argument',
                                                parser: 'minecraft:entity',
                                                executable: true,
                                                spu_script: 'team %2 %3 %4'
                                            }
                                        },
                                        executable: true,
                                        spu_script: 'team %2 %3'
                                    }
                                }
                            },
                            leave: {
                                type: 'literal',
                                children: {
                                    members: {
                                        type: 'argument',
                                        parser: 'minecraft:entity',
                                        executable: true,
                                        spu_script: 'team %2 %3'
                                    }
                                }
                            },
                            list: {
                                type: 'literal',
                                children: {
                                    team: {
                                        type: 'argument',
                                        parser: 'minecraft:team',
                                        executable: true,
                                        spu_script: 'team %2 %3'
                                    }
                                },
                                executable: true,
                                spu_script: 'team %2'
                            },
                            option: {
                                type: 'literal',
                                children: {
                                    team: {
                                        type: 'argument',
                                        parser: 'minecraft:team',
                                        children: {
                                            collisionRule: {
                                                type: 'literal',
                                                children: {
                                                    always: {
                                                        type: 'literal',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    },
                                                    never: {
                                                        type: 'literal',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    },
                                                    pushOtherTeams: {
                                                        type: 'literal',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    },
                                                    pushOwnTeam: {
                                                        type: 'literal',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    }
                                                }
                                            },
                                            color: {
                                                type: 'literal',
                                                children: {
                                                    value: {
                                                        type: 'argument',
                                                        parser: 'minecraft:color',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    }
                                                }
                                            },
                                            deathMessageVisibility: {
                                                type: 'literal',
                                                children: {
                                                    always: {
                                                        type: 'literal',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    },
                                                    hideForOtherTeams: {
                                                        type: 'literal',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    },
                                                    hideForOwnTeam: {
                                                        type: 'literal',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    },
                                                    never: {
                                                        type: 'literal',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    }
                                                }
                                            },
                                            displayName: {
                                                type: 'literal',
                                                children: {
                                                    displayName: {
                                                        type: 'argument',
                                                        parser: 'brigadier:string',
                                                        properties: {
                                                            type: 'greedy'
                                                        },
                                                        updater: 'spgoding:pre_json',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    }
                                                }
                                            },
                                            friendlyfire: {
                                                type: 'literal',
                                                children: {
                                                    allowed: {
                                                        type: 'argument',
                                                        parser: 'brigadier:bool',
                                                        executable: true,
                                                        spu_script: 'team modify %3 friendlyFire %5'
                                                    }
                                                }
                                            },
                                            nametagVisibility: {
                                                type: 'literal',
                                                children: {
                                                    always: {
                                                        type: 'literal',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    },
                                                    hideForOtherTeams: {
                                                        type: 'literal',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    },
                                                    hideForOwnTeam: {
                                                        type: 'literal',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    },
                                                    never: {
                                                        type: 'literal',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    }
                                                }
                                            },
                                            seeFriendlyInvisibles: {
                                                type: 'literal',
                                                children: {
                                                    allowed: {
                                                        type: 'argument',
                                                        parser: 'brigadier:bool',
                                                        executable: true,
                                                        spu_script: 'team modify %3 %4 %5'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            remove: {
                                type: 'literal',
                                children: {
                                    team: {
                                        type: 'argument',
                                        parser: 'minecraft:team',
                                        executable: true
                                    }
                                }
                            }
                        },
                    }
                }
            },
            seed: {
                type: 'literal',
                executable: true
            },
            setblock: {
                type: 'literal',
                children: {
                    pos: {
                        type: 'argument',
                        parser: 'minecraft:block_pos',
                        children: {
                            block: {
                                type: 'argument',
                                parser: 'minecraft:resource_location',
                                updater: 'spgoding:block_name',
                                children: {
                                    states: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        properties: {
                                            min: -1,
                                            max: 16
                                        },
                                        children: {
                                            mode: {
                                                type: 'argument',
                                                parser: 'brigadier:string',
                                                properties: {
                                                    type: 'word'
                                                },
                                                updater: 'spgoding:to_literal_replace',
                                                children: {
                                                    nbt: {
                                                        type: 'argument',
                                                        parser: 'minecraft:nbt',
                                                        updater: 'spgoding:block_nbt',
                                                        executable: true,
                                                        spu_script: '%0 %1 $setNameStatesNbtToBlockState%2%3%5 %4'
                                                    }
                                                },
                                                executable: true,
                                                spu_script: '%0 %1 $setNameStatesToBlockState%2%3 %4'
                                            }
                                        },
                                        executable: true,
                                        spu_script: '%0 %1 $setNameStatesToBlockState%2%3'
                                    }
                                },
                                executable: true,
                                spu_script: '%0 %1 $setNameToBlockState%2'
                            }
                        }
                    }
                }
            },
            setidletimeout: {
                type: 'literal',
                children: {
                    minutes: {
                        type: 'argument',
                        parser: 'brigadier:integer',
                        properties: {
                            min: 0
                        },
                        executable: true
                    }
                }
            },
            setworldspawn: {
                type: 'literal',
                children: {
                    pos: {
                        type: 'argument',
                        parser: 'minecraft:block_pos',
                        executable: true
                    }
                },
                executable: true
            },
            spawnpoint: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            pos: {
                                type: 'argument',
                                parser: 'minecraft:block_pos',
                                executable: true
                            }
                        },
                        executable: true
                    }
                },
                executable: true
            },
            spreadplayers: {
                type: 'literal',
                children: {
                    center: {
                        type: 'argument',
                        parser: 'minecraft:vec2',
                        children: {
                            spreadDistance: {
                                type: 'argument',
                                parser: 'brigadier:float',
                                properties: {
                                    min: 0.0
                                },
                                children: {
                                    maxRange: {
                                        type: 'argument',
                                        parser: 'brigadier:float',
                                        properties: {
                                            min: 1.0
                                        },
                                        children: {
                                            respectTeams: {
                                                type: 'argument',
                                                parser: 'brigadier:bool',
                                                children: {
                                                    targets: {
                                                        type: 'argument',
                                                        parser: 'minecraft:entity',
                                                        executable: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            stats: {
                type: 'literal',
                children: {
                    rest: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'greedy'
                        },
                        executable: true,
                        spu_script: '# %0 %1',
                        warning: "Use 'execute store ...'."
                    }
                }
            },
            stop: {
                type: 'literal',
                executable: true
            },
            stopsound: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            '*': {
                                type: 'literal',
                                children: {
                                    sound: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        executable: true
                                    }
                                }
                            },
                            ambient: {
                                type: 'literal',
                                children: {
                                    sound: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        executable: true
                                    }
                                },
                                executable: true
                            },
                            block: {
                                type: 'literal',
                                children: {
                                    sound: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        executable: true
                                    }
                                },
                                executable: true
                            },
                            hostile: {
                                type: 'literal',
                                children: {
                                    sound: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        executable: true
                                    }
                                },
                                executable: true
                            },
                            master: {
                                type: 'literal',
                                children: {
                                    sound: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        executable: true
                                    }
                                },
                                executable: true
                            },
                            music: {
                                type: 'literal',
                                children: {
                                    sound: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        executable: true
                                    }
                                },
                                executable: true
                            },
                            neutral: {
                                type: 'literal',
                                children: {
                                    sound: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        executable: true
                                    }
                                },
                                executable: true
                            },
                            player: {
                                type: 'literal',
                                children: {
                                    sound: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        executable: true
                                    }
                                },
                                executable: true
                            },
                            record: {
                                type: 'literal',
                                children: {
                                    sound: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        executable: true
                                    }
                                },
                                executable: true
                            },
                            voice: {
                                type: 'literal',
                                children: {
                                    sound: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        executable: true
                                    }
                                },
                                executable: true
                            },
                            weather: {
                                type: 'literal',
                                children: {
                                    sound: {
                                        type: 'argument',
                                        parser: 'minecraft:resource_location',
                                        executable: true
                                    }
                                },
                                executable: true
                            }
                        },
                        executable: true
                    }
                }
            },
            summon: {
                type: 'literal',
                children: {
                    entity: {
                        type: 'argument',
                        parser: 'minecraft:entity_summon',
                        children: {
                            pos: {
                                type: 'argument',
                                parser: 'minecraft:vec3',
                                children: {
                                    nbt: {
                                        type: 'argument',
                                        parser: 'minecraft:nbt',
                                        updater: 'spgoding:entity_nbt',
                                        executable: true
                                    }
                                },
                                executable: true
                            }
                        },
                        executable: true
                    }
                }
            },
            teleport: {
                type: 'literal',
                children: {
                    destination: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        executable: true
                    },
                    location: {
                        type: 'argument',
                        parser: 'minecraft:vec3',
                        executable: true
                    },
                    targets: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            destination: {
                                type: 'argument',
                                parser: 'minecraft:entity',
                                executable: true
                            },
                            location: {
                                type: 'argument',
                                parser: 'minecraft:vec3',
                                children: {
                                    facing: {
                                        type: 'literal',
                                        children: {
                                            entity: {
                                                type: 'literal',
                                                children: {
                                                    facingEntity: {
                                                        type: 'argument',
                                                        parser: 'minecraft:entity',
                                                        children: {
                                                            facingAnchor: {
                                                                type: 'argument',
                                                                parser: 'minecraft:entity_anchor',
                                                                executable: true
                                                            }
                                                        },
                                                        executable: true
                                                    }
                                                }
                                            },
                                            facingLocation: {
                                                type: 'argument',
                                                parser: 'minecraft:vec3',
                                                executable: true
                                            }
                                        }
                                    },
                                    rotation: {
                                        type: 'argument',
                                        parser: 'minecraft:rotation',
                                        executable: true
                                    }
                                },
                                executable: true
                            }
                        }
                    }
                }
            },
            tell: {
                type: 'literal',
                redirect: ['msg']
            },
            tellraw: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            message: {
                                type: 'argument',
                                parser: 'minecraft:component',
                                executable: true
                            }
                        }
                    }
                }
            },
            testfor: {
                type: 'literal',
                children: {
                    entity: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            nbt: {
                                type: 'argument',
                                parser: 'minecraft:nbt',
                                updater: 'spgoding:entity_nbt',
                                executable: true,
                                spu_script: 'execute if entity $setNbtToSelector%1%2'
                            }
                        },
                        executable: true,
                        spu_script: 'execute if entity %1'
                    }
                }
            },
            testforblock: {
                type: 'literal',
                children: {
                    pos: {
                        type: 'argument',
                        parser: 'minecraft:block_pos',
                        children: {
                            name: {
                                type: 'argument',
                                parser: 'minecraft:resource_location',
                                updater: 'spgoding:block_name',
                                children: {
                                    states: {
                                        type: 'argument',
                                        parser: 'brigadier:string',
                                        properties: {
                                            type: 'word'
                                        },
                                        children: {
                                            nbt: {
                                                type: 'argument',
                                                parser: 'minecraft:nbt',
                                                updater: 'spgoding:block_nbt',
                                                executable: true,
                                                spu_script: 'execute if block %1 $setNameStatesNbtToBlockState%2%3%4'
                                            }
                                        },
                                        executable: true,
                                        spu_script: 'execute if block %1 $setNameStatesToBlockState%2%3'
                                    }
                                },
                                executable: true,
                                spu_script: 'execute if block %1 $setNameToBlockState%2'
                            }
                        }
                    }
                }
            },
            testforblocks: {
                type: 'literal',
                children: {
                    begin: {
                        type: 'argument',
                        parser: 'minecraft:block_pos',
                        children: {
                            end: {
                                type: 'argument',
                                parser: 'minecraft:block_pos',
                                children: {
                                    target: {
                                        type: 'argument',
                                        parser: 'minecraft:block_pos',
                                        children: {
                                            string: {
                                                type: 'argument',
                                                parser: 'brigadier:string',
                                                properties: {
                                                    type: 'word'
                                                },
                                                executable: true,
                                                spu_script: 'execute if blocks %1 %2 %3 %4'
                                            }
                                        },
                                        executable: true,
                                        spu_script: 'execute if blocks %1 %2 %3 all'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            time: {
                type: 'literal',
                children: {
                    add: {
                        type: 'literal',
                        children: {
                            time: {
                                type: 'argument',
                                parser: 'brigadier:integer',
                                properties: {
                                    min: 0
                                },
                                executable: true
                            }
                        }
                    },
                    query: {
                        type: 'literal',
                        children: {
                            day: {
                                type: 'literal',
                                executable: true
                            },
                            daytime: {
                                type: 'literal',
                                executable: true
                            },
                            gametime: {
                                type: 'literal',
                                executable: true
                            }
                        }
                    },
                    set: {
                        type: 'literal',
                        children: {
                            day: {
                                type: 'literal',
                                executable: true
                            },
                            midnight: {
                                type: 'literal',
                                executable: true
                            },
                            night: {
                                type: 'literal',
                                executable: true
                            },
                            noon: {
                                type: 'literal',
                                executable: true
                            },
                            time: {
                                type: 'argument',
                                parser: 'brigadier:integer',
                                properties: {
                                    min: 0
                                },
                                executable: true
                            }
                        }
                    }
                }
            },
            title: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            actionbar: {
                                type: 'literal',
                                children: {
                                    title: {
                                        type: 'argument',
                                        parser: 'minecraft:component',
                                        executable: true
                                    }
                                }
                            },
                            clear: {
                                type: 'literal',
                                executable: true
                            },
                            reset: {
                                type: 'literal',
                                executable: true
                            },
                            subtitle: {
                                type: 'literal',
                                children: {
                                    title: {
                                        type: 'argument',
                                        parser: 'minecraft:component',
                                        executable: true
                                    }
                                }
                            },
                            times: {
                                type: 'literal',
                                children: {
                                    fadeIn: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        properties: {
                                            min: 0
                                        },
                                        children: {
                                            stay: {
                                                type: 'argument',
                                                parser: 'brigadier:integer',
                                                properties: {
                                                    min: 0
                                                },
                                                children: {
                                                    fadeOut: {
                                                        type: 'argument',
                                                        parser: 'brigadier:integer',
                                                        properties: {
                                                            min: 0
                                                        },
                                                        executable: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            title: {
                                type: 'literal',
                                children: {
                                    title: {
                                        type: 'argument',
                                        parser: 'minecraft:component',
                                        executable: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            toggledownfall: {
                type: 'literal',
                executable: true,
                spu_script: 'weather clear',
                warning: "'Toggledownfall' could toggle the weather, but 'weather clear' can only set the weather to clear."
            },
            tp: {
                type: 'literal',
                children: {
                    pos: {
                        type: 'argument',
                        parser: 'minecraft:vec3',
                        executable: true,
                        spu_script: 'teleport %1'
                    },
                    entity: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        children: {
                            entity: {
                                type: 'argument',
                                parser: 'minecraft:entity',
                                updater: 'spgoding:single_selector',
                                executable: true,
                                spu_script: 'teleport %1 %2'
                            },
                            pos: {
                                type: 'argument',
                                parser: 'minecraft:vec3',
                                children: {
                                    rotation: {
                                        type: 'argument',
                                        parser: 'minecraft:vec2',
                                        executable: true,
                                        spu_script: 'execute as %1 at @s run teleport @s %2 %3'
                                    }
                                },
                                executable: true,
                                spu_script: 'execute as %1 at @s run teleport @s %2'
                            }
                        },
                        executable: true,
                        spu_script: 'teleport %1'
                    }
                }
            },
            trigger: {
                type: 'literal',
                children: {
                    objective: {
                        type: 'argument',
                        parser: 'minecraft:objective',
                        children: {
                            add: {
                                type: 'literal',
                                children: {
                                    value: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        executable: true
                                    }
                                }
                            },
                            set: {
                                type: 'literal',
                                children: {
                                    value: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        executable: true
                                    }
                                }
                            }
                        },
                        executable: true
                    }
                }
            },
            w: {
                type: 'literal',
                redirect: ['msg']
            },
            weather: {
                type: 'literal',
                children: {
                    clear: {
                        type: 'literal',
                        children: {
                            duration: {
                                type: 'argument',
                                parser: 'brigadier:integer',
                                properties: {
                                    min: 0,
                                    max: 1000000
                                },
                                executable: true
                            }
                        },
                        executable: true
                    },
                    rain: {
                        type: 'literal',
                        children: {
                            duration: {
                                type: 'argument',
                                parser: 'brigadier:integer',
                                properties: {
                                    min: 0,
                                    max: 1000000
                                },
                                executable: true
                            }
                        },
                        executable: true
                    },
                    thunder: {
                        type: 'literal',
                        children: {
                            duration: {
                                type: 'argument',
                                parser: 'brigadier:integer',
                                properties: {
                                    min: 0,
                                    max: 1000000
                                },
                                executable: true
                            }
                        },
                        executable: true
                    }
                }
            },
            whitelist: {
                type: 'literal',
                children: {
                    add: {
                        type: 'literal',
                        children: {
                            targets: {
                                type: 'argument',
                                parser: 'brigadier:string',
                                properties: {
                                    type: 'word'
                                },
                                executable: true
                            }
                        }
                    },
                    list: {
                        type: 'literal',
                        executable: true
                    },
                    off: {
                        type: 'literal',
                        executable: true
                    },
                    on: {
                        type: 'literal',
                        executable: true
                    },
                    reload: {
                        type: 'literal',
                        executable: true
                    },
                    remove: {
                        type: 'literal',
                        children: {
                            targets: {
                                type: 'argument',
                                parser: 'brigadier:string',
                                properties: {
                                    type: 'word'
                                },
                                executable: true
                            }
                        }
                    }
                }
            },
            worldborder: {
                type: 'literal',
                children: {
                    add: {
                        type: 'literal',
                        children: {
                            distance: {
                                type: 'argument',
                                parser: 'brigadier:float',
                                properties: {
                                    min: -6.0e7,
                                    max: 6.0e7
                                },
                                children: {
                                    time: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        properties: {
                                            min: 0
                                        },
                                        executable: true
                                    }
                                },
                                executable: true
                            }
                        }
                    },
                    center: {
                        type: 'literal',
                        children: {
                            pos: {
                                type: 'argument',
                                parser: 'minecraft:vec2',
                                executable: true
                            }
                        }
                    },
                    damage: {
                        type: 'literal',
                        children: {
                            amount: {
                                type: 'literal',
                                children: {
                                    damagePerBlock: {
                                        type: 'argument',
                                        parser: 'brigadier:float',
                                        properties: {
                                            min: 0.0
                                        },
                                        executable: true
                                    }
                                }
                            },
                            buffer: {
                                type: 'literal',
                                children: {
                                    distance: {
                                        type: 'argument',
                                        parser: 'brigadier:float',
                                        properties: {
                                            min: 0.0
                                        },
                                        executable: true
                                    }
                                }
                            }
                        }
                    },
                    get: {
                        type: 'literal',
                        executable: true
                    },
                    set: {
                        type: 'literal',
                        children: {
                            distance: {
                                type: 'argument',
                                parser: 'brigadier:float',
                                properties: {
                                    min: -6.0e7,
                                    max: 6.0e7
                                },
                                children: {
                                    time: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        properties: {
                                            min: 0
                                        },
                                        executable: true
                                    }
                                },
                                executable: true
                            }
                        }
                    },
                    warning: {
                        type: 'literal',
                        children: {
                            distance: {
                                type: 'literal',
                                children: {
                                    distance: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        properties: {
                                            min: 0
                                        },
                                        executable: true
                                    }
                                }
                            },
                            time: {
                                type: 'literal',
                                children: {
                                    time: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        properties: {
                                            min: 0
                                        },
                                        executable: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            xp: {
                type: 'literal',
                children: {
                    level: {
                        type: 'argument',
                        parser: 'brigadier:string',
                        properties: {
                            type: 'word'
                        },
                        updater: 'spgoding:points_or_levels',
                        children: {
                            entity: {
                                type: 'argument',
                                parser: 'minecraft:entity',
                                executable: true,
                                spu_script: 'experience add %2 %1'
                            }
                        },
                        executable: true,
                        spu_script: 'experience add @s %1'
                    }
                }
            }
        }
    }
}
