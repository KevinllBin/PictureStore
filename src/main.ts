import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import App from './App.vue'
import router from './router'
import '@arco-design/web-vue/dist/arco.css'
import { 
  IconUser,
  IconSettings,
  IconExport,
  IconHeart,
  IconHeartFill,
  IconEye
} from '@arco-design/web-vue/es/icon'
import { createPinia } from 'pinia'
import { useAuthStore } from './store/auth'

const app = createApp(App)

const icons = [
  IconUser,
  IconSettings,
  IconExport,
  IconHeart,
  IconHeartFill,
  IconEye
]

icons.forEach(icon => app.component(icon.name as string, icon))

// 创建 Pinia 实例
const pinia = createPinia()

// 使用 Pinia
app.use(pinia)

//初始化认证状态
const authStore = useAuthStore()
authStore.initializeAuth()

app.use(ArcoVue)
app.use(router)
app.mount('#app')