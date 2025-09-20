<template>
  <UButton icon="i-material-symbols:tune" @click="openFilter">Filter</UButton>
  <div class="overflow-x-auto">
    <UTable :columns="column" :data="KPIs" :loading="onLoadData === 'pending'">
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

  <UModal
    title="Filter"
    v-model:open="showFilter"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-6">
        <UFormField label="Range" name="range">
          <USelectMenu
            v-model="state.range"
            value-key="value"
            :items="RANGE_FILTER"
          />
        </UFormField>
        <div v-if="state.range === 'range'" class="grid grid-cols-2 gap-4">
          <UFormField
            label="Start Date"
            name="start_date"
            :error="errors.start_date"
          >
            <Datepicker v-model="state.start_date" />
          </UFormField>
          <UFormField label="End Date" name="end_date" :error="errors.end_date">
            <Datepicker v-model="state.end_date" />
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
    title="KPI Details"
    v-model:open="showDetails"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div v-if="selected" class="grid grid-cols-2 gap-4">
        <div
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
        </div>
      </div>
    </template>
    <template #footer="{ close }">
      <UButton label="Close" variant="outline" @click="close" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { HttpSuccess } from "~/types/http";
import type { KPI } from "~/types/sales";

const column: TableColumn<KPI>[] = [
  {
    accessorKey: "salesperson_name",
    header: "Sales Person",
  },
  {
    accessorKey: "targetClosing",
    header: "Target Closing",
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
  },
  {
    accessorKey: "totalClosing",
    header: "Total Closing",
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
  },
  {
    accessorKey: "totalOrdersApproved",
    header: "Total Orders Approved",
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
  },
  {
    accessorKey: "totalLeads",
    header: "Total Leads",
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
  },
  {
    accessorKey: "closingRate",
    header: "Closing Rate",
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
    cell: ({ row }) => `${parseFloat(row.original.closingRate)}%`,
  },
  {
    accessorKey: "totalSalesActivities",
    header: "Total Sales Activities",
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
  },
  {
    accessorKey: "achievement",
    header: "Achievement",
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
    cell: ({ row }) => `${parseFloat(row.original.achievement)}%`,
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
const fields = [
  {
    key: "salesperson_name",
    label: "Sales Person",
  },
  {
    key: "targetClosing",
    label: "Target Closing",
  },
  {
    key: "totalClosing",
    label: "Total Closing",
  },
  {
    key: "omzetNet",
    label: "Revenue",
  },
  {
    key: "totalOrdersApproved",
    label: "Total Orders Approved",
  },
  {
    key: "averageOrderValue",
    label: "Average Order Value",
  },
  {
    key: "newLeads",
    label: "New Leads",
  },
  {
    key: "wonLeads",
    label: "Leads Won",
  },
  {
    key: "lostLeads",
    label: "Leads Lost",
  },
  {
    key: "totalLeads",
    label: "Total Leads",
  },
  {
    key: "closingRate",
    label: "Closing Rate",
  },
  {
    key: "totalSalesActivities",
    label: "Total Sales Activities",
  },
  {
    key: "pendingActivities",
    label: "Pending Sales Activities",
  },
  {
    key: "rejectedActivities",
    label: "Rejected Sales Activities",
  },
  {
    key: "achievement",
    label: "Achievement",
  },
];

const { bearer } = useToken();
const config = useRuntimeConfig();
const errors = reactive({
  start_date: "",
  end_date: "",
});
const filter = reactive({
  range: "last_month",
  start_date: undefined as undefined | string,
  end_date: undefined as undefined | string,
});
const selected = ref<KPI>();
const showDetails = ref(false);
const showFilter = ref(false);
const state = reactive({
  range: "",
  start_date: undefined as undefined | string,
  end_date: undefined as undefined | string,
});
const toast = useToast();

const params = computed(() => {
  const params = new URLSearchParams();
  if (filter.range === "range") {
    if (filter.start_date) params.append("start_date", `${filter.start_date}`);
    if (filter.end_date) params.append("end_date", `${filter.end_date}`);
  } else {
    params.append("range", `${filter.range}`);
  }
  return params.toString();
});

const { data: KPIs, status: onLoadData } = await useFetch(
  () => `${config.public.apiBase}/kpi/grouped?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccess<KPI[]>) => {
      return value.data;
    },
    watch: [() => params.value],
  }
);

function applyFilter() {
  Object.assign(errors, {
    start_date: "",
    end_date: "",
  });

  if (state.range === "range") {
    if (!state.start_date || !state.end_date) {
      Object.assign(errors, {
        start_date: !state.start_date ? "This field is required." : "",
        end_date: !state.end_date ? "This field is required." : "",
      });
      return;
    }

    if (state.end_date < state.start_date) {
      errors.end_date = "End date must be less than start date.";
      return;
    }
  }

  Object.assign(filter, {
    range: state.range,
    start_date: state.range === "range" ? state.start_date : undefined,
    end_date: state.range === "range" ? state.end_date : undefined,
  });
  showFilter.value = false;
}

function getDropdownActions(kpi: KPI) {
  return [
    [
      {
        label: "View details",
        icon: "i-material-symbols:visibility-outline",
        onSelect() {
          selected.value = kpi;
          showDetails.value = true;
        },
      },
    ],
  ];
}

function openFilter() {
  Object.assign(state, { ...filter });
  showFilter.value = true;
}
</script>
