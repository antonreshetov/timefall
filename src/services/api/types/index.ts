export interface Folder {
  id: string
  name: string
  parentId: string
  taskIds: string[]
  createdAt: number
  updatedAt?: number
}

export interface FolderWithTasks extends Folder {
  tasks: Task[]
}

export interface Task {
  id: string
  name: string
  itemIds: string[]
  hourRate: number
  description: string
  folderId: string
  createdAt: number
  updatedAt?: number
}

export interface TaskWithItems extends Task {
  items: TaskItem[]
}

export interface TaskItem {
  id: string
  duration: number
  hourRate: number
  description: string
  taskId: string
  createdAt: number
  updatedAt?: number
}

export interface TaskItemWithInfo extends TaskItem {
  taskName?: string
  folderName?: string
}

export interface FolderApi {
  addFolder: (folder: Pick<Folder, 'name'>) => void
  getFolders: () => Folder[]
}

export interface TaskApi {
  addDurationToTaskItem: (id: string, duration: number) => void
  addTask: (task: Pick<Task, 'name' | 'folderId'>) => void
  addTaskItem: (item: Pick<TaskItem, 'taskId'>) => string
  getTaskItems: () => TaskItemWithInfo[]
  getTasks: () => TaskWithItems[]
  updateTaskItem: (id: string, item: Partial<Omit<TaskItem, 'id'>>) => void
}

export type Api = FolderApi & TaskApi
