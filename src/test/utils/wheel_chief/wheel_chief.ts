import 'mocha'
import * as assert from 'power-assert'

import { WheelChief, ParseResult, CmdNode } from '../../../../src/utils/wheel_chief/wheel_chief'

describe('WheelChief tests', () => {
    describe('parseCmdNode() tests', () => {
        it('should parse literal', () => {
            const input: ParseResult = {
                command: {
                    args: [],
                    spuScript: ''
                },
                index: 0,
                splited: ['literal']
            }
            const rootNode: CmdNode = {
                type: 'root',
                children: {
                    literal: {
                        type: 'literal',
                        executable: true
                    }
                }
            }

            const actual = WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode)
            assert.deepEqual(actual.command.args, ['literal'])
        })

        it('should parse recursion children', () => {
            const input: ParseResult = {
                command: {
                    args: [],
                    spuScript: ''
                },
                index: 0,
                splited: ['first', 'second', 'the_last_child']
            }
            const rootNode: CmdNode = {
                type: 'root',
                children: {
                    first: {
                        type: 'literal',
                        children: {
                            second: {
                                type: 'literal',
                                children: {
                                    the_last_child: {
                                        type: 'literal',
                                        executable: true
                                    }
                                }
                            }
                        }
                    }
                }
            }

            const actual = WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode)

            assert.deepEqual(actual.command.args, ['first', 'second', 'the_last_child'])
        })

        it('should parse same level children', () => {
            const input: ParseResult = {
                command: {
                    args: [],
                    spuScript: ''
                },
                index: 0,
                splited: ['b', 'b']
            }
            const rootNode: CmdNode = {
                type: 'root',
                children: {
                    a: {
                        type: 'literal',
                        children: {
                            a: {
                                type: 'literal',
                                executable: true
                            },
                            b: {
                                type: 'literal',
                                executable: true
                            }
                        }
                    },
                    b: {
                        type: 'literal',
                        children: {
                            a: {
                                type: 'literal',
                                executable: true
                            },
                            b: {
                                type: 'literal',
                                executable: true
                            }
                        }
                    }
                }
            }

            const actual = WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode)

            assert.deepEqual(actual.command.args, ['b', 'b'])
        })

        it('should parse argument', () => {
            const input: ParseResult = {
                command: {
                    args: [],
                    spuScript: ''
                },
                index: 0,
                splited: ['test', 'true', '233']
            }
            const rootNode: CmdNode = {
                type: 'root',
                children: {
                    test: {
                        type: 'literal',
                        children: {
                            boolean: {
                                type: 'argument',
                                parser: 'brigadier:bool',
                                children: {
                                    int: {
                                        type: 'argument',
                                        parser: 'brigadier:integer',
                                        properties: {
                                            min: 10
                                        },
                                        executable: true
                                    }
                                }
                            }
                        }
                    }
                }
            }

            const actual = WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode)

            assert.deepEqual(actual.command.args, ['test', 'true', '233'])
        })

        it('should parse redirect', () => {
            const input: ParseResult = {
                command: {
                    args: [],
                    spuScript: ''
                },
                index: 0,
                splited: ['spg', 'test']
            }
            const rootNode: CmdNode = {
                type: 'root',
                children: {
                    rbq: {
                        type: 'literal',
                        children: {
                            test: {
                                type: 'literal',
                                executable: true
                            }
                        }
                    },
                    spg: {
                        type: 'literal',
                        redirect: ['rbq']
                    }
                }
            }

            const actual = WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode)

            assert.deepEqual(actual.command.args, ['spg', 'test'])
        })

        it(`shouldn't parse out-range number`, () => {
            const input: ParseResult = {
                command: {
                    args: [],
                    spuScript: ''
                },
                index: 0,
                splited: ['test', '233']
            }
            const rootNode: CmdNode = {
                type: 'root',
                children: {
                    test: {
                        type: 'literal',
                        children: {
                            int: {
                                type: 'argument',
                                parser: 'brigadier:integer',
                                properties: {
                                    max: 127
                                },
                                executable: true
                            }
                        }
                    }
                }
            }

            try {
                WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode)
            } catch {
                return
            }

            throw `It parsed!`
        })

        it(`should parse string`, () => {
            const input: ParseResult = {
                command: {
                    args: [],
                    spuScript: ''
                },
                index: 0,
                splited: ['test', 'word', 'phrase', '"phrase', 'phrase"', 'g', 'r', 'e', 'e', 'd', 'y']
            }
            const rootNode: CmdNode = {
                type: 'root',
                children: {
                    test: {
                        type: 'literal',
                        children: {
                            word: {
                                type: 'argument',
                                parser: 'brigadier:string',
                                properties: {
                                    type: 'word'
                                },
                                children: {
                                    phrase: {
                                        type: 'argument',
                                        parser: 'brigadier:string',
                                        properties: {
                                            type: 'phrase'
                                        },
                                        children: {
                                            phrase: {
                                                type: 'argument',
                                                parser: 'brigadier:string',
                                                properties: {
                                                    type: 'phrase'
                                                },
                                                children: {
                                                    greedy: {
                                                        type: 'argument',
                                                        parser: 'brigadier:string',
                                                        properties: {
                                                            type: 'greedy'
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
            }

            const actual = WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode)
            assert.deepEqual(actual.command.args, ['test', 'word', 'phrase', '"phrase phrase"', 'g r e e d y'])
        })

        it('should parse execute run', () => {
            const input: ParseResult = {
                command: {
                    args: [],
                    spuScript: ''
                },
                index: 0,
                splited: ['execute', 'run', 'execute', 'run', 'spg']
            }
            const rootNode: CmdNode = {
                type: 'root',
                children: {
                    execute: {
                        type: 'literal',
                        children: {
                            run: {
                                type: 'literal'
                            }
                        }
                    },
                    spg: {
                        type: 'literal',
                        executable: true
                    }
                }
            }

            const actual = WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode)

            assert.deepEqual(actual.command.args, ['execute', 'run', 'execute', 'run', 'spg'])
        })

        it(`should parse nbt`, () => {
            const input: ParseResult = {
                command: {
                    args: [],
                    spuScript: ''
                },
                index: 0,
                splited: ['test', '{}', '{foo', ':', 'bar', '}', '{spg:rbq}']
            }
            const rootNode: CmdNode = {
                type: 'root',
                children: {
                    test: {
                        type: 'literal',
                        children: {
                            nbt: {
                                type: 'argument',
                                parser: 'minecraft:nbt',
                                children: {
                                    nbt: {
                                        type: 'argument',
                                        parser: 'minecraft:nbt',
                                        children: {
                                            nbt: {
                                                type: 'argument',
                                                parser: 'minecraft:nbt',
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

            const actual = WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode)
            assert.deepEqual(actual.command.args, ['test', '{}', '{foo : bar }', '{spg:rbq}'])
        })
    })
})