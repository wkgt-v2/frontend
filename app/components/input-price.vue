<template>
  <UInput v-model="maskedValue" @input="handleInput" v-bind="$attrs">
    <template #leading>
      <span>Rp</span>
    </template>
  </UInput>
  <input type="hidden" v-model="model">
</template>

<script setup lang="ts">
const maskedValue = ref("");
const model = defineModel({ type: Number });

watch(maskedValue, (val) => {
  model.value = +val.replaceAll(".", "");
});

function formatNumber(string: string) {
  return string.replace(/[^\d]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function handleInput(e: InputEvent) {
  const input = e.target as HTMLInputElement;
  input.value = formatNumber(input.value);
}

onMounted(() => {
  maskedValue.value = formatNumber(`${model.value}`);
});
</script>
