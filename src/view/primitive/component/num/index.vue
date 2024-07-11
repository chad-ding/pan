<template>
    <el-form ref="form" :model="formOptions" :rules="formRules" label-width="80px">
        <el-form-item label="十进制" prop="dec">
            <el-input v-model="formOptions.dec" @change="onDecChange" />
        </el-form-item>
        <el-form-item label="二进制" prop="bin">
            <el-input v-model="formOptions.bin" @change="onBinChange">
                <template v-slot:prepend>0b</template>
            </el-input>
        </el-form-item>
        <el-form-item label="八进制" prop="oct">
            <el-input v-model="formOptions.oct" @change="onOctChange">
                <template v-slot:prepend>0o</template>
            </el-input>
        </el-form-item>
        <el-form-item label="十六进制" prop="hex">
            <el-input v-model="formOptions.hex" @change="onHexChange">
                <template v-slot:prepend>0x</template>
            </el-input>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    data() {
        const getValidator = (field) => {
            const validate = (value, callback, type) => {
                let validator = /^(?:0|-?[1-9]\d*)$/
                let number = Number(value)

                if (type === 'bin') {
                    validator = /^(?:0|-?1[01]*)$/
                    number = Number('0b' + value)
                } else if (type === 'oct') {
                    validator = /^(?:0|-?[1-7][0-7]*)$/
                    number = Number('0o' + value)
                } else if (type === 'hex') {
                    validator = /^(?:0|-?[a-f|1-9][a-f0-9]*)$/i
                    number = Number('0x' + value)
                }

                if (!validator.test(value)) {
                    callback(new Error('请输入正确的整数'))
                }

                if (number >= Number.MAX_SAFE_INTEGER || number <= Number.MIN_SAFE_INTEGER) {
                    callback(new Error('数字大小超出范围'))
                } else {
                    callback()
                }
            }

            return [
                {
                    validator(rule, value, callback) {
                        validate(value, callback, field)
                    },
                    trigger: 'blur'
                }
            ]
        }

        return {
            formRules: {
                dec: getValidator('dec'),
                bin: getValidator('bin'),
                oct: getValidator('oct'),
                hex: getValidator('hex')
            },
            formOptions: {
                dec: 0, // 十进制
                bin: 0, // 二进制
                oct: 0, // 8进制
                hex: 0 // 16进制
            }
        }
    },
    methods: {
        async onDecChange() {
            if (!this.formOptions.dec.trim()) {
                return
            }
            const res = await new Promise((resolve) => {
                this.$refs.form.validateField('dec', (res) => {
                    resolve(res)
                })
            })

            if (!res) {
                return
            }

            this.$refs.form.clearValidate()

            const num = Number(this.formOptions.dec.trim())
            this.formOptions.bin = num.toString(2)
            this.formOptions.oct = num.toString(8)
            this.formOptions.hex = num.toString(16).toUpperCase()
        },
        async onBinChange() {
            if (!this.formOptions.bin.trim()) {
                return
            }

            const res = await new Promise((resolve) => {
                this.$refs.form.validateField('bin', (res) => {
                    resolve(res)
                })
            })

            if (!res) {
                return
            }

            this.$refs.form.clearValidate()

            const num = Number('0b' + this.formOptions.bin.trim())

            this.formOptions.dec = num.toString(10)
            this.formOptions.oct = num.toString(8)
            this.formOptions.hex = num.toString(16).toUpperCase()
        },
        async onOctChange() {
            if (!this.formOptions.oct.trim()) {
                return
            }

            const res = await new Promise((resolve) => {
                this.$refs.form.validateField('oct', (res) => {
                    resolve(res)
                })
            })

            if (!res) {
                return
            }

            this.$refs.form.clearValidate()

            const num = Number('0o' + this.formOptions.oct.trim())
            this.formOptions.bin = num.toString(2)
            this.formOptions.dec = num.toString(10)
            this.formOptions.hex = num.toString(16).toUpperCase()
        },
        async onHexChange() {
            if (!this.formOptions.hex.trim()) {
                return
            }

            const res = await new Promise((resolve) => {
                this.$refs.form.validateField('hex', (res) => {
                    resolve(res)
                })
            })

            if (!res) {
                return
            }

            this.$refs.form.clearValidate()

            const num = Number('0x' + this.formOptions.hex.trim())
            this.formOptions.bin = num.toString(2)
            this.formOptions.dec = num.toString(10)
            this.formOptions.oct = num.toString(8)
        }
    }
}
</script>
