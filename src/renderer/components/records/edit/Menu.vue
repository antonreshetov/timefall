<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, watchEffect } from 'vue'
import type { MaskaDetail } from 'maska'
import { vMaska } from 'maska'
import { useRecords } from '@/components/records/composables'
import { useTasks } from '@/components/tasks/composables'
import { timeFormat, timeToSec } from '@/utils'

const { editRecord, getTaskRecords } = useRecords()
const { getTasks } = useTasks()

const { api } = window.electron

const duration = ref(editRecord.value.duration)
const lastSavedDuration = ref(editRecord.value.duration)
const durationFormatted = ref(timeFormat(editRecord.value.duration))

const description = ref(editRecord.value.description)
const lastSavedDescription = ref(editRecord.value.description)

const options = reactive({
  mask: '##:##:##',
  eager: true,
})

const mask = reactive<MaskaDetail>({
  completed: false,
  masked: '',
  unmasked: '',
})

watchEffect(() => {
  if (mask.completed)
    duration.value = timeToSec(mask.masked)
})

onBeforeUnmount(() => {
  if (duration.value !== lastSavedDuration.value) {
    api.updateTaskRecord(editRecord.value.id, {
      duration: duration.value,
    })
    getTaskRecords()
    getTasks()
  }

  if (description.value !== lastSavedDescription.value) {
    api.updateTaskRecord(editRecord.value.id, {
      description: description.value,
    })
    getTaskRecords()
    getTasks()
  }
})
</script>

<template>
  <div
    data-record-edit-menu
    class="p-2"
  >
    <div class="grid grid-cols-[70px_1fr] gap-4">
      <div class="text-right">
        Duration
      </div>
      <UiInput
        v-model="durationFormatted"
        v-maska:[options]="mask"
        size="sm"
      />
      <div class="text-right">
        Notes
      </div>
      <UiInput
        v-model="description"
        size="sm"
        type="textarea"
      />
    </div>
  </div>
</template>
