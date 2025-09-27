<template>
  <UApp>
    <div class="flex" @mousemove="updateRadialPosition">
      <Teleport to="body">
        <div
          ref="radialRef"
          class="eclipse fixed size-[960px] pointer-events-none -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform"
          :class="{ hidden: !radialEnabled }"
        ></div>
      </Teleport>
      <div class="not-lg:hidden shrink-0 space-y-4 w-80 h-dvh glass py-4 px-6 border-r border-accent">
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
      <div class="w-full lg:w-[calc(100%-320px)]">
        <header
          ref="header"
          class="flex items-center h-[72px] glass px-6 border-b border-accent"
        >
          <USlideover side="left" v-model:open="openSlideover">
            <UButton variant="outline" icon="i-material-symbols:menu" class="lg:hidden" />

            <template #content>
              <div class="space-y-4 h-dvh p-4">
                <div class="flex items-center justify-between">
                  <NuxtLink :to="localePath('/')">
                    <img src="/assets/images/logo.png" alt="Logo" class="h-10 dark:hidden">
                    <img src="/assets/images/logo_dark-mode.png" alt="Logo" class="h-10 not-dark:hidden">
                  </NuxtLink>
                  <UButton
                    variant="outline"
                    icon="i-material-symbols:close"
                    class="ml-auto"
                    @click="openSlideover = false"
                  />
                </div>
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
                  <UButton
                    variant="ghost"
                    :label="user.user_username"
                    trailing-icon="i-material-symbols-person-outline"
                    block
                  />
                </UDropdownMenu>
              </div>
            </template>
          </USlideover>
          <DarkModeToggler class="ml-auto" />
        </header>
        <main class="overflow-auto" :style="{ maxHeight: contentHeight }">
          <slot />
        </main>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Wahana Komputer` : "Wahana Komputer";
  },
});

const localePath = useLocalePath();
const nav = {
  dashboard: {
    label: "Dashboard",
    to: localePath("cms-dashboard"),
    onSelect: closeSlideover,
  },
  product: {
    label: "Product",
    children: [
      {
        label: "Categories",
        to: localePath("cms-product-categories"),
        onSelect: closeSlideover,
      },
      {
        label: "Series",
        to: localePath("cms-product-series"),
        onSelect: closeSlideover,
      },
      {
        label: "Items",
        to: localePath("cms-product-items"),
        onSelect: closeSlideover,
      },
    ],
  },
  marketing: {
    label: "Marketing",
    children: [
      {
        label: "Banners",
        to: localePath("cms-marketing-banners"),
        onSelect: closeSlideover,
      },
      {
        label: "Banner Schedules",
        to: localePath("cms-marketing-banner-schedules"),
        onSelect: closeSlideover,
      },
      {
        label: "Brands",
        to: localePath("cms-marketing-brands"),
        onSelect: closeSlideover,
      },
      {
        label: "Clients",
        to: localePath("cms-marketing-clients"),
        onSelect: closeSlideover,
      },
      {
        label: "Social Media",
        to: localePath("cms-marketing-socials"),
        onSelect: closeSlideover,
      },
    ],
  },
  service: {
    label: "Service",
    children: [
      {
        label: "Orders",
        to: localePath("cms-service-orders"),
        onSelect: closeSlideover,
      },
      {
        label: "Centers",
        to: localePath("cms-service-centers"),
        onSelect: closeSlideover,
      },
    ],
  },
  sales: {
    label: "Sales",
    children: [
      {
        label: "Leads",
        to: localePath("cms-sales-leads"),
        onSelect: closeSlideover,
      },
      {
        label: "Activities",
        to: localePath("cms-sales-activities"),
        onSelect: closeSlideover,
      },
      {
        label: "Orders",
        to: localePath("cms-sales-orders"),
        onSelect: closeSlideover,
      },
      {
        label: "KPI",
        to: localePath("cms-sales-kpi"),
        onSelect: closeSlideover,
      },
    ],
  },
  blog: {
    label: "Blog",
    children: [
      {
        label: "Categories",
        to: localePath("cms-blog-categories"),
        onSelect: closeSlideover,
      },
      {
        label: "Articles",
        to: localePath("cms-blog-articles"),
        onSelect: closeSlideover,
      },
    ],
  },
  settings: {
    label: "Settings",
    children: [
      {
        label: "Users",
        to: localePath("cms-settings-users"),
        onSelect: closeSlideover,
      },
      {
        label: "Roles",
        to: localePath("cms-settings-roles"),
        onSelect: closeSlideover,
      },
    ],
  },
};

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
const navItems = ref<NavigationMenuItem[]>(useSuperadmin() ? [
  nav.dashboard,
  nav.product,
  nav.marketing,
  nav.service,
  nav.sales,
  nav.blog,
  nav.settings,
] : [
  nav.dashboard,
  nav.sales,
]);

const frame = ref<number>();
const headerRef = useTemplateRef("header");
const openSlideover = ref(false);
const radialRef = ref<HTMLDivElement>();
const route = useRoute();
const { token } = useToken();
const user = useUser();

const contentHeight = computed(() => {
  let headerHeight = 72;
  if (headerRef.value) {
    headerHeight = headerRef.value.offsetHeight;
  }
  return `calc(100dvh - ${headerHeight}px)`;
});
const radialEnabled = computed(() => {
  const superadmin = useSuperadmin() ? [] : ["cms-sales-kpi"];
  const routes = ["cms-dashboard", ...superadmin];
  /* remove suffix `___locale` */
  const pathName = (route.name as string).replace(/___\w+$/, "");
  return routes.includes(pathName);
});

function closeSlideover() {
  openSlideover.value = false;
}

function updateRadialPosition(e: MouseEvent) {
  if (!radialEnabled.value) return;
  if (frame.value) cancelAnimationFrame(frame.value);
  frame.value = requestAnimationFrame(() => {
    const el = radialRef.value;
    if (el) {
      el.style.setProperty("--x", `${e.clientX}px`);
      el.style.setProperty("--y", `${e.clientY}px`);
    }
  });
}
</script>

<style scoped>
.eclipse {
  --y: 0px;
  --x: 0px;
  top: var(--y);
  left: var(--x);
  background: radial-gradient(
    50% 50% at 50% 50%,
    #00b8db1a 0%,
    rgba(0, 184, 219, 0) 100%
  );
}
</style>
