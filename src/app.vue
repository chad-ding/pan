<template>
    <div class="app">
        <el-tabs v-model="currenTab">
            <el-tab-pane name="qrcode" label="二维码">
                <qr-code />
            </el-tab-pane>
            <el-tab-pane name="color" label="色值转换">
                <color />
            </el-tab-pane>
            <el-tab-pane name="json" label="JSON格式化">
                <json />
            </el-tab-pane>
            <el-tab-pane name="codec" label="URI编解码">
                <codec />
            </el-tab-pane>
            <el-tab-pane name="primitive" label="原始类型转化">
                <primitive />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import QrCode from '@/view/qrcode/index.vue'
import Codec from '@/view/codec/index.vue'
import Color from '@/view/color/index.vue'
import Json from '@/view/json/index.vue'
import Primitive from '@/view/primitive/index.vue'

export default {
    components: {
        QrCode,
        Codec,
        Color,
        Json,
        Primitive
    },
    data() {
        return {
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
