<template>
  <div class="container space-y-8 py-16">
    <UBreadcrumb :items="breadcrumbItems" />
    <div class="grid grid-cols-5 gap-6">
      <!-- <div>filter</div> -->
      <div class="grid grid-cols-4 col-span-4 gap-6">
        <NuxtLink
          v-for="product in products"
          :key="product.product_id"
          :to="$localeRoute(`/products/${product.category_id}/${product.series_id}/${product.product_id}`)"
          class="w-full glass border border-accent rounded-xl"
        >
          <img
            :src="getProductThumbnail(product)"
            :alt="product.product_name"
            class="w-full object-cover aspect-square rounded-t-xl" loading="lazy"
          />
          <div class="space-y-1 p-6">
            <h5 class="text-base text-tone font-medium">
              {{ product.product_name }}
            </h5>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="flex justify-center">
      <ClientOnly>
        <UPagination v-model:page="meta.page" :total="meta.total" />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import type { HttpSuccessWithPagination } from "~/types/http";
import type { Item } from "~/types/product";

const config = useRuntimeConfig();
const localeRoute = useLocaleRoute();
const meta = reactive({
  limit: 12,
  page: 1,
  total: 0,
});
const route = useRoute();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  params.append("category_id", `${route.params.categoryid}`);
  params.append("series_id", `${route.params.seriesid}`);
  return params.toString();
});

const { data: products, status: onLoadData, refresh: refreshItems } = await useFetch(
  () => `${config.public.apiBase}/products?${params.value}`,
  {
    transform: (value: HttpSuccessWithPagination<Item[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

const breadcrumbItems = computed(() => {
  const category = products.value?.find(p => p.category)?.category;
  const series = products.value?.find(p => p.series)?.series;
  return [
    {
      label: "Home",
      to: localeRoute("/"),
    },
    {
      label: "Products",
      to: localeRoute("/products"),
    },
    {
      label: category?.category_name || "Category",
      to: localeRoute(`/products/${category?.category_id}`),
    },
    {
      label: series?.series_name || "Series",
      to: localeRoute(`/products/${category?.category_id}/${series?.series_id}`),
    },
  ] as BreadcrumbItem[];
});

function getProductThumbnail(product: Item) {
  return product.images.find(i => i.is_main)?.image_url || "";
}
</script>
