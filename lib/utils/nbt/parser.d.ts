import { Token } from './tokenizer';
import { NbtFormat } from '../utils';
import { NbtCompound, NbtList } from './nbt';
/**
 * Provides methods to parse a NBT tokens list.
 *
 * @author SPGoding
 */
export declare class Parser {
    parseCompounds(tokens: Token[], version?: NbtFormat): NbtCompound;
    parseLists(tokens: Token[], version?: NbtFormat): NbtList;
    /**
     * @returns {pos: the index of the closed square, value: parsed Value object}
     */
    private parseCompound;
    private parseList;
    private parseByteArray;
    private parseIntArray;
    private parseLongArray;
    /**
     * Parses a set of tokens of a value object.
     * Supports Thing, String, BeginCompound, BeginByteArray, BeginIntArray, BeginList and BeginLongArray.
     * @param tokens A list of tokens.
     * @param pos The beginning index.
     */
    private parseValue;
    private parseThing;
    private parseString;
    private parseByte;
    private parseShort;
    private parseInt;
    private parseLong;
    private parseFloat;
    private parseDouble;
}
