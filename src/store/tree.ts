import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 定义树节点类型
 */
interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
}

/**
 * 树数据状态存储
 */
export const useTreeStore = defineStore('tree', () => {
  // 树数据
  const treeData = ref<TreeNode[]>([
    {
      title: '父节点1',
      key: '0-0',
      children: [
        {
          title: '子节点1-1',
          key: '0-0-0',
          children: [
            { title: '叶子节点1-1-1', key: '0-0-0-0' },
            { title: '叶子节点1-1-2', key: '0-0-0-1' }
          ]
        },
        {
          title: '子节点1-2',
          key: '0-0-1',
          children: [
            { title: '叶子节点1-2-1', key: '0-0-1-0' },
            { title: '叶子节点1-2-2', key: '0-0-1-1' }
          ]
        }
      ]
    },
    {
      title: '父节点2',
      key: '0-1',
      children: [
        {
          title: '子节点2-1',
          key: '0-1-0',
          children: [
            { title: '叶子节点2-1-1', key: '0-1-0-0' }
          ]
        },
        {
          title: '子节点2-2',
          key: '0-1-1',
          children: [
            { title: '叶子节点2-2-1', key: '0-1-1-0' }
          ]
        }
      ]
    }
  ]);

  // 当前选中节点
  const currentNode = ref<TreeNode | null>(null);

  /**
   * 递归查找节点
   * @param key 节点key
   * @param nodes 节点数组
   * @returns 找到的节点或null
   */
  const findNodeByKey = (key: string, nodes: TreeNode[] = treeData.value): TreeNode | null => {
    for (const node of nodes) {
      if (node.key === key) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = findNodeByKey(key, node.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  /**
   * 设置当前选中节点
   * @param key 节点key
   */
  const setCurrentNode = (key: string | null) => {
    if (key) {
      currentNode.value = findNodeByKey(key);
    } else {
      currentNode.value = null;
    }
  };

  /**
   * 添加节点
   * @param parentKey 父节点key
   * @param node 新节点
   */
  const addNode = (parentKey: string | null, node: TreeNode) => {
    if (!parentKey) {
      // 添加顶级节点
      treeData.value.push(node);
    } else {
      // 添加子节点
      const parentNode = findNodeByKey(parentKey);
      if (parentNode) {
        if (!parentNode.children) {
          parentNode.children = [];
        }
        parentNode.children.push(node);
      }
    }
  };

  /**
   * 更新节点
   * @param key 节点key
   * @param title 新标题
   */
  const updateNode = (key: string, title: string) => {
    const node = findNodeByKey(key);
    if (node) {
      node.title = title;
    }
  };

  /**
   * 删除节点
   * @param key 节点key
   */
  const deleteNode = (key: string) => {
    // 递归在节点数组中找到并删除节点
    const removeFromArray = (nodes: TreeNode[]): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].key === key) {
          nodes.splice(i, 1);
          return true;
        }
        if (nodes[i].children && nodes[i].children.length > 0) {
          if (removeFromArray(nodes[i].children)) {
            return true;
          }
        }
      }
      return false;
    };

    removeFromArray(treeData.value);
    if (currentNode.value?.key === key) {
      currentNode.value = null;
    }
  };

  return {
    treeData,
    currentNode,
    findNodeByKey,
    setCurrentNode,
    addNode,
    updateNode,
    deleteNode
  };
}); 