<template>
	<el-form label-width="92">
		<el-form-item label="编/解码方式:">
			<el-radio-group v-model="type">
				<el-radio value="uri">URIComponent</el-radio>
				<el-radio value="unicode">Unicode</el-radio>
				<el-radio value="hex">Hex</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="字符串:">
			<el-input
				v-model="origin"
				placeholder="请输入字符串"
				type="textarea"
				:rows="5"
				resize="none"
			/>
		</el-form-item>
		<el-form-item>
			<el-button-group>
				<el-button type="primary" @click="onEncode">编码</el-button>
				<el-button type="success" @click="onDecode">解码</el-button>
			</el-button-group>
		</el-form-item>
	</el-form>
	<el-divider />
	<div class="content">
		<el-card class="card" @click="copy">
			<p class="result">{{ result }}</p>
		</el-card>
	</div>
</template>

<script>
import utf8 from 'utf8'
import { ElMessage } from 'element-plus'
import util from '@/common/util'

export default {
	data() {
		return {
			type: 'uri',
			origin: '',
			result: ''
		}
	},
	methods: {
		onEncode() {
			const origin = this.origin.trim()
			if (!origin) {
				return
			}

			const type = this.type
			if (type === 'uri') {
				this.encodeURI(origin)
			} else if (type === 'unicode') {
				this.string2unicode(origin)
			} else {
				this.string2hex(origin)
			}
		},
		onDecode() {
			const origin = this.origin.trim()
			if (!origin) {
				return
			}

			const type = this.type
			if (type === 'uri') {
				this.decodeURI(origin)
			} else if (type === 'unicode') {
				this.unicode2string(origin)
			} else {
				this.hex2string(origin)
			}
		},
		encodeURI(text) {
			this.result = encodeURIComponent(text)
		},
		decodeURI(text) {
			this.result = decodeURIComponent(text)
		},
		string2hex(text) {
			const encoded = utf8.encode(text)
			let result = ''
			for (let i = 0; i < encoded.length; i++) {
				result += encoded[i].charCodeAt(0).toString(16).padStart(2, '0')
			}

			this.result = result
		},
		hex2string(text) {
			try {
				let encoded = ''
				for (let i = 0; i < text.length; i += 2) {
					encoded += String.fromCharCode(parseInt(text.slice(i, i + 2), 16))
				}

				this.result = utf8.decode(encoded)
			} catch (e) {
				console.error('Hex解码错误: ', e)
				ElMessage({
					message: 'Hex解码错误',
					type: 'error'
				})
			}
		},
		string2unicode(text) {
			let ret = ''
			let ustr = ''

			for (let i = 0; i < text.length; i++) {
				const code = text.charCodeAt(i)
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
		unicode2string(text) {
			try {
				const json = JSON.parse('{"text": "' + text + '"}')
				this.result = json.text
			} catch (e) {
				console.error('解码错误: ', e)

				ElMessage({
					message: 'Unicode解码错误',
					type: 'error'
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
.content {
	padding: 0 4px;
}

.card {
	width: 100%;

	.result {
		cursor: pointer;
		font-size: 14px;
		line-height: 20px;
		max-height: 180px;
		overflow-y: scroll;
		white-space: normal;
		width: 100%;
		word-wrap: break-word;
	}
}
</style>
