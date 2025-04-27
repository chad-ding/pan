<template>
	<div class="cookies">
		<ul class="menus">
			<li class="menu-item">
				<el-tooltip effect="dark" content="增加Cookie" placement="bottom">
					<el-icon><CirclePlus /></el-icon>
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
		<el-table :data="cookies" style="width: 100%" height="350" stripe>
			<el-table-column
				prop="name"
				label="Name"
				:filters="filterOptions"
				:filter-method="onFilter"
				filter-class-name="filter"
			>
				<template #default="scope">
					<el-tooltip effect="dark" :content="scope.row.name" placement="bottom">
						<p class="column-item">{{ scope.row.name }}</p>
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
	</div>
</template>

<script>
import util from '@/common/util'

export default {
	data() {
		return {
			cookies: [],
			currentHost: '',
			hosts: []
		}
	},
	computed: {
		filterOptions() {
			return this.cookies.map(item => ({
				text: item.name,
				value: item.name
			}))
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
			this.currentHost = await new Promise(resolve => {
				chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
					if (!tabs || !tabs.length) {
						resolve(undefined)
					}

					const host = new URL(tabs[0].url).hostname
					resolve(host)
				})
			})

			const hosts = this.getHostTree(this.currentHost)

			console.log('>>>>>>>> ', hosts)

			const allCookies = await new Promise(resolve => {
				chrome.cookies.getAll({ domain: hosts[0] }, cookies => {
					resolve(cookies)
				})
			})

			// 筛选出当前页面生效的cookie
			this.cookies = allCookies.filter(item => {
				return hosts.includes(item.domain)
			})
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
		onEdit() {},
		onDelete() {}
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
	height: 100%;
	width: 100%;

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
	}
}
</style>
