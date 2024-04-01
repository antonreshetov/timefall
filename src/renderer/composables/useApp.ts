import { useCssVar } from '@vueuse/core'
import { ref, watchEffect } from 'vue'

const { store, updates } = window.electron

const isUpdateAvailable = ref(false)

const sidebarWidth = useCssVar('--sidebar-width')
const tasksWidth = useCssVar('--tasks-width')
const tasksWidthOffset = useCssVar('--tasks-width-offset')

sidebarWidth.value = `${store.app.get('sizes.sidebar')}px`
tasksWidth.value = `${store.app.get('sizes.tasks')}px`

watchEffect(() => {
  tasksWidthOffset.value = `${Number.parseInt(sidebarWidth.value) + Number.parseInt(tasksWidth.value)}px`
})

updates.checkForUpdates()

updates.onUpdateAvailable(() => {
  isUpdateAvailable.value = true
})

setInterval(
  () => {
    updates.checkForUpdates()
  },
  1000 * 60 * 360,
) // 6 часов

export function useApp() {
  return {
    isUpdateAvailable,
    sidebarWidth,
    tasksWidth,
    tasksWidthOffset,
  }
}
