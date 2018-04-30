export default class Formats {
    pairs = new Map()

    constructor() {
        let pairs = new Map([
        [
            'advancement grant %player only %string',
            'advancement grant %0 only %1'
        ], [
            'advancement grant %player only %string %string',
            'advancement grant %0 only %1 %2'
        ]
        ])

        this.pairs = pairs
    }
}