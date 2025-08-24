<template>
  <div class="overflow-hidden">
    <div class="container">
      <section class="flex items-center -mt-16 min-h-dvh">
        <div class="space-y-32 py-32">
          <div class="shrink-0 space-y-6 text-tone text-center">
            <h1 class="text-5xl font-semibold [&_span]:text-primary">
              Pengalaman Lebih Dari <span>Satu Dekade</span>
            </h1>
            <p class="text-tone">
              bermula dari sebuah toko komputer di Harco Mangga Dua Computer Center
              Jakarta dipertengahan tahun 2000 sebagai toko komputer ritel, terus
              tumbuh dan berkembang secara kreatif dalam bisnis komputer dan
              perlengkapan serta komponen komputer. Dalam perjalannya, Wahana
              melebarkan sayapnya dalam bidang distribusi dan mengerjakan proyek
              baik dari pemerintah maupun swasta dari tahun 2010.
            </p>
          </div>
          <div class="relative">
            <Radial class="absolute top-1/2 left-1/2 -translate-1/2 size-[960px] -z-10" />
            <img
              src="/assets/images/illustrations/pc-parts.png"
              alt="PC Parts"
              width="598"
              height="598"
              class="w-full max-w-[598px] mx-auto"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      <section class="py-16">
        <div class="flex flex-wrap justify-center gap-16">
          <img
            v-for="brand in brands"
            :src="`/assets/images/logo/${brand.key}.svg`"
            :alt="`${brand.label}'s Logo'`"
            class="h-12"
          />
        </div>
      </section>
      <section class="relative space-y-16 py-16">
        <Radial class="absolute top-1/2 -left-[400px] -translate-y-1/2 size-[960px] -z-10" />
        <Radial class="absolute top-[300px] -right-[500px] size-[960px] -z-10" />
        <h1 class="text-5xl text-tone text-center font-semibold">
          Expertise Terbaik Untuk Bisnis Anda
        </h1>
        <div class="flex gap-6">
          <div
            v-for="business in businesses"
            class="w-full glass border border-accent rounded-xl"
          >
            <img
              :src="`/assets/images/illustrations/${business.img}`"
              :alt="business.img"
              class="w-full object-cover aspect-square rounded-t-xl" loading="lazy"
            />
            <div class="space-y-1 p-6">
              <h4 class="text-xl text-primary font-semibold">
                {{ business.title }}
              </h4>
              <p class="text-tone">
                <template v-for="industry in business.industries">
                  {{ industry }}<br />
                </template>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="space-y-16 py-16 text-center">
        <div class="space-y-8">
          <h1 class="text-5xl text-tone font-semibold [&_span]:text-primary">
            Arah Strategi Kami Dalam Pertumbuhan <span>Masa Depan</span> Bisnis
          </h1>
          <p class="text-tone">
            Kami percaya bahwa stagnasi bukanlah pilihan. Untuk tetap relevan dan menjadi yang terdepan, kami secara konsisten mengembangkan sayap bisnis kami ke berbagai area kunci. Setiap langkah yang kami ambil dirancang untuk menciptakan nilai lebih, baik bagi Anda maupun pasar.
          </p>
        </div>
        <div class="flex gap-3">
          <div
            v-for="strategy in strategies"
            class="space-y-1 glass p-3 border border-accent rounded-xl"
          >
            <UIcon :name="`i-${strategy.icon}`" class="size-5 mx-auto text-primary" mode="svg" />
            <p class="text-tone">{{ strategy.content }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const brands = [
  { key: "amd", label: "AMD" },
  { key: "corsair", label: "CORSAIR" },
  { key: "norden", label: "NORDEN" },
  { key: "acer", label: "Acer" },
  { key: "black-magic-design", label: "Blackmagic Design" },
  { key: "asrock", label: "ASRock" },
  { key: "kubik", label: "KUBIK Green Power" },
  { key: "toa", label: "TOA" },
  { key: "msi", label: "MSI" },
  { key: "commscope", label: "COMMSCOPE" },
];
const businesses = [
  {
    img: "pcb.jpg",
    title: "Produk & Solusi Teknologi",
    industries: [
      "Consumer Goods and Services",
      "Intel and AMD Products",
      "Multimedia products",
      "Scurity Products",
      "IoT and AI Products"
    ],
  },
  {
    img: "factory.jpg",
    title: "Pasar Bisnis dan Industri",
    industries: [
      "industries & Technology Markets",
      "B2B Services",
      "Finance",
      "Media",
      "Machinery",
      "Trade",
    ],
  },
  {
    img: "handshake.jpg",
    title: "Kapabilitas Riset Bisnis",
    industries: [
      "Research Network",
      "Brand Intelligence",
      "Benchmarking",
      "Global Data",
      "Trends",
    ],
  },
];
const strategies = [
  {
    icon: "material-symbols-devices-outline",
    content: "Merek lokal untuk produk AIO, Server dan Notebook",
  },
  {
    icon: "material-symbols-build-outline",
    content: "Managed Service sebagai pelebaran sayap bisnis",
  },
  {
    icon: "material-symbols-broadcast-on-personal-outline",
    content: "IoT dan turunannya baik sebagai platform dan produk independen",
  },
  {
    icon: "material-symbols-globe-asia",
    content: "Tap on internet retail dan B2B business sebagai solusi baru untuk marketing dan sales",
  },
  {
    icon: "material-symbols-phone-android-outline",
    content: "Mobile Application, dengan mengikuti dinamika perkembangan teknologi",
  },
];
</script>
