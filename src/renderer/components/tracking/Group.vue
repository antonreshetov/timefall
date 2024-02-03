<script setup lang="ts">
interface Props {
  date: string
}

defineProps<Props>()
</script>

<template>
  <div data-tracking-group>
    <div
      class="sticky top-[50px] bg-white dark:bg-neutral-900 py-2 text-2xl border-b border-neutral-200 dark:border-neutral-700"
    >
      <div class="grid grid-cols-[250px_1fr_1fr] px-4 text-lg">
        <div class="font-bold">
          {{ date }}
        </div>
        <div class="text-neutral-400 dark:text-neutral-500">
          $0.00
        </div>
        <div class="text-neutral-400 dark:text-neutral-500 text-right">
          0:27
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>
