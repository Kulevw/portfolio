<script setup lang="ts">
import UiLink from '@/components/ui/ui-link/UiLink.vue';

interface IUiTabsLinkItemProps {
  href: string;
}

const props = defineProps<IUiTabsLinkItemProps>();

const emit = defineEmits({
  navigate: (href: string) => href !== null,
});

function onNavigate(e: MouseEvent, navigate: (e: MouseEvent) => unknown, href: string) {
  navigate(e);
  emit('navigate', href);
}
</script>

<template>
  <RouterLink :to="props.href" custom v-slot="{ href, navigate }">
    <UiLink :href="href" @click="onNavigate($event, navigate, href)">
      <slot />
    </UiLink>
  </RouterLink>
</template>

<style lang="scss" scoped></style>
