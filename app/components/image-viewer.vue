<template>
  <UModal fullscreen>
    <img :src="src" :alt="src" class="object-cover cursor-pointer" v-bind="$attrs">

    <template #body>
      <div class="flex items-center justify-center size-full">
        <img :src="src" :alt="src" class="max-w-full max-h-full object-contain">
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string;
}>();
</script>
