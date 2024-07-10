import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import App from './app.vue'

import 'element-plus/dist/index.css'
import './style.less'

const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#root')
