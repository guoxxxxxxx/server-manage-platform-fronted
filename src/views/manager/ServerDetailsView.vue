<template>
    <div class="details-container">
        <div class="header">
            <h2>服务器详细信息</h2>
            <div>
                <el-button type="primary" @click="isEditing = !isEditing"
                    :disabled="serverInfo.loginPassword === '当前用户权限不足!'">
                    {{ isEditing ? '取消编辑' : '编辑' }}
                </el-button>
                <el-button type="danger" @click="dialogVisible = true">
                    删除
                </el-button>
            </div>

            <el-dialog v-model="dialogVisible" title="提示" width="500" :before-close="handleClose">
                <span>确定删除吗？</span>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="deleteServer">
                            确定
                        </el-button>
                    </div>
                </template>
            </el-dialog>

        </div>

        <el-form v-if="isEditing" :model="serverInfo" label-width="120px">
            <el-form-item label="主机名">
                <el-input v-model="serverInfo.name" />
            </el-form-item>
            <el-form-item label="IP地址">
                <el-input v-model="serverInfo.ip" />
            </el-form-item>
            <el-form-item label="SSH端口">
                <el-input v-model="serverInfo.port" />
            </el-form-item>
            <el-form-item label="位置">
                <el-input v-model="serverInfo.location" />
            </el-form-item>
            <el-form-item label="所有者">
                <el-input v-model="serverInfo.owner" />
            </el-form-item>
            <el-form-item label="负责人">
                <el-input v-model="serverInfo.principal" />
            </el-form-item>
            <el-form-item label="维修人员">
                <el-input v-model="serverInfo.repairer" />
            </el-form-item>
            <el-form-item label="维修电话">
                <el-input v-model="serverInfo.repairerPhone" />
            </el-form-item>
            <el-form-item label="价格">
                <el-input v-model="serverInfo.price" type="number" />
            </el-form-item>
            <el-form-item label="登录用户名">
                <el-input v-model="serverInfo.loginUsername" />
            </el-form-item>
            <el-form-item label="登录密码">
                <el-input v-model="serverInfo.loginPassword" />
            </el-form-item>
            <el-form-item label="关机延迟时间">
                <el-input v-model="serverInfo.shutdownDelayTime" />
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="serverInfo.note" type="textarea" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit">提交更新</el-button>
            </el-form-item>
        </el-form>

        <el-descriptions v-else :column="3" border>
            <el-descriptions-item label="ID">{{ serverInfo.id }}</el-descriptions-item>
            <el-descriptions-item label="主机名">{{ serverInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="IP地址">{{ serverInfo.ip }}</el-descriptions-item>

            <el-descriptions-item label="CPU">{{ serverInfo.cpu }}</el-descriptions-item>
            <el-descriptions-item label="操作系统">{{ serverInfo.operatingSystem }}</el-descriptions-item>
            <el-descriptions-item label="SSH端口">{{ serverInfo.port }}</el-descriptions-item>

            <el-descriptions-item label="磁盘空间">
                <el-progress :percentage="(100.0 - serverInfo.freeDiskSpace * 100 / serverInfo.diskSpace).toFixed(1)"
                    :format="format" :color="serverInfo.status === '离线' ? '#ccc' : customColors" />
                已使用: {{ ((serverInfo.diskSpace - serverInfo.freeDiskSpace) / 1024 / 1024).toFixed(2) }}GB /
                总容量: {{ (serverInfo.diskSpace / 1024 / 1024).toFixed(2) }}GB
            </el-descriptions-item>

            <el-descriptions-item label="内存使用">
                <el-progress
                    :percentage="(100.0 - serverInfo.freeMemorySpace * 100 / serverInfo.memorySpace).toFixed(1)"
                    :format="format" :color="serverInfo.status === '离线' ? '#ccc' : customColors" />
                已使用: {{ ((serverInfo.memorySpace - serverInfo.freeMemorySpace) / 1024 / 1024).toFixed(2) }}GB /
                总容量: {{ (serverInfo.memorySpace / 1024 / 1024).toFixed(2) }}GB
            </el-descriptions-item>

            <el-descriptions-item label="位置">{{ serverInfo.location }}</el-descriptions-item>

            <el-descriptions-item label="所有者">{{ serverInfo.owner }}</el-descriptions-item>
            <el-descriptions-item label="负责人">{{ serverInfo.principal }}</el-descriptions-item>
            <el-descriptions-item label="维修人员">{{ serverInfo.repairer }}</el-descriptions-item>

            <el-descriptions-item label="维修电话">{{ serverInfo.repairerPhone }}</el-descriptions-item>
            <el-descriptions-item label="价格">¥{{ serverInfo.price }}</el-descriptions-item>
            <el-descriptions-item label="最后更新时间">{{ serverInfo.lastUpdate }}</el-descriptions-item>

            <el-descriptions-item label="登录用户名:">{{ serverInfo.loginUsername }}</el-descriptions-item>
            <el-descriptions-item label="登录密码:">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <span>{{ showLoginPassword ? serverInfo.loginPassword : '******' }}</span>
                    <el-icon v-if="showLoginPassword" @click="showLoginPassword = false">
                        <View />
                    </el-icon>
                    <el-icon v-else @click="checkAuthorityAndGetLoginPassword">
                        <Hide />
                    </el-icon>
                </div>
            </el-descriptions-item>
            <el-descriptions-item label="密码是否正确:">
                <el-tag :type="serverInfo.pwdIsCorrect ? 'success' : 'danger'">{{ serverInfo.pwdIsCorrect ? '是' : '否'
                }}</el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="当前状态">{{ serverInfo.status }}</el-descriptions-item>
            <el-descriptions-item label="关机延迟时间">{{ serverInfo.shutdownDelayTime }}分钟</el-descriptions-item>
            <el-descriptions-item label="是否在白名单中">
                <el-tag :type="serverInfo.inWhite ? 'success' : 'warning'">{{ serverInfo.inWhite ? '是' : '否'
                }}</el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="备注" :span="3">{{ serverInfo.note }}</el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getServerInfo, updateServerInfoById, deleteServerInfoById } from '@/api/serverAPI'
import { useRoute } from 'vue-router';
import { Hide, View } from '@element-plus/icons-vue';
import router from '@/router';

const customColors = [
    { color: 'green', percentage: 40 },
    { color: '#409eff', percentage: 75 },
    { color: '#e6a23c', percentage: 90 },
    { color: 'red', percentage: 100 },
]

const dialogVisible = ref(false);
const isEditing = ref(false)

const serverInfo = ref({})

const showLoginPassword = ref(false);

const checkAuthorityAndGetLoginPassword = () => {
    if (serverInfo.value.loginPassword == "当前用户权限不足!") {
        ElMessage.error('当前用户权限不足!')
    } else {
        showLoginPassword.value = true
    }
}

const format = (percentage) => {
    return `${percentage}%`
}

const deleteServer = () => {
    deleteServerInfoById(serverInfo.value.id).then((resp) => {
        if (resp.data.status == 200) {
            ElMessage.success('删除成功!')
            router.push('/manager')
        }
    })
    dialogVisible = false;
}

// 获取路由参数
// const currentRoute = useRoute();
// 根据id获取服务器详细信息
const getServerInfoById = (id) => {
    if (id === null) return;
    getServerInfo(id).then(resp => {
        if (resp.data.status === 200) {
            serverInfo.value = resp.data.data;
        }
    })
}

const handleSubmit = () => {
    updateServerInfoById(serverInfo.value).then((resp) => {
        if (resp.data.status === 200 && resp.data.data) {
            ElMessage.success('更新成功')
            isEditing.value = false
        }
        else {
            ElMessage.error('更新失败, 当前用户权限不足!')
        }
    })
}

onMounted(() => {
    // 获取路由参数
    const currentRoute = useRoute();
    getServerInfoById(Number(currentRoute.query.serverId))
})
</script>

<style scoped>
.details-container {
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.header h2 {
    margin: 0;
}
</style>
