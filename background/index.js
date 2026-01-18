import http from './http'

chrome.runtime.onInstalled.addListener(() => {
	console.info('插件安装成功')

	http()
})
