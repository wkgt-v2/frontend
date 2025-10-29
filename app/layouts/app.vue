<template>
  <UApp>
    <slot />
  </UApp>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | WAHANA KARYA GUNA TEKNOLOGI` : "WAHANA KARYA GUNA TEKNOLOGI";
  },
});
</script>
