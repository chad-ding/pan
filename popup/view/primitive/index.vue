<template>
	<el-radio-group v-model="type">
		<el-radio value="num">整数</el-radio>
		<el-radio value="str">字符串</el-radio>
	</el-radio-group>
	<div class="content">
		<num v-if="type === 'num'" />
		<str v-else-if="type === 'str'" />
		<datetime v-if="type === 'datetime'" />
	</div>
</template>

<script>
import Num from './component/num/index.vue'
import Str from './component/str/index.vue'

export default {
	components: {
		Num,
		Str
	},
	data() {
		return {
			type: 'num'
		}
	}
}
</script>

<style scoped>
.content {
	margin-top: 12px;
}
</style>
