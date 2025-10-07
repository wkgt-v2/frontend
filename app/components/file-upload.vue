<template>
  <div v-if="typeof model === 'string'" class="relative">
    <img :src="model" class="w-full h-48 rounded-lg object-cover" />
    <UButton
      class="absolute -end-1.5 -top-1.5 size-5 bg-inverted hover:bg-inverted/90 p-0 rounded-full border-2"
      trailing-icon="i-lucide:x"
      :ui="{ trailingIcon: 'size-4' }"
      @click="model = undefined"
    />
  </div>
  <UFileUpload
    v-else
    accept=".jpg,.jpeg,.png"
    class="w-full h-48"
    description="JPG, JPEG, PNG"
    v-model="model"
  />
</template>

<script setup lang="ts">
const model = defineModel<string | File>();
</script>
