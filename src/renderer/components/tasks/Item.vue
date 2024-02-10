<script setup lang="ts">
import { Pause, Play } from 'lucide-vue-next'
import { computed } from 'vue'
import { useTasks } from '@/components/tasks/composables'
import { timeFormat } from '@/utils'

const props = defineProps<Props>()

interface Props {
  id: string
  name: string
  duration: number
}

const { start, stop, currentTaskId, sec } = useTasks()

const isStarted = computed(() => currentTaskId.value === props.id)
</script>

<template>
  <div
    data-task-item
    class="flex items-center gap-2 py-2"
  >
    <div class="flex items-center gap-2 flex-grow">
      <div class="flex-shrink-0">
        <Play
          v-if="!isStarted"
          class="w-4 h-4"
          @click="start(id)"
        />
        <Pause
          v-else
          class="w-4 h-4"
          @click="stop"
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