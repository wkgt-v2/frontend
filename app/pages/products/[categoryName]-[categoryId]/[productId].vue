<template>
  <div class="container space-y-8 py-8 lg:py-16">
    <UBreadcrumb :items="breadcrumbItems" />
    <div v-if="item" class="space-y-16">
      <div class="grid lg:grid-cols-2 gap-16 lg:gap-6">
        <ImageGallery :urls="sortedImages.map(i => i.image_url)" />
        <div class="space-y-8">
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
          <div v-if="item.product_detail" class="space-y-2">
            <h5 class="mb-2 text-lg text-primary font-semibold">
              Detail
            </h5>
            <div class="whitespace-pre-line" v-html="item.product_detail"></div>
          </div>
          <div v-if="item.product_info" class="space-y-2">
            <h5 class="mb-2 text-lg text-primary font-semibold">
              Important Information
            </h5>
            <div class="whitespace-pre-line" v-html="item.product_info"></div>
          </div>
        </div>
      </div>
      <div class="col-span-2">
        <h5 class="mb-2 text-lg text-primary font-semibold">
          Specifications
        </h5>
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
      to: localeRoute(`/products/${route.params.categoryName}-${route.params.categoryId}/${item.value?.product_id}`),
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
