<script setup lang="ts">
import { BarChartBig, PlaySquare } from 'lucide-vue-next'
</script>

<template>
  <div data-menu>
    <SidebarMenuItem
      to="/"
      :icon="PlaySquare"
    >
      Tracking
    </SidebarMenuItem>
    <SidebarMenuItem
      to="/reports"
      :icon="BarChartBig"
    >
      Reports
    </SidebarMenuItem>
  </div>
</template>
