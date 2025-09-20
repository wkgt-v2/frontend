<template>
  <UModal
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Order`"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField v-if="isSuperadmin" label="Sales Person" name="salesperson_id">
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
          <USelectMenu v-model="state.status" :items="OPTS_ORDER_STATUS" value-key="value" />
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
</template>

<script setup lang="ts">
import * as v from "valibot";
import type { FetchError } from "ofetch";
import type { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import type { Order, OrderStatus } from "~/types/sales";
import type { HttpError } from "~/types/http";

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

defineComponent({
  inheritAttrs: false,
});

const props = defineProps<{
  selected?: Order;
}>();

const emit = defineEmits(["refresh"]);

const isSuperadmin = useSuperadmin();

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
  category_id: vRequiredSelect(),
  series_id: vRequiredSelect(),
  product_id: vRequiredSelect(),
  product_name: vRequiredStringSelect(),
  quantity: v.pipe(v.number(), v.minValue(1, "At least 1 quantity.")),
  price: v.pipe(v.number(), v.minValue(1, "Price can't be zero."), ),
});
const schema = v.object({
  salesperson_id: vRequiredSelect(),
  lead_id: vRequiredSelect(),
  order_date: vRequiredStringSelect(),
  status: vRequiredStringSelect(),
});
type Schema = v.InferOutput<typeof schema>;
type ItemSchema = v.InferOutput<typeof itemSchema>;

const { bearer } = useToken();
const config = useRuntimeConfig();
const errors = reactive({
  items: "",
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
const modal = reactive({
  onSubmit: false,
  open: false,
  showItem: false,
  type: "add" as "add" | "edit",
});
const selectedItem = ref<OrderItemPlaceholder>();
const state = reactive<StateProps>({
  lead_id: undefined,
  salesperson_id: undefined,
  order_date: undefined,
  status: undefined,
  items: [],
});
const toast = useToast();
const uid = useUid();

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

function getDropdownActions(item: OrderItemPlaceholder) {
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

    await $fetch(`${config.public.apiBase}/orders${props.selected ? "/" + props.selected.order_id : ""}`, {
      headers: { ...bearer },
      method: props.selected ? "PUT" : "POST",
      body,
    });

    toast.add({
      title: `Order ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => emit("refresh"), 100);
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
    salesperson_id: isSuperadmin ? (order?.salesperson_id || undefined) : uid.value,
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

defineExpose({ openModal });
</script>
