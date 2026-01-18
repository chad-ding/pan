<template>
	<el-form ref="form" :model="formOptions" :rules="formRules">
		<div class="color">
			<p class="title">
				<span class="text">HEX</span>
				<a class="btn" href="javascript:;" @click="() => onCopy('hex')">
					<el-icon><CopyDocument /></el-icon>&nbsp;复制
				</a>
			</p>
			<el-row>
				<el-col :span="12">
					<el-form-item prop="hex">
						<el-input v-model="formOptions.hex" @change="onHexChange">
							<template #prepend>#</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<div class="circle" :style="{ backgroundColor: circleColor }"></div>
				</el-col>
			</el-row>
			<div class="rgba">
				<p class="title">
					<span class="text">RGBA</span>
					<a class="btn" href="javascript:;" @click="() => onCopy('rgba')">
						<el-icon><CopyDocument /></el-icon> &nbsp;复制
					</a>
				</p>
				<el-row :gutter="20">
					<el-col :span="6">
						<el-row>
							<el-form-item prop="rgba.r">
								<el-col :span="6">
									<p class="label r">R</p>
								</el-col>
								<el-col :span="18">
									<el-input
										v-model="formOptions.rgba.r"
										@paste="onRgbaPaste"
										@input="() => onRgbChange('r')"
									/>
								</el-col>
							</el-form-item>
						</el-row>
					</el-col>
					<el-col :span="6">
						<el-row>
							<el-form-item prop="rgba.g">
								<el-col :span="6">
									<p class="label g">G</p>
								</el-col>
								<el-col :span="18">
									<el-input
										v-model="formOptions.rgba.g"
										@paste="onRgbaPaste"
										@input="() => onRgbChange('g')"
									/>
								</el-col>
							</el-form-item>
						</el-row>
					</el-col>
					<el-col :span="6">
						<el-row>
							<el-form-item prop="rgba.b">
								<el-col :span="6">
									<p class="label b">B</p>
								</el-col>
								<el-col :span="18">
									<el-input
										v-model="formOptions.rgba.b"
										@paste="onRgbaPaste"
										@input="() => onRgbChange('b')"
									/>
								</el-col>
							</el-form-item>
						</el-row>
					</el-col>
					<el-col :span="6">
						<el-row>
							<el-form-item prop="rgba.a">
								<el-col :span="6">
									<p class="label" :style="{ opacity: formOptions.rgba.a }">A</p>
								</el-col>
								<el-col :span="18">
									<el-input
										v-model="formOptions.rgba.a"
										@paste="onRgbaPaste"
										@input="onAlphaChange"
									/>
								</el-col>
							</el-form-item>
						</el-row>
					</el-col>
				</el-row>
			</div>
		</div>
	</el-form>
</template>

<script>
import { ElMessage } from 'element-plus'
import util from '@/common/util'
import AlphaHexMap from '@/consts/color'

