<script setup lang="ts">
import { computed } from 'vue';
import type { IUiLinkProps } from './UiLink.types';

const props = defineProps<IUiLinkProps>();

const emit = defineEmits({
  click: (e: MouseEvent) => e instanceof MouseEvent,
})

const tag = computed(() => props.href ? 'a' : 'button');
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :target="target"
    class="ui-link reset-button"
    @click="emit('click', $event)"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
  .ui-link {
    color: var(--text-color);
    text-decoration: none;

    &:hover,
    &:active {
      color: var(--text-color);
    }
  }
</style>
