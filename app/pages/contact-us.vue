<template>
  <div class="container grid grid-cols-2 gap-6 py-16">
    <div class="space-y-8">
      <div class="space-y-3">
        <h5 class="text-base text-primary font-semibold">
          CONTACT US
        </h5>
        <h1 class="text-5xl text-tone font-semibold [&_span]:text-primary">
          Mulai Bangun Perangkat Keras Bersama Kami Untuk <span>Bisnis Anda</span>.
        </h1>
      </div>
      <div class="flex gap-2">
        <UIcon name="i-material-symbols-pin-drop-outline" class="size-5 text-primary" />
        <div class="space-y-1">
          <h5 class="text-base text-primary font-semibold">
            Alamat Kami
          </h5>
          <p class="text-base text-tone">
            Pusat Elektronika Harco Mangga Dua Block A Lt. III No. 155, Jalan Mangga Dua Raya - Jakarta Pusat.
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <UIcon name="i-material-symbols-schedule-outline" class="size-5 text-primary" />
        <div class="space-y-1">
          <h5 class="text-base text-primary font-semibold">
            Jam Buka
          </h5>
          <p class="text-base text-tone">
            Senin - Sabtu<br />
            Jam 09.00 - 18.00<br />
            Hari Minggu & tanggal merah tutup
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <UIcon name="i-material-symbols-mail-outline" class="size-5 text-primary" />
        <div class="space-y-1">
          <h5 class="text-base text-primary font-semibold">
            Email
          </h5>
          <p class="text-base text-tone">
            <a href="mailto:info@wahana-online.com">info@wahana-online.com</a>
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <UIcon name="i-material-symbols-call-outline" class="size-5 text-primary" />
        <div class="space-y-1">
          <h5 class="text-base text-primary font-semibold">
            Call Center
          </h5>
          <p class="text-base text-tone">
            021-6125802
          </p>
        </div>
      </div>
      <div class="flex gap-6">
        <UButton
          size="lg"
          to="https://wa.me/6285281987121"
          target="_blank"
        >
          <template #leading>
            <icon-whatsapp class="size-5" />
          </template>
          Whatsapp
        </UButton>
        <UButton size="lg" :to="$localePath('/service/location')">Lokasi Service Center</UButton>
      </div>
    </div>
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2572.2403127532466!2d106.82756952539509!3d-6.139185447621377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5f9ba767e65%3A0xb78f0a7312c6b7d0!2sWahana%20Komputer!5e0!3m2!1sen!2sid!4v1755416984361!5m2!1sen!2sid"
      width="600"
      height="600"
      class="size-full border-0 rounded-2xl"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    ></iframe>
  </div>
</template>
