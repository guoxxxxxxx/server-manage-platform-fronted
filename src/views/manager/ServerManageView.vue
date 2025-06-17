<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div class="header-container"
                    style="display: flex; justify-content: space-between; height: 60px; align-items: center;">
                    <div class="left" style="display: flex;">
                        <el-input v-model="searchInput" style="width: 240px" placeholder="Please Input"
                            :suffix-icon="Search" />
                        <el-button type="danger" size="small" @click="confirmShutdownSelectedServerDialogVisible = true"
                            style="margin-left: 10px;" v-if="showSelectedServerButton">关闭选中服务器</el-button>
                        <el-button type="primary" size="small" @click="cancelShutdownSelectedServerDialogVisible = true"
                            style="margin-left: 10px;" v-if="showSelectedServerButton">取消关闭选中服务器</el-button>
                    </div>
                    <div class="right" style="display: flex;">
                        <div class="refresh" style="margin-right: 30px;">
                            <el-text class="mx-1">距离下次刷新还有: {{ refreshTime }} 秒</el-text>
                        </div>
                        <div class="shudown">
                            <el-button type="danger" size="small"
                                @click="shutdownAllServerDialogVisible = true">关闭所有服务器</el-button>
                            <el-button size="small"
                                @click="cancelShutdownAllServerDialogVisible = true">取消关闭所有服务器</el-button>
                            <el-button type="success" size="small" @click="refresh">立即刷新</el-button>
                            <el-button type="primary" size="small" @click="clickNew">新建</el-button>
                        </div>
                    </div>
                </div>
            </el-header>
            <el-divider style="margin: 5px;" />
            <el-main class="main-container">
                <div class="setting-contianer">
                    <div style="display: flex; align-items: center; margin-left: 20px;">
                        <span style="font-size: 13px; color: #606266; margin-right: 8px;">仅显示在线服务器</span>
                        <el-switch v-model="onlyShowOnlineServer" inline-prompt :active-icon="Check"
                            :inactive-icon="Close" />
                    </div>
                </div>
                <el-table :data="tableData" style="width: 100%" row-key="id" @selection-change="handleSelectionChange">
                    <el-table-column fixed="left" type="selection" width="55" />
                    <el-table-column prop="id" label="id" width="60" />
                    <el-table-column prop="name" label="主机名" width="120">
                        <template #default="scope">
                            <div style="position: relative; display: inline-block;" v-if="!scope.row.pwdIsCorrect">
                                <el-tag size="small" style="
                                            transform: scale(0.8);
                                            border-radius: 5px;
                                            border: 1px solid #8b0000;
                                            background-color: transparent;
                                            color: #8b0000;
                                            font-size: 16px;
                                            font-weight: bold;
                                            ">
                                    密码错误
                                </el-tag>
                                <div style="height: 100%; align-content: center; width: 100%; text-align: center;">
                                    {{ scope.row.name }}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ip" label="主机ip" width="150" />
                    <el-table-column prop="operatingSystem" label="操作系统" width="200" />
                    <el-table-column prop="location" label="地点" width="120" />
                    <el-table-column prop="owner" label="所有人" width="120" />
                    <el-table-column label="磁盘" max-width="100">
                        <template #default="scope">
                            <el-progress type="dashboard"
                                :percentage="(100.0 - scope.row.freeDiskSpace * 100 / scope.row.diskSpace).toFixed(1)"
                                :color="(scope.row.status === '离线' || !scope.row.pwdIsCorrect || scope.row.status === '重启中') ? '#ccc' : customColors"
                                width="60" />
                        </template>
                    </el-table-column>
                    <el-table-column label="内存" max-width="100">
                        <template #default="scope">
                            <el-progress type="dashboard"
                                :percentage="(100.0 - scope.row.freeMemorySpace * 100 / scope.row.memorySpace).toFixed(1)"
                                :color="(scope.row.status === '离线' || !scope.row.pwdIsCorrect || scope.row.status === '重启中') ? '#ccc' : customColors"
                                width="60" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" width="110">
                        <template #default="scope">
                            <el-tag
                                :type="scope.row.status === '在线' ? 'success' : scope.row.status === '离线' ? 'info' : 'warning'">{{
                                    scope.row.status
                                }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="lastUpdate" label="上次更新时间" width="200" />
                    <el-table-column prop="shutdownRank" label="优先级" width="100">
                        <template #default="scope">
                            <div class="flex gap-2 mt-4">
                                <el-tag type="warning" effect="light" round>
                                    {{ scope.row.shutdownRank }}
                                </el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" min-width="120">
                        <template #default="scope">
                            <div class="container">
                                <div class="container-1">

                                    <el-button link type="primary" size="small" :disabled="scope.row.status === '离线'"
                                        @click="openTerminal(scope.row.id)">终端</el-button>
                                    <el-button link type="primary" size="small"
                                        @click="clickGoToServerDetails(scope.row.id)">
                                        详细信息
                                    </el-button>
                                </div>
                                <div class="container-2">
                                    <el-popconfirm title="确认重启吗?" @confirm="rebootById_(scope.row.id)"
                                        v-if="scope.row.status === '在线'">
                                        <template #reference>
                                            <el-button link type="primary" size="small"
                                                :disabled="scope.row.status === '离线'">重启</el-button>
                                        </template>
                                    </el-popconfirm>
                                    <el-popconfirm title="确认关机吗?" @confirm="shutdownById(scope.row.id)"
                                        v-if="scope.row.status === '在线'">
                                        <template #reference>
                                            <el-button link type="danger" size="small"
                                                :disabled="scope.row.status === '离线'">关机</el-button>
                                        </template>
                                    </el-popconfirm>
                                    <el-popconfirm title="确认取消关机吗?" @confirm="cancelShutdownById_(scope.row.id)"
                                        v-if="scope.row.status === '60s内关机'">
                                        <template #reference>
                                            <el-button link type="success" size="small">取消关机</el-button>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <div class="footer-container" style="width: 100%; display: flex; justify-content: center;">
                    <el-pagination background layout="prev, pager, next" :total="totalSize" :page-size="pageSize"
                        :current-page="currentPage" @current-change="getList(pageSize, currentPage)" />
                </div>
            </el-footer>
        </el-container>
    </div>

    <!-- 关闭所有服务器对话框 -->
    <el-dialog v-model="shutdownAllServerDialogVisible" title="⚠警告: 您正在进行关闭所有服务器操作" width="500" align-center>
        <div class="text" style="margin-top: -20px;">
            请输入: '我确认关闭所有服务器' 来确认关闭服务器
        </div>
        <div class="text">
            <el-input v-model="shutdownAllServerDialogInput" placeholder="我确认关闭所有服务器" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="shutdownAllServerDialogVisible = false">取消</el-button>
                <el-button type="danger" :disabled="shutdownAllServerDialogInput !== '我确认关闭所有服务器'"
                    @click="confirmShutDown([])">
                    关闭
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 取消关闭所有服务器对话框 -->
    <el-dialog v-model="cancelShutdownAllServerDialogVisible" title="取消关闭所有服务器" width="500" align-center>
        <div class="text" style="margin-top: -20px;">
            确认取消关闭所有服务器吗？
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancelShutdownAllServerDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="cancelShutdown([])">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 关闭选中服务器 -->
    <el-dialog v-model="confirmShutdownSelectedServerDialogVisible" title="关闭选中服务器" width="500" align-center>
        <div class="text" style="margin-top: -20px;">
            确定关闭选中服务器吗？
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="confirmShutdownSelectedServerDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="shutdownSelectedServer">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>


    <!-- 取消关闭选中服务器 -->
    <el-dialog v-model="cancelShutdownSelectedServerDialogVisible" title="取消关闭选中服务器" width="500" align-center>
        <div class="text" style="margin-top: -20px;">
            确定取消关闭选中服务器吗？
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancelShutdownSelectedServerDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="cancelShutdownSelectedServer">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { Search, Check, Close } from '@element-plus/icons-vue'
import type { ServerInfo } from '@/api/entity'
import {
    getServersList, updateHardwareInfoByIds, getServerInfoList, closeServerById, rebootById,
    cancelShutdownById, shutdownByIds, cancelShutdownByIds
} from '@/api/serverAPI'
import router from '@/router';
import type { Ref } from 'vue';
import { ElMessage } from 'element-plus';

const shutdownAllServerDialogInput = ref('');
const shutdownAllServerDialogVisible = ref(false);
const cancelShutdownAllServerDialogVisible = ref(false);
const confirmShutdownSelectedServerDialogVisible = ref(false);
const cancelShutdownSelectedServerDialogVisible = ref(false);
const searchInput = ref('');

const refreshTime = ref(60);

// 分页大小
const pageSize = ref(10);
// 条目数
const totalSize = ref(0);
// 当前页
const currentPage = ref(1);
// 显示的在线服务器
const onlyShowOnlineServer = ref(false);

// 是否显示关闭选中服务器按钮
const showSelectedServerButton = ref(false);

// 根据id关闭服务器
const shutdownById = (id: number) => {
    closeServerById(id).then((resp) => {
        if (resp.data.status == 200) {
            ElMessage.success("服务器将在60s后关闭!");
            getList(pageSize.value, currentPage.value);
        }
    })
}

// 根据id取消关闭服务器
const cancelShutdownById_ = (id: number) => {
    cancelShutdownById(id).then((resp) => {
        if (resp.data.status == 200) {
            ElMessage.success("取消成功!");
            getList(pageSize.value, currentPage.value);
        }
    })
}

// 根据id重启服务器
const rebootById_ = (id: number) => {
    rebootById(id).then((resp) => {
        if (resp.data.data) {
            ElMessage.success("重启成功!");
            getList(pageSize.value, currentPage.value);
        }
        else {
            ElMessage.warning("重启失败!");
        }
    })
}

// 点击打开终端按钮
const openTerminal = (id: number) => {
    router.push({ path: "/terminal", query: { serverId: id } })
}

// 点击新建按钮
const clickNew = () => {
    router.push("/add");
}

// 获取服务器列表
const getList = (size: number, no: number,) => {
    console.log(onlyShowOnlineServer.value);

    getServersList(size, no, searchInput.value, onlyShowOnlineServer.value).then((resp) => {
        if (resp.data.status == 200) {
            tableData.value = resp.data.data.data;
            totalSize.value = resp.data.data.total;
            pageSize.value = resp.data.data.pageSize;
            currentPage.value = resp.data.data.currentPage;
        }
    })
}


// 详细信息界面
const clickGoToServerDetails = (serverId: number) => {
    router.push({ path: "/serverDetails", query: { serverId: serverId } })
}

// 刷新当前界面信息
const refresh = () => {
    const ids: number[] = []
    for (let i = 0; i < tableData.value.length; i++) {
        ids.push(tableData.value[i].id)
    };
    updateHardwareInfoByIds(ids).then((resp) => {
        if (resp.data.status == 200) {
            tableData.value = resp.data.data;
            ElMessage.success(`刷新成功`);
        }
    });
}


// 根据id获取服务器信息
const lightResh = () => {
    const ids: number[] = []
    for (let i = 0; i < tableData.value.length; i++) {
        ids.push(tableData.value[i].id)
    };
    getServerInfoList(ids).then((resp) => {
        if (resp.data.status == 200) {
            tableData.value = resp.data.data;
            ElMessage.success(`刷新成功`);
        }
    });
}


const customColors = [
    { color: 'green', percentage: 40 },
    { color: '#409eff', percentage: 75 },
    { color: '#e6a23c', percentage: 90 },
    { color: 'red', percentage: 100 },
]

const multipleSelection = ref<ServerInfo[]>([])



const handleSelectionChange = (val: ServerInfo[]) => {
    multipleSelection.value = val
    console.log(multipleSelection.value);

}

const tableData: Ref<ServerInfo[]> = ref([])

//  关闭指定的服务器
const confirmShutDown = (serverIdList: number[] | null) => {
    shutdownByIds(serverIdList).then((resp) => {
        if (resp.data.status == 200) {
            ElMessage.success("关闭成功!");
            getList(pageSize.value, currentPage.value);
        }
    })
    shutdownAllServerDialogVisible.value = false
}


// 关闭选中服务器
const shutdownSelectedServer = () => {
    let ids: number[] = [];
    for (let i = 0; i < multipleSelection.value.length; i++) {
        ids.push(multipleSelection.value[i].id);
    }
    confirmShutDown(ids);
    confirmShutdownSelectedServerDialogVisible.value = false;
}


// 取消关闭指定的服务器
const cancelShutdown = (serverIdList: number[] | null) => {
    cancelShutdownByIds(serverIdList).then((resp) => {
        if (resp.data.status == 200) {
            ElMessage.success("取消成功!");
            getList(pageSize.value, currentPage.value);
        }
    })
    cancelShutdownAllServerDialogVisible.value = false
}


// 取消关闭选中服务器
const cancelShutdownSelectedServer = () => {
    let ids: number[] = [];
    for (let i = 0; i < multipleSelection.value.length; i++) {
        ids.push(multipleSelection.value[i].id);
    }
    cancelShutdown(ids);
    cancelShutdownSelectedServerDialogVisible.value = false;
}


// 防止定时任务被重复启动
let intervalId: number | null = null;

onMounted(() => {
    getList(10, 1);

    if (intervalId === null) {
        // 定时刷新当前界面信息
        intervalId = setInterval(() => {
            refreshTime.value -= 1;
            if (refreshTime.value <= 0) {
                refreshTime.value = 60;
                lightResh();
            }
        }, 1000);
    }
});

watch(() => multipleSelection.value.length, (newLength) => {
    if (newLength > 0) {
        showSelectedServerButton.value = true;
    }
    else {
        showSelectedServerButton.value = false;
    }
})

// 监视搜索变量和是否显示在线变量
watch(() => [searchInput.value, onlyShowOnlineServer.value], () => {
    getList(pageSize.value, currentPage.value);
})
</script>

<style lang="css" scoped>
.common-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

el-main {
    flex: 1;
}

el-footer {
    text-align: center;
    padding: 20px 0;
}
</style>