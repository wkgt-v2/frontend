<template>
  <div class="container space-y-4 py-12 md:py-20">
    <Divider label="Telusuri berdasarkan kategori" />
    <div class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 sm:gap-8">
      <UCard v-for="category in categories" :key="category.id" class="shadow-md hover:shadow-lg transition-shadow">
        <div class="space-y-4 text-center">
          <img :src="category.img" :alt="category.label" class="w-28 mx-auto" loading="lazy">
          <h5 class="font-semibold">
            {{ category.label }}
          </h5>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import CATEGORY from "~/mock/category";

const categories = CATEGORY;
</script>
