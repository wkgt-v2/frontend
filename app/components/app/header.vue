<template>
  <!-- NAVBAR: mengikuti index.html -->
  <nav
    class="fixed top-0 w-full z-[100] bg-[rgba(5,5,5,0.9)] backdrop-blur-[10px] border-b border-[rgba(0,247,255,0.1)] px-[5%] py-5"
  >
    <!-- Mobile -->
    <div class="lg:hidden mx-auto w-[90%] max-w-[1200px] flex items-center justify-between">
      <NuxtLink :to="localePath('/')">
        <Logo />
      </NuxtLink>

      <USlideover side="top" v-model:open="openSlideover">
        <UButton
          variant="ghost"
          icon="i-material-symbols:menu"
          class="text-white/90 hover:text-[#00f7ff] transition"
        />

        <template #content>
          <div class="mx-auto w-[90%] max-w-[1200px] space-y-4 py-6">
            <div class="flex items-center justify-between">
              <NuxtLink :to="localePath('/')">
                <Logo />
              </NuxtLink>

              <UButton
                variant="ghost"
                icon="i-material-symbols:close"
                class="text-white/90 hover:text-[#00f7ff] transition"
                @click="openSlideover = false"
              />
            </div>

            <!-- Tetap pakai navItems (function tidak diubah) -->
            <UNavigationMenu
              orientation="vertical"
              :items="navItems"
              class="wkgt-nav wkgt-nav--mobile"
              :ui="{
                list: 'flex flex-col gap-3',
                link: 'text-[0.95rem] font-semibold text-white/90 hover:text-[#00f7ff] transition',
              }"
              @click="openSlideover = false"
            />

            <div class="flex items-center justify-between gap-4 pt-2 border-t border-white/10">
              <USelect
                v-model="lang"
                :items="langOptions"
                variant="ghost"
                class="w-fit"
                :ui="{
                  base: 'font-medium uppercase text-white/90',
                  item: 'font-medium uppercase',
                }"
                @change="changeLanguage"
              />
              <!-- <DarkModeToggler /> -->
            </div>
          </div>
        </template>
      </USlideover>
    </div>

    <!-- Desktop -->
    <div class="not-lg:hidden mx-auto w-[90%] max-w-[1200px] flex items-center justify-between">
      <NuxtLink :to="localePath('/')">
        <Logo />
      </NuxtLink>

      <!-- Tetap pakai UNavigationMenu agar dropdown Products + hover image tetap -->
      <UNavigationMenu
        :items="navItems"
        variant="link"
        class="wkgt-nav"
        :ui="{
          list: 'flex items-center gap-[30px]',
          link: 'text-[0.9rem] font-semibold text-white/90 hover:text-[#00f7ff] transition',
        }"
      >
        <!-- Products dropdown content: diperbaiki (lebih smooth + tidak jitter saat hover) -->
        <template #products-content="{ item }: { item: NavigationMenuItem }">
          <div
            class="wkgt-dropdown"
            @mouseenter="
              (!highlightedCategory && item.children?.length) &&
              (highlightedCategory = (item.children[0] as any).img)
            "
          >
            <!-- LEFT: preview -->
            <div v-if="highlightedCategory" class="wkgt-dropdown__preview">
              <Image :src="highlightedCategory" image-classes="aspect-square" />
            </div>

            <!-- RIGHT: links -->
            <div class="wkgt-dropdown__list">
              <ULink
                v-for="child in item.children"
                :key="child.label"
                :to="child.to"
                class="wkgt-dropdown__item"
                @mouseenter="highlightedCategory = (child as any).img"
              >
                <p class="wkgt-dropdown__text">
                  {{ child.label }}
                </p>
              </ULink>
            </div>
          </div>
        </template>
      </UNavigationMenu>

      <!-- Right actions (tetap ada, tapi dibuat senada dengan navbar index.html) -->
      <div class="flex items-center gap-3">
        <USelect
          v-model="lang"
          :items="langOptions"
          variant="ghost"
          size="lg"
          class="w-fit"
          :ui="{
            base: 'font-medium uppercase text-white/90',
            item: 'font-medium uppercase',
          }"
          @change="changeLanguage"
        />
        <!-- <DarkModeToggler /> -->
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import type { BlogCategory } from "~/types/blog";
import type { HttpSuccessWithPagination } from "~/types/http";

const { categories, refreshCategories } = useCategories();
refreshCategories();
const { locale, locales, setLocale, t } = useI18n();
const lang = ref(locale.value);
const langOptions = locales.value.map(l => {
  return { label: l.name, value: l.code };
});
const localePath = useLocalePath();
const localeRoute = useLocaleRoute();
const openSlideover = ref(false);

const { data: blogCategories } = await useFetch(
  `${useRuntimeConfig().public.apiBase}/blog-categories?limit=9999`,
  {
    transform: (value: HttpSuccessWithPagination<BlogCategory[]>) => {
      return value.data.data;
    },
  }
);

const navItems = computed(() => {
  return [
    {
      label: t("nav.about_us"),
      to: localePath("about-us"),
    },
    {
      label: t("nav.product"),
      to: localePath("products"),
      slot: "products" as const,
      children: productCategories.value,
    },
    {
      label: t("nav.article"),
      to: localePath("blog"),
      children: parsedBlogCategories.value,
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

const parsedBlogCategories = computed(() => {
  return (
    blogCategories.value?.map(c => {
      return {
        label: c.blog_category_name,
        to: localeRoute(`/blog?category=${c.blog_category_id}`),
      };
    }) || [
      {
        label: "",
        img: "",
        to: localeRoute(`/blog`),
      },
    ]
  );
});

const productCategories = computed(() => {
  return (
    categories.value?.map(c => {
      return {
        label: c.category_name,
        img: c.category_image,
        to: localeRoute(`/products/${c.category_name}-${c.category_id}`),
      };
    }) || [
      {
        label: "",
        img: "",
        to: localeRoute(`/products`),
      },
    ]
  );
});

const highlightedCategory = ref<string>();

function changeLanguage() {
  setLocale(lang.value);
}
</script>

<style scoped>
/* Dropdown dibuat senada dengan tema index.html (dark + cyan accent) */
.wkgt-dropdown {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 10px;

  padding: 12px;
  min-width: 560px;

  background: rgba(10, 10, 18, 0.98);
  border: 1px solid rgba(0, 247, 255, 0.12);
  border-radius: 14px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.55);
}

/* Preview (kiri) */
.wkgt-dropdown__preview {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

/* List (kanan) */
.wkgt-dropdown__list {
  display: grid;
  gap: 6px;

  max-height: 360px;
  overflow: auto;
  padding-right: 4px;
}

/* Item: border selalu ada (transparan) agar tidak "geser/jitter" saat hover */
.wkgt-dropdown__item {
  display: block;
  padding: 10px 10px;
  border-radius: 10px;

  border: 1px solid rgba(0, 247, 255, 0);
  background: rgba(255, 255, 255, 0);

  transition: background 0.2s, border-color 0.2s, transform 0.12s;
}

.wkgt-dropdown__item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(0, 247, 255, 0.18);
  transform: translateY(-1px);
}

.wkgt-dropdown__text {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  transition: color 0.2s;
}

.wkgt-dropdown__item:hover .wkgt-dropdown__text {
  color: #00f7ff;
}

/* scrollbar halus (optional) */
.wkgt-dropdown__list::-webkit-scrollbar {
  width: 8px;
}
.wkgt-dropdown__list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
}
.wkgt-dropdown__list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.18);
}
</style>
