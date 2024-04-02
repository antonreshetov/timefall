<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useRecords } from '@/components/records/composables'
import { useTasks } from '@/components/tasks/composables'
import { useFolders } from '@/components/folders/composables'
import * as ContextMenu from '@/components/ui/shadcn/context-menu'
import * as Dialog from '@/components/ui/shadcn/dialog'

const {
  getTaskRecords,
  taskRecordsGroupedByCreatedDate,
  contextRecordId,
  editRecordId,
  isOpenEditMenu,
  deleteTaskRecord,
} = useRecords()
const { stop, currentTaskItemId, selectedTaskId, selectedTask, getTasks }
  = useTasks()
const { selectedFolder } = useFolders()

const isConfirmOpen = ref(false)

function onClick(id: string) {
  editRecordId.value = id
  contextRecordId.value = id
}

function onOpen(bool: boolean) {
  if (!bool)
    contextRecordId.value = ''
}

function onDelete() {
  if (currentTaskItemId.value && currentTaskItemId.value === editRecordId.value)
    stop()

  deleteTaskRecord(editRecordId.value)
  getTasks()

  isConfirmOpen.value = false
}

getTaskRecords()

watch(selectedTask, () => {
  getTaskRecords()
})

watch(selectedFolder, () => {
  getTaskRecords()
})
</script>

<template>
  <div
    data-tracking-list
    class="select-none"
  >
    <UiTopbar>
      <div class="flex justify-between w-full px-4 text-sm">
        <div
          v-if="selectedTask"
          class="flex items-center gap-2"
        >
          <UiButton
            variant="ghost"
            @click="selectedTaskId = undefined"
          >
            <X class="w-4 h-4" />
          </UiButton>
          <div class="flex items-center gap-2">
            <div class="text-sm">
              {{ selectedTask.name }}
            </div>
            <div class="text-sm text-neutral-400 dark:text-neutral-500">
              ({{ selectedTask.recordIds.length }}
              {{ selectedTask.recordIds.length <= 1 ? "item" : "items" }})
            </div>
          </div>
        </div>
        <div v-else>
          Time Entries
        </div>
      </div>
    </UiTopbar>
    <div>
      <PerfectScrollbar
        data-scroll
        class="h-[calc(100vh-50px)] overflow-y-auto"
      >
        <RecordsGroup
          v-for="(v, k) in taskRecordsGroupedByCreatedDate"
          :key="k"
          :date="k"
          :records="v"
        >
          <ContextMenu.Root @update:open="onOpen">
            <ContextMenu.Trigger>
              <RecordsItem
                v-for="i in v"
                :key="i.id"
                :data="i"
                @contextmenu="onClick(i.id)"
              />
            </ContextMenu.Trigger>
            <ContextMenu.Content>
              <ContextMenu.Item @click="isOpenEditMenu = true">
                Edit..
              </ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.Item @click="isConfirmOpen = true">
                Delete
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        </RecordsGroup>
      </PerfectScrollbar>
    </div>
    <Dialog.Root
      :open="isConfirmOpen"
      @update:open="isConfirmOpen = !isConfirmOpen"
    >
      <Dialog.Content class="w-[300px]">
        <Dialog.Title>Are you sure you want to delete this entry?</Dialog.Title>
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
