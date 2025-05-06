<template>
    <a-card>
        1111
        <vue3-tree-org
      v-if="treeData"
      :data="treeData"
      :props="{ id: 'id', pid: 'pid', label: 'label' }"
      :horizontal="false"
      :collapsable="true"
    />
    </a-card>
    
  </template>
<script setup>
import { ref, onMounted } from 'vue'
import { OrgTreeApi } from '../api'
import { message } from 'ant-design-vue'
import 'vue3-tree-org/lib/vue3-tree-org.css'

const treeData = ref(null)

/**
 * 加载组织树数据
 */
    const fetchOrgTreeData = async () => {
    try {
    const res = await OrgTreeApi.getStructure()
    
    // 从响应中获取实际数据
    treeData.value = res.data || []
    console.log(treeData.value)
    } catch (error) {
    console.error('获取组织树失败:', error)
    message.error('获取组织树失败')
    } 
}

onMounted(() => {
    fetchOrgTreeData()
})
</script>
