import { UpdaterTo19 } from './to19/updater'
import { UpdaterTo111 } from './to111/updater'
import { UpdaterTo112 } from './to112/updater'
import { UpdaterTo113 } from './to113/updater'
import { UpdaterTo114 } from './to114/updater'
import { isWhiteSpace, UpdateResult } from './utils/utils';

function $(id: string) {
    return <HTMLElement>document.getElementById(id)
}

let from18 = $('from-18')
let from19 = $('from-19')
let from111 = $('from-111')
let from112 = $('from-112')
let from113 = $('from-113')
let to19 = $('to-19')
let to111 = $('to-111')
let to112 = $('to-112')
let to113 = $('to-113')
let to114 = $('to-114')
let info = $('info')
let from: '18' | '19' | '111' | '112' | '113' = '113'
let to: '19' | '111' | '112' | '113' | '114' = '114'

info.style.display = 'none'

$('button').onclick = () => {
    info.style.display = ''
    let number = 1
    let frame: 'success' | 'warning' | 'danger' = 'success'
    let msg = ''
    let ans = ''
    try {
        let timeBefore = (new Date()).getTime()
        let content = (<HTMLInputElement>$('input')).value
        if (content) {
            const lines = content.toString().split('\n')

            for (const line of lines) {
                number = lines.indexOf(line)

                let result: UpdateResult

                if (line[0] === '#' || isWhiteSpace(line)) {
                    result = { command: line, warnings: [] }
                } else {
                    if (to === '114') {
                        result = UpdaterTo114.upLine(line, from)
                    } else if (to === '113') {
                        result = UpdaterTo113.upLine(line, from)
                    } else if (to === '112') {
                        result = UpdaterTo112.upLine(line, from)
                    } else if (to === '111') {
                        result = UpdaterTo111.upLine(line, from)
                    } else if (to === '19') {
                        result = UpdaterTo19.upLine(line, from)
                    } else {
                        throw `Unknown to version: '${to}'.`
                    }
                }

                result.warnings = result.warnings.filter(v => !isWhiteSpace(v))

                if (result.warnings.length > 0) {
                    frame = 'warning'
                    msg += `Line #${number + 1}: <br />`
                    for (const warning of result.warnings) {
                        msg += `    ${warning}<br />`
                    }
                }
                ans += result.command + '\n'
            }

            ans = ans.slice(0, -1) // Remove the last line.
            const timeAfter = (new Date()).getTime()
            const timeDelta = timeAfter - timeBefore
            msg = `Updated ${lines.length} line${lines.length === 1 ? '' : 's'} (in ${(timeDelta / 1000).toFixed(3)} seconds).<br />${msg}`
        }
    } catch (ex) {
        frame = 'danger'
        msg = `Updated error. <br />Line #${number + 1}: ${ex}`
        ans = ''
    } finally {
        ; (<HTMLInputElement>$('output')).value = ans
        info.innerHTML = msg
        info.classList.replace('alert-success', `alert-${frame}`)
        info.classList.replace('alert-danger', `alert-${frame}`)
        info.classList.replace('alert-warning', `alert-${frame}`)
    }
}

function resetButtonClasses(type: 'from' | 'to') {
    if (type === 'from') {
        from18.classList.replace('btn-active', 'btn-default')
        from19.classList.replace('btn-active', 'btn-default')
        from111.classList.replace('btn-active', 'btn-default')
        from112.classList.replace('btn-active', 'btn-default')
        from113.classList.replace('btn-active', 'btn-default')
    } else {
        to19.classList.replace('btn-active', 'btn-default')
        to111.classList.replace('btn-active', 'btn-default')
        to112.classList.replace('btn-active', 'btn-default')
        to113.classList.replace('btn-active', 'btn-default')
        to114.classList.replace('btn-active', 'btn-default')
    }
}

function resetButtonVisibility() {
    to19.style.display = ''
    to111.style.display = ''
    to112.style.display = ''
    to113.style.display = ''
    to114.style.display = ''
}

function updateLocalStorage() {
    window.localStorage.setItem('from', from)
    window.localStorage.setItem('to', to)
}

let setFrom18 = from18.onclick = () => {
    resetButtonClasses('from')
    from18.classList.replace('btn-default', 'btn-active')

    resetButtonVisibility()

    from = '18'

    updateLocalStorage()
}
let setFrom19 = from19.onclick = () => {
    resetButtonClasses('from')
    from19.classList.replace('btn-default', 'btn-active')

    resetButtonVisibility()
    to19.style.display = 'none'

    from = '19'

    updateLocalStorage()
}
let setFrom111 = from111.onclick = () => {
    resetButtonClasses('from')
    from111.classList.replace('btn-default', 'btn-active')

    resetButtonVisibility()
    to19.style.display = 'none'
    to111.style.display = 'none'

    from = '111'

    updateLocalStorage()
}
let setFrom112 = from112.onclick = () => {
    resetButtonClasses('from')
    from112.classList.replace('btn-default', 'btn-active')

    resetButtonVisibility()
    to19.style.display = 'none'
    to111.style.display = 'none'
    to112.style.display = 'none'

    from = '112'

    updateLocalStorage()
}
let setFrom113 = from113.onclick = () => {
    resetButtonClasses('from')
    from113.classList.replace('btn-default', 'btn-active')

    resetButtonVisibility()
    to19.style.display = 'none'
    to111.style.display = 'none'
    to112.style.display = 'none'
    to113.style.display = 'none'

    from = '113'

    updateLocalStorage()
}
let setTo19 = to19.onclick = () => {
    resetButtonClasses('to')
    to19.classList.replace('btn-default', 'btn-active')
    to = '19'
    updateLocalStorage()
}
let setTo111 = to111.onclick = () => {
    resetButtonClasses('to')
    to111.classList.replace('btn-default', 'btn-active')
    to = '111'
    updateLocalStorage()
}
let setTo112 = to112.onclick = () => {
    resetButtonClasses('to')
    to112.classList.replace('btn-default', 'btn-active')
    to = '112'
    updateLocalStorage()
}
let setTo113 = to113.onclick = () => {
    resetButtonClasses('to')
    to113.classList.replace('btn-default', 'btn-active')
    to = '113'
    updateLocalStorage()
}
let setTo114 = to114.onclick = () => {
    resetButtonClasses('to')
    to114.classList.replace('btn-default', 'btn-active')
    to = '114'
    updateLocalStorage()
}

function applyLocalStorage() {
    let from = window.localStorage.getItem('from')
    let to = window.localStorage.getItem('to')

    if (!from) {
        from = '113'
    }
    if (!to) {
        to = '114'
    }

    switch (from) {
        case '18':
            setFrom18()
            break
        case '19':
            setFrom19()
            break
        case '111':
            setFrom111()
            break
        case '112':
            setFrom112()
            break
        case '113':
            setFrom113()
            break
        default:
            break
    }

    switch (to) {
        case '19':
            setTo19()
            break
        case '111':
            setTo111()
            break
        case '112':
            setTo112()
            break
        case '113':
            setTo113()
            break
        case '114':
            setTo114()
            break
        default:
            break
    }
}

applyLocalStorage()