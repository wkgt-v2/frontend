<template>
  <div class="container space-y-16 py-16">
    <template v-if="article">
      <img :src="article.thumbnail" :alt="article.title" class="w-full max-w-xl max-h-96 mx-auto object-contain">
      <div class="space-y-2">
        <h2 class="text-2xl text-tone font-semibold">
          {{ article.title }}
        </h2>
        <div class="flex gap-2">
          <UBadge size="lg" variant="outline">
            {{ article.category.blog_category_name }}
          </UBadge>
        </div>
      </div>
      <div class="tiptap ProseMirror" v-html="article.content"></div>
    </template>
    <h4 v-else class="text-xl text-tone text-center font-semibold">
      {{ $t("blog.article_not_found") }}
    </h4>
  </div>
</template>

<script setup lang="ts">
import type { BlogArticle } from "~/types/blog";
import type { HttpSuccess } from "~/types/http";

const config = useRuntimeConfig();
const route = useRoute();

const { data: article } = await useFetch(
  `${config.public.apiBase}/blog-articles/${route.params.articleId}`,
  {
    transform: (value: HttpSuccess<BlogArticle>) => {
      return value.data;
    },
  }
);
</script>
