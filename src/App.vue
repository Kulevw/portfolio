<script setup lang="ts">
import { RouterView } from 'vue-router'

import { env } from '@/env';
import { useAppTheme } from '@/utils/compostions/theme';

if (env.IS_CLIENT) {
  useAppTheme();
}
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
@use './styles/index.scss';
</style>
