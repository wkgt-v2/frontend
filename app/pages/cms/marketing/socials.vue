<template>
  <div class="space-y-6 p-6">
    <div class="flex not-sm:flex-col justify-between gap-4 sm:gap-8">
      <UFormField label="Search by name">
        <UInput v-model="searchQuery" />
      </UFormField>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshSocials()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New Social</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="socials" :loading="onLoadData === 'pending'">
        <template #icon-cell="{ row }">
          <UIcon :name="`i-${row.original.sm_icon}`" mode="svg" class="size-8" />
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
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Social`"
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
          <UInput v-model="state.sm_icon" />
          <template #help>
            To see list of supported icons, please go to
            <a href="https://icones.js.org/collection/fa7-brands" target="_blank" rel="noopener noreferrer" class="text-blue-500">this site</a>
            and copy the selected icon value such as "fa7-brands:whatsapp"
          </template>
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
import type { SocialMedia } from "~/types/marketing";

const column: TableColumn<SocialMedia>[] = [
  {
    accessorKey: "sm_icon",
    header: "Icon",
    id: "icon",
    meta: {
      class: {
        th: "w-16",
        td: "w-16",
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
  sm_icon: vRequired(),
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
const selected = ref<SocialMedia>();
const state = reactive({
  sm_name: "",
  sm_icon: "",
  sm_url: "",
});
const toast = useToast();
const { bearer } = useToken();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  params.append("sm_type", "social_media");
  if (searchQuery.value) params.append("sm_name", searchQuery.value);
  return params.toString();
});

const { data: socials, status: onLoadData, refresh: refreshSocials } = await useFetch(
  () => `${config.public.apiBase}/social-medias?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<SocialMedia[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

function getDropdownActions(social: SocialMedia) {
  return [
    [
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          openModal(social);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(social);
        },
      },
    ],
  ];
}

async function handleDelete(social: SocialMedia) {
  try {
    await $fetch(`${config.public.apiBase}/social-medias/${social.sm_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Social deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshSocials();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete social!",
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
    await $fetch(`${config.public.apiBase}/social-medias${selected.value ? "/" + selected.value.sm_id : ""}`, {
      headers: { ...bearer },
      method: selected.value ? "PUT" : "POST",
      body: {
        ...e.data,
        sm_type: "social_media"
      },
    });

    toast.add({
      title: `Social ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => {
      refreshSocials();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to ${modal.type === "add" ? "create" : "update"} social!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

function openModal(social?: SocialMedia) {
  selected.value = social;

  Object.assign(state, {
    sm_name: social?.sm_name || "",
    sm_icon: social?.sm_icon || "",
    sm_url: social?.sm_url || "",
  });

  modal.type = social ? "edit" : "add";
  modal.open = true;
}
</script>
