<template>
  <div class="relative container space-y-8 py-16 text-center">
    <Radial class="absolute top-12 -left-1/5 size-[764px] -z-10" />
    <div class="space-y-[30px] max-w-[835px] mx-auto">
      <h1 class="text-5xl text-primary font-semibold">
        {{ $t("landing.about_us.title") }}
      </h1>
      <p class="text-base text-tone text-center">
        {{ $t("landing.about_us.subtitle") }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="item in items" class="space-y-1 glass p-6 border border-accent rounded-xl">
        <UIcon :name="item.icon" class="size-8 mx-auto text-primary" mode="svg" />
        <h5 class="text-lg text-primary font-semibold">
          {{ item.title }}
        </h5>
        <p class="text-lg text-tone">
          {{ item.description }}
        </p>
      </div>
    </div>

    <UButton
      size="lg"
      trailing-icon="i-material-symbols-arrow-right-alt-rounded"
      :to="$localePath('about-us')"
    >
      {{ $t("landing.about_us.cta") }}
    </UButton>
  </div>
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
