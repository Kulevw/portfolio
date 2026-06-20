<script setup lang="ts">
import { uniqueId } from '@/utils/common';
import { computed, useAttrs } from 'vue';
import type { IUiRadioSwitchProps, UiRadioSwitchValue } from './UiRadioSwitch.types';

const attrs = useAttrs();

const props = withDefaults(defineProps<IUiRadioSwitchProps>(), {
  id: () => uniqueId('ui-radio-switch-id'),
  name: () => uniqueId('ui-radio-switch-name'),
});

const emit = defineEmits({
  'update:model-value': (value: UiRadioSwitchValue) => value === null || ['boolean', 'string', 'number'].includes(typeof value)
})

const classList = computed((): Record<string, boolean> => ({
  [`ui-radio-switch_vertical`]: props.vertical,
}))
</script>

<template>
  <div class="ui-radio-switch" :class="classList" v-bind="attrs">
    <template v-for="option in props.options" :key="option.value">
      <label class="ui-radio-switch__item">
        <input
          :id="`${props.id}-${option.value}`"
          class="fake-hidden"
          :name="props.name"
          type="radio"
          :value="option.value"
          :checked="option.value === props.modelValue"
          @change="emit('update:model-value', option.value)"
        />
        <span class="ui-radio-switch__value">
          {{ option.label }}
        </span>
      </label>
    </template>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/styles/mixins' as *;

  .ui-radio-switch {
    display: flex;
    outline: var(--border-size-md) solid var(--bg-reverse-color);
    outline-offset: calc(var(--border-size-md) * -1);
    min-height: 40px;
    width: auto;

    &_vertical {
      flex-direction: column;
      min-height: initial;
      min-width: 40px;

      .ui-radio-switch__value {
        height: initial;
        min-height: 40px;
        width: 100%;
      }
    }

    &__value {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: inherit;
      min-width: 40px;
      height: 100%;
      padding: 8px 12px;
      font-weight: var(--font-weight-semibold);
      cursor: pointer;

      input:checked + & {
        background-color: var(--bg-reverse-color);
        color: var(--text-reverse-color)
      }

      input:focus-visible + & {
        @include focus-outline
      }
    }
  }
</style>
