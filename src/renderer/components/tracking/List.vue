<script setup lang="ts"></script>

<template>
  <div
    data-tracking-list
    class="overflow-auto"
  >
    <UiTopbar>
      <div class="flex justify-between w-full px-4 text-sm">
        <div class="">
          Timeline Entries
        </div>
        <div>actions</div>
      </div>
    </UiTopbar>
    <div>
      <TrackingGroup date="03.01.2024">
        <TrackingItem />
        <TrackingItem />
        <TrackingItem />
      </TrackingGroup>
      <TrackingGroup date="02.01.2024">
        <TrackingItem />
        <TrackingItem />
        <TrackingItem />
      </TrackingGroup>
      <TrackingGroup date="01.01.2024">
        <TrackingItem />
        <TrackingItem />
      </TrackingGroup>
    </div>
  </div>
</template>
