import { update } from '.'
import * as readline from 'readline'

const from = parseInt(process.argv.slice(-2)[0])
const to = parseInt(process.argv.slice(-2)[1])

console.log(`> Update commands from 1.${from} to 1.${to}.`)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
})

rl.on('line', function (input) {
    const result = update([input], from, to)
    if (result.state === 'success') {
        result.logs.forEach(log => console.log(`> ${log}`))
        console.log(`> ${result.commands[0]}`)
    } else if (result.state === 'warning') {
        result.logs.forEach(log => console.warn(`> ${log}`))
        console.log(`> ${result.commands[0]}`)
    } else {
        result.logs.forEach(log => console.error(`> ${log}`))
    }
})
