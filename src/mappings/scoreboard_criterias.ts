export default class ScoreboardCriterias {
    public static to1_13(input: string) {
        const arr = ScoreboardCriterias.Criteria1_12_Criteria1_13.find(v => v[0] === input)
        if (arr) {
            return arr[1]
        } else {
            return input
        }
    }

    static Criteria1_12_Criteria1_13 = [
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
