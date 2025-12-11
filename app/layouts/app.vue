<template>
  <UApp>
    <slot />
  </UApp>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | PT. Wahana Karya Guna Teknologi` : "PT. Wahana Karya Guna Teknologi";
  },
});
</script>
