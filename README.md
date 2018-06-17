# Sweet Pragmatics Updater

![npm](https://img.shields.io/npm/v/npm.svg)
![GitHub top language](https://img.shields.io/github/languages/top/SPGoding/spu.svg)
![license](https://img.shields.io/github/license/SPGoding/spu.svg)

Also called 'spu'. An online tool that can help you convert minecraft commands from 1.12 to 1.13.

## How to Use

Type [https://spgoding.github.io/spu](https://spgoding.github.io/spu) in the web browser, or open the [./docs/index.html](https://github.com/SPGoding/spu/blob/master/docs/index.html) locally.

## How it Works

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

    ```typescript
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
