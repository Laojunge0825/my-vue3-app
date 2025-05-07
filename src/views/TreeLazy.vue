<template>
    <a-tree
      :load-data="onLoadData"
      :tree-data="treeData"
      :replaceFields="{ title: 'name', key: 'id' }"
      @expand="onExpand"
    >
      <template #switcherIcon="{ expanded, eventKey }">
        <LoadingOutlined v-if="loadingKeys.has(eventKey)" spin />
        <CaretDownOutlined v-else-if="expanded" />
        <CaretRightOutlined v-else />
      </template>
    </a-tree>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { Tree } from 'ant-design-vue';
  import { LoadingOutlined, CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons-vue';
  import { TreeApi } from '../api'
  
  /**
   * 定义树节点类型
   */
  interface TreeNode {
    id: string;
    name: string;
    hasChildren?: boolean;
    children?: TreeNode[] | null;
    [key: string]: any;
  }
  
  const treeData = ref<TreeNode[]>([]);
  const loadingKeys = reactive(new Set<string>());
  
  /**
   * 树节点展开/收起时的回调
   * @param {Array} expandedKeys - 展开的节点keys
   * @param {Object} info - 展开节点的信息
   */
  const onExpand = (expandedKeys: string[], info: any) => {
    console.log('Expanded:', expandedKeys, info);
  };
  
  // 初始化加载根节点
  const loadRoot = async () => {
    try {
      const { data } = await TreeApi.getTreeData(0);
      treeData.value = data.map((node: any) => ({
        ...node,
        children: node.hasChildren ? [] : null
      }));
    } catch (error) {
      console.error('加载根节点失败:', error);
    }
  };
  
  // 懒加载子节点
  const onLoadData = async (treeNode: any) => {
    try {
      loadingKeys.add(treeNode.eventKey);
      console.log('加载节点:', treeNode.eventKey);
  
      // 获取子节点
      const { data } = await TreeApi.getTreeData(treeNode.eventKey);
      
      // 更新节点数据
      const updateNode = (nodes: TreeNode[], targetId: string): boolean => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === targetId) {
            nodes[i].children = data.map((child: any) => ({
              ...child,
              children: child.hasChildren ? [] : null
            }));
            return true;
          }
          if (nodes[i].children && nodes[i].children.length > 0) {
            if (updateNode(nodes[i].children as TreeNode[], targetId)) {
              return true;
            }
          }
        }
        return false;
      };
  
      // 更新树数据
      const newTreeData = [...treeData.value];
      updateNode(newTreeData, treeNode.eventKey);
      treeData.value = newTreeData;
      
      console.log('更新后的树数据:', treeData.value);
    } catch (error) {
      console.error('加载子节点失败:', error);
    } finally {
      loadingKeys.delete(treeNode.eventKey);
    }
  };
  
  // 初始化加载
  loadRoot();
  </script>