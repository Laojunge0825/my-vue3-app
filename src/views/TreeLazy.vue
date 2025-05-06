<template>
    <a-tree
      :load-data="onLoadData"
      :tree-data="treeData"
      :replaceFields="{ title: 'name', key: 'id' }"
      @expand="onExpand"
    >
      <template #switcherIcon="{ expanded, isLeaf }">
        <LoadingOutlined v-if="loadingKeys.has(props.eventKey)" spin />
        <CaretDownOutlined v-else-if="expanded" />
        <CaretRightOutlined v-else />
      </template>
    </a-tree>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  import { Tree } from 'ant-design-vue';
  
  const treeData = ref([]);
  const loadingKeys = reactive(new Set());
  
  // 初始化加载根节点
  const loadRoot = async () => {
    const { data } = await api.get('/api/lazy-tree/children');
    treeData.value = data.map(node => ({
      ...node,
      children: node.hasChildren ? [] : null
    }));
  };
  
  // 懒加载子节点
  const onLoadData = async (treeNode) => {
    try {
      loadingKeys.add(treeNode.eventKey);
    
      const { data } = await api.get('/api/lazy-tree/children', {
        params: { parentId: treeNode.eventKey }
      });
  
      treeNode.children = data.map(child => ({
        ...child,
        children: child.hasChildren ? [] : null
      }));
      treeData.value = [...treeData.value];
    } finally {
      loadingKeys.delete(treeNode.eventKey);
    }
  };
  
  // 初始化加载
  loadRoot();
  </script>