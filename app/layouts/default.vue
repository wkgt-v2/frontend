<template>
  <UApp>
    <AppHeader />
    <div class="min-h-[calc(100dvh-200px)] pt-16 lg:pt-20">
      <slot />
    </div>
    <AppFooter />
  </UApp>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | WAHANA KARYA GUNA TEKNOLOGI` : "WAHANA KARYA GUNA TEKNOLOGI";
  },
});
</script>
