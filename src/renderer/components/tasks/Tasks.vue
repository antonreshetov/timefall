<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { useTasks } from '@/components/tasks/composables'
import type { TaskRecord } from '~/services/api/types'

const { tasks, getTasks, addTask } = useTasks()

getTasks()

function taskTotalDuration(items: TaskRecord[] = []) {
  return items.reduce((acc, i) => acc + i.duration, 0)
}
</script>

<template>
  <div
    class="overflow-auto relative border-r border-neutral-200 dark:border-neutral-800"
  >
    <UiTopbar>
      <div class="px-4 text-sm flex justify-end flex-grow gap-2">
        <UiButton
          variant="ghost"
          @click="addTask"
        >
          <Plus class="w-4 h-4" />
        </UiButton>
      </div>
    </UiTopbar>
    <div>
      <TasksItem
        v-for="i in tasks"
        :id="i.id"
        :key="i.id"
        class="px-4"
        :name="i.name"
        :duration="taskTotalDuration(i.records)"
      />
    </div>
  </div>
</template>
