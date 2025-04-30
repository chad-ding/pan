const { terser } = require('rollup-plugin-terser')
const { glob } = require('glob')

function getContentEntries() {
	const files = glob.sync('./content/*.js').reduce((entries, file) => {
		entries.push(file)
		return entries
	}, [])

	return files.map(item => ({
		input: item,
		output: {
			dir: 'dist/content',
			format: 'iife',
			name: '[name].js'
		},
		plugins: [
			terser() // 使用terser进行压缩
		]
	}))
}

module.exports = [
	...getContentEntries(),
	{
		input: './background/index.js',
		output: {
			dir: 'dist/background',
			format: 'iife',
			name: 'index.js'
		},
		plugins: [
			terser() // 使用terser进行压缩
		]
	}
]
