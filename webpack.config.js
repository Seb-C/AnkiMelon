var path = require('path');

module.exports = {
    entry: {
        page: './src/page.js',
        background: './src/background.js'
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js'
    }
};
