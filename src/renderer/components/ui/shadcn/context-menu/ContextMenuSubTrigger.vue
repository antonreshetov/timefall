<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  ContextMenuSubTrigger,
  type ContextMenuSubTriggerProps,
  useForwardProps,
} from 'radix-vue'
import { ChevronRight } from 'lucide-vue-next'
import { cn } from '@/utils'

const props = defineProps<
  ContextMenuSubTriggerProps & {
    class?: HTMLAttributes['class']
    inset?: boolean
  }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <ContextMenuSubTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-900 dark:focus:bg-neutral-700 dark:focus:text-neutral-50 dark:data-[state=open]:bg-neutral-700 dark:data-[state=open]:text-neutral-50',
        inset && 'pl-8',
        props.class,
      )
    "
  >
    <slot />
    <ChevronRight class="ml-auto h-4 w-4" />
  </ContextMenuSubTrigger>
</template>
