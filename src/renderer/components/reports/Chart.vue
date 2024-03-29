<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import ApexCharts from 'apexcharts'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, Dot } from 'lucide-vue-next'
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

let chart: ApexCharts

const options: ApexOptions = {
  chart: {
    height: '100%',
    type: 'bar',
    stacked: true,
    toolbar: {
      show: false,
    },
    animations: {
      enabled: false,
    },
    background: 'transparent',
  },
  legend: {
    show: false,
  },
  series: yAxis.value,
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
      borderRadius: 4,
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
  xaxis: {
    categories: xAxisLabels.value,
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

watch(
  range,
  () => {
    chart.updateOptions({
      xaxis: {
        categories: xAxisLabels.value,
      },
    })
    chart.updateSeries(yAxis.value)
  },
  { deep: true },
)

watch(selectedRangeType, (v) => {
  const options: ApexOptions = {
    dataLabels: {
      enabled: v === 'week',
    },
  }

  chart.updateOptions(options)
})

onMounted(() => {
  createChart()
})

onBeforeUnmount(() => {
  chart.destroy()
})

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
</script>

<template>
  <div data-reports-chart>
    <div
      data-date-actions
      class="h-[30px] flex items-center gap-2"
    >
      <div>
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
      class="h-[calc(100vh-125px)]"
    />
  </div>
</template>
