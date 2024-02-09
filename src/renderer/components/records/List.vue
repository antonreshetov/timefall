<script setup lang="ts">
import { useRecords } from '@/components/records/composables'

const { getTaskRecords, taskRecordsGroupedByCreatedDate } = useRecords()

getTaskRecords()
</script>

<template>
  <div
    data-tracking-list
    class="overflow-auto"
  >
    <UiTopbar>
      <div class="flex justify-between w-full px-4 text-sm">
        <div class="">
          Time Entries
        </div>
      </div>
    </UiTopbar>
    <div>
      <RecordsGroup
        v-for="(v, k) in taskRecordsGroupedByCreatedDate"
        :key="k"
        :date="k"
        :records="v"
      >
        <RecordsItem
          v-for="i in v"
          :key="i.id"
          :data="i"
        />
      </RecordsGroup>
    </div>
  </div>
</template>
