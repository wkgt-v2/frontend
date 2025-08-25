<template>
  <div class="space-y-6 p-6">
    <div class="flex justify-end gap-4">
      <ClientOnly>
        <UTooltip text="If the list is not updated, click this to refresh the data">
          <UButton :loading="onLoadData === 'pending'" @click="refreshSeries()">
            Refresh
          </UButton>
        </UTooltip>
      </ClientOnly>
      <UButton @click="openModal()">Create New Series</UButton>
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
          <USelect v-model="state.category_id" :loading="onLoadCategories === 'pending'" :items="categories" />
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
import type { HttpError, HttpSuccess } from "~/types/http";
import type { Category, Series } from "~/types/product";

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
    accessorKey: "category_id",
    header: "Category ID",
  },
  {
    id: "action",
  },
];

const schema = v.object({
  series_name: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  series_code: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  category_id: v.pipe(v.number(), v.integer("This field is required.")),
});
type Schema = v.InferOutput<typeof schema>;

const config = useRuntimeConfig();
const modal = reactive({
  onSubmit: false,
  open: false,
  type: "add" as "add" | "edit",
});
const selected = ref<Series>();
const state = reactive({
  series_name: "",
  series_code: "",
  category_id: undefined,
});
const toast = useToast();

const { data: series, status: onLoadData, refresh: refreshSeries } = await useFetch(`${config.public.apiBase}/series`, {
  transform: (value: HttpSuccess<Series[]>) => {
    return value.data;
  },
});

const { data: categories, status: onLoadCategories, refresh: refreshCategories } = await useFetch(`${config.public.apiBase}/categories`, {
  transform: (value: HttpSuccess<Category[]>) => {
    return value.data.map(c => {
      return {
        label: c.category_name,
        value: c.category_id,
      };
    });
  },
});

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
