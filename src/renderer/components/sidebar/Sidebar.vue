<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useTasks } from '@/components/tasks/composables'
import { useApp, useGutter } from '@/composables'
import { APP_DEFAULTS } from '~/services/store/constants'
import SolarPlayBold from '~icons/solar/play-bold'
import SolarPauseBold from '~icons/solar/pause-bold'

const { store } = window.electron

const { lastTask, start, stop, isStarted, timeFormatted } = useTasks()

const sidebarRef = ref<HTMLElement>()
const gutterRef = ref<{ $el: HTMLElement }>()

const { sidebarWidth } = useApp()
const { width } = useGutter(
  sidebarRef,
  gutterRef,
  Number.parseInt(sidebarWidth.value),
  APP_DEFAULTS.sizes.sidebar,
)

watchEffect(() => {
  sidebarWidth.value = `${width.value}px`
  store.app.set('sizes.sidebar', width.value)
})
</script>

<template>
  <div
    ref="sidebarRef"
    data-sidebar
    class="flex flex-col px-2 pb-2 bg-neutral-100 dark:bg-neutral-800 select-none relative"
  >
    <UiTopbar class="bg-neutral-100 dark:bg-neutral-800" />
    <SidebarMenu class="flex-grow" />
    <div
      v-if="lastTask"
      class="flex items-center gap-2 bg-white dark:bg-neutral-700 rounded px-2 py-1 dark:text-white"
    >
      <div class="flex justify-center w-[25px] flex-shrink-0">
        <SolarPlayBold
          v-if="!isStarted"
          class="w-5 h-5"
          :style="{ color: lastTask.color }"
          @click="start(lastTask.id)"
        />
        <SolarPauseBold
          v-else
          class="w-4 h-4"
          @click="stop"
        />
      </div>
      <div>
        <div class="font-bold">
          {{ timeFormatted }}
        </div>
        <div class="text-ellipsis overflow-hidden line-clamp-1">
          {{ lastTask.name }}
        </div>
      </div>
    </div>
    <UiGutter ref="gutterRef" />
  </div>
</template>
