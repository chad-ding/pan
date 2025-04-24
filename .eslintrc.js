module.exports = {
	root: true,
	extends: ['./.eslint-config.js'],
	globals: {
		chrome: true
	},
	rules: {
		'no-new-func': 'off',
		'no-prototype-builtins': 'off',
		'vue/no-multiple-template-root': 'off'
	}
}
