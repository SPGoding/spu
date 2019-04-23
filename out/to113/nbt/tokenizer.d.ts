import { NbtFormat } from '../../utils/utils';
export declare class Tokenizer {
    tokenize(nbt: string, version?: NbtFormat): Token[];
    private readAToken;
    private skipWhiteSpace;
    private readQuotedString;
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
