<template>
  <div class="container py-10 lg:py-16 space-y-6 xl:space-y-10">
    <template v-if="item">
      <div class="flex flex-col gap-4">
        <UBreadcrumb :items="breadcrumbItems" />

        <UTabs
          variant="link"
          :items="mainTabs"
          class="w-full"
          :ui="{
            root: 'gap-4 xl:gap-8',
            list: 'justify-start md:justify-end border-b border-[rgba(0,247,255,0.12)]',
          }"
        >
          <template #overview>
            <div class="space-y-10 xl:space-y-14">
              <div
                class="rounded-2xl overflow-hidden border border-[rgba(0,247,255,0.12)] bg-[rgba(10,10,18,0.65)] backdrop-blur-[10px]"
              >
                <div class="p-5 md:p-6 lg:p-8">
                  <div class="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-10">
                    <!-- Gallery -->
                    <div class="md:col-span-2">
                      <div class="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(5,5,5,0.35)] p-2">
                        <ImageGallery
                          :urls="sortedImages.map(i => i.image_url)"
                          class="rounded-lg overflow-hidden"
                        />
                      </div>

                      <div class="mt-3 text-xs text-[#b3b3b3]/80">
                        {{ $t("product.overview") }}
                      </div>
                    </div>
                    <div class="md:col-span-3 space-y-6">
                      <!-- Title + badges -->
                      <div class="space-y-3">
                        <div class="flex flex-col gap-2">
                          <h2 class="text-2xl lg:text-3xl font-semibold text-white leading-tight">
                            {{ item.product_name }}
                          </h2>

                          <div class="flex flex-wrap gap-2">
                            <UBadge
                              v-if="item.category?.category_name"
                              size="lg"
                              variant="outline"
                              class="border-[rgba(0,247,255,0.35)] text-white/90"
                            >
                              {{ item.category.category_name }}
                            </UBadge>

                            <UBadge
                              v-if="item.series?.series_name"
                              size="lg"
                              variant="outline"
                              class="border-[rgba(0,247,255,0.35)] text-white/90"
                            >
                              {{ item.series.series_name }}
                            </UBadge>
                          </div>
                        </div>
                      </div>
                      <div class="rounded-xl border border-[rgba(0,247,255,0.10)] bg-[rgba(5,5,5,0.35)] p-5 lg:p-6">
                        <div class="text-sm text-white/90 mb-3 font-semibold tracking-wide">
                          {{ $t("product.overview") }}
                        </div>
                        <div class="tiptap ProseMirror max-w-none leading-relaxed text-[#b3b3b3]" v-html="item.product_description"></div>
                      </div>
                      <div
                        v-if="item.product_marketplace || item.addon_website_url"
                        class="rounded-xl border border-[rgba(0,247,255,0.10)] bg-[rgba(5,5,5,0.35)] p-5 lg:p-6"
                      >
                        <div class="flex items-center justify-between gap-4 flex-wrap">
                          <div class="space-y-1">
                            <div class="text-sm font-semibold text-white">
                              Buy / Visit
                            </div>
                            <div class="text-xs text-[#b3b3b3]">
                              Marketplace & official website
                            </div>
                          </div>

                          <div class="flex flex-wrap gap-3 items-center">
                            <NuxtLink
                              v-if="item.product_marketplace?.tokopedia"
                              :to="item.product_marketplace.tokopedia"
                              target="_blank"
                              class="group"
                            >
                              <div
                                class="h-12 w-[150px] rounded-lg border border-[#333] bg-[rgba(10,10,18,0.75)] px-3 flex items-center justify-center transition
                                       group-hover:border-[rgba(0,247,255,0.45)] group-hover:shadow-[0_0_18px_rgba(0,247,255,0.25)]"
                              >
                                <img
                                  src="/assets/images/logo/marketplace/tokopedia.png"
                                  alt="Tokopedia"
                                  class="h-7 w-auto"
                                />
                              </div>
                            </NuxtLink>

                            <NuxtLink
                              v-if="item.product_marketplace?.shopee"
                              :to="item.product_marketplace.shopee"
                              target="_blank"
                              class="group"
                            >
                              <div
                                class="h-12 w-[150px] rounded-lg border border-[#333] bg-[rgba(10,10,18,0.75)] px-3 flex items-center justify-center transition
                                       group-hover:border-[rgba(0,247,255,0.45)] group-hover:shadow-[0_0_18px_rgba(0,247,255,0.25)]"
                              >
                                <img
                                  src="/assets/images/logo/marketplace/shopee.png"
                                  alt="Shopee"
                                  class="h-7 w-auto"
                                />
                              </div>
                            </NuxtLink>

                            <UButton
                              v-if="item.addon_website_url"
                              :to="item.addon_website_url"
                              target="_blank"
                              size="lg"
                              variant="outline"
                              icon="i-material-symbols:captive-portal"
                              class="h-12 px-4 text-[#00f7ff] border-[rgba(0,247,255,0.45)] hover:bg-[#00f7ff] hover:text-[#050505] hover:shadow-[0_0_22px_rgba(0,247,255,0.35)] transition"
                            >
                              Website
                            </UButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rounded-2xl overflow-hidden border border-[rgba(0,247,255,0.12)] bg-[rgba(10,10,18,0.55)] backdrop-blur-[10px]">
                <div class="p-5 md:p-6 lg:p-8 space-y-4">
                  <div class="flex items-end justify-between gap-4 flex-wrap">
                    <div class="space-y-1">
                      <h3 class="text-lg font-semibold text-white">
                        Product Content
                      </h3>
                      <p class="text-sm text-[#b3b3b3]">
                        Details & important information
                      </p>
                    </div>
                  </div>

                  <UTabs
                    variant="link"
                    :items="subTabs"
                    class="w-full"
                    :ui="{
                      root: 'gap-4 xl:gap-6',
                      list: 'justify-start border-b border-[rgba(0,247,255,0.10)]',
                    }"
                  >
                    <template #details>
                      <div class="pt-4">
                        <div
                          v-if="item.product_detail"
                          class="rounded-xl border border-[rgba(0,247,255,0.10)] bg-[rgba(5,5,5,0.35)] p-5 lg:p-6"
                        >
                          <div class="tiptap ProseMirror max-w-none text-[#b3b3b3]" v-html="item.product_detail"></div>
                        </div>
                        <div v-else class="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(5,5,5,0.25)] p-6 text-center text-[#b3b3b3]">
                          -
                        </div>
                      </div>
                    </template>

                    <template #information>
                      <div class="pt-4">
                        <div
                          v-if="item.product_info"
                          class="rounded-xl border border-[rgba(0,247,255,0.10)] bg-[rgba(5,5,5,0.35)] p-5 lg:p-6"
                        >
                          <div class="tiptap ProseMirror max-w-none text-[#b3b3b3]" v-html="item.product_info"></div>
                        </div>
                        <div v-else class="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(5,5,5,0.25)] p-6 text-center text-[#b3b3b3]">
                          -
                        </div>
                      </div>
                    </template>
                  </UTabs>
                </div>
              </div>
            </div>
          </template>

          <template #specifications>
            <div class="rounded-2xl overflow-hidden border border-[rgba(0,247,255,0.12)] bg-[rgba(10,10,18,0.55)] backdrop-blur-[10px]">
              <div class="p-5 md:p-6 lg:p-8 space-y-4">
                <div class="flex items-end justify-between gap-4 flex-wrap">
                  <div class="space-y-1">
                    <h3 class="text-lg font-semibold text-white">
                      {{ $t("product.specifications") }}
                    </h3>
                    <p class="text-sm text-[#b3b3b3]">
                      Technical specs & key attributes
                    </p>
                  </div>
                </div>

                <div class="rounded-xl border border-[rgba(0,247,255,0.10)] bg-[rgba(5,5,5,0.35)] overflow-hidden">
                  <table class="w-full text-sm">
                    <tbody class="divide-y divide-[rgba(0,247,255,0.10)]">
                      <tr
                        v-for="specification in item.specifications"
                        :key="specification.spec_id"
                        class="transition hover:bg-[rgba(0,247,255,0.06)]"
                      >
                        <td class="p-4 w-[38%] align-top font-semibold text-white/90">
                          {{ specification.spec_type }}
                        </td>
                        <td class="p-4 align-top">
                          <div class="tiptap ProseMirror max-w-none text-[#b3b3b3]" v-html="specification.spec_value"></div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div v-if="!item.specifications?.length" class="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(5,5,5,0.25)] p-6 text-center text-[#b3b3b3]">
                  -
                </div>
              </div>
            </div>
          </template>
        </UTabs>
      </div>
    </template>

    <div v-else class="py-16">
      <div class="mx-auto max-w-xl text-center space-y-3">
        <div class="text-3xl">🧩</div>
        <h4 class="text-xl text-white font-semibold">
          {{ $t("product.data_not_found") }}
        </h4>
        <p class="text-sm text-[#b3b3b3]">
          Please check the product link or go back to the product list.
        </p>
      </div>
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
