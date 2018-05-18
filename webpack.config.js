var path = require('path');

module.exports = {
	resolve: {
		extensions: ['.ts', '.js', '.tsx', '.jsx'],
        alias: {
            'react': 'react-lite',
            'react-dom': 'react-lite'
        }
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			}
		]
	},
	entry: {
		page: './src/page.ts',
		background: './src/background.ts',
		options: './src/options.tsx',
	},
	output: {
		path: path.resolve(__dirname, './build'),
		filename: '[name].js',
	}
};
