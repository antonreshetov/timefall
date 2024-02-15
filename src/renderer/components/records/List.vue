<script setup lang="ts">
import { ref } from 'vue'
import { useRecords } from '@/components/records/composables'
import { useTasks } from '@/components/tasks/composables'
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

const { stop, currentTaskItemId } = useTasks()

getTaskRecords()

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
  if (currentTaskItemId.value === editRecordId.value)
    stop()

  deleteTaskRecord(editRecordId.value)
  isConfirmOpen.value = false
}
</script>

<template>
  <div
    data-tracking-list
    class="overflow-auto select-none"
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
    </div>
    <Dialog.Root
      :open="isConfirmOpen"
      @update:open="isConfirmOpen = !isConfirmOpen"
    >
      <Dialog.Content class="w-[300px]">
        <Dialog.Title>Are you sure you want to remove this entry?</Dialog.Title>
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
