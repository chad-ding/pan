<template>
	<div class="pic2base64">
		<div class="uploader">
			<el-upload
				ref="upload"
				action="#"
				:multiple="false"
				:limit="1"
				list-type="picture-card"
				:auto-upload="false"
				accept="image/*"
				:on-change="onChange"
				:disabled="!!picture"
			>
				<el-icon><Plus /></el-icon>
				<template #file="{ file }">
					<div>
						<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
						<span class="el-upload-list__item-actions">
							<span
								v-if="!disabled"
								class="el-upload-list__item-delete"
								@click="onRemove(file)"
							>
								<el-icon><Delete /></el-icon>
							</span>
						</span>
					</div>
				</template>
			</el-upload>
			<el-button :disabled="!picture" type="primary" @click="onConvert">转化</el-button>
		</div>
		<div class="content">
			<el-card class="card" @click="onCopy">
				<p class="result">{{ base64 }}</p>
			</el-card>
		</div>
	</div>
</template>

<script>
import { ElMessage } from 'element-plus'

import util from '@/common/util'

export default {
	data() {
		return {
			picture: undefined,
			base64: ''
		}
	},
	methods: {
		onChange(file) {
			this.picture = file
		},
		onRemove() {
			this.$refs.upload.clearFiles()
			this.picture = undefined
			this.base64 = ''
		},
		onConvert() {
			if (!this.picture) {
				ElMessage({
					message: '请选择图片',
					type: 'error'
				})
				return
			}

			this.base64 = ''
			try {
				const reader = new FileReader()
				reader.onload = () => {
					this.base64 = reader.result
				}

				reader.onerror = e => {
					ElMessage({
						message: '转化base64失败: ' + e.message,
						type: 'error'
					})
				}

				reader.readAsDataURL(this.picture.raw)
			} catch (e) {
				ElMessage({
					message: '转化base64失败: ' + e.message,
					type: 'error'
				})
			}
		},
		onCopy() {
			if (!this.base64.trim()) {
				return
			}
			util.copy(this.base64)

			ElMessage({
				message: '复制成功',
				type: 'success'
			})
		}
	}
}
</script>

<style lang="less" scoped>
.pic2base64 {
	height: 100%;
	width: 100%;

	.uploader {
		align-items: flex-end;
		display: flex;
		flex-direction: row;
		font-size: 0;

		:deep(.el-upload-list__item) {
			justify-content: center;
			margin-bottom: 0;
		}

		> button {
			margin-left: 24px;
		}
	}

	.content {
		margin-top: 24px;
		padding: 0 4px;

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
	}
}
</style>
