<template>
  <div class="space-y-6 p-6">
    <div class="flex justify-between gap-8">
      <UFormField label="Search Service Order">
        <UInput v-model="searchQuery" />
      </UFormField>
      <div class="flex items-end justify-end gap-4 *:h-fit">
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
        <UFormField label="Product" name="product_id" class="space-y-4">
          <!-- <div class="flex gap-4">
            <USelectMenu
              v-model="form.category_id"
              :items="categories"
              value-key="value"
              :loading="onLoadCategories === 'pending'"
            />
            <USelectMenu
              v-model="form.series_id"
              :items="series"
              value-key="value"
              :loading="onLoadSeries === 'pending'"
            />
          </div> -->
          <USelectMenu
            v-model="state.product_id"
            :items="products"
            value-key="value"
            :loading="onLoadProducts === 'pending'"
            @update:search-term="(val) => productsSearchQuery = val"
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
          <USelect v-model="state.status" :items="SERVICE_ORDER_STATUS" />
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
import type { Category, Item, Series } from "~/types/product";

const column: TableColumn<ServiceOrder>[] = [
  {
    accessorKey: "no_resi",
    header: "No. Resi",
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
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => `${row.original.product.product_code} - ${row.original.product.product_name}`,
  },
  {
    accessorKey: "status",
    header: "Status",
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
  no_resi: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  product_id: v.pipe(
    v.union([v.number(), v.nullish(v.number())]),
    v.number("This field is required.")
  ),
  customer_name: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  customer_phone: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  start_date: v.pipe(
    v.union([v.string(), v.nullish(v.string())]),
    v.string("This field is required.")
  ),
  status: v.pipe(v.string(), v.nonEmpty("This field is required.")),
  description: v.pipe(v.string(), v.nonEmpty("This field is required.")),
});
type Schema = v.InferOutput<typeof schema>;

const { bearer } = useToken();
const config = useRuntimeConfig();
// const form = reactive({
//   category_id: undefined,
//   series_id: undefined,
// });
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
const productsSearchQuery = useDebouncedRef("", 500);
const searchQuery = useDebouncedRef("", 500);
const selected = ref<ServiceOrder>();
const state = reactive({
  no_resi: "",
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
  if (searchQuery.value) params.append("category_name", searchQuery.value);
  return params.toString();
});

const productsParams = computed(() => {
  const params = new URLSearchParams();
  params.append("limit", "9999");
  // if (productsSearchQuery.value) params.append("product_name", productsSearchQuery.value);
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

// const { data: categories, status: onLoadCategories, refresh: refreshCategories } = await useFetch(
//   () => `${config.public.apiBase}/categories?limit=9999`,
//   {
//     transform: (value: HttpSuccessWithPagination<Category[]>) => {
//       return value.data.data.map(c => {
//         return {
//           label: c.category_name,
//           value: c.category_id,
//         };
//       });
//     },
//   }
// );

// const { data: series, status: onLoadSeries, refresh: refreshSeries } = await useFetch(
//   () => `${config.public.apiBase}/series`,
//   {
//     params: {
//       category_id: form.category_id,
//       limit: 9999,
//     },
//     transform: (value: HttpSuccessWithPagination<Series[]>) => {
//       return value.data.data.map(s => {
//         return {
//           label: s.series_name,
//           value: s.series_id,
//         };
//       });
//     },
//     watch: [() => form.category_id],
//   }
// );

const { data: products, status: onLoadProducts, refresh: refreshProducts } = await useFetch(
  () => `${config.public.apiBase}/products?${productsParams.value}`,
  {
    transform: (value: HttpSuccessWithPagination<Item[]>) => {
      return value.data.data.map(i => {
        return {
          label: i.product_name,
          value: i.product_id,
        };
      });
    },
    watch: [() => productsSearchQuery.value],
  }
);

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

  Object.assign(state, {
    no_resi: serviceOrder?.no_resi || "",
    product_id: serviceOrder?.product_id || undefined,
    customer_name: serviceOrder?.customer_name || "",
    customer_phone: serviceOrder?.customer_phone || "",
    start_date: serviceOrder?.start_date || undefined,
    status: serviceOrder?.status || "",
    description: serviceOrder?.description || "",
  });
  productsSearchQuery.value = "";

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
