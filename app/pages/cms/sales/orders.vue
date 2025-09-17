<template>
  <div class="space-y-6 p-6">
    <div class="flex justify-between gap-8">
      <UFormField label="Search Order">
        <UInput v-model="searchQuery" />
      </UFormField>
      <div class="flex items-end justify-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshOrders()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New Order</UButton>
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

  <UModal
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Order`"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField label="Sales Person" name="salesperson_id">
          <USelectMenu
            v-model="state.salesperson_id"
            :items="users"
            value-key="value"
            :loading="onLoadUsers === 'pending'"
          />
        </UFormField>
        <UFormField label="Lead" name="lead_id">
          <USelectMenu
            v-model="state.lead_id"
            :items="leads"
            value-key="value"
            :placeholder="`${!state.salesperson_id ? 'Please choose sales person first' : ''}`"
            :disabled="!state.salesperson_id"
            :loading="onLoadLeads === 'pending'"
          />
        </UFormField>
        <UFormField label="Order Date" name="order_date">
          <Datepicker v-model="state.order_date" />
        </UFormField>
        <UFormField label="Status" name="status">
          <USelectMenu v-model="state.status" :items="ORDER_STATUS" value-key="value" />
        </UFormField>
        <UFormField label="Items" name="items" :error="errors.items">
          <div class="space-y-2">
            <div class="overflow-x-auto">
              <UTable
                v-if="state.items.length"
                :columns="itemColumn"
                :data="state.items"
                :ui="{ th: 'py-2 px-3', td: 'py-2 px-3' }"
              >
                <template #action-cell="{ row }">
                  <UDropdownMenu :items="getItemDropdownAction(row.original)">
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
            <UButton icon="i-material-symbols:add" @click="openItemModal()">Add Item</UButton>
          </div>
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

  <UModal :title="`${selectedItem ? 'Edit' : 'Add'} Order Item`" v-model:open="modal.showItem">
    <template #body>
      <UForm :schema="itemSchema" :state="itemState" class="space-y-6" @submit="addItem">
        <UFormField label="Category" name="category_id">
          <USelectMenu
            v-model="itemState.category_id"
            :items="categories"
            value-key="value"
            :loading="onLoadCategories === 'pending'"
          />
        </UFormField>
        <UFormField label="Series" name="series_id">
          <USelectMenu
            v-model="itemState.series_id"
            :items="series"
            value-key="value"
            :placeholder="`${!itemState.category_id ? 'Please choose product category first' : ''}`"
            :disabled="!itemState.category_id"
            :loading="onLoadSeries === 'pending'"
          />
        </UFormField>
        <UFormField label="Product" name="product_id">
          <USelectMenu
            v-model="itemState.product_id"
            :items="products"
            value-key="value"
            :placeholder="`${!itemState.series_id ? 'Please choose product series first' : ''}`"
            :disabled="!itemState.series_id"
            :loading="onLoadProducts === 'pending'"
          />
        </UFormField>
        <UFormField label="Quantity" name="quantity">
          <UInput v-model.number="itemState.quantity" />
        </UFormField>
        <UFormField label="Price" name="price">
          <UInput v-model.number="itemState.price" />
        </UFormField>

        <div class="flex justify-end gap-4">
          <UButton variant="outline" @click="modal.showItem = false">
            Cancel
          </UButton>
          <UButton type="submit">
            {{ selectedItem ? "Save" : "Add" }}
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
      <UButton label="Apply Filter" @click="applyFilter" />
    </template>
  </UModal>

  <UModal
    title="Order Details"
    v-model:open="showDetails"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div v-if="selected" class="grid grid-cols-2 gap-4">
        <!-- <div
          v-for="field in fields"
          :key="field.key"
          class="space-y-1 text-sm text-tone"
        >
          <div>{{ field.label }}</div>
          <div class="font-medium">
            <template
              v-if="['omzetNet', 'averageOrderValue'].includes(field.key)"
            >
              {{
                formatPrice(`${selected[field.key as keyof typeof selected]}`)
              }}
            </template>
            <template
              v-else-if="['closingRate', 'achievement'].includes(field.key)"
            >
              {{
                parseFloat(`${selected[field.key as keyof typeof selected]}`)
              }}%
            </template>
            <template v-else>
              {{ selected[field.key as keyof typeof selected] }}
            </template>
          </div>
        </div> -->
      </div>
    </template>
    <template #footer="{ close }">
      <UButton label="Close" variant="outline" @click="close" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as v from "valibot";
import type { FetchError } from "ofetch";
import type { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import type { HttpError, HttpSuccessWithPagination } from "~/types/http";
import type { Order, OrderStatus } from "~/types/sales";

interface FilterData {
  status?: OrderStatus;
  salesperson_id?: number;
  start_date?: string;
  end_date?: string;
}

interface OrderItemPlaceholder {
  id: number;
  category_id?: number;
  series_id?: number;
  product_id?: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface StateProps {
  lead_id?: number,
  salesperson_id?: number,
  order_date?: string,
  status?: OrderStatus,
  items: OrderItemPlaceholder[],
}

const column: TableColumn<Order>[] = [
  {
    accessorKey: "salesperson",
    header: "Sales Person",
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
    id: "action",
    meta: {
      class: {
        td: "w-16 text-right",
      },
    },
  },
];
const itemColumn: TableColumn<OrderItemPlaceholder>[] = [
  {
    accessorKey: "product_name",
    header: "Product",
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
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatPrice(`${row.original.price}`),
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

const itemSchema = v.object({
  id: v.pipe(v.number(), v.toMinValue(1)),
  category_id: v.pipe(
    v.union([v.number(), v.nullish(v.number())]),
    v.number("This field is required.")
  ),
  series_id: v.pipe(
    v.union([v.number(), v.nullish(v.number())]),
    v.number("This field is required.")
  ),
  product_id: v.pipe(
    v.union([v.number(), v.nullish(v.number())]),
    v.number("This field is required.")
  ),
  product_name: v.pipe(
    v.union([v.string(), v.nullish(v.string())]),
    v.string("This field is required.")
  ),
  quantity: v.pipe(v.number(), v.minValue(1, "At least 1 quantity.")),
  price: v.pipe(v.number(), v.minValue(1, "Price can't be zero."), ),
});
const schema = v.object({
  salesperson_id: v.pipe(
    v.union([v.number(), v.nullish(v.number())]),
    v.number("This field is required.")
  ),
  lead_id: v.pipe(
    v.union([v.number(), v.nullish(v.number())]),
    v.number("This field is required.")
  ),
  order_date: v.pipe(
    v.union([v.string(), v.nullish(v.string())]),
    v.string("This field is required.")
  ),
  status: v.pipe(
    v.union([v.string(), v.nullish(v.string())]),
    v.string("This field is required.")
  ),
});
type Schema = v.InferOutput<typeof schema>;
type ItemSchema = v.InferOutput<typeof itemSchema>;

const _filter = reactive<FilterData>({
  status: undefined,
  salesperson_id: undefined,
  start_date: undefined,
  end_date: undefined,
});
const { bearer } = useToken();
const config = useRuntimeConfig();
const errors = reactive({
  items: "",
  start_date: "",
  end_date: "",
});
const filter = reactive<FilterData>({
  status: undefined,
  salesperson_id: undefined,
  start_date: undefined,
  end_date: undefined,
});
const itemState = reactive<OrderItemPlaceholder>({
  id: 0,
  category_id: undefined,
  series_id: undefined,
  product_id: undefined,
  product_name: "",
  quantity: 1,
  price: 0
});
const meta = reactive({
  limit: 10,
  page: 1,
  total: 0,
});
const modal = reactive({
  onSubmit: false,
  open: false,
  showItem: false,
  type: "add" as "add" | "edit",
});
const searchQuery = useDebouncedRef("", 500);
const selected = ref<Order>();
const selectedItem = ref<OrderItemPlaceholder>();
const showDetails = ref(false);
const showFilter = ref(false);
const state = reactive<StateProps>({
  lead_id: undefined,
  salesperson_id: undefined,
  order_date: undefined,
  status: undefined,
  items: [],
});
const toast = useToast();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
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
const { leads, onLoadLeads } = useOptsLeads(toRef(() => {
  return { salesperson_id: state.salesperson_id };
}));

const { categories, onLoadCategories, refreshCategories } = useOptsCategories();
const { series, onLoadSeries } = useOptsSeries(toRef(() => {
  return { category_id: itemState.category_id };
}));
const { products, onLoadProducts } = useOptsProducts(toRef(() => {
  return { category_id: itemState.category_id, series_id: itemState.series_id };
}));

watch(() => series.value, (val) => {
  if (!val || !itemState.series_id) return;
  if (!val?.find(s => s.value === itemState.series_id)) itemState.series_id = undefined;
});
watch(() => products.value, (val) => {
  if (!val || !itemState.product_id) return;
  if (!val?.find(s => s.value === itemState.product_id)) itemState.product_id = undefined;
});

function addItem(e: FormSubmitEvent<ItemSchema>) {
  const item: OrderItemPlaceholder = {
    ...e.data,
    product_name: products.value?.find(p => p.value === e.data.product_id)?.label || "",
  };
  const existingIndex = state.items.findIndex(i => i.id === item.id);
  if (existingIndex >= 0) {
    state.items[existingIndex] = item;
  } else {
    state.items.push(item);
  }
  modal.showItem = false;
}

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
    start_date: _filter.start_date,
    end_date: _filter.end_date,
  });

  showFilter.value = false;
}

function getDropdownActions(order: Order) {
  return [
    [
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
          openModal(order);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(order);
        },
      },
    ],
  ];
}

function getItemDropdownAction(item: OrderItemPlaceholder) {
  return [
    [
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          openItemModal(item);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          state.items = state.items.filter(i => i.id !== item.id);
        },
      },
    ],
  ];
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

async function onSubmit(e: FormSubmitEvent<Schema>) {
  if (modal.onSubmit) return;
  modal.onSubmit = true;

  try {
    const body = {
      ...e.data,
      total_amount: state.items.reduce((acc, val) => acc + (val.price * val.quantity), 0),
      items: state.items.map(i => {
        return {
          product_id: i.product_id,
          quantity: i.quantity,
          price: i.price,
        }
      }),
    }

    await $fetch(`${config.public.apiBase}/orders${selected.value ? "/" + selected.value.order_id : ""}`, {
      headers: { ...bearer },
      method: selected.value ? "PUT" : "POST",
      body,
    });

    toast.add({
      title: `Order ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => {
      refreshOrders();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to ${modal.type === "add" ? "create" : "update"} order!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

async function openModal(order?: Order) {
  selected.value = order;
  refreshUsers();

  const items: OrderItemPlaceholder[] = order?.items.map((item, i) => {
    return {
      id: i+1,
      category_id: item.product.category_id,
      series_id: item.product.series_id,
      product_id: item.product_id,
      product_name: item.product.product_name,
      quantity: item.quantity,
      price: parseFloat(item.price_per_item),
    }
  }) || [];
  Object.assign(state, {
    lead_id: order?.lead_id,
    salesperson_id: order?.salesperson_id,
    order_date: order?.order_date,
    status: order?.status,
    items,
  });

  modal.type = order ? "edit" : "add";
  modal.open = true;
}

async function openItemModal(item?: OrderItemPlaceholder) {
  selectedItem.value = item;
  refreshCategories();

  const lastItem = state.items[state.items.length-1];
  Object.assign(itemState, {
    id: item?.id ?? (lastItem ? (lastItem.id + 1) : 1),
    category_id: item?.category_id,
    series_id: item?.series_id,
    product_id: item?.product_id,
    product_name: item?.product_name || "",
    quantity: item?.quantity || 1,
    price: item?.price || 0,
  });

  modal.showItem = true;
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
</script>
