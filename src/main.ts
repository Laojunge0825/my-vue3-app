import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import './style.css'

// 导入组织树组件
import TreeOrg from 'vue3-tree-org'
import 'vue3-tree-org/lib/vue3-tree-org.css'

/**
 * 创建Vue应用
 */
const app = createApp(App)

/**
 * 使用插件
 */
app.use(createPinia()) // 状态管理
app.use(router) // 路由
app.use(Antd) // Ant Design Vue组件库
app.use(TreeOrg) // 组织树组件

/**
 * 挂载应用
 */
app.mount('#app')
