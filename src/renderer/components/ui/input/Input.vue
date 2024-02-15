<script setup lang="ts">
import type { Variants } from './variants'
import { variants } from './variants'
import { cn } from '@/utils'

interface Props {
  variant?: Variants['variant']
  size?: Variants['size']
  type?: 'text' | 'number' | 'textarea'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  type: 'text',
})

const model = defineModel<string | number>()
</script>

<template>
  <input
    v-if="type !== 'textarea'"
    v-model="model"
    :class="cn(variants({ variant, size }), props.class)"
    :type="type"
  >
  <textarea
    v-else
    v-model="model"
    :class="cn(variants({ variant, size }), props.class)"
    rows="3"
  />
</template>
