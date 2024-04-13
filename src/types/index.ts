import type { Api } from '~/services/api/types'
import type { Store } from '~/services/store/types'

declare global {
  interface Window {
    electron: {
      api: Api
      store: Store
      tray: {
        onStart: (callback: () => void) => void
        onStop: (callback: () => void) => void
      }
      timer: {
        getTime: () => number
        isTimerActive: () => boolean
        onStart: (callback: () => void) => void
        onStop: (callback: () => void) => void
        onUpdate: (callback: (time: number) => void) => void
        startTimer: () => void
        stopTimer: () => void
      }
      updates: {
        checkForUpdates: () => void
        downloadUpdate: () => void
        onUpdateAvailable: (callback: () => void) => void
      }
    }
  }
}
