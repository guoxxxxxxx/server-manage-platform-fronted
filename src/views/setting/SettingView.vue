<template>
    <div class="whitelist-container">
        <h2>服务器白名单管理</h2>
        <div style="margin-top: -20px; margin-bottom: 20px;">
            <span style="color: grey; font-size: small;">
                白名单中的服务器在批量关机时不会被关机！
            </span>
        </div>
        <el-form :inline="true" class="add-form" @submit.prevent>
            <el-form-item label="请选择服务器">
                <el-select @click="getNonWhiteList" v-model="currentSelect" filterable placeholder="Select" style="width: 240px">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addWhite(currentSelect)">添加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="whitelist" style="width: 100%" v-loading="loading" empty-text="暂无白名单IP">
            <el-table-column prop="ip" label="IP地址" width="200"></el-table-column>
            <el-table-column prop="note" label="备注"></el-table-column>
            <el-table-column label="操作" width="120">
                <template #default="scope">
                    <el-popconfirm title="确定要删除该IP吗？" @confirm="removeIp(scope.$index, scope.row)"
                        confirm-button-text="确定" cancel-button-text="取消">
                        <template #reference>
                            <el-button type="danger" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getWhiteList, addWhiteList, removeWhite } from '@/api/serverAPI'


interface WhitelistItem {
    ip: string
    note?: string
    id: string
}

const whitelist = ref<WhitelistItem[]>([])
const newIp = ref('')
const loading = ref(false)

const currentSelect = ref('')

const options = ref<{ value: string, label: string, id: string }[]>([])

// 获取所有非白名单的内容
const getNonWhiteList = () => {
    getWhiteList(false).then((resp) => {
        if (resp.data.status == 200) {
            options.value = resp.data.data.map((item: any) => ({
                value: item.id,
                label: item.ip + ':' + item.port,
                id: item.id
            }))
        }
    })
}


const getWhitelist_ = (inWhite: boolean) => {
    loading.value = true
    getWhiteList(inWhite).then((resp) => {
        if (resp.data.status == 200) {
            whitelist.value = resp.data.data.map((item: any) => ({
                ip: item.ip,
                note: item.note,
                id: item.id
            }))
            loading.value = false
        }
    })
}

// 删除白名单
const removeWhitelistIp = (id: string) => {
    removeWhite(id).then((resp) => {
        if (resp.data.status == 200) {
            ElMessage.success('删除成功')
            getWhitelist_(true)
        }
    })
}


// 添加白名单
const addWhite = (id: any) => {
    addWhiteList(id).then((resp) => {
        console.log(resp);
        if (resp.data.status == 200) {
            if (resp.data.data.data) {
                ElMessage.success('添加成功')
                getWhitelist_(true)
            }
        }
    })
}


// 删除白名单
const removeIp = async (index: number, row: WhitelistItem) => {
    removeWhitelistIp(row.id);
}

onMounted(() => {
    getWhitelist_(true)
    getNonWhiteList()
})
</script>

<style scoped>
.whitelist-container {
    max-width: 600px;
    margin: 40px auto;
    background: #fff;
    padding: 32px 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px #f0f1f2;
}

.add-form {
    margin-bottom: 24px;
}
</style>
