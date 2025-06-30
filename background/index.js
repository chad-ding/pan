import http from './http'

chrome.runtime.onInstalled.addListener((...args) => {
	console.info('插件安装成功')

	http()
})
