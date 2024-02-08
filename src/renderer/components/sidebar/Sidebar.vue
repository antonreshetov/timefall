<script setup lang="ts">
import { Pause, Play } from 'lucide-vue-next'
import { useTasks } from '@/components/tasks/composables'

const { lastTask, start, stop, isStarted, timeFormatted } = useTasks()
</script>

<template>
  <div
    data-sidebar
    class="flex flex-col px-2 pb-2 bg-neutral-100 dark:bg-neutral-800"
  >
    <UiTopbar class="bg-neutral-100 dark:bg-neutral-800" />
    <SidebarMenu class="flex-grow" />
    <div
      v-if="lastTask"
      class="flex items-center gap-2 bg-neutral-300 dark:bg-neutral-700 rounded px-2 py-1 text-white"
    >
      <div class="flex justify-center w-[25px]">
        <Play
          v-if="!isStarted"
          class="w-5 h-5"
          @click="start(lastTask.id)"
        />
        <Pause
          v-else
          class="w-4 h-4"
          @click="stop"
        />
      </div>
      <div>
        <div>{{ timeFormatted }}</div>
        <div>
          {{ lastTask.name }}
        </div>
      </div>
    </div>
  </div>
</template>
