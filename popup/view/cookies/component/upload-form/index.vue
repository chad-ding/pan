<template>
	<el-form ref="form" :model="formFields" :rules="formRules" label-width="auto">
		<el-form-item label="Cookies" prop="cookies">
			<el-input
				v-model.trim="formFields.cookies"
				:placeholder="placeholder"
				type="textarea"
				:rows="15"
				resize="none"
			/>
		</el-form-item>
		<el-form-item label="Domain" prop="domain">
			<el-input v-model.trim="formFields.domain" size="small" />
		</el-form-item>
		<el-form-item label="Session" prop="session">
			<el-checkbox v-model="formFields.session" size="small" />
			<p class="note">非Session设置30天的过期时间</p>
		</el-form-item>
		<el-form-item v-if="!disabled">
			<el-button size="small" type="primary" @click="onConfirm">确认</el-button>
			<el-button size="small" @click="onCancel">取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import { ElMessage } from 'element-plus'
import validator from '../../validator'

const placeholder = `支持导入Cookie键值对字符串：“name=Chad.Ding; gender=M”，或是完整JSON结构的Cookie列表：
[{
	"domain": ".pan.com",
	"expirationDate": 1780370619.889841,
	"httpOnly": false,
	"name": "name",
	"path": "/",
	"value": "Chad.Ding"
},{
	"domain": ".pan.com",
	"expirationDate": 1780370619.889841,
	"httpOnly": false,
	"name": "gender",
	"path": "/",
	"value": "M"
}]"`

export default {
	props: {
		currentDomain: {
			type: String,
			default: undefined
		},
		currentUrl: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			formFields: {
				cookies: '',
				domain: this.currentDomain,
				session: false
			},
			formRules: {
				cookies: [
					{ required: true, message: '请输入Cookie内容', trigger: 'blur' },
					{
						trigger: 'change',
						validator(rule, value, callback) {
							const validateJson = content => {
								const valid = content.every(item => {
									const entries = Object.entries(item)
									return entries.every(([key, value]) => {
										return validator.validField(key, value)
									})
								})

								if (valid) {
									callback()
								} else {
									callback(new Error('输入的Cookie内容无效'))
								}
							}

							const validateString = content => {
								const contents = content.split(';')

								const invalidCookie = []
								const valid = contents.every(item => {
									const [name, value] = item.trim().split('=')

									const validName = validator.name(name.trim())
									const validValue = validator.value(value.trim())

									if (!validName || !validValue) {
										invalidCookie.push(name)
									}

									return validName && validValue
								})

								if (valid) {
									callback()
								} else {
									const msg = `以下Cookie的名称或值无效：${invalidCookie.join(
										','
									)}`

									callback(new Error(msg))
								}
							}
							try {
								const content = JSON.parse(value)
								validateJson(content)
							} catch (e) {
								console.log('输入Cookie字符串')
								validateString(value)
							}
						}
					}
				],
				domain: [
					{
						trigger: 'change',
						validator(rule, value, callback) {
							if (!validator.domain(value)) {
								callback(new Error('Domain不合法'))
							}

							callback()
						}
					}
				]
			},
			placeholder
		}
	},
	methods: {
		async onConfirm() {
			const form = this.$refs.form
			await form.validate()

			let cookies
			try {
				cookies = JSON.parse(this.formFields.cookies)
			} catch (e) {
				cookies = this.formFields.cookies.split(';').map(item => {
					const [name, value] = item.split('=')
					return {
						name: name.trim(),
						value: value.trim()
					}
				})
			}

			let expirationDate
			if (!this.formFields.session) {
				expirationDate = (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000
			}

			cookies = cookies.map(item => {
				const cookie = {
					url: this.currentUrl,
					name: item.name,
					domain: item.domain,
					value: item.value,
					path: item.path || '/',
					httpOnly: !!item.httpOnly,
					expirationDate: item.expirationDate || expirationDate
				}

				if (!item.domain && this.formFields.domain) {
					cookie.domain = this.formFields.domain
				}

				return cookie
			})

			const res = cookies.map(cookie => {
				return new Promise((resolve, reject) => {
					chrome.cookies.set(cookie, details => {
						if (details) {
							resolve(true)
						} else {
							reject(new Error('写入Cookie失败'))
						}
					})
				})
			})

			Promise.all(res)
				.then(() => {
					ElMessage({
						message: '导入Cookie成功',
						type: 'success'
					})
					this.reset()
					this.$emit('close')
				})
				.catch(() => {
					ElMessage({
						message: '导入Cookie失败',
						type: 'error'
					})
				})
		},
		onCancel() {
			this.reset()
			this.$emit('close')
		},
		reset() {
			const form = this.$refs.form
			form.resetFields()
			this.formFields = {
				cookies: '',
				domain: this.currentDomain,
				session: false
			}
		}
	}
}
</script>

<style lang="less" scoped>
:deep(textarea) {
	word-break: break-all;
}

.note {
	color: rgb(245, 108, 108);
	font-size: 12px;
	font-weight: bold;
	margin-left: 12px;
}
</style>
