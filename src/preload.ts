// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'
import { api } from './services/api'
import { store } from './services/store'
import type { AppStore } from './services/store/types'

contextBridge.exposeInMainWorld('electron', {
  api,
  store: {
    app: {
      get: (name: keyof AppStore) => store.app.get(name),
      set: <T extends keyof AppStore>(name: T, value: AppStore[T]) =>
        store.app.set(name, value),
      delete: (name: keyof AppStore) => store.app.delete(name),
    },
  },
})
