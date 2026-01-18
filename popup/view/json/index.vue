<template>
	<div class="json">
		<div class="btn-group">
			<el-button type="primary" @click="onFormat">格式化</el-button>
			<el-button type="success" @click="onCompress">压缩</el-button>
			<el-button type="warning" @click="onRepair">修复</el-button>
		</div>
		<div ref="editor" class="editor" />
	</div>
</template>

<script>
import { ElMessage } from 'element-plus'
import JSONEditor from 'jsoneditor'

export default {
	data() {
		return {
			editor: undefined
		}
	},
	mounted() {
		const options = {
			mode: 'code',
			sortObjectKeys: false,
			indentation: 4,
			mainMenuBar: false,
			navigationBar: true,
			statusBar: true
		}
		this.editor = new JSONEditor(this.$refs.editor, options)
	},
	methods: {
		async validate() {
			try {
				const errors = await this.editor.validate()

				if (errors.length) {
					ElMessage({
						message: 'JSON内容无效',
						type: 'error'
					})
				}
				return !errors.length
			} catch {
				ElMessage({
					message: 'JSON内容无效',
					type: 'error'
				})
				return false
			}
		},
		async onFormat() {
			const valid = await this.validate()

			if (!valid) {
				return
			}

			this.editor.format()
		},
		async onCompress() {
			const valid = await this.validate()

			if (!valid) {
				return
			}

			this.editor.compact()
		},
		onRepair() {
			this.editor.repair()
		}
	}
}
</script>

<style scoped lang="less">
.json {
	display: flex;
	flex-direction: column;
	height: 500px;
	width: 100%;

	.btn-group {
		margin-bottom: 12px;
		text-align: right;
	}

	.editor {
		flex-grow: 1;
	}
}
</style>

<style>
@import url('../../../node_modules/jsoneditor/dist/jsoneditor.css');
</style>
