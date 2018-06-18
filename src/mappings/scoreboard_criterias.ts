export default class ScoreboardCriterias {
    public static get1_13From1_12(input: string) {
        const arr = ScoreboardCriterias.Criteria_Criteria.find(v => v[0] === input)
        if (arr) {
            return arr[1]
        } else {
            return input
        }
    }

    static Criteria_Criteria: string[][] = [
        ['craftItem', 'crafted'],
        ['useItem', 'used'],
        ['breakItem', 'broken'],
        ['mineBlock', 'mined'],
        ['killEntity', 'killed'],
        ['pickup', 'picked_up'],
        ['drop', 'dropped'],
        ['entityKilledBy', 'killed_by']
    ]
}
