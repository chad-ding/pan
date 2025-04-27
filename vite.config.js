import path from 'path'
import ip from 'ip'
import { defineConfig } from 'vite'
import dateFormat from 'date-format'
import Vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
	console.info('开始编译打包: ', mode)

	return {
		base: './',
		server: {
			host: ip.address(),
			port: 8081,
			disableHostCheck: true
		},
		build: {
			outDir: 'dist/popup',
			rollupOptions: {
				output: {
					assetFileNames: assetInfo => {
						const info = assetInfo.name.split('.')
						let extType = info[info.length - 1]
						if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
							extType = 'media'
						} else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
							extType = 'img'
						} else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
							extType = 'fonts'
						}
						return `static/${extType}/[hash][extname]`
					},
					chunkFileNames: 'static/js/[hash].js',
					entryFileNames: 'static/js/[hash].js'
				}
			}
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './popup')
			}
		},
		plugins: [
			// 打印出代码编译的时间
			createHtmlPlugin({
				pages: [
					{
						template: 'index.html'
					}
				]
			}),
			Vue(),
			AutoImport({
				dts: false,
				resolvers: [ElementPlusResolver()]
			}),
			Components({
				dts: false,
				resolvers: [ElementPlusResolver()]
			})
		],
		define: {
			__BUILD_DATE__: JSON.stringify(dateFormat('yyyy-MM-dd hh:mm:ss', new Date())) // 代码编译时间
		}
	}
})
