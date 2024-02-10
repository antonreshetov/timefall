import { useCssVar } from '@vueuse/core'
import { watchEffect } from 'vue'

const { store } = window.electron

const sidebarWidth = useCssVar('--sidebar-width')
const tasksWidth = useCssVar('--tasks-width')
const tasksWidthOffset = useCssVar('--tasks-width-offset')

sidebarWidth.value = `${store.app.get('sizes.sidebar')}px`
tasksWidth.value = `${store.app.get('sizes.tasks')}px`

watchEffect(() => {
  tasksWidthOffset.value = `${Number.parseInt(sidebarWidth.value) + Number.parseInt(tasksWidth.value)}px`
})

export function useApp() {
  return {
    sidebarWidth,
    tasksWidth,
    tasksWidthOffset,
  }
}
