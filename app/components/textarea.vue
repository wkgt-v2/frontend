<template>
  <UTextarea ref="input" @input="textareaAutoresize(textarea)" :ui="{ base: 'resize-none' }" />
</template>

<script setup lang="ts">
const input = ref<ComponentPublicInstance>();
const textarea = computed(() => {
  return input.value!.$el.querySelector("textarea");
});

onMounted(() => {
  textareaAutoresize(textarea.value);
});
</script>
