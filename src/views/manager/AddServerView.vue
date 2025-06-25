<template>
    <div class="add-server-container">
        <div style="width: 100%; display: flex; justify-content: right; padding-bottom: 10px;">
            <el-button type="warning" size="small" @click="clickBack">返回</el-button>
        </div>
        <el-form :model="serverForm" label-width="120px">
            <div v-for="(server, index) in serverForm.servers" :key="index" class="server-item">
                <el-collapse v-model="activeCollapse">
                    <el-collapse-item :name="index">
                        <template #title>
                            <div class="collapse-title">
                                <span>
                                    服务器 #{{ index + 1 }}
                                </span>
                                <span class="summary-info" v-if="server.name || server.ip">
                                    {{ server.name ? server.name : '未命名' }} | {{ server.ip ? server.ip : 'IP未设置' }}
                                </span>
                            </div>
                        </template>

                        <div class="server-header">
                            <h3>服务器详细信息</h3>
                            <div>
                                <span style="color: red; margin-right: 10px;" v-if="showFailMessage">添加失败,
                                    IP错误或数据库中已存在该用户对应该服务器的信息。</span>
                                <el-button type="danger" @click.stop="removeServer(index)"
                                    v-if="serverForm.servers.length > 1">
                                    删除
                                </el-button>
                            </div>
                        </div>

                        <el-form-item label="主机名">
                            <el-input v-model="server.name" />
                        </el-form-item>

                        <el-form-item label="IP地址">
                            <el-input v-model="server.ip" />
                        </el-form-item>

                        <el-form-item label="端口号">
                            <el-input v-model="server.port" />
                        </el-form-item>

                        <el-form-item label="地点">
                            <el-input v-model="server.location" />
                        </el-form-item>

                        <el-form-item label="所有人">
                            <el-input v-model="server.owner" />
                        </el-form-item>

                        <el-form-item label="负责人">
                            <el-input v-model="server.principal" />
                        </el-form-item>

                        <el-form-item label="维修人">
                            <el-input v-model="server.repairer" />
                        </el-form-item>

                        <el-form-item label="维修人电话">
                            <el-input v-model="server.repairerPhone" />
                        </el-form-item>

                        <el-form-item label="价格">
                            <el-input-number v-model="server.price" :precision="2" :step="0.1" />
                        </el-form-item>

                        <el-form-item label="系统登录用户名">
                            <el-input v-model="server.loginUsername" />
                        </el-form-item>

                        <el-form-item label="系统登录密码">
                            <el-input v-model="server.loginPassword" />
                        </el-form-item>

                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="server.note" />
                        </el-form-item>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-form>

        <div class="form-actions">
            <el-button type="primary" @click="addServer">添加更多服务器</el-button>
            <el-button type="success" @click="submitForm">提交</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addServers } from '@/api/serverAPI'
import router from '@/router'

// 点击返回按钮
const clickBack = () => {
    router.back();
}

const activeCollapse = ref([0])
const showFailMessage = ref(false)

const serverForm = reactive({
    servers: [
        {
            name: '',
            ip: '',
            location: '',
            owner: '',
            principal: '',
            repairer: '',
            repairerPhone: '',
            price: 0,
            note: '',
            loginPassword: '',
            loginUsername: '',
            port: ''
        }
    ]
})

const addServer = () => {
    const newIndex = serverForm.servers.length
    serverForm.servers.push({
        name: '',
        ip: '',
        location: '',
        owner: '',
        principal: '',
        repairer: '',
        repairerPhone: '',
        price: 0,
        note: '',
        loginPassword: '',
        loginUsername: '',
        port: ''
    })
    activeCollapse.value = [newIndex]
}

const removeServer = (index: number) => {
    serverForm.servers.splice(index, 1)
    // 如果删除的是当前展开的服务器，则展开最后一个服务器
    if (activeCollapse.value.includes(index)) {
        activeCollapse.value = [serverForm.servers.length - 1]
    }
}


const submitForm = () => {
    addServers(serverForm.servers).then((resp) => {
        if (resp.data.status == 200 && resp.data.data.allSuccess) {
            ElMessage.success('添加成功')
            router.push("/manager")
        }
        else {
            // 删除已经成功的信息，将未成功添加的信息在界面保留
            serverForm.servers = resp.data.data.failServerInfoList
            showFailMessage.value = true
            ElMessage.warning('未添加成功的服务器信息已在界面中保留')
        }
    })
}

</script>

<style scoped>
.add-server-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.server-item {
    margin-bottom: 20px;
}

.server-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.form-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

.collapse-title {
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 20px;
}

.summary-info {
    font-size: 14px;
    color: #909399;
}

:deep(.el-collapse-item__header) {
    font-size: 16px;
    font-weight: bold;
}

:deep(.el-collapse-item__content) {
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 4px;
}
</style>