<template>
    <div class="codec">
        <el-input v-model="content" :rows="10" type="textarea" placeholder="请输入内容" resize="none" />
        <p class="result">{{ result }}</p>
        <div class="group-wrap">
            <el-button-group>
                <el-button @click="onEncode" type="primary">encodeURIComponent</el-button>
                <el-button @click="onDecode" type="success">decodeURIComponent</el-button>
            </el-button-group>
        </div>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import util from '@/common/util'

export default {
    data() {
        return {
            result: '',
            content: ''
        }
    },
    methods: {
        onEncode() {
            if (!this.content) {
                return
            }

            this.result = encodeURIComponent(this.content)
            util.copy(this.result)

            ElMessage({
                message: '复制成功',
                type: 'success'
            })
        },
        onDecode() {
            if (!this.content) {
                return
            }

            this.result = decodeURIComponent(this.content)
            util.copy(this.result)

            ElMessage({
                message: '复制成功',
                type: 'success'
            })
        }
    }
}
</script>

<style lang="less" scoped>
.codec {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .result {
        word-wrap: break-word;
        word-break: break-all;
        margin-top: 12px;
        font-size: 14px;
        color: rgb(96, 98, 102);
        width: 100%;
    }

    .group-wrap {
        margin-top: 12px;
    }
}
</style>
