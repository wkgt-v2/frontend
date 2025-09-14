<template>
  <div class="space-y-6 p-6">
    <div class="flex justify-between gap-8">
      <UFormField label="Search Category">
        <UInput v-model="searchQuery" />
      </UFormField>
      <div class="flex items-end justify-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshCategory()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New Category</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="categories" :loading="onLoadData === 'pending'">
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
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Category`"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField label="Name" name="blog_category_name">
          <UInput v-model="state.blog_category_name" />
        </UFormField>
        <UFormField label="Slug" name="blog_category_slug">
          <UInput v-model="state.blog_category_slug" />
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
import type { BlogCategory } from "~/types/blog";

const column: TableColumn<BlogCategory>[] = [
  {
    accessorKey: "blog_category_id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("blog_category_id")}`,
  },
  {
    accessorKey: "blog_category_name",
    header: "Name",
  },
  {
    accessorKey: "blog_category_slug",
    header: "Slug",
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
  blog_category_name: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  blog_category_slug: v.pipe(
    v.string(),
    v.nonEmpty("This field is required."),
    v.regex(/^[a-z0-9-]+$/, "Use only lowercase letters, numbers, and dashes. No spaces."),
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
const selected = ref<BlogCategory>();
const state = reactive({
  blog_category_name: "",
  blog_category_slug: "",
});
const toast = useToast();
const { bearer } = useToken();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (searchQuery.value) params.append("blog_category_name", searchQuery.value);
  return params.toString();
});

const { data: categories, status: onLoadData, refresh: refreshCategory } = await useFetch(
  () => `${config.public.apiBase}/blog-categories?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<BlogCategory[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

function getDropdownActions(category: BlogCategory) {
  return [
    [
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          openModal(category);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(category);
        },
      },
    ],
  ];
}

async function handleDelete(category: BlogCategory) {
  try {
    await $fetch(`${config.public.apiBase}/blog-categories/${category.blog_category_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Category deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshCategory();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete category!",
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }
}

async function onSubmit(e: FormSubmitEvent<Schema>) {
  if (modal.onSubmit) return;
  modal.onSubmit = true;

  try {
    await $fetch(`${config.public.apiBase}/blog-categories${selected.value ? "/" + selected.value.blog_category_id : ""}`, {
      headers: { ...bearer },
      method: selected.value ? "PUT" : "POST",
      body: e.data,
    });

    toast.add({
      title: `Category ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => {
      refreshCategory();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to ${modal.type === "add" ? "create" : "update"} category!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

async function openModal(category?: BlogCategory) {
  selected.value = category;

  Object.assign(state, {
    blog_category_name: category?.blog_category_name || "",
    blog_category_slug: category?.blog_category_slug || "",
  });

  modal.type = category ? "edit" : "add";
  modal.open = true;
}
</script>
