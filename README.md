# spu

![npm](https://img.shields.io/npm/v/npm.svg)
![GitHub top language](https://img.shields.io/github/languages/top/CommandBlockLogic/spu.svg)
![license](https://img.shields.io/github/license/CommandBlockLogic/spu.svg)

Also called 'spu'. An online tool that can help you convert minecraft commands from 1.12 to 1.13.

## How to Use

Type [https://spgoding.github.io/spu](https://spgoding.github.io/spu) in the web browser, or open the [./docs/index.html](https://github.com/CommandBlockLogic/spu/blob/master/docs/index.html) locally.

## How it Works

### After 112to113

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

### Before 111to112 (bad_practice)

When you click the "Convert" button, `cvtLine()` from `./converter.ts` will be called. This method will do the following things:

1.  Match each command with a _spu script_ defined in `Spuses.pairs.keys()` from `./spuses.ts`.

2.  Each command will be parsed into an _result map_ which stores all converted values according to a matched _spu script_.

    For example, a command

    ```
    advancement test @p[score_foo=10] minecraft:story/root
    ```

    will be parsed according to a _spu script_

    ```
    advancement test %entity %adv
    ```

    into an _result map_

    ```TypeScript
    {
        '%0': '@p[scores={foo=..10}]',
        '%1': 'minecraft:story/root'
    }
    ```

3.  Combine the _result map_ with a _spu script_ defined in `Spuses.pairs.values()` from `./spuses.ts`.

    For example, the _result map_ in last step, will be combined with this spu script

    ```
    execute if entity %0$addAdvToEntity%1
    ```

    So we'll get this

    ```
    execute if entity @p[scores={foo=..10}]$addAdvToEntityminecraft:story/root
    ```

4.  Execute the _spu scrpt_.

    For example, the result of last step contains `$addAdvToEntity` which is called _spu script method_. We'll execute this method and get this

    ```
    execute if entity @p[scores={foo=..10},advancements={minecraft:story/root=true}]
    ```

5.  **Congratulations!**

## How to Contribute

1.  Fork this this repo and clone it to local.

2.  Install dependencies.

    `npm i`

3.  Edit files in `./src`.

4.  Build it.

    `npm run build`

5.  Send `Pull Request` to me.
