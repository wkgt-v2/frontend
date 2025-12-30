<template>
  <section
    v-if="articles?.length"
    class="relative py-24 bg-[color:var(--bg-main,#050505)] text-white"
  >
    <div class="relative mx-auto w-[92%] max-w-[1200px] space-y-12 text-center">
      <!-- section title like .section-title -->
      <div class="text-center">
        <h1 class="text-5xl font-semibold tracking-[2px] uppercase">
          {{ $t("landing.articles.title") }}
        </h1>
        <div
          class="mx-auto mt-5 h-[3px] w-[60px]
                 bg-[color:var(--accent-blue,#00f7ff)]
                 shadow-[0_0_10px_rgba(0,247,255,0.75)]"
        />
      </div>

      <!-- portfolio-grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink
          v-for="article in articles"
          :key="article.blog_article_id"
          :to="$localeRoute(`/blog/${article.blog_article_id}`)"
          class="group block"
        >
          <!-- portfolio-item -->
          <div
            class="relative h-[300px] overflow-hidden rounded-[10px] border border-[#222]"
          >
            <!-- portfolio-img (image cover + zoom on hover) -->
            <div class="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
              <Image
                :src="article.thumbnail"
                :alt="article.title"
                mode="cover"
                image-classes="w-full h-full object-cover"
              />
              <!-- subtle dark layer to mimic portfolio preview -->
              <div class="absolute inset-0 bg-black/30" />
            </div>

            <!-- portfolio-overlay (slides up) -->
            <div
              class="absolute left-0 bottom-[-100%] w-full h-full
                     bg-[rgba(0,247,255,0.95)]
                     transition-all duration-300 ease-in-out
                     group-hover:bottom-0
                     flex flex-col items-center justify-center text-center
                     p-6 text-[color:var(--bg-main,#050505)]"
            >
              <h4 class="text-xl font-semibold mb-2 text-black">
                {{ article.title }}
              </h4>

              <p
                class="font-medium text-[#333] mb-5 line-clamp-2"
                v-html="htmlToPlainText(article.content)"
              />

              <!-- btn-small -->
              <span
                class="inline-block px-5 py-2 border-2 border-black
                       font-bold uppercase text-[0.8rem]
                       text-black transition-all duration-300
                       group-hover:bg-black group-hover:text-[color:var(--accent-blue,#00f7ff)]"
              >
                {{ $t("landing.articles.read_more") }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- CTA button like .btn-cyber -->
      <div class="pt-2">
        <UButton
          size="lg"
          trailing-icon="i-material-symbols-arrow-right-alt-rounded"
          :to="$localePath('blog')"
          class="px-10 py-4 font-bold tracking-wide uppercase
                 bg-transparent border-2
                 border-[color:var(--accent-blue,#00f7ff)]
                 text-[color:var(--accent-blue,#00f7ff)]
                 hover:bg-[color:var(--accent-blue,#00f7ff)]
                 hover:text-[color:var(--bg-main,#050505)]
                 hover:shadow-[0_0_30px_rgba(0,247,255,0.6)]"
        >
          {{ $t("landing.articles.cta") }}
        </UButton>
      </div>
    </div>
  </section>
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
