let currentHttpModifierRules = []

export default async () => {
	const rules = await chrome.declarativeNetRequest.getDynamicRules()
	console.log('初始化设置网络代理: ', rules)

	// 初始化HTTP修改规则
	await updateHttpModifierRules([])
}

// 更新HTTP修改规则
export async function updateHttpModifierRules(rules) {
	currentHttpModifierRules = rules || []

	// 移除旧的HTTP修改规则
	const existingRules = await chrome.declarativeNetRequest.getDynamicRules()
	const httpModifierRuleIds = existingRules
		.filter(rule => rule.id >= 1000 && rule.id < 2000) // HTTP修改规则ID范围
		.map(rule => rule.id)

	// 构建新的HTTP修改规则
	const newRules = []
	let ruleId = 1000

	currentHttpModifierRules.forEach(rule => {
		if (rule.modifyType === 'requestHeader') {
			// 请求头修改规则
			newRules.push({
				id: ruleId++,
				priority: rule.priority || 1,
				action: {
					type: 'modifyHeaders',
					requestHeaders: [
						{
							header: rule.target,
							operation: rule.operation === 'remove' ? 'remove' : 'set',
							value: rule.operation === 'remove' ? undefined : rule.value
						}
					]
				},
				condition: {
					urlFilter: rule.urlPattern,
					resourceTypes: [
						'main_frame',
						'sub_frame',
						'stylesheet',
						'script',
						'image',
						'font',
						'object',
						'xmlhttprequest',
						'ping',
						'csp_report',
						'media',
						'websocket',
						'other'
					]
				}
			})
		} else if (rule.modifyType === 'responseHeader') {
			// 响应头修改规则
			newRules.push({
				id: ruleId++,
				priority: rule.priority || 1,
				action: {
					type: 'modifyHeaders',
					responseHeaders: [
						{
							header: rule.target,
							operation: rule.operation === 'remove' ? 'remove' : 'set',
							value: rule.operation === 'remove' ? undefined : rule.value
						}
					]
				},
				condition: {
					urlFilter: rule.urlPattern,
					resourceTypes: [
						'main_frame',
						'sub_frame',
						'stylesheet',
						'script',
						'image',
						'font',
						'object',
						'xmlhttprequest',
						'ping',
						'csp_report',
						'media',
						'websocket',
						'other'
					]
				}
			})
		} else if (rule.modifyType === 'requestUrl') {
			// 请求URL重定向规则
			newRules.push({
				id: ruleId++,
				priority: rule.priority || 1,
				action: {
					type: 'redirect',
					redirect: {
						url: rule.value
					}
				},
				condition: {
					urlFilter: rule.urlPattern,
					resourceTypes: [
						'main_frame',
						'sub_frame',
						'stylesheet',
						'script',
						'image',
						'font',
						'object',
						'xmlhttprequest',
						'ping',
						'csp_report',
						'media',
						'websocket',
						'other'
					]
				}
			})
		}
	})

	// 更新规则
	await chrome.declarativeNetRequest.updateDynamicRules({
		removeRuleIds: httpModifierRuleIds,
		addRules: newRules
	})

	console.log('HTTP修改规则已更新:', newRules)
}

// 处理来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'UPDATE_HTTP_MODIFIER_RULES') {
		updateHttpModifierRules(message.rules)
		sendResponse({ success: true })
	}
})
