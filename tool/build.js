const map = require('./pathMap')
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

child_process.exec('tsc')
map()

fs.copyFileSync(
    path.resolve(__dirname, './index.html'),
    path.resolve(__dirname, '../dist')
)