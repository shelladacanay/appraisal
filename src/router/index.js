import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import RecordsView   from '@/views/RecordsView.vue'
import AddRecordView from '@/views/AddRecordView.vue'
import ReportsView   from '@/views/ReportsView.vue'
import AboutView     from '@/views/AboutView.vue'

const routes = [
  { path: '/',          redirect: '/dashboard' },
  { path: '/dashboard', component: DashboardView },
  { path: '/records',   component: RecordsView },
  { path: '/add',       component: AddRecordView },
  { path: '/reports',   component: ReportsView },
  { path: '/about',     component: AboutView },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router