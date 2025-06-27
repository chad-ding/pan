<template>
	<div class="qrcode">
		<div class="container" :class="{ fulfilled: !!content }">
			<canvas ref="canvas" class="canvas" @click="onClick" />
		</div>
		<el-input
			v-model.trim="content"
			:rows="5"
			type="textarea"
			placeholder="请输入内容"
			resize="none"
			:show-word-limit="true"
		/>
	</div>
</template>

<script>
import QRCode from 'qrcode'
import { ElMessage } from 'element-plus'

import util from '@/common/util'

import Logo from '../../../icon/logo.256.png'

const DefaultText = '©Chad.Ding All Rights Reserved'

export default {
	data() {
		return {
			content: DefaultText
		}
	},
	watch: {
		content(nVal) {
			this.draw(nVal)
		}
	},
	created() {
		util.getCurrentTab().then(tab => {
			if (tab) {
				this.content = tab.url
			}
		})
	},
	mounted() {
		this.draw(this.content)
	},
	methods: {
		onClick() {
			if (!this.content) {
				return
			}

			const dataURL = this.$refs.canvas.toDataURL('image/png')
			util.download(dataURL, 'png')
		},
		draw(content) {
			if (!content) {
				return
			}

			const canvas = this.$refs.canvas

			QRCode.toCanvas(
				canvas,
				content,
				{
					width: 300,
					height: 300,
					errorCorrectionLevel: 'H',
					color: {
						dark: '#606266'
					}
				},
				err => {
					if (err) {
						ElMessage({
							message: '绘制二维码失败: ' + err.message,
							type: 'error'
						})
						return
					}

					const ctx = canvas.getContext('2d')
					const img = new Image()

					img.addEventListener('load', () => {
						const logoW = canvas.width / 6
						const logoH = (logoW * 128) / 200
						const containerSize = logoW * 1.2

						// 绘制框体
						const containerX = (canvas.width - containerSize) / 2
						const containerY = (canvas.height - containerSize) / 2
						ctx.fillStyle = '#FFFFFF'
						ctx.fillRect(containerX, containerY, containerSize, containerSize)

						// 绘制Logo
						const logoX = (canvas.width - logoW) / 2
						const logoY = (canvas.height - logoH) / 2
						ctx.drawImage(img, logoX, logoY, logoW, logoH)
					})

					img.src = Logo
				}
			)
		}
	}
}
</script>

<style lang="less" scoped>
.qrcode {
	align-items: center;
	display: flex;
	flex-direction: column;
	width: 100%;

	.container {
		height: 300px;
		position: relative;
		width: 300px;

		.canvas {
			cursor: pointer;
			height: 100%;
			opacity: 0;
			width: 100%;
		}

		&.fulfilled {
			.canvas {
				opacity: 1;
			}
		}

		&:not(.fulfilled)::before {
			background: url('@/image/empty.png') center / 120px auto no-repeat;
			bottom: 0;
			content: '';
			left: 0;
			position: absolute;
			right: 0;
			top: 0;
		}
	}

	:deep(textarea) {
		word-break: break-all;
	}
}
</style>
