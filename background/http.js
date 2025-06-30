export default async () => {
	const rules = await chrome.declarativeNetRequest.getDynamicRules()
	console.log('初始化设置网络代理: ', rules)

	// 添加请求头规则
	chrome.declarativeNetRequest.updateDynamicRules({
		removeRuleIds: [1, 2],
		addRules: []
	})
}
