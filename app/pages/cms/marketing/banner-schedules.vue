<template>
  <div class="space-y-6 p-6">
    <div class="flex sm:justify-between gap-4 sm:gap-8">
      <UButton icon="i-material-symbols:tune" @click="openFilter">Filter</UButton>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshSchedules()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New Schedule</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="schedules" :loading="onLoadData === 'pending'">
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
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Schedule`"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField label="Banner" name="banner_id">
          <USelectMenu
            v-model="state.banner_id"
            :items="banners"
            value-key="value"
            :loading="onLoadBanners === 'pending'"
          />
        </UFormField>
        <UFormField
          label="Start Date"
          name="start_date"
        >
          <Datepicker v-model="state.start_date" enable-time-picker />
        </UFormField>
        <UFormField
          label="End Date"
          name="end_date"
        >
          <Datepicker v-model="state.end_date" enable-time-picker />
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

  <UModal
    title="Filter"
    v-model:open="showFilter"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-6">
        <UFormField label="Banner" name="banner_id">
          <USelectMenu
            v-model="_filter.banner_id"
            :items="banners"
            value-key="value"
            :loading="onLoadBanners === 'pending'"
          />
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
</template>

<script setup lang="ts">
import * as v from "valibot";
import type { FetchError } from "ofetch";
import type { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import type { HttpError, HttpSuccessWithPagination } from "~/types/http";
import type { Banner, BannerSchedule } from "~/types/marketing";

interface FilterData {
  banner_id?: number;
  start_date?: string;
  end_date?: string;
}

const column: TableColumn<BannerSchedule>[] = [
  {
    accessorKey: "banner",
    header: "Banner",
    cell: ({ row }) => row.original.banner?.banner_title || "-",
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      return new Date(row.original.start_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      return new Date(row.original.end_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    },
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
  banner_id: vRequiredSelect(),
  start_date: v.pipe(
    v.union([v.string(), v.nullish(v.string())]),
    v.string("This field is required.")
  ),
  end_date: v.pipe(
    v.union([v.string(), v.nullish(v.string())]),
    v.string("This field is required."),
  ),
});
type Schema = v.InferOutput<typeof schema>;

const _filter = reactive<FilterData>({
  banner_id: undefined,
  start_date: undefined,
  end_date: undefined,
});
const config = useRuntimeConfig();
const errors = reactive({
  start_date: "",
  end_date: "",
});
const filter = reactive<FilterData>({
  banner_id: undefined,
  start_date: undefined,
  end_date: undefined,
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
const selected = ref<BannerSchedule>();
const showFilter = ref(false);
const state = reactive({
  banner_id: undefined as undefined | number,
  start_date: undefined as undefined | string,
  end_date: undefined as undefined | string,
});
const toast = useToast();
const { bearer } = useToken();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (filter.banner_id) params.append("banner_id", `${filter.banner_id}`);
  if (filter.start_date) params.append("start_date", `${filter.start_date}`);
  if (filter.end_date) params.append("end_date", `${filter.end_date}`);
  return params.toString();
});

const { data: schedules, status: onLoadData, refresh: refreshSchedules } = await useFetch(
  () => `${config.public.apiBase}/banner-schedules?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<BannerSchedule[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

const { data: banners, status: onLoadBanners, refresh: refreshBanners } = await useFetch(
  `${config.public.apiBase}/banners?limit=9999`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<Banner[]>) => {
      return value.data.data.map(b => ({
        label: b.banner_title,
        value: b.banner_id,
      }));
    },
  }
);

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
    banner_id: _filter.banner_id,
    start_date: _filter.start_date,
    end_date: _filter.end_date,
  });

  showFilter.value = false;
}

function getDropdownActions(schedule: BannerSchedule) {
  return [
    [
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          openModal(schedule);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(schedule);
        },
      },
    ],
  ];
}

async function handleDelete(schedule: BannerSchedule) {
  try {
    await $fetch(`${config.public.apiBase}/banner-schedules/${schedule.schedule_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Schedule deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshSchedules();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete schedule!",
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
    await $fetch(`${config.public.apiBase}/banner-schedules${selected.value ? "/" + selected.value.schedule_id : ""}`, {
      headers: { ...bearer },
      method: selected.value ? "PUT" : "POST",
      body: e.data,
    });

    toast.add({
      title: `Schedule ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => {
      refreshBanners();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to ${modal.type === "add" ? "create" : "update"} schedule!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

function openFilter() {
  refreshBanners();
  Object.assign(_filter, { ...filter });
  showFilter.value = true;
}

function openModal(schedule?: BannerSchedule) {
  selected.value = schedule;
  refreshBanners();

  Object.assign(state, {
    banner_id: schedule?.banner_id,
    start_date: schedule?.start_date,
    end_date: schedule?.end_date,
  });

  modal.type = schedule ? "edit" : "add";
  modal.open = true;
}

function resetFilter() {
  Object.assign(filter, {
    banner_id: undefined,
    start_date: undefined,
    end_date: undefined,
  });

  showFilter.value = false;
}
</script>
