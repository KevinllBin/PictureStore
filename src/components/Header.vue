<template>
  <div class="header-container">
    <div class="menu-demo">
      <a-menu mode="horizontal" :default-selected-keys="['1']" @menu-item-click="handleMenuClick">
        <a-menu-item key="0" :style="{ padding: 0, marginRight: '38px' }" disabled>
          <div class="logo-placeholder">
            <img src="@/assets/1.svg" alt="Logo" style="width: 80px; height: 30px;" />
            </div>
        </a-menu-item>
        <a-menu-item key="1">主页</a-menu-item>
        <a-sub-menu key="2">
          <template #title>分类</template>
          <a-menu-item key="2-1">风景</a-menu-item>
          <a-menu-item key="2-2">人物</a-menu-item>
          <a-menu-item key="2-3">动物</a-menu-item>
          <a-menu-item key="2-4">建筑</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="3">关于</a-menu-item>
        <a-menu-item key="4">
          <a href="https://github.com/KevinllBin" target="_blank" style="text-decoration: none; color: inherit;">
            Github
          </a>
        </a-menu-item>

        <!-- 右侧用户信息 -->
        <div class="header-right">
          <a-space>
            <a-dropdown trigger="click">
              <a-avatar>
                <img src="@/assets/avatar.svg" alt="Avatar" style="width: 40px;height: 40px; border-radius: 50%;" />
              </a-avatar>
              <template #content>
                <a-doption>
                  <template #icon><icon-user /></template>
                  {{ username }}
                </a-doption>
                <a-doption>
                  <template #icon><icon-settings /></template>
                  设置
                </a-doption>
                <a-doption>
                  <template #icon><icon-export /></template>
                  退出登录
                </a-doption>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </a-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

// 定义属性
defineProps<{ 
  username: string;
  isLogin: boolean;
 }>()

// 定义事件
const emit = defineEmits(['menu-select', 'upload'])

// 处理菜单点击
const handleMenuClick = (key: string) => {
  emit('menu-select', key)
}
</script>

<style scoped>
.header-container {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
}


.logo-placeholder {
  width: 80px;
  height: 30px;
  border-radius: 2px;
  background: var(--color-fill-3);
  cursor: text;
}

.header-right {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
}

:deep(.arco-menu) {
  display: flex;
  align-items: center;
}
</style>
