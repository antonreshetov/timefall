<script setup lang="ts">
import { Pause, Play } from 'lucide-vue-next'
import { computed } from 'vue'
import chroma from 'chroma-js'
import { usePreferredDark } from '@vueuse/core'

import { useTasks } from '@/components/tasks/composables'
import { timeFormat } from '@/utils'

const props = defineProps<Props>()

const isDark = usePreferredDark()

interface Props {
  id: string
  name: string
  duration: number
  color?: string
}

const { start, stop, currentTaskId, sec } = useTasks()

const isStarted = computed(() => currentTaskId.value === props.id)

function onClick() {
  if (!isStarted.value)
    start(props.id)
  else stop()
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
</script>

<template>
  <div
    data-task-item
    class="flex items-center gap-2 py-2 px-4 mx-2 rounded"
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
        <Play
          v-if="!isStarted"
          class="w-4 h-4 relative z-10"
          :style="{ color }"
        />
        <Pause
          v-else
          class="w-4 h-4 relative text-white1 z-1"
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
    <div class="tabular-nums flex-shrink-0">
      {{ timeFormat(isStarted ? duration + sec : duration, isStarted) }}
    </div>
  </div>
</template>
