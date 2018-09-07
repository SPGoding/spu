/**
 * Providing a map storing old spus and new spus.
 */
export default class Spuses {
    /**
     * =====TYPES=====
     * %entity
     * %int
     * %item
     * %literal
     * %vec_3
     * %word
     */
    static pairs = new Map([
        ['clear', 'clear'],
        ['clear %entity', 'clear %0'],
        ['clear %entity %item', 'clear %0 %1'],
        ['clear %entity %item %int', 'clear %0 %1 %2'],
        ['clone %vec_3 %vec_3 %vec_3', 'clone %0 %1 %2'],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['', ''],
        ['%string', '%0'],
    ])
}
