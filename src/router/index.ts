import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Category from '@/views/Category.vue'
import About from '@/views/About.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/category/:type',
      name: 'Category',
      component: Category
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})

export default router