<template>
	<div class="codec">
		<el-input
			v-model="content"
			:rows="5"
			type="textarea"
			placeholder="请输入内容"
			resize="none"
			:show-word-limit="true"
		/>
		<p class="result">{{ result }}</p>
		<div class="group-wrap">
			<el-button-group>
				<el-button type="primary" @click="onEncode">encodeURIComponent</el-button>
				<el-button type="success" @click="onDecode">decodeURIComponent</el-button>
			</el-button-group>
		</div>
	</div>
</template>

<script>
import { ElMessage } from 'element-plus'
import util from '@/common/util'

export default {
	data() {
		return {
			result: '',
			content: ''
		}
	},
	methods: {
		onEncode() {
			if (!this.content.trim()) {
				ElMessage({
					message: '请输入内容',
					type: 'error'
				})
				return
			}

			this.result = encodeURIComponent(this.content.trim())
			util.copy(this.result)

			ElMessage({
				message: '复制成功',
				type: 'success'
			})
		},
		onDecode() {
			if (!this.content.trim()) {
				ElMessage({
					message: '请输入内容',
					type: 'error'
				})
				return
			}

			this.result = decodeURIComponent(this.content.trim())
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
.codec {
	align-items: center;
	display: flex;
	flex-direction: column;
	width: 100%;

	.result {
		color: rgb(96, 98, 102);
		font-size: 14px;
		margin-top: 12px;
		width: 100%;
		word-break: break-all;
		word-wrap: break-word;
	}

	.group-wrap {
		margin-top: 12px;
	}
}
</style>
