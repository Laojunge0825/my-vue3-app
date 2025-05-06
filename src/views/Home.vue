<template>
  <div class="home-container">
    <a-card title="欢迎使用Vue3管理系统" :bordered="false">
      <p>本系统使用Vue3 + TypeScript + Ant Design Vue构建</p>
      <p>系统主要功能包括：</p>
      
      <a-list item-layout="horizontal" :data-source="features">
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <a-button type="link" @click="navigateTo(item.path)">进入</a-button>
            </template>
            <a-list-item-meta :description="item.description">
              <template #title>
                <a href="javascript:void(0);" @click.prevent="navigateTo(item.path)">{{ item.title }}</a>
              </template>
              <template #avatar>
                <a-avatar><template #icon><component :is="item.icon" /></template></a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 首页组件
 */
import { useRouter } from 'vue-router';
import { BranchesOutlined } from '@ant-design/icons-vue';

const router = useRouter();

// 系统功能列表
const features = [
  {
    title: 'Vue3 Tree组件',
    description: '展示树形结构数据，支持添加、编辑和删除节点等操作。',
    path: '/tree',
    icon: BranchesOutlined
  },
  // 可以添加更多功能模块
];

// 导航到指定路径
const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.home-container {
  width: 100%;
}
</style> 