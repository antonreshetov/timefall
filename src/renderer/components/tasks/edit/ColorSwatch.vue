<script setup lang="ts">
import { COLORS } from '~/services/api/constants'
import { useTasks } from '@/components/tasks/composables'
import { useRecords } from '@/components/records/composables'

const api = window.electron.api

const { editTask, getTasks } = useTasks()
const { getTaskRecords } = useRecords()

function onClick(color: string) {
  api.updateTask(editTask.value.id, { color })
  getTasks()
  getTaskRecords()
}
</script>

<template>
  <div>
    <div class="flex gap-1">
      <div
        v-for="color in COLORS"
        :key="color"
        class="w-5 h-5 rounded-full _cursor-pointer relative"
        :style="{ backgroundColor: color }"
        :class="{ 'color-is-active': color === editTask.color }"
        @click="onClick(color)"
      />
    </div>
  </div>
</template>

<style>
.color-is-active::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background-color: #000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.5;
}
</style>
