<script setup lang="ts">
import { useReports } from '@/components/reports/composables'

const {
  getTaskRecords,
  setMonthRange,
  setWeekRange,
  setYearRange,
  selectedRangeType,
} = useReports()

getTaskRecords()
setWeekRange()
</script>

<template>
  <div class="col-span-2">
    <UiTopbar>
      <div class="flex items-center gap-2 px-4 text-sm">
        <UiButton
          :variant="selectedRangeType === 'week' ? 'default' : 'ghost'"
          @click="setWeekRange(new Date())"
        >
          Week
        </UiButton>
        <UiButton
          :variant="selectedRangeType === 'month' ? 'default' : 'ghost'"
          @click="setMonthRange"
        >
          Month
        </UiButton>
        <UiButton
          :variant="selectedRangeType === 'year' ? 'default' : 'ghost'"
          @click="setYearRange(2024)"
        >
          Year
        </UiButton>
      </div>
    </UiTopbar>
    <div class="px-4">
      <ReportsChart />
    </div>
  </div>
</template>
