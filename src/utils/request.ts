import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';

// 直接定义常量避免循环依赖
const API_BASE_URL = 'http://localhost:8100';
const API_TIMEOUT = 10000;

/**
 * 请求工具类
 */
const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  // 设置跨域请求时是否需要使用凭证
  withCredentials: true
});

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 获取token并添加到请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 设置跨域相关请求头
    config.headers['Content-Type'] = 'application/json';
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    
    // 假设后端返回格式: { code: number, data: any, message: string }
    if (!res) {
      message.error('服务器响应错误');
      return Promise.reject(new Error('服务器响应错误'));
    }
    
    // 假设 code 为 0 代表成功
    if (res.code !== 0 && res.code !== 200) {
      message.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    
    return res;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // 处理常见错误状态码
      switch (status) {
        case 401:
          message.error('未授权，请重新登录');
          // 可以在这里做登出处理
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error(error.message || '请求失败');
      }
    } else if (error.message.includes('timeout')) {
      // 超时错误
      message.error('请求超时，请稍后再试');
    } else {
      // 其他错误
      message.error('网络错误，请检查网络连接');
    }
    
    return Promise.reject(error);
  }
);

export default service; 