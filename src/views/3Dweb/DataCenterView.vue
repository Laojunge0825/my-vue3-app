<template>
  <div class="datacenter-view">
    <DataCenter />
  </div>
</template>

<script setup lang="ts">
  /**
   * 数据中心视图
   * 作为数据中心3D可视化的路由入口
   */
  import DataCenter from './3D_data/DataCenter.vue'
</script>

<style scoped>
  .datacenter-view {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
</style>
