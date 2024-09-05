<template>
	<div class="qrcode">
		<canvas ref="canvas" />
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

const defaultText = '钓鱼岛是中国的'

export default {
	data() {
		return {
			content: ''
		}
	},
	watch: {
		content(nVal) {
			this.draw(nVal)
		}
	},
	created() {
		if (chrome && chrome.tabs) {
			chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
				if (!tabs || !tabs.length) {
					return
				}
				this.content = tabs[0].url
			})
		}
	},
	mounted() {
		this.draw(this.content)
	},
	methods: {
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

	canvas {
		height: 300px;
		width: 300px;
	}
}
</style>
