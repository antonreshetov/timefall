import { nanoid } from 'nanoid'
import store from '../store/db'
import type { Folder, FolderApi, FolderWithTasks, Task } from './types'

export const api: FolderApi = {
  addFolder: (folder) => {
    const _folder = store.get('folders') as Folder[]
    const newFolder = JSON.parse(JSON.stringify(folder)) as Folder

    newFolder.createdAt = new Date().getTime()
    newFolder.id = nanoid(8)
    newFolder.parentId = ''
    newFolder.taskIds = []
    newFolder.updatedAt = null

    _folder.push(newFolder)

    store.set('folders', _folder)
  },

  getFolders: () => {
    const folders = store.get('folders') as FolderWithTasks[]
    const tasks = store.get('tasks') as Task[]

    folders.forEach((folder) => {
      folder.tasks = tasks.filter(task => task.folderId === folder.id)
    })

    return folders
  },
}
