<template>
  <!-- background section seperti #services -->
  <section class="relative py-24 bg-[color:var(--bg-secondary,#0a0a12)] text-white">
    <!-- container diperlebar -->
    <div class="relative mx-auto w-[92%] max-w-[1400px] space-y-10 text-center">
      <Radial class="absolute top-12 -left-1/5 size-[764px] -z-10" />

      <!-- Title putih + underline accent -->
      <div class="space-y-4 max-w-[900px] mx-auto">
        <h1 class="text-5xl font-semibold tracking-wide text-white">
          {{ $t("landing.about_us.title") }}
        </h1>

        <div
          class="mx-auto h-[3px] w-[64px]
                 bg-[color:var(--accent-blue,#00f7ff)]
                 shadow-[0_0_12px_rgba(0,247,255,0.6)]"
        />

        <p class="text-base text-[color:var(--text-gray,#b3b3b3)]">
          {{ $t("landing.about_us.subtitle") }}
        </p>
      </div>

      <!-- Card style seperti .service-card -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="item in items"
          :key="item.title"
          class="rounded-2xl p-12 transition-all duration-300 text-left
                 bg-white/[0.03] border border-white/10
                 hover:border-[color:var(--accent-blue,#00f7ff)]
                 hover:-translate-y-2
                 hover:shadow-[0_10px_30px_-10px_rgba(0,247,255,0.3)]"
        >
          <UIcon
            :name="item.icon"
            class="size-10 mb-6
                   text-[color:var(--accent-blue,#00f7ff)]
                   drop-shadow-[0_0_10px_rgba(0,247,255,0.6)]"
            mode="svg"
          />

          <h5 class="text-2xl font-semibold text-white mb-3">
            {{ item.title }}
          </h5>

          <p class="text-lg leading-relaxed text-[color:var(--text-gray,#b3b3b3)]">
            {{ item.description }}
          </p>
        </div>
      </div>

      <!-- Button vibe seperti .btn-cyber -->
      <div class="pt-2">
        <UButton
          size="lg"
          trailing-icon="i-material-symbols-arrow-right-alt-rounded"
          :to="$localePath('about-us')"
          class="px-10 py-4 font-semibold tracking-wide
                 bg-transparent border-2
                 border-[color:var(--accent-blue,#00f7ff)]
                 text-[color:var(--accent-blue,#00f7ff)]
                 hover:bg-[color:var(--accent-blue,#00f7ff)]
                 hover:text-[color:var(--bg-main,#050505)]
                 hover:shadow-[0_0_30px_rgba(0,247,255,0.6)]"
        >
          {{ $t("landing.about_us.cta") }}
        </UButton>
      </div>
    </div>
  </section>
</template>



<script setup lang="ts">
const { t } = useI18n();
const items = computed(() => {
  return [
    {
      icon: "i-material-symbols:verified-outline",
      title: t("landing.about_us.item1.title"),
      description: t("landing.about_us.item1.description"),
    },
    {
      icon: "i-material-symbols:handshake-outline",
      title: t("landing.about_us.item2.title"),
      description: t("landing.about_us.item2.description"),
    },
    {
      icon: "i-material-symbols:task-alt",
      title: t("landing.about_us.item3.title"),
      description: t("landing.about_us.item3.description"),
    },
  ];
});
</script>
