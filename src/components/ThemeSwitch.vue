<script setup lang="ts">
import { SavedTheme, useSavedTheme } from '@/utils/compostions/theme';

import UiRadioSwitch from '@/components/ui/ui-radio-switch/UiRadioSwitch.vue';
import type { IUiRadioSwitchOption } from '@/components/ui/ui-radio-switch/UiRadioSwitch.types';

interface IThemeSwitchProps {
  vertical?: boolean;
}

const props = defineProps<IThemeSwitchProps>();

const savedTheme = useSavedTheme();

const themeOptions: IUiRadioSwitchOption[] = [
  {
    value: SavedTheme.Light,
    label: 'L',
  },
  {
    value: null,
    label: 'A',
  },
  {
    value: SavedTheme.Dark,
    label: 'D',
  },
];
</script>

<template>
  <UiRadioSwitch
    v-model="savedTheme"
    :options="themeOptions"
    :vertical="props.vertical"
  />
</template>
