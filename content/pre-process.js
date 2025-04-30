const printLicence = () => {
	const brand = `▗▄▄▖  ▗▄▖ ▗▖  ▗▖
▐▌ ▐▌▐▌ ▐▌▐▛▚▖▐▌
▐▛▀▘ ▐▛▀▜▌▐▌ ▝▜▌
▐▌   ▐▌ ▐▌▐▌  ▐▌`

	let msg = '********************************************\n'
	msg += brand + '\n\n'
	msg += '作者: Chad.Ding\n'
	msg += '版本: ' + process.env.VERSION + '\n'
	msg += '编译时间: ' + process.env.BUILD_DATE + '\n'
	msg += '********************************************'

	console.log(msg)
}

const boot = () => {
	printLicence()
}

boot()
