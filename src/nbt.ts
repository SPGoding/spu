import CharReader from './char_reader'
import { isWhiteSpace } from './char_reader'

/**
 * Represent a nbt.
 * Provides methods to operate it.
 * @author SPGoding
 */
export default class Nbt {
    private values: Map<string, NbtValue>

    constructor() {}
}

class NbtValue {
    private tag: NbtTag
    private value: string
}

enum NbtTag {
    long, 
}