<template>
  <div class="space-y-6 p-6">
    <div class="flex not-sm:flex-col justify-between gap-4 sm:gap-8">
      <UButton icon="i-material-symbols:tune" @click="openFilter">Filter</UButton>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshActivities()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New Activity</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="activities" :loading="onLoadData === 'pending'">
        <template #audit_status-cell="{ row }">
          <UBadge :label="parseAuditStatus(row.original).label" :color="parseAuditStatus(row.original).color" />
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
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Activity`"
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
        <UFormField label="Activity Type" name="activity_type">
          <USelect v-model="state.activity_type" :items="SALES_ACTIVITY_TYPES" />
        </UFormField>
        <UFormField label="Follow-Up Date" name="follow_up_date">
          <Datepicker v-model="state.follow_up_date" />
        </UFormField>
        <UFormField v-if="!selected" label="Proof Photos" name="proof_photos">
          <UFileUpload
            v-model="state.proof_photos"
            accept=".jpg,.jpeg,.png,.webp"
            description="JPG, JPEG, PNG, WebP"
            layout="list"
            multiple
            @change="handleFileChanged"
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

  <UModal
    title="Filter"
    v-model:open="showFilter"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="space-y-6">
        <UFormField v-if="isSuperadmin" label="Sales person" name="salesperson_id">
          <USelectMenu
            v-model="_filter.salesperson_id"
            value-key="value"
            :items="users"
            :loading="onLoadUsers === 'pending'"
          />
        </UFormField>
        <UFormField label="Lead" name="lead_id">
          <USelectMenu
            v-model="_filter.lead_id"
            :items="leads"
            value-key="value"
            :placeholder="`${!_filter.salesperson_id ? 'Please choose sales person first' : ''}`"
            :disabled="!_filter.salesperson_id"
            :loading="onLoadLeads === 'pending'"
          />
        </UFormField>
        <UFormField label="Activity type" name="activity_type">
          <USelectMenu
            v-model="_filter.activity_type"
            :items="['Call', 'Chat', 'Visit', 'Demo', 'Follow Up']"
          />
        </UFormField>
        <UFormField label="Audit status" name="audit_status">
          <USelectMenu
            v-model="_filter.audit_status"
            :items="['pending', 'approved', 'rejected']"
            :ui="{ base: 'capitalize', item: 'capitalize' }"
          />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Start Date" name="start_date">
            <Datepicker v-model="_filter.start_date" />
          </UFormField>
          <UFormField label="End Date" name="end_date">
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
    title="Audit Activity"
    v-model:open="modal.showAudit"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="auditSchema" :state="auditState" class="space-y-6" @submit="auditActivity">
        <UFormField label="Audit Status" name="audit_status">
          <USelect v-model="auditState.audit_status" :items="OPTS_ACTIVITY_AUDIT_STATUS" />
        </UFormField>
        <UFormField label="Audit Notes" name="audit_notes">
          <Textarea v-model="auditState.audit_notes" :rows="2" />
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
            Submit
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>

  <UModal
    title="Activity Details"
    v-model:open="modal.showDetails"
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
          <div>Activity Type</div>
          <div class="font-medium">
            {{ selected.activity_type }}
          </div>
        </div>
        <div class="space-y-1 text-sm text-tone">
          <div>Follow-Up Date</div>
          <div class="font-medium">
            {{ selected.follow_up_date }}
          </div>
        </div>
        <div class="sm:col-span-2 space-y-1 text-sm text-tone">
          <div>Notes</div>
          <div class="font-medium">
            {{ selected.activity_notes || "-" }}
          </div>
        </div>
        <div class="space-y-1 text-sm text-tone">
          <div>Follow-Up Date</div>
          <div class="font-medium">
            {{ selected.follow_up_date }}
          </div>
        </div>
        <div class="space-y-1 text-sm text-tone">
          <div>Audit Status</div>
          <div class="font-medium capitalize">
            {{ selected.audit_status }}
          </div>
        </div>
        <div class="sm:col-span-2 space-y-1 text-sm text-tone">
          <div>Audit Notes</div>
          <div class="font-medium">
            {{ selected.audit_notes || "-" }}
          </div>
        </div>
        <div class="sm:col-span-2 space-y-1 text-sm text-tone">
          <div>Photos</div>
          <img
            v-for="photo in selected.photos"
            :key="photo.photo_id"
            :src="photo.photo_url"
            :alt="photo.photo_url"
            class="w-full rounded-md object-contain"
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
import * as v from "valibot";
import type { FetchError } from "ofetch";
import type { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import type { HttpError, HttpSuccessWithPagination } from "~/types/http";
import type { Activity } from "~/types/sales";
import { OPTS_ACTIVITY_AUDIT_STATUS } from "~/utils";

const isSuperadmin = useSuperadmin();

const column: TableColumn<Activity>[] = [
  {
    accessorKey: "activity_id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("activity_id")}`,
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
    accessorKey: "lead",
    header: "Customer Name",
    cell: ({ row }) => row.original.lead.customer_name,
  },
  {
    accessorKey: "activity_type",
    header: "Activity Type",
  },
  {
    accessorKey: "follow_up_date",
    header: "Follow-Up Date",
    cell: ({ row }) => {
      return row.original.follow_up_date
        ? new Date(row.original.follow_up_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "-";
    },
  },
  {
    accessorKey: "audit_status",
    header: "Audit Status",
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
  salesperson_id: vRequiredSelect(),
  lead_id: vRequiredSelect(),
  activity_type: vRequiredStringSelect(),
  follow_up_date: vRequiredStringSelect(),
  proof_photos: v.pipe(
    v.array(v.union([v.file(), v.string()])),
    v.filterItems((item) => typeof item === "string" || ALLOWED_FILE_TYPES.includes(item.type)),
    v.minLength(1, "Select at least one image."),
  ),
});
const auditSchema = v.object({
  audit_status: vRequiredStringSelect(),
  audit_notes: v.string(),
});
type Schema = v.InferOutput<typeof schema>;
type AuditSchema = v.InferOutput<typeof auditSchema>;

