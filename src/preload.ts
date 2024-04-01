// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, shell } from 'electron'
import { repository } from '../package.json'
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
  tray: {
    startTimer: () => ipcRenderer.send('tray-start-timer'),
    stopTimer: () => ipcRenderer.send('tray-stop-timer'),
    setTime: (time: number) => ipcRenderer.send('tray-set-time', time),
    onStart: (callback: () => void) => ipcRenderer.on('start', callback),
    onStop: (callback: () => void) => ipcRenderer.on('stop', callback),
  },
  updates: {
    checkForUpdates: () => ipcRenderer.send('check-for-updates'),
    downloadUpdate: () =>
      shell.openExternal(`${repository.url}/releases/latest`),
    onUpdateAvailable: (callback: () => void) =>
      ipcRenderer.on('update-available', callback),
  },
})
