<template>
  <nav class="fixed top-0 w-full bg-cyan-200/20 dark:bg-cyan-900/20 backdrop-blur-md shadow-md z-[99]">
    <div class="container flex flex-col md:flex-row items-center md:justify-between h-16">
      <NuxtLink to="/">
        <img src="/assets/images/logo.png" alt="Logo" class="h-10 dark:hidden">
        <img src="/assets/images/logo_dark-mode.png" alt="Logo" class="h-10 hidden dark:block">
      </NuxtLink>
      <UNavigationMenu
        :items="items"
        variant="link"
        :ui="{
          link: 'text-tone',
          childList: 'gap-0 p-1',
          childLink: 'py-2 px-4'
        }"
      />
      <div class="flex items-center gap-2.5">
        <USelect
          v-model="lang"
          :items="langOptions"
          variant="ghost"
          class="w-fit"
          :ui="{
            base: 'font-medium uppercase',
            item: 'font-medium uppercase',
          }"
        />
        <UIcon
          name="i-material-symbols-dark-mode-outline"
          class="size-6 text-tone cursor-pointer"
          mode="svg"
          @click="isDark = !isDark"
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import CATEGORY from "~/mock/category";

const colorMode = useColorMode();
const productCategories = CATEGORY.map(c => {
  return { label: c.label };
});
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  }
});
const items = ref<NavigationMenuItem[]>([
  {
    label: "Tentang Kami",
  },
  {
    label: "Produk Kami",
    children: productCategories,
  },
  {
    label: "Servis",
  },
  {
    label: "Hubungi Kami",
  },
]);
const lang = ref<"id" | "us">("id");
const langOptions = ["id", "us"];
</script>
