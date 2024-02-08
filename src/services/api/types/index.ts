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
  recordIds: string[]
  hourRate: number
  description: string
  folderId: string
  createdAt: number
  updatedAt?: number
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
}

export interface FolderApi {
  addFolder: (folder: Pick<Folder, 'name'>) => void
  getFolders: () => Folder[]
}

export interface TaskApi {
  addTask: (task: Pick<Task, 'name' | 'folderId'>) => void
  addTaskRecord: (item: Pick<TaskRecord, 'taskId'>) => string
  getTaskRecords: () => TaskRecordWithInfo[]
  getTasks: () => TaskWithRecords[]
  updateTask: (id: string, task: Partial<Omit<Task, 'id'>>) => void
  updateTaskRecord: (id: string, item: Partial<Omit<TaskRecord, 'id'>>) => void
  updateTaskRecordDuration: (id: string, duration: number) => void
}

export type Api = FolderApi & TaskApi
