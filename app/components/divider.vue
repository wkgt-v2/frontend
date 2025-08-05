<template>
  <div class="flex items-center gap-1 w-full">
    <div class="md:shrink-0 w-full md:w-5 h-px bg-slate-500"></div>
    <span class="text-lg font-medium whitespace-nowrap">{{ label }}</span>
    <div class="w-full h-px bg-slate-500"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>
