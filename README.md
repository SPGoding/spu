# SPU

[![CircleCI](https://circleci.com/gh/SPGoding/spu.svg?style=svg)](https://circleci.com/gh/SPGoding/spu)
[![npm](https://img.shields.io/npm/v/spu.svg?style=flat-square)](https://npmjs.com/package/spu)
[![License](https://img.shields.io/github/license/SPGoding/spu.svg?style=flat-square)](https://github.com/SPGoding/spu/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.carloscuesta.me/)


*SPU* is believed to be the abbreviation of *SPU Performs Updating*. It's a npm package that provides method to update Minecraft: Java Edition commands.

## Highlights

- Update commands from 1.8, 1.9(1.10), 1.11, 1.12, 1.13 and 1.14 to any later version.
- Support all commands.
- Support all kinds of parameters. e.g. NBT, entity selector.
- The author is still alive so if you find something not working as your intention, feel free to open an issue!

## Usage

You can use *SPU* to update your Minecraft commands via [the official website](https://spu.spgoding.com), the CLI (command line interface) or importing it to your project.

### Use it Online

Open [the official website](https://spu.spgoding.com).

The website is built with Angular and hosted on [GitHub](https://github.com/SPGoding/spu-angular).

That's all.

### Use the Command Line Interface

0. Installation.
    ```Bash
    npm i spu -g
    ```
1. Run the CLI through command `spu <from> <to>`.
    - `<from>`: The version of the input command. e.g. `12` stands for *Minecraft: Java Edition 1.12*. Should be one of the following values: `8`, `9`, `11`, `12` and `13`.
    - `<to>`: The version of the output command. e.g. `12` stands for *Minecraft: Java Edition 1.12*. Should be one of the following values:  `9`, `11`, `12`, `13` and `14`. Should be greater than `<from>`.
2. Type one of your commands and press *ENTER*, the CLI will return the updated result in real time.

I will enable the CLI to update whole mcfunction files if anyone requests. Feel free to open an issue!

### Import it to your Project

0. Installation.
    ```Bash
    npm i spu
    ```
1. Import.
    ```TypeScript
    import { update } from 'spu'
    ```
2. Update.
    ```TypeScript
    update(commands: string[], from: number, to: number) => { commands: string[], logs: string[], state: 'success' | 'warning' | 'error'}
    ```
    e.g.
    ```TypeScript
    update(['/kill'], 12, 13) // { commands: ['/kill @s'], ... }
    update(['setblock ~ ~ ~ minecraft:sign 0 replace'], 12, 14) // { commands: ['setblock ~ ~ ~ minecraft:oak_sign replace'], ... }
    ```

## File Structure

- `src`: Source code written in TypeScript.
- `lib`: Output JavaScript files.

## How does it work

The *WheelChief* system will try to parse your command(s) when you called 'update()'. All commands is stored in a `CmdNode`, whose format is very similiar to the format of the `commands.json` file that data generator provides:

```TypeScript
interface CmdNode {
    type: 'root' | 'literal' | 'argument'
    children?: { [nodeName: string]: CmdNode }
    parser?: string
    properties?: { [propertyName: string]: any }
    updater?: string
    executable?: boolean
    redirect?: string[]
    spu_script?: string
}
```

e.g. The input is `foobar @a {baz:qux}` and it can be parsed in the following nodes:

```TypeScript
{
    type: 'root',
    children: {
        foobar: {
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
                        nbt: {
                            type: 'argument',
                            parser: 'minecraft:nbt',
                            updater: 'spgoding:entity_nbt',
                            executable: true,
                            spu_script: '%0 $setNbtToSelector%1%2'
                        }
                    }
                }
            }
        }
    }
}
```

And then the WheelChief will return this (if no `updater` is specific in the `CmdNode`, the WheelChief will store its `parser` in `updater`):

```TypeScript
{
    command: {
        args: [
            { value: 'foobar', updater: undefined }, 
            { value: '@a', updater: 'minecraft:entity' }, 
            { value: '{baz:qux}', updater: 'spgoding:entity_nbt' }
        ],
        spu_script: '%0 $setNbtToSelector%1%2'
    },
    ...
}
```

The WheelChief will update every argument according to its `updater`. All updaters are defined in `src/utils/wheel_chief/updater.ts` and `src/**to**/updater.ts`. After updating all arguments we will get this (well, it just adds some quotes in this example):


```TypeScript
{
    command: {
        args: [
            { value: 'foobar', updater: undefined }, 
            { value: '@a', updater: 'minecraft:entity' }, 
            { value: '{baz:"qux"}', updater: 'spgoding:entity_nbt' }
        ],
        spu_script: '%0 $setNbtToSelector%1%2'
    },
    ...
}
```

Finally the `spu_script` will be executed. `%0` will be replaced with the first argument of the command(`args[0].value`), `%1` will be the second(`args[1].value`), and so on. A token that begins with `$` will be executed as a function with following `%n` as its parameter(s). So finally you will get `foobar @a[nbt={baz:"qux"}]`.

## Contributing

I'm thrilled to hear that you'd like to contribute to this project. It's no doubt that spu will be better with your help!

1.  Fork this this repo and clone it to your local.

2.  Install dependencies.

    `npm i`

3.  Edit files in `./src`.

4.  If you add new features, it's strongly recommend to write tests for them. All tests should be put under `./src/test`.

5.  Commit and push your changes.

6.  Open a Pull Request. The circle ci will build and test your changes automatically.

There must be lots of mistakes and bad practice in this repository. If you find something not good or not sure whether it's not good, please don't hesitate to tell me!
