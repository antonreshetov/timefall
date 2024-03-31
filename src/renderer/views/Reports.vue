<script setup lang="ts">
import { Clock5, DollarSign } from 'lucide-vue-next'
import { useReports } from '@/components/reports/composables'

const {
  getTaskRecords,
  setMonthRange,
  setWeekRange,
  setYearRange,
  selectedRangeType,
  getTasks,
  selectedTotalType,
} = useReports()

getTaskRecords()
getTasks()

setWeekRange()
selectedTotalType.value = 'duration'
</script>

<template>
  <div
    data-reports
    class="col-span-2 flex flex-col"
  >
    <UiTopbar>
      <div
        class="flex items-center justify-between w-full gap-2 pl-4 pr-2 text-sm"
      >
        <div class="flex gap-1">
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
        <div class="flex gap-1">
          <UiButton
            :variant="selectedTotalType === 'rate' ? 'default' : 'ghost'"
            @click="selectedTotalType = 'rate'"
          >
            <DollarSign class="w-4 h-4" />
          </UiButton>
          <UiButton
            :variant="selectedTotalType === 'duration' ? 'default' : 'ghost'"
            @click="selectedTotalType = 'duration'"
          >
            <Clock5 class="w-4 h-4" />
          </UiButton>
        </div>
      </div>
    </UiTopbar>
    <div class="grid grid-cols-[1fr__200px] flex-grow">
      <ReportsChart class="h-[calc(100vh-95px)]" />
      <ReportsInfo />
    </div>
  </div>
</template>
