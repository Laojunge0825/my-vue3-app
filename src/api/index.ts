/**
 * API 统一导出
 * 方便后期维护和使用
 */
import { OrgTreeApi } from './orgTree';
import { UserApi } from './user';
import { ProductApi } from './product';
import { TreeApi } from './tree';

// 导出API类
export { 
  OrgTreeApi,
  UserApi,
  ProductApi,
  TreeApi
};

/**
 * API常量配置
 * 这些常量也可以通过环境变量配置
 */

// API接口基础URL配置
export const API_CONFIG = {
  // 基础URL
  BASE_URL: 'http://localhost:8100',
  
  // 超时时间
  TIMEOUT: 10000, // 10秒
  
  // 响应码
  CODE: {
    SUCCESS: 0,         // 成功
    UNAUTHORIZED: 401,  // 未授权
    FORBIDDEN: 403,     // 禁止访问
    NOT_FOUND: 404,     // 资源不存在
    SERVER_ERROR: 500   // 服务器错误
  }
}; 