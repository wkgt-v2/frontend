<template>
  <div class="container space-y-8 py-16">
    <UBreadcrumb :items="breadcrumbItems" />
    <div v-if="item" class="grid grid-cols-5 gap-6">
      <ImageGallery :urls="sortedImages.map(i => i.image_url)" class="col-span-2" />
      <div class="col-span-3 space-y-8">
        <div class="space-y-2">
          <h2 class="text-2xl text-tone font-semibold">
            {{ item.product_name }}
          </h2>
          <div class="flex gap-2">
            <UBadge v-if="item.category?.category_name" size="lg" variant="outline">
              {{ item.category.category_name }}
            </UBadge>
            <UBadge v-if="item.series?.series_name" size="lg" variant="outline">
              {{ item.series.series_name }}
            </UBadge>
          </div>
        </div>
        <p class="text-tone">
          {{ item.product_description }}
        </p>
        <UTabs :items="tabItems" variant="link" :ui="{ trigger: 'grow' }" class="w-full">
          <template #specification>
            <table class="table table-fixed w-full">
              <tbody>
                <tr
                  v-for="specification in item.specifications"
                  :key="specification.spec_id"
                  class="*:p-4 border-b border-accent hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  <td class="font-semibold align-middle">
                    {{ specification.spec_type }}
                  </td>
                  <td class="whitespace-pre-line">
                    {{ specification.spec_value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <template #detail>
            <div class="whitespace-pre-line" v-html="item.product_detail"></div>
          </template>
          <template #information>
            <div class="whitespace-pre-line" v-html="item.product_info"></div>
          </template>
        </UTabs>
      </div>
    </div>
    <div v-else class="py-16">
      <h4 class="text-xl text-tone text-center font-semibold">
        Data not found
      </h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem, TabsItem } from "@nuxt/ui";
import type { HttpSuccess } from "~/types/http";
import type { Image, Item } from "~/types/product";

const tabItems = [
  {
    label: "Specification",
    slot: "specification" as const,
  },
  {
    label: "Detail",
    slot: "detail" as const,
  },
  {
    label: "Important Information",
    slot: "information" as const,
  },
] satisfies TabsItem[];

const config = useRuntimeConfig();
const localeRoute = useLocaleRoute();
const route = useRoute();

const { data: item } = await useFetch(
  `${config.public.apiBase}/products/${route.params.productId}`,
  {
    transform: (value: HttpSuccess<Item>) => {
      return value.data;
    },
  }
);

const images = ref<Image[]>([]);

const breadcrumbItems = computed(() => {
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
      label: route.params.categoryName || "Category",
      to: localeRoute(`/products/${route.params.categoryName}-${route.params.categoryId}`),
    },
    {
      label: item.value?.product_name || "Product",
      to: localeRoute(`/products/${item.value?.product_id}`),
    }
  ] as BreadcrumbItem[];
});

const sortedImages = computed(() => {
  return images.value.sort((a, b) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0)) || [];
});

watch(() => item.value, (val) => {
  if (val) {
    images.value = val.images;
  }
}, { immediate: true });
</script>
