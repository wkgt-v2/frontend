<template>
  <div class="container space-y-8 py-16">
    <UBreadcrumb :items="breadcrumbItems" />
    <div class="flex flex-wrap justify-center gap-6 *:w-[calc(33%-12px)]">
      <NuxtLink
        v-for="s in series"
        :key="s.series_id"
        :to="$localeRoute(`/products/${s.category_id}/${s.series_id}`)"
        class="w-full glass border border-accent rounded-xl"
      >
        <div class="space-y-1 p-6">
          <small class="text-sm text-primary">
            {{ s.series_code }}
          </small>
          <h5 class="text-base text-tone font-medium">
            {{ s.series_name }}
          </h5>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";
import type { HttpSuccessWithPagination } from "~/types/http";
import type { Series } from "~/types/product";

const config = useRuntimeConfig();
const localeRoute = useLocaleRoute();
const route = useRoute();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("limit", "9999");
  params.append("category_id", `${route.params.categoryid}`);
  return params.toString();
});

const { data: series } = await useFetch(
  `${config.public.apiBase}/series?${params.value}`,
  {
    transform: (value: HttpSuccessWithPagination<Series[]>) => {
      return value.data.data;
    },
  }
);

const breadcrumbItems = computed(() => {
  const category = series.value?.find(s => s.category)?.category;
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
      label: category?.category_name || "Category",
      to: localeRoute(`/products/${category?.category_id}`),
    }
  ] as BreadcrumbItem[];
});
</script>
