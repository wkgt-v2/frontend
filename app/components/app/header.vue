<template>
  <nav class="fixed top-0 w-full glass shadow-md z-[99]">
    <div class="container flex flex-col md:flex-row items-center md:justify-between h-16">
      <NuxtLink :to="localePath('/')">
        <img src="/assets/images/logo.png" alt="Logo" class="h-10 dark:hidden">
        <img src="/assets/images/logo_dark-mode.png" alt="Logo" class="h-10 hidden dark:block">
      </NuxtLink>
      <UNavigationMenu :items="navItems" variant="link">
        <template #products-content="{ item }: { item: NavigationMenuItem }">
          <div class="grid grid-cols-2 gap-0.5 py-2 px-4">
            <div v-if="highlightedCategory" class="row-span-6 p-2">
              <img :src="highlightedCategory" class="size-full object-cover">
            </div>
            <ULink
              v-for="child in item.children"
              :key="child.label"
              class="hover:bg-elevated/50 py-1 px-2 text-sm text-left rounded-md"
              @mouseenter="highlightedCategory = child.img"
            >
              <p class="font-medium text-tone">
                {{ child.label }}
              </p>
            </ULink>
          </div>
        </template>
      </UNavigationMenu>
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
          @change="changeLanguage"
        />
        <DarkModeToggler />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import type { Category } from "~/types/product";

const categories = useState<Category[]>("categories");
const { locale, locales, setLocale, t } = useI18n();
const lang = ref(locale.value);
const langOptions = locales.value.map(l => {
  return { label: l.name, value: l.code };
});
const localePath = useLocalePath();

const navItems = computed(() => {
  return [
    {
      label: t("nav.about_us"),
      to: localePath("about-us"),
    },
    {
      label: t("nav.product"),
      slot: "products" as const,
      children: productCategories.value,
    },
    {
      label: t("nav.services"),
      to: localePath("service"),
    },
    {
      label: t("nav.contact"),
      to: localePath("contact-us"),
    },
  ] as NavigationMenuItem[];
});
const productCategories = computed(() => {
  return categories.value?.map(c => {
    return { label: c.category_name, img: c.category_image };
  }) || [];
});

const highlightedCategory = ref<string>();

function changeLanguage() {
  setLocale(lang.value);
}
</script>
