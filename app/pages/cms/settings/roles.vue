<template>
  <div class="space-y-6 p-6">
    <div class="flex not-sm:flex-col justify-between gap-4 sm:gap-8">
      <UFormField label="Search Role">
        <UInput v-model="searchQuery" />
      </UFormField>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshRoles()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New Role</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="roles" :loading="onLoadData === 'pending'">
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
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} Role`"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit" @error="(e) => console.log(e)">
        <UFormField label="Name" name="role_nama">
          <UInput v-model="state.role_nama" />
        </UFormField>
        <UFormField label="Permissions" name="role_permission">
          <UCheckboxGroup
            orientation="horizontal"
            variant="card"
            label-key="permission_name"
            value-key="permission_name"
            v-model="state.role_permission"
            :items="permissions"
            :ui="{ fieldset: 'flex-wrap' }"
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
</template>

<script setup lang="ts">
import * as v from "valibot";
import type { FetchError } from "ofetch";
import type { FormSubmitEvent, TableColumn } from "@nuxt/ui";
import type { HttpError, HttpSuccessWithPagination } from "~/types/http";
import type { RolePermission, UserRole } from "~/types";

const column: TableColumn<UserRole>[] = [
  {
    accessorKey: "role_id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("role_id")}`,
  },
  {
    accessorKey: "role_nama",
    header: "Name",
  },
  {
    accessorKey: "role_permission",
    header: "Permission",
    cell: ({ row }) => row.original.role_permission.join(", ") || "-",
    meta: {
      class: {
        td: "max-w-xl whitespace-normal",
      }
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
  role_nama: vRequired(),
  role_permission: v.pipe(v.array(v.string()), v.minLength(1, "Must be at least 1 selected permission")),
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
const permissions = ref<RolePermission[]>([]);
const searchQuery = useDebouncedRef("", 500);
const selected = ref<UserRole>();
const state = reactive({
  role_nama: "",
  role_permission: [],
});
const toast = useToast();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  if (searchQuery.value) params.append("role_nama", searchQuery.value);
  return params.toString();
});

const { data: roles, status: onLoadData, refresh: refreshRoles } = await useFetch(
  () => `${config.public.apiBase}/roles?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<UserRole[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

function getDropdownActions(role: UserRole) {
  return [
    [
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          openModal(role);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(role);
        },
      },
    ],
  ];
}

async function getPermissions(page: number) {
  const res = await $fetch<HttpSuccessWithPagination<RolePermission[]>>(
    `${config.public.apiBase}/permissions?page=${page}&limit=25`,
    { headers: { ...bearer } }
  );
  permissions.value = [...permissions.value, ...res.data.data];
  if (res.data.totalPages !== page) getPermissions(page + 1);
}

async function handleDelete(role: UserRole) {
  try {
    await $fetch(`${config.public.apiBase}/roles/${role.role_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "Role deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshRoles();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete role!",
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
    await $fetch(`${config.public.apiBase}/roles${selected.value ? "/" + selected.value.role_id : ""}`, {
      headers: { ...bearer },
      method: selected.value ? "PUT" : "POST",
      body: e.data,
    });

    toast.add({
      title: `Role ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => {
      refreshRoles();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to ${modal.type === "add" ? "create" : "update"} role!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

function openModal(role?: UserRole) {
  selected.value = role;
  refreshRoles();

  Object.assign(state, {
    role_nama: role?.role_nama || "",
    role_permission: role?.role_permission || "",
  });

  modal.type = role ? "edit" : "add";
  modal.open = true;
}

onMounted(() => {
  getPermissions(1);
});
</script>
