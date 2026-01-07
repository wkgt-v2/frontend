<template>
  <!-- match #catalogue -->
  <section class="relative py-24 bg-[color:var(--bg-main,#050505)] text-white">
    <div class="relative mx-auto w-[92%] max-w-[1200px] space-y-12 text-center">
      <Radial class="absolute top-12 -right-1/3 size-[764px] -z-10" />

      <!-- match .section-title -->
      <div class="space-y-4">
        <h1 class="text-5xl font-semibold tracking-[2px] uppercase">
          {{ $t("landing.categories.title") }}
        </h1>
        <div
          class="mx-auto h-[3px] w-[60px]
                 bg-[color:var(--accent-blue,#00f7ff)]
                 shadow-[0_0_10px_rgba(0,247,255,0.75)]"
        />
      </div>

      <!-- match .catalogue-grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-[2]">
        <NuxtLink
          v-for="category in categories"
          :key="category.category_id"
          :to="$localeRoute(`/products/${category.category_name}-${category.category_id}`)"
          class="block"
        >
          <!-- match .product-item -->
          <div
            class="bg-[color:var(--bg-secondary,#0a0a12)]
                   border border-[#222]
                   p-6 text-center transition-all duration-300
                   hover:border-[color:var(--accent-blue,#00f7ff)]"
          >
            <!-- match .product-placeholder vibe -->
            <div
              class="h-[180px] bg-[#1a1a25]
                     flex items-center justify-center
                     border border-dashed border-[#333]
                     mb-5 overflow-hidden"
            >
              <Image
                :src="category.category_image"
                :alt="category.category_name"
                width="w-40"
                height="h-40"
                class="mx-auto object-contain"
              />
            </div>

            <h5 class="text-lg font-semibold text-white">
              {{ category.category_name }}
            </h5>

            <!-- like "View Specs >" -->
            <p class="mt-2 font-medium text-[color:var(--accent-blue,#00f7ff)]">
              {{ $t("landing.categories.cta") }} &gt;
            </p>
          </div>
        </NuxtLink>
      </div>

      <!-- match .btn-cyber -->
      <div class="pt-2">
        <UButton
          size="lg"
          trailing-icon="i-material-symbols-arrow-right-alt-rounded"
          :to="$localePath('products')"
          class="px-10 py-4 font-bold tracking-wide uppercase
                 bg-transparent border-2
                 border-[color:var(--accent-blue,#00f7ff)]
                 text-[color:var(--accent-blue,#00f7ff)]
                 hover:bg-[color:var(--accent-blue,#00f7ff)]
                 hover:text-[color:var(--bg-main,#050505)]
                 hover:shadow-[0_0_30px_rgba(0,247,255,0.6)]"
        >
          {{ $t("landing.categories.cta") }}
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { categories, refreshCategories } = useCategories();
refreshCategories();
</script>
