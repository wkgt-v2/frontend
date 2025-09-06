<template>
  <div class="container space-y-8 grid grid-cols-5 gap-6 py-16">
    <div class="space-y-4">
      <UFormField label="Search Product">
        <UInput v-model="searchQuery" />
      </UFormField>
      <UAccordion :items="accordionItems" type="multiple" :default-value="['0']">
        <template #categories>
          <UCheckboxGroup
            v-model="filter.categories"
            :items="mappedCategories"
            variant="table"
            class="pb-3"
          />
        </template>
        <template #series>
          <UCheckboxGroup
            v-model="filter.series"
            :items="mappedSeries"
            variant="table"
            class="pb-3"
          />
        </template>
      </UAccordion>
    </div>
    <div class="grid grid-cols-4 col-span-4 gap-6 h-fit">
      <div v-if="onLoadData === 'pending'" class="col-span-4 flex items-center justify-center w-full h-96">
        <UIcon name="i-material-symbols:progress-activity" class="size-16 text-primary animate-spin" />
      </div>
      <template v-else>
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
            <small class="text-sm text-primary">
              {{ product.category?.category_name || "" }}
              {{ product.series?.series_name || "" }}
            </small>
            <h5 class="text-base text-tone font-medium">
              {{ product.product_name }}
            </h5>
          </div>
        </NuxtLink>
        <div class="col-span-4 flex justify-center">
          <UPagination v-model:page="meta.page" :total="meta.total" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";
import type { HttpSuccessWithPagination } from "~/types/http";
import type { Category, Item, Series } from "~/types/product";

const accordionItems = [
  {
    label: "Categories",
    slot: "categories" as const,
  },
  {
    label: "Series",
    slot: "series" as const,
  },
] satisfies AccordionItem[];

const categories = useCategories();
const config = useRuntimeConfig();
const filter = reactive({
  categories: [] as string[],
  series: [] as string[],
});
const localeRoute = useLocaleRoute();
const meta = reactive({
  limit: 12,
  page: 1,
  total: 0,
});
const route = useRoute();
const searchQuery = useDebouncedRef("", 500);
const series = ref<Series[]>([]);

const mappedCategories = computed(() => {
  return categories.value.map(c => {
    return { label: c.category_name, value: `${c.category_id}` };
  });
});

const mappedSeries = computed(() => {
  return series.value.map(s => {
    return {
      label: s.series_name,
      value: `${s.series_id}`,
      disabled: filter.categories.length ? !filter.categories.includes(`${s.category_id}`) : false,
    };
  });
});

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (searchQuery.value) params.append("product_name", searchQuery.value);
  if (filter.categories.length) {
    filter.categories.forEach(c => {
      params.append("category_id", c);
    });
  }
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

watch(() => filter.categories, (val) => {
  if (!val.length) return;
  filter.series = filter.series.filter(s => {
    const data = series.value.find(_ => `${_.series_id}` === s);
    if (data) {
      return val.includes(`${data.category_id}`);
    } else {
      return false;
    }
  });
});

function getProductThumbnail(product: Item) {
  return product.images.find(i => i.is_main)?.image_url || "";
}

async function getSeries(page: number) {
  const res = await $fetch<HttpSuccessWithPagination<Series[]>>(`${config.public.apiBase}/series?page=${page}&limit=10`);
  series.value = [...series.value, ...res.data.data];
  if (res.data.totalPages !== page) getSeries(page + 1);
}

async function updateCategories() {
  const res = await $fetch<HttpSuccessWithPagination<Category[]>>(`${config.public.apiBase}/categories?limit=9999`);
  categories.value = res.data.data;
}

onMounted(() => {
  updateCategories();
  getSeries(1);
});
</script>
