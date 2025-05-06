import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    cors: true, // 启用CORS
    proxy: {
      // 代理所有 /api 请求
      '/api': {
        target: 'http://localhost:8100', // 后端服务器地址
        changeOrigin: true,
        secure: false,
        // 重写路径 - 去掉 /api 前缀
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
