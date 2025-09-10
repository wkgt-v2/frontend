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
    <div class="grid grid-cols-6 gap-6">
      <NuxtLink
        v-for="category in categories"
        :key="category.category_id"
        :to="$localeRoute(`/products/${category.category_name}-${category.category_id}`)"
        class="w-full glass border border-accent rounded-xl"
      >
        <img
          :src="category.category_image"
          :alt="category.category_name"
          class="w-full object-cover aspect-square rounded-t-xl" loading="lazy"
        />
        <div class="space-y-1 p-6">
          <h5 class="text-base text-tone font-medium">
            {{ category.category_name }}
          </h5>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const categories = useCategories();
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
