import request from '../utils/request';

/**
 * @interface TreeData
 * @description 树数据接口
 */
export interface TreeData {
  id: string;
  name: string;
  children?: TreeData[];
}

/**
 * 树API类
 */
export class TreeApi {
    /**
     * 获取树数据
     * @param {string|number} id 根节点id
     * @returns Promise<TreeData[]>
     */
    static getTreeData(id: string | number) {
        return request({
            url: `/api/tree/children/${id}`,
            method: 'get'
        });
    }
}
