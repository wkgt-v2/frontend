<template>
  <UIcon
    name="i-material-symbols:light-mode-outline"
    class="hidden size-6 text-tone cursor-pointer dark:flex"
    mode="svg"
    @click="isDark = false"
  />
  <UIcon
    name="i-material-symbols:dark-mode-outline"
    class="flex size-6 text-tone cursor-pointer dark:hidden"
    mode="svg"
    @click="isDark = true"
  />
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  }
});
</script>
