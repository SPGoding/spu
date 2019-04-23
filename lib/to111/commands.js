"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Written by SPGoding.
 * @version Minecraft: Java Editon 1.9.4
 */
class Commands19To111 {
}
Commands19To111.commands = {
    type: 'root',
    children: {
        achievement: {
            type: 'literal',
            children: {
                give: {
                    type: 'literal',
                    children: {
                        name: {
                            type: 'argument',
                            parser: 'brigadier:string',
                            properties: {
                                type: 'word'
                            },
                            children: {
                                player: {
                                    type: 'argument',
                                    parser: 'minecraft:entity',
                                    executable: true
                                }
                            },
                            executable: true
                        }
                    }
                },
                take: {
                    type: 'literal',
                    children: {
                        name: {
                            type: 'argument',
                            parser: 'brigadier:string',
                            properties: {
                                type: 'word'
                            },
                            children: {
                                player: {
                                    type: 'argument',
                                    parser: 'minecraft:entity',
                                    executable: true
                                }
                            },
                            executable: true
                        }
                    }
                },
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
                                                }
                                            },
                                            executable: true,
                                        }
                                    },
                                    executable: true,
                                }
                            },
                            executable: true,
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
                                                            children: {
                                                                states: {
                                                                    type: 'argument',
                                                                    parser: 'brigadier:string',
                                                                    properties: {
                                                                        type: 'greedy'
                                                                    },
                                                                    executable: true,
                                                                }
                                                            },
                                                            executable: true,
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
                        },
                        effect: {
                            type: 'argument',
                            parser: 'brigadier:string',
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
                                                }
                                            },
                                            executable: true,
                                        }
                                    },
                                    executable: true,
                                }
                            },
                            executable: true,
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
                            executable: true
                        },
                        nbt: {
                            type: 'argument',
                            parser: 'minecraft:nbt',
                            updater: 'spgoding:entity_nbt',
                            executable: true,
                            spu_script: '%0 $setTypeWithNbt%1%2 $delVariantNbt%2'
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
                                                    children: {
                                                        metadata: {
                                                            type: 'argument',
                                                            parser: 'brigadier:integer',
                                                            properties: {
                                                                min: -1,
                                                                max: 15
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
                                    children: {
                                        metadata: {
                                            type: 'argument',
                                            parser: 'brigadier:integer',
                                            properties: {
                                                min: 0,
                                                max: 15
                                            },
                                            children: {
                                                replace: {
                                                    type: 'literal',
                                                    children: {
                                                        block: {
                                                            type: 'argument',
                                                            parser: 'minecraft:resource_location',
                                                            children: {
                                                                states: {
                                                                    type: 'argument',
                                                                    parser: 'brigadier:string',
                                                                    properties: {
                                                                        type: 'word'
                                                                    },
                                                                    executable: true,
                                                                }
                                                            },
                                                            executable: true,
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
                                                        }
                                                    },
                                                    executable: true,
                                                }
                                            },
                                            executable: true,
                                        }
                                    },
                                    executable: true,
                                }
                            }
                        }
                    }
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
                        }
                    },
                    executable: true,
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
                                                }
                                            },
                                            executable: true,
                                        }
                                    },
                                    executable: true,
                                }
                            },
                            executable: true,
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
                                                                                }
                                                                            },
                                                                            executable: true,
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
                                    children: {
                                        item: {
                                            type: 'argument',
                                            parser: 'minecraft:resource_location',
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
                                                                }
                                                            },
                                                            executable: true,
                                                        }
                                                    },
                                                    executable: true,
                                                }
                                            },
                                            executable: true,
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
                                    children: {
                                        item: {
                                            type: 'argument',
                                            parser: 'minecraft:resource_location',
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
                                                                }
                                                            },
                                                            executable: true,
                                                        }
                                                    },
                                                    executable: true,
                                                }
                                            },
                                            executable: true,
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
                                            children: {
                                                displayName: {
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
                                                            spu_script: '%0 %1 %2 $setSelectorWithNbt%3%6 %4 %5 $delVariantNbt%6'
                                                        }
                                                    },
                                                    executable: true
                                                }
                                            }
                                        },
                                        list: {
                                            type: 'literal',
                                            executable: true
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
                                                            spu_script: '%0 %1 %2 $setSelectorWithNbt%3%6 %4 %5 $delVariantNbt%6'
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
                                                            spu_script: '%0 %1 %2 $setSelectorWithNbt%3%6 %4 %5 $delVariantNbt%6'
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
                                                    spu_script: '%0 %1 %2 $setSelectorWithNbt%3%5 %4 $delVariantNbt%5'
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
                                                    spu_script: '%0 %1 %2 $setSelectorWithNbt%3%5 %4 $delVariantNbt%5'
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
                                                                            spu_script: '%0 %1 %2 $setSelectorWithNbt%3%8 %4 %5 %6 %7 %8 $delVariantNbt%8'
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
                                                            spu_script: '%0 %1 %2 $setSelectorWithNbt%3%6 %4 %5 $delVariantNbt%6'
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
                                                            spu_script: '%0 %1 %2 $setSelectorWithNbt%3%6 %4 %5 $delVariantNbt%6'
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
                                            executable: true,
                                        }
                                    },
                                    executable: true,
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
                                        }
                                    },
                                    executable: true,
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
                                }
                            },
                            executable: true,
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
                                                },
                                                never: {
                                                    type: 'literal',
                                                    executable: true,
                                                },
                                                pushOtherTeams: {
                                                    type: 'literal',
                                                    executable: true,
                                                },
                                                pushOwnTeam: {
                                                    type: 'literal',
                                                    executable: true,
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
                                                }
                                            }
                                        },
                                        deathMessageVisibility: {
                                            type: 'literal',
                                            children: {
                                                always: {
                                                    type: 'literal',
                                                    executable: true,
                                                },
                                                hideForOtherTeams: {
                                                    type: 'literal',
                                                    executable: true,
                                                },
                                                hideForOwnTeam: {
                                                    type: 'literal',
                                                    executable: true,
                                                },
                                                never: {
                                                    type: 'literal',
                                                    executable: true,
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
                                                    executable: true,
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
                                                }
                                            }
                                        },
                                        nametagVisibility: {
                                            type: 'literal',
                                            children: {
                                                always: {
                                                    type: 'literal',
                                                    executable: true,
                                                },
                                                hideForOtherTeams: {
                                                    type: 'literal',
                                                    executable: true,
                                                },
                                                hideForOwnTeam: {
                                                    type: 'literal',
                                                    executable: true,
                                                },
                                                never: {
                                                    type: 'literal',
                                                    executable: true,
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
                            children: {
                                metadata: {
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
                                                }
                                            },
                                            executable: true,
                                        }
                                    },
                                    executable: true,
                                }
                            },
                            executable: true,
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
                                    executable: true,
                                    spu_script: '%0 $setTypeWithNbt%1%3 %2 $delVariantNbt%3'
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
                            spu_script: '%0 $setSelectorWithNbt%1%2 $delVariantNbt%2'
                        }
                    },
                    executable: true
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
                            children: {
                                metadata: {
                                    type: 'argument',
                                    parser: 'brigadier:integer',
                                    properties: {
                                        min: -1,
                                        max: 16
                                    },
                                    children: {
                                        nbt: {
                                            type: 'argument',
                                            parser: 'minecraft:nbt',
                                            updater: 'spgoding:block_nbt',
                                            executable: true,
                                        }
                                    },
                                    executable: true,
                                }
                            },
                            executable: true,
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
                                        }
                                    },
                                    executable: true,
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
        },
        tp: {
            type: 'literal',
            children: {
                pos: {
                    type: 'argument',
                    parser: 'minecraft:vec3',
                    executable: true,
                },
                entity: {
                    type: 'argument',
                    parser: 'minecraft:entity',
                    children: {
                        entity: {
                            type: 'argument',
                            parser: 'minecraft:entity',
                            executable: true,
                        },
                        pos: {
                            type: 'argument',
                            parser: 'minecraft:vec3',
                            children: {
                                rotation: {
                                    type: 'argument',
                                    parser: 'minecraft:vec2',
                                    executable: true,
                                }
                            },
                            executable: true,
                        }
                    },
                    executable: true,
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
                    children: {
                        entity: {
                            type: 'argument',
                            parser: 'minecraft:entity',
                            executable: true,
                        }
                    },
                    executable: true,
                }
            }
        }
    }
};
exports.Commands19To111 = Commands19To111;
//# sourceMappingURL=commands.js.map