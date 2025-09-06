<template>
  <div class="relative container space-y-16 py-16 text-center">
    <Radial class="absolute top-12 -right-1/3 size-[764px] -z-10" />
    <h1 class="text-5xl text-primary font-semibold">
      Produk Kami
    </h1>
    <div class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-y-16 gap-x-8">
      <NuxtLink
        v-for="category in categories"
        :key="category.category_id"
        :to="$localeRoute(`/products/${category.category_id}`)"
        class="space-y-2 text-center"
      >
        <img :src="category.category_image" :alt="category.category_name" class="size-40 mx-auto object-cover" loading="lazy">
        <h5 class="text-base text-primary font-medium">
          {{ category.category_name }}
        </h5>
      </NuxtLink>
    </div>

    <UButton
      size="lg"
      trailing-icon="i-material-symbols-arrow-right-alt-rounded"
      :to="$localePath('products')"
    >
      Lihat Katalog
    </UButton>
  </div>
</template>

<script setup lang="ts">
import type { Category } from "~/types/product";

const categories = useCategories();
</script>
