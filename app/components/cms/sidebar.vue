<template>
  <div class="shrink-0 space-y-4 w-80 h-dvh glass py-4 px-6 border-r border-accent">
    <NuxtLink :to="$localePath('/')" class="block">
      <img
        src="/assets/images/logo.png"
        alt="Logo"
        class="h-10 select-none dark:hidden"
      />
      <img
        src="/assets/images/logo_dark-mode.png"
        alt="Logo"
        class="h-10 select-none hidden dark:block"
      />
    </NuxtLink>
    <div class="h-[calc(100dvh-136px)] -mx-6 p-6 overflow-y-auto">
      <UNavigationMenu :items="navItems" orientation="vertical" />
    </div>
    <UDropdownMenu
      :items="dropdownItems"
      :content="{
        align: 'start',
        side: 'bottom',
        sideOffset: 8
      }"
      :ui="{
        content: 'w-48'
      }"
    >
      <UButton variant="ghost" :label="user.user_username" trailing-icon="i-material-symbols-person-outline" block />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

const localePath = useLocalePath();
const { token } = useToken();
const user = useUser();

const dropdownItems = ref<DropdownMenuItem[]>([
  {
    label: "Logout",
    icon: "material-symbols:power-settings-new-outline",
    onSelect() {
      token.value = null;
      location.href = localePath("cms-login");
    },
  },
]);
const navItems = ref<NavigationMenuItem[]>([
  {
    label: "Dashboard",
    to: localePath("cms-dashboard"),
  },
  {
    label: "Product",
    children: [
      {
        label: "Categories",
        to: localePath("cms-product-categories"),
      },
      {
        label: "Series",
        to: localePath("cms-product-series"),
      },
      {
        label: "Items",
        to: localePath("cms-product-items"),
      },
    ],
  },
  {
    label: "Service Orders",
    to: localePath("cms-service-orders"),
  },
  {
    label: "Sales",
    children: [
      {
        label: "Leads",
        to: localePath("cms-sales-leads"),
      },
      {
        label: "Activities",
        to: localePath("cms-sales-activities"),
      },
      {
        label: "KPI",
        to: localePath("cms-sales-kpi"),
      },
    ],
  },
  {
    label: "Blog",
    children: [
      {
        label: "Categories",
        to: localePath("cms-blog-categories"),
      },
      {
        label: "Articles",
        to: localePath("cms-blog-articles"),
      },
    ],
  },
  {
    label: "Settings",
    children: [
      {
        label: "Users",
        to: localePath("cms-settings-users"),
      },
      {
        label: "Roles",
        to: localePath("cms-settings-roles"),
      },
    ],
  },
]);
</script>
