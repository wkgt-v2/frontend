<template>
  <div class="space-y-6 p-6">
    <div class="flex justify-between gap-8">
      <UFormField label="Search Series">
        <UInput v-model="searchQuery" />
      </UFormField>
      <div class="flex items-end justify-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshSeries()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New Series</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="series" :loading="onLoadData === 'pending'">
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
      <UPagination v-model:page="meta.page" :total="meta.total" />
    </div>
  </div>

  <UModal
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Series`"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField label="Name" name="series_name">
          <UInput v-model="state.series_name" />
        </UFormField>
        <UFormField label="Code" name="series_code">
          <UInput v-model="state.series_code" />
        </UFormField>
        <UFormField label="Category" name="category_id">
          <USelectMenu
            v-model="state.category_id"
            :items="categories"
            value-key="value"
            :loading="onLoadCategories === 'pending'"
          />
        </UFormField>

        <div class="flex justify-end gap-4">
          <UButton
            variant="outline"
            :class="{ 'pointer-events-none': modal.onSubmit }"
            :disabled="modal.onSubmit"
            @click="modal.open = false"
          >
            Cancel
          </UButton>
          <UButton type="submit" :loading="modal.onSubmit">
            {{ modal.type === "add" ? "Create" : "Save" }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as v from "valibot";
import type { FetchError } from "ofetch";
import type { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import type { HttpError, HttpSuccessWithPagination } from "~/types/http";
import type { Series } from "~/types/product";

const column: TableColumn<Series>[] = [
  {
    accessorKey: "series_id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("series_id")}`,
  },
  {
    accessorKey: "series_name",
    header: "Name",
  },
  {
    accessorKey: "series_code",
    header: "Code",
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

const schema = v.object({
  series_name: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  series_code: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  category_id: v.pipe(
    v.union([v.number(), v.nullish(v.number())]),
    v.number("This field is required.")
  ),
});
type Schema = v.InferOutput<typeof schema>;

const config = useRuntimeConfig();
const meta = reactive({
  limit: 10,
  page: 1,
  total: 0,
});
const modal = reactive({
  onSubmit: false,
  open: false,
  type: "add" as "add" | "edit",
});
const searchQuery = useDebouncedRef("", 500);
const selected = ref<Series>();
const state = reactive({
  series_name: "",
  series_code: "",
  category_id: undefined,
});
const toast = useToast();
const { bearer } = useToken();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (searchQuery.value) params.append("series_name", searchQuery.value);
  return params.toString();
});

const { data: series, status: onLoadData, refresh: refreshSeries } = await useFetch(
  () => `${config.public.apiBase}/series?${params.value}`,
  {
    transform: (value: HttpSuccessWithPagination<Series[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

const { categories, onLoadCategories, refreshCategories } = useOptsCategories();

function getDropdownActions(series: Series) {
  return [
    [
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          openModal(series);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(series);
        },
      },
    ],
  ];
}

async function handleDelete(series: Series) {
  try {
    await $fetch(`${config.public.apiBase}/series/${series.series_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Series deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshSeries();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete series!",
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }
}

async function onSubmit(e: FormSubmitEvent<Schema>) {
  if (!modal.onSubmit) {
    modal.onSubmit = true;

    try {
      await $fetch(`${config.public.apiBase}/series${selected.value ? "/" + selected.value.series_id : ""}`, {
        headers: { ...bearer },
        method: selected.value ? "PUT" : "POST",
        body: e.data,
      });

      toast.add({
        title: `Series ${modal.type === "add" ? "created" : "updated"} successfully!`,
        color: "success",
        icon: "i-heroicons-check-circle",
      });
      modal.open = false;
      setTimeout(() => {
        refreshSeries();
      }, 100);
    } catch (error) {
      console.log(error)
      const e = error as FetchError<HttpError>;
      toast.add({
        title: `Failed to ${modal.type === "add" ? "create" : "update"} series!`,
        description: e.data?.message,
        color: "error",
        icon: "i-heroicons-exclamation-circle",
        duration: 0,
      });
    }

    modal.onSubmit = false;
  }
}

function openModal(series?: Series) {
  selected.value = series;
  refreshCategories();

  Object.assign(state, {
    series_name: series?.series_name || "",
    series_code: series?.series_code || "",
    category_id: series?.category_id || undefined,
  });

  modal.type = series ? "edit" : "add";
  modal.open = true;
}
</script>
