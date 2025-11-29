<template>
  <div class="space-y-6 p-6">
    <div class="flex not-sm:flex-col justify-between gap-4 sm:gap-8">
      <div class="flex items-end gap-4">
        <UFormField label="Search by name">
          <UInput v-model="searchQuery" />
        </UFormField>
        <UButton icon="i-material-symbols:tune" @click="openFilter" />
      </div>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshItems()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton :to="$localePath('cms-product-items-new')">Create New Item</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="columns" :data="items" :loading="onLoadData === 'pending'">
        <template #product_name-header>
          <CmsTableHeader label="Name" value="product_name" v-model:by="sort.by" v-model:order="sort.order" />
        </template>
        <template #product_code-header>
          <CmsTableHeader label="Code" value="product_code" v-model:by="sort.by" v-model:order="sort.order" />
        </template>
        <template #images-cell="{ row }">
          <ImageViewer v-if="getThumbnail(row.original)" :src="getThumbnail(row.original)!" class="size-20" />
          <span v-else>-</span>
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
        <UFormField label="Category" name="category_id">
          <USelectMenu
            v-model="_filter.category_id"
            value-key="value"
            :items="categories"
            :loading="onLoadCategories === 'pending'"
          />
        </UFormField>
        <UFormField label="Series" name="series_id">
          <USelectMenu
            v-model="_filter.series_id"
            :items="series"
            value-key="value"
            :placeholder="`${!_filter.category_id ? 'Please choose product category first' : ''}`"
            :disabled="!_filter.category_id"
            :loading="onLoadSeries === 'pending'"
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
import type { Item } from "~/types/product";

const columns: TableColumn<Item>[] = [
  {
    accessorKey: "images",
    header: "Image",
    meta: {
      class: {
        td: "w-28",
      },
    },
  },
  {
    accessorKey: "product_name",
  },
  {
    accessorKey: "product_code",
  },
  {
    accessorKey: "series",
    header: "Series",
    cell: ({ row }) => row.original.series?.series_name || "-",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.category_name || "-",
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
  category_id: undefined as undefined | number,
  series_id: undefined as undefined | number,
});
const config = useRuntimeConfig();
const filter = reactive({
  category_id: undefined as undefined | number,
  series_id: undefined as undefined | number,
});
const localeRoute = useLocaleRoute();
const meta = reactive({
  limit: 10,
  page: 1,
  total: 0,
});
const searchQuery = useDebouncedRef("", 500);
const sort = reactive({ by: "created_at", order: "DESC" as "ASC" | "DESC" });
const showFilter = ref(false);
const toast = useToast();
const { bearer } = useToken();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  params.append("sortBy", sort.by);
  params.append("sortDir", sort.order);
  if (searchQuery.value) params.append("product_name", searchQuery.value);
  if (filter.category_id) params.append("category_id", `${filter.category_id}`);
  if (filter.series_id) params.append("series_id", `${filter.series_id}`);
  return params.toString();
});

const { data: items, status: onLoadData, refresh: refreshItems } = await useFetch(
  () => `${config.public.apiBase}/products?${params.value}`,
  {
    transform: (value: HttpSuccessWithPagination<Item[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

const { categories, onLoadCategories, refreshCategories } = useOptsCategories();
const { series, onLoadSeries } = useOptsSeries(toRef(() => {
  return { category_id: _filter.category_id };
}));

watch(() => _filter.category_id, () => _filter.series_id = undefined);

function applyFilter() {
  Object.assign(filter, { ..._filter });
  showFilter.value = false;
}

function getDropdownActions(item: Item) {
  return [
    [
      {
        label: "View",
        icon: "i-material-symbols:visibility-outline",
        onSelect() {
          navigateTo(localeRoute(`/cms/product/items/${item.product_id}`));
        },
      },
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          navigateTo(localeRoute(`/cms/product/items/${item.product_id}/edit`));
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(item);
        },
      },
    ],
  ];
}

function getThumbnail(item: Item) {
  const thumbnail = item.images.find(i => i.is_main) || item.images[0];
  return thumbnail?.image_url;
}

async function handleDelete(item: Item) {
  try {
    await $fetch(`${config.public.apiBase}/products/${item.product_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Item deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshItems();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete item!",
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
    category_id: undefined,
    series_id: undefined,
  });
}
</script>
