module.exports = [
	{
		input: './content/index.js',
		output: {
			dir: 'dist/content',
			format: 'iife',
			name: 'index.js'
		}
	},
	{
		input: './background/index.js',
		output: {
			dir: 'dist/background',
			format: 'iife',
			name: 'index.js'
		}
	}
]
