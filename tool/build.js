const map = require('./pathMap')
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

child_process.exec('npx tsc')
map()

fs.cpSync(
    path.resolve(__dirname, './index.html'),
    path.resolve(__dirname, '../dist/index.html')
)