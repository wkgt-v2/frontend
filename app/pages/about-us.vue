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
        <UCarousel
          v-slot="{ item }"
          :items="businesses"
          class="w-full not-sm:max-w-xs mx-auto lg:hidden"
          :ui="{ item: 'sm:basis-1/2' }"
          dots
        >
          <div class="w-full glass border border-accent rounded-xl">
            <img
              :src="`/assets/images/illustrations/${item.img}`"
              :alt="item.img"
              class="w-full object-cover aspect-square rounded-t-xl" loading="lazy"
            />
            <div class="space-y-1 p-6">
              <h4 class="text-xl text-primary font-semibold">
                {{ item.title }}
              </h4>
              <p class="text-tone">
                <template v-for="industry in item.industries">
                  {{ industry }}<br />
                </template>
              </p>
            </div>
          </div>
        </UCarousel>
        <div class="not-lg:hidden grid grid-cols-3 gap-6">
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
        <div class="not-lg:grid not-lg:grid-cols-2 lg:flex gap-3">
          <div
            v-for="strategy in strategies"
            class="space-y-1 glass p-3 border border-accent rounded-xl"
          >
            <UIcon :name="`i-${strategy.icon}`" class="size-5 mx-auto text-primary" mode="svg" />
            <p class="text-tone">{{ strategy.content }}</p>
          </div>
        </div>
      </section>
      <section class="space-y-16 py-16 text-center">
        <h1 class="text-5xl text-tone font-semibold [&_span]:text-primary">
          Arah Strategi Kami Dalam Pertumbuhan <span>Masa Depan</span> Bisnis
        </h1>
        <UCarousel
          v-slot="{ item }"
          :items="timelines"
          :ui="{
            container: 'transition-[height]',
          }"
          class="w-full max-w-2xl mx-auto"
          auto-height
          dots
        >
          <div class="w-full glass border border-accent rounded-xl">
            <div class="space-y-1 p-6">
              <h4 class="text-xl text-primary font-semibold">
                {{ item.date }}
              </h4>
              <UTimeline :default-value="item.items.length-1" :items="item.items" class="w-full" :ui="{ title: 'text-left' }" />
            </div>
          </div>
        </UCarousel>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: t("nav.about_us"),
});

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
const timelines = [
  {
    date: "2023 - 2024",
    items: [
      { title: "Engage sebagai distributor produk outdoor antenna Commscope brand" },
      { title: "Kerjasama Fujitsu Indonesia develop massive data profiling untuk Kejagung" },
      { title: "Kerjasama Kemenag develop Edusmart Box produk pembelajaran offline" },
      { title: "Pengadaan hardware melalu e catalog dengan Dinas Pendidikan" },
      { title: "Pengadaan antenna outdoor untuk IKN bekerja sama dengan Mitratel dan Commscope" },
      { title: "Development new portfolio berupa aplikasi POS dan ERP : KubikPOS" },
      { title: "Engage sebagai sole distributor untuk produk networking brand Norden UK" },
    ],
  },
  {
    date: "2021 - 2022",
    items: [
      { title: "Tablet Kubik Genta 10" },
      { title: "Set Top Box Kubik Arca DVB-T2" },
      { title: "MOU dengan PGN Com project IOT Platform JARGAS" },
      { title: "Project Kemendikbudristek Pusat Keunggulan SMK" },
      { title: "MOU dengan Avirtech Portfolio drone" },
      { title: "Licensed Distributorship Produk 4G dengan brand ATEL" },
      { title: "MOU dengan Telkomsat sebagai partner iOT dan LORA" },
      { title: "MOU dengan PDAM dalam pengadaan smart meter berbasis IoT" },
      { title: `Pekerjaan Project MA "Digitalisasi Ruang Sidang" Bekerja sama dengan Acer sebagai brand supporting` },
      { title: "Pengembangan produk enterprise untuk drone berbasis iOT dan AI" },
      { title: "Project Diknas melalui platform SIPLAH terutama di bidang SMK Pusat Keunggulan" },
    ],
  },
  {
    date: "2019 - 2020",
    items: [
      { title: "Proyek pengadaan melalui e-catalog di Kementerian Pendidikan dan Kebudayaan RI" },
      { title: "Proyek pengadaan melalui e-catalog di Kementerian Sosial Republik Indonesia" },
      { title: "Pengembangan product merk local kubik berupa AIO & Tablet" },
      { title: "Partership dengan NHR taiwan untuk pengembangan IOT platform" },
      { title: "Proyek E-Drive di Korlantas Kepolisian Republik Indonesia" },
      { title: "Pengadaan prangkat keras vidio production & broadcasting untuk SMK jurusan animasi" },
    ],
  },
  {
    date: "2015 - 2018",
    items: [
      { title: "Bersama PT. Tugunet Teknologi Indonesia proyek data center Starcloud bekerja sama denganTelkom Sigma." },
      { title: "Proyek pembaruan payment gateway system PT. POS Indonesia." },
      { title: "Supporting StarCloud Project Telkom Sigma" },
      { title: "Proyek Bank Sumut" },
      { title: "Project Sensor meteran gas dan listrik salah satu gedung di Rasuna Said Jakarta." },
      { title: "Supporting BRI project managed service BRI Box, kerjasama dengan PT INTI" },
    ],
  },
  {
    date: "2001 - 2012",
    items: [
      { title: " Berpartisipasi dalam pengadaan komputer dan server dalam proyek Menristek" },
      { title: "Proyek pengadaan komputer Pemda Kubu Raya dan Pontianak" },
      { title: "Bersama dengan PT. Dwi Daya Tama proyek edukasi daerah pengadaan timur Indonesia" },
      { title: "Resmi sole distributor produk J&W" },
      { title: "Resmi sole distributor produk Raidmax." },
      { title: "Resmi sole distributor produk HIS" },
    ],
  },
];
</script>
