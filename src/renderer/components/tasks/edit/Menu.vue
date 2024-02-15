<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

import { useTasks } from '@/components/tasks/composables'
import { useRecords } from '@/components/records/composables'

const api = window.electron.api

const { editTask, getTasks } = useTasks()
const { getTaskRecords } = useRecords()

const name = ref(editTask.value.name)
const lastSavedName = ref(editTask.value.name)

const hourRate = ref(editTask.value.hourRate)
const lastSavedHourRate = ref(editTask.value.hourRate)

function update() {
  if (name.value !== lastSavedName.value) {
    api.updateTask(editTask.value.id, { name: name.value })
    getTasks()
    getTaskRecords()
  }

  if (hourRate.value !== lastSavedHourRate.value) {
    api.updateTask(editTask.value.id, { hourRate: hourRate.value })
    getTasks()
    getTaskRecords()
  }
}

onBeforeUnmount(() => {
  update()
})
</script>

<template>
  <div
    data-task-edit-menu
    class="p-2"
  >
    <div class="grid grid-cols-[70px_1fr] gap-4">
      <div class="text-right">
        Name
      </div>
      <UiInput
        v-model="name"
        size="sm"
      />
      <div class="text-right">
        Color
      </div>
      <TasksEditColorSwatch />
      <div class="text-right">
        Hour Rate
      </div>
      <UiInput
        v-model="hourRate"
        size="sm"
        type="number"
      />
    </div>
  </div>
</template>
