<script setup lang="ts">
import { useDark } from '@vueuse/core'

useDark()
</script>

<template>
  <div
    class="h-screen grid grid-cols-[var(--sidebar-width)_var(--tasks-width)_1fr]"
  >
    <Sidebar />
    <Tasks />
    <RouterView />
  </div>
</template>
