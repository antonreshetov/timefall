import { computed, ref, shallowRef, watch } from 'vue'
import { format } from 'date-fns'
import type { TaskRecordWithInfo } from '~/services/api/types'
import { useFolders } from '@/components/folders/composables'
import { useTasks } from '@/components/tasks/composables'

const { api } = window.electron

const { selectedFolder } = useFolders()
const { selectedTask } = useTasks()

const taskRecords = shallowRef<TaskRecordWithInfo[]>([])
const editRecordId = ref<string>()
const contextRecordId = ref<string>()
const isOpenEditMenu = ref(false)

const selectedTaskIds = computed(() => {
  if (selectedTask.value)
    return [selectedTask.value.id]

  if (selectedFolder.value)
    return selectedFolder.value.taskIds
})

const editRecord = computed(() => {
  return taskRecords.value.find(r => r.id === editRecordId.value)
})

const taskRecordSortedByDate = computed(() => {
  return taskRecords.value.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

const taskRecordsGroupedByCreatedDate = computed(() => {
  return taskRecordSortedByDate.value.reduce(
    (acc, item) => {
      const date = format(item.createdAt, 'eeee, LLLL d')

      if (!acc[date])
        acc[date] = []

      acc[date].push(item)

      return acc
    },
    {} as Record<string, TaskRecordWithInfo[]>,
  )
})

function getTaskRecords(taskIds?: string[]) {
  if (!taskIds)
    taskIds = selectedTaskIds.value

  taskRecords.value = api.getTaskRecords(taskIds)
}

function deleteTaskRecord(id: string) {
  api.deleteTaskRecord(id)
  getTaskRecords()
}

export function useRecords() {
  return {
    contextRecordId,
    deleteTaskRecord,
    editRecord,
    editRecordId,
    getTaskRecords,
    isOpenEditMenu,
    taskRecords,
    taskRecordsGroupedByCreatedDate,
  }
}
