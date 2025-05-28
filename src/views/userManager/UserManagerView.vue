<template>
  <div class="user-manager">
    <el-card>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <el-input v-model="search" placeholder="搜索用户名/邮箱" clearable style="width: 250px;" />
      </div>
      <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
        <el-table :data="users" style="width: 100%; min-height: 500px;">
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="username" label="用户名" width="150" />
          <el-table-column prop="email" label="邮箱" width="200" />
          <el-table-column prop="role" label="角色" width="150">
            <template #default="scope">
              <el-tag type="primary" v-if="scope.row.roleId === 4">用户</el-tag>
              <el-tag type="success" v-if="scope.row.roleId === 3">管理员</el-tag>
              <el-tag type="info" v-if="scope.row.roleId === 5">游客</el-tag>
              <el-tag type="warning" v-if="scope.row.roleId === 2">超级管理员</el-tag>
              <el-tag type="danger" v-if="scope.row.roleId === 1">系统超级管理员</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastLoginIp" label="上次登录ip" width="150" />
          <el-table-column prop="lastLoginTime" label="上次登录时间" width="180" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.locked ? 'danger' : 'success'">
                {{ scope.row.locked ? '禁用' : '启用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template #default="scope">
              <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
              <el-popconfirm title="确定要删除该用户吗？" @confirm="deleteUser(scope.row.id)">
                <template #reference>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
              <el-button size="small" :type="!scope.row.locked ? 'warning' : 'primary'"
                @click="toggleStatus(scope.row)">
                {{ !scope.row.locked ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="width: 100%; display: flex; justify-content: center; align-items: center; margin-top: 20px;">
        <el-pagination background layout="prev, pager, next" :total="totalSize" />
      </div>
    </el-card>


    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" v-model="dialogVisible" width="400px">
      <el-form :model="form" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" autocomplete="off" disabled="true" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" autocomplete="off" disabled="true" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.roleId" placeholder="请选择角色">
            <el-option label="系统超级管理员" value="1" />
            <el-option label="超级管理员" value="2" />
            <el-option label="管理员" value="3" />
            <el-option label="用户" value="4" />
            <el-option label="游客" value="5" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateUserRole">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { toggleLockedById, getUserList, changeUserRole } from '@/api/userAPI'
import type { UserInfo } from "@/api/entity.ts"

// 分页参数
const pageSize = ref(10)
const pageNo = ref(1)
const totalSize = ref(0)

// 查询参数
const queryParams = ref('')

const users = ref<UserInfo[]>([])

const search = ref<string>('')

const dialogVisible = ref<boolean>(false)
const form = reactive<{
  id: number | null
  username: string
  email: string
  roleId: string
  locked: boolean
  password: string
}>({
  id: null,
  username: '',
  email: '',
  roleId: '',
  locked: true,
  password: ''
})

// 点击编辑按钮同步表单数据
function openEditDialog(row: UserInfo) {
  Object.assign(form, {
    id: row.id,
    username: row.username,
    email: row.email,
    locked: row.locked,
  })
  dialogVisible.value = true
}


// 更新用户权限信息
function updateUserRole() {
  changeUserRole(form.id, form.roleId).then((resp) => {
    console.log(resp);
    
    if (resp.data.status == 200) {
      ElMessage.success(`更新成功`);
      dialogVisible.value = false
      getUserPage()
    }
  })
}

function deleteUser(id: number) {
  users.value = users.value.filter(u => u.id !== id)
  ElMessage.success('用户已删除')
}

// 更新用户封禁信息
function toggleStatus(row: UserInfo) {
  toggleLockedById(row.id).then((resp) => {
    if (resp.data.status === 200) {
      row.locked = resp.data.data
      ElMessage.success(`用户已${!row.locked ? '启用' : '禁用'}`)
    }
  })
}


// 分页获取用户信息
const getUserPage = () => {
  getUserList(pageSize.value, pageNo.value, queryParams.value).then((resp) => {
    console.log(resp);
    
    if (resp.data.status == 200) {
      users.value = resp.data.data.data;
      totalSize.value = resp.data.data.total;
      pageSize.value = resp.data.data.pageSize;
      pageNo.value = resp.data.data.currentPage;
    }
  })
}


onMounted(() => {
  getUserPage();
})
</script>

<style scoped>
.user-manager {
  max-width: 100%;
  margin: 30px auto;
}
</style>
