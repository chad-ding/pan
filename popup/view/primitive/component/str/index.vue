<template>
	<el-form label-width="90">
		<el-form-item label="原始字符串">
			<el-input v-model="origin" type="textarea" :rows="5" resize="none" />
		</el-form-item>
		<el-form-item>
			<el-button-group>
				<el-button type="primary" @click="string2unicode">Unicode编码</el-button>
				<el-button type="success" @click="unicode2string">Unicode解码</el-button>
				<el-button type="primary" @click="string2hex">Hex编码</el-button>
				<el-button type="success" @click="hex2string">Hex解码 </el-button>
			</el-button-group>
		</el-form-item>
		<el-form-item label="编/解码结果">
			<el-card class="card" @click="copy">
				<p class="content">{{ result }}</p>
			</el-card>
		</el-form-item>
	</el-form>
</template>

<script>
import utf8 from 'utf8'
import { ElMessage } from 'element-plus'

import util from '@/common/util'

export default {
	data() {
		return {
			origin: '',
			result: ''
		}
	},
	methods: {
		string2hex() {
			const encoded = utf8.encode(this.origin)
			let result = ''
			for (let i = 0; i < encoded.length; i++) {
				result += encoded[i].charCodeAt(0).toString(16).padStart(2, '0')
			}

			this.result = result
		},
		hex2string() {
			let encoded = ''
			const str = this.origin
			for (let i = 0; i < str.length; i += 2) {
				encoded += String.fromCharCode(parseInt(str.slice(i, i + 2), 16))
			}

			this.result = utf8.decode(encoded)
		},
		string2unicode() {
			const str = this.origin
			let ret = ''
			let ustr = ''

			for (let i = 0; i < str.length; i++) {
				const code = str.charCodeAt(i)
				const code16 = code.toString(16)

				if (code < 0xf) {
					ustr = '\\u' + '000' + code16
				} else if (code < 0xff) {
					ustr = '\\u' + '00' + code16
				} else if (code < 0xfff) {
					ustr = '\\u' + '0' + code16
				} else {
					ustr = '\\u' + code16
				}
				ret += ustr
			}

			this.result = ret
		},
		unicode2string() {
			try {
				const json = JSON.parse('{"text": "' + this.origin + '"}')
				this.result = json.text
			} catch (e) {
				console.error('解码错误: ', e)

				ElMessage({
					message: 'Unicode解码错误',
					type: 'success'
				})
			}
		},
		copy() {
			if (!this.result.trim()) {
				return
			}
			util.copy(this.result)

			ElMessage({
				message: '复制成功',
				type: 'success'
			})
		}
	}
}
</script>

<style lang="less" scoped>
.card {
	width: 100%;

	.content {
		cursor: pointer;
		max-height: 180px;
		overflow-y: scroll;
		white-space: normal;
		width: 100%;
		word-wrap: break-word;
	}
}
</style>
