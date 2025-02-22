<template>
    <div class="category-container">
      <!-- 分类标题 -->
      <div class="category-header">
        <a-typography-title :heading="3">
          {{ categoryTitle }}
        </a-typography-title>
        <div class="category-stats">
          <a-tag size="medium">共 {{ totalImages }} 张图片</a-tag>
        </div>
      </div>
  
      <!-- 筛选工具栏 -->
      <div class="filter-toolbar">
        <a-space>
          <a-input-search
            v-model="searchText"
            placeholder="在该分类中搜索..."
            search-button
            @search="handleSearch"
            style="width: 320px"
          />
          <a-select
            v-model="timeRange"
            placeholder="时间范围"
            style="width: 160px"
          >
            <a-option value="all">全部时间</a-option>
            <a-option value="today">今天</a-option>
            <a-option value="week">本周</a-option>
            <a-option value="month">本月</a-option>
            <a-option value="year">今年</a-option>
          </a-select>
          <a-select
            v-model="sortBy"
            placeholder="排序方式"
            style="width: 160px"
          >
            <a-option value="newest">最新上传</a-option>
            <a-option value="oldest">最早上传</a-option>
            <a-option value="popular">最受欢迎</a-option>
          </a-select>
        </a-space>
      </div>
  
      <!-- 图片瀑布流展示 -->
      <div class="image-waterfall">
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
                  <span class="upload-info">
                    <icon-clock /> {{ formatDate(image.uploadDate) }}
                  </span>
                  <span class="like-count">
                    <icon-heart /> {{ image.likes }}
                  </span>
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
                    <a-button type="text" @click="shareImage(image)">
                      <template #icon><icon-share /></template>
                    </a-button>
                  </a-space>
                </div>
              </div>
            </a-card>
          </a-grid-item>
        </a-grid>
      </div>
  
      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMoreImages">
        <a-button 
          type="outline"
          :loading="isLoading"
          @click="loadMore"
        >
          加载更多
        </a-button>
      </div>
  
      <!-- 图片预览弹窗 -->
      <a-modal
        v-model:visible="previewVisible"
        :footer="false"
        class="preview-modal"
      >
        <img :src="currentPreviewImage?.url" style="width: 100%" />
      </a-modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { Message } from '@arco-design/web-vue'
  
  interface Image {
    id: number
    title: string
    url: string
    uploadDate: Date
    likes: number
    isFavorite: boolean
    description?: string
  }
  
  // 路由参数
  const route = useRoute()
  const categoryType = computed(() => route.params.type as string)
  
  // 状态管理
  const searchText = ref('')
  const timeRange = ref('all')
  const sortBy = ref('newest')
  const isLoading = ref(false)
  const previewVisible = ref(false)
  const currentPreviewImage = ref<Image | null>(null)
  const currentPage = ref(1)
  const hasMoreImages = ref(true)
  
  // 分类标题映射
  const categoryTitles: Record<string, string> = {
    'scenery': '风景摄影',
    'portrait': '人像摄影',
    'animal': '动物摄影',
    'architecture': '建筑摄影'
  }
  
  // 计算属性
  const categoryTitle = computed(() => {
    return categoryTitles[categoryType.value] || '未知分类'
  })
  
  const totalImages = ref(0)
  
  // 示例数据
  const images = ref<Image[]>([
    {
      id: 1,
      title: '雪山日出',
      url: 'https://picsum.photos/400/300?random=1',
      uploadDate: new Date('2025-02-22 09:35:50'),
      likes: 156,
      isFavorite: false,
      description: '清晨的雪山被朝阳映照，金光闪耀'
    },
    {
      id: 2,
      title: '海边晚霞',
      url: 'https://picsum.photos/400/300?random=2',
      uploadDate: new Date('2025-02-22 08:30:00'),
      likes: 234,
      isFavorite: true,
      description: '傍晚的海边，天空被晚霞染成金色'
    },
    // 可以添加更多示例数据
  ])
  
  // 计算要显示的图片
  const displayImages = computed(() => {
    let filtered = [...images.value]
    
    // 搜索过滤
    if (searchText.value) {
      filtered = filtered.filter(img => 
        img.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
        img.description?.toLowerCase().includes(searchText.value.toLowerCase())
      )
    }
    
    // 时间范围过滤
    const now = new Date()
    switch (timeRange.value) {
      case 'today':
        filtered = filtered.filter(img => 
          img.uploadDate.toDateString() === now.toDateString()
        )
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(img => img.uploadDate >= weekAgo)
        break
      // 可以添加其他时间范围的过滤逻辑
    }
    
    // 排序
    filtered.sort((a, b) => {
      switch (sortBy.value) {
        case 'newest':
          return b.uploadDate.getTime() - a.uploadDate.getTime()
        case 'oldest':
          return a.uploadDate.getTime() - b.uploadDate.getTime()
        case 'popular':
          return b.likes - a.likes
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
  
  const toggleFavorite = (image: Image) => {
    image.isFavorite = !image.isFavorite
    Message.success(`${image.isFavorite ? '已添加到' : '已从'}收藏夹${image.isFavorite ? '' : '移除'}`)
  }
  
  const showImageDetail = (image: Image) => {
    currentPreviewImage.value = image
    previewVisible.value = true
  }
  
  const shareImage = (image: Image) => {
    // 实现分享功能
    Message.info('分享功能开发中...')
  }
  
  const loadMore = async () => {
    if (isLoading.value) return
    
    isLoading.value = true
    try {
      // 模拟加载更多数据
      await new Promise(resolve => setTimeout(resolve, 1000))
      // 这里应该调用实际的API获取更多数据
      
      // 示例：没有更多数据了
      hasMoreImages.value = false
    } finally {
      isLoading.value = false
    }
  }
  
  // 生命周期钩子
  onMounted(() => {
    // 初始化加载数据
    totalImages.value = images.value.length
  })
  
  // 监听路由参数变化
  watch(() => route.params.type, (newType) => {
    // 当分类改变时重新加载数据
    console.log('分类改变:', newType)
    currentPage.value = 1
    // 这里应该重新请求数据
  })
  </script>
  
  <style scoped>
  .category-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .filter-toolbar {
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  
  .image-card {
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .image-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .card-image {
    width: 100%;
    height: 240px;
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
  
  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }
  
  .preview-modal :deep(.arco-modal-body) {
    padding: 0;
  }
  
  .upload-info, .like-count {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  </style>