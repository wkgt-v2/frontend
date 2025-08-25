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
      <UButton variant="ghost" label="Admin" trailing-icon="i-material-symbols-person-outline" block />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

const localePath = useLocalePath();
const token = useToken();

const dropdownItems = ref<DropdownMenuItem[]>([
  {
    label: "Logout",
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
        label: "Category",
        to: localePath("cms-product-category"),
      },
      {
        label: "Series",
        to: localePath("cms-product-series"),
      },
      {
        label: "Item",
      },
    ],
  },
  {
    label: "Company",
    children: [
      {
        label: "Settings",
      },
    ],
  },
]);
</script>
