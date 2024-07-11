<template>
    <el-form ref="form" :model="formOptions" label-width="80px">
        <el-form-item label="十进制">
            <el-input v-model="formOptions.dec" @change="onDecChange" />
        </el-form-item>
        <el-form-item label="二进制">
            <el-input v-model="formOptions.bin" @change="onBinChange">
                <template v-slot:prepend>0b</template>
            </el-input>
        </el-form-item>
        <el-form-item label="八进制">
            <el-input v-model="formOptions.oct" @change="onOctChange">
                <template v-slot:prepend>0o</template>
            </el-input>
        </el-form-item>
        <el-form-item label="十六进制">
            <el-input v-model="formOptions.hex" @change="onHexChange">
                <template v-slot:prepend>0x</template>
            </el-input>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            formOptions: {
                dec: 0, // 十进制
                bin: 0, // 二进制
                oct: 0, // 8进制
                hex: 0 // 16进制
            }
        }
    },
    methods: {
        onDecChange() {
            const num = Number(this.formOptions.dec.trim())
            this.formOptions.bin = num.toString(2)
            this.formOptions.oct = num.toString(8)
            this.formOptions.hex = num.toString(16).toUpperCase()
        },
        onBinChange() {
            const num = Number('0b' + this.formOptions.bin.trim())

            this.formOptions.dec = num.toString(10)
            this.formOptions.oct = num.toString(8)
            this.formOptions.hex = num.toString(16).toUpperCase()
        },
        onOctChange() {
            const num = Number('0o' + this.formOptions.oct.trim())
            this.formOptions.bin = num.toString(2)
            this.formOptions.dec = num.toString(10)
            this.formOptions.hex = num.toString(16).toUpperCase()
        },
        onHexChange() {
            const num = Number('0x' + this.formOptions.hex.trim())
            this.formOptions.bin = num.toString(2)
            this.formOptions.dec = num.toString(10)
            this.formOptions.oct = num.toString(8)
        }
    }
}
</script>
