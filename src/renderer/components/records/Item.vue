<script setup lang="ts">
import { format } from 'date-fns'
import type { TaskRecordWithInfo } from '~/services/api/types'
import { timeFormat } from '@/utils'

interface Props {
  data: TaskRecordWithInfo
}

defineProps<Props>()
</script>

<template>
  <div
    data-tracking-item
    class="grid grid-cols-[60px_1fr_100px] px-4 py-2 border-b border-neutral-200 dark:border-neutral-700 last:border-none"
  >
    <div class="flex flex-col justify-between text-xs leading-normal">
      <div>
        <span v-if="!data.updatedAt"> now </span>
        <span v-else>
          {{ format(data.createdAt + data.duration * 1000, "HH:mm") }}
        </span>
      </div>
      <div class="text-neutral-400 dark:text-neutral-500">
        {{ format(data.createdAt, "HH:mm") }}
      </div>
    </div>
    <div class="flex flex-col justify-center leading-normal">
      <div
        class="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 font-bold"
      >
        {{ data.folderName }}
      </div>
      <div>
        {{ data.taskName }}
      </div>
    </div>
    <div class="flex items-center justify-end tabular-nums">
      {{ timeFormat(data.duration, false) }}
    </div>
  </div>
</template>
