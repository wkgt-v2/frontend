<template>
  <template v-if="data">
    <UButton icon="i-material-symbols:tune" @click="openFilter">Filter</UButton>
    <div class="grid sm:grid-cols-2 2xl:grid-cols-3 gap-6">
      <NuxtLink class="sm:col-span-2 space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols:savings" mode="svg" class="size-6" />
          <h4 class="text-lg">Omzet Net</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          {{ formatPrice(`${data.omzetNet}`) }}
        </h1>
      </NuxtLink>
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols:checklist-rtl" mode="svg" class="size-6" />
          <h4 class="text-lg">Total Orders Approved</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          {{ data.totalOrdersApproved }}
        </h1>
      </NuxtLink>
      <NuxtLink class="sm:col-span-2 space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols:price-change-outline" mode="svg" class="size-6" />
          <h4 class="text-lg">Average Order Value</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          {{ formatPrice(`${data.averageOrderValue}`) }}
        </h1>
      </NuxtLink>
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols:person-add" mode="svg" class="size-6" />
          <h4 class="text-lg">New Leads</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          {{ data.newLeads }}
        </h1>
      </NuxtLink>
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols:workspace-premium" mode="svg" class="size-6" />
          <h4 class="text-lg">Leads Won</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          {{ data.wonLeads }}
        </h1>
      </NuxtLink>
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols:person-off-outline" mode="svg" class="size-6" />
          <h4 class="text-lg">Leads Lost</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          {{ data.lostLeads }}
        </h1>
      </NuxtLink>
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols:how-to-reg" mode="svg" class="size-6" />
          <h4 class="text-lg">Total Closing</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          {{ data.totalClosing }}
        </h1>
      </NuxtLink>
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols:groups" mode="svg" class="size-6" />
          <h4 class="text-lg">Total Leads</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          {{ data.totalLeads }}
        </h1>
      </NuxtLink>
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols:percent" mode="svg" class="size-6" />
          <h4 class="text-lg">Closing Rate</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          {{ parseFloat(data.closingRate) }}%
        </h1>
      </NuxtLink>
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols:task-alt" mode="svg" class="size-6" />
          <h4 class="text-lg">Total Sales Activities</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          {{ data.totalSalesActivities }}
        </h1>
      </NuxtLink>
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols:pending-actions" mode="svg" class="size-6" />
          <h4 class="text-lg">Pending Activities</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          {{ data.pendingActivities }}
        </h1>
      </NuxtLink>
      <NuxtLink class="space-y-6 glass p-6 text-tone rounded-2xl border-accent">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols:cancel-outline" mode="svg" class="size-6" />
          <h4 class="text-lg">Rejected Activities</h4>
        </div>
        <h1 class="text-7xl font-semibold">
          {{ data.rejectedActivities }}
        </h1>
      </NuxtLink>
    </div>
  </template>

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
            :items="OPTS_DATE_RANGE"
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
import type { HttpSuccess } from "~/types/http";
import type { KPISelf } from "~/types/sales";

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
const showFilter = ref(false);
const state = reactive({
  range: undefined as undefined | string,
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

const { data } = await useFetch(
  () => `${config.public.apiBase}/kpi/my-kpi?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccess<KPISelf>) => {
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