const _filter = reactive({
  salesperson_id: undefined as undefined | number,
  lead_id: undefined as undefined | number,
  activity_type: undefined as undefined | string,
  audit_status: undefined as undefined | string,
  start_date: undefined as undefined | string,
  end_date: undefined as undefined | string,
});
const auditState = reactive({
  audit_status: undefined,
  audit_notes: "",
});
const { bearer } = useToken();
const config = useRuntimeConfig();
const filter = reactive({
  salesperson_id: undefined as undefined | number,
  lead_id: undefined as undefined | number,
  activity_type: undefined as undefined | string,
  audit_status: undefined as undefined | string,
  start_date: undefined as undefined | string,
  end_date: undefined as undefined | string,
});
const meta = reactive({
  limit: 10,
  page: 1,
  total: 0,
});
const modal = reactive({
  onSubmit: false,
  open: false,
  showAudit: false,
  showDetails: false,
  type: "add" as "add" | "edit",
});
const route = useRoute();
const selected = ref<Activity>();
const showFilter = ref(false);
const state = reactive({
  salesperson_id: undefined,
  lead_id: undefined,
  activity_type: undefined,
  follow_up_date: undefined,
  proof_photos: [] as File[],
});
const toast = useToast();
const uid = useUid();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (!isSuperadmin) {
    params.append("salesperson_id", `${uid.value}`);
  } else {
    if (filter.salesperson_id) params.append("salesperson_id", `${filter.salesperson_id}`);
  }
  if (filter.lead_id) params.append("lead_id", `${filter.lead_id}`);
  if (filter.activity_type) params.append("activity_type", `${filter.activity_type}`);
  if (filter.audit_status) params.append("audit_status", `${filter.audit_status}`);
  if (filter.start_date) params.append("start_date", `${filter.start_date}`);
  if (filter.end_date) params.append("end_date", `${filter.end_date}`);
  return params.toString();
});

