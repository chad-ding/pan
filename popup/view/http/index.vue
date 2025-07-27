<template>
	<div class="http">
		<div class="header-actions">
			<el-button size="small" type="primary" @click="showAddDialog = true"> 新增规则 </el-button>
			<el-button size="small" type="success" :disabled="!hasRules" @click="toggleAllRules">
				{{ allActive ? "全部失效" : "全部生效" }}
			</el-button>
			<el-button size="small" type="info" @click="exportRules">导出规则</el-button>
			<el-button size="small" type="warning" @click="importRules">导入规则</el-button>
		</div>

		<el-table v-loading="loading" :data="tableData">
			<el-table-column prop="id" label="ID" width="60" />
			<el-table-column prop="name" label="规则名称" />
			<el-table-column prop="urlPattern" label="URL匹配" width="120" />
			<el-table-column prop="modifyType" label="修改类型" width="100">
				<template #default="scope">
					<el-tag size="small" :type="getModifyTypeColor(scope.row.modifyType)">
						{{ getModifyTypeLabel(scope.row.modifyType) }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="target" label="目标" />
			<el-table-column prop="value" label="值" />
			<el-table-column prop="active" label="状态" width="80">
				<template #default="scope">
					<el-tag size="small" :type="scope.row.active ? 'success' : 'danger'">
						{{ scope.row.active ? "生效" : "失效" }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template #default="scope">
					<el-button text type="primary" size="small" @click="() => onEdit(scope.row)"> 编辑 </el-button>
					<el-button text type="primary" size="small" @click="() => onToggle(scope.row)">
						{{ scope.row.active ? "失效" : "生效" }}
					</el-button>
					<el-button text type="danger" size="small" @click="() => onDelete(scope.row)"> 删除 </el-button>
				</template>
			</el-table-column>
		</el-table>

		<div v-if="total > pageSize" class="pagination">
			<el-pagination layout="prev, pager, next" :page-size="pageSize" :total="total" :current-page="currentPage"
				@current-change="onPageChange" />
		</div>

		<!-- 新增/编辑对话框 -->
		<rule-form v-model="showAddDialog" :editing-rule="editingRule" @change="onChange" />

		<!-- 导入对话框 -->
		<import-form v-model="showImportDialog" />
	</div>
</template>

<script>
import { STORAGE_KEY } from './common/consts'
import { saveRules } from './common/util'

import storage from "../../common/storage"
import ImportForm from "./component/import-form/index.vue"
import RuleForm from './component/rule-form/index.vue'

export default {
	components: {
		ImportForm,
		RuleForm
	},
	data() {
		return {
			loading: false,
			saving: false,
			importing: false,
			showAddDialog: false,
			showImportDialog: false,
			editingRule: null,
			currentPage: 1,
			pageSize: 10,
			importData: "",
			rules: {
				name: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
				urlPattern: [{ required: true, message: "请输入URL匹配模式", trigger: "blur" }],
				modifyType: [{ required: true, message: "请选择修改类型", trigger: "change" }],
				operation: [{ required: true, message: "请选择操作类型", trigger: "change" }],
				target: [{ required: true, message: "请输入目标", trigger: "blur" }],
				value: [{ required: true, message: "请输入值", trigger: "blur" }],
				priority: [{ required: true, message: "请输入优先级", trigger: "blur" }]
			},
			ruleForm: {
				name: "",
				urlPattern: "",
				modifyType: "requestHeader",
				operation: "set",
				target: "",
				value: "",
				priority: 1
			},
			rulesList: []
		}
	},
	computed: {
		total() {
			return this.rulesList.length
		},
		tableData() {
			const start = (this.currentPage - 1) * this.pageSize
			const end = start + this.pageSize
			return this.rulesList.slice(start, end)
		},
		hasRules() {
			return this.rulesList.length > 0
		},
		allActive() {
			return this.rulesList.length > 0 && this.rulesList.every(rule => rule.active)
		}
	},
	async created() {
		this.loading = true
		try {
			const rules = await storage.get(STORAGE_KEY, [])
			this.rulesList = rules || []
		} catch (error) {
			console.error("加载规则失败:", error)
			this.rulesList = []
		} finally {
			this.loading = false
		}
	},
	methods: {
		saveRules() {
			saveRules(this.rulesList)
		},
		onChange(rulesList) {
			this.rulesList = rulesList
		},
		onPageChange(page) {
			this.currentPage = page
		},
		onEdit(rule) {
			this.editingRule = rule
			this.ruleForm = { ...rule }
			this.showAddDialog = true
		},
		async onToggle(rule) {
			rule.active = !rule.active
			await this.saveRules()
		},
		async onDelete(rule) {
			try {
				await this.$confirm("确定要删除这个规则吗？", "提示", {
					type: "warning"
				})
				const index = this.rulesList.findIndex(r => r.id === rule.id)
				if (index > -1) {
					this.rulesList.splice(index, 1)
					await this.saveRules()
					this.$message.success("删除成功")
				}
			} catch (error) {
				// 用户取消删除
			}
		},
		async toggleAllRules() {
			const newStatus = !this.allActive
			this.rulesList.forEach(rule => {
				rule.active = newStatus
			})
			await this.saveRules()
			this.$message.success(newStatus ? "全部规则已生效" : "全部规则已失效")
		},
		getModifyTypeColor(type) {
			const colors = {
				requestHeader: "primary",
				responseHeader: "success",
				requestUrl: "warning"
			}
			return colors[type] || "info"
		},
		getModifyTypeLabel(type) {
			const labels = {
				requestHeader: "请求头",
				responseHeader: "响应头",
				requestUrl: "请求地址"
			}
			return labels[type] || type
		},
		exportRules() {
			const data = JSON.stringify(this.rulesList, null, 2)
			const blob = new Blob([data], { type: "application/json" })
			const url = URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = "http-modifier-rules.json"
			a.click()
			URL.revokeObjectURL(url)
			this.$message.success("规则导出成功")
		},
		importRules() {
			this.showImportDialog = true
		}
	}
}
</script>

<style lang="less" scoped>
.http {
	height: 100%;
	min-height: 300px;
	width: 100%;

	.header-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-bottom: 16px;
	}

	.pagination {
		float: right;
		margin-top: 12px;
	}
}
</style>
