import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由配置数组
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '工作台',
      keepAlive: false
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
          title: '工作台',
          keepAlive: false
        }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('../views/Vue3Tree.vue'),
        meta: {
          title: 'Tree组件',
          keepAlive: false
        }
      },
      {
        path: 'tree-lazy',
        name: 'TreeLazy',
        component: () => import('../views/TreeLazy.vue'),
        meta: {
          title: '懒加载树',
          keepAlive: false
        }
      },
      {
        path: '3d-tree',
        name: '3DTree',
        component: () => import('../views/3Dweb/3DTree/3DTree.vue'),
        meta: {
          title: '3D树形图',
          keepAlive: false
        }
      },
      {
        path: '3d-data',
        name: '3DData',
        component: () => import('../views/3Dweb/3DTree/3DTree.vue'),
        meta: {
          title: '3D数据',
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面未找到',
      keepAlive: false
    }
  }
]

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 全局路由守卫
 */
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title ? to.meta.title : '默认标题'} - Vue3 Admin`
  next()
})

export default router
