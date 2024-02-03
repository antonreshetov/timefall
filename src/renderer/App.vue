<script setup lang="ts">
import { useDark } from '@vueuse/core'

useDark()
</script>

<template>
  <div
    class="h-screen grid grid-cols-[var(--sidebar-width)_var(--tasks-width)_1fr]"
  >
    <div
      data-titlebar
      class="fixed top-0 w-full h-[20px] -select-none z-50"
    />
    <Sidebar />
    <RouterView />
  </div>
</template>

<style>
[data-titlebar] {
  -webkit-app-region: drag;
}
</style>
