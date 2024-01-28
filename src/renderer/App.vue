<script setup lang="ts">
import { useDark } from '@vueuse/core'

useDark()
</script>

<template>
  <div class="h-screen">
    <RouterView />
  </div>
</template>
