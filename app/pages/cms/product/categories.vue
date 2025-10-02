<template>
  <div class="space-y-6 p-6">
    <div class="flex not-sm:flex-col justify-between gap-4 sm:gap-8">
      <UFormField label="Search Category">
        <UInput v-model="searchQuery" />
      </UFormField>
      <div class="flex items-end gap-4 *:h-fit">
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
        <template #category_image-cell="{ row }">
          <ImageViewer :src="row.original.category_image" class="size-20" />
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
        <UFormField label="Name" name="category_name">
          <UInput v-model="state.category_name" />
        </UFormField>
        <UFormField label="Code" name="category_code">
          <UInput v-model="state.category_code" />
        </UFormField>
        <UFormField label="Description" name="category_description">
          <Textarea v-model="state.category_description" :rows="2" />
        </UFormField>
        <UFormField label="Image" name="category_image">
          <UFileUpload
            accept=".jpg,.jpeg,.png,.webp"
            class="w-full h-48"
            description="JPG, JPEG, PNG, WebP"
            v-model="state.category_image"
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
import type { Category } from "~/types/product";

const column: TableColumn<Category>[] = [
  {
    accessorKey: "category_image",
    header: "Image",
    meta: {
      class: {
        td: "w-28",
      },
    },
  },
  {
    accessorKey: "category_name",
    header: "Name",
  },
  {
    accessorKey: "category_code",
    header: "Code",
  },
  {
    accessorKey: "category_description",
    header: "Description",
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
  category_name: vRequired(),
  category_code: vRequired(),
  category_image: v.pipe(
    v.file("Please select an image file."),
    v.mimeType(
      ["image/jpeg", "image/png", "image/jpg", "image/webp"],
      "Please select a JPG, JPEG, PNG or WebP file."
    )
  ),
  category_description: vRequired(),
  // category_instruction: v.pipe(v.string()),
  // category_main: v.pipe(v.boolean()),
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
const selected = ref<Category>();
const state = reactive({
  category_name: "",
  category_code: "",
  category_image: undefined,
  category_description: "",
  // category_instruction: "",
  // category_main: true,
});
const toast = useToast();
const { bearer } = useToken();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (searchQuery.value) params.append("category_name", searchQuery.value);
  return params.toString();
});

const { data: categories, status: onLoadData, refresh: refreshCategory } = await useFetch(
  () => `${config.public.apiBase}/categories?${params.value}`,
  {
    transform: (value: HttpSuccessWithPagination<Category[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

function getDropdownActions(category: Category) {
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

async function handleDelete(category: Category) {
  try {
    await $fetch(`${config.public.apiBase}/categories/${category.category_id}`, {
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
  if (!modal.onSubmit) {
    modal.onSubmit = true;

    try {
      const body = new FormData();
      for (const key in e.data) {
        const value = e.data[key as keyof typeof e.data];
        if (key === "category_image" && typeof value === "string") continue;
        body.append(key, value);
      }
      body.append("category_instruction", "-");
      body.append("category_main", "true");

      await $fetch(`${config.public.apiBase}/categories${selected.value ? "/" + selected.value.category_id : ""}`, {
        headers: { ...bearer },
        method: selected.value ? "PUT" : "POST",
        body
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
}

async function openModal(category?: Category) {
  selected.value = category;

  let categoryImage: any = category?.category_image;
  if (categoryImage) {
    const splitted = categoryImage.split(".");
    categoryImage = await getBlobFromUrl(categoryImage, splitted[splitted!.length - 2] || `${new Date().getTime()}`);
  }

  Object.assign(state, {
    category_name: category?.category_name || "",
    category_code: category?.category_code || "",
    category_image: categoryImage,
    category_description: category?.category_description || "",
    // category_instruction: category?.category_instruction || "",
    // category_main: category?.category_main ?? true,
  });

  modal.type = category ? "edit" : "add";
  modal.open = true;
}
</script>
