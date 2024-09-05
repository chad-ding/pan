<template>
	<el-form label-width="75">
		<el-form-item label="字符串">
			<el-input v-model="origin" type="textarea" :rows="5" resize="none" @change="onChange" />
		</el-form-item>
		<el-form-item label="unicode">
			<el-card class="card">
				<p class="content">{{ encoded }}</p>
			</el-card>
		</el-form-item>
	</el-form>
</template>

<script>
export default {
	data() {
		return {
			origin: '',
			encoded: ''
		}
	},
	methods: {
		onChange() {
			this.string2unicode(this.origin)
		},
		string2unicode(str) {
			let ret = ''
			let ustr = ''

			for (let i = 0; i < str.length; i++) {
				const code = str.charCodeAt(i)
				const code16 = code.toString(16)

				if (code < 0xf) {
					ustr = '\\u' + '000' + code16
				} else if (code < 0xff) {
					ustr = '\\u' + '00' + code16
				} else if (code < 0xfff) {
					ustr = '\\u' + '0' + code16
				} else {
					ustr = '\\u' + code16
				}
				ret += ustr
			}

			this.encoded = ret
		}
	}
}
</script>

<style lang="less" scoped>
.card {
	width: 100%;

	.content {
		max-height: 180px;
		overflow-y: scroll;
		white-space: normal;
		width: 100%;
		word-wrap: break-word;
	}
}
</style>
