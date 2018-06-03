/**
 * Returns if a thing is numeric. Scientific notation is NOT supported.
 * @param num Any thing.
 */
export function isNumeric(num: any) {
    return !isNaN(parseFloat(num)) && isFinite(num)
}
