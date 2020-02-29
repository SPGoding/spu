import { Tokenizer as NbtTokenizer } from './nbt/tokenizer'
import { Parser as NbtParser } from './nbt/parser'

/**
 * Return if a thing is numeric. Scientific notation IS supported.
 * @param num Any thing.
 */
export function isNumeric(num: any) {
    return !isNaN(parseFloat(num)) && isFinite(num)
}

export function isWhiteSpace(char: string) {
    return char === '' || [' ', '\t', '\n', '\r'].indexOf(char) !== -1
}

export type NbtFormat = 'before 1.12' | 'after 1.12' | 'after 1.14'

/**
 * Get an NbtCompound object from a string.
 */
export function getNbtCompound(str: string, version: NbtFormat = 'after 1.12') {
    const tokenizer = new NbtTokenizer()
    const tokens = tokenizer.tokenize(str, version)
    const parser = new NbtParser()
    const nbt = parser.parseCompounds(tokens, version)
    return nbt
}

/**
 * Get an NbtList object from a string.
 */
export function getNbtList(str: string, version: NbtFormat = 'after 1.12') {
    const tokenizer = new NbtTokenizer()
    const tokens = tokenizer.tokenize(str, version)
    const parser = new NbtParser()
    return parser.parseLists(tokens, version)
}

/**
 * Set the namespace to `minecraft:` if no namespace.
 * @param input A string.
 */
export function completeNamespace(input: string) {
    if (input.indexOf(':') === -1) {
        if (input.charAt(0) === '!') {
            input = `!minecraft:${input.slice(1)}`
        } else {
            input = `minecraft:${input}`
        }
    }

    return input
}

/**
 * Get UUIDMost and UUIDLeast froom a UUID pair.
 */
export function getUuidLeastUuidMost(uuid: string) {
    uuid = uuid.replace(/-/g, '')
    const uuidMost = parseInt(uuid.slice(0, 16), 16)
    const uuidLeast = parseInt(uuid.slice(16), 16)
    return { L: uuidLeast, M: uuidMost }
}

export interface UpdateResult {
    command: string,
    warnings: string[]
}

/**
 * For escape & unescape.
 *
 * @author pca006132
 */
export const escape = (str: string, quote: '"' | "'" = '"') =>
    quote === '"' ?
        str.replace(/([\\"])/g, '\\$1') :
        str.replace(/([\\'])/g, '\\$1')
export const unescape = (str: string) => str.replace(/\\([\\"'])/g, '$1')
