module.exports = {
	semi: false,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	arrowParens: 'avoid',
	useTabs: true,
	tabWidth: 4,
	overrides: [
		{
			files: ['**/*.css', '**/*.scss', '**/*.less'],
			options: {
				singleQuote: false
			}
		}
	]
}
