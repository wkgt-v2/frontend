<template>
  <div
    class="container space-y-8 min-h-[calc(100dvh-64px)] py-16"
    @mousemove="updateRadialPosition"
  >
    <Teleport to="body">
      <div
        ref="radialRef"
        class="eclipse fixed size-[960px] pointer-events-none -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform"
      ></div>
    </Teleport>
    <UBreadcrumb :items="breadcrumbItems" />
    <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
      <USlideover side="left" title="Filter">
        <UButton variant="outline" icon="i-material-symbols:tune" label="Filter" class="w-fit lg:hidden" />

        <template #body>
          <div class="space-y-4">
            <UFormField :label="$t('product.search')">
              <UInput v-model="searchQuery" />
            </UFormField>
            <UAccordion :items="accordionItems" type="multiple" :default-value="['0']">
              <template #series>
                <UCheckboxGroup
                  v-if="series.length"
                  v-model="filter.series"
                  :items="mappedSeries"
                  variant="table"
                  class="pb-3"
                />
                <div v-else class="text-tone text-center">
                  {{ $t("product.no_data") }}
                </div>
              </template>
            </UAccordion>
          </div>
        </template>
      </USlideover>
      <div class="not-lg:hidden space-y-4">
        <UFormField :label="$t('product.search')">
          <UInput v-model="searchQuery" />
        </UFormField>
        <UAccordion :items="accordionItems" type="multiple" :default-value="['0']">
          <template #series>
            <UCheckboxGroup
              v-if="series.length"
              v-model="filter.series"
              :items="mappedSeries"
              variant="table"
              class="pb-3"
            />
              <div v-else class="text-tone text-center">
                {{ $t("product.no_data") }}
              </div>
          </template>
        </UAccordion>
      </div>
      <div class="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 col-span-2 xl:col-span-3 2xl:col-span-4 gap-4 lg:gap-6 h-fit">
        <div v-if="onLoadData === 'pending'" class="col-span-4 flex items-center justify-center w-full h-96">
          <UIcon name="i-material-symbols:progress-activity" class="size-16 text-primary animate-spin" />
        </div>
        <template v-else>
          <template v-if="products?.length">
            <NuxtLink
              v-for="product in products"
              :key="product.product_id"
              :to="$localeRoute(`/products/${product.category.category_name}-${product.category_id}/${product.product_id}`)"
              class="w-full glass border border-accent rounded-xl"
            >
              <img
                :src="getProductThumbnail(product)"
                :alt="product.product_name"
                class="w-full object-contain aspect-square rounded-t-xl" loading="lazy"
              />
              <div class="space-y-1 p-6">
                <small class="text-sm text-primary">
                  {{ product.category.category_name }}
                </small>
                <h5 class="text-base text-tone font-medium">
                  {{ product.product_name }}
                </h5>
              </div>
            </NuxtLink>
          </template>
          <div v-else class="col-span-4 flex items-center justify-center w-full h-96">
            <div class="text-center">
              <UIcon name="i-material-symbols:do-not-disturb-on-outline" class="size-24 text-primary" />
              <div class="text-tone">
                {{ $t("product.no_data") }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="flex justify-center">
      <ClientOnly>
        <UPagination v-model:page="meta.page" :items-per-page="meta.limit" :total="meta.total" />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccordionItem, BreadcrumbItem } from "@nuxt/ui";
import { Teleport } from "vue";
import type { HttpSuccessWithPagination } from "~/types/http";
import type { Item, Series } from "~/types/product";

const config = useRuntimeConfig();
const filter = reactive({
  series: [] as string[],
});
const { t } = useI18n();
const localeRoute = useLocaleRoute();
const meta = reactive({
  limit: 12,
  page: 1,
  total: 0,
});
const radialRef = useTemplateRef("radialRef");
const route = useRoute();
const searchQuery = useDebouncedRef("", 500);
const series = ref<Series[]>([]);

const accordionItems = computed<AccordionItem[]>(() => {
  return [
    {
      label: t("product.series"),
      slot: "series" as const,
    },
  ];
});

const mappedSeries = computed(() => {
  return series.value.map(s => {
    return {
      label: s.series_name,
      value: `${s.series_id}`,
    };
  });
});

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  params.append("category_id", `${route.params.categoryId}`);
  if (searchQuery.value) params.append("product_name", searchQuery.value);
  if (filter.series.length) {
    filter.series.forEach(s => {
      params.append("series_id", s);
    });
  }
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
  ] as BreadcrumbItem[];
});

function getProductThumbnail(product: Item) {
  return product.images.find(i => i.is_main)?.image_url || "";
}

async function getSeries(page: number) {
  const params = new URLSearchParams();
  params.append("page", `${page}`);
  params.append("limit", "10");
  params.append("category_id", `${route.params.categoryId}`);
  const res = await $fetch<HttpSuccessWithPagination<Series[]>>(`${config.public.apiBase}/series?${params}`);
  series.value = [...series.value, ...res.data.data];
  if (page < res.data.totalPages) getSeries(page + 1);
}

function updateRadialPosition(e: MouseEvent) {
  const el = radialRef.value as HTMLDivElement;
  if (el) {
    el.style.left = `${e.clientX}px`;
    el.style.top = `${e.clientY}px`;
  }
}

onMounted(() => {
  getSeries(1);
  refreshItems();
});
</script>

<style scoped>
.eclipse {
  background: radial-gradient(
    50% 50% at 50% 50%,
    #00b8db1a 0%,
    rgba(0, 184, 219, 0) 100%
  );
}
</style>
