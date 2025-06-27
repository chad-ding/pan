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

const DefaultText = '人生就像巧克力，永远不知道下一颗会不会掺了狗屎'

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
			QRCode.toCanvas(
				this.$refs.canvas,
				content,
				{
					width: 300,
					height: 300,
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
					}
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
