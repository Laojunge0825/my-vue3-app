import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

/**
 * 路由配置数组
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
          title: '首页',
          keepAlive: false,
        },
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('../views/Vue3Tree.vue'),
        meta: {
          title: 'Tree组件',
          keepAlive: false,
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面未找到',
      keepAlive: false,
    },
  },
];

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * 全局路由守卫
 */
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title ? to.meta.title : '默认标题'} - Vue3 Admin Pro`;
  next();
});

export default router; 