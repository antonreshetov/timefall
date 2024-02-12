<script setup lang="ts">
import SolarStopwatchPlayBold from '~icons/solar/stopwatch-play-bold'
import SolarAlignBottomBold from '~icons/solar/align-bottom-bold'
</script>

<template>
  <div data-menu>
    <SidebarMenuItem
      to="/"
      :icon="SolarStopwatchPlayBold"
    >
      Tracking
    </SidebarMenuItem>
    <SidebarMenuItem
      to="/reports"
      :icon="SolarAlignBottomBold"
    >
      Reports
    </SidebarMenuItem>
  </div>
</template>
