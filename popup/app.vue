<template>
	<div class="app">
		<el-tabs v-model="currenTab" @tab-change="onTabChange">
			<el-tab-pane v-for="(value, key) in tabs" :key="key" :name="key" :label="value.label">
				<component :is="value.component" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import storage from './common/storage'

import QrCode from '@/view/qrcode/index.vue'
import Codec from '@/view/codec/index.vue'
import Color from '@/view/color/index.vue'
import Json from '@/view/json/index.vue'
import Numeric from '@/view/numeric/index.vue'
import Base64 from '@/view/base64/index.vue'
import Cookies from '@/view/cookies/index.vue'
import Http from '@/view/http/index.vue'

const StorageKey = 'currentTabName'

export default {
	data() {
		const tabs = {
			qrcode: {
				label: '二维码',
				component: QrCode
			},
			cookies: {
				label: 'Cookies',
				component: Cookies
			},
			http: {
				label: '数据请求',
				component: Http
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
			base64: {
				label: 'Base64',
				component: Base64
			},
			numeric: {
				label: '数字转化',
				component: Numeric
			}
		}

		return {
			tabs,
			currenTab: 'http'
		}
	},
	created() {
		storage.get(StorageKey, true).then(tabName => {
			if (tabName) {
				this.currenTab = tabName
			}
		})
	},
	methods: {
		onTabChange(tabName) {
			storage.set(StorageKey, tabName, true)
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
