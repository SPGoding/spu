"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert = require("power-assert");
const wheel_chief_1 = require("../../../../src/utils/wheel_chief/wheel_chief");
const parser_1 = require("../../../utils/wheel_chief/parser");
describe('WheelChief tests', () => {
    describe('parseCmdNode() tests', () => {
        it('should parse literal', () => {
            const input = {
                command: {
                    args: [],
                    spuScript: '',
                    warning: ''
                },
                index: 0,
                splited: ['literal']
            };
            const rootNode = {
                type: 'root',
                children: {
                    literal: {
                        type: 'literal',
                        executable: true
                    }
                }
            };
            const actual = wheel_chief_1.WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode, new parser_1.ArgumentParser());
            assert.deepEqual(actual.command.args, [{ value: 'literal' }]);
        });
        it('should parse recursion children', () => {
            const input = {
                command: {
                    args: [],
                    spuScript: '',
                    warning: ''
                },
                index: 0,
                splited: ['first', 'second', 'the_last_child']
            };
            const rootNode = {
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
            };
            const actual = wheel_chief_1.WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode, new parser_1.ArgumentParser());
            assert.deepEqual(actual.command.args, [
                { value: 'first' },
                { value: 'second' },
                { value: 'the_last_child' }
            ]);
        });
        it('should parse same level children', () => {
            const input = {
                command: {
                    args: [],
                    spuScript: '',
                    warning: ''
                },
                index: 0,
                splited: ['b', 'b']
            };
            const rootNode = {
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
            };
            const actual = wheel_chief_1.WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode, new parser_1.ArgumentParser());
            assert.deepEqual(actual.command.args, [{ value: 'b' }, { value: 'b' }]);
        });
        it('should parse argument', () => {
            const input = {
                command: {
                    args: [],
                    spuScript: '',
                    warning: ''
                },
                index: 0,
                splited: ['test', 'true', '233']
            };
            const rootNode = {
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
            };
            const actual = wheel_chief_1.WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode, new parser_1.ArgumentParser());
            assert.deepEqual(actual.command.args, [
                { value: 'test' },
                { value: 'true', updater: 'brigadier:bool' },
                { value: '233', updater: 'brigadier:integer' }
            ]);
        });
        it('should parse redirect', () => {
            const input = {
                command: {
                    args: [],
                    spuScript: '',
                    warning: ''
                },
                index: 0,
                splited: ['spg', 'test']
            };
            const rootNode = {
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
            };
            const actual = wheel_chief_1.WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode, new parser_1.ArgumentParser());
            assert.deepEqual(actual.command.args, [{ value: 'spg' }, { value: 'test' }]);
        });
        it("shouldn't parse out-range number", () => {
            const input = {
                command: {
                    args: [],
                    spuScript: '',
                    warning: ''
                },
                index: 0,
                splited: ['test', '233']
            };
            const rootNode = {
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
            };
            try {
                wheel_chief_1.WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode, new parser_1.ArgumentParser());
            }
            catch (_a) {
                return;
            }
            throw 'It parsed!';
        });
        it('should parse string', () => {
            const input = {
                command: {
                    args: [],
                    spuScript: '',
                    warning: ''
                },
                index: 0,
                splited: ['test', 'word', 'phrase', '"phrase', 'phrase"', 'g', 'r', 'e', 'e', 'd', 'y']
            };
            const rootNode = {
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
            };
            const actual = wheel_chief_1.WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode, new parser_1.ArgumentParser());
            assert.deepEqual(actual.command.args, [
                { value: 'test' },
                { value: 'word', updater: 'brigadier:string' },
                { value: 'phrase', updater: 'brigadier:string' },
                { value: '"phrase phrase"', updater: 'brigadier:string' },
                { value: 'g r e e d y', updater: 'brigadier:string' }
            ]);
        });
        it('should parse execute run', () => {
            const input = {
                command: {
                    args: [],
                    spuScript: '',
                    warning: ''
                },
                index: 0,
                splited: ['execute', 'run', 'execute', 'run', 'spg']
            };
            const rootNode = {
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
            };
            const actual = wheel_chief_1.WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode, new parser_1.ArgumentParser());
            assert.deepEqual(actual.command.args, [
                { value: 'execute' },
                { value: 'run' },
                { value: 'execute' },
                { value: 'run' },
                { value: 'spg' }
            ]);
        });
        it('should parse nbt', () => {
            const input = {
                command: {
                    args: [],
                    spuScript: '',
                    warning: ''
                },
                index: 0,
                splited: ['test', '{}', '{foo', ':', 'bar', '}', '{spg:rbq}']
            };
            const rootNode = {
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
            };
            const actual = wheel_chief_1.WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode, new parser_1.ArgumentParser());
            assert.deepEqual(actual.command.args, [
                { value: 'test' },
                { value: '{}', updater: 'minecraft:nbt' },
                { value: '{foo : bar }', updater: 'minecraft:nbt' },
                { value: '{spg:rbq}', updater: 'minecraft:nbt' }
            ]);
        });
        it('should store updater', () => {
            const input = {
                command: {
                    args: [],
                    spuScript: '',
                    warning: ''
                },
                index: 0,
                splited: ['test', '{foo:bar}']
            };
            const rootNode = {
                type: 'root',
                children: {
                    test: {
                        type: 'literal',
                        children: {
                            nbt: {
                                type: 'argument',
                                parser: 'minecraft:nbt',
                                updater: 'spgoding:entity_nbt',
                                executable: true
                            }
                        }
                    }
                }
            };
            const actual = wheel_chief_1.WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode, new parser_1.ArgumentParser());
            assert.deepEqual(actual.command.args, [
                { value: 'test' },
                { value: '{foo:bar}', updater: 'spgoding:entity_nbt' }
            ]);
        });
        it('should store spu script', () => {
            const input = {
                command: {
                    args: [],
                    spuScript: '',
                    warning: ''
                },
                index: 0,
                splited: ['test']
            };
            const rootNode = {
                type: 'root',
                children: {
                    test: {
                        type: 'literal',
                        executable: true,
                        spu_script: '$test%0'
                    }
                }
            };
            const actual = wheel_chief_1.WheelChief.parseCmdNode(input, 'N/A', rootNode, rootNode, new parser_1.ArgumentParser());
            assert.deepEqual(actual.command.args, [{ value: 'test' }]);
            assert(actual.command.spuScript === '$test%0');
        });
    });
});
//# sourceMappingURL=wheel_chief.js.map