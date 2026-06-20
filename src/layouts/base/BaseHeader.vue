<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { RoutesNames } from '@/router';

import ThemeSwitch from '@/components/ThemeSwitch.vue';
import UiTabsLinks from '@/components/ui/ui-tabs/UiTabsLinks.vue';

const router = useRouter();
const route = useRoute();

const links = [
  {
    name: RoutesNames.Home,
    label: 'Главная',
  },
  {
    name: RoutesNames.About,
    label: 'Описание',
  },
  {
    name: RoutesNames.MazeGeneration,
    label: 'Генерация лабиринтов',
  },
].map(option => ({ href: router.resolve({ name: option.name }).fullPath, label: option.label }))
</script>

<template>
  <header class="base-header" data-theme="reverse">
    <div class="grid-container">
      <div class="base-header__inner">
        <UiTabsLinks :model-value="route.fullPath" :options="links" />

        <ThemeSwitch class="base-header__theme-switch" />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use '@/styles/grid/mixins' as *;

.base-header {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);

  &__inner {
    grid-area: content;
    display: flex;
    align-items: center;
    column-gap: 12px;
    padding: 20px 16px;
  }

  &__theme-switch {
    margin-left: auto;
    display: flex;

    @include mobile-bp {
      display: none;
    }
  }
}
</style>
