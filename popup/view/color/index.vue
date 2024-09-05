<template>
    <el-form :model="formOptions" :rules="formRules" ref="form">
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
                        <el-input @change="onHexChange" v-model="formOptions.hex">
                            <template v-slot:prepend>#</template>
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
                                    <el-input @change="() => onRgbChange('r')" v-model="formOptions.rgba.r" />
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
                                    <el-input @change="() => onRgbChange('g')" v-model="formOptions.rgba.g" />
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
                                    <el-input @change="() => onRgbChange('b')" v-model="formOptions.rgba.b" />
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
                                    <el-input @change="onAlphaChange" v-model="formOptions.rgba.a" />
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
import util from '@/common/util'

const alphaHexMap = {
    '1.00': 'FF',
    0.99: 'FC',
    0.98: 'FA',
    0.97: 'F7',
    0.96: 'F5',
    0.95: 'F2',
    0.94: 'F0',
    0.93: 'ED',
    0.92: 'EB',
    0.91: 'E8',
    '0.90': 'E6',
    0.89: 'E3',
    0.88: 'E0',
    0.87: 'DE',
    0.86: 'DB',
    0.85: 'D9',
    0.84: 'D6',
    0.83: 'D4',
    0.82: 'D1',
    0.81: 'CF',
    '0.80': 'CC',
    0.79: 'C9',
    0.78: 'C7',
    0.77: 'C4',
    0.76: 'C2',
    0.75: 'BF',
    0.74: 'BD',
    0.73: 'BA',
    0.72: 'B8',
    0.71: 'B5',
    '0.70': 'B3',
    0.69: 'B0',
    0.68: 'AD',
    0.67: 'AB',
    0.66: 'A8',
    0.65: 'A6',
    0.64: 'A3',
    0.63: 'A1',
    0.62: '9E',
    0.61: '9C',
    '0.60': '99',
    0.59: '96',
    0.58: '94',
    0.57: '91',
    0.56: '8F',
    0.55: '8C',
    0.54: '8A',
    0.53: '87',
    0.52: '85',
    0.51: '82',
    '0.50': '80',
    0.49: '7D',
    0.48: '7A',
    0.47: '78',
    0.46: '75',
    0.45: '73',
    0.44: '70',
    0.43: '6E',
    0.42: '6B',
    0.41: '69',
    '0.40': '66',
    0.39: '63',
    0.38: '61',
    0.37: '5E',
    0.36: '5C',
    0.35: '59',
    0.34: '57',
    0.33: '54',
    0.32: '52',
    0.31: '4F',
    '0.30': '4D',
    0.29: '4A',
    0.28: '47',
    0.27: '45',
    0.26: '42',
    0.25: '40',
    0.24: '3D',
    0.23: '3B',
    0.22: '38',
    0.21: '36',
    '0.20': '33',
    0.19: '30',
    0.18: '2E',
    0.17: '2B',
    0.16: '29',
    0.15: '26',
    0.14: '24',
    0.13: '21',
    0.12: '1F',
    0.11: '1C',
    '0.10': '1A',
    0.09: '17',
    0.08: '14',
    0.07: '12',
    0.06: '0F',
    0.05: '0D',
    0.04: '0A',
    0.03: '08',
    0.02: '05',
    0.01: '03',
    '0.00': '00'
}

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
                            if (!/^[0-9|a-f]{6,8}$/i.test(value) || (value.length !== 6 && value.length !== 8)) {
                                callback(new Error('输入的值无效'))
                            } else if (
                                value.length === 8 &&
                                !Object.values(alphaHexMap).includes(value.substring(6).toUpperCase())
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
        async onCopy(type) {
            const { hex, rgba } = this.formOptions

            // 复制16进制值
            if (type === 'hex') {
                const res = await new Promise((resolve) => {
                    this.$refs.form.validateField('hex', (res) => {
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
                Object.keys(rgba).map((key) => {
                    return new Promise((resolve) => {
                        this.$refs.form.validateField('rgba.' + key, (res) => {
                            resolve(res)
                        })
                    })
                })
            )

            if (res.some((item) => !item)) {
                ElMessage({
                    message: '颜色值无效',
                    type: 'error'
                })
                return
            }

            const { r, g, b, a } = rgba

            if (Number(a) === 1) {
                util.copy(`rgb(${r},${g},${b})`)
            } else {
                util.copy(`rgba(${r},${g},${b},${a})`)
            }

            ElMessage({
                message: '复制成功',
                type: 'success'
            })
        },
        async onHexChange() {
            const res = await new Promise((resolve) => {
                this.$refs.form.validateField('hex', (res) => {
                    resolve(res)
                })
            })

            if (!res) {
                return
            }

            this.hex2Rgba()
        },
        async onRgbChange(hue) {
            const res = await new Promise((resolve) => {
                this.$refs.form.validateField('rgba.' + hue, (res) => {
                    resolve(res)
                })
            })

            if (!res) {
                return
            }

            this.rgba2Hex()
        },
        async onAlphaChange() {
            const res = await new Promise((resolve) => {
                this.$refs.form.validateField('rgba.a', (res) => {
                    resolve(res)
                })
            })

            if (!res) {
                return
            }

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
            Object.keys(this.formOptions.rgba).forEach((key) => {
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

            return alphaHexMap[alpha]
        },
        // 透明度16进制转小数
        hexToDec(hex) {
            if (!/^[\d|a-f]{2}$/i.test(hex)) {
                console.error('16进制透明度无效')
                return 1
            }

            hex = hex.toUpperCase()
            const alpha = Object.entries(alphaHexMap).find(([key, value]) => {
                if (value === hex) {
                    return key
                }
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
			font-size: 14px;
			margin-left: 12px;
			text-decoration: none;
			color: rgb(121, 187, 255);
			display: inline-flex;
			flex-direction: row;
			align-items: center;
		}
	}

	.label {
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		font-weight: bolder;
		font-size: 20px;

		&.r {
			color: #ff0000;
		}

		&.g {
			color: #00ff00;
		}

		&.b {
			color: #0000ff;
		}
	}

	.rgba {
		margin-top: 24px;
	}

	.circle {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		position: absolute;
		right: 60px;
		top: -30px;
	}
}
</style>
