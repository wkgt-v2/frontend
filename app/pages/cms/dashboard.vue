<template>
  <div v-if="onLoadData === 'pending'" class="flex items-center justify-center w-full h-96">
    <UIcon name="i-material-symbols:progress-activity" class="size-16 text-primary animate-spin" />
  </div>
  <div v-else class="space-y-6 p-6">
    <template v-if="data">
      <UButton icon="i-material-symbols:tune" @click="openFilter">Filter</UButton>
      <div class="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
          <div class="flex items-center gap-2">
            <UIcon name="i-material-symbols:person-add" mode="svg" class="size-6" />
            <h4 class="text-lg">Total New Leads</h4>
          </div>
          <h1 class="text-7xl font-semibold">
            {{ data.totalNewLeads }}
          </h1>
        </NuxtLink>
        <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
          <div class="flex items-center gap-2">
            <UIcon name="i-material-symbols:workspace-premium" mode="svg" class="size-6" />
            <h4 class="text-lg">Total Leads Won</h4>
          </div>
          <h1 class="text-7xl font-semibold">
            {{ data.totalWonLeads }}
          </h1>
        </NuxtLink>
        <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
          <div class="flex items-center gap-2">
            <UIcon name="i-material-symbols:person-off-outline" mode="svg" class="size-6" />
            <h4 class="text-lg">Total Leads Lost</h4>
          </div>
          <h1 class="text-7xl font-semibold">
            {{ data.totalLostLeads }}
          </h1>
        </NuxtLink>
        <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
          <div class="flex items-center gap-2">
            <UIcon name="i-material-symbols:follow-the-signs" mode="svg" class="size-6" />
            <h4 class="text-lg">Total Leads to Follow Up</h4>
          </div>
          <h1 class="text-7xl font-semibold">
            {{ data.totalFollowUpLeads }}
          </h1>
        </NuxtLink>
        <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
          <div class="flex items-center gap-2">
            <UIcon name="i-material-symbols:checklist" mode="svg" class="size-6" />
            <h4 class="text-lg">Total Approved Orders</h4>
          </div>
          <h1 class="text-7xl font-semibold">
            {{ data.totalApprovedOrders }}
          </h1>
        </NuxtLink>
        <NuxtLink class="sm:col-span-2 space-y-6 glass p-6 text-tone rounded-2xl border-accent">
          <div class="flex items-center gap-2">
            <UIcon name="i-material-symbols:payments-outline" mode="svg" class="size-6" />
            <h4 class="text-lg">Total Revenue</h4>
          </div>
          <h1 class="text-7xl font-semibold">
            {{ formatPrice(`${data.totalOmzet}`) }}
          </h1>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 2xl:grid-cols-2 gap-8">
        <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
          <div class="flex items-center gap-2">
            <UIcon name="i-material-symbols:event-note-outline" mode="svg" class="size-6" />
            <h4 class="text-lg">Pending Activities</h4>
          </div>
          <UTable :columns="columnsActivities" :data="data.pendingActivities" />
        </NuxtLink>
        <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
          <div class="flex items-center gap-2">
            <UIcon name="i-material-symbols:shopping-cart-checkout" mode="svg" class="size-6" />
            <h4 class="text-lg">Pending Orders</h4>
          </div>
          <UTable :columns="columnsOrders" :data="data.pendingOrders" />
        </NuxtLink>
        <NuxtLink class="2xl:col-span-2 space-y-6 glass p-6 text-tone rounded-2xl border-accent">
          <div class="flex items-center gap-2">
            <UIcon name="i-material-symbols:leaderboard-outline" mode="svg" class="size-6" />
            <h4 class="text-lg">Top Performers</h4>
          </div>
          <UTable :columns="columnKPI" :data="data.top5Performers" />
        </NuxtLink>
        <NuxtLink class="2xl:col-span-2 space-y-6 glass p-6 text-tone rounded-2xl border-accent">
          <div class="flex items-center gap-2">
            <UIcon name="i-material-symbols:sentiment-dissatisfied-outline" mode="svg" class="size-6" />
            <h4 class="text-lg">Below Average performers</h4>
          </div>
          <UTable :columns="columnKPI" :data="data.belowAveragePerformers" />
        </NuxtLink>
      </div>
    </template>
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
      <UButton label="Reset" variant="outline" @click="resetFilter" />
      <UButton label="Apply Filter" @click="applyFilter" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { HttpSuccess } from "~/types/http";
import type { Activity, KPI, Order } from "~/types/sales";

interface Dashboard {
  totalNewLeads: number;
  totalWonLeads: number;
  totalLostLeads: number;
  totalFollowUpLeads: number;
  totalApprovedOrders: number;
  totalOmzet: number;
  pendingActivities: Omit<Activity, "photos">[];
  pendingOrders: Omit<Order, "items">[];
  top5Performers: KPI[];
  belowAveragePerformers: KPI[];
}

const columnsActivities: TableColumn<Omit<Activity, "photos">>[] = [
  {
    accessorKey: "salesperson",
    header: "Sales Person",
    cell: ({ row }) => row.original.salesperson?.user_username || "-",
  },
  {
    accessorKey: "activity_type",
    header: "Activity Type",
  },
  {
    accessorKey: "follow_up_date",
    header: "Follow-Up Date",
  },
  {
    accessorKey: "audit_status",
    header: "Audit Status",
    meta: {
      class: { td: "capitalize" },
    },
  },
];
const columnsOrders: TableColumn<Omit<Order, "items">>[] = [
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
];
const columnKPI: TableColumn<KPI>[] = [
  {
    accessorKey: "salesperson_name",
    header: "Sales Person",
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
];

const { bearer } = useToken();
const config = useRuntimeConfig();
const errors = reactive({
  start_date: "",
  end_date: "",
});
const filter = reactive({
  range: undefined as undefined | string,
  start_date: undefined as undefined | string,
  end_date: undefined as undefined | string,
});
const showFilter = ref(false);
const state = reactive({
  range: "",
  start_date: undefined as undefined | string,
  end_date: undefined as undefined | string,
});

const params = computed(() => {
  const params = new URLSearchParams();
  if (filter.range === "range") {
    if (filter.start_date) params.append("start_date", `${filter.start_date}`);
    if (filter.end_date) params.append("end_date", `${filter.end_date}`);
  } else {
    if (filter.range) params.append("range", `${filter.range}`);
  }
  return params.toString();
});

const { data, status: onLoadData } = await useFetch(
  () => `${config.public.apiBase}/dashboard?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccess<Dashboard>) => {
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

function openFilter() {
  Object.assign(state, { ...filter });
  showFilter.value = true;
}

function resetFilter() {
  Object.assign(state, {
    range: undefined,
    start_date: undefined,
    end_date: undefined,
  });
}
</script>
