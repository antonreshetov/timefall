import type { Api } from '~/services/api/types'
import type { Store } from '~/services/store/types'

declare global {
  interface Window {
    electron: {
      api: Api
      store: Store
      tray: {
        startTimer: () => void
        stopTimer: () => void
        setTime: (time: number) => void
        onStart: (callback: () => void) => void
        onStop: (callback: () => void) => void
      }
      updates: {
        checkForUpdates: () => void
        downloadUpdate: () => void
        onUpdateAvailable: (callback: () => void) => void
      }
    }
  }
}
