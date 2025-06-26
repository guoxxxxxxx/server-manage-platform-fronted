<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="dashboard-header">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-title">服务器总数</div>
          <div class="stat-value">{{ stats.totalServers }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-title">在线服务器</div>
          <div class="stat-value online">{{ stats.onlineServers }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-title">用户总数</div>
          <div class="stat-value">{{ stats.totalUsers }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-title">近一周活跃用户</div>
          <div class="stat-value">{{ stats.activeUsers }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="dashboard-content">
      <el-col :span="16">
        <el-card>
          <div class="chart-title">本项目已开源至Github:</div>
          <div class="chart-title">使用说明请见GitHub</div>
          <div class="chart-title">前端: 🔗https://github.com/guoxxxxxxx/server-manage-platform-fronted</div>
          <div class="chart-title">后端: 🔗https://github.com/guoxxxxxxx/server-manage-platform</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="chart-title">最近登录用户</div>
          <el-table :data="recentUsers" style="width: 100%" size="small">
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="lastLoginTime" label="上次登录时间" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getRecentLoginUsers, getDashboardUserInfo } from '@/api/userAPI'
import { getDashboardServerInfo } from '@/api/serverAPI'

// 仪表盘统计数据
const stats = ref({
  totalServers: 0,
  onlineServers: 0,
  totalUsers: 0,
  activeUsers: 0
})

// 最近登录用户数据
const recentUsers = ref([])

// 获取最近登录用户数据
const getRecentLoginUsersScope = () => { 
    getRecentLoginUsers().then((resp) => {
      if (resp.data.status == 200) {
        recentUsers.value = resp.data.data
      }
    })
}

// 获取dashboard中的信息
const getDashboardInfoScope = () => { 
    getDashboardServerInfo().then((resp) => {
      if (resp.data.status == 200) {
        stats.value.totalServers = resp.data.data.serverCount;
        stats.value.onlineServers = resp.data.data.onlineServerCount;
      }
    });

    getDashboardUserInfo().then((resp) => {
      if (resp.data.status == 200) {
        stats.value.totalUsers = resp.data.data.totalCount;
        stats.value.activeUsers = resp.data.data.activateCount;
      }
    })
}

// 服务器状态分布图表
const serverStatusChart = ref<HTMLDivElement | null>(null)

onMounted(() => { 
    getRecentLoginUsersScope()
    getDashboardInfoScope()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}
.dashboard-header {
  margin-bottom: 20px;
}
.stat-card {
  text-align: center;
  padding: 20px 0;
}
.stat-title {
  font-size: 16px;
  color: #888;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
}
.stat-value.online {
  color: #67C23A;
}
.dashboard-content .el-card {
  min-height: 320px;
}
.chart-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
.chart {
  width: 100%;
  height: 260px;
}
</style>
