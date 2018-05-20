# Sweet Pragmatics Updater

Also called 'SPU'. An online tool that can help you convert minecraft commands from 1.12 to 1.13.

## How to Use

Type [https://spgoding.github.io/spu](https://spgoding.github.io/spu) in the web browser, or open the [./docs/index.html](https://github.com/SPGoding/spu/blob/master/docs/index.html) locally.

## How it Works

When you click the "Convert" button, `cvtLine()` from `./converter.ts` will be called. This method will do the following things:

1.  Match each command with a _spu script_ defined in `Spuses.pairs.keys()` from `./spuses.ts`.

2.  Each command will be parsed into an _result map_ which stores all converted values according to a matched _spu script_.

    For example, a command

    ```
    entitydata @e[type=armor_stand,r=5] {CustomName:"hhh"}
    ```

    will be parsed according to a _spu script_

    ```
    entitydata %entity %nbt
    ```

    into an _result map_

    ```typescript
    {
        '%0': '@e[sort=nearest,type=armor_stand,distance=..5]',
        '%1': '{CustomName:"[\\"hhh\\"]"}'
    }
    ```

3.  Combine the _result map_ with a _spu script_ defined in `Spuses.pairs.values()` from `./spuses.ts`.

    For example, the _result map_ in last step, will be combined with this spu script

    ```
    data merge entity %0$setLimitTo1 %1
    ```

    So we'll get this

    ```
    data merge entity @e[type=armor_stand,distance=..5]$setLimitTo1 {CustomName:"[\"hhh\"]"}
    ```

4.  Excute the _spu scrpt_.

    For example, the result of last step contains `$setLimitTo1` which is called _spu script method_. We'll execute this method and get this

    ```
    data merge entity @e[type=armor_stand,distance=..5,limit=1] {CustomName:"[\"hhh\"]"}
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
