<template>
  <div class="space-y-6 p-6">
    <div class="flex not-sm:flex-col justify-between gap-4 sm:gap-8">
      <UFormField label="Search by no. resi">
        <UInput v-model="searchQuery" />
      </UFormField>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refresh()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New Service Order</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="data" :loading="onLoadData === 'pending'">
        <template #no_resi-header>
          <CmsTableHeader label="No. Resi" value="no_resi" v-model:by="sort.by" v-model:order="sort.order" />
        </template>
        <template #customer_name-header>
          <CmsTableHeader label="Customer Name" value="customer_name" v-model:by="sort.by" v-model:order="sort.order" />
        </template>
        <template #start_date-header>
          <CmsTableHeader label="Start Date" value="start_date" v-model:by="sort.by" v-model:order="sort.order" />
        </template>
        <template #status-header>
          <CmsTableHeader label="Status" value="status" v-model:by="sort.by" v-model:order="sort.order" />
        </template>
        <template #status-cell="{ row }">
          <UBadge :label="parseStatus(row.original).label" :color="parseStatus(row.original).color" />
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
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Service Order`"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit" @error="(e) => console.log(e)">
        <UFormField label="No. Resi" name="no_resi">
          <UInput v-model="state.no_resi" />
        </UFormField>
        <div class="grid sm:grid-cols-2 gap-4">
          <UFormField label="Product Category" name="category_id">
            <USelectMenu
              v-model="state.category_id"
              :items="categories"
              value-key="value"
              :loading="onLoadCategories === 'pending'"
            />
          </UFormField>
          <UFormField label="Product Series" name="series_id">
            <USelectMenu
              v-model="state.series_id"
              :items="series"
              value-key="value"
              :placeholder="`${!state.category_id ? 'Please choose product category first' : ''}`"
              :loading="onLoadSeries === 'pending'"
              :disabled="!state.category_id"
            />
          </UFormField>
        </div>
        <UFormField label="Product Item" name="product_id">
          <USelectMenu
            v-model="state.product_id"
            :items="products"
            value-key="value"
            :placeholder="`${!state.series_id ? 'Please choose product series first' : ''}`"
            :loading="onLoadProducts === 'pending'"
            :disabled="!state.series_id"
          />
        </UFormField>
        <UFormField label="Customer Name" name="customer_name">
          <UInput v-model="state.customer_name" />
        </UFormField>
        <UFormField label="Customer Phone" name="customer_phone">
          <UInput v-model="state.customer_phone" @input="inputFormatNumber" />
        </UFormField>
        <UFormField label="Start Date" name="start_date">
          <Datepicker v-model="state.start_date" />
        </UFormField>
        <UFormField label="Status" name="status">
          <USelect v-model="state.status" :items="OPTS_SERVICE_ORDER_STATUS" />
        </UFormField>
        <UFormField label="Description" name="description">
          <Textarea v-model="state.description" :rows="4" />
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
import type { ServiceOrder } from "~/types";

const column: TableColumn<ServiceOrder>[] = [
  {
    accessorKey: "no_resi",
  },
  {
    accessorKey: "customer_name",
    header: "Customer Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "start_date",
    cell: ({ row }) => {
      return new Date(row.original.start_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => (
      row.original.product ? `${row.original.product.product_code} - ${row.original.product.product_name}` : "-"
    ),
  },
  {
    accessorKey: "status",
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
  no_resi: vRequired(),
  category_id: vRequiredSelect(),
  series_id: vRequiredSelect(),
  product_id: vRequiredSelect(),
  customer_name: vRequired(),
  customer_phone: vRequired(),
  start_date: vRequiredStringSelect(),
  status: vRequired(),
  description: vRequired(),
});
type Schema = v.InferOutput<typeof schema>;

const { bearer } = useToken();
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
const selected = ref<ServiceOrder>();
const sort = reactive({ by: "created_at", order: "DESC" as "ASC" | "DESC" });
const state = reactive({
  no_resi: "",
  category_id: undefined,
  series_id: undefined,
  product_id: undefined,
  customer_name: "",
  customer_phone: "",
  start_date: undefined,
  status: "",
  description: "",
});
const toast = useToast();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  params.append("sortBy", sort.by);
  params.append("sortDir", sort.order);
  if (searchQuery.value) params.append("no_resi", searchQuery.value);
  return params.toString();
});

const { data, status: onLoadData, refresh } = await useFetch(
  () => `${config.public.apiBase}/service-orders?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<ServiceOrder[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

const { categories, onLoadCategories, refreshCategories } = useOptsCategories();
const { series, onLoadSeries } = useOptsSeries(toRef(() => {
  return { category_id: state.category_id };
}));
const { products, onLoadProducts } = useOptsProducts(toRef(() => {
  return { category_id: state.category_id, series_id: state.series_id };
}));

watch(() => series.value, (val) => {
  if (!val || !state.series_id) return;
  if (!val?.find(s => s.value === state.series_id)) state.series_id = undefined;
});
watch(() => products.value, (val) => {
  if (!val || !state.product_id) return;
  if (!val?.find(s => s.value === state.product_id)) state.product_id = undefined;
});

function getDropdownActions(serviceOrder: ServiceOrder) {
  return [
    [
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          openModal(serviceOrder);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(serviceOrder);
        },
      },
    ],
  ];
}

async function handleDelete(serviceOrder: ServiceOrder) {
  try {
    await $fetch(`${config.public.apiBase}/service-orders/${serviceOrder.service_order_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Service order deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refresh();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete service order!",
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
    await $fetch(`${config.public.apiBase}/service-orders${selected.value ? "/" + selected.value.service_order_id : ""}`, {
      headers: { ...bearer },
      method: selected.value ? "PUT" : "POST",
      body: e.data
    });

    toast.add({
      title: `Service order ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => {
      refresh();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to ${modal.type === "add" ? "create" : "update"} Service order!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

async function openModal(serviceOrder?: ServiceOrder) {
  selected.value = serviceOrder;
  refreshCategories();

  Object.assign(state, {
    no_resi: serviceOrder?.no_resi || "",
    category_id: serviceOrder?.product?.category?.category_id,
    series_id: serviceOrder?.product?.series?.series_id,
    product_id: serviceOrder?.product_id,
    customer_name: serviceOrder?.customer_name || "",
    customer_phone: serviceOrder?.customer_phone || "",
    start_date: serviceOrder?.start_date,
    status: serviceOrder?.status || "",
    description: serviceOrder?.description || "",
  });

  modal.type = serviceOrder ? "edit" : "add";
  modal.open = true;
}

function parseStatus(serviceOrder: ServiceOrder): { label: string; color: "info" | "success" | "error" | "neutral"; } {
  switch (serviceOrder.status) {
    case "in_progress":
      return { label: "In Progress", color: "info" };
    case "completed":
      return { label: "Completed", color: "success" };
    case "cancelled":
      return { label: "Cancelled", color: "error" };
    default:
      return { label: "Pending", color: "neutral" };
  }
}
</script>
