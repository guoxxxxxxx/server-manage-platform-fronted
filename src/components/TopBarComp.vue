<template>
    <el-header class="header">
        <div class="logo">服务器统一管理平台</div>
        <div class="header-right">
            <el-dropdown>
                <span class="user-info">
                    <el-avatar :size="32" />
                    {{ store.currentUser?.username }}
                    <el-icon>
                        <CaretBottom />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <!-- <el-dropdown-item>个人信息</el-dropdown-item> -->
                        <el-dropdown-item @click="router.push('/forget')">修改密码</el-dropdown-item>
                        <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from '@/stores'
import { CaretBottom } from '@element-plus/icons-vue'

const router = useRouter()
const store = useStore()

const handleLogout = () => {
    store.clear()
    router.push('/login')
}
</script>

<style scoped>
.header {
    background-color: #ffffff;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
}


.logo {
  font-size: 20px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
}


.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
</style>