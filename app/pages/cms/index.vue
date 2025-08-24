<template>
  <div></div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();
  const token = useToken();

  if (token.value) {
    navigateTo(localePath("cms-dashboard"));
  } else {
    navigateTo(localePath("cms-login"));
  }
</script>
