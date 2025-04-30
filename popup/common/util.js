export default {
	getCurrentTab() {
		return new Promise(resolve => {
			if (!chrome || !chrome.tabs) {
				resolve()
			}

			chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
				if (!tabs || !tabs.length) {
					resolve()
				}
				resolve(tabs[0])
			})
		})
	},
	formatDateTime(timestamp, pattern = 'yyyy-mm-dd HH:MM:SS') {
		const TOKEN = /d{1,2}|m{1,2}|yy(?:yy)?|([HMS])\1?|[L]|"[^"]*"|'[^']*'/g

		const date = timestamp instanceof Date ? timestamp : new Date(timestamp)

		if (!(date instanceof Date)) throw TypeError('无效的日期')

		const d = date.getDate()
		const m = date.getMonth()
		const y = date.getFullYear()
		const H = date.getHours()
		const M = date.getMinutes()
		const S = date.getSeconds()
		const L = date.getMilliseconds()

		const formatPadStart = (num, len = 2, pad = '0') => {
			const str = num.toString()
			return str.padStart(len, pad)
		}

		const flags = {
			d,
			dd: formatPadStart(d),
			m: m + 1,
			mm: formatPadStart(m + 1),
			yy: String(y).slice(2), // 1987 取 87
			yyyy: y,
			H,
			HH: formatPadStart(H),
			M,
			MM: formatPadStart(M),
			S,
			SS: formatPadStart(S),
			L: formatPadStart(L, 3)
		}

		return pattern.replace(TOKEN, function (match) {
			if (match in flags) {
				return flags[match]
			}
			return match.slice(1, match.length - 1)
		})
	},
	copy(text) {
		const textArea = document.createElement('textarea')
		textArea.innerText = text
		textArea.style.width = '0'
		textArea.style.height = '0'
		document.body.appendChild(textArea)

		textArea.select()
		document.execCommand('copy')
		document.body.removeChild(textArea)
	}
}
