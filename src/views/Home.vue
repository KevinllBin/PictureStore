<template>
    <div class="home-container">
      <!-- 搜索和筛选区域 -->
      <div class="search-area">
        <a-space>
          <a-input-search
            v-model="searchText"
            placeholder="搜索图片..."
            search-button
            @search="handleSearch"
            style="width: 320px"
          />
          <a-select
            v-model="selectedCategory"
            placeholder="选择分类"
            style="width: 160px"
          >
            <a-option value="all">全部分类</a-option>
            <a-option value="scenery">风景</a-option>
            <a-option value="portrait">人像</a-option>
            <a-option value="animal">动物</a-option>
            <a-option value="architecture">建筑</a-option>
          </a-select>
          <a-select
            v-model="sortBy"
            placeholder="排序方式"
            style="width: 160px"
          >
            <a-option value="newest">最新上传</a-option>
            <a-option value="oldest">最早上传</a-option>
            <a-option value="name">名称排序</a-option>
          </a-select>
        </a-space>
      </div>
  
      <!-- 图片网格展示区域 -->
      <div class="image-grid">
        <a-grid :cols="4" :colGap="16" :rowGap="16">
          <a-grid-item v-for="image in displayImages" :key="image.id">
            <a-card 
              :bodyStyle="{ padding: '0' }"
              class="image-card"
              :bordered="false"
              hoverable
            >
              <img :src="image.url" :alt="image.title" class="card-image"/>
              <div class="card-content">
                <div class="card-title">{{ image.title }}</div>
                <div class="card-info">
                  <a-tag>{{ image.category }}</a-tag>
                  <span class="date">{{ formatDate(image.uploadDate) }}</span>
                </div>
                <div class="card-actions">
                  <a-space>
                    <a-button 
                      type="text" 
                      :status="image.isFavorite ? 'danger' : 'normal'"
                      @click="toggleFavorite(image)"
                    >
                      <template #icon>
                        <icon-heart-fill v-if="image.isFavorite"/>
                        <icon-heart v-else/>
                      </template>
                    </a-button>
                    <a-button type="text" @click="showImageDetail(image)">
                      <template #icon><icon-eye /></template>
                    </a-button>
                  </a-space>
                </div>
              </div>
            </a-card>
          </a-grid-item>
        </a-grid>
      </div>
  
      <!-- 分页器 -->
      <div class="pagination-container">
        <a-pagination
          :total="totalImages"
          :current="currentPage"
          :page-size="pageSize"
          show-total
          show-jumper
          @change="handlePageChange"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { Message, Modal } from '@arco-design/web-vue'
  import { useAuthStore } from '@/store/auth'
  import { useRouter } from 'vue-router'
  
  interface Image {
    id: number
    title: string
    url: string
    category: string
    uploadDate: Date
    isFavorite: boolean
    description:string
  }
  
  // 状态
  const searchText = ref('')
  const selectedCategory = ref('all')
  const sortBy = ref('newest')
  const currentPage = ref(1)
  const pageSize = ref(12)
  const totalImages = ref(30)
  
  // 示例数据
  const images = ref<Image[]>([
    {
      id: 1,
      title: '山川风景',
      url: 'https://picsum.photos/300/200?random=1',
      category: 'scenery',
      uploadDate: new Date('2025-02-22 09:25:24'),
      isFavorite: false,
      description: '这是一张美丽的山川风景图片'
    },
    // 可以添加更多示例数据
  ])
  
  // 计算属性
  const displayImages = computed(() => {
    let filtered = [...images.value]
    
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory.value)
    }
    
    if (searchText.value) {
      filtered = filtered.filter(img => 
        img.title.toLowerCase().includes(searchText.value.toLowerCase())
      )
    }
    
    filtered.sort((a, b) => {
      switch (sortBy.value) {
        case 'newest':
          return b.uploadDate.getTime() - a.uploadDate.getTime()
        case 'oldest':
          return a.uploadDate.getTime() - b.uploadDate.getTime()
        case 'name':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })
    
    return filtered
  })
  
  // 方法
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }
  
  const handleSearch = (value: string) => {
    console.log('搜索:', value)
    currentPage.value = 1
  }
  
  const handlePageChange = (page: number) => {
    currentPage.value = page
  }
  
  const toggleFavorite = (image: Image) => {
    image.isFavorite = !image.isFavorite
    Message.success(`${image.isFavorite ? '已添加到' : '已从'}收藏夹${image.isFavorite ? '' : '移除'}`)
  }
  
  const showImageDetail = (image: Image) => {
    // 实现查看图片详情的逻辑
    console.log('查看图片:', image)
  }
  
  const authStore = useAuthStore()
  const router = useRouter()

  onMounted(()=>{
    //初始化认证状态
    authStore.initializeAuth();

    if(!authStore.isLoggedIn){
      Modal.confirm({
        title:'提示',
        content:'您还未登录，可以选择登录',
        okText:'登录',
        cancelText:'关闭',
        onOk:()=>{
          router.push('/login')
        },
        oncancel:()=>{
          console.log('用户选择关闭提示框')
        }
      })
    }
  })
  </script>
  
  <style scoped>
  .home-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .search-area {
    margin-bottom: 24px;
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  
  .image-card {
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
  }
  
  .image-card:hover {
    transform: translateY(-4px);
  }
  
  .card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .card-content {
    padding: 12px;
  }
  
  .card-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .card-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 12px;
    color: var(--color-text-3);
  }
  
  .card-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .pagination-container {
    margin-top: 24px;
    display: flex;
    justify-content: center;
  }
  </style>