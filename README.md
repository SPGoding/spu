# SPU

[![Build Status](https://travis-ci.com/SPGoding/spu.svg?branch=master)](https://travis-ci.com/SPGoding/spu)
![GitHub Top Language](https://img.shields.io/github/languages/top/SPGoding/spu.svg)
![License](https://img.shields.io/github/license/SPGoding/spu.svg)

*SPU* is believed to be the abbreviation of *SPU Performs Updating*. It's  npm package that provides method to update Minecraft commands.

## How to Use

0. Installation.
    ```Bash
    npm install spu
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
- `out`: Output JavaScript files.

## How it Works

The *WheelChief* system will try to parse your command(s) when you click 'Update'. All commands is stored in a `CmdNode`, whose format is very similiar to the format of the `commands.json` file that data generator provides:

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

e.g. You type `foobar @a {baz:qux}` and it can be parsed in the following nodes:

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

The WheelChief will update every argument according to its `updater`. All updaters are defined in `src/utils/wheel_chief/updater.ts` and `src/**to**/updater.ts`. After updating all arguments we will get this (well, it just adds some quotes):


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

Finally the `spu_script` will be executed. `%0` will be replaced with the first argument of the command(`args[0].value`), `%1` will be the second(`args[1].value`), and so on. A token that begins with `$` will be executed as a function with following `%n` as its parameter(s). So finally you will get `foobar @a[nbt={baz:"qux"}]`. Is that amazing?

## Contributing

I'm thrilled to hear that you'd like to contribute to this project. It's no doubt that spu will be better with your help!

Please note that this project is released with a [Contributor Code of Conduct](https://www.contributor-covenant.org/). By participating in this project you agree to abide by its terms.

1.  Fork this this repo and clone it to your local.

2.  Install dependencies.

    `npm i`

3.  Edit files in `./src`.

4.  If you add new features, it's strongly recommend to write tests for them. All tests should be put under `./src/test`.

5.  Commit and push your changes. There is some tips for the commit message:
    1. Begins with an emoji character, like `:sparkles:` and `:bug:`, see also [gitmoji](http://gitmoji.carloscuesta.me/).
    2. The first letter is expected to be uppercased.
    3. Use the basic form of verb as the first word.
    4. Ends the message with a period (`.`).
    e.g. `:bug:Fix a silly bug.`

6.  Send `Pull Request` to me. The travis-ci will build and test your changes automatically.

There must be lots of mistakes and bad practice in this repository. If you find something not good or not sure whether it's not good, please don't hesitate to tell me!
