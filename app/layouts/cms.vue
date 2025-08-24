<template>
  <UApp>
    <div class="flex">
      <CmsSidebar />
      <div class="w-full">
        <CmsHeader ref="headerRef" />
        <main class="overflow-y-auto" :style="{ maxHeight: contentHeight }">
          <slot />
        </main>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";

const headerRef = ref<ComponentPublicInstance>();

const contentHeight = computed(() => {
  let headerHeight = 72;
  if (headerRef.value) {
    headerHeight = (headerRef.value.$el as HTMLDivElement).clientHeight;
  }
  return `calc(100dvh - ${headerHeight}px)`;
});
</script>
