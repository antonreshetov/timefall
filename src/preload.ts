// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, shell } from 'electron'
import { repository } from '../package.json'
import { api } from './services/api'
import { store } from './services/store'
import type { AppStore } from './services/store/types'
import { getTime, isTimerActive } from './timer'

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
    setTime: (time: number) => ipcRenderer.send('tray-set-time', time),
    onStart: (callback: () => void) =>
      ipcRenderer.on('tray-start-timer', callback),
    onStop: (callback: () => void) =>
      ipcRenderer.on('tray-stop-timer', callback),
  },
  timer: {
    getTime: () => getTime(),
    isTimerActive: () => isTimerActive(),
    onStart: (callback: () => void) => ipcRenderer.on('start-timer', callback),
    onStop: (callback: () => void) => ipcRenderer.on('stop-timer', callback),
    onUpdate: (callback: (time: number) => void) =>
      ipcRenderer.on('timer-update', (_, time) => callback(time)),
    startTimer: () => ipcRenderer.send('start-timer'),
    stopTimer: () => ipcRenderer.send('stop-timer'),
  },
  updates: {
    checkForUpdates: () => ipcRenderer.send('check-for-updates'),
    downloadUpdate: () =>
      shell.openExternal(`${repository.url}/releases/latest`),
    onUpdateAvailable: (callback: () => void) =>
      ipcRenderer.on('update-available', callback),
  },
})
