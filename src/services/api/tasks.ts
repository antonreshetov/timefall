import { nanoid } from 'nanoid'
import store from '../store/db'
import type { Folder, Task, TaskApi, TaskItem, TaskWithItems } from './types'

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
    newTask.itemIds = []
    newTask.updatedAt = null

    tasks.push(newTask)

    store.set('tasks', tasks)
    store.set('folders', folders)
  },

  addTaskItem(item) {
    const id = nanoid(8)

    const items = store.get('tasksItems') as TaskItem[]
    const tasks = store.get('tasks') as Task[]

    const newTaskItem = JSON.parse(JSON.stringify(item)) as TaskItem

    newTaskItem.createdAt = new Date().getTime()
    newTaskItem.description = ''
    newTaskItem.duration = 0
    newTaskItem.hourRate = 0
    newTaskItem.id = id
    newTaskItem.updatedAt = null

    items.push(newTaskItem)

    const task = tasks.find(t => t.id === item.taskId)
    task.itemIds.push(id)

    store.set('tasksItems', items)
    store.set('tasks', tasks)

    return id
  },

  addDurationToTaskItem(id, duration) {
    const items = store.get('tasksItems') as TaskItem[]
    const index = items.findIndex(i => i.id === id)

    items[index].duration += duration
    items[index].updatedAt = new Date().getTime()

    store.set('tasksItems', items)
  },

  getTasks: () => {
    const tasks = store.get('tasks') as TaskWithItems[]
    const tasksItems = store.get('tasksItems') as TaskItem[]

    tasks.forEach((task) => {
      task.items = tasksItems?.filter(item => item.taskId === task.id)
    })

    return tasks
  },

  getTaskItems: () => {
    const tasks = store.get('tasks') as Task[]
    const folders = store.get('folders') as Folder[]
    const items = store.get('tasksItems') as TaskItem[]

    const tasksItems = items.map((item) => {
      const task = tasks.find(t => t.id === item.taskId)
      const folder = folders.find(f => f.id === task.folderId)

      return {
        ...item,
        taskName: task?.name,
        folderName: folder?.name,
      }
    })

    return tasksItems
  },

  updateTaskItem(id, item) {
    const items = store.get('tasksItems') as TaskItem[]
    const index = items.findIndex(i => i.id === id)

    items[index] = {
      ...items[index],
      ...item,
      updatedAt: new Date().getTime(),
    }

    store.set('tasksItems', items)
  },

  updateTask(id, task) {
    const tasks = store.get('tasks') as Task[]
    const index = tasks.findIndex(t => t.id === id)

    if (!index)
      return

    tasks[index] = {
      ...tasks[index],
      ...task,
      updatedAt: new Date().getTime(),
    }

    store.set('tasks', tasks)
  },
}
