<template>
	<div class="cookies">
		<ul class="menus">
			<li class="menu-item">
				<el-tooltip effect="dark" content="增加Cookie" placement="bottom">
					<el-icon @click="onAdd"><CirclePlus /></el-icon>
				</el-tooltip>
			</li>
			<li class="menu-item">
				<el-tooltip effect="dark" content="刷新Cookie" placement="bottom">
					<el-icon><Refresh /></el-icon>
				</el-tooltip>
			</li>
			<li class="menu-item">
				<el-tooltip effect="dark" content="导入Cookie" placement="bottom">
					<el-icon><UploadFilled /></el-icon>
				</el-tooltip>
			</li>
		</ul>
		<el-table :data="cookies" style="width: 100%" height="450" stripe>
			<el-table-column
				prop="name"
				label="Name"
				:filters="filterOptions"
				:filter-method="onFilter"
				filter-class-name="filter"
			>
				<template #default="scope">
					<el-tooltip effect="dark" :content="scope.row.name" placement="bottom">
						<p class="column-item interactive" @click="() => onShow(scope.row)">
							{{ scope.row.name }}
						</p>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="value" label="Value">
				<template #default="scope">
					<el-tooltip effect="dark" :content="scope.row.value" placement="bottom">
						<p class="column-item">{{ scope.row.value }}</p>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="domain" label="Domain">
				<template #default="scope">
					<el-tooltip effect="dark" :content="scope.row.domain" placement="bottom">
						<p class="column-item">{{ scope.row.domain }}</p>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="expires" label="Expires">
				<template #default="scope">
					<el-tooltip
						effect="dark"
						:content="formatDateTime(scope.row.expirationDate)"
						placement="bottom"
					>
						<p class="column-item">{{ formatDateTime(scope.row.expirationDate) }}</p>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template #default="scope">
					<p class="operation">
						<el-icon @click="() => onEdit(scope.row)"><Edit /></el-icon>
						<el-icon @click="() => onDelete(scope.row)"><Delete /></el-icon>
					</p>
				</template>
			</el-table-column>
		</el-table>
		<el-drawer v-model="showForm" :title="title" size="90%" @closed="onClose">
			<cookie-form
				v-if="showForm"
				:disabled="formDisabled"
				:value="cookie"
				:current-url="currentUrl"
				:current-domain="currentHost"
				@close="() => (showForm = false)"
			/>
		</el-drawer>
	</div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import util from '@/common/util'

import CookieForm from './component/cookie-form.vue'

export default {
	components: {
		CookieForm
	},
	data() {
		return {
			formDisabled: false,
			cookies: [],
			currentHost: '',
			currentUrl: '',
			hosts: [],
			showForm: false,
			cookie: undefined,
			timer: undefined
		}
	},
	computed: {
		filterOptions() {
			return this.cookies.map(item => ({
				text: item.name,
				value: item.name
			}))
		},
		title() {
			if (this.formDisabled) {
				return 'Cookie信息'
			} else if (this.cookie) {
				return '编辑Cookie'
			}

			return '新增Cookie'
		}
	},
	created() {
		if (!chrome.tabs) {
			return
		}

		this.getEffectCookies()

		// cookie发生变化
		chrome.cookies.onChanged.addListener(changeInfo => {
			const { cookie } = changeInfo

			if (!this.hosts.includes(cookie.domain)) {
				return
			}
			console.log('cookie变动: ', changeInfo)
			this.getEffectCookies()
		})
	},
	methods: {
		// 获取当前页面有效的cookies
		async getEffectCookies() {
			const doGetCookie = async () => {
				console.log('11111111111')
				this.currentHost = await new Promise(resolve => {
					chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
						if (!tabs || !tabs.length) {
							resolve(undefined)
						}

						this.currentUrl = tabs[0].url

						const host = new URL(this.currentUrl).hostname
						resolve(host)
					})
				})

				const hosts = this.getHostTree(this.currentHost)

				const allCookies = await new Promise(resolve => {
					chrome.cookies.getAll({ domain: hosts[0] }, cookies => {
						resolve(cookies)
					})
				})

				// 筛选出当前页面生效的cookie
				this.cookies = allCookies.filter(item => {
					return hosts.includes(item.domain)
				})
			}

			// 设置防抖
			if (this.timer) {
				clearTimeout(this.timer)
			}
			this.timer = setTimeout(doGetCookie, 1000)
		},
		getHostTree(fullHost) {
			if (this.hosts.length) {
				return this.hosts
			}

			const list = fullHost.split('.').reverse()

			let host = ''
			const hosts = []
			list.forEach((item, index, array) => {
				host = `${index === array.length - 1 ? '' : '.'}${item}` + host
				if (!['com', 'cn', 'net', 'org'].includes(item)) {
					hosts.push(host)
				}
			})

			this.hosts = hosts
			return hosts
		},
		onFilter(value, row, column) {
			const property = column.property
			return row[property] === value
		},
		formatDateTime(expires) {
			if (!expires) {
				return '会话'
			}
			return util.formatDateTime(expires * 1000)
		},
		onClose() {
			this.cookie = undefined
			this.formDisabled = false
		},
		onAdd() {
			this.showForm = true
		},
		onEdit(data) {
			this.cookie = data
			this.showForm = true
		},
		onShow(data) {
			this.formDisabled = true
			this.cookie = data
			this.showForm = true
		},
		onDelete(cookie) {
			ElMessageBox.confirm(`确认删除${cookie.name}`, '确认提示', {
				distinguishCancelAndClose: true,
				confirmButtonText: '确认',
				cancelButtonText: '取消'
			})
				.then(() => {
					const url = `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`

					chrome.cookies.remove(
						{
							url,
							name: cookie.name
						},
						details => {
							if (
								details === 'null' ||
								details === undefined ||
								details === 'undefined'
							) {
								ElMessage({
									message: '删除Cookie失败',
									type: 'error'
								})
							} else {
								ElMessage({
									message: '删除Cookie成功',
									type: 'success'
								})
							}
						}
					)
				})
				.catch(() => {
					console.log('取消删除Cookie操作')
				})
		}
	}
}
</script>

<style lang="less">
.filter {
	.el-scrollbar {
		max-height: 200px;
	}
}
</style>

<style lang="less" scoped>
.cookies {
	height: 500px;
	width: 100%;

	:deep(.el-drawer__header) {
		margin-bottom: 0;
	}

	.menus {
		align-items: center;
		display: flex;
		flex-direction: row;
		justify-content: center;
		list-style: none;

		.menu-item {
			color: var(--el-color-primary);
			cursor: pointer;
			font-size: 24px;
			padding: 6px;

			& + .menu-item {
				margin-left: 24px;
			}
		}
	}

	.operation {
		.el-icon {
			cursor: pointer;
			padding: 6px;

			& + .el-icon {
				margin-left: 6px;
			}
		}
	}

	.column-item {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		&.interactive {
			cursor: pointer;
		}
	}
}
</style>
