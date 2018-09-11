/*
 * This file DOES NOT belong to tests.
 * It is used to do some strange things.
 */

describe.skip('NOT A TEST', () => {
    it('Get all functions and types that spuses uses.', () => {
        let source = `<copied the source code in 'spuses.ts' here.>`

        let types: string[] | null
        let funcs: string[] | null

        types = source.match(/%[a-z_]+/g)
        funcs = source.match(/\$[a-zA-Z_]+/g)

        if (types && funcs) {
            types = unique(types)
            funcs = unique(funcs)

            console.log('===TYPES===')
            types.forEach(value => console.log(value))

            console.log('===FUNCS===')
            funcs.forEach(value => console.log(value))
        }
    })

    function unique(array: any[]) {
        return array
            .concat()
            .sort()
            .filter(function(item, index, array) {
                return !index || item !== array[index - 1]
            })
    }
})
