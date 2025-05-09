<template>
  <a-layout-content class="content">
    <div class="content-container">
      <router-view />
    </div>
  </a-layout-content>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'TheContent',
    setup() {
      return {}
    }
  })
</script>

<style scoped>
  .content {
    margin: 24px 16px;
    overflow: initial;
    flex: 1;
  }

  .content-container {
    padding: 24px;
    background: #fff;
    border-radius: 4px;
    min-height: calc(100vh - 48px);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
</style>
