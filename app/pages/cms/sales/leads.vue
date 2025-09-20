<template>
  <div class="space-y-6 p-6">
    <div class="flex not-sm:flex-col justify-between gap-4 sm:gap-8">
      <UFormField label="Search Lead by Customer Name">
        <UInput v-model="searchQuery" />
      </UFormField>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshLeads()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New Lead</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="leads" :loading="onLoadData === 'pending'">
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
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Lead`"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField label="Date In" name="date_in">
          <Datepicker v-model="state.date_in" />
        </UFormField>
        <UFormField label="Lead Source" name="lead_source">
          <UInput v-model="state.lead_source" />
        </UFormField>
        <UFormField label="Customer Name" name="customer_name">
          <UInput v-model="state.customer_name" />
        </UFormField>
        <UFormField label="Contact Person" name="contact_person">
          <UInput v-model="state.contact_person" />
        </UFormField>
        <UFormField label="Customer Phone" name="phone">
          <UInput v-model="state.phone" @input="inputFormatNumber" />
        </UFormField>
        <UFormField label="Address" name="address">
          <Textarea v-model="state.address" :rows="2" />
        </UFormField>
        <UFormField label="Area" name="area">
          <UInput v-model="state.area" />
        </UFormField>
        <UFormField label="Category" name="category">
          <UInput v-model="state.category" />
        </UFormField>
        <UFormField label="Status" name="status">
          <USelect v-model="state.status" :items="LEAD_STATUS" />
        </UFormField>
        <UFormField v-if="isSuperadmin" label="Sales Person" name="salesperson_id">
          <USelectMenu
            v-model="state.salesperson_id"
            :items="users"
            value-key="value"
            :loading="onLoadUsers === 'pending'"
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
import type { Lead } from "~/types/sales";
import { LEAD_STATUS } from "~/utils";

const isSuperadmin = useSuperadmin();

const column: TableColumn<Lead>[] = [
  {
    accessorKey: "lead_id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("lead_id")}`,
  },
  {
    accessorKey: "customer_name",
    header: "Customer Name",
  },
  {
    accessorKey: "salesperson",
    header: "Sales Person",
    meta: {
      class: {
        th: isSuperadmin ? "" : "hidden",
        td: isSuperadmin ? "" : "hidden",
      },
    },
    cell: ({ row }) => row.original.salesperson?.user_username || "-",
  },
  {
    accessorKey: "area",
    header: "Area",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "follow_up_date",
    header: "Follow-Up Date",
    cell: ({ row }) => row.getValue("follow_up_date") || "-",
  },
  {
    accessorKey: "last_activity",
    header: "Last Activity",
    cell: ({ row }) => row.getValue("last_activity") || "-",
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
  date_in: vRequiredStringSelect(),
  lead_source: vRequired(),
  customer_name: vRequired(),
  contact_person: vRequired(),
  phone: vRequired(),
  address: vRequired(),
  area: vRequired(),
  category: vRequired(),
  status: vRequiredStringSelect(),
  salesperson_id: vRequiredSelect(),
});
type Schema = v.InferOutput<typeof schema>;

const { bearer } = useToken();
const config = useRuntimeConfig();
const localeRoute = useLocaleRoute();
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
const selected = ref<Lead>();
const state = reactive({
  date_in: undefined,
  lead_source: "",
  customer_name: "",
  contact_person: "",
  phone: "",
  address: "",
  area: "",
  category: "",
  status: undefined,
  salesperson_id: undefined,
});
const toast = useToast();
const uid = useUid();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (searchQuery.value) params.append("customer_name", searchQuery.value);
  if (!isSuperadmin) params.append("salesperson_id", `${uid.value}`);
  return params.toString();
});

const { data: leads, status: onLoadData, refresh: refreshLeads } = await useFetch(
  () => `${config.public.apiBase}/leads?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<Lead[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

const { users, onLoadUsers, refreshUsers } = useOptsUsers();

function getDropdownActions(lead: Lead) {
  return [
    [
      {
        label: "View activities",
        icon: "i-material-symbols:visibility-outline",
        onSelect() {
          navigateTo(localeRoute(`/cms/sales/activities?lead_id=${lead.lead_id}`));
        },
      },
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          openModal(lead);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(lead);
        },
      },
    ],
  ];
}

async function handleDelete(lead: Lead) {
  try {
    await $fetch(`${config.public.apiBase}/leads/${lead.lead_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Lead deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshLeads();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete lead!",
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
    await $fetch(`${config.public.apiBase}/leads${selected.value ? "/" + selected.value.lead_id : ""}`, {
      headers: { ...bearer },
      method: selected.value ? "PUT" : "POST",
      body: e.data,
    });

    toast.add({
      title: `Lead ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => {
      refreshLeads();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to ${modal.type === "add" ? "create" : "update"} lead!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

function openModal(lead?: Lead) {
  selected.value = lead;
  refreshUsers();

  Object.assign(state, {
    date_in: lead?.date_in || undefined,
    lead_source: lead?.lead_source || "",
    customer_name: lead?.customer_name || "",
    contact_person: lead?.contact_person || "",
    phone: lead?.phone || "",
    address: lead?.address || "",
    area: lead?.area || "",
    category: lead?.category || "",
    status: lead?.status || undefined,
    salesperson_id: isSuperadmin ? (lead?.salesperson_id || undefined) : uid.value,
  });

  modal.type = lead ? "edit" : "add";
  modal.open = true;
}
</script>
