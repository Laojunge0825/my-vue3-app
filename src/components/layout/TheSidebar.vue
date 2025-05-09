<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    :trigger="null"
    collapsible
    class="sidebar"
    :width="200"
    :collapsedWidth="80"
  >
    <!-- Logo区域 -->
    <div class="logo">
      <div class="logo-text" v-if="!collapsed">Vue3 Admin</div>
      <div class="logo-icon" v-else>V3</div>
    </div>

    <!-- 菜单区域 -->
    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
      theme="dark"
      @click="handleMenuClick"
    >
      <!-- 首页菜单项 -->
      <a-menu-item key="home">
        <template #icon>
          <home-outlined />
        </template>
        <span>首页</span>
      </a-menu-item>

      <!-- 工作台菜单项 -->
      <a-menu-item key="dashboard">
        <template #icon>
          <desktop-outlined />
        </template>
        <span>工作台</span>
      </a-menu-item>

      <!-- Tree组件演示子菜单 -->
      <a-sub-menu key="tree">
        <template #icon>
          <apartment-outlined />
        </template>
        <template #title>树形组件</template>
        <a-menu-item key="tree">Tree组件</a-menu-item>
        <a-menu-item key="tree-lazy">懒加载树</a-menu-item>
        <a-menu-item key="3d-tree">3D树形图</a-menu-item>
        <a-menu-item key="3d-data">3D数据</a-menu-item>
      </a-sub-menu>

      <!-- 用户管理子菜单 -->
      <a-sub-menu key="user">
        <template #icon>
          <user-outlined />
        </template>
        <template #title>用户管理</template>
        <a-menu-item key="user-list">用户列表</a-menu-item>
        <a-menu-item key="user-detail">用户详情</a-menu-item>
        <a-menu-item key="user-settings">用户设置</a-menu-item>
      </a-sub-menu>

      <!-- 数据分析子菜单 -->
      <a-sub-menu key="analysis">
        <template #icon>
          <area-chart-outlined />
        </template>
        <template #title>数据分析</template>
        <a-menu-item key="dashboard">数据看板</a-menu-item>
        <a-menu-item key="charts">趋势图表</a-menu-item>
      </a-sub-menu>

      <!-- 系统设置菜单项 -->
      <a-menu-item key="settings">
        <template #icon>
          <setting-outlined />
        </template>
        <span>系统设置</span>
      </a-menu-item>
    </a-menu>

    <!-- 折叠触发器 -->
    <div class="trigger" @click="toggleCollapsed">
      <menu-unfold-outlined v-if="collapsed" />
      <menu-fold-outlined v-else />
    </div>
  </a-layout-sider>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import {
    HomeOutlined,
    DesktopOutlined,
    UserOutlined,
    AreaChartOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ApartmentOutlined
  } from '@ant-design/icons-vue'

  export default defineComponent({
    name: 'TheSidebar',
    components: {
      HomeOutlined,
      DesktopOutlined,
      UserOutlined,
      AreaChartOutlined,
      SettingOutlined,
      MenuFoldOutlined,
      MenuUnfoldOutlined,
      ApartmentOutlined
    },
    props: {
      collapsed: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:collapsed'],
    setup(props, { emit }) {
      const router = useRouter()
      const route = useRoute()

      /**
       * @description 选中的菜单项
       */
      const selectedKeys = ref<string[]>(['home'])

      /**
       * @description 展开的子菜单
       */
      const openKeys = ref<string[]>(['tree'])

      /**
       * @description 路由与菜单的映射关系
       */
      const routeMap: Record<string, string> = {
        '/': 'home',
        '/tree': 'tree',
        '/tree-lazy': 'tree-lazy',
        '/3d-tree': '3d-tree',
        '/3d-data': '3d-data'
      }

      /**
       * @description 根据当前路由设置选中的菜单项
       */
      const updateSelectedKeys = () => {
        const path = route.path
        const key = routeMap[path] || 'home'
        selectedKeys.value = [key]

        // 设置打开的子菜单
        if (key.includes('tree') || key.includes('3d')) {
          openKeys.value = ['tree']
        } else if (key.includes('user')) {
          openKeys.value = ['user']
        } else if (key.includes('chart') || key === 'dashboard') {
          openKeys.value = ['analysis']
        }
      }

      /**
       * @description 处理菜单点击事件
       */
      const handleMenuClick = (info: { key: string }) => {
        const key = info.key
        let path = '/'

        // 根据菜单key确定要跳转的路由路径
        switch (key) {
          case 'home':
            path = '/'
            break
          case 'dashboard':
          case 'tree':
          case 'tree-lazy':
          case '3d-tree':
          case '3d-data':
            path = `/${key}`
            break
          default:
            // 对于尚未实现的路由，保持在当前页面
            return
        }

        router.push(path)
      }

      /**
       * @description 折叠/展开侧边栏
       */
      const toggleCollapsed = () => {
        emit('update:collapsed', !props.collapsed)
      }

      /**
       * @description 侧边栏折叠时关闭所有子菜单
       */
      watch(
        () => props.collapsed,
        newVal => {
          if (newVal) {
            openKeys.value = []
          } else {
            updateSelectedKeys()
          }
        }
      )

      // 初始化时根据路由设置选中的菜单项
      onMounted(() => {
        updateSelectedKeys()
      })

      // 监听路由变化，更新选中的菜单项
      watch(
        () => route.path,
        () => {
          updateSelectedKeys()
        }
      )

      return {
        selectedKeys,
        openKeys,
        toggleCollapsed,
        handleMenuClick
      }
    }
  })
</script>

<style scoped>
  .sidebar {
    overflow: auto;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
  }

  .logo {
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    overflow: hidden;
  }

  .logo-text {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    white-space: nowrap;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #1890ff;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }

  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    color: #fff;
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.1);
  }

  .trigger:hover {
    color: #1890ff;
  }
</style>
