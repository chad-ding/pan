<template>
	<div class="base64">
		<div>
			<el-menu :default-active="activeMenu">
				<el-menu-item index="base64" @click="onMenuClick">
					<template #title>
						<span>转Base64</span>
					</template>
				</el-menu-item>
				<el-menu-item index="pic" @click="onMenuClick">
					<template #title>
						<span>转图片</span>
					</template>
				</el-menu-item>
			</el-menu>
		</div>
		<div class="container">
			<template v-if="activeMenu === 'base64'">
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
								<img
									class="el-upload-list__item-thumbnail"
									:src="file.url"
									alt=""
								/>
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
					<el-button :disabled="!picture" type="primary" @click="onConvert">
						转化
					</el-button>
				</div>
				<div class="content">
					<el-card class="card" @click="onCopy">
						<p class="result">{{ base64 }}</p>
					</el-card>
				</div>
			</template>
			<template v-else>
				<el-input
					v-model.trim="base64"
					type="textarea"
					:rows="6"
					resize="none"
					placeholder="请输入图片base64"
				/>
				<div class="content">
					<el-image
						:src="base64"
						fit="contain"
						@load="() => (imageError = false)"
						@error="onImageLoadError"
					>
						<template #error>
							<div class="image-slot">
								<el-icon><Picture /></el-icon>
							</div>
						</template>
					</el-image>
					<el-button type="primary" :disabled="!base64 || imageError" @click="onDownload">
						下载
					</el-button>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import { ElMessage } from 'element-plus'

import util from '@/common/util'

export default {
	data() {
		return {
			activeMenu: 'base64',
			picture: undefined,
			base64: '',
			imageError: false,
			timer: undefined
		}
	},
	methods: {
		onImageLoadError() {
			this.imageError = true

			if (!this.base64) {
				return
			}

			if (this.timer) {
				clearTimeout(this.timer)
			}

			this.timer = setTimeout(() => {
				ElMessage({
					message: 'Base64字符串无效',
					type: 'error'
				})
			}, 600)
		},
		onDownload() {
			const matches = /^data:image\/(\w+);base64/.exec(this.base64)
			const extension = matches[1]

			util.download(this.base64, extension)
		},
		onMenuClick({ index }) {
			this.activeMenu = index
			if (index === 'pic') {
				this.onRemove()
			} else {
				this.picture = undefined
				this.base64 = ''
				this.imageError = false
			}
		},
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
.base64 {
	display: flex;
	flex-direction: row;
	height: 100%;
	width: 100%;

	.el-image {
		height: 180px;
		margin-right: 12px;
		width: 180px;
	}

	.image-slot {
		align-items: center;
		background: var(--el-fill-color-light);
		color: var(--el-text-color-secondary);
		display: flex;
		font-size: 30px;
		height: 100%;
		justify-content: center;
		width: 100%;
	}

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

	.container {
		flex-grow: 1;
		overflow: hidden;
		padding-left: 6px;

		:deep(.el-upload-list__item + .el-upload) {
			opacity: 0;
			overflow: hidden;
			width: 1px;
		}
	}

	.content {
		align-items: flex-end;
		display: flex;
		flex-direction: row;
		margin: 24px 0;
		padding: 0 4px;

		.el-image {
			box-shadow: 3px 3px 20px #3131341f;
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
	}
}
</style>
