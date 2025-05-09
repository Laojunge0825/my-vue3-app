<template id="app">
  <div>
    <BasicLayouts />
    <!-- <router-view></router-view> -->
  </div>
</template>
<script setup lang="ts">
  /**
   * App根组件
   */
  import BasicLayouts from '../src/layouts/BasicLayouts.vue'
</script>

<style>
  #app {
    width: 100%;
    height: 100%;
  }
</style>
