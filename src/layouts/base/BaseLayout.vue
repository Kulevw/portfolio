<script setup lang="ts">
import BaseHeader from '@/layouts/base/BaseHeader.vue';
</script>

<template>
  <div class="base-layout">
    <BaseHeader />
    <main class="grid-container">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss" scoped>
  .base-layout {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
</style>
