<template>
  <div class="relative container space-y-8 py-16 text-center">
    <Radial class="absolute -top-1/5 left-1/2 -translate-x-1/2 size-[764px] -z-10" />
    <div class="space-y-[30px] max-w-[835px] mx-auto">
      <h1 class="text-5xl text-primary font-semibold">
        Dipercaya Oleh Client Kami
      </h1>
      <p class="text-sm text-tone text-center">
        Berpengalaman lebih dari satu dekade dalam menyediakan produk berkualitas dan layanan menyeluruh, kami menjadi mitra andal bagi vendor dan klien di seluruh Indonesia.
      </p>
    </div>

    <div class="flex justify-center gap-16">
      <img
        v-for="client in clients"
        :src="`/assets/images/logo/${client.id}.svg`"
        :alt="`${client.name}'s logo'`"
        class="h-[72px]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const clients = [
  {
    id: "kimia-farma",
    name: "Kimia Farma",
  },
  {
    id: "kemensos",
    name: "Kementerian Sosial Republik Indonesia",
  },
  {
    id: "metranet",
    name: "Metranet",
  },
  {
    id: "mitratel",
    name: "Mitratel",
  },
];
</script>

