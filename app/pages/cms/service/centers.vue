<template>
  <div class="space-y-6 p-6">
    <div class="flex sm:justify-between gap-4 sm:gap-8">
      <UButton icon="i-material-symbols:tune" @click="openFilter">Filter</UButton>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshServiceCenters()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New Service center</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="serviceCenters" :loading="onLoadData === 'pending'">
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
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Service Center`"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField label="Province" name="province">
          <UInput v-model="state.province" />
        </UFormField>
        <UFormField label="City" name="city">
          <UInput v-model="state.city" />
        </UFormField>
        <UFormField label="Address" name="address">
          <Textarea v-model="state.address" :rows="2" />
        </UFormField>
        <UFormField label="Phone" name="phone">
          <UInput v-model="state.phone" />
        </UFormField>
        <div class="grid sm:grid-cols-2 gap-4">
          <UFormField
            label="Open Hour"
            name="open_hour"
          >
            <Timepicker v-model="state.open_hour" />
          </UFormField>
          <UFormField
            label="Closed Hour"
            name="closed_hour"
          >
            <Timepicker v-model="state.closed_hour" />
          </UFormField>
        </div>

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

  <UModal
    title="Filter"
    v-model:open="showFilter"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-6">
        <UFormField label="Province" name="province">
          <UInput v-model="_filter.province" />
        </UFormField>
        <UFormField label="City" name="city">
          <UInput v-model="_filter.city" />
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
import * as v from "valibot";
import type { FetchError } from "ofetch";
import type { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import type { HttpError, HttpSuccessWithPagination } from "~/types/http";
import type { ServiceCenter } from "~/types";

interface FilterData {
  province: string;
  city: string;
}

const column: TableColumn<ServiceCenter>[] = [
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => `${row.original.city}, ${row.original.province}`,
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "open_hour",
    header: "Business Hour",
    cell: ({ row }) => `${row.original.open_hour} - ${row.original.closed_hour}`,
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
  province: vRequired(),
  city: vRequired(),
  address: vRequired(),
  phone: vRequired(),
  open_hour: vRequired(),
  closed_hour: vRequired(),
});
type Schema = v.InferOutput<typeof schema>;

const _filter = reactive<FilterData>({
  province: "",
  city: "",
});
const config = useRuntimeConfig();
const filter = reactive<FilterData>({
  province: "",
  city: "",
});
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
const selected = ref<ServiceCenter>();
const showFilter = ref(false);
const state = reactive({
  province: "",
  city: "",
  address: "",
  phone: "",
  open_hour: "",
  closed_hour: "",
});
const toast = useToast();
const { bearer } = useToken();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (filter.province) params.append("province", `${filter.province}`);
  if (filter.city) params.append("city", `${filter.city}`);
  return params.toString();
});

const { data: serviceCenters, status: onLoadData, refresh: refreshServiceCenters } = await useFetch(
  () => `${config.public.apiBase}/headquarters?${params.value}`,
  {
    transform: (value: HttpSuccessWithPagination<ServiceCenter[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

function applyFilter() {
  Object.assign(filter, { ..._filter });
  showFilter.value = false;
}

function getDropdownActions(serviceCenter: ServiceCenter) {
  return [
    [
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          openModal(serviceCenter);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(serviceCenter);
        },
      },
    ],
  ];
}

async function handleDelete(serviceCenter: ServiceCenter) {
  try {
    await $fetch(`${config.public.apiBase}/headquarters/${serviceCenter.headquarter_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Service center deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshServiceCenters();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete service center!",
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
    await $fetch(`${config.public.apiBase}/headquarters${selected.value ? "/" + selected.value.headquarter_id : ""}`, {
      headers: { ...bearer },
      method: selected.value ? "PUT" : "POST",
      body: e.data,
    });

    toast.add({
      title: `Service center ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => {
      refreshServiceCenters();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to ${modal.type === "add" ? "create" : "update"} service center!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

function openFilter() {
  Object.assign(_filter, { ...filter });
  showFilter.value = true;
}

function openModal(serviceCenter?: ServiceCenter) {
  selected.value = serviceCenter;

  Object.assign(state, {
    province: serviceCenter?.province || "",
    city: serviceCenter?.city || "",
    address: serviceCenter?.address || "",
    phone: serviceCenter?.phone || "",
    open_hour: serviceCenter?.open_hour || "08:00",
    closed_hour: serviceCenter?.closed_hour || "17:00",
  });

  modal.type = serviceCenter ? "edit" : "add";
  modal.open = true;
}

function resetFilter() {
  Object.assign(_filter, {
    province: "",
    city: "",
  });
}
</script>
