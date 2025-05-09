<template>
  <a-layout class="layout">
    <!-- 侧边栏组件 -->
    <the-sidebar ref="sidebarRef" v-model:collapsed="collapsed" />
    <!-- 内容区域 -->
    <a-layout :style="contentStyle">
      <the-content />
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import TheSidebar from '../components/layout/TheSidebar.vue'
  import TheContent from '../components/layout/TheContent.vue'

  export default defineComponent({
    name: 'BasicLayouts',
    components: {
      TheSidebar,
      TheContent
    },
    setup() {
      /**
       * @description 侧边栏折叠状态
       */
      const collapsed = ref<boolean>(false)

      /**
       * @description 侧边栏组件引用
       */
      const sidebarRef = ref()

      /**
       * @description 内容区域样式
       */
      const contentStyle = computed(() => {
        return {
          marginLeft: collapsed.value ? '80px' : '200px',
          transition: 'all 0.2s'
        }
      })

      return {
        collapsed,
        sidebarRef,
        contentStyle
      }
    }
  })
</script>

<style scoped>
  .layout {
    min-height: 100vh;
    background: #f0f2f5;
  }
</style>
