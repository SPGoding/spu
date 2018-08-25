export default class Spuses {
    public static pairs = new Map([
        [
            'scoreboard players operation %word %word \\%= %word %word', 
            'scoreboard players operation %0 %1 \\%= %2 %3\n' + 
            'execute if score %0 %1 matches ..0 run scoreboard players '
        ],
        ['%string', '%0']
    ])
}