<template>
  <div class="container">
    <UCarousel
      v-slot="{ item }"
      loop
      dots
      :autoplay="{ delay: 5000 }"
      :items="items"
      :ui="{ dots: 'bottom-4' }"
    >
      <img :src="item" class="aspect-[16/5] w-full object-cover rounded-lg md:rounded-2xl">
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
const items = [
  "https://picsum.photos/600?random=1",
  "https://picsum.photos/600?random=2",
  "https://picsum.photos/600?random=3",
  "https://picsum.photos/600?random=4",
  "https://picsum.photos/600?random=5",
]
</script>
