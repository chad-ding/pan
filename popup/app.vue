<template>
	<div class="app">
		<el-tabs v-model="currenTab">
			<el-tab-pane v-for="(value, key) of tabs" :key="key" :name="key" :label="value.label">
				<component :is="value.component" />
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
import Pic2Base64 from '@/view/pic2base64/index.vue'

export default {
	data() {
		const tabs = {
			qrcode: {
				label: '二维码',
				component: QrCode
			},
			codec: {
				label: '字符串编/解码',
				component: Codec
			},
			color: {
				label: '色值转换',
				component: Color
			},
			json: {
				label: 'JSON格式化',
				component: Json
			},
			pic2base64: {
				label: '图片转base64',
				component: Pic2Base64
			},
			numeric: {
				label: '数字转化',
				component: Numeric
			}
		}

		return {
			tabs,
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
