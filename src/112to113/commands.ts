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
                                properties: {
                                    amount: 'multiple',
                                    type: 'players'
                                },
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
                                properties: {
                                    amount: 'multiple',
                                    type: 'players'
                                },
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
                        parser: 'minecraft:game_profile',
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
            clear: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        properties: {
                            amount: 'multiple',
                            type: 'players'
                        },
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
                        properties: {
                            amount: 'multiple',
                            type: 'entities'
                        },
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
                        properties: {
                            amount: 'multiple',
                            type: 'entities'
                        },
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
                        properties: {
                            amount: 'multiple',
                            type: 'entities'
                        },
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
                        properties: {
                            amount: 'multiple',
                            type: 'entities'
                        },
                        updater: 'spgoding:as_entity',
                        children: {
                            pos: {
                                type: 'argument',
                                parser: 'minecraft:vec3',
                                updater: 'spgoding:positioned_pos',
                                children: {
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
            // See the 'detect' command as an root command.
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
                                        parser: 'bragadier:string',
                                        properties: {
                                            type: 'word'
                                        },
                                        children: {
                                            command: {
                                                type: 'argument',
                                                parser: 'bragadier:string',
                                                properties: {
                                                    type: 'greedy'
                                                },
                                                updater: 'spgoding:command',
                                                executable: true,
                                                spu_script: 'execute if block %1 $setNameStatesToBlockState%2%3 run %4'
                                            }
                                        }
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
                                        properties: {
                                            amount: 'multiple',
                                            type: 'entities'
                                        },
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
                                properties: {
                                    amount: 'multiple',
                                    type: 'players'
                                },
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
                                spu_script: `# %0 %1 %2 !> The rule 'gameLoopFunction' has been removed. Please add function %2 to function tag '#minecraft:tick'.`
                            }
                        },
                        executable: true,
                        spu_script: `# %0 %1 !> The rule 'gameLoopFunction' has been removed.`
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
                                executable: true
                            }
                        },
                        executable: true
                    }
                }
            },
            give: {
                type: 'literal',
                children: {
                    entity: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        properties: {
                            amount: 'multiple',
                            type: 'players'
                        },
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
                                                        spu_script: '%0 %1 $addNameDataNbtToItemStack%2%4%5 %3'
                                                    }
                                                },
                                                executable: true,
                                                spu_script: '%0 %1 $addNameDataToItemStack%2%4 %3'
                                            }
                                        },
                                        executable: true,
                                        spu_script: '%0 %1 $addNameToItemStack%2 %3'
                                    }
                                },
                                executable: true,
                                spu_script: '%0 %1 $addNameToItemStack%2'
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
                        properties: {
                            amount: 'multiple',
                            type: 'players'
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
            kill: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'minecraft:entity',
                        properties: {
                            amount: 'multiple',
                            type: 'entities'
                        },
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
                        spu_script: `# %0 %1 !> 'Temple' has been separated into 'Desert_Pyramid', 'Igloo', 'Jungle_Pyramid' and 'Swamp_hut'`
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
                        properties: {
                            amount: 'multiple',
                            type: 'players'
                        },
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
                        parser: 'minecraft:game_profile',
                        executable: true
                    }
                }
            },
            pardon: {
                type: 'literal',
                children: {
                    targets: {
                        type: 'argument',
                        parser: 'minecraft:game_profile',
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
                                                                        properties: {
                                                                            amount: 'multiple',
                                                                            type: 'players'
                                                                        },
                                                                        children: {
                                                                            param: {
                                                                                type: 'argument',
                                                                                parser: 'brigadier:int',
                                                                                children: {
                                                                                    param: {
                                                                                        type: 'argument',
                                                                                        parser: 'brigadier:int',
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
                                        properties: {
                                            amount: 'multiple',
                                            type: 'players'
                                        },
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
                                        properties: {
                                            amount: 'multiple',
                                            type: 'players'
                                        },
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
                                        properties: {
                                            amount: 'multiple',
                                            type: 'players'
                                        },
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
                                        properties: {
                                            amount: 'multiple',
                                            type: 'players'
                                        },
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
                                        properties: {
                                            amount: 'multiple',
                                            type: 'players'
                                        },
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
                                        properties: {
                                            amount: 'multiple',
                                            type: 'players'
                                        },
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
                                        properties: {
                                            amount: 'multiple',
                                            type: 'players'
                                        },
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
                                        properties: {
                                            amount: 'multiple',
                                            type: 'players'
                                        },
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
                                        properties: {
                                            amount: 'multiple',
                                            type: 'players'
                                        },
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
                                        properties: {
                                            amount: 'multiple',
                                            type: 'players'
                                        },
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
                                properties: {
                                    amount: 'multiple',
                                    type: 'players'
                                },
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
                                properties: {
                                    amount: 'multiple',
                                    type: 'players'
                                },
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
                                        parser: 'minecraft:item_slot',
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
                                properties: {
                                    amount: 'multiple',
                                    type: 'entities'
                                },
                                children: {
                                    slot: {
                                        type: 'argument',
                                        parser: 'minecraft:item_slot',
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
            // TODO: scoreboard here.
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
                                updater: 'spgoding:block_nbt',
                                children: {
                                    data: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        properties: {
                                            min: 0,
                                            max: 15
                                        },
                                        children: {
                                            mode: {
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
                        properties: {
                            amount: 'multiple',
                            type: 'players'
                        },
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
                                                        properties: {
                                                            amount: 'multiple',
                                                            type: 'entities'
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
                        spu_script: `# %0 %1 !> Use 'execute store ...'.`
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
                        properties: {
                            amount: 'multiple',
                            type: 'players'
                        },
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
                        properties: {
                            amount: 'single',
                            type: 'entities'
                        },
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
                        properties: {
                            amount: 'multiple',
                            type: 'entities'
                        },
                        children: {
                            destination: {
                                type: 'argument',
                                parser: 'minecraft:entity',
                                properties: {
                                    amount: 'single',
                                    type: 'entities'
                                },
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
                                                        properties: {
                                                            amount: 'single',
                                                            type: 'entities'
                                                        },
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
                        properties: {
                            amount: 'multiple',
                            type: 'players'
                        },
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
            // TODO: testfor, testforblock, testforblocks here
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
                        properties: {
                            amount: 'multiple',
                            type: 'players'
                        },
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
                spu_script: `weather clear !> 'Toggledownfall' could toggle the weather, but 'weather clear' can only set the weather to clear.`
            },
            // TODO: tp here
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
                                parser: 'minecraft:game_profile',
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
                                parser: 'minecraft:game_profile',
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
            // TODO: Add xp here
        }
    }
}
