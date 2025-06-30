<template>
	<div class="http">
		<el-button type="primary">新增规则</el-button>
		<el-table :data="tableData">
			<el-table-column prop="id" label="ID" width="50" />
			<el-table-column prop="name" label="名称" />
			<el-table-column prop="active" label="生效中" width="70">
				<template #default="scope">
					<el-tag size="small" :type="scope.row.active ? 'success' : 'danger'">
						{{ scope.row.active ? '是' : '否' }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="active" label="操作" width="180">
				<template #default="scope">
					<el-button text type="primary" size="small" @click="() => onDel(scope.index)">
						删除
					</el-button>
					<el-button text type="primary" size="small" @click="() => onEdit(scope.index)">
						编辑
					</el-button>
					<el-button
						text
						type="primary"
						size="small"
						@click="() => onSwitch(scope.index)"
					>
						{{ scope.row.active ? '失效' : '生效' }}
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination
				layout="prev, pager, next"
				:page-size="pageOptions.size"
				:total="list.length"
				@current-change="onPageChange"
			/>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			pageOptions: {
				num: 1,
				size: 5
			},
			list: [
				{
					id: 1,
					name: '设置请求头',
					active: true
				},
				{
					id: 2,
					name: '设置响应头',
					active: false
				},
				{
					id: 3,
					name: '设置跨域',
					active: true
				},
				{
					id: 4,
					name: '设置cookie',
					active: true
				},
				{
					id: 5,
					name: '设置加密',
					active: false
				},
				{
					id: 6,
					name: '重写数据',
					active: true
				},
				{
					id: 7,
					name: '设置加密',
					active: false
				},
				{
					id: 8,
					name: '重写数据',
					active: true
				},
				{
					id: 9,
					name: '设置加密',
					active: false
				},
				{
					id: 10,
					name: '重写数据',
					active: false
				},
				{
					id: 11,
					name: '设置加密',
					active: true
				},
				{
					id: 12,
					name: '重写数据',
					active: false
				}
			]
		}
	},
	computed: {
		tableData() {
			const { size, num } = this.pageOptions
			return this.list.slice((num - 1) * size, size * num)
		}
	},
	methods: {
		onPageChange(pageNum) {
			this.pageOptions.num = pageNum
		},
		onDel(index) {},
		onEdit(index) {},
		onSwitch(index) {}
	}
}
</script>

<style lang="less" scoped>
.http {
	height: 100%;
	min-height: 300px;
	width: 100%;

	.pagination {
		float: right;
		margin-top: 12px;
	}

	:deep(.el-button + .el-button) {
		margin-left: 0;
	}
}
</style>
