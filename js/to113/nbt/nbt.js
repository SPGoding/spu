"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils/utils");
class NbtString {
    constructor(value) {
        this.get = () => this.value;
        this.toString = () => `"${utils_1.escape(this.value)}"`;
        if (value !== undefined) {
            this.value = value;
        }
    }
    set(value) {
        this.value = value;
    }
}
exports.NbtString = NbtString;
class NbtByte {
    constructor(value) {
        this.get = () => this.value;
        this.toString = () => `${this.value}b`;
        if (value !== undefined) {
            this.value = value;
        }
    }
    set(value) {
        this.value = value;
    }
}
exports.NbtByte = NbtByte;
class NbtShort {
    constructor(value) {
        this.get = () => this.value;
        this.toString = () => `${this.value}s`;
        if (value !== undefined) {
            this.value = value;
        }
    }
    set(value) {
        this.value = value;
    }
}
exports.NbtShort = NbtShort;
class NbtInt {
    constructor(value) {
        this.get = () => this.value;
        this.toString = () => `${this.value}`;
        if (value !== undefined) {
            this.value = value;
        }
    }
    set(value) {
        this.value = value;
    }
}
exports.NbtInt = NbtInt;
class NbtLong {
    constructor(value) {
        this.get = () => this.value;
        this.toString = () => `${this.value}L`;
        if (value !== undefined) {
            this.value = value;
        }
    }
    set(value) {
        this.value = value;
    }
}
exports.NbtLong = NbtLong;
class NbtFloat {
    constructor(value) {
        this.get = () => this.value;
        if (value !== undefined) {
            this.value = value;
        }
    }
    set(value) {
        this.value = value;
    }
    toString() {
        if (parseInt(this.value.toString()) === parseFloat(this.value.toString())) {
            return `${this.value}.0f`;
        }
        else {
            return `${this.value}f`;
        }
    }
}
exports.NbtFloat = NbtFloat;
class NbtDouble {
    constructor(value) {
        this.get = () => this.value;
        if (value !== undefined) {
            this.value = value;
        }
    }
    set(value) {
        this.value = value;
    }
    toString() {
        if (parseInt(this.value.toString()) === parseFloat(this.value.toString())) {
            return `${this.value}.0d`;
        }
        else {
            return `${this.value}d`;
        }
    }
}
exports.NbtDouble = NbtDouble;
class NbtCompound {
    constructor() {
        this.value = new Map();
        this.get = (key) => this.value.get(key);
        this.del = (key) => this.value.delete(key);
    }
    set(key, val) {
        this.value.set(key, val);
    }
    toString() {
        let result = '{';
        for (const key of this.value.keys()) {
            const val = this.get(key);
            if (val) {
                result += `${key}:${val.toString()},`;
            }
        }
        if (result.length === 1) {
            result += '}';
        }
        else {
            result = result.slice(0, -1) + '}';
        }
        return result;
    }
    toJson() {
        let result = '{';
        for (const key of this.value.keys()) {
            const val = this.get(key);
            if (val && !(val instanceof NbtByte) && !(val instanceof NbtCompound)) {
                result += `"${key}":${val.toString()},`;
            }
            else if (val instanceof NbtByte) {
                result += `"${key}":${val.toString() === '0' ? 'false' : 'true'},`;
            }
            else if (val instanceof NbtCompound) {
                result += `"${key}":${val.toJson()},`;
            }
        }
        if (result.length === 1) {
            result += '}';
        }
        else {
            result = result.slice(0, -1) + '}';
        }
        return result;
    }
}
exports.NbtCompound = NbtCompound;
class NbtList {
    constructor() {
        this.value = [];
        this.get = (index) => this.value[index];
        this.forEach = this.value.forEach.bind(this.value);
    }
    get length() {
        return this.value.length;
    }
    set(index, val) {
        this.value[index] = val;
    }
    add(val) {
        this.value.push(val);
    }
    toString() {
        let result = '[';
        for (const val of this.value) {
            result += `${val.toString()},`;
        }
        if (result.length === 1) {
            result += ']';
        }
        else {
            result = result.slice(0, -1) + ']';
        }
        return result;
    }
    toJson() {
        let result = '[';
        for (const val of this.value) {
            if (val && !(val instanceof NbtByte) && !(val instanceof NbtCompound)) {
                result += `${val.toString()},`;
            }
            else if (val instanceof NbtByte) {
                result += `${val.toString() === '0' ? 'false' : 'true'},`;
            }
            else if (val instanceof NbtCompound) {
                result += `${val.toJson()},`;
            }
        }
        if (result.length === 1) {
            result += ']';
        }
        else {
            result = result.slice(0, -1) + ']';
        }
        return result;
    }
}
exports.NbtList = NbtList;
class NbtByteArray {
    constructor() {
        this.value = [];
        this.get = (index) => this.value[index];
    }
    add(val) {
        this.value.push(val);
    }
    toString() {
        let result = '[B;';
        for (const val of this.value) {
            result += `${val.toString()},`;
        }
        if (result.length === 1) {
            result += ']';
        }
        else {
            result = result.slice(0, -1) + ']';
        }
        return result;
    }
}
exports.NbtByteArray = NbtByteArray;
class NbtIntArray {
    constructor() {
        this.value = [];
        this.get = (index) => this.value[index];
    }
    add(val) {
        this.value.push(val);
    }
    toString() {
        let result = '[I;';
        for (const val of this.value) {
            result += `${val.toString()},`;
        }
        if (result.length === 1) {
            result += ']';
        }
        else {
            result = result.slice(0, -1) + ']';
        }
        return result;
    }
}
exports.NbtIntArray = NbtIntArray;
class NbtLongArray {
    constructor() {
        this.value = [];
        this.get = (index) => this.value[index];
    }
    add(val) {
        this.value.push(val);
    }
    toString() {
        let result = '[L;';
        for (const val of this.value) {
            result += `${val.toString()},`;
        }
        if (result.length === 1) {
            result += ']';
        }
        else {
            result = result.slice(0, -1) + ']';
        }
        return result;
    }
}
exports.NbtLongArray = NbtLongArray;
