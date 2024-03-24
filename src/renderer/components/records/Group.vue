<script setup lang="ts">
import { computed } from 'vue'
import type { TaskRecordWithInfo } from '~/services/api/types'
import { timeFormat } from '@/utils'

interface Props {
  date: string
  records: TaskRecordWithInfo[]
}

const props = defineProps<Props>()

const totalDuration = computed(() => {
  return timeFormat(
    props.records.reduce((acc, i) => acc + i.duration, 0),
    false,
  )
})

const cost = computed(() => {
  return props.records.reduce((acc, i) => acc + i.cost, 0)
})
</script>

<template>
  <div data-tracking-group>
    <div
      class="sticky top-0 bg-white dark:bg-neutral-900 py-2 text-2xl border-b border-neutral-200 dark:border-neutral-700 z-10"
    >
      <div class="grid grid-cols-[3fr_1fr_80px] px-4 text-lg gap-2">
        <div class="font-bold">
          {{ date }}
        </div>
        <div
          class="text-neutral-400 dark:text-neutral-500 text-right tabular-nums"
        >
          ${{ cost.toFixed(2) }}
        </div>
        <div
          class="text-neutral-400 dark:text-neutral-500 text-right tabular-nums"
        >
          {{ totalDuration }}
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>
