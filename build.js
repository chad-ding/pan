const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const fse = require('fs-extra')
const chalk = require('chalk')

const manifest = require('./manifest.json')
const pkg = require('./package.json')

const dist = path.relative(__dirname, './dist')
fse.ensureDirSync(dist)
manifest.version = pkg.version

const watching = process.argv[2] === '--watch'

fs.writeFile(
	path.resolve(dist, './manifest.json'),
	JSON.stringify(manifest, null, 4),
	{ encoding: 'utf-8' },
	err => {
		if (err) {
			console.log(chalk.red('写入manifest失败'))
			console.log(chalk.red(err))
		} else {
			console.log(chalk.green('写入manifest成功'))
		}
	}
)

fs.cp(path.resolve(__dirname, './icon'), path.join(dist, './icon'), { recursive: true }, err => {
	if (err) {
		console.log(chalk.red('复制icon失败'))
		console.log(chalk.red(err))
	} else {
		console.log(chalk.green('复制icon成功'))
	}
})

exec('npx rollup -c rollup.config.js', (err, stdout) => {
	console.log(chalk.green(stdout))
	if (err) {
		console.log(chalk.red('编译content、background脚本失败'))
		console.log(chalk.red(err))
	} else {
		console.log(chalk.green('编译content、background脚本成功'))
	}
})

let command = 'npx vite build'
if (watching) {
	command += ' --watch'
}
exec(command, (err, stdout) => {
	console.log(chalk.green(stdout))
	if (err) {
		console.log(chalk.red('编译popup失败'))
		console.log(chalk.red(err))
	} else {
		console.log(chalk.green('编译popup成功'))
	}
})
