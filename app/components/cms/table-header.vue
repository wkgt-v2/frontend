<template>
  <div class="flex items-center gap-1.5 cursor-pointer" @click="toggleSort">
    <UIcon :name="iconType" class="size-5" />
    <span class="text-sm text-highlighted font-semibold whitespace-nowrap">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: string;
}>();

const modelBy = defineModel("by", { type: String });
const modelOrder = defineModel("order", { type: String });

const iconType = computed(() => {
  if (modelBy.value === props.value) {
    return modelOrder.value === "ASC" ? "i-lucide-arrow-up-narrow-wide" : "i-lucide-arrow-down-wide-narrow";
  }
  return "i-lucide-arrow-up-down";
});

function toggleSort() {
  let order = "ASC";
  if (modelBy.value === props.value) order = modelOrder.value === "ASC" ? "DESC" : "ASC";
  modelBy.value = props.value;
  modelOrder.value = order;
}
</script>
