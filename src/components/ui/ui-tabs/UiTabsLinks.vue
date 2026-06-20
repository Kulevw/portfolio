<script setup lang="ts">
import { computed, ref, type StyleValue } from 'vue';
import type { IUiTabsLinksProps } from './UiTabs.types.ts';
import UiTabsLinkItem from './UiTabsLinkItem.vue'

const props = defineProps<IUiTabsLinksProps>();

const emit = defineEmits({
  'update:mode-value': (value: typeof props['modelValue']) => value === null || ['boolean', 'string', 'number'].includes(typeof value),
})

const tabsRefs = ref<(HTMLElement | undefined)[]>([])

const selectLineTransitionDuration = ref('0.1ms')

const currentTabIndex = computed((): number =>
  props.options.findIndex(option => option.href === props.modelValue),
)

const selectLineStyle = computed((): StyleValue => {
  const tabElement = tabsRefs.value[currentTabIndex.value]
  if (!tabElement) {
    return {}
  }

  const { offsetLeft, clientWidth } = tabElement

  return {
    left: `${offsetLeft}px`,
    width: `${clientWidth}px`,
  }
})
</script>

<template>
  <div class="ui-tabs-links">
    <div
      v-for="option in props.options"
      :key="String(option.href)"
      ref="tabsRefs"
    >
      <UiTabsLinkItem
        :href="option.href"
        @navigate="emit('update:mode-value', $event)"
      >
        {{ option.label }}
      </UiTabsLinkItem>
    </div>

    <div
      class="ui-tabs-links__select-line"
      :style="selectLineStyle"
      @transitionend.once="selectLineTransitionDuration = '0.2s'"
    />
  </div>
</template>

<style lang="scss" scoped>
  .ui-tabs-links {
    position: relative;
    display: flex;
    column-gap: 8px;

    &__select-line {
      position: absolute;
      bottom: -2px;
      height: 2px;
      background-color: var(--text-color);
      left: 0;
      width: 0;
      transition:
        left v-bind(selectLineTransitionDuration) ease,
        width v-bind(selectLineTransitionDuration) ease;
    }
  }
</style>
