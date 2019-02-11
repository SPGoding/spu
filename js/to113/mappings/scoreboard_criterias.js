"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ScoreboardCriterias {
    static to113(input) {
        const arr = ScoreboardCriterias.Criteria112_Criteria113.find(v => v[0] === input);
        if (arr) {
            return arr[1];
        }
        else {
            return input;
        }
    }
}
ScoreboardCriterias.Criteria112_Criteria113 = [
    ['craftItem', 'crafted'],
    ['useItem', 'used'],
    ['breakItem', 'broken'],
    ['mineBlock', 'mined'],
    ['killEntity', 'killed'],
    ['pickup', 'picked_up'],
    ['drop', 'dropped'],
    ['entityKilledBy', 'killed_by']
];
exports.default = ScoreboardCriterias;
