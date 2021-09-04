const fs = require('fs');

console.log('Hi from the callback queue');

fs.readFile('./application.js', {}, () => {
    console.log("fs1")
    setImmediate(() => {
        console.log("fs 1/ setImmediate ")
        Promise.resolve().then(() => {
            console.log("fs 1/ setImmediate/ Promise")
        })
        setImmediate(() => {
            console.log("fs 1/setImmediate 2")
        })
        setTimeout(() => {
            console.log("fs 1/setTimeout 2")
        }, 500)
        process.nextTick(() => {
            console.log("fs 1/process.nextTick")
        })
    })
    setTimeout(() => {
        console.log('fs 1/setTimeout ')
        Promise.resolve().then(() => {
            console.log("fs 1/setTimeout/ Promise")
        })
    }, 1000)
})
fs.readFile('./application.js', {}, () => {
    console.log('fs2')
    setImmediate(() => {
        console.log('fs 2/setImmediate')
    })
    setTimeout(() => {
        console.log('fs 2/setTimeout')
    }, 1500)
    setTimeout(() => {
        process.on('exit', (code) => {
            console.log(`close callback`);
        });
    }, 1100)
})

