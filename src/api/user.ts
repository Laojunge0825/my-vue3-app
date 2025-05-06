import request from '../utils/request';

/**
 * @interface UserData
 * @description 用户数据接口
 */
export interface UserData {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  status: number;
  createTime: string;
  updateTime: string;
}

/**
 * @interface LoginParams
 * @description 登录参数接口
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * @interface UserQuery
 * @description 用户查询参数接口
 */
export interface UserQuery {
  page: number;
  size: number;
  keyword?: string;
  status?: number;
}

/**
 * 用户API类
 */
export class UserApi {
  /**
   * @description 用户登录
   * @param {LoginParams} data - 登录参数
   * @returns {Promise} - 返回登录结果
   */
  static login(data: LoginParams) {
    return request({
      url: '/auth/login',
      method: 'post',
      data
    });
  }

  /**
   * @description 获取用户信息
   * @returns {Promise<UserData>} - 返回用户信息
   */
  static getUserInfo() {
    return request({
      url: '/users/info',
      method: 'get'
    });
  }

  /**
   * @description 获取用户列表
   * @param {UserQuery} params - 查询参数
   * @returns {Promise} - 返回用户列表
   */
  static getUserList(params: UserQuery) {
    return request({
      url: '/users/list',
      method: 'get',
      params
    });
  }

  /**
   * @description 创建用户
   * @param {Partial<UserData>} data - 用户数据
   * @returns {Promise} - 返回创建结果
   */
  static createUser(data: Partial<UserData>) {
    return request({
      url: '/users',
      method: 'post',
      data
    });
  }

  /**
   * @description 更新用户信息
   * @param {string} id - 用户ID
   * @param {Partial<UserData>} data - 用户数据
   * @returns {Promise} - 返回更新结果
   */
  static updateUser(id: string, data: Partial<UserData>) {
    return request({
      url: `/users/${id}`,
      method: 'put',
      data
    });
  }

  /**
   * @description 删除用户
   * @param {string} id - 用户ID
   * @returns {Promise} - 返回删除结果
   */
  static deleteUser(id: string) {
    return request({
      url: `/users/${id}`,
      method: 'delete'
    });
  }
} 