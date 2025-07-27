<template>
	<el-dialog v-model="showImportDialog" title="导入规则" width="500px" center>
		<el-form>
			<el-form-item label="规则JSON">
				<el-input v-model.trim="importData" type="textarea" :rows="10" resize="none"
					placeholder="请粘贴规则JSON数据" />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="primary" :loading="importing" @click="onConfirmImport">导入</el-button>
			<el-button @click="doClose">取消</el-button>
		</template>
	</el-dialog>
</template>

<script>
export default {
	props: {
		modelValue: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:modelValue'],
	data() {
		return {
			showImportDialog: false,
			importData: '',
			importing: false
		}
	},
	watch: {
		modelValue: {
			handler(nVal) {
				this.showImportDialog = nVal
			},
			immediate: true
		}
	},
	methods: {
		doClose() {
			this.$emit('update:modelValue', false)
			this.importData = ''
		},
		async onConfirmImport() {
			if (!this.importData) {
				this.$message.error('导入内容不能为空')
				return
			}

			try {
				this.importing = true
				const rules = JSON.parse(this.importData)
				if (!Array.isArray(rules)) {
					throw new Error('规则数据格式错误')
				}

				// 验证规则格式
				for (const rule of rules) {
					if (!rule.name || !rule.urlPattern || !rule.modifyType) {
						throw new Error('规则数据不完整')
					}
				}

				this.rulesList = rules.map(rule => ({
					...rule,
					id: rule.id || Date.now() + Math.random(),
					active: rule.active !== undefined ? rule.active : true
				}))

				await this.saveRules()
				this.showImportDialog = false
				this.importData = ''
				this.$message.success('规则导入成功')

				this.doClose()
			} catch (error) {
				this.$message.error('导入失败: ' + error.message)
			} finally {
				this.importing = false
			}
		}
	}
}
</script>
