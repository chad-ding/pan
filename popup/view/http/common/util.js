import storage from '@/common/storage'
import { STORAGE_KEY } from './consts'

export async function saveRules(rulesList) {
	await storage.set(STORAGE_KEY, rulesList)
	// 通知background脚本更新规则
	chrome.runtime.sendMessage({
		type: 'UPDATE_HTTP_MODIFIER_RULES',
		rules: this.rulesList.filter(rule => rule.active)
	})
}
