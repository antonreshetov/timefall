import { computed, ref, shallowRef, watch } from 'vue'
import type { TaskWithRecords } from '~/services/api/types'
import { timeFormat } from '@/utils'
import { useFolders } from '@/components/folders/composables'

const { api, store, tray } = window.electron

const { selectedFolderId } = useFolders()

let timer: NodeJS.Timeout

const tasks = shallowRef<TaskWithRecords[]>([])

const sec = ref(0)
const currentTaskId = ref<string>()
const currentTaskItemId = ref<string>()
const editTaskId = ref<string>()
const lastTaskId = ref<string>(store.app.get('lastTaskId'))
const contextTaskId = ref<string>()
const selectedTaskId = ref<string>()
const isStarted = ref(false)
const isOpenEditMenu = ref(false)

const currentTask = computed(() => {
  return tasks.value.find(t => t.id === currentTaskId.value)
})

const lastTask = computed(() => {
  return tasks.value.find(t => t.id === lastTaskId.value)
})

const editTask = computed(() => {
  return tasks.value.find(t => t.id === editTaskId.value)
})

const selectedTask = computed(() => {
  return tasks.value.find(t => t.id === selectedTaskId.value)
})

const filteredTasks = computed(() => {
  if (!selectedFolderId.value)
    return tasks.value
  return tasks.value.filter(t => t.folderId === selectedFolderId.value)
})

const timeFormatted = computed(() => {
  return timeFormat(sec.value)
})

function start(id: string) {
  if (currentTaskItemId.value)
    stop()

  timer = setInterval(() => {
    sec.value++
  }, 1000)

  currentTaskId.value = id
  currentTaskItemId.value = api.addTaskRecord({ taskId: id })
  lastTaskId.value = id

  isStarted.value = true
}

function stop() {
  clearInterval(timer)

  api.updateTaskRecordDuration(currentTaskItemId.value, sec.value)
  getTasks()

  sec.value = 0
  isStarted.value = false
  currentTaskItemId.value = undefined
  currentTaskId.value = undefined
}

function startStop(id: string) {
  if (!id)
    return

  if (!isStarted.value) {
    start(id)
    tray.startTimer()
  }
  else {
    stop()
    tray.stopTimer()
  }
}

function getTasks() {
  tasks.value = api.getTasks()
}

function addTask(folderId: string = '') {
  api.addTask({ name: 'Untitled Task', folderId })
  getTasks()
}

function addTaskFolder() {
  api.addFolder({ name: 'Untitled Folder' })
  getTasks()
}

function deleteTask(id: string) {
  api.deleteTask(id)
  getTasks()
}

watch(lastTaskId, (id) => {
  store.app.set('lastTaskId', id)
})

export function useTasks() {
  return {
    addTask,
    addTaskFolder,
    contextTaskId,
    currentTask,
    currentTaskId,
    currentTaskItemId,
    deleteTask,
    editTask,
    editTaskId,
    filteredTasks,
    getTasks,
    isOpenEditMenu,
    isStarted,
    lastTask,
    sec,
    selectedTask,
    selectedTaskId,
    start,
    startStop,
    stop,
    tasks,
    timeFormatted,
  }
}
