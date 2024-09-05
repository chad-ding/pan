<template>
	<div class="str">
		<el-row :gutter="20">
			<el-col :span="4">
				<label class="el-form-item__label">字符串</label>
			</el-col>
			<el-col :span="20">
				<el-input
					v-model="origin"
					type="textarea"
					:rows="5"
					resize="none"
					@change="onChange"
				/>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="4">
				<label class="el-form-item__label">unicode</label>
			</el-col>
			<el-col :span="20">
				<el-card>
					<p class="content">{{ encoded }}</p>
				</el-card>
			</el-col>
		</el-row>
	</div>
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
.str {
	margin-bottom: 18px;
	widows: 100%;

	.content {
		max-height: 180px;
		max-width: 100%;
		overflow-y: scroll;
		white-space: normal;
		word-wrap: break-word;
	}

	.el-row + .el-row {
		margin-top: 12px;
	}
}
</style>
