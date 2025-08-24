<template>
  <div></div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();

  navigateTo(localePath("cms-product-category"));
</script>
