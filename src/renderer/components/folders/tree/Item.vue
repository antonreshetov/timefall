<script setup lang="ts">
import { computed } from 'vue'
import { useFolders } from '../composables'
import * as Popover from '@/components/ui/shadcn/popover'

interface Props {
  node: any
}

const props = defineProps<Props>()

const { isOpenEditMenu, contextFolderId, editFolderId } = useFolders()

function onUpdateOpen(bool: boolean) {
  if (!bool) {
    isOpenEditMenu.value = false
    contextFolderId.value = ''
  }
}

const isOpen = computed(
  () => isOpenEditMenu.value && editFolderId.value === props.node.id,
)
</script>

<template>
  <div data-folder-tree-node>
    <Popover.Root
      :open="isOpen"
      @update:open="onUpdateOpen"
    >
      <Popover.Trigger
        :as-child="true"
        as="div"
      >
        <slot />
      </Popover.Trigger>
      <Popover.Content class="w-[300px]">
        <FoldersEditMenu />
      </Popover.Content>
    </Popover.Root>
  </div>
</template>