const { data: activities, status: onLoadData, refresh: refreshActivities } = await useFetch(
  () => `${config.public.apiBase}/sales-activities?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<Activity[]>) => {
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

function applyFilter() {
  Object.assign(filter, { ..._filter });
  showFilter.value = false;
}

async function auditActivity(e: FormSubmitEvent<AuditSchema>) {
  if (modal.onSubmit || !selected.value) return;
  modal.onSubmit = true;

  try {
    await $fetch(`${config.public.apiBase}/sales-activities/${selected.value.activity_id}/audit`, {
      headers: { ...bearer },
      method: "PUT",
      body: e.data,
    });

    toast.add({
      title: `Activity audited successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.showAudit = false;
    setTimeout(() => {
      refreshActivities();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to audit activity!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

function getDropdownActions(activity: Activity) {
  const actions = [
    {
      label: "View details",
      icon: "i-material-symbols:visibility-outline",
      onSelect() {
        selected.value = activity;
        modal.showDetails = true;
      },
    },
    {
      label: "Edit",
      icon: "i-material-symbols-edit-square-outline",
      onSelect() {
        openModal(activity);
      },
    },
    {
      label: "Delete",
      icon: "i-material-symbols-delete-outline",
      onSelect() {
        handleDelete(activity);
      },
    },
  ];

  if (isSuperadmin) {
    if (activity.audit_status === "pending") {
      actions.unshift({
        label: "Audit",
        icon: "i-material-symbols:fact-check-outline",
        onSelect() {
          Object.assign(auditState, {
            audit_status: undefined,
            audit_notes: "",
          });
          selected.value = activity;
          modal.showAudit = true;
        },
      })
    }
  }

  return [actions];
}

async function handleDelete(activity: Activity) {
  try {
    await $fetch(`${config.public.apiBase}/sales-activities/${activity.activity_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Activity deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshActivities();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete activity!",
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }
}

function handleFileChanged() {
  state.proof_photos = state.proof_photos.filter(f => ALLOWED_FILE_TYPES.includes(f.type));
}

async function onSubmit(e: FormSubmitEvent<Schema>) {
  if (modal.onSubmit) return;
  modal.onSubmit = true;

  try {
    let formData: FormData | undefined;
    if (!selected.value) {
      formData = new FormData();
      for (const key in e.data) {
        const value = e.data[key as keyof typeof e.data];
        if (key === "proof_photos") {
          (value as File[]).forEach(file => {
            if (file) formData?.append("proof_photos", file);
          });
        } else {
          formData.append(key, `${value}`);
        }
      }
    };

    await $fetch(`${config.public.apiBase}/sales-activities${selected.value ? "/" + selected.value.activity_id : ""}`, {
      headers: { ...bearer },
      method: selected.value ? "PUT" : "POST",
      body: formData || e.data,
    });

    toast.add({
      title: `Activity ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => {
      refreshActivities();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to ${modal.type === "add" ? "create" : "update"} activity!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

function openFilter() {
  if (isSuperadmin) refreshUsers();
  Object.assign(_filter, { ...filter });
  showFilter.value = true;
}

async function openModal(activity?: Activity) {
  selected.value = activity;
  refreshUsers();

  Object.assign(state, {
    salesperson_id: isSuperadmin ? (activity?.salesperson_id || undefined) : uid.value,
    lead_id: activity?.lead_id || undefined,
    activity_type: activity?.activity_type || undefined,
    follow_up_date: activity?.follow_up_date || undefined,
    proof_photos: activity ? [""] : [],
  });

  modal.type = activity ? "edit" : "add";
  modal.open = true;
}

function parseAuditStatus(activity: Activity): { label: string; color: "success" | "error" | "neutral"; } {
  switch (activity.audit_status) {
    case "approved":
      return { label: "Approved", color: "success" };
    case "rejected":
      return { label: "Rejected", color: "error" };
    default:
      return { label: "Pending", color: "neutral" };
  }
}

function resetFilter() {
  Object.assign(_filter, {
    salesperson_id: undefined,
    lead_id: undefined,
    activity_type: undefined,
    audit_status: undefined,
    start_date: undefined,
    end_date: undefined,
  });
}

onMounted(() => {
  if (!isSuperadmin) filter.salesperson_id = +uid.value!;
  if (route.query.lead_id) filter.lead_id = +route.query.lead_id;
});
</script>
