import util from './util'

const StorageKey = '__PanStore__'

export default {
	async get(key, session = false) {
		if (typeof key !== 'string') {
			console.error('key必须是一个字符串')
			return
		}

		const currentTab = await util.getCurrentTab()

		return new Promise(resolve => {
			chrome.scripting.executeScript(
				{
					target: { tabId: currentTab.id },
					args: [key, StorageKey, session],
					func: (key, StorageKey, session) => {
						const storage = session ? sessionStorage : localStorage
						const res = storage.getItem(StorageKey)

						if (!res) {
							return undefined
						}

						try {
							const data = JSON.parse(res)

							return data[key]
						} catch (e) {
							console.error('解析本地缓存失败: ', e.message)
							return undefined
						}
					}
				},
				results => {
					if (!results) {
						resolve(undefined)
					}

					const data = results[0]?.result
					resolve(data)
				}
			)
		})
	},
	async set(key, value, session = false) {
		if (typeof key !== 'string') {
			console.error('key必须是一个字符串')
			return false
		}

		if (!util.isPrimitiveType(value)) {
			console.error('value必须是一个原始类型:undefined/null/string/number/boolean')
			return false
		}

		const currentTab = await util.getCurrentTab()

		return new Promise(resolve => {
			chrome.scripting.executeScript(
				{
					target: { tabId: currentTab.id },
					args: [key, value, StorageKey, session],
					func: (key, value, StorageKey, session) => {
						const storage = session ? sessionStorage : localStorage
						const res = storage.getItem(StorageKey)

						try {
							if (!res) {
								const item = Object.create(null)
								item[key] = value
								storage.setItem(StorageKey, JSON.stringify(item))

								return true
							}

							const data = JSON.parse(res)
							data[key] = value
							storage.setItem(StorageKey, JSON.stringify(data))

							return true
						} catch (e) {
							console.error('保存本地缓存失败: ', e.message)
							return false
						}
					}
				},
				results => {
					const data = results[0]?.result
					resolve(data)
				}
			)
		})
	}
}
