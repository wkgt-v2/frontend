<template>
  <div class="space-y-6 p-6">
    <div class="flex not-sm:flex-col justify-between gap-4 sm:gap-8">
      <div class="flex items-end gap-4">
        <UFormField label="Search by title">
          <UInput v-model="searchQuery" />
        </UFormField>
        <UButton icon="i-material-symbols:tune" @click="openFilter" />
      </div>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshArticles()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton :to="$localePath('cms-blog-articles-new')">Create New Article</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="columns" :data="articles" :loading="onLoadData === 'pending'">
        <template #title-header>
          <CmsTableHeader label="Title" value="title" v-model:by="sort.by" v-model:order="sort.order" />
        </template>
        <template #slug-header>
          <CmsTableHeader label="Slug" value="slug" v-model:by="sort.by" v-model:order="sort.order" />
        </template>
        <template #action-cell="{ row }">
          <UDropdownMenu :items="getDropdownActions(row.original)">
            <UButton
              icon="i-material-symbols-more-vert"
              color="neutral"
              variant="ghost"
              aria-label="Actions"
            />
          </UDropdownMenu>
        </template>
      </UTable>
    </div>
    <div class="flex justify-center">
      <ClientOnly>
        <UPagination v-model:page="meta.page" :total="meta.total" />
      </ClientOnly>
    </div>
  </div>

  <UModal
    title="Filter"
    v-model:open="showFilter"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-6">
        <UFormField label="Category" name="blog_category_id">
          <USelectMenu
            v-model="_filter.blog_category_id"
            value-key="value"
            :items="categories"
            :loading="onLoadCategories === 'pending'"
          />
        </UFormField>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton label="Cancel" variant="outline" @click="close" />
      <UButton label="Reset" variant="outline" @click="resetFilter" />
      <UButton label="Apply Filter" @click="applyFilter" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import type { TableColumn } from "@nuxt/ui";
import type { HttpError, HttpSuccessWithPagination } from "~/types/http";
import type { BlogArticle } from "~/types/blog";

const columns: TableColumn<BlogArticle>[] = [
  {
    accessorKey: "blog_article_id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("blog_article_id")}`,
  },
  {
    accessorKey: "title",
  },
  {
    accessorKey: "slug",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.blog_category_name || "-",
  },
  {
    accessorKey: "is_published",
    header: "Status",
    cell: ({ row }) => row.original.is_published ? "Published" : "Draft",
  },
  {
    id: "action",
    meta: {
      class: {
        td: "w-16 text-right",
      },
    },
  },
];

const _filter = reactive({
  blog_category_id: undefined as undefined | number,
});
const config = useRuntimeConfig();
const filter = reactive({
  blog_category_id: undefined as undefined | number,
});
const localeRoute = useLocaleRoute();
const meta = reactive({
  limit: 10,
  page: 1,
  total: 0,
});
const searchQuery = useDebouncedRef("", 500);
const showFilter = ref(false);
const sort = reactive({ by: "created_at", order: "DESC" as "ASC" | "DESC" });
const toast = useToast();
const { bearer } = useToken();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  params.append("sortBy", sort.by);
  params.append("sortDir", sort.order);
  if (searchQuery.value) params.append("title", searchQuery.value);
  if (filter.blog_category_id) params.append("blog_category_id", `${filter.blog_category_id}`);
  return params.toString();
});

const { data: articles, status: onLoadData, refresh: refreshArticles } = await useFetch(
  () => `${config.public.apiBase}/blog-articles?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<BlogArticle[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

const { categories, onLoadCategories, refreshCategories } = useOptsBlogCategories();

function applyFilter() {
  Object.assign(filter, { ..._filter });
  showFilter.value = false;
}

function getDropdownActions(article: BlogArticle) {
  return [
    [
      {
        label: "View",
        icon: "i-material-symbols:visibility-outline",
        onSelect() {
          navigateTo(localeRoute(`/cms/blog/articles/${article.blog_article_id}`));
        },
      },
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          navigateTo(localeRoute(`/cms/blog/articles/${article.blog_article_id}/edit`));
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(article);
        },
      },
    ],
  ];
}

async function handleDelete(article: BlogArticle) {
  try {
    await $fetch(`${config.public.apiBase}/blog-articles/${article.blog_article_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Article deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshArticles();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete article!",
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }
}

function openFilter() {
  refreshCategories();
  Object.assign(_filter, { ...filter });
  showFilter.value = true;
}

function resetFilter() {
  Object.assign(_filter, {
    blog_category_id: undefined,
  });
}
</script>
