<template>
  <div class="space-y-6 p-6">
    <div class="flex sm:justify-between gap-4 sm:gap-8">
      <UButton icon="i-material-symbols:tune" @click="openFilter">Filter</UButton>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshOrders()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="formRef?.openModal()">Create New Order</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="orders" :loading="onLoadData === 'pending'">
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

  <CmsOrdersForm ref="form" :selected="selected" @refresh="refreshOrders" />

  <UModal
    title="Filter"
    v-model:open="showFilter"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-6">
        <UFormField v-if="isSuperadmin" label="Sales Person" name="salesperson_id">
          <USelectMenu
            v-model="_filter.salesperson_id"
            :items="users"
            value-key="value"
            :loading="onLoadUsers === 'pending'"
          />
        </UFormField>
        <UFormField label="Status" name="status">
          <USelectMenu v-model="_filter.status" :items="OPTS_ORDER_STATUS" value-key="value" />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField
            label="Start Date"
            name="start_date"
            :error="errors.start_date"
          >
            <Datepicker v-model="_filter.start_date" />
          </UFormField>
          <UFormField label="End Date" name="end_date" :error="errors.end_date">
            <Datepicker v-model="_filter.end_date" />
          </UFormField>
        </div>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton label="Cancel" variant="outline" @click="close" />
      <UButton label="Reset" variant="outline" @click="resetFilter" />
      <UButton label="Apply Filter" @click="applyFilter" />
    </template>
  </UModal>

  <UModal
    title="Order Details"
    v-model:open="showDetails"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div v-if="selected" class="grid sm:grid-cols-2 gap-4">
        <div class="space-y-1 text-sm text-tone">
          <div>Sales Person</div>
          <div class="font-medium">
            {{ selected.salesperson.user_username }}
          </div>
        </div>
        <div class="space-y-1 text-sm text-tone">
          <div>Customer Name</div>
          <div class="font-medium">
            {{ selected.lead.customer_name }}
          </div>
        </div>
        <div class="space-y-1 text-sm text-tone">
          <div>Order Date</div>
          <div class="font-medium">
            {{ selected.order_date
              ? new Date(selected.order_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "-" }}
          </div>
        </div>
        <div class="space-y-1 text-sm text-tone">
          <div>Status</div>
          <div class="font-medium">
            {{ selected.status }}
          </div>
        </div>
        <div class="space-y-1 text-sm text-tone">
          <div>Total Amount</div>
          <div class="font-medium">
            {{ formatPrice(selected.total_amount) }}
          </div>
        </div>
        <div class="space-y-1 text-sm text-tone">
          <div>Approved At</div>
          <div class="font-medium">
            {{ selected.approved_at
              ? new Date(selected.approved_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "-" }}
          </div>
        </div>
        <div class="sm:col-span-2 overflow-x-auto">
          <UTable
            :columns="itemColumn"
            :data="selected.items"
            :ui="{ th: 'py-2 px-3', td: 'py-2 px-3' }"
          />
        </div>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton label="Close" variant="outline" @click="close" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import type { TableColumn } from "@nuxt/ui";
import type { HttpError, HttpSuccessWithPagination } from "~/types/http";
import type { Order, OrderItem, OrderStatus } from "~/types/sales";

interface FilterData {
  status?: OrderStatus;
  salesperson_id?: number;
  start_date?: string;
  end_date?: string;
}

const isSuperadmin = useSuperadmin();

const column: TableColumn<Order>[] = [
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
    accessorKey: "lead",
    header: "Customer Name",
    cell: ({ row }) => row.original.lead.customer_name || "-",
  },
  {
    accessorKey: "order_date",
    header: "Order Date",
    cell: ({ row }) => {
      return new Date(row.original.order_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "total_amount",
    header: "Total Amount",
    cell: ({ row }) => formatPrice(row.original.total_amount),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "approved_at",
    header: "Approved",
    cell: ({ row }) => row.original.approved_at ? "Yes" : "-",
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
const itemColumn: TableColumn<OrderItem>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => row.original.product?.product_name || "-",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
  },
  {
    accessorKey: "price_per_item",
    header: "Price",
    cell: ({ row }) => formatPrice(`${row.original.price_per_item}`),
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) => formatPrice(`${row.original.subtotal}`),
  },
];

const _filter = reactive<FilterData>({
  status: undefined,
  salesperson_id: undefined,
  start_date: undefined,
  end_date: undefined,
});
const { bearer } = useToken();
const config = useRuntimeConfig();
const formRef = useTemplateRef("form");
const errors = reactive({
  start_date: "",
  end_date: "",
});
const filter = reactive<FilterData>({
  status: undefined,
  salesperson_id: undefined,
  start_date: undefined,
  end_date: undefined,
});
const meta = reactive({
  limit: 10,
  page: 1,
  total: 0,
});
const selected = ref<Order>();
const showDetails = ref(false);
const showFilter = ref(false);
const toast = useToast();
const uid = useUid();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (!isSuperadmin) params.append("salesperson_id", `${uid.value}`);
  if (filter.status) params.append("status", `${filter.status}`);
  if (filter.salesperson_id) params.append("salesperson_id", `${filter.salesperson_id}`);
  if (filter.start_date) params.append("start_date", `${filter.start_date}`);
  if (filter.end_date) params.append("end_date", `${filter.end_date}`);
  return params.toString();
});

