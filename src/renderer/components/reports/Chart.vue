<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import ApexCharts from 'apexcharts'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, Dot } from 'lucide-vue-next'
import { differenceInDays, format } from 'date-fns'
import { useReports } from '@/components/reports/composables'
import { timeFormat } from '@/utils'

const {
  currentYearByRange,
  range,
  selectedRangeType,
  setMonthRange,
  setMonthRangeOffset,
  setWeekRange,
  setWeekRangeOffset,
  setYearRange,
  showRangeText,
  xAxisLabels,
  yAxis,
} = useReports()

const chartRef = ref<HTMLElement>()

const diffInDays = computed(() =>
  Math.abs(differenceInDays(range.value.start, range.value.end)),
)

let chart: ApexCharts

function labelXFormatter(value: string) {
  if (selectedRangeType.value === 'week')
    return format(new Date(value), 'EEE')

  if (selectedRangeType.value === 'month')
    return format(new Date(value), 'dd')

  if (selectedRangeType.value === 'year')
    return format(new Date(value), 'MMM')

  if (selectedRangeType.value === 'custom')
    return format(new Date(value), 'MMM dd')
}

const options = {
  chart: {
    height: '100%',
    type: 'bar',
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    animations: {
      enabled: false,
    },
    background: 'transparent',
  },
  legend: {
    show: false,
  },
  series: yAxis.value as [],
  dataLabels: {
    formatter: (val: number) => {
      return timeFormat(val, false)
    },
  },
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
  },
  fill: {
    opacity: 1,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      dataLabels: {
        total: {
          enabled: true,
          formatter: (val: any) => {
            return val ? timeFormat(val, false) : ''
          },
        },
      },
    },
  },
  tooltip: {
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      const name = w.globals.seriesNames[seriesIndex] as string[]
      const taskName = name[0]
      const folderName = name[1] || ''
      const color = w.globals.colors[seriesIndex]
      const duration = timeFormat(series[seriesIndex][dataPointIndex], false)

      return `
        <div class="bg-white dark:bg-neutral-700 rounded min-w-24 border-none">
          <div class="py-1 px-2 text-md font-semibold bg-neutral-100 dark:bg-neutral-800">
            ${taskName}
          </div>
          <div class="py-1 px-2 flex items-center gap-2">
            <div class="h-2.5 w-2.5 rounded-full relative -top-[1px]" style="background-color: ${color}"></div>
            <div class="text-xs">
              <div>
                ${folderName}
              </div>
              <div class="font-semibold">
                ${duration}
              </div>
            </div>
          </div>
        </div>
      `
    },
  },
  xaxis: {
    type: 'category',
    categories: xAxisLabels.value,
    labels: {
      formatter: labelXFormatter,
    },
  },
  yaxis: {
    labels: {
      formatter: (val: number) => {
        return timeFormat(val, false)
      },
    },
  },
}

function createChart() {
  chart = new ApexCharts(chartRef.value, options)
  chart.render()
}

function updateChart() {
  let type: ApexOptions['xaxis']['type'] = 'category'
  let fontSize = '12px'

  if (selectedRangeType.value === 'custom' && diffInDays.value > 6)
    type = 'datetime'

  if (selectedRangeType.value === 'custom' && diffInDays.value > 14)
    fontSize = '9px'

  if (selectedRangeType.value === 'month')
    fontSize = '9px'

  const options: ApexOptions = {
    dataLabels: {
      enabled: selectedRangeType.value === 'week' || diffInDays.value <= 6,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          total: {
            enabled:
              selectedRangeType.value === 'year' || diffInDays.value < 30,
            style: {
              fontSize,
            },
          },
        },
      },
    },
    xaxis: {
      type,
      categories: xAxisLabels.value,
      labels: {
        formatter: labelXFormatter,
      },
    },
  }

  chart.updateOptions(options)
  chart.updateSeries(yAxis.value as [])
}

function onPrev() {
  if (selectedRangeType.value === 'week')
    setWeekRangeOffset(-7)

  if (selectedRangeType.value === 'month')
    setMonthRangeOffset(-1)

  if (selectedRangeType.value === 'year')
    setYearRange(currentYearByRange.value - 1)
}

function onNext() {
  if (selectedRangeType.value === 'week')
    setWeekRangeOffset(7)

  if (selectedRangeType.value === 'month')
    setMonthRangeOffset(1)

  if (selectedRangeType.value === 'year')
    setYearRange(currentYearByRange.value + 1)
}

function onReset() {
  if (selectedRangeType.value === 'week')
    setWeekRange()

  if (selectedRangeType.value === 'month')
    setMonthRange()

  if (selectedRangeType.value === 'year')
    setYearRange(new Date().getFullYear())
}

onMounted(() => {
  createChart()
})

onBeforeUnmount(() => {
  chart.destroy()
})

watch(range, updateChart, { deep: true })
</script>

<template>
  <div data-reports-chart>
    <div
      data-date-actions
      class="h-[30px] flex items-center gap-2 px-4"
    >
      <div v-if="selectedRangeType !== 'custom'">
        <UiButton
          variant="ghost"
          @click="onPrev"
        >
          <ChevronLeft class="w-4 h-4" />
        </UiButton>
        <UiButton
          variant="ghost"
          @click="onReset"
        >
          <Dot class="w-4 h-4" />
        </UiButton>
        <UiButton
          variant="ghost"
          @click="onNext"
        >
          <ChevronRight class="w-4 h-4" />
        </UiButton>
      </div>
      <div class="text-lg font-bold">
        {{ showRangeText }}
      </div>
    </div>
    <div
      ref="chartRef"
      class="h-[calc(100vh-125px)] pl-1"
    />
  </div>
</template>
