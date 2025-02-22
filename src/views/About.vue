<template>
    <div class="about-container">
      <div class="about-header">
        <a-typography-title :heading="2">关于图片收藏夹</a-typography-title>
        <p class="update-time">最后更新时间：{{ currentTime }}</p>
      </div>
  
      <!-- 项目介绍卡片 -->
      <a-card class="info-card">
        <template #title>
          <div class="card-title">
            <icon-info-circle /> 项目介绍
          </div>
        </template>
        <a-timeline>
          <a-timeline-item>
            <template #dot>
              <icon-heart-fill style="color: #ff4d4f" />
            </template>
            <div class="timeline-content">
              <h4>项目愿景</h4>
              <p>打造一个简单易用、功能强大的图片收藏与分享平台，让用户能够方便地管理和分享自己喜爱的图片。</p>
            </div>
          </a-timeline-item>
          <a-timeline-item>
            <template #dot>
              <icon-bulb style="color: #faad14" />
            </template>
            <div class="timeline-content">
              <h4>核心功能</h4>
              <a-space direction="vertical" style="width: 100%">
                <a-tag>图片分类管理</a-tag>
                <a-tag>智能搜索</a-tag>
                <a-tag>收藏功能</a-tag>
                <a-tag>分享功能</a-tag>
              </a-space>
            </div>
          </a-timeline-item>
          <a-timeline-item>
            <template #dot>
              <icon-code-square style="color: #165dff" />
            </template>
            <div class="timeline-content">
              <h4>技术栈</h4>
              <div class="tech-stack">
                <a-space wrap>
                  <a-tag color="arcoblue">Vue 3</a-tag>
                  <a-tag color="arcoblue">TypeScript</a-tag>
                  <a-tag color="arcoblue">Vite</a-tag>
                  <a-tag color="arcoblue">Arco Design</a-tag>
                </a-space>
              </div>
            </div>
          </a-timeline-item>
        </a-timeline>
      </a-card>
  
      <!-- 作者信息卡片 -->
      <a-card class="info-card">
        <template #title>
          <div class="card-title">
            <icon-user /> 作者信息
          </div>
        </template>
        <div class="author-info">
          <a-avatar :size="64" class="author-avatar">
            <img src="@/assets/avatar.svg" alt="Author Avatar" />
          </a-avatar>
          <div class="author-details">
            <h3>{{ authorName }}</h3>
            <p>Full Stack Developer</p>
            <div class="social-links">
              <a-space>
                <a-button 
                  type="primary" 
                  shape="circle"
                  @click="navigateToGithub"
                >
                  <template #icon><icon-github /></template>
                </a-button>
                <a-tooltip content="Email: kevin@example.com">
                  <a-button shape="circle">
                    <template #icon><icon-email /></template>
                  </a-button>
                </a-tooltip>
                <a-tooltip content="Blog">
                  <a-button shape="circle">
                    <template #icon><icon-book /></template>
                  </a-button>
                </a-tooltip>
              </a-space>
            </div>
          </div>
        </div>
      </a-card>
  
      <!-- 项目统计卡片 -->
      <div class="stats-grid">
        <a-card class="stat-card" :style="{ background: 'var(--color-primary-light-1)' }">
          <a-statistic
            title="用户数"
            :value="1234"
            show-group-separator
            animation
          >
            <template #prefix>
              <icon-user />
            </template>
          </a-statistic>
        </a-card>
        <a-card class="stat-card" :style="{ background: 'var(--color-success-light-1)' }">
          <a-statistic
            title="图片总数"
            :value="5678"
            show-group-separator
            animation
          >
            <template #prefix>
              <icon-image />
            </template>
          </a-statistic>
        </a-card>
        <a-card class="stat-card" :style="{ background: 'var(--color-warning-light-1)' }">
          <a-statistic
            title="收藏数"
            :value="9012"
            show-group-separator
            animation
          >
            <template #prefix>
              <icon-heart />
            </template>
          </a-statistic>
        </a-card>
        <a-card class="stat-card" :style="{ background: 'var(--color-danger-light-1)' }">
          <a-statistic
            title="分享数"
            :value="3456"
            show-group-separator
            animation
          >
            <template #prefix>
              <icon-share />
            </template>
          </a-statistic>
        </a-card>
      </div>
  
      <!-- 联系我们卡片 -->
      <a-card class="info-card">
        <template #title>
          <div class="card-title">
            <icon-message /> 联系我们
          </div>
        </template>
        <a-form 
          :model="contactForm" 
          @submit="handleSubmit"
          layout="vertical"
        >
          <a-form-item field="name" label="姓名">
            <a-input v-model="contactForm.name" placeholder="请输入您的姓名" />
          </a-form-item>
          <a-form-item field="email" label="邮箱">
            <a-input v-model="contactForm.email" placeholder="请输入您的邮箱" />
          </a-form-item>
          <a-form-item field="message" label="留言">
            <a-textarea 
              v-model="contactForm.message" 
              placeholder="请输入您的留言"
              :max-length="500"
              show-word-limit
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">
              发送留言
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { Message } from '@arco-design/web-vue'
  
  const currentTime = ref('2025-02-22 09:37:28')
  const authorName = ref('KevinllBin')
  
  const contactForm = reactive({
    name: '',
    email: '',
    message: ''
  })
  
  const handleSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      Message.warning('请填写完整信息')
      return
    }
    
    // 这里应该调用实际的API
    Message.success('留言已发送，我们会尽快回复！')
    // 重置表单
    Object.assign(contactForm, {
      name: '',
      email: '',
      message: ''
    })
  }
  
  const navigateToGithub = () => {
    window.open('https://github.com/KevinllBin', '_blank')
  }
  </script>
  
  <style scoped>
  .about-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }
  
  .about-header {
    margin-bottom: 24px;
    text-align: center;
  }
  
  .update-time {
    color: var(--color-text-3);
    margin-top: 8px;
  }
  
  .info-card {
    margin-bottom: 24px;
    border-radius: 8px;
  }
  
  .info-card :deep(.arco-card-header) {
    border-bottom: 1px solid var(--color-border);
  }
  
  .card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
  }
  
  .timeline-content {
    h4 {
      margin: 0 0 8px;
      color: var(--color-text-1);
    }
    p {
      color: var(--color-text-2);
      margin: 0;
    }
  }
  
  .tech-stack {
    margin-top: 8px;
  }
  
  .author-info {
    display: flex;
    align-items: flex-start;
    gap: 24px;
  }
  
  .author-avatar {
    flex-shrink: 0;
  }
  
  .author-details {
    h3 {
      margin: 0 0 4px;
      color: var(--color-text-1);
    }
    p {
      margin: 0 0 16px;
      color: var(--color-text-3);
    }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .stat-card {
    text-align: center;
    border-radius: 8px;
    transition: transform 0.2s;
  }
  
  .stat-card:hover {
    transform: translateY(-4px);
  }
  
  .social-links {
    margin-top: 16px;
  }
  
  :deep(.arco-timeline-item-content) {
    margin-bottom: 24px;
  }
  
  :deep(.arco-card) {
    background-color: var(--color-bg-2);
  }
  
  :deep(.arco-statistic-value) {
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .author-info {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }
  </style>