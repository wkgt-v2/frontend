<template>
  <div v-if="articles" class="relative container space-y-16 py-16 text-center">
    <h1 class="text-5xl text-primary font-semibold">
      Artikel Terbaru
    </h1>
    <UCarousel
      v-slot="{ item }"
      :items="articles"
      class="w-full"
      :ui="{ item: 'sm:basis-1/2 lg:basis-1/3 xl:basis-1/4' }"
      dots
    >
      <div class="w-full glass border border-accent rounded-xl">
        <img
          :src="item.thumbnail"
          :alt="item.title"
          class="w-full object-cover aspect-square rounded-t-xl" loading="lazy"
        />
        <div class="space-y-1 p-6">
          <h4 class="text-xl text-primary font-semibold">
            {{ item.title }}
          </h4>
          <p class="text-tone line-clamp-2" v-html="item.content"></p>
          <UButton
            :to="$localeRoute(`/blog/${item.blog_article_id}`)"
            variant="link"
          >
            Read more
          </UButton>
        </div>
      </div>
    </UCarousel>

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
