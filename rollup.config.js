const { terser } = require('rollup-plugin-terser')

module.exports = [
	{
		input: './content/index.js',
		output: {
			dir: 'dist/content',
			format: 'iife',
			name: 'index.js'
		},
		plugins: [
			terser() // 使用terser进行压缩
		],
		watch: {
			include: 'content/**',
			exclude: 'node_modules/**',
			clearScreen: false // 可选，是否在重建时清屏
		}
	},
	{
		input: './background/index.js',
		output: {
			dir: 'dist/background',
			format: 'iife',
			name: 'index.js'
		},
		plugins: [
			terser() // 使用terser进行压缩
		],
		watch: {
			include: 'background/**',
			exclude: 'node_modules/**',
			clearScreen: false // 可选，是否在重建时清屏
		}
	}
]
