import { NbtFormat } from '../utils';
/**
 * Provides methods to tokenize a nbt string.
 *
 * @author SPGoding
 */
export declare class Tokenizer {
    tokenize(nbt: string, version?: NbtFormat): Token[];
    private readAToken;
    private skipWhiteSpace;
    private readQuotedString;
    /**
     *
     * @param nbt
     * @param pos
     * @param version
     * @param unquotedDealingWay 0 - Doesn't allow colon
     *
     * 1 - Allow colon
     *
     * 2 - Allow colon after none numbers
     */
    private readUnquoted;
}
export declare type TokenType = 'BeginCompound' | 'EndCompound' | 'BeginList' | 'BeginByteArray' | 'BeginIntArray' | 'BeginLongArray' | 'EndListOrArray' | 'Colon' | 'Comma' | 'Thing' | 'String' | 'EndOfDocument';
export interface Token {
    type: TokenType;
    value: string;
}
export interface ReadTokenResult {
    token: Token;
    pos: number;
}
export interface ReadStringResult {
    str: string;
    pos: number;
}
