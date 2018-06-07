export type NbtValue =
    | NbtCompound
    | NbtList
    | NbtByteArray
    | NbtIntArray
    | NbtLongArray
    | NbtByte
    | NbtShort
    | NbtInt
    | NbtLong
    | NbtFloat
    | NbtDouble
    | NbtString

export class NbtString {
    private value: string

    public get = () => this.value

    public toString = () => `"${this.value}"`
}

export class NbtByte {
    private value: number

    public get = () => this.value

    public toString = () => `${this.value}b`
}

export class NbtShort {
    private value: number

    public get = () => this.value

    public toString = () => `${this.value}s`
}

export class NbtInt {
    private value: number

    public get = () => this.value

    public toString = () => `${this.value}`
}

export class NbtLong {
    private value: number

    public get = () => this.value

    public toString = () => `${this.value}L`
}

export class NbtFloat {
    private value: number

    public get = () => this.value

    public toString = () => `${this.value}f`
}

export class NbtDouble {
    private value: number

    public get = () => this.value

    public toString = () => `${this.value}d`
}

export class NbtCompound {
    private values: Map<string, NbtValue>

    public get = (key: string) => this.values.get(key)

    public set(key: string, val: NbtValue) {
        this.values.set(key, val)
    }

    public toString() {
        let result = '{'

        for (const key of this.values.keys()) {
            const val = this.get(key)
            if (val) {
                result += `${key}:${val.toString()},`
            }
        }

        result = result.slice(0, -1) + '}'
    }
}

export class NbtList {
    private values: NbtValue[]

    public get = (index: number) => this.values[index]

    public toString() {
        let result = '['

        for (const val of this.values) {
            result += `${val.toString()},`
        }

        result = result.slice(0, -1) + ']'
    }
}

export class NbtByteArray {
    private values: NbtByte[]

    public get = (index: number) => this.values[index]

    public toString() {
        let result = '[B;'

        for (const val of this.values) {
            result += `${val.toString()},`
        }

        result = result.slice(0, -1) + ']'
    }
}

export class NbtIntArray {
    private values: NbtInt[]

    public get = (index: number) => this.values[index]

    public toString() {
        let result = '[I;'

        for (const val of this.values) {
            result += `${val.toString()},`
        }

        result = result.slice(0, -1) + ']'
    }
}

export class NbtLongArray {
    private values: NbtLong[]

    public get = (index: number) => this.values[index]

    public toString() {
        let result = '[L;'

        for (const val of this.values) {
            result += `${val.toString()},`
        }

        result = result.slice(0, -1) + ']'
    }
}
