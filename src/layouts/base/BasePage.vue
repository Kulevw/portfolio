<script setup lang="ts">
import ThemeSwitch from '@/components/ThemeSwitch.vue';

</script>

<template>
  <div class="left-side">
    <ThemeSwitch vertical />
  </div>
  <div class="base-page">
    <slot />
  </div>
  <div class="right-side">
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/grid/mixins' as *;

  .base-page {
    grid-area: content;
    padding: 0 16px;
  }

  .right-side {
    grid-area: right-side;
    justify-items: start;
    padding-top: 24px;

    @include mobile-bp {
      display: none;
    }
  }

  .left-side {
    display: none;
    grid-area: left-side;
    justify-items: end;
    padding-top: 24px;

    @include mobile-bp {
      display: block;
    }
  }
</style>
