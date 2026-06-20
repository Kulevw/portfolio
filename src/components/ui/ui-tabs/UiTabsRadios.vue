<script setup lang="ts">
import { uniqueId } from '@/utils/common.ts';
import type { IUiTabsRadiosProps } from './UiTabs.types.ts';
import UiTabsRadioItem from './UiTabsRadioItem.vue';
import { computed, ref, type StyleValue } from 'vue';

const props = withDefaults(defineProps<IUiTabsRadiosProps>(), {
  id: () => uniqueId('ui-tabs-id'),
  name: () => uniqueId('ui-tabs-name'),
});

const emit = defineEmits({
  'update:model-value': (value: typeof props['modelValue']) => value === null || ['boolean', 'string', 'number'].includes(typeof value),
})

const tabsRefs = ref<(HTMLElement | undefined)[]>([])

const selectLineTransitionDuration = ref('0.1ms')

const currentTabIndex = computed((): number =>
  props.options.findIndex(option => option.value === props.modelValue),
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
  <div class="ui-tabs-radios">
    <div
      v-for="option in props.options"
      :key="String(option.value)"
      ref="tabsRefs"
    >
      <UiTabsRadioItem
        :id="`${props.id}-${option.value}`"
        :name="`${props.name}`"
        :value="option.value"
        :checked="props.modelValue === option.value"
        @change="emit('update:model-value', option.value)"
      >
        {{ option.label }}
      </UiTabsRadioItem>
    </div>
    <div
      class="ui-tabs-radios__select-line"
      :style="selectLineStyle"
      @transitionend.once="selectLineTransitionDuration = '0.2s'"
    />
  </div>
</template>

<style lang="scss" scoped>
  .ui-tabs-radios {
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
