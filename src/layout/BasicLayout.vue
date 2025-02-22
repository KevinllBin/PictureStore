<template>
    <a-layout class="layout-container">
      <Header 
        :username="username"
        :is-login="isLogin"
        @menu-select="handleMenuSelect"
      />
      
      <a-layout-content class="layout-content">
        <slot></slot>
      </a-layout-content>
    </a-layout>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Header from '@/components/Header.vue'
  
  const router = useRouter()
  const username = ref('KevinllBin')
  const isLogin = ref(true)
  
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