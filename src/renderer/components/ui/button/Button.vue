<script setup lang="ts">
import { variants } from './variants'
import { cn } from '@/utils'

interface Props {
  variant?: NonNullable<Parameters<typeof variants>[0]>['variant']
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <button :class="cn(variants({ variant }), props.class)">
    <slot />
  </button>
</template>
