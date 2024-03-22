<script setup lang="ts">
import { nextTick, ref, watchEffect } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useTasks } from '@/components/tasks/composables'
import { useFolders } from '@/components/folders/composables'
import { useApp, useGutter } from '@/composables'
import { APP_DEFAULTS } from '~/services/store/constants'
import SolarPlayBold from '~icons/solar/play-bold'
import SolarPauseBold from '~icons/solar/pause-bold'

const { store } = window.electron

const { lastTask, start, stop, isStarted, timeFormatted } = useTasks()
const { addFolder } = useFolders()

const sidebarRef = ref<HTMLElement>()
const gutterRef = ref<{ $el: HTMLElement }>()

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
    <SidebarMenu class="pb-2" />
    <div
      class="flex w-full items-center justify-between pl-1 text-[10px] uppercase dark:text-neutral-400"
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
        data-scroll
        class="flex-grow overflow-auto h-1 mt-1"
      >
        <FoldersTree />
      </PerfectScrollbar>
      <div>
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
      </div>
    </div>
    <UiGutter ref="gutterRef" />
  </div>
</template>
