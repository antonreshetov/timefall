<script setup lang="ts">
import { useReports } from '@/components/reports/composables'
import { timeFormat } from '@/utils'
import type { TaskWithRecords } from '~/services/api/types'

const { tasksFilteredByRange, totalDuration, totalCost, selectedTotalType }
  = useReports()

function calcDuration(task: TaskWithRecords) {
  return timeFormat(
    task.records.reduce((acc, record) => acc + record.duration, 0),
    false,
  )
}

function calcCost(task: TaskWithRecords) {
  const cost
    = task.records.reduce(
      (acc, record) => acc + record.duration * task.hourRate,
      0,
    ) / 3600
  return cost.toFixed(2)
}
</script>

<template>
  <div
    data-reports-info
    class="flex flex-col justify-between flex-grow"
  >
    <div class="flex flex-col flex-grow">
      <PerfectScrollbar
        data-scroll
        class="flex-grow h-1"
      >
        <div
          v-for="i in tasksFilteredByRange"
          :key="i.id"
          class="flex items-center justify-between gap-2 px-2 py-[2px] text-xs"
        >
          <div class="flex items-center gap-2">
            <div
              class="h-4 w-[3px]"
              :style="{ backgroundColor: i.color }"
            />
            <div>
              {{ i.name }}
            </div>
          </div>

          <div class="tabular-nums text-muted">
            <span v-if="selectedTotalType === 'rate'">
              ${{ calcCost(i) }}
            </span>
            <span v-else>
              {{ calcDuration(i) }}
            </span>
          </div>
        </div>
      </PerfectScrollbar>
    </div>
    <div class="px-2 pb-2 border-t border-neutral-200 dark:border-neutral-700">
      <div class="text-right text-muted text-[10px] uppercase mt-2">
        Summary
      </div>
      <div class="flex gap-4 justify-end text-xl">
        <div>${{ totalCost }}</div>
        <div>
          {{ timeFormat(totalDuration, false) }}
        </div>
      </div>
    </div>
  </div>
</template>
