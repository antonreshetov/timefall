import type ElectronStore from 'electron-store'

export interface AppStore {
  bounds?: Record<string, unknown>
  sizes: {
    sidebar: number
    tasks: number
  }
  lastTaskId?: string
  selectedFolderId?: string
}

export interface Store {
  app: ElectronStore<AppStore>
}
