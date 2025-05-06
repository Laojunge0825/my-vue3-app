/// <reference types="vite/client" />

// 声明模块，使Vue文件可以被TypeScript识别
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 添加Vue Router的路由元信息类型扩展
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    keepAlive?: boolean
  }
}