export default {
	data() {
		const rgbRule = [
			{ required: true, trigger: 'blur', message: '不能为空' },
			{
				validator(rule, value, callback) {
					if (isNaN(value) || value < 0 || value > 255 || value % 1 !== 0) {
						callback(new Error('输入0-255的整数'))
					} else {
						callback()
					}
				},
				trigger: 'blur'
			}
		]

		return {
			circleColor: '#000000',
			formOptions: {
				hex: '000000',
				rgba: {
					r: 0,
					g: 0,
					b: 0,
					a: 1
				}
			},
			formRules: {
				hex: [
					{ required: true, trigger: 'blur', message: '请输入值' },
					{
						validator(rule, value, callback) {
							if (
								!/^[0-9|a-f]{6,8}$/i.test(value) ||
								(value.length !== 6 && value.length !== 8)
							) {
								callback(new Error('输入的值无效'))
							} else if (
								value.length === 8 &&
								!Object.values(AlphaHexMap).includes(
									value.substring(6).toUpperCase()
								)
							) {
								callback(new Error('透明度无效'))
							} else {
								callback()
							}
						},
						trigger: 'blur'
					}
				],
				rgba: {
					r: rgbRule,
					g: rgbRule,
					b: rgbRule,
					a: [
						{ required: true, trigger: 'blur', message: '' },
						{
							validator(rule, value, callback) {
								if (isNaN(value) || value < 0 || value > 1) {
									callback(new Error('输入0-1的数字'))
								} else if (value.length > 4) {
									callback(new Error('最多2位小数'))
								} else {
									callback()
								}
							},
							trigger: 'blur'
						}
					]
				}
			}
		}
	},
	methods: {
		onRgbaPaste(evt) {
			evt.preventDefault()

			let text = ''
			if (evt.clipboardData || evt.originalEvent.clipboardData) {
				text = (evt.clipboardData || evt.originalEvent.clipboardData).getData('text/plain')
			}
			text = text.trim().replace(/\s+/g, '').toLowerCase()

			const regExp = /^rgba?\((\d+),(\d+),(\d+)(,[^)]+)?\)$/
			const res = regExp.exec(text)
			if (!res) {
				ElMessage({
					message: '颜色值无效，请检查复制的内容',
					type: 'error'
				})
				return
			}

			let [, r, g, b, a] = res
			if (a) {
				a = a.substring(1)
			} else {
				a = 1
			}

			// 色值无效
			if (
				r < 0 ||
				r > 255 ||
				g < 0 ||
				g > 255 ||
				b < 0 ||
				b > 255 ||
				isNaN(a) ||
				a < 0 ||
				a > 1
			) {
				ElMessage({
					message: '颜色值无效，请检查复制的内容',
					type: 'error'
				})
				return
			}

			const rgba = {
				r,
				g,
				b,
				a
			}
			this.formOptions.rgba = rgba
			this.rgba2Hex()
		},
		async onCopy(type) {
			const { hex, rgba } = this.formOptions

			// 复制16进制值
			if (type === 'hex') {
				const res = await new Promise(resolve => {
					this.$refs.form.validateField('hex', res => {
						resolve(res)
					})
				})

				if (!res) {
					ElMessage({
						message: '颜色值无效',
						type: 'error'
					})
					return
				}

				util.copy('#' + hex.toUpperCase())

				ElMessage({
					message: '复制成功',
					type: 'success'
				})

				return
			}

			const res = await Promise.all(
				Object.keys(rgba).map(key => {
					return new Promise(resolve => {
						this.$refs.form.validateField('rgba.' + key, res => {
							resolve(res)
						})
					})
				})
			)

			if (res.some(item => !item)) {
				ElMessage({
					message: '颜色值无效',
					type: 'error'
				})
				return
			}

			const { r, g, b, a } = rgba

			if (Number(a) === 1) {
				util.copy(`rgb(${Number(r)},${Number(g)},${Number(b)})`)
			} else {
				util.copy(`rgba(${Number(r)},${Number(g)},${Number(b)},${Number(a)})`)
			}

			ElMessage({
				message: '复制成功',
				type: 'success'
			})
		},
		async onHexChange() {
			const res = await new Promise(resolve => {
				this.$refs.form.validateField('hex', res => {
					resolve(res)
				})
			})

			if (!res) {
				return
			}

			this.hex2Rgba()
		},
		async onRgbChange(hue) {
			const res = await new Promise(resolve => {
				this.$refs.form.validateField('rgba.' + hue, res => {
					resolve(res)
				})
			})

			if (!res) {
				return
			}

			this.formOptions.rgba[hue] = Number(this.formOptions.rgba[hue])
			this.rgba2Hex()
		},
		async onAlphaChange() {
			const res = await new Promise(resolve => {
				this.$refs.form.validateField('rgba.a', res => {
					resolve(res)
				})
			})

			if (!res) {
				return
			}

			this.formOptions.rgba.a = Number(this.formOptions.rgba.a)
			this.rgba2Hex()
		},
		// rgba转小数
		rgba2Hex() {
			this.$refs.form.clearValidate('hex')

			let hex = ''
			const { r, g, b, a } = this.formOptions.rgba
			const rgb = [r, g, b]

			for (const color of rgb) {
				hex += Number(color).toString(16).padStart(2, '0')
			}

			if (Number(a) !== 1) {
				hex += this.decToHex(a)
			}

			this.formOptions.hex = hex.toUpperCase()

			this.circleColor = '#' + this.formOptions.hex
		},
		// 16进制转rgba
		hex2Rgba() {
			Object.keys(this.formOptions.rgba).forEach(key => {
				this.$refs.form.clearValidate('rgba.' + key)
			})

			const rgba = []
			const hex = this.formOptions.hex.toUpperCase().padEnd(8, 'F')

			for (let i = 0; i < hex.length; i += 2) {
				rgba.push(parseInt(hex.slice(i, i + 2), 16))
			}

			this.formOptions.rgba = {
				r: rgba[0],
				g: rgba[1],
				b: rgba[2],
				a: this.hexToDec(rgba[3].toString(16))
			}

			this.circleColor = '#' + this.formOptions.hex
		},
		// 透明度小数转16进制
		decToHex(alpha) {
			if (isNaN(alpha)) {
				console.error('透明度值无效')
				return ''
			}

			alpha = Number(alpha).toFixed(2)
			return AlphaHexMap[alpha]
		},
		// 透明度16进制转小数
		hexToDec(hex) {
			if (!/^[\d|a-f]{2}$/i.test(hex)) {
				console.error('16进制透明度无效')
				return 1
			}

			hex = hex.toUpperCase()
			const alpha = Object.entries(AlphaHexMap).find(([key, value]) => {
				return value === hex
			})

			return !alpha ? 1 : Number(alpha[0])
		}
	}
}
</script>

<style lang="less" scoped>
.color {
	width: 100%;

	.title {
		margin-bottom: 12px;

		.text {
			font-size: 18px;
			font-weight: bold;
		}

		.btn {
			align-items: center;
			color: rgb(121 187 255);
			display: inline-flex;
			flex-direction: row;
			font-size: 14px;
			margin-left: 12px;
			text-decoration: none;
		}
	}

	.label {
		align-items: center;
		display: flex;
		flex-direction: row;
		font-size: 20px;
		font-weight: bolder;
		height: 100%;

		&.r {
			color: #f00;
		}

		&.g {
			color: #0f0;
		}

		&.b {
			color: #00f;
		}
	}

	.rgba {
		margin-top: 24px;
	}

	.circle {
		border-radius: 50%;
		height: 100px;
		position: absolute;
		right: 60px;
		top: -30px;
		width: 100px;
	}
}
</style>
