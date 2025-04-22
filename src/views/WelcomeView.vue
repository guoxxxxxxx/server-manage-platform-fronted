<template>
  <div style="width: 100vw; height: 100vh; overflow: hidden; display: flex">
    <div style="flex: 1">
      <el-image
        style="width: 100%; height: 100%"
        fit="cover"
        :src="welcomeLeftImage"
      />
    </div>
    <div class="welcome-title">
      <div style="font-size: 40px; font-weight: bold">欢迎使用服务器统一管理平台</div>
    </div>
    <div class="right-card">
      <router-view v-slot="{ Component }">
        <transition name="el-fade-in-linear" mode="out-in">
          <component :is="Component" style="height: 100%" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import welcomeLeftImage from '@/assets/img/welcome.jpeg';

</script>

<style scoped>
.right-card {
  width: 400px;
  z-index: 1;
}

.welcome-title {
  position: absolute;
  top: 30px;
  left: 30px;
  color: white;
  text-shadow: 0 0 10px black;
}
</style>
