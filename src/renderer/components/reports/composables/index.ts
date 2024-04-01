import { computed, ref, shallowRef } from 'vue'
import {
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  getDaysInMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

import type { TaskRecordWithInfo, TaskWithRecords } from '~/services/api/types'

const { api } = window.electron

const tasks = shallowRef<TaskWithRecords[]>([])
const taskRecords = shallowRef<TaskRecordWithInfo[]>([])

type RangeType = 'week' | 'month' | 'year'
type TotalType = 'rate' | 'duration'

const selectedRangeType = ref<RangeType>('week')
const selectedTotalType = ref<TotalType>('duration')

const range = ref({
  start: new Date(),
  end: new Date(),
})

function getTaskRecords() {
  taskRecords.value = api.getTaskRecords()
}

function getTasks() {
  tasks.value = api.getTasks()
}

function setWeekRange(date?: Date) {
  selectedRangeType.value = 'week'
  range.value.start = startOfWeek(date || new Date(), { weekStartsOn: 1 })
  range.value.end = endOfWeek(date || new Date(), { weekStartsOn: 1 })
}

function setWeekRangeOffset(offset = 0) {
  range.value.start = startOfWeek(addDays(range.value.start, offset), {
    weekStartsOn: 1,
  })
  range.value.end = endOfWeek(addDays(range.value.end, offset), {
    weekStartsOn: 1,
  })
}

function setMonthRange() {
  selectedRangeType.value = 'month'
  range.value.start = startOfMonth(new Date())
  range.value.end = endOfMonth(new Date())
}

function setMonthRangeOffset(offset = 0) {
  range.value.start = addMonths(range.value.start, offset)
  range.value.end = addMonths(range.value.end, offset)
}

function setYearRange(year?: number) {
  selectedRangeType.value = 'year'
  range.value.start = new Date(year, 0, 1)
  range.value.end = new Date(year, 11, 31)
}

const currentYearByRange = computed(() => {
  return range.value.start.getFullYear()
})

const showRangeText = computed(() => {
  if (selectedRangeType.value === 'week')
    return `${format(range.value.start, 'd MMMM')} - ${format(range.value.end, 'd MMMM yyyy')}`

  if (selectedRangeType.value === 'month')
    return `${format(range.value.start, 'MMMM yyyy')}`

  if (selectedRangeType.value === 'year')
    return `${format(range.value.start, 'yyyy')}`
})

const taskRecordsFilteredByRange = computed(() => {
  return taskRecords.value.filter((taskRecord) => {
    return (
      taskRecord.createdAt >= startOfDay(range.value.start).getTime()
      && taskRecord.createdAt <= endOfDay(range.value.end).getTime()
    )
  })
})

const tasksFilteredByRange = computed(() => {
  const taskIds = taskRecordsFilteredByRange.value.map(
    taskRecord => taskRecord.taskId,
  )

  const filteredTasks = tasks.value.filter(task => taskIds.includes(task.id))

  return filteredTasks.map((task) => {
    const taskRecords = taskRecordsFilteredByRange.value.filter(
      taskRecord => taskRecord.taskId === task.id,
    )

    return {
      ...task,
      recordsIds: taskRecords.map(taskRecord => taskRecord.id),
      records: taskRecords,
    }
  })
})

const totalDuration = computed(() => {
  return tasksFilteredByRange.value.reduce((acc, task) => {
    const taskRecords = taskRecordsFilteredByRange.value.filter(
      taskRecord => taskRecord.taskId === task.id,
    )

    return (
      acc
      + taskRecords.reduce((acc, taskRecord) => acc + taskRecord.duration, 0)
    )
  }, 0)
})

const totalCost = computed(() => {
  const cost = tasksFilteredByRange.value.reduce((acc, task) => {
    const taskRecords = taskRecordsFilteredByRange.value.filter(
      taskRecord => taskRecord.taskId === task.id,
    )

    return (
      acc + taskRecords.reduce((acc, taskRecord) => acc + taskRecord.cost, 0)
    )
  }, 0)

  return cost.toFixed(2)
})

const xAxis = computed(() => {
  if (selectedRangeType.value === 'week') {
    const days = []

    for (let i = 0; i < 7; i++) days.push(addDays(range.value.start, i))

    return days
  }

  if (selectedRangeType.value === 'month') {
    const days = []

    for (let i = 0; i < getDaysInMonth(range.value.start); i++)
      days.push(addDays(range.value.start, i))

    return days
  }

  if (selectedRangeType.value === 'year') {
    const months = []

    for (let i = 0; i < 12; i++)
      months.push(new Date(range.value.start.getFullYear(), i, 1))

    return months
  }
})

// Серии данных по оси Y, группировка по id задачи и суммирование времени
// [{ name: 'Task A', data: [44, 55, 41, 67, 22, 43] }]
const yAxis = computed(() => {
  const taskRecordsGroupedByTaskId = taskRecordsFilteredByRange.value.reduce(
    (acc, taskRecord) => {
      if (!acc[taskRecord.taskId])
        acc[taskRecord.taskId] = []

      acc[taskRecord.taskId].push(taskRecord)

      return acc
    },
    {} as Record<string, TaskRecordWithInfo[]>,
  )

  const series = []

  for (const taskId in taskRecordsGroupedByTaskId) {
    const tasksRecords = taskRecordsGroupedByTaskId[taskId]

    series.push({
      name: [tasksRecords[0].taskName, tasksRecords[0].folderName],
      color: tasksRecords[0].color,
      data: xAxis.value.map((date) => {
        const taskRecords = tasksRecords.filter((taskRecord) => {
          const startDate
            = selectedRangeType.value === 'year'
              ? startOfMonth(date).getTime()
              : startOfDay(date).getTime()

          const endDate
            = selectedRangeType.value === 'year'
              ? endOfMonth(date).getTime()
              : endOfDay(date).getTime()

          return (
            taskRecord.createdAt >= startDate && taskRecord.createdAt <= endDate
          )
        })

        return taskRecords.length
          ? taskRecords.reduce(
            (acc, taskRecord) => acc + taskRecord.duration,
            0,
          )
          : 0
      }),
    })
  }

  return series
})

const xAxisLabels = computed(() => {
  return xAxis.value.map((date) => {
    if (selectedRangeType.value === 'week')
      return format(date, 'EEEE')

    if (selectedRangeType.value === 'month')
      return format(date, 'd')

    if (selectedRangeType.value === 'year')
      return format(date, 'LLL')

    return ''
  })
})

export function useReports() {
  return {
    currentYearByRange,
    getTaskRecords,
    getTasks,
    range,
    selectedRangeType,
    selectedTotalType,
    setMonthRange,
    setMonthRangeOffset,
    setWeekRange,
    setWeekRangeOffset,
    setYearRange,
    showRangeText,
    taskRecords,
    tasksFilteredByRange,
    totalCost,
    totalDuration,
    xAxis,
    xAxisLabels,
    yAxis,
  }
}
