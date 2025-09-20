<template>
  <div class="container py-16">
    <div v-if="!articles" class="flex items-center justify-center w-full h-96">
      <UIcon name="i-material-symbols:progress-activity" class="size-16 text-primary animate-spin" />
    </div>
    <div v-else class="space-y-8">
      <div class="flex flex-wrap justify-center gap-4 lg:gap-8">
        <NuxtLink
          v-for="article in articles"
          :key="article.blog_article_id"
          :to="$localeRoute(`/blog/${article.blog_article_id}`)"
          class="w-full max-w-60 lg:max-w-72 glass border border-accent rounded-xl"
        >
          <img
            :src="article.thumbnail"
            :alt="article.title"
            class="w-full object-cover aspect-square rounded-t-xl" loading="lazy"
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
      </div>
      <UButton
        v-if="hasLoadMore"
        class="flex mx-auto"
        :loading="onLoad"
        @click="handleLoadMore"
      >
        Load more
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import type { BlogArticle } from "~/types/blog";
import type { HttpError, HttpSuccessWithPagination } from "~/types/http";

const articles = ref<BlogArticle[]>();
const hasLoadMore = ref(true);
const meta = reactive({
  limit: 10,
  page: 1,
});
const onLoad = ref(false);
const searchQuery = useDebouncedRef("", 500);
const toast = useToast();

async function getArticles() {
  if (onLoad.value) return;
  onLoad.value = true;

  try {
    const params = new URLSearchParams({
      limit: `${meta.limit}`,
      page: `${meta.page}`,
    });
    if (searchQuery.value.trim()) params.append("title", searchQuery.value);

    const res = await $fetch<HttpSuccessWithPagination<BlogArticle[]>>(
      `${useRuntimeConfig().public.apiBase}/blog-articles?${params}`,
    );
    hasLoadMore.value = meta.page < res.data.totalPages;
    articles.value = articles.value ? articles.value.concat(res.data.data) : res.data.data;
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to get articles!",
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  onLoad.value = false;
}

function handleLoadMore() {
  meta.page = meta.page + 1;
  getArticles();
}

onMounted(() => {
  getArticles();
});
</script>
