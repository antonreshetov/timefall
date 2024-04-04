<script setup lang="ts">
import { useReports } from '@/components/reports/composables'

const { getTaskRecords, getTasks } = useReports()

getTaskRecords()
getTasks()
</script>

<template>
  <div
    data-reports
    class="col-span-2 flex flex-col"
  >
    <UiTopbar>
      <ReportsTopbar />
    </UiTopbar>
    <div class="grid grid-cols-[1fr__200px] flex-grow">
      <ReportsChart class="h-[calc(100vh-95px)]" />
      <ReportsInfo />
    </div>
  </div>
</template>
