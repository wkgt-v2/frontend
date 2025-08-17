<template>
  <div class="container space-y-8 py-16">
    <h1 class="text-5xl text-tone font-semibold">
      Call Center: <a href="tel:021-6125802" class="text-primary">021-6125802</a>
    </h1>

    <div class="space-y-3">
      <h5 class="text-base text-tone font-semibold">Lokasi Service Center</h5>
      <UTable :data="branches" class="flex-1" />
    </div>
  </div>
</template>

<script setup lang="ts">
const branches = [
  {
    city: "Kota Administrasi Jakarta Pusat",
    province: "Jakarta",
    address: "Ruko Cempaka Mas Blok J No.35",
    phone: "021-42884311 021-4228388",
    businessHours: "09:00 - 18:30"
  },
  {
    city: "Kota Administrasi Jakarta Pusat",
    province: "Jakarta",
    address: "Ruko Bahan Bangunan Blok F4 No.27, Jl. Mangga Dua Raya",
    phone: "021-6125802",
    businessHours: "09:00 - 18:00"
  },
  {
    city: "Kabupaten Bandung",
    province: "Jawa Barat",
    address: "Ruko Segitiga Mas Blok F No.9 Jl. A. Yani 221-223, Kosambi, Bandung",
    phone: "022-20503676 0852-25006163",
    businessHours: "09:00 - 18:00"
  },
  {
    city: "Kabupaten Sleman",
    province: "Yogyakarta",
    address: "Jl. Ring Road Utara No.14, Ruko Panda Kav.R&S, Sleman",
    phone: "0274-2921199 0818-02575758",
    businessHours: "09:00 - 18:00"
  },
  {
    city: "Kota Surabaya",
    province: "Jawa Timur",
    address: "Jl. Kayoon No.11, Embong Kaliasin, Kec. Genteng, Surabaya",
    phone: "0817-778919",
    businessHours: "09:00 - 18:00"
  },
  {
    city: "Kota Denpasar",
    province: "Bali",
    address: "Jl. Tibung Sari No.12, Padangsambian Kaja, Denpasar",
    phone: "0813-37664892",
    businessHours: "09:00 - 18:00"
  },
  {
    city: "Kota Medan",
    province: "Sumatra Utara",
    address: "Jl. Sutomo No.490, Gg. Buntu, Kota Medan",
    phone: "061-4568988 061-4159478",
    businessHours: "09:00 - 18:00"
  },
  {
    city: "Kota Pekanbaru",
    province: "Riau",
    address: "Jl. Tamtama No.7, Kel. Kota Tinggi, Pekanbaru Kota (belakang Mall Pekanbaru)",
    phone: "0852-78802568",
    businessHours: "09:00 - 18:00"
  },
  {
    city: "Kota Batam",
    province: "Kepulauan Riau",
    address: "Jl. Raja Ali H, Komplek Wira Mustika Blok.C No.10, Sei Jodoh, Batam",
    phone: "0778-431101 0812-77518888",
    businessHours: "09:00 - 18:00"
  },
  {
    city: "Kota Makassar",
    province: "Sulawesi Selatan",
    address: "Jl. Sungai Saddang Lama No.120A, Maricaya Baru, Makassar",
    phone: "0411-4673233 0811-4111536",
    businessHours: "09:00 - 18:00"
  }
];
</script>
