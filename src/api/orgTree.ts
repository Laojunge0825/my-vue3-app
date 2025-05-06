import request from '../utils/request';

/**
 * 定义树节点类型
 */
export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  [key: string]: any; // 其他可能的属性
}

/**
 * 组织树API接口类
 */
export class OrgTreeApi {
  /**
   * 获取组织树结构
   * @returns Promise 组织树结构
   */
  static getOrgTree() {
    return request({
      url: '/api/org/tree',
      method: 'get'
    });
  }

  /**
   * 获取组织树结构（从指定接口获取）
   * @returns Promise 根节点数据
   */
  static getStructure() {
    console.log('调用获取组织树结构API: /api/org-tree/structure');
    return request({
      url: '/api/org-tree/structure',
      method: 'get'
    }).catch(error => {
      console.error('获取组织树结构失败:', error);
      throw error;
    });
  }

  /**
   * 添加组织树节点
   * @param {Object} data - 节点数据
   * @returns Promise 操作结果
   */
  static addNode(data: any) {
    return request({
      url: '/api/org/node',
      method: 'post',
      data
    });
  }

  /**
   * 更新组织树节点
   * @param {Object} data - 节点数据
   * @returns Promise 操作结果
   */
  static updateNode(data: any) {
    return request({
      url: '/api/org/node',
      method: 'put',
      data
    });
  }

  /**
   * 删除组织树节点
   * @param {string|number} id - 节点ID
   * @returns Promise 操作结果
   */
  static deleteNode(id: string | number) {
    return request({
      url: `/api/org/node/${id}`,
      method: 'delete'
    });
  }

  /**
   * 获取节点详细信息
   * @param {string|number} id - 节点ID
   * @returns Promise 节点详情
   */
  static getNodeDetail(id: string | number) {
    return request({
      url: `/api/org/node/${id}`,
      method: 'get'
    });
  }
} 