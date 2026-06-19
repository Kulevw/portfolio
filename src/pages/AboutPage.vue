<script setup lang="ts">
import { RoutesNames } from '@/router'
</script>

<template>
  <h1>About page</h1>
  <RouterLink :to="{ name: RoutesNames.Home }">Back</RouterLink>
</template>
