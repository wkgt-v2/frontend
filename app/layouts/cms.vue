<template>
  <UApp>
    <div class="flex" @mousemove="updateRadialPosition">
      <div
        ref="radialRef"
        class="eclipse fixed size-[960px] pointer-events-none -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform"
        :class="{ hidden: !radialEnabled }"
      ></div>
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
const frame = ref<number>();
const headerRef = ref<ComponentPublicInstance>();
const radialRef = ref<HTMLDivElement>();
const route = useRoute();
const sidebarRef = ref<ComponentPublicInstance>();

const contentHeight = computed(() => {
  const headerHeight = headerRef.value?.$el instanceof HTMLElement
    ? headerRef.value.$el.offsetHeight
    : 72;
  return `calc(100dvh - ${headerHeight}px)`;
});
const radialEnabled = computed(() => {
  const routes = ["cms-dashboard"];
  /* remove suffix `___locale` */
  const pathName = (route.name as string).replace(/___\w+$/, "");
  return routes.includes(pathName);
});
const sidebarWidth = computed(() => {
  const sidebarWidth = sidebarRef.value?.$el instanceof HTMLElement
    ? sidebarRef.value.$el.offsetWidth
    : 320;
  return `calc(100% - ${sidebarWidth}px)`;
});

function updateRadialPosition(e: MouseEvent) {
  if (!radialEnabled.value) return;
  if (frame.value) cancelAnimationFrame(frame.value);
  frame.value = requestAnimationFrame(() => {
    const el = radialRef.value;
    if (el) {
      el.style.setProperty("--x", `${e.clientX}px`);
      el.style.setProperty("--y", `${e.clientY}px`);
    }
  });
}
</script>

<style scoped>
.eclipse {
  --y: 0px;
  --x: 0px;
  top: var(--y);
  left: var(--x);
  background: radial-gradient(
    50% 50% at 50% 50%,
    #00b8db1a 0%,
    rgba(0, 184, 219, 0) 100%
  );
}
</style>
