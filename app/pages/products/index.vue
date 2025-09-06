<template>
  <div class="container space-y-16 py-16">
    <h1 class="text-5xl text-primary text-center font-semibold">
      Produk Kami
    </h1>
    <div class="grid grid-cols-6 gap-6">
      <NuxtLink
        v-for="category in categories"
        :key="category.category_id"
        :to="$localeRoute(`/products/${category.category_id}`)"
        class="w-full glass border border-accent rounded-xl"
      >
        <img
          :src="category.category_image"
          :alt="category.category_name"
          class="w-full object-cover aspect-square rounded-t-xl" loading="lazy"
        />
        <div class="space-y-1 p-6">
          <h5 class="text-base text-tone font-medium">
            {{ category.category_name }}
          </h5>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from "~/types/product";

const categories = useCategories();
</script>
