import CharReader from './char_reader'
import { isWhiteSpace } from './char_reader'

/**
 * Represent a nbt.
 * Provides methods to operate it.
 * @author SPGoding
 */
export default class Nbt {
	private tag: NbtTag
    private value: any

    constructor() {}
    
    parse(nbt: string) {
        let charReader = new CharReader(nbt)
        
    }
}

enum NbtTag {
    Byte,
    Short,
    Int,
    Long,
    Float,
    Double,
    String,
    ByteArray,
    IntArray,
    LongArray,
    List,
    Compound
}