<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  to: string
  icon?: Component
}

defineProps<Props>()
</script>

<template>
  <RouterLink
    :to="to"
    class="block rounded cursor-default"
    data-menu-item
  >
    <div class="px-3 py-2 flex items-center gap-2">
      <component
        :is="icon"
        v-if="icon"
        class="w-5 h-5"
      />
      <slot />
    </div>
  </RouterLink>
</template>

<style>
.router-link-active {
  @apply bg-neutral-200 dark:bg-neutral-700 dark:text-white;
}
</style>
