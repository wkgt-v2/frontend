<template>
  <UApp>
    <div class="flex">
      <CmsSidebar ref="sidebarRef" />
      <div :style="{ width: sidebarWidth }">
        <CmsHeader ref="headerRef" />
        <main class="overflow-auto" :style="{ maxHeight: contentHeight }">
          <slot />
        </main>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
const headerRef = ref<ComponentPublicInstance>();
const sidebarRef = ref<ComponentPublicInstance>();

const contentHeight = computed(() => {
  let headerHeight = 72;
  if (headerRef.value) {
    headerHeight = (headerRef.value.$el as HTMLDivElement).offsetHeight;
  }
  return `calc(100dvh - ${headerHeight}px)`;
});
const sidebarWidth = computed(() => {
  let sidebarWidth = 320;
  if (sidebarRef.value) {
    sidebarWidth = (sidebarRef.value.$el as HTMLDivElement).offsetWidth;
  }
  return `calc(100% - ${sidebarWidth}px)`;
});
</script>
