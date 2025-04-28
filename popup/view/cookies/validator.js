export default {
	validField(key, value) {
		const cookieFields = [
			'name',
			'value',
			'domain',
			'path',
			'expirationDate',
			'hostOnly',
			'httpOnly',
			'sameSite',
			'secure',
			'session',
			'id',
			'storeId'
		]
		// cookie键消
		if (!cookieFields.includes(key)) {
			return false
		}

		let res
		switch (key) {
			case 'name':
				res = this.name(value)
				break
			case 'value':
				res = this.value(value)
				break
			case 'domain':
				res = this.domain(value)
				break
			case 'path':
				res = this.path(value)
				break
			case 'expirationDate':
				res = !isNaN(value)
				break
			case 'hostOnly':
			case 'httpOnly':
			case 'secure':
			case 'session':
				res = typeof value === 'boolean'
				break
			case 'id':
			case 'storeId':
				res = !isNaN(value)
				break
			case 'sameSite':
				res = ['lax', 'strict', 'none', 'unspecified'].includes(value.toLowerCase())
				break
			default:
				res = true
		}

		return res
	},
	name(data) {
		return /^[!#$%&'*+-.^_`|~0-9a-zA-Z]+$/i.test(data)
	},
	// cookie的值允许为空
	value(data) {
		if (data.trim() === '') {
			return true
		}

		return /^[!#$%&'()*+\-./0-9:<=>?@A-Z[\]^_`a-z{|}~]+$/i.test(data)
	},
	domain(data) {
		return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i.test(
			data
		)
	},
	path(data) {
		if (data === '/') {
			return true
		}

		return /^(\/[a-zA-Z0-9\-._~%!$&'()*+,;=:@]+)+\/?$/i.test(data)
	}
}
