import { Token } from './tokenizer';
import { NbtFormat } from '../../utils/utils';
import { NbtCompound, NbtList } from './nbt';
export declare class Parser {
    parseCompounds(tokens: Token[], version?: NbtFormat): NbtCompound;
    parseLists(tokens: Token[], version?: NbtFormat): NbtList;
    private parseCompound;
    private parseList;
    private parseByteArray;
    private parseIntArray;
    private parseLongArray;
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
