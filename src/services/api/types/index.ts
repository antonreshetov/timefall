export interface Folder {
  id: string
  name: string
  parentId: string
  taskIds: string[]
  createdAt: number
  updatedAt?: number
  color?: string
  isOpen?: boolean
}

export interface FolderWithTasks extends Folder {
  tasks: Task[]
}

export interface Task {
  id: string
  name: string
  recordIds: string[]
  hourRate: number
  description: string
  folderId: string
  createdAt: number
  updatedAt?: number
  color?: string
}

export interface TaskWithRecords extends Task {
  records: TaskRecord[]
}

export interface TaskRecord {
  id: string
  duration: number
  hourRate: number
  description: string
  taskId: string
  createdAt: number
  updatedAt?: number
}

export interface TaskRecordWithInfo extends TaskRecord {
  taskName?: string
  folderName?: string
  color?: string
}

export interface FolderApi {
  addFolder: (folder: Pick<Folder, 'name'>) => void
  getFolders: () => Folder[]
  updateFolder: (id: string, folder: Partial<Omit<Folder, 'id'>>) => void
  updateFolders: (folders: Folder[]) => void
  deleteFolder: (id: string) => void
}

export interface TaskApi {
  addTask: (task: Pick<Task, 'name' | 'folderId'>) => string
  addTaskRecord: (item: Pick<TaskRecord, 'taskId'>) => string
  deleteTask: (id: string) => void
  deleteTaskRecord: (id: string) => void
  getTaskRecords: () => TaskRecordWithInfo[]
  getTasks: () => TaskWithRecords[]
  updateTask: (id: string, task: Partial<Omit<Task, 'id'>>) => void
  updateTaskRecord: (id: string, item: Partial<Omit<TaskRecord, 'id'>>) => void
  updateTaskRecordDuration: (id: string, duration: number) => void
}

export type Api = FolderApi & TaskApi
