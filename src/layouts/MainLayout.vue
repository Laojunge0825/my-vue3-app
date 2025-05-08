<template>
  <a-layout class="layout-container">
    <!-- 侧边栏 -->
    <a-layout-sider
      :collapsed="collapsed"
      :trigger="null"
      collapsible
      :width="240"
      class="sidebar"
      @update:collapsed="handleCollapsedChange"
    >
      <!-- 网站标志 -->
      <div class="logo">
        <img src="../assets/images/logo.png" alt="logo" />
        <h1 v-show="!collapsed">Vue3 Admin Pro</h1>
      </div>
      
      <!-- 侧边菜单 -->
      <a-menu
        :selectedKeys="selectedKeys"
        :openKeys="openKeys"
        theme="dark"
        mode="inline"
        @update:selectedKeys="handleSelectedKeysChange"
        @update:openKeys="handleOpenKeysChange"
      >
        <a-sub-menu key="tree-menu">
          <template #icon><apartment-outlined /></template>
          <template #title>Tree</template>
          <a-menu-item key="vue3-tree" @click="navigateTo('/tree')">
            <template #icon><branches-outlined /></template>
            Vue3 Tree 页面
          </a-menu-item>
          <a-menu-item key="vue3-tree-lazy" @click="navigateTo('/tree-lazy')">
            <template #icon><branches-outlined /></template>
            Tree Lazy 页面
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="3d-tree-menu">
          <template #icon><apartment-outlined /></template>
          <template #title>3D web 页</template>
          <a-menu-item key="3d-tree" @click="navigateTo('/3d-tree')">
            <template #icon><branches-outlined /></template>
            3D Tree 页面
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    
    <!-- 主内容区域 -->
    <a-layout class="main-content">
      <!-- 头部 -->
      <a-layout-header class="header">
        <div class="header-left">
          <!-- 折叠按钮 -->
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined
            v-else
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <!-- 面包屑 -->
          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item>{{ currentRoute }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="header-right">
          <!-- 用户信息 -->
          <a-dropdown>
            <a class="user-dropdown">
              <a-avatar><template #icon><user-outlined /></template></a-avatar>
              <span class="username">管理员</span>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile">
                  <user-outlined />
                  个人中心
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout">
                  <logout-outlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      
      <!-- 内容 -->
      <a-layout-content class="content">
        <div class="content-wrapper">
          <router-view></router-view>
        </div>
      </a-layout-content>
      
      <!-- 页脚 -->
      <a-layout-footer class="footer">
        <div>Copyright © 2023 Vue3 Admin Pro</div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
/**
 * 主布局组件
 * 包含侧边导航栏、头部和内容区域
 */
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ApartmentOutlined,
  BranchesOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue';

// 菜单折叠状态
const collapsed = ref(false);
// 选中的菜单项
const selectedKeys = ref<string[]>(['vue3-tree']);
// 展开的子菜单
const openKeys = ref<string[]>(['tree-menu']);

const router = useRouter();
const route = useRoute();

// 当前路由名称
const currentRoute = computed(() => {
  return route.meta.title || '';
});

// 路由跳转
const navigateTo = (path: string) => {
  router.push(path);
};

// 监听路由变化，更新选中的菜单项
watch(
  () => route.path,
  (path) => {
    if (path === '/tree') {
      selectedKeys.value = ['vue3-tree'];
      openKeys.value = ['tree-menu'];
    }
  },
  { immediate: true }
);

// 处理侧边栏折叠状态变化
const handleCollapsedChange = (val: boolean) => {
  collapsed.value = val;
};

// 处理菜单选中项变化
const handleSelectedKeysChange = (val: string[]) => {
  selectedKeys.value = val;
};

// 处理子菜单展开状态变化
const handleOpenKeysChange = (val: string[]) => {
  openKeys.value = val;
};
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
}

.sidebar {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  z-index: 10;
  height: 100vh;
  position: fixed;
  left: 0;
  overflow: auto;
}

.main-content {
  margin-left: 240px;
  width: calc(100% - 240px);
  transition: all 0.2s;
}

.layout-container .sidebar.ant-layout-sider-collapsed + .main-content {
  margin-left: 80px;
  width: calc(100% - 80px);
}

.logo {
  height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: #001529;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.logo h1 {
  color: #fff;
  font-size: 18px;
  margin: 0;
  white-space: nowrap;
}

.header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 9;
  position: sticky;
  top: 0;
  width: 100%;
  height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger {
  font-size: 18px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.breadcrumb {
  margin-left: 16px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.65);
}

.content {
  margin: 24px;
  min-height: calc(100vh - 64px - 70px);
  overflow: initial;
}

.content-wrapper {
  padding: 24px;
  background: #fff;
  min-height: 100%;
  border-radius: 4px;
}

.footer {
  text-align: center;
  padding: 16px 50px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  background: #f0f2f5;
}

/* 响应式布局 */
@media screen and (max-width: 992px) {
  .sidebar {
    position: absolute;
    height: 100vh;
  }
  
  .main-content {
    margin-left: 0;
    width: 100%;
  }
  
  .layout-container .sidebar.ant-layout-sider-collapsed + .main-content {
    margin-left: 0;
    width: 100%;
  }
}

@media screen and (max-width: 576px) {
  .header {
    padding: 0 12px;
  }
  
  .username {
    display: none;
  }
  
  .content {
    margin: 12px;
  }
  
  .content-wrapper {
    padding: 12px;
  }
}
</style> 