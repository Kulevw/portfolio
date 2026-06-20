<script setup lang="ts">
import type { UiTabsRadiosValue } from './UiTabs.types';

interface IUiTabsRadioItemProps {
  id: string;
  name: string;
  value: UiTabsRadiosValue;
  checked: boolean;
}

const props = defineProps<IUiTabsRadioItemProps>();

const emit = defineEmits({
  'change': (e: Event) => e instanceof Event,
});
</script>

<template>
  <label class="ui-tabs-radio-item">
    <input
      :id="props.id"
      class="fake-hidden"
      :name="props.name"
      type="radio"
      :value="props.value"
      :checked="props.checked"
      @change="emit('change', $event)"
    />
    <span class="ui-tabs-radio-item__value">
      <slot />
    </span>
  </label>
</template>

<style lang="scss" scoped>
  @use '@/styles/mixins' as *;

.ui-tabs-radio-item {
  cursor: pointer;

  &__value {
    input:focus-visible + & {
      @include focus-outline
    }
  }
}
</style>
