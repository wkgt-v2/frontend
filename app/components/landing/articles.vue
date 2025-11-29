<template>
  <div v-if="articles?.length" class="relative container space-y-16 py-16 text-center">
    <h1 class="text-5xl text-primary font-semibold">
      {{ $t("landing.articles.title") }}
    </h1>
    <div class="flex flex-wrap justify-center gap-y-6">
      <div v-for="article in articles" :key="article.blog_article_id" class="w-full sm:w-1/2 lg:w-1/3 px-3">
        <NuxtLink
          :to="$localeRoute(`/blog/${article.blog_article_id}`)"
          class="block size-full glass border border-accent rounded-xl md:hover:scale-105 md:hover:shadow-lg transition-all"
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
            <p class="text-tone line-clamp-2" v-html="htmlToPlainText(article.content)"></p>
            <span class="text-sm text-primary">
              {{ $t("landing.articles.read_more") }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <UButton
      size="lg"
      trailing-icon="i-material-symbols-arrow-right-alt-rounded"
      :to="$localePath('blog')"
    >
      {{ $t("landing.articles.cta") }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import type { BlogArticle } from "~/types/blog";
import type { HttpSuccessWithPagination } from "~/types/http";

const { data: articles } = await useFetch(
  `${useRuntimeConfig().public.apiBase}/blog-articles?limit=3`,
  {
    transform: (value: HttpSuccessWithPagination<BlogArticle[]>) => {
      return value.data.data;
    },
  }
);
</script>
