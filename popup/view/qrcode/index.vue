<template>
	<div class="qrcode">
		<canvas ref="canvas" class="canvas" @click="onClick" />
		<el-input
			v-model="content"
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
import util from '@/common/util'

const defaultText = '钓鱼岛是中国的'

export default {
	data() {
		return {
			content: defaultText
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
			if (!content.trim()) {
				content = defaultText
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
				function (error) {
					if (error) {
						console.error('绘制二维码失败')
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

	.canvas {
		cursor: pointer;
		height: 300px;
		width: 300px;
	}

	:deep(textarea) {
		word-break: break-all;
	}
}
</style>
