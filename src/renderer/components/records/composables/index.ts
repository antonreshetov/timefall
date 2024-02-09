import { computed, ref, shallowRef, watch } from 'vue'
import { format } from 'date-fns'
import { useTasks } from '@/components/tasks/composables'
import type { TaskRecordWithInfo } from '~/services/api/types'

const { api } = window.electron

const { isStarted } = useTasks()

const taskRecords = shallowRef<TaskRecordWithInfo[]>([])

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

function getTaskRecords() {
  taskRecords.value = api.getTaskRecords()
}

watch(isStarted, () => {
  getTaskRecords()
})

export function useRecords() {
  return {
    getTaskRecords,
    taskRecords,
    taskRecordsGroupedByCreatedDate,
  }
}
