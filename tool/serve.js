const doPathMap = require('./pathMap')
const fs = require('fs')
const path = require('path')
const child_proces = require('child_process')
const { debounce } = require('lodash')
const http = require('http')
const {port, redirect, mimeMap} = require('./serve.config')

const distWatcher = debounce(() => doPathMap(), 400)
const srcWatcher = debounce(() => {
    child_proces.exec('tsc', (err, out) => {
        // console.log('reloaded');
    })
})

function rewriteUrl(url) {
    if (url === '/') {
        return redirect['/']
    }

    return path.join(redirect['*'].slice(0, -1), '.' + url)
}

function getMimeType(url) {
    const suffix = url.split('.').slice(-1)
    return mimeMap[suffix]
}

function startServer() {
    http.createServer((req, res) => {
        const filePath = rewriteUrl(req.url)
        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, (err, data) => {
                let mime
                if (mime = getMimeType(req.url)) {
                    res.setHeader('Content-Type', mime)
                }
                res.write(data)
                res.end()
            })
            return
        }
    
        res.writeHead(404)
        res.end()
    }).listen(port)

    console.log(`Serve at http://localhost:${port}`)
}

function startWatchFolderChange() {
    fs.watch(path.join(__dirname, '../dist'), { recursive: true }, distWatcher)
    fs.watch(path.join(__dirname, '../src'), { recursive: true }, srcWatcher)
    
    console.log('Start Watching')
}

startWatchFolderChange()
startServer()