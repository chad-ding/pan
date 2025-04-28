<template>
	<el-form
		ref="form"
		:model="formFields"
		:rules="disabled ? undefined : formRules"
		label-width="auto"
		:disabled="disabled"
	>
		<el-form-item label="Name" prop="name">
			<el-input v-model.trim="formFields.name" size="small" />
		</el-form-item>
		<el-form-item label="Expires" prop="expires">
			<el-date-picker
				v-model="formFields.expires"
				size="small"
				type="datetime"
				placeholder="请选择日期"
				:disabled-date="onDateFilter"
			/>
		</el-form-item>
		<el-form-item label="Value" prop="value">
			<el-input v-model.trim="formFields.value" size="small" />
		</el-form-item>
		<el-form-item label="Domain" prop="domain">
			<el-input v-model.trim="formFields.domain" size="small" />
		</el-form-item>
		<el-form-item label="Path" prop="path">
			<el-input v-model.trim="formFields.path" size="small" />
		</el-form-item>
		<el-form-item label="HttpOnly" prop="httpOnly">
			<el-checkbox v-model="formFields.httpOnly" size="small" />
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

const DefaultFields = {
	name: '',
	value: '',
	path: '/',
	httpOnly: false,
	expires: undefined
}

export default {
	props: {
		currentDomain: {
			type: String,
			default: undefined
		},
		currentUrl: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		value: {
			type: Object,
			default: undefined
		}
	},
	data() {
		const formFields = Object.assign(
			{
				domain: this.currentDomain,
				...DefaultFields
			},
			this.value
		)

		if (!isNaN(formFields.expirationDate)) {
			formFields.expires = new Date(formFields.expirationDate * 1000)
			delete formFields.expirationDate
		}

		return {
			formFields,
			formRules: {
				name: [
					{ required: true, message: '请输入Cookie名称', trigger: 'blur' },
					{
						trigger: 'change',
						validator(rule, value, callback) {
							if (!validator.name(value)) {
								callback(new Error('Cookie名称不合法'))
							}

							callback()
						}
					}
				],
				value: [
					{ required: true, message: '请输入Cookie值', trigger: 'blur' },
					{
						trigger: 'change',
						validator(rule, value, callback) {
							if (!validator.value(value)) {
								callback(new Error('Cookie值不合法'))
							}

							callback()
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
				],
				path: [
					{ required: true, message: '请输入Path', trigger: 'blur' },
					{
						trigger: 'change',
						validator(rule, value, callback) {
							if (value !== '/' && !validator.path(value)) {
								callback(new Error('Path不合法'))
							}

							callback()
						}
					}
				]
			}
		}
	},
	methods: {
		async onConfirm() {
			const form = this.$refs.form

			try {
				await form.validate()

				const cookie = {
					url: this.currentUrl,
					name: this.formFields.name,
					value: this.formFields.value,
					path: this.formFields.path,
					httpOnly: this.formFields.httpOnly,
					domain: this.formFields.domain
				}

				// 设置当前站点domain不能传值
				if (cookie.domain === this.currentDomain) {
					delete cookie.domain
				}

				if (this.formFields.expires) {
					cookie.expirationDate = this.formFields.expires.getTime() / 1000
				}

				// 编辑cookie先把旧的删除，避免编辑名称新增一条cookie
				if (this.value) {
					const res = await new Promise(resolve => {
						chrome.cookies.remove(
							{
								url: this.currentUrl,
								name: this.value.name
							},
							details => {
								if (
									details === 'null' ||
									details === undefined ||
									details === 'undefined'
								) {
									resolve(false)
								} else {
									resolve(true)
								}
							}
						)
					})

					if (!res) {
						ElMessage({
							message: '编辑Cookie失败',
							type: 'error'
						})
						return
					}
				}

				const res = await new Promise(resolve => {
					chrome.cookies.set(cookie, details => {
						if (details) {
							resolve(true)
						} else {
							resolve(false)
						}
					})
				})

				if (res) {
					this.$emit('close')
				} else {
					ElMessage({
						message: `${this.cookie ? '编辑' : '新增'}Cookie失败`,
						type: 'error'
					})
				}
			} catch (e) {
				console.error('表单校验不通过: ', e.message)
			}
		},
		onCancel() {
			this.reset()
			this.$emit('close')
		},
		reset() {
			const form = this.$refs.form
			form.resetFields()
			this.formFields = {
				domain: this.currentDomain,
				...DefaultFields
			}
		},
		onDateFilter(date) {
			// 时间早于当前
			const today = new Date()
			today.setHours(0)
			today.setMinutes(0)
			today.setSeconds(0)
			today.setMilliseconds(0)

			/* date.setHours(0)
			date.setMinutes(0)
			date.setSeconds(0)
			date.setMilliseconds(0) */

			return date.getTime() - today.getTime() < 24 * 60 * 60 * 1000
		}
	}
}
</script>
