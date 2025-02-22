<template>
  <a-config-provider>
    <basic-layout>
      <router-view></router-view>
    </basic-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import BasicLayout from '@/layout/BasicLayout.vue'
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}
</style>