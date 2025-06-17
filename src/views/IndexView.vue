<template>
  <el-container class="layout-container">
    <TopBarComp class="top-bar"></TopBarComp>

    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu
          default-active="1"
          class="menu"
          :router="true"
        >
          <el-menu-item index="/dashboard">
            <el-icon><Monitor /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/manager">
            <el-icon><Cpu /></el-icon>
            <span>服务器管理</span>
          </el-menu-item>
          <el-menu-item index="/userManager">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>

    <el-footer class="footer">
      <div>Copyright © 2024 服务器统一管理平台</div>
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import { Monitor, Setting, User, Cpu } from '@element-plus/icons-vue'
import TopBarComp from '@/components/TopBarComp.vue';

</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.menu {
  height: 100%;
  border-right: none;
}

.footer {
  background-color: #ffffff;
  border-top: 1px solid #e6e6e6;
  text-align: center;
  line-height: 60px;
  color: #666;
}

.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* 保证在最上层 */
}

.aside {
    position: fixed;
    top: 60px;
    width: 200px;
}

.main {
    margin-top: 60px;
    margin-left: 200px;
}
</style>