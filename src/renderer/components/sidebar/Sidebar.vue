<script setup lang="ts">
import { nextTick, ref, watchEffect } from 'vue'
import { Plus } from 'lucide-vue-next'
import type PS from 'perfect-scrollbar'
import { useTasks } from '@/components/tasks/composables'
import { useFolders } from '@/components/folders/composables'
import { useRecords } from '@/components/records/composables'
import { useApp, useGutter } from '@/composables'
import { APP_DEFAULTS } from '~/services/store/constants'
import SolarPlayBold from '~icons/solar/play-bold'
import SolarPauseBold from '~icons/solar/pause-bold'

const { store, tray } = window.electron

const { lastTask, isStarted, timeFormatted, startStop } = useTasks()
const { addFolder } = useFolders()
const { getTaskRecords } = useRecords()

const sidebarRef = ref<HTMLElement>()
const gutterRef = ref<{ $el: HTMLElement }>()
const scrollRef = ref<PS>()

const { sidebarWidth } = useApp()
const { width } = useGutter(
  sidebarRef,
  gutterRef,
  Number.parseInt(sidebarWidth.value),
  APP_DEFAULTS.sizes.sidebar,
)

function onAddFolder() {
  addFolder({ name: 'Untitled' })

  const scrollEl = sidebarRef.value.querySelector('[data-scroll]')
  nextTick(() => {
    scrollEl.scrollTo(0, scrollEl.scrollHeight)
  })
}

function onUpdateFolders() {
  nextTick(() => scrollRef.value.update())
}

function onStartStop() {
  startStop(lastTask.value.id)
  getTaskRecords()
}

watchEffect(() => {
  sidebarWidth.value = `${width.value}px`
  store.app.set('sizes.sidebar', width.value)
})

tray.onStop(() => {
  onStartStop()
})

tray.onStart(() => {
  onStartStop()
})
</script>

<template>
  <div
    ref="sidebarRef"
    data-sidebar
    class="flex flex-col pb-2 bg-neutral-100 dark:bg-neutral-800 select-none relative"
  >
    <UiTopbar class="bg-neutral-100 dark:bg-neutral-800" />
    <SidebarMenu class="pb-2 px-2" />
    <div
      class="flex w-full items-center justify-between px-2 pl-3 text-[10px] uppercase dark:text-neutral-400"
    >
      Folders
      <UiButton
        variant="ghost-sidebar"
        @click="onAddFolder"
      >
        <Plus class="w-4 h-4" />
      </UiButton>
    </div>
    <div class="flex flex-col gap-2 flex-grow">
      <PerfectScrollbar
        ref="scrollRef"
        data-scroll
        class="flex-grow overflow-auto h-1 mt-1 px-2"
      >
        <FoldersTree @update="onUpdateFolders" />
      </PerfectScrollbar>
      <div class="px-2">
        <div
          v-if="lastTask"
          class="flex items-center gap-2 bg-white dark:bg-neutral-700 rounded px-2 py-1 dark:text-white"
        >
          <div
            class="flex justify-center w-[25px] flex-shrink-0"
            @click="onStartStop"
          >
            <SolarPlayBold
              v-if="!isStarted"
              class="w-5 h-5"
              :style="{ color: lastTask.color }"
            />
            <SolarPauseBold
              v-else
              class="w-4 h-4"
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
      </div>
    </div>
    <UiGutter ref="gutterRef" />
  </div>
</template>
