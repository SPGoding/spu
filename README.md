# spu

![npm](https://img.shields.io/npm/v/npm.svg)
![GitHub top language](https://img.shields.io/github/languages/top/CommandBlockLogic/spu.svg)
![license](https://img.shields.io/github/license/CommandBlockLogic/spu.svg)

Also called 'spu'. An online tool that can help you update minecraft commands.

## How to Use

Type [https://spu.spgoding.com](https://spu.spgoding.com) in the web browser, or open the [./docs/index.html](https://github.com/CommandBlockLogic/spu/blob/master/docs/index.html) locally.

## File Structure

- `src`: Main typescript codes and a few jsx files under `./view/`.
- `js`: All compiled js files. Files in `/src/view/` will import js from this directory.
- `dist`: Temp directory.
- `docs`: The web page showed on https://spu.spgoding.com.

## How it Works

The *WheelChief* will try to parse your command(s) when you click 'Update'. All commands is stored in a `CmdNode`, whose format is very similiar to the format of the `commands.json` file that data generator provides:

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

## How to Contribute

1.  Fork this this repo and clone it to local.

2.  Install dependencies.

    `npm i`

3.  Edit files in `./src`.

4.  Build it.

    `npm run build`

5.  Send `Pull Request` to me.
