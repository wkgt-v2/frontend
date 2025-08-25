<template>
  <div class="space-y-6 p-6">
    <div class="grid grid-cols-3 gap-6">
      <NuxtLink :to="$localePath('cms-product-category')" class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="material-symbols:category-outline" mode="svg" class="size-6" />
          <h4 class="text-lg">Total Categories</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          11
        </h1>
      </NuxtLink>
      <NuxtLink :to="$localePath('cms-product-series')" class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="material-symbols:layers-outline" mode="svg" class="size-6" />
          <h4 class="text-lg">Total Series</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          32
        </h1>
      </NuxtLink>
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="material-symbols:package-2-outline" mode="svg" class="size-6" />
          <h4 class="text-lg">Total Products</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          174
        </h1>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="material-symbols:article-outline" mode="svg" class="size-6" />
          <h4 class="text-lg">Article Published</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          14
        </h1>
      </NuxtLink>
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="material-symbols:build-outline" mode="svg" class="size-6" />
          <h4 class="text-lg">Total Service</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          6
        </h1>
      </NuxtLink>
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="material-symbols:autorenew" mode="svg" class="size-6" />
          <h4 class="text-lg">Ongoing Service</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          1
        </h1>
      </NuxtLink>
    </div>

    <div class="space-y-2">
      <h5 class="text-lg text-tone">Latest Products</h5>
      <UTable :data="products" />
    </div>
  </div>
</template>

<script setup lang="ts">
const products = [
  {
    name: "Intel® Core™ i7-9700K",
    code: "intel-core-i7-9700k",
    series: "Processor Intel",
    category: "Processor",
  },
  {
    name: "Intel® Core™ i7-9700F",
    code: "intel-core-i7-9700f",
    series: "Processor Intel",
    category: "Processor",
  },
  {
    name: "AMD Ryzen 9 3900X",
    code: "amd-ryzen-9-3900x",
    series: "Processor AMD",
    category: "Processor",
  },
  {
    name: "AMD Ryzen 7 3700X",
    code: "amd-ryzen-7-3700x",
    series: "Processor AMD",
    category: "Processor",
  },
  {
    name: "Corsair MP600 PRO 2TB M.2 NVMe PCIe Gen. 4 x4",
    code: "corsair-mp600-pro-2tb",
    series: "SSD M.2",
    category: "Storage",
  },
];
</script>
