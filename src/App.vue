<script setup lang="ts">
/**
 * App根组件
 */
</script>

<template>
  <router-view></router-view>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
  'Noto Color Emoji';
  font-size: 14px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.85);
  background-color: #f0f2f5;
}

#app {
  height: 100%;
  width: 100%;
}

/* 全局样式覆盖 */
.ant-layout {
  background-color: #f0f2f5;
}

.ant-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.ant-btn {
  border-radius: 2px;
}

/* 响应式工具类 */
.hide-on-mobile {
  display: block;
}

@media screen and (max-width: 576px) {
  .hide-on-mobile {
    display: none;
  }
}

* {
  box-sizing: border-box;
}
</style>
