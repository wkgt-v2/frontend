<template>
  <div class="space-y-6 p-6">
    <div class="flex not-sm:flex-col justify-between gap-4 sm:gap-8">
      <UFormField label="Search by name">
        <UInput v-model="searchQuery" />
      </UFormField>
      <div class="flex items-end gap-4 *:h-fit">
        <ClientOnly>
          <UTooltip text="If the list is not updated, click this to refresh the data">
            <UButton :loading="onLoadData === 'pending'" @click="refreshUsers()">
              Refresh
            </UButton>
          </UTooltip>
        </ClientOnly>
        <UButton @click="openModal()">Create New User</UButton>
      </div>
    </div>
    <div class="overflow-x-auto">
      <UTable :columns="column" :data="users" :loading="onLoadData === 'pending'">
        <template #user_username-header>
          <CmsTableHeader label="Name" value="user_username" v-model:by="sort.by" v-model:order="sort.order" />
        </template>
        <template #user_email-header>
          <CmsTableHeader label="Email" value="user_email" v-model:by="sort.by" v-model:order="sort.order" />
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
    :title="`${modal.type === 'add' ? 'Create New' : 'Edit'} User`"
    v-model:open="modal.open"
    :close="{ class: `${modal.onSubmit ? 'hidden' : ''}` }"
    :dismissible="!modal.onSubmit"
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField label="Username" name="user_username">
          <UInput v-model="state.user_username" />
        </UFormField>
        <UFormField label="Email" name="user_email">
          <UInput v-model="state.user_email" />
        </UFormField>
        <UFormField v-show="modal.type === 'add'" label="Password" name="user_password">
          <UInput type="password" v-model="state.user_password" />
        </UFormField>
        <UFormField label="Password" name="new_password">
          <UInput type="password" v-model="state.new_password" />
        </UFormField>
        <UFormField label="Role" name="role_id">
          <USelectMenu
            v-model="state.role_id"
            :items="roles"
            value-key="value"
            :loading="onLoadRoles === 'pending'"
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
import type { User } from "~/types";

const column: TableColumn<User>[] = [
  {
    accessorKey: "user_id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("user_id")}`,
  },
  {
    accessorKey: "user_username",
  },
  {
    accessorKey: "user_email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => row.original.role?.role_nama || "-",
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
  user_username: vRequired(),
  user_email: v.pipe(v.string(), v.email("Value is not a valid email."), v.nonEmpty("This field is required.")),
  user_password: v.pipe(
    v.string(),
    v.minLength(8, "Password must be at least 8 characters."),
    v.nonEmpty("This field is required.")
  ),
  new_password: v.union([
    v.literal(""),
    v.pipe(
      v.string(),
      v.minLength(8, "Password must be at least 8 characters.")
    )
  ]),
  role_id: vRequiredSelect(),
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
const searchQuery = useDebouncedRef("", 500);
const selected = ref<User>();
const sort = reactive({ by: "created_at", order: "DESC" as "ASC" | "DESC" });
const state = reactive({
  user_username: "",
  user_email: "",
  user_password: "",
  new_password: "",
  role_id: undefined
});
const toast = useToast();

const params = computed(() => {
  const params = new URLSearchParams();
  params.append("page", `${meta.page}`);
  params.append("limit", `${meta.limit}`);
  params.append("sortBy", sort.by);
  params.append("sortDir", sort.order);
  if (searchQuery.value) params.append("user_username", searchQuery.value);
  return params.toString();
});

const { data: users, status: onLoadData, refresh: refreshUsers } = await useFetch(
  () => `${config.public.apiBase}/users?${params.value}`,
  {
    headers: { ...bearer },
    transform: (value: HttpSuccessWithPagination<User[]>) => {
      meta.total = value.data.totalData;
      return value.data.data;
    },
    watch: [() => params.value],
  }
);

const { roles, onLoadRoles, refreshRoles } = useOptsRoles();

function getDropdownActions(user: User) {
  return [
    [
      {
        label: "Edit",
        icon: "i-material-symbols-edit-square-outline",
        onSelect() {
          openModal(user);
        },
      },
      {
        label: "Delete",
        icon: "i-material-symbols-delete-outline",
        onSelect() {
          handleDelete(user);
        },
      },
    ],
  ];
}

async function handleDelete(user: User) {
  try {
    await $fetch(`${config.public.apiBase}/users/${user.user_id}`, {
      headers: { ...bearer },
      method: "DELETE",
    });

    toast.add({
      title: "User deleted successfully!",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    setTimeout(() => {
      refreshUsers();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: "Failed to delete user!",
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
    const body = {} as Record<string, string | number>;
    for (const key in e.data) {
      const val = e.data[key as keyof typeof e.data];
      if (key === "user_password") {
        if (!selected.value) body[key] = val;
      } else if (key === "new_password") {
        if (val) body.user_password = val;
      } else {
        body[key] = val;
      }
    }

    await $fetch(`${config.public.apiBase}/users${selected.value ? "/" + selected.value.user_id : ""}`, {
      headers: { ...bearer },
      method: selected.value ? "PUT" : "POST",
      body,
    });

    toast.add({
      title: `User ${modal.type === "add" ? "created" : "updated"} successfully!`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    modal.open = false;
    setTimeout(() => {
      refreshUsers();
    }, 100);
  } catch (error) {
    console.log(error)
    const e = error as FetchError<HttpError>;
    toast.add({
      title: `Failed to ${modal.type === "add" ? "create" : "update"} user!`,
      description: e.data?.message,
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }

  modal.onSubmit = false;
}

function openModal(user?: User) {
  selected.value = user;
  refreshRoles();

  Object.assign(state, {
    user_username: user?.user_username || "",
    user_email: user?.user_email || "",
    user_password: user ? "bypassvalidation" : "",
    new_password: "",
    role_id: user?.role?.role_id || undefined,
  });

  modal.type = user ? "edit" : "add";
  modal.open = true;
}
</script>
