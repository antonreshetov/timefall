import { computed, ref, shallowRef, watch } from 'vue'
import type { TaskWithRecords } from '~/services/api/types'
import { timeFormat } from '@/utils'
import { useFolders } from '@/components/folders/composables'

const { api, store, timer } = window.electron

const { selectedFolderId } = useFolders()

const INTERVAL_TO_UPDATE = 300 // 5 минут

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

  currentTaskId.value = id
  currentTaskItemId.value = api.addTaskRecord({ taskId: id })
  lastTaskId.value = id

  isStarted.value = true
}

function stop() {
  api.updateTaskRecordDuration(currentTaskItemId.value, sec.value)
  // eslint-disable-next-line no-console
  console.log('[Stop]', currentTask.value.name, sec.value)

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
    timer.startTimer()
  }
  else {
    stop()
    timer.stopTimer()
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

timer.onUpdate((i) => {
  sec.value = i

  if (i % INTERVAL_TO_UPDATE === 0) {
    api.updateTaskRecordDuration(currentTaskItemId.value, sec.value)
    // eslint-disable-next-line no-console
    console.log('[Update]', currentTask.value.name, sec.value)
  }
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
