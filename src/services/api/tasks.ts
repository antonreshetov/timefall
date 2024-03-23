import { nanoid } from 'nanoid'
import store from '../store/db'
import type {
  Folder,
  Task,
  TaskApi,
  TaskRecord,
  TaskWithRecords,
} from './types'
import { COLORS } from './constants'

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

export const api: TaskApi = {
  addTask(task) {
    const id = nanoid(8)

    const tasks = store.get('tasks') as Task[]
    const folders = store.get('folders') as Folder[]

    const folder = folders.find(f => f.id === task.folderId)

    if (folder)
      folder.taskIds.push(id)

    const newTask = JSON.parse(JSON.stringify(task)) as Task

    newTask.createdAt = new Date().getTime()
    newTask.description = ''
    newTask.folderId = task.folderId
    newTask.hourRate = 0
    newTask.id = id
    newTask.recordIds = []
    newTask.updatedAt = null
    newTask.color = getRandomColor()

    tasks.push(newTask)

    store.set('tasks', tasks)
    store.set('folders', folders)

    return id
  },

  addTaskRecord(item) {
    const id = nanoid(8)

    const items = store.get('taskRecords') as TaskRecord[]
    const tasks = store.get('tasks') as Task[]

    const newTaskItem = JSON.parse(JSON.stringify(item)) as TaskRecord

    newTaskItem.createdAt = new Date().getTime()
    newTaskItem.description = ''
    newTaskItem.duration = 0
    newTaskItem.hourRate = 0
    newTaskItem.id = id
    newTaskItem.updatedAt = null

    items.push(newTaskItem)

    const task = tasks.find(t => t.id === item.taskId)
    task.recordIds.push(id)

    store.set('taskRecords', items)
    store.set('tasks', tasks)

    return id
  },

  updateTaskRecordDuration(id, duration) {
    const items = store.get('taskRecords') as TaskRecord[]
    const index = items.findIndex(i => i.id === id)

    items[index].duration += duration
    items[index].updatedAt = new Date().getTime()

    store.set('taskRecords', items)
  },

  getTasks: () => {
    const tasks = store.get('tasks') as TaskWithRecords[]
    const taskRecords = store.get('taskRecords') as TaskRecord[]

    tasks.forEach((task) => {
      task.records = taskRecords?.filter(item => item.taskId === task.id)
    })

    return tasks
  },

  getTaskRecords: () => {
    const tasks = store.get('tasks') as Task[]
    const folders = store.get('folders') as Folder[]
    const items = store.get('taskRecords') as TaskRecord[]

    const taskRecords = items.map((item) => {
      const task = tasks.find(t => t.id === item.taskId)
      const folder = folders.find(f => f.id === task.folderId)

      return {
        ...item,
        taskName: task?.name,
        folderName: folder?.name,
        color: task?.color,
      }
    })

    return taskRecords
  },

  updateTaskRecord(id, item) {
    const items = store.get('taskRecords') as TaskRecord[]
    const index = items.findIndex(i => i.id === id)

    items[index] = {
      ...items[index],
      ...item,
      updatedAt: new Date().getTime(),
    }

    store.set('taskRecords', items)
  },

  updateTask(id, task) {
    const tasks = store.get('tasks') as Task[]
    const index = tasks.findIndex(t => t.id === id)

    if (index === -1)
      return

    tasks[index] = {
      ...tasks[index],
      ...task,
      updatedAt: new Date().getTime(),
    }

    store.set('tasks', tasks)
  },

  deleteTask(id) {
    const tasks = store.get('tasks') as Task[]
    const taskIndex = tasks.findIndex(t => t.id === id)
    const taskRecords = store.get('taskRecords') as TaskRecord[]

    if (taskIndex === -1)
      return

    const records = taskRecords.filter(item => item.taskId !== id)

    tasks.splice(taskIndex, 1)
    store.set('tasks', tasks)
    store.set('taskRecords', records)
  },

  deleteTaskRecord(id) {
    const items = store.get('taskRecords') as TaskRecord[]
    const index = items.findIndex(i => i.id === id)

    if (index === -1)
      return

    items.splice(index, 1)
    store.set('taskRecords', items)
  },
}
