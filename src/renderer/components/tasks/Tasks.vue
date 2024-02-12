<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { ref, watchEffect } from 'vue'
import { useTasks } from '@/components/tasks/composables'
import type { TaskRecord } from '~/services/api/types'
import { useApp, useGutter } from '@/composables'
import { APP_DEFAULTS } from '~/services/store/constants'

const { store } = window.electron

const { tasks, getTasks, addTask } = useTasks()

const tasksRef = ref<HTMLElement>()
const gutterRef = ref<{ $el: HTMLElement }>()

getTasks()

const { tasksWidth, sidebarWidth, tasksWidthOffset } = useApp()

const minWidth = APP_DEFAULTS.sizes.sidebar + APP_DEFAULTS.sizes.tasks

const { width } = useGutter(
  tasksRef,
  gutterRef,
  Number.parseInt(tasksWidthOffset.value),
  minWidth,
)

watchEffect(() => {
  const _width = width.value - Number.parseInt(sidebarWidth.value)

  tasksWidth.value = `${_width}px`
  store.app.set('sizes.tasks', _width)
})

function taskTotalDuration(items: TaskRecord[] = []) {
  return items.reduce((acc, i) => acc + i.duration, 0)
}
</script>

<template>
  <div
    ref="tasksRef"
    data-tasks
    class="overflow-auto relative border-r border-neutral-200 dark:border-neutral-800 select-none"
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
        :name="i.name"
        :color="i.color"
        :duration="taskTotalDuration(i.records)"
      />
    </div>
    <UiGutter ref="gutterRef" />
  </div>
</template>
