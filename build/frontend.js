const path = require('path')
const exec = require('child_process').exec
const fse = require('fs-extra')
const chalk = require('chalk')

const dist = path.relative(__dirname, '../dist')
fse.ensureDirSync(dist)

const watching = process.argv[2] === '--watch'

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