const { data: orders, status: onLoadData, refresh: refreshOrders } = await useFetch(
  () => `${config.public.apiBase}/orders?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<Order[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

const { users, onLoadUsers, refreshUsers } = useOptsUsers();

function applyFilter() {
  Object.assign(errors, {
    start_date: "",
    end_date: "",
  });

  if (_filter.start_date || _filter.end_date) {
    if (!_filter.start_date || !_filter.end_date) {
      Object.assign(errors, {
        start_date: !_filter.start_date ? "This field is required." : "",
        end_date: !_filter.end_date ? "This field is required." : "",
      });
      return;
    } else {
      if (_filter.end_date < _filter.start_date) {
        errors.end_date = "End date must be less than start date.";
        return;
      }
    }
  }

  Object.assign(filter, {
    salesperson_id: _filter.salesperson_id,
    status: _filter.status,
    start_date: _filter.start_date,
    end_date: _filter.end_date,
  });

  showFilter.value = false;
}

async function approveOrder(order: Order) {
  try {
    await $fetch(`${config.public.apiBase}/orders/${order.order_id}/approve`, {
      headers: { ...bearer },
      method: "PUT",
    });

    toast.add({
      title: "Order approved successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshOrders();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to approve order!",
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }
}

function getDropdownActions(order: Order) {
  const actions = [
    {
      label: "View details",
      icon: "i-material-symbols:visibility-outline",
      onSelect() {
        selected.value = order;
        showDetails.value = true;
      },
    },
    {
      label: "Edit",
      icon: "i-material-symbols-edit-square-outline",
      onSelect() {
        selected.value = order;
        formRef.value?.openModal(order);
      },
    },
    {
      label: "Delete",
      icon: "i-material-symbols-delete-outline",
      onSelect() {
        handleDelete(order);
      },
    },
  ];

  if (isSuperadmin) {
    if (!order.approved_at) {
      actions.unshift({
        label: "Approve",
        icon: "i-material-symbols:check-circle-outline",
        onSelect() {
          approveOrder(order)
        },
      })
    }
  }

  return [actions];
}

async function handleDelete(order: Order) {
  try {
    await $fetch(`${config.public.apiBase}/orders/${order.order_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Order deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshOrders();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete order!",
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }
}

function parseStatus(order: Order): { label: string; color: "success" | "error" | "neutral"; } {
  switch (order.status) {
    case "Paid":
      return { label: "Paid", color: "success" };
    case "Canceled":
      return { label: "Cancelled", color: "error" };
    default:
      return { label: "Pending", color: "neutral" };
  }
}

function openFilter() {
  refreshUsers();
  Object.assign(_filter, { ...filter });
  showFilter.value = true;
}

function resetFilter() {
  Object.assign(filter, {
    status: undefined,
    salesperson_id: undefined,
    start_date: undefined,
    end_date: undefined,
  });

  showFilter.value = false;
}
</script>
