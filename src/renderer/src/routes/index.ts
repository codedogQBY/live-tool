import Home from '../views/index.vue'
import Camera from '../views/camera/index.vue'
import Subtitle from '../views/subtitle/index.vue'
import Record from '../views/record/index.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/camera', component: Camera },
  { path: '/subtitle', component: Subtitle },
  { path: '/camera', component: Record }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
