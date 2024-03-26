<script setup lang="ts">
import { ChevronRight, Folder } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import type { Node } from '@/components/ui/tree/types'
import { useFolders } from '@/components/folders/composables'
import * as ContextMenu from '@/components/ui/shadcn/context-menu'
import * as Dialog from '@/components/ui/shadcn/dialog'
import { useRecords } from '@/components/records/composables'
import { useTasks } from '@/components/tasks/composables'

interface Emits {
  (e: 'update'): void
}

const emit = defineEmits<Emits>()

const {
  folders,
  updateFolders,
  getFolders,
  isOpenEditMenu,
  contextFolderId,
  editFolderId,
  editFolder,
  selectedFolderId,
} = useFolders()
const { getTasks, selectedTaskId } = useTasks()
const { getTaskRecords } = useRecords()

const api = window.electron.api

const isConfirmOpen = ref(false)

const tree = computed(() => folders.value as Node[])

function onUpdate(data: any) {
  updateFolders(JSON.parse(JSON.stringify(data)))
  emit('update')
}

function onDrop(e: DragEvent, node: Node) {
  const taskId = e.dataTransfer.getData('taskId')

  api.moveTaskToFolder(taskId, node.id)

  getTasks()
  getTaskRecords()
  getFolders()
}

function onDragStart(e: DragEvent) {
  const name = e.dataTransfer.getData('name')
  const el = document.createElement('div')

  el.innerHTML = name

  document.body.appendChild(el)
  e.dataTransfer.setDragImage(el, 0, 0)
  setTimeout(() => el.remove(), 0)
}

function onContextMenu(id: string) {
  editFolderId.value = id
  contextFolderId.value = id
}

function onClick(id: string) {
  selectedFolderId.value = id
  selectedTaskId.value = undefined
}

function onOpen(bool: boolean) {
  if (!bool)
    contextFolderId.value = ''
}

function onDelete() {
  if (selectedFolderId.value === editFolderId.value)
    selectedFolderId.value = ''

  api.deleteFolder(editFolderId.value)

  getFolders()
  getTasks()
  getTaskRecords()

  isConfirmOpen.value = false
}

getFolders()
</script>

<template>
  <UiTree
    :data="tree"
    :draggable="true"
    :selected-node-id="selectedFolderId"
    @update="onUpdate"
    @dragstart="onDragStart"
  >
    <template #default="{ node, stat }">
      <ContextMenu.Root @update:open="onOpen">
        <ContextMenu.Trigger>
          <FoldersTreeItem :node="node">
            <div
              class="flex items-center gap-1 py-[2px]"
              @click="onClick(node.id)"
              @drop="onDrop($event, node)"
              @contextmenu="onContextMenu(node.id)"
            >
              <ChevronRight
                v-if="node.children.length"
                class="w-4 h-4"
                :class="{ 'rotate-90': stat.isOpen }"
                @click.stop="stat.isOpen = !stat.isOpen"
              />
              <div
                v-else
                class="w-4 h-4"
              />
              <Folder class="w-4 h-4 mr-1" />
              <span>
                {{ node.name }}
              </span>
            </div>
          </FoldersTreeItem>
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
    </template>
  </UiTree>
  <Dialog.Root
    :open="isConfirmOpen"
    @update:open="isConfirmOpen = !isConfirmOpen"
  >
    <Dialog.Content class="w-[300px]">
      <Dialog.Title>
        Are you sure you want to delete "{{ editFolder?.name }}" folder?
      </Dialog.Title>
      <span>Tasks will not be deleted.</span>
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
</template>

<style lang="scss">
.tree-node {
  &[data-hovered="true"] {
    @apply dark:bg-neutral-700 bg-neutral-200 rounded;
  }

  &[data-selected="true"] {
    @apply dark:bg-neutral-700 bg-neutral-200 rounded;
  }
}
.tree {
  &[data-root-hovered="true"] {
    @apply dark:bg-neutral-700 bg-neutral-200 rounded;
  }
}
</style>
