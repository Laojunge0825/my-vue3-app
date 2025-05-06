import request from '../utils/request';

/**
 * @interface ProductData
 * @description 产品数据接口
 */
export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  status: number; // 0-下架 1-上架
  createTime: string;
  updateTime: string;
}

/**
 * @interface ProductQuery
 * @description 产品查询参数接口
 */
export interface ProductQuery {
  page: number;
  size: number;
  keyword?: string;
  category?: string;
  status?: number;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * 产品API类
 */
export class ProductApi {
  /**
   * @description 获取产品列表
   * @param {ProductQuery} params - 查询参数
   * @returns {Promise} - 返回产品列表
   */
  static getProductList(params: ProductQuery) {
    return request({
      url: '/products/list',
      method: 'get',
      params
    });
  }

  /**
   * @description 获取产品详情
   * @param {string} id - 产品ID
   * @returns {Promise<ProductData>} - 返回产品详情
   */
  static getProductDetail(id: string) {
    return request({
      url: `/products/${id}`,
      method: 'get'
    });
  }

  /**
   * @description 创建产品
   * @param {Partial<ProductData>} data - 产品数据
   * @returns {Promise} - 返回创建结果
   */
  static createProduct(data: Partial<ProductData>) {
    return request({
      url: '/products',
      method: 'post',
      data
    });
  }

  /**
   * @description 更新产品信息
   * @param {string} id - 产品ID
   * @param {Partial<ProductData>} data - 产品数据
   * @returns {Promise} - 返回更新结果
   */
  static updateProduct(id: string, data: Partial<ProductData>) {
    return request({
      url: `/products/${id}`,
      method: 'put',
      data
    });
  }

  /**
   * @description 删除产品
   * @param {string} id - 产品ID
   * @returns {Promise} - 返回删除结果
   */
  static deleteProduct(id: string) {
    return request({
      url: `/products/${id}`,
      method: 'delete'
    });
  }

  /**
   * @description 更新产品状态
   * @param {string} id - 产品ID
   * @param {number} status - 产品状态 0-下架 1-上架
   * @returns {Promise} - 返回操作结果
   */
  static updateProductStatus(id: string, status: number) {
    return request({
      url: `/products/${id}/status`,
      method: 'patch',
      data: { status }
    });
  }

  /**
   * @description 批量删除产品
   * @param {string[]} ids - 产品ID数组
   * @returns {Promise} - 返回操作结果
   */
  static batchDeleteProducts(ids: string[]) {
    return request({
      url: '/products/batch',
      method: 'delete',
      data: { ids }
    });
  }
} 