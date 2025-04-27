<template>
	<el-form ref="form" :model="formFields" :rules="formRules" label-width="auto">
		<el-form-item label="Name" prop="name">
			<el-input v-model="formFields.name" />
		</el-form-item>
		<el-form-item label="Value" prop="value">
			<el-input v-model="formFields.value" />
		</el-form-item>
		<el-form-item label="Domain" prop="domain">
			<el-input v-model="formFields.domain" />
		</el-form-item>
		<el-form-item label="Path" prop="path">
			<el-input v-model="formFields.path" />
		</el-form-item>
		<el-form-item label="HttpOnly" prop="httpOnly">
			<el-checkbox v-model="formFields.httpOnly" />
		</el-form-item>
		<el-form-item label="Expires" prop="expires">
			<el-date-picker v-model="formFields.expires" type="datetime" placeholder="请选择日期" />
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="onConfirm">确认</el-button>
			<el-button @click="onCancel">取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
export default {
	props: {
		currentDomain: {
			type: String,
			default: undefined
		}
	},
	data() {
		return {
			formFields: {
				name: '',
				value: '',
				domain: this.currentDomain,
				path: '/',
				httpOnly: false,
				expires: undefined
			},
			formRules: {
				name: [
					{ required: true, message: '请输入Cookie名称', trigger: 'blur' },
					{
						trigger: 'change',
						validator(rule, value, callback) {
							if (!/^[!#$%&'*+-.^_`|~0-9a-zA-Z]+$/i.test(value)) {
								callback(new Error('Cookie名称不合法'))
							}

							callback()
						}
					}
				],
				value: [{ required: true, message: '请输入Cookie值', trigger: 'blur' }],
				domain: [
					{ required: true, message: '请输入Domain', trigger: 'blur' },
					{
						trigger: 'change',
						validator(rule, value, callback) {
							if (
								!/^\.?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i.test(
									value
								)
							) {
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
							if (
								value !== '/' &&
								!/^(\/[a-zA-Z0-9\-._~%!$&'()*+,;=:@]+)+\/?$/i.test(value)
							) {
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

				this.$emit('close')
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
				name: '',
				value: '',
				domain: this.currentDomain,
				path: '/',
				httpOnly: false,
				expires: undefined
			}
		}
	}
}
</script>
