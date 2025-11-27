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
    <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      <USlideover side="left" title="Filter">
        <UButton variant="outline" icon="i-material-symbols:tune" label="Filter" class="w-fit lg:hidden" />

        <template #body>
          <div class="space-y-4">
            <UFormField :label="$t('blog.search')">
              <UInput v-model="searchQuery" />
            </UFormField>
            <UAccordion :items="accordionItems" type="multiple" :default-value="['0']">
              <template #categories>
                <UCheckboxGroup
                  v-if="categories.length"
                  v-model="filter.categories"
                  :items="mappedCategories"
                  variant="table"
                  class="pb-3"
                />
                <div v-else class="text-tone text-center">
                  {{ $t("blog.no_data") }}
                </div>
              </template>
            </UAccordion>
          </div>
        </template>
      </USlideover>
      <div class="not-lg:hidden space-y-4">
        <UFormField :label="$t('blog.search')">
          <UInput v-model="searchQuery" />
        </UFormField>
        <UAccordion :items="accordionItems" type="multiple" :default-value="['0']">
          <template #series>
            <UCheckboxGroup
              v-if="categories.length"
              v-model="filter.categories"
              :items="mappedCategories"
              variant="table"
              class="pb-3"
            />
              <div v-else class="text-tone text-center">
                {{ $t("blog.no_data") }}
              </div>
          </template>
        </UAccordion>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 col-span-2 xl:col-span-3 gap-4 lg:gap-6 h-fit">
        <div v-if="onLoadData === 'pending'" class="col-span-4 flex items-center justify-center w-full h-96">
          <UIcon name="i-material-symbols:progress-activity" class="size-16 text-primary animate-spin" />
        </div>
        <template v-else>
          <template v-if="articles?.length">
            <NuxtLink
              v-for="article in articles"
              :key="article.blog_article_id"
              :to="$localeRoute(`/blog/${article.blog_article_id}`)"
              class="w-full glass border border-accent rounded-xl"
            >
              <img
                :src="article.thumbnail"
                :alt="article.title"
                class="w-full object-contain aspect-square rounded-t-xl" loading="lazy"
              />
              <div class="space-y-1 p-6">
                <small class="text-sm text-primary">
                  {{ article.category.blog_category_name }}
                </small>
                <h5 class="text-base text-tone font-medium">
                  {{ article.title }}
                </h5>
              </div>
            </NuxtLink>
          </template>
          <div v-else class="col-span-4 flex items-center justify-center w-full h-96">
            <div class="text-center">
              <UIcon name="i-material-symbols:do-not-disturb-on-outline" class="size-24 text-primary" />
              <div class="text-tone">
                {{ $t("blog.no_data") }}
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
import type { AccordionItem } from "@nuxt/ui";
import type { BlogArticle, BlogCategory } from "~/types/blog";
import type { HttpSuccessWithPagination } from "~/types/http";

const categories = ref<BlogCategory[]>([]);
const config = useRuntimeConfig();
const filter = reactive({
  categories: [] as string[],
});
const meta = reactive({
  limit: 10,
  page: 1,
  total: 0,
});
const { t } = useI18n();
const radialRef = useTemplateRef("radialRef");
const route = useRoute();
const searchQuery = useDebouncedRef("", 500);

const accordionItems = computed<AccordionItem[]>(() => {
  return [
    {
      label: t("blog.categories"),
      slot: "categories" as const,
    },
  ];
});

const mappedCategories = computed(() => {
  return categories.value.map(c => {
    return {
      label: c.blog_category_name,
      value: `${c.blog_category_id}`,
    };
  });
});

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (searchQuery.value) params.append("title", searchQuery.value);
  if (filter.categories.length) {
    filter.categories.forEach(c => {
      params.append("blog_category_id", c);
    });
  }
  return params.toString();
});

const { data: articles, status: onLoadData, refresh: refreshItems } = await useFetch(
  () => `${config.public.apiBase}/blog-articles?${params.value}`,
  {
    transform: (value: HttpSuccessWithPagination<BlogArticle[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

async function getCategories(page: number) {
  const params = new URLSearchParams();
  params.append("page", `${page}`);
  params.append("limit", "10");
  const res = await $fetch<HttpSuccessWithPagination<BlogCategory[]>>(`${config.public.apiBase}/blog-categories?${params}`);
  categories.value = [...categories.value, ...res.data.data];
  if (page < res.data.totalPages) getCategories(page + 1);
}

function updateRadialPosition(e: MouseEvent) {
  const el = radialRef.value as HTMLDivElement;
  if (el) {
    el.style.left = `${e.clientX}px`;
    el.style.top = `${e.clientY}px`;
  }
}

onMounted(() => {
  getCategories(1);
  refreshItems();

  if (route.query.category) filter.categories.push(`${route.query.category}`);
});
</script>
