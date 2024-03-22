<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { nextTick, ref, watchEffect } from 'vue'
import { useTasks } from '@/components/tasks/composables'
import { useRecords } from '@/components/records/composables'
import { useFolders } from '@/components/folders/composables'
import type { TaskRecord } from '~/services/api/types'
import { useApp, useGutter } from '@/composables'
import { APP_DEFAULTS } from '~/services/store/constants'
import * as ContextMenu from '@/components/ui/shadcn/context-menu'
import * as Dialog from '@/components/ui/shadcn/dialog'

const { store } = window.electron

const {
  getTasks,
  addTask,
  editTaskId,
  contextTaskId,
  deleteTask,
  isOpenEditMenu,
  stop,
  currentTaskId,
  filteredTasks,
} = useTasks()
const { getTaskRecords } = useRecords()
const { selectedFolderId } = useFolders()
const { tasksWidth, sidebarWidth, tasksWidthOffset } = useApp()

getTasks()

const tasksRef = ref<HTMLElement>()
const gutterRef = ref<{ $el: HTMLElement }>()

const isConfirmOpen = ref(false)

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

function onOpen(bool: boolean) {
  if (!bool)
    contextTaskId.value = ''
}

function onClick(id: string) {
  editTaskId.value = id
  contextTaskId.value = id
}

function onAddTask() {
  addTask(selectedFolderId.value)

  const scrollEl = tasksRef.value.querySelector('[data-scroll]')
  nextTick(() => {
    scrollEl.scrollTo(0, scrollEl.scrollHeight)
  })
}

function onDelete() {
  if (editTaskId.value === currentTaskId.value)
    stop()

  isConfirmOpen.value = false
  deleteTask(editTaskId.value)
  getTaskRecords()
}

function onDragStart(e: DragEvent, id: string) {
  e.dataTransfer.setData('taskId', id)
}
</script>

<template>
  <div
    ref="tasksRef"
    data-tasks
    class="flex flex-col border-r border-neutral-200 dark:border-neutral-800 select-none relative"
  >
    <UiTopbar>
      <div
        class="px-4 text-sm flex items-center justify-between flex-grow gap-2"
      >
        <UiButton
          variant="ghost"
          @click="selectedFolderId = ''"
        >
          All Tasks
        </UiButton>
        <UiButton
          variant="ghost"
          @click="onAddTask"
        >
          <Plus class="w-4 h-4" />
        </UiButton>
      </div>
    </UiTopbar>
    <div class="flex flex-col gap-2 flex-grow">
      <PerfectScrollbar
        data-scroll
        class="flex-grow h-1"
      >
        <ContextMenu.Root @update:open="onOpen">
          <ContextMenu.Trigger>
            <TasksItem
              v-for="i in filteredTasks"
              :id="i.id"
              :key="i.id"
              :name="i.name"
              :color="i.color"
              :draggable="true"
              :duration="taskTotalDuration(i.records)"
              @dragstart="onDragStart($event, i.id)"
              @contextmenu="onClick(i.id)"
            />
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item @click="onAddTask">
              New Task
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item @click="isOpenEditMenu = true">
              Edit...
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item @click="isConfirmOpen = true">
              Delete
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      </PerfectScrollbar>
    </div>
    <UiGutter ref="gutterRef" />
    <Dialog.Root
      :open="isConfirmOpen"
      @update:open="isConfirmOpen = !isConfirmOpen"
    >
      <Dialog.Content class="w-[300px]">
        <Dialog.Title>Are you sure you want to remove this task?</Dialog.Title>
        <UiButton
          variant="primary"
          @click="onDelete"
        >
          Delete
        </UiButton>
        <UiButton @click="isConfirmOpen = false">
          Cancel
        </UiButton>
      </Dialog.Content>
    </Dialog.Root>
  </div>
</template>
