<template>
  <div v-if="articles" class="relative container space-y-16 py-16 text-center">
    <h1 class="text-5xl text-primary font-semibold">
      Artikel Terbaru
    </h1>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <NuxtLink
        v-for="article in articles"
        :key="article.blog_article_id"
        :to="$localeRoute(`/blog/${article.blog_article_id}`)"
        class="w-full glass border border-accent rounded-xl"
      >
        <img
          :src="article.thumbnail"
          :alt="article.title"
          class="w-full object-cover aspect-square rounded-t-xl" loading="lazy"
        />
        <div class="space-y-1 p-6">
          <h4 class="text-xl text-primary font-semibold">
            {{ article.title }}
          </h4>
          <p class="text-tone line-clamp-2" v-html="article.content"></p>
        </div>
      </NuxtLink>
    </div>

    <UButton
      size="lg"
      trailing-icon="i-material-symbols-arrow-right-alt-rounded"
      :to="$localePath('products')"
    >
      Lihat Semua Artikel
    </UButton>
  </div>
</template>

<script setup lang="ts">
import type { BlogArticle } from "~/types/blog";
import type { HttpSuccessWithPagination } from "~/types/http";

const { data: articles } = await useFetch(
  `${useRuntimeConfig().public.apiBase}/blog-articles?limit=5`,
  {
    transform: (value: HttpSuccessWithPagination<BlogArticle[]>) => {
      return value.data.data;
    },
  }
);
</script>
