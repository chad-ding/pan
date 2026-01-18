const js = require('@eslint/js')
const globals = require('globals')
const eslintParser = require('@babel/eslint-parser')
const eslintPretterPlugin = require('eslint-plugin-prettier')
const vuePlugin = require('eslint-plugin-vue')
const vueParser = require('vue-eslint-parser')

module.exports = [
	// 忽略文件配置
	{
		ignores: ['node_modules/', 'dist/', 'test/', 'coverage/']
	},
	// Vue 文件配置
	{
		files: ['**/*.vue'],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: eslintParser,
				requireConfigFile: false,
				ecmaVersion: 'latest',
				sourceType: 'module'
			},
			globals: { ...globals.browser, ...globals.node },
			babelOptions: {
				presets: ['@babel/preset-env']
			}
		},
		plugins: {
			vue: vuePlugin
		},
		rules: {
			...js.configs.recommended.rules,
			...vuePlugin.configs['flat/base'].rules,
			...vuePlugin.configs['vue3-recommended'].rules,
			...vuePlugin.configs['vue3-strongly-recommended'].rules,
			...vuePlugin.configs['vue3-essential'].rules,
			'vue/multi-word-component-names': 'off',
			'vue/comment-directive': 'off',
			'vue/html-indent': 'off',
			'vue/max-attributes-per-line': 'off',
			'vue/require-default-prop': 'off',
			'vue/html-closing-bracket-newline': 'off',
			'vue/html-self-closing': [
				'error',
				{
					html: {
						void: 'always',
						normal: 'always',
						component: 'always'
					},
					svg: 'always',
					math: 'always'
				}
			]
		}
	},
	// 基础 JavaScript 配置
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: eslintParser,
			parserOptions: {
				requireConfigFile: false,
				babelOptions: {
					babelrc: false,
					configFile: false,
					presets: ['@babel/preset-env']
				}
			},
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2020,
				...globals.webextensions
			}
		},
		plugins: {
			prettier: eslintPretterPlugin
		},
		rules: {
			...js.configs.recommended.rules,
			'prettier/prettier': [
				'error',
				{
					singleQuote: true,
					semi: false
				}
			],
			'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
			'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
		}
	}
]
