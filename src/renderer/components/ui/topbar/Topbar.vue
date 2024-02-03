<script setup lang="ts">
import { cn } from '@/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div
    data-ui-topbar
    :class="
      cn(
        'h-[var(--topbar-height)] sticky top-0 z-10 dark:bg-neutral-900 bg-white w-full flex items-center',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
