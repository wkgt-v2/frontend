<template>
  <div class="space-y-6 p-6">
    <div class="flex not-sm:flex-col justify-between gap-4 sm:gap-8">
      <UFormField label="Search by name">
        <UInput v-model="searchQuery" />
      </UFormField>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshSettings()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New Setting</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="settings" :loading="onLoadData === 'pending'">
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
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Setting`"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField label="Name" name="company_setting_name">
          <USelectMenu v-model="state.company_setting_name" :items="OPTS_COMPANY_SETTINGS" value-key="value" />
        </UFormField>
        <UFormField label="Value" name="company_setting_value">
          <Textarea v-model="state.company_setting_value" :rows="2" />
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
import type { CompanySetting } from "~/types";

const column: TableColumn<CompanySetting>[] = [
  {
    accessorKey: "company_setting_name",
    header: "Name",
    cell: ({ row }) => (
      OPTS_COMPANY_SETTINGS.find(s => s.value === row.original.company_setting_name)?.label
        || row.original.company_setting_name
    )
  },
  {
    accessorKey: "company_setting_value",
    header: "Value",
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
  company_setting_name: vRequiredStringSelect(),
  company_setting_value: vRequired(),
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
const selected = ref<CompanySetting>();
const state = reactive({
  company_setting_name: undefined,
  company_setting_value: "",
});
const toast = useToast();
const { bearer } = useToken();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (searchQuery.value) params.append("company_setting_name", searchQuery.value);
  return params.toString();
});

const { data: settings, status: onLoadData, refresh: refreshSettings } = await useFetch(
  () => `${config.public.apiBase}/company-settings?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<CompanySetting[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

function getDropdownActions(setting: CompanySetting) {
  return [
    [
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          openModal(setting);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(setting);
        },
      },
    ],
  ];
}

async function handleDelete(setting: CompanySetting) {
  try {
    await $fetch(`${config.public.apiBase}/company-settings/${setting.company_setting_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Setting deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshSettings();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete setting!",
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
    await $fetch(`${config.public.apiBase}/company-settings${selected.value ? "/" + selected.value.company_setting_id : ""}`, {
      headers: { ...bearer },
      method: selected.value ? "PUT" : "POST",
      body: e.data,
    });

    toast.add({
      title: `Setting ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => {
      refreshSettings();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to ${modal.type === "add" ? "create" : "update"} setting!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

async function openModal(setting?: CompanySetting) {
  selected.value = setting;

  Object.assign(state, {
    company_setting_name: setting?.company_setting_name,
    company_setting_value: setting?.company_setting_value || "",
  });

  modal.type = setting ? "edit" : "add";
  modal.open = true;
}
</script>
