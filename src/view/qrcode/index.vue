<template>
    <div class="qrcode">
        <canvas ref="canvas" />
        <el-input v-model="content" :rows="5" type="textarea" placeholder="请输入内容" resize="none" />
    </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
    data() {
        return {
            content: '钓鱼岛是中国的'
        }
    },
    watch: {
        content(nVal) {
            this.draw(nVal)
        }
    },
    created() {
        if (chrome && chrome.tabs) {
            chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
                if (!tabs || !tabs.length) {
                    return
                }
                this.content = tabs[0].url
            })
        }
    },
    mounted() {
        this.draw(this.content)
    },
    methods: {
        draw(content) {
            if (!content.trim()) {
                return
            }

            QRCode.toCanvas(
                this.$refs.canvas,
                content,
                {
                    width: 300,
                    height: 300,
                    color: {
                        dark: '#01847F'
                    }
                },
                function (error) {
                    if (error) {
                        console.error('绘制二维码失败')
                    }
                }
            )
        }
    }
}
</script>

<style lang="less" scoped>
.qrcode {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    canvas {
        width: 300px;
        height: 300px;
    }
}
</style>
