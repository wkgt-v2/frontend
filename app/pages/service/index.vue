<template>
  <div class="container grid grid-cols-2 gap-6 py-16">
    <div class="space-y-8">
      <div class="space-y-3">
        <h5 class="text-base text-primary font-semibold">
          CEK PERBAIKAN 
        </h5>
        <h1 class="text-5xl text-tone font-semibold [&_span]:text-primary">
          Cek Status Perbaikan.
        </h1>
      </div>
      <p class="max-w-[480px] text-base text-tone">
        Perkiraan tanggal penyelesaian hanyalah referensi dan tidak selalu ditampilkan. Tanggal penyelesaian dapat berubah berdasarkan pada kondisi perbaikan.
        <br />
        <br />
        Anda dapat mengetahui status perbaikan produk Anda dengan memasukkan Nomor Perbaikan yang tertera pada form perbaikan yang Anda terima saat menyerahkan Produk Anda untuk diperbaiki di WAHANA Service Center ataupun dengan cara memasukan Serial Number dari produk Anda.
        <br />
        <br />
        Dalam hal ini Anda tidak dapat mengetahui status perbaikan produk Anda, jika produk Anda perbaiki belum mendapatkan Nomor Perbaikan dari WAHANA Service Center terkait. Untuk Nomor Perbaikan, silahkan cek pada form tanda terima penyerahan perbaikan produk Anda. Contoh Nomor Perbaikan (IDXXXXXXXX).
      </p>
      <div class="grid grid-cols-2 items-end gap-6">
        <div class="space-y-1">
          <label for="id_perbaikan" class="text-base text-tone">
            Nomor ID Perbaikan
          </label>
          <UInput name="id_perbaikan" size="lg" variant="subtle" placeholder="IDXXXXXXXX" class="w-full" />
        </div>
        <UButton size="lg" class="w-fit">Cek Status</UButton>
      </div>
    </div>
    <img
      src="/assets/images/illustrations/planning.jpg"
      alt="Planning"
      width="600"
      height="600"
      class="size-full object-cover rounded-2xl"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">

</script>
