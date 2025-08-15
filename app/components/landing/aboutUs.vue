<template>
  <div class="relative py-16">
    <Radial class="absolute top-12 -left-1/5 size-[764px] -z-10" />
    <div class="container space-y-8 text-center">
      <div class="space-y-[30px] max-w-[835px] mx-auto">
        <h1 class="text-5xl text-primary font-semibold">
          Bersama Wahana Komputer
        </h1>
        <p class="text-sm text-tone text-center">
          Sebagai distributor yang berfokus pada kedisiplinan dan konsistensi, kami telah membantu berbagai proyek pemerintah dan swasta dengan solusi teknologi yang tepat.
        </p>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div v-for="item in items" class="space-y-1 p-6 border border-cyan-200 rounded-xl">
          <UIcon name="i-material-symbols-handshake-outline-rounded" class="size-5 mx-auto text-primary" mode="svg" />
          <h5 class="text-base text-primary font-semibold">
            {{ item.title }}
          </h5>
          <p class="text-base text-tone">
            {{ item.description }}
          </p>
        </div>
      </div>

      <UButton size="lg" trailing-icon="i-material-symbols-arrow-right-alt-rounded">Tentang Kami</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const items = [
  {
    title: "Pengalaman Teruji",
    description: "Kami fokus membangun hubungan yang kuat dengan vendor dan klien, memastikan solusi teknologi yang berkesinambungan.",
  },
  {
    title: "Kemitraan Jangka Panjang",
    description: "Kami fokus membangun hubungan yang kuat dengan vendor dan klien, memastikan solusi teknologi yang berkesinambungan.",
  },
  {
    title: "Komitmen Penuh",
    description: "Disiplin, fokus, dan konsistensi adalah nilai inti kami untuk selalu memberikan yang terbaik.",
  },
];
</script>
