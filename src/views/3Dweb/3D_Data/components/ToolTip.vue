<template>
  <div v-if="visible" class="tooltip" :style="{ left: `${x}px`, top: `${y}px` }">
    <div class="tooltip-header">
      <slot name="header">
        {{ title }}
      </slot>
    </div>
    <div class="tooltip-content">
      <slot>
        <div v-for="(value, key) in content" :key="key" class="tooltip-row">
          <span class="tooltip-key">{{ key }}:</span>
          <span class="tooltip-value">{{ value }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    visible: Boolean,
    x: Number,
    y: Number,
    title: String,
    content: Object
  })
</script>

<style scoped>
  .tooltip {
    position: fixed;
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    border-radius: 8px;
    padding: 12px;
    min-width: 220px;
    max-width: 300px;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    z-index: 1000;
    pointer-events: none;
    transform: translate(10px, -50%);
    transition:
      opacity 0.2s,
      transform 0.2s;
  }

  .tooltip-header {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #00ff88;
  }

  .tooltip-content {
    font-size: 14px;
    line-height: 1.5;
  }

  .tooltip-row {
    display: flex;
    justify-content: space-between;
    margin: 6px 0;
  }

  .tooltip-key {
    color: #aaa;
    margin-right: 12px;
  }

  .tooltip-value {
    color: #fff;
    word-break: break-word;
    text-align: right;
  }
</style>
