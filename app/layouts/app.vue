<template>
  <UApp>
    <slot />
  </UApp>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Wahana Komputer` : "Wahana Komputer";
  },
});
</script>
