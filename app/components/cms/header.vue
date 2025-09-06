<template>
  <header class="flex items-center justify-between h-[72px] glass px-6 border-b border-accent">
    <h4 class="text-xl text-tone font-semibold capitalize opacity-0">
      {{ title }}
    </h4>
    <DarkModeToggler />
  </header>
</template>

<script setup lang="ts">
const route = useRoute();

const title = computed(() => {
  const pathName = route.name as string;
  return pathName.split("-")
    .map(p => p.replace("___id", "").replace("___en", ""))
    .filter(p => !["cms"].includes(p))
    .join(" - ");
});
</script>
