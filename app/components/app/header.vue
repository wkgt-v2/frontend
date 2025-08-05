<template>
  <nav class="fixed top-0 w-full bg-white shadow-md z-[99]">
    <div class="container flex flex-col md:flex-row items-center md:justify-between h-16">
      <NuxtLink to="/">
        <img src="/assets/images/ic_logo.png" alt="Logo" class="h-10">
      </NuxtLink>
      <UNavigationMenu :items="items" :ui="{ childList: 'gap-0 p-1', childLink: 'py-2 px-4' }" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import CATEGORY from "~/mock/category";

const productCategories = CATEGORY.map(c => {
  return { label: c.label };
});
// const onTop = ref(true);
const items = ref<NavigationMenuItem[]>([
  {
    label: "About Us",
    active: true,
  },
  {
    label: "Product",
    children: productCategories,
  },
  {
    label: "Contact",
  },
  {
    label: "Services",
  },
]);

// function handleWindowScroll(e: Event) {
//   const body = (e.target as HTMLElement);
//   console.log(body)
// }

// onMounted(() => {
//   window.addEventListener("scroll", handleWindowScroll);
// });

// onUnmounted(() => {
//   window.removeEventListener("scroll", handleWindowScroll);
// });
</script>
