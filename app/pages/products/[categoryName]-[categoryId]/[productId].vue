<template>
  <div class="container space-y-4 xl:space-y-8 py-8 lg:py-16">
    <template v-if="item">
      <UBreadcrumb :items="breadcrumbItems" />
      <UTabs variant="link" :items="mainTabs" class="w-full" :ui="{ root: 'gap-4 xl:gap-8', list: 'justify-end' }">
        <template #overview>
          <div class="space-y-16">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-16 md:gap-6">
              <ImageGallery :urls="sortedImages.map(i => i.image_url)" class="md:col-span-2" />
              <div class="space-y-8 md:col-span-3">
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
                <p class="tiptap ProseMirror" v-html="item.product_description"></p>
                <div v-if="item.product_marketplace" class="flex gap-4">
                  <NuxtLink
                    v-if="item.product_marketplace.tokopedia"
                    :to="item.product_marketplace.tokopedia"
                    target="_blank"
                  >
                    <img src="/assets/images/logo/marketplace/tokopedia.png" alt="Tokopedia" class="w-full h-16">
                  </NuxtLink>
                  <NuxtLink
                    v-if="item.product_marketplace.shopee"
                    :to="item.product_marketplace.shopee"
                    target="_blank"
                  >
                    <img src="/assets/images/logo/marketplace/shopee.png" alt="Shopee" class="w-full h-16">
                  </NuxtLink>
                </div>
              </div>
            </div>
            <UTabs variant="link" :items="subTabs" class="w-full" :ui="{ root: 'gap-4 xl:gap-8' }">
              <template #details>
                <div v-if="item.product_detail" class="tiptap ProseMirror" v-html="item.product_detail"></div>
                <div v-else>
                  -
                </div>
              </template>
              <template #information>
                <div v-if="item.product_info" class="tiptap ProseMirror" v-html="item.product_info"></div>
                <div v-else>
                  -
                </div>
              </template>
            </UTabs>
          </div>
        </template>
        <template #specifications>
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
                <td class="tiptap ProseMirror" v-html="specification.spec_value"></td>
              </tr>
            </tbody>
          </table>
        </template>
      </UTabs>
    </template>
    <div v-else class="py-16">
      <h4 class="text-xl text-tone text-center font-semibold">
        {{ $t("product.data_not_found") }}
      </h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem, TabsItem } from "@nuxt/ui";
import type { HttpSuccess } from "~/types/http";
import type { Image, Item } from "~/types/product";

const config = useRuntimeConfig();
const { t } = useI18n();
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

useHead({
  title: item.value?.product_name,
});

const mainTabs = computed<TabsItem[]>(() => {
  return [
    {
      label: t("product.overview"),
      slot: "overview" as const,
    },
    {
      label: t("product.specifications"),
      slot: "specifications" as const,
    },
  ];
});
const subTabs = computed<TabsItem[]>(() => {
  return [
    {
      label: t("product.details"),
      slot: "details" as const,
    },
    {
      label: t("product.important_information"),
      slot: "information" as const,
    },
  ];
});

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

const desc = htmlToPlainText(item.value?.product_description || "");
const metaDesc = desc.length > 159 ? desc.slice(0, 159 - 1).trimEnd() + "…" : desc;
useSeoMeta({
  title: item.value?.product_name,
  ogTitle: item.value?.product_name,
  description: metaDesc,
  ogDescription: metaDesc,
  ogImage: sortedImages.value[0]?.image_url,
});

watch(() => item.value, (val) => {
  if (val) {
    images.value = val.images;
  }
}, { immediate: true });
</script>
