<script setup lang="ts">
import { Clock5, DollarSign } from 'lucide-vue-next'
import { DatePicker } from 'v-calendar'
import { useDark } from '@vueuse/core'
import { useReports } from '@/components/reports/composables'
import 'v-calendar/style.css'
import * as Popover from '@/components/ui/shadcn/popover'

const {
  setMonthRange,
  setWeekRange,
  setYearRange,
  selectedRangeType,
  selectedTotalType,
  range,
} = useReports()

setWeekRange()
selectedTotalType.value = 'duration'

const isDark = useDark()
</script>

<template>
  <div class="flex items-center justify-between w-full gap-2 pl-4 pr-2 text-sm">
    <div class="flex gap-1">
      <UiButton
        :variant="selectedRangeType === 'week' ? 'default' : 'ghost'"
        @click="setWeekRange(new Date())"
      >
        Week
      </UiButton>
      <UiButton
        :variant="selectedRangeType === 'month' ? 'default' : 'ghost'"
        @click="setMonthRange"
      >
        Month
      </UiButton>
      <UiButton
        :variant="selectedRangeType === 'year' ? 'default' : 'ghost'"
        @click="setYearRange(2024)"
      >
        Year
      </UiButton>
      <Popover.Root>
        <Popover.Trigger :as-child="true">
          <UiButton
            :variant="selectedRangeType === 'custom' ? 'default' : 'ghost'"
            @click="selectedRangeType = 'custom'"
          >
            Custom
          </UiButton>
        </Popover.Trigger>
        <Popover.Content
          side="bottom"
          align="start"
          class="w-auto"
          :avoid-collisions="true"
        >
          <DatePicker
            v-model.range="range"
            locale="en"
            :first-day-of-week="2"
            class="calendar"
            color="gray"
            :columns="2"
            :is-dark="isDark"
            transparent
            borderless
          />
        </Popover.Content>
      </Popover.Root>
    </div>
    <div class="flex gap-1">
      <UiButton
        :variant="selectedTotalType === 'rate' ? 'default' : 'ghost'"
        @click="selectedTotalType = 'rate'"
      >
        <DollarSign class="w-4 h-4" />
      </UiButton>
      <UiButton
        :variant="selectedTotalType === 'duration' ? 'default' : 'ghost'"
        @click="selectedTotalType = 'duration'"
      >
        <Clock5 class="w-4 h-4" />
      </UiButton>
    </div>
  </div>
</template>

<style lang="scss">
.calendar {
  --vc-gray-50: #f9fafb;
  --vc-gray-100: #f3f4f6;
  --vc-gray-200: #e5e7eb;
  --vc-gray-300: #d1d5db;
  --vc-gray-400: #9ca3af;
  --vc-gray-500: #6b7280;
  --vc-gray-600: #4b5563;
  --vc-gray-700: #374151;
  --vc-gray-800: #111827;
  --vc-gray-900: #030712;

  .vc-header {
    @apply text-sm;
  }

  .vc-focus {
    @apply outline-none shadow-none;
  }

  .vc-highlight-content {
    &-solid {
      @apply bg-neutral-400 dark:bg-neutral-500;
    }

    &-outline {
      @apply border-neutral-400 dark:border-neutral-400;

      &:hover {
        @apply border-neutral-400 dark:border-neutral-400;
      }
    }

    &-light {
      @apply bg-neutral-100 dark:bg-neutral-700;
    }
  }

  .vc-highlight-bg {
    &-solid {
      @apply bg-neutral-400 dark:bg-neutral-500;
    }

    &-outline {
      @apply border-neutral-400 dark:border-neutral-400;
    }

    &-light {
      @apply bg-neutral-100 dark:bg-neutral-700;
    }
  }
}

.vc-popover-content {
  @apply bg-neutral-50 dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600;

  .vc-nav-items {
    @apply outline-none;
  }

  button {
    &:focus-within {
      @apply outline-none shadow-none;
    }

    &:hover {
      @apply bg-neutral-200 dark:bg-neutral-800;
    }

    &.is-active {
      @apply bg-neutral-300 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100;
    }
  }
}
</style>
