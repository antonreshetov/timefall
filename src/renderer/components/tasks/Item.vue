<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import chroma from 'chroma-js'
import { usePreferredDark } from '@vueuse/core'
import SolarPlayBold from '~icons/solar/play-bold'
import SolarPauseBold from '~icons/solar/pause-bold'
import { useTasks } from '@/components/tasks/composables'
import { timeFormat } from '@/utils'
import * as Popover from '@/components/ui/shadcn/popover'

interface Props {
  id: string
  name: string
  duration: number
  color?: string
}
const props = defineProps<Props>()

const isDark = usePreferredDark()

const {
  start,
  stop,
  currentTaskId,
  sec,
  contextTaskId,
  isOpenEditMenu,
  editTaskId,
} = useTasks()

const isStarted = computed(() => currentTaskId.value === props.id)
const isOpen = computed(
  () => isOpenEditMenu.value && editTaskId.value === props.id,
)

function onClick() {
  if (!isStarted.value)
    start(props.id)
  else stop()
}

function onUpdateOpen(bool: boolean) {
  if (!bool) {
    isOpenEditMenu.value = false
    contextTaskId.value = ''
  }
}

const actionStyles = computed(() => {
  let backgroundColor

  if (isDark.value) {
    backgroundColor = isStarted.value
      ? chroma(props.color).alpha(0.3).darken(2).hex()
      : chroma(props.color).alpha(0.4).darken(1).hex()
  }
  else {
    backgroundColor = isStarted.value
      ? chroma(props.color).alpha(0.4).brighten(2).hex()
      : chroma(props.color).alpha(0.4).brighten(1).hex()
  }

  return {
    backgroundColor,
  }
})

watchEffect(() => {
  if (isOpen.value)
    contextTaskId.value = props.id
})
</script>

<template>
  <div
    data-task-item
    class="flex items-center gap-2 py-2 px-4 mx-2 rounded"
    :class="[
      contextTaskId === id ? 'bg-neutral-100 dark:bg-neutral-800 ' : null,
    ]"
    :style="{
      backgroundColor: isStarted ? color : null,
      color: isStarted ? 'white' : null,
    }"
  >
    <div class="flex items-center gap-2 flex-grow">
      <div
        class="flex-shrink-0 p-2 relative"
        @click="onClick"
      >
        <SolarPlayBold
          v-if="!isStarted"
          class="w-4 h-4 relative z-10"
          :style="{ color }"
        />
        <SolarPauseBold
          v-else
          class="w-4 h-4 relative text-white1 z-10"
        />
        <div
          class="absolute top-0 left-0 h-full w-full bg-red-300 _opacity-20 rounded-full"
          :style="actionStyles"
        />
      </div>
      <div class="text-ellipsis overflow-hidden line-clamp-1">
        {{ name }}
      </div>
    </div>
    <Popover.Root
      :open="isOpen"
      @update:open="onUpdateOpen"
    >
      <Popover.Trigger
        :as-child="true"
        as="div"
      >
        <div class="tabular-nums flex-shrink-0">
          {{ timeFormat(isStarted ? duration + sec : duration, isStarted) }}
        </div>
      </Popover.Trigger>
      <Popover.Content
        side="right"
        class="w-[350px]"
      >
        <TasksEditMenu />
      </Popover.Content>
    </Popover.Root>
  </div>
</template>
