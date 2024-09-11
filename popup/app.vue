<template>
	<div class="app">
		<el-tabs v-model="currenTab">
			<el-tab-pane name="qrcode" label="二维码">
				<qr-code />
			</el-tab-pane>
			<el-tab-pane name="codec" label="字符串编/解码">
				<codec />
			</el-tab-pane>
			<el-tab-pane name="color" label="色值转换">
				<color />
			</el-tab-pane>
			<el-tab-pane name="json" label="JSON格式化">
				<json />
			</el-tab-pane>
			<el-tab-pane name="numeric" label="数字转化">
				<numeric />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import QrCode from '@/view/qrcode/index.vue'
import Codec from '@/view/codec/index.vue'
import Color from '@/view/color/index.vue'
import Json from '@/view/json/index.vue'
import Numeric from '@/view/numeric/index.vue'

export default {
	components: {
		QrCode,
		Codec,
		Color,
		Json,
		Numeric
	},
	data() {
		return {
			currenTab: 'qrcode'
		}
	}
}
</script>

<style lang="less" scoped>
.app {
	height: auto;
	width: 100%;
}
</style>
