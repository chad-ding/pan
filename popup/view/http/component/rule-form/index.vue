<template>
    <el-dialog v-model="showRuleFormDialog" :title="editingRule ? '编辑HTTP规则' : '新增HTTP规则'" width="700px"
        @closed="onClose">
        <el-form ref="formRef" :model="formFields" :rules="formRules" label-width="120px">
            <el-form-item label="规则名称" prop="name">
                <el-input v-model="formFields.name" placeholder="请输入规则名称" />
            </el-form-item>
            <el-form-item label="URL匹配模式" prop="urlPattern">
                <el-input v-model="formFields.urlPattern" placeholder="例如: *://*.example.com/*" />
                <div class="form-tip">支持通配符: * 表示任意字符</div>
            </el-form-item>
            <el-form-item label="修改类型" prop="modifyType">
                <el-select v-model="formFields.modifyType" placeholder="请选择修改类型" @change="onModifyTypeChange">
                    <el-option label="请求头" value="requestHeader" />
                    <el-option label="响应头" value="responseHeader" />
                    <el-option label="请求地址" value="requestUrl" />
                </el-select>
            </el-form-item>
            <el-form-item label="操作类型" prop="operation">
                <el-select v-model="formFields.operation" placeholder="请选择操作类型">
                    <el-option label="设置" value="set" />
                    <el-option label="删除" value="remove" />
                    <el-option v-if="formFields.modifyType === 'requestUrl'" label="重定向" value="redirect" />
                </el-select>
            </el-form-item>
            <el-form-item label="目标" prop="target">
                <el-input v-model="formFields.target" :placeholder="targetPlaceholder" />
                <div v-if="
                    formFields.modifyType === 'requestHeader' ||
                    formFields.modifyType === 'responseHeader'
                " class="form-tip">
                    输入HTTP头名称，如: User-Agent, Content-Type
                </div>
                <div v-if="formFields.modifyType === 'requestUrl'" class="form-tip">
                    输入重定向的目标URL，支持相对路径
                </div>
            </el-form-item>
            <el-form-item v-if="formFields.operation !== 'remove'" label="值" prop="value">
                <el-input v-model="formFields.value" :placeholder="valuePlaceholder" />
                <div v-if="
                    formFields.modifyType === 'requestHeader' ||
                    formFields.modifyType === 'responseHeader'
                " class="form-tip">
                    输入HTTP头的值
                </div>
            </el-form-item>
            <el-form-item label="优先级" prop="priority">
                <el-input-number v-model="formFields.priority" :min="1" :max="100" />
                <div class="form-tip">数字越大优先级越高</div>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" :loading="saving" @click="doSaveRule">保存</el-button>
            <el-button @click="doClose">取消</el-button>
        </template>
    </el-dialog>
</template>

<script>
import { saveRules } from '../../common/util'

export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        editingRule: {
            type: Object,
            default: undefined
        },
        rulesList: {
            type: Array,
            default: () => []
        }
    },
    emits: ['update:modelValue', 'change'],
    data() {
        return {
            showRuleFormDialog: false,
            formRules: {
                name: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
                urlPattern: [{ required: true, message: "请输入URL匹配模式", trigger: "blur" }],
                modifyType: [{ required: true, message: "请选择修改类型", trigger: "change" }],
                operation: [{ required: true, message: "请选择操作类型", trigger: "change" }],
                target: [{ required: true, message: "请输入目标", trigger: "blur" }],
                value: [{ required: true, message: "请输入值", trigger: "blur" }],
                priority: [{ required: true, message: "请输入优先级", trigger: "blur" }]
            },
            formFields: {
                name: "",
                urlPattern: "",
                modifyType: "requestHeader",
                operation: "set",
                target: "",
                value: "",
                priority: 1
            },
            saving: false
        }
    },
    computed: {
        valuePlaceholder() {
            const placeholders = {
                requestHeader: "例如: Mozilla/5.0...",
                responseHeader: "例如: *",
                requestUrl: "例如: https://api.example.com/v2/*"
            }
            return placeholders[this.formFields.modifyType] || ""
        },
        targetPlaceholder() {
            const placeholders = {
                requestHeader: "例如: User-Agent, Content-Type",
                responseHeader: "例如: Access-Control-Allow-Origin",
                requestUrl: "例如: https://new-domain.com/api/*"
            }
            return placeholders[this.formFields.modifyType] || ""
        }
    },
    watch: {
        modelValue: {
            handler(nVal) {
                this.showRuleFormDialog = nVal
            },
            immediate: true
        }
    },
    methods: {
        onClose() {
            this.ruleForm = {
                name: "",
                urlPattern: "",
                modifyType: "requestHeader",
                operation: "set",
                target: "",
                value: "",
                priority: 1
            }

            this.$refs.formRef?.resetFields()
        },
        doClose() {
            this.$emit('update:modelValue', false)
        },
        onModifyTypeChange() {
            // 根据修改类型调整操作类型选项
            if (this.formFields.modifyType === "requestUrl") {
                this.formFields.operation = "redirect"
            } else {
                this.formFields.operation = "set"
            }
        },
        async doSaveRule() {
            try {
                await this.$refs.formRef.validate()
                this.saving = true

                const rulesList = this.rulesList.slice(0)

                if (this.editingRule) {
                    // 编辑现有规则
                    const index = rulesList.findIndex(r => r.id === this.editingRule.id)
                    if (index > -1) {
                        rulesList[index] = { ...this.formFields }
                    }
                } else {
                    // 新增规则
                    const newRule = {
                        ...this.formFields,
                        id: Date.now(),
                        active: true
                    }
                    rulesList.unshift(newRule)
                }

                await saveRules()

                this.showRuleFormDialog = false
                this.resetForm()
                this.$message.success(this.editingRule ? "编辑成功" : "添加成功")

                this.$emit('change', rulesList)
                this.doClose()
            } catch (error) {
                console.error("保存规则失败:", error)
            } finally {
                this.saving = false
            }
        }
    }
}
</script>

<style lang="less">
.form-tip {
    color: #999;
    font-size: 12px;
    margin-left: 4px;
    margin-top: 4px;
}
</style>
