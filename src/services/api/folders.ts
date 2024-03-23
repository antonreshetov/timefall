import { nanoid } from 'nanoid'
import store from '../store/db'
import type { Folder, FolderApi, Task } from './types'

export const api: FolderApi = {
  addFolder: (folder) => {
    const _folder = store.get('folders') as Folder[]
    const newFolder = JSON.parse(JSON.stringify(folder)) as Folder

    newFolder.createdAt = new Date().getTime()
    newFolder.id = nanoid(8)
    newFolder.parentId = ''
    newFolder.taskIds = []
    newFolder.updatedAt = null
    newFolder.isOpen = false

    _folder.push(newFolder)

    store.set('folders', _folder)
  },

  getFolders: () => {
    const folders = store.get('folders') as Folder[]
    return folders
  },

  updateFolders: (folders) => {
    store.set('folders', folders)
  },

  updateFolder(id, folder) {
    const folders = store.get('folders') as Folder[]
    const index = folders.findIndex(i => i.id === id)

    if (index === -1)
      return

    folders[index] = {
      ...folders[index],
      ...folder,
      updatedAt: new Date().getTime(),
    }

    store.set('folders', folders)
  },

  deleteFolder(id) {
    const folders = store.get('folders') as Folder[]
    const tasks = store.get('tasks') as Task[]
    const index = folders.findIndex(i => i.id === id)

    if (index === -1)
      return

    folders.splice(index, 1)

    tasks.forEach((task) => {
      if (task.folderId === id)
        task.folderId = ''
    })

    store.set('tasks', tasks)
    store.set('folders', folders)
  },
}
