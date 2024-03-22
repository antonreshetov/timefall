<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import { useFolders } from '@/components/folders/composables'
import { useTasks } from '@/components/tasks/composables'
import { useRecords } from '@/components/records/composables'

const api = window.electron.api

const { editFolderId, editFolder, getFolders, isOpenEditMenu } = useFolders()
const { getTasks } = useTasks()
const { getTaskRecords } = useRecords()
const { enter } = useMagicKeys()

const name = ref(editFolder.value.name)
const lastSavedName = ref(editFolder.value.name)

function update() {
  if (name.value !== lastSavedName.value) {
    api.updateFolder(editFolderId.value, { name: name.value })

    getFolders()
    getTasks()
    getTaskRecords()
  }
}

watch(enter, (v) => {
  if (v)
    isOpenEditMenu.value = false
})

onBeforeUnmount(() => {
  update()
})
</script>

<template>
  <div
    data-folder-item-edit-menu
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
    </div>
  </div>
</template>
