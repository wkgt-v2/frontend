<template>
  <div class="space-y-6 p-6">
    <div class="flex not-sm:flex-col justify-between gap-4 sm:gap-8">
      <UFormField label="Search by title">
        <UInput v-model="searchQuery" />
      </UFormField>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshBanners()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New Banner</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="banners" :loading="onLoadData === 'pending'">
        <template #banner_image-cell="{ row }">
          <ImageViewer :src="row.original.banner_image" class="size-20" />
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
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Banner`"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField label="Name" name="banner_title">
          <UInput v-model="state.banner_title" />
        </UFormField>
        <UFormField label="Image" name="banner_image">
          <FileUpload v-model="state.banner_image" />
        </UFormField>
        <UFormField label="URL" name="banner_url">
          <UInput v-model="state.banner_url" />
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
import type { Banner } from "~/types/marketing";

const column: TableColumn<Banner>[] = [
  {
    accessorKey: "banner_image",
    header: "Image",
    meta: {
      class: {
        td: "w-28",
      },
    },
  },
  {
    accessorKey: "banner_title",
    header: "Title",
  },
  {
    accessorKey: "banner_url",
    header: "URL",
    cell: ({ row }) => row.original.banner_url || "-",
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
  banner_title: vRequired(),
  banner_image: vImage(),
  banner_url: v.union([
    v.literal(""),
    v.pipe(
      v.string(),
      v.url("Please enter a valid URL.")
    )
  ]),
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
const selected = ref<Banner>();
const state = reactive({
  banner_title: "",
  banner_image: undefined,
  banner_url: "",
});
const toast = useToast();
const { bearer } = useToken();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (searchQuery.value) params.append("banner_title", searchQuery.value);
  return params.toString();
});

const { data: banners, status: onLoadData, refresh: refreshBanners } = await useFetch(
  () => `${config.public.apiBase}/banners?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<Banner[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

function getDropdownActions(banner: Banner) {
  return [
    [
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          openModal(banner);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(banner);
        },
      },
    ],
  ];
}

async function handleDelete(banner: Banner) {
  try {
    await $fetch(`${config.public.apiBase}/banners/${banner.banner_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Banner deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshBanners();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete banner!",
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
    for (const key in e.data) {
      const value = e.data[key as keyof typeof e.data];
      if (key === "banner_image" && typeof value === "string") continue;
      if (value) body.append(key, value);
    }

    await $fetch(`${config.public.apiBase}/banners${selected.value ? "/" + selected.value.banner_id : ""}`, {
      headers: { ...bearer },
      method: selected.value ? "PUT" : "POST",
      body
    });

    toast.add({
      title: `Banner ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => {
      refreshBanners();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to ${modal.type === "add" ? "create" : "update"} banner!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

async function openModal(banner?: Banner) {
  selected.value = banner;

  Object.assign(state, {
    banner_title: banner?.banner_title || "",
    banner_image: banner?.banner_image,
    banner_url: banner?.banner_url || "",
  });

  modal.type = banner ? "edit" : "add";
  modal.open = true;
}
</script>
