<template>
  <div class="space-y-6 p-6">
    <div class="flex not-sm:flex-col justify-between gap-4 sm:gap-8">
      <UFormField label="Search Item">
        <UInput v-model="searchQuery" />
      </UFormField>
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
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import type { TableColumn } from "@nuxt/ui";
import type { HttpError, HttpSuccessWithPagination } from "~/types/http";
import type { Item } from "~/types/product";

const columns: TableColumn<Item>[] = [
  {
    accessorKey: "product_id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("product_id")}`,
  },
  {
    accessorKey: "product_name",
    header: "Name",
  },
  {
    accessorKey: "product_code",
    header: "Code",
  },
  // {
  //   accessorKey: "images",
  //   header: "Image",
  // },
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
  // {
  //   accessorKey: "product_marketplace",
  //   header: "Marketplace",
  // },
  {
    id: "action",
    meta: {
      class: {
        td: "w-16 text-right",
      },
    },
  },
];

const config = useRuntimeConfig();
const localeRoute = useLocaleRoute();
const meta = reactive({
  limit: 10,
  page: 1,
  total: 0,
});
const searchQuery = useDebouncedRef("", 500);
const toast = useToast();
const { bearer } = useToken();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (searchQuery.value) params.append("product_name", searchQuery.value);
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
</script>
