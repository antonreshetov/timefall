<script setup lang="ts">
import { format } from 'date-fns'
import { computed, watchEffect } from 'vue'
import { useRecords } from './composables'
import type { TaskRecordWithInfo } from '~/services/api/types'
import { timeFormat } from '@/utils'
import * as Popover from '@/components/ui/shadcn/popover'

interface Props {
  data: TaskRecordWithInfo
}

const props = defineProps<Props>()

const { contextRecordId, isOpenEditMenu, editRecordId } = useRecords()

const isOpen = computed(
  () => isOpenEditMenu.value && editRecordId.value === props.data.id,
)

function onUpdateOpen(bool: boolean) {
  if (!bool) {
    isOpenEditMenu.value = false
    contextRecordId.value = ''
  }
}

watchEffect(() => {
  if (isOpen.value)
    contextRecordId.value = props.data.id
})
</script>

<template>
  <div
    data-tracking-item
    class="grid grid-cols-[60px_1fr_100px] gap-2 px-4 py-2 border-b border-neutral-200 dark:border-neutral-700 last:border-none"
    :class="[
      contextRecordId === data.id
        ? 'bg-neutral-100 dark:bg-neutral-800 '
        : null,
    ]"
  >
    <div class="flex flex-col justify-between text-xs leading-normal relative">
      <Popover.Root
        :open="isOpen"
        @update:open="onUpdateOpen"
      >
        <Popover.Trigger
          :as-child="true"
          as="div"
        >
          <div>
            <span v-if="!data.updatedAt"> now </span>
            <span v-else>
              {{ format(data.createdAt + data.duration * 1000, "HH:mm") }}
            </span>
          </div>
          <div class="text-neutral-400 dark:text-neutral-500">
            {{ format(data.createdAt, "HH:mm") }}
          </div>
        </Popover.Trigger>
        <Popover.Content
          side="left"
          class="w-[300px]"
        >
          <RecordsEditMenu />
        </Popover.Content>
      </Popover.Root>
      <div
        class="absolute w-[2px] top-0 bottom-0 right-2"
        :style="{ backgroundColor: data.color }"
      />
    </div>
    <div class="flex flex-col justify-center leading-normal">
      <div
        class="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 font-bold"
      >
        {{ data.folderName }}
      </div>
      <div>
        {{ data.taskName }}
      </div>
    </div>
    <div class="flex items-center justify-end tabular-nums">
      {{ timeFormat(data.duration, false) }}
    </div>
  </div>
</template>
