const path = require('path')

module.exports = {
    port: 5039,
    redirect: {
        '/': path.join(__dirname, './index.html'),
        '*': path.join(__dirname, '../dist/*')
    },
    mimeMap: {
        'js': 'application/javascript',
        'html': 'text/html',
        'css': 'text/css',
    
    },

}