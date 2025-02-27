<template>
  <a-layout class="layout-container">
    <Header 
      :username="authStore.username || username"
      :is-login="authStore.isLoggedIn"
      @menu-select="handleMenuSelect"
      @logout="handleLogout"
    />
    
    <a-layout-content class="layout-content">
      <slot></slot>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import Header from '@/components/Header.vue'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('KevinllBin') // 默认用户名，当authStore中没有时使用

// 初始化认证状态
onMounted(() => {
  authStore.initializeAuth()
})

const handleMenuSelect = (key: string) => {
  switch (key) {
    case '1':
      router.push('/')
      break
    case '2-1':
      router.push('/category/scenery')
      break
    case '2-2':
      router.push('/category/portrait')
      break
    case '2-3':
      router.push('/category/animal')
      break
    case '2-4':
      router.push('/category/architecture')
      break
    case '3':
      router.push('/about')
      break
  }
}

// 登出处理函数
const handleLogout = () => {
  // 此函数为空，因为实际的登出逻辑已在 Header 组件中处理
  // 这里只是为了接收 Header 传来的 logout 事件
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.layout-content {
  padding-top: 60px; /* Header的高度 */
  background-color: var(--color-neutral-2);
}
</style>