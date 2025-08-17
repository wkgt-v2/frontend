<template>
  <nav class="fixed top-0 w-full bg-cyan-200/20 dark:bg-cyan-900/20 backdrop-blur-md shadow-md z-[99]">
    <div class="container flex flex-col md:flex-row items-center md:justify-between h-16">
      <NuxtLink :to="localePath('/')">
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
          @change="changeLanguage"
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

const { locale, locales, setLocale, t } = useI18n();
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  }
});
const lang = ref(locale.value);
const langOptions = locales.value.map(l => {
  return { label: l.name, value: l.code };
});
const localePath = useLocalePath();
const route = useRoute();

const productCategories = CATEGORY.map(c => {
  return { label: c.label };
});
const items = ref<NavigationMenuItem[]>([
  {
    label: t("nav.about_us"),
  },
  {
    label: t("nav.product"),
    children: productCategories,
  },
  {
    label: t("nav.services"),
    to: localePath("service"),
  },
  {
    label: t("nav.contact"),
    to: localePath("contact-us"),
  },
]);

function changeLanguage() {
  setLocale(lang.value);

  /**
   * need refresh the page to update the content of navigation items
   * also need timeout to wait for locale saved
   */
  setTimeout(() => {
    location.href = localePath(route.path, lang.value);
  }, 10);
}
</script>
