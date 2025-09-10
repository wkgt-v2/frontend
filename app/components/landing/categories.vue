<template>
  <div class="relative container space-y-16 py-16 text-center">
    <Radial class="absolute top-12 -right-1/3 size-[764px] -z-10" />
    <h1 class="text-5xl text-primary font-semibold">
      Produk Kami
    </h1>
    <div class="flex flex-wrap justify-center">
      <NuxtLink
        v-for="category in categories"
        :key="category.category_id"
        :to="$localeRoute(`/products/${category.category_name}-${category.category_id}`)"
        class="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6 p-1 md:p-2 lg:p-3"
      >
        <div class="space-y-2 text-center">
          <img :src="category.category_image" :alt="category.category_name" class="size-40 mx-auto object-cover" loading="lazy">
          <h5 class="text-base text-primary font-medium">
            {{ category.category_name }}
          </h5>
        </div>
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
const categories = useCategories();
</script>
