const exec = require('child_process').exec
const chalk = require('chalk')

const watching = process.argv[2] === '--watch'

let command = 'vite build'
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
