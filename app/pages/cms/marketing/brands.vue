<template>
  <div class="space-y-6 p-6">
    <div class="flex not-sm:flex-col justify-between gap-4 sm:gap-8">
      <UFormField label="Search by name">
        <UInput v-model="searchQuery" />
      </UFormField>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshBrands()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New Brand</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="brands" :loading="onLoadData === 'pending'">
        <template #sm_icon-cell="{ row }">
          <ImageViewer :src="row.original.sm_icon" class="size-20" />
        </template>
        <template #url-cell="{ row }">
          <UButton
            :to="row.original.sm_url"
            target="_blank"
            variant="link"
            :label="row.original.sm_url"
          />
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
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Brand`"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField label="Name" name="sm_name">
          <UInput v-model="state.sm_name" />
        </UFormField>
        <UFormField label="Icon" name="sm_icon">
          <FileUpload v-model="state.sm_icon" />
        </UFormField>
        <UFormField label="URL" name="sm_url">
          <UInput v-model="state.sm_url" />
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
import type { Brand } from "~/types/marketing";

const column: TableColumn<Brand>[] = [
  {
    accessorKey: "sm_icon",
    header: "Logo",
    meta: {
      class: {
        td: "w-28",
      },
    },
  },
  {
    accessorKey: "sm_name",
    header: "Name",
  },
  {
    accessorKey: "sm_url",
    header: "URL",
    id: "url",
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
  sm_name: vRequired(),
  sm_icon: vImage(),
  sm_url: v.pipe(
    v.string(),
    v.nonEmpty("This field is required."),
    v.url("Please enter a valid URL.")
  )
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
const selected = ref<Brand>();
const state = reactive({
  sm_name: "",
  sm_icon: undefined,
  sm_url: "",
});
const toast = useToast();
const { bearer } = useToken();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  params.append("sm_type", "brand");
  if (searchQuery.value) params.append("sm_name", searchQuery.value);
  return params.toString();
});

const { data: brands, status: onLoadData, refresh: refreshBrands } = await useFetch(
  () => `${config.public.apiBase}/social-medias?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<Brand[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

function getDropdownActions(brand: Brand) {
  return [
    [
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          openModal(brand);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(brand);
        },
      },
    ],
  ];
}

async function handleDelete(brand: Brand) {
  try {
    await $fetch(`${config.public.apiBase}/social-medias/${brand.sm_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Brand deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshBrands();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete brand!",
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
    const body = new FormData();
    body.append("sm_type", "brand");
    for (const key in e.data) {
      const value = e.data[key as keyof typeof e.data];
      if (key === "sm_icon" && typeof value === "string") continue;
      if (value) body.append(key, value);
    }
    await $fetch(`${config.public.apiBase}/social-medias${selected.value ? "/" + selected.value.sm_id : ""}`, {
      headers: { ...bearer },
      method: selected.value ? "PUT" : "POST",
      body,
    });

    toast.add({
      title: `Brand ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => {
      refreshBrands();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to ${modal.type === "add" ? "create" : "update"} brand!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

async function openModal(brand?: Brand) {
  selected.value = brand;

  Object.assign(state, {
    sm_name: brand?.sm_name || "",
    sm_icon: brand?.sm_icon,
    sm_url: brand?.sm_url || "",
  });

  modal.type = brand ? "edit" : "add";
  modal.open = true;
}
</script>
