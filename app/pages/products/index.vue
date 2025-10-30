<template>
  <div
    class="container space-y-16 min-h-[calc(100dvh-64px)] py-16"
    @mousemove="updateRadialPosition"
  >
    <Teleport to="body">
      <div
        ref="radialRef"
        class="eclipse fixed size-[960px] pointer-events-none -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform"
      ></div>
    </Teleport>
    <h1 class="text-5xl text-primary text-center font-semibold">
      Produk Kami
    </h1>
    <div class="flex flex-wrap justify-center">
      <NuxtLink
        v-for="category in categories"
        :key="category.category_id"
        :to="$localeRoute(`/products/${category.category_name}-${category.category_id}`)"
        class="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6 p-1 md:p-2 lg:p-3"
      >
        <div class="h-full glass border border-accent rounded-xl">
          <img
            :src="category.category_image"
            :alt="category.category_name"
            class="w-full object-contain aspect-square rounded-t-xl" loading="lazy"
          />
          <div class="space-y-1 p-6">
            <h5 class="text-base text-tone font-medium">
              {{ category.category_name }}
            </h5>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { categories, refreshCategories } = useCategories();
refreshCategories();

const radialRef = useTemplateRef("radialRef");

function updateRadialPosition(e: MouseEvent) {
  const el = radialRef.value as HTMLDivElement;
  if (el) {
    el.style.left = `${e.clientX}px`;
    el.style.top = `${e.clientY}px`;
  }
}
</script>

<style scoped>
.eclipse {
  background: radial-gradient(
    50% 50% at 50% 50%,
    #00b8db1a 0%,
    rgba(0, 184, 219, 0) 100%
  );
}
</style>
