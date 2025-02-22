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

app.use(ArcoVue)
app.use(router)
app.mount('#app')