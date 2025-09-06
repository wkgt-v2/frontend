<template>
  <div class="container py-16">
    <div class="relative grid grid-cols-2 items-center gap-6 glass p-6 border border-accent rounded-4xl overflow-y-hidden">
      <Radial class="absolute -bottom-2/3 left-1/2 -translate-x-1/2 size-[960px] -z-10" />
      <div class="p-6">
        <h1 class="mb-1 text-5xl text-primary font-semibold">
          Kembangkan Bisnismu Dengan Kami
        </h1>
        <p class="mb-8 text-base text-tone">
          Kami fokus membangun hubungan yang kuat dengan vendor dan klien, memastikan solusi teknologi yang berkesinambungan.
          <br>
          <br>
          Konsultasikan dengan kami untuk mendapatkan solusi terbaik untuk kebutuhan bisnis anda.
        </p>
        <UButton
          size="lg"
          trailing-icon="i-material-symbols-arrow-right-alt-rounded"
          :to="$localePath('contact-us')"
        >
          Hubungi Kami
        </UButton>
      </div>
      <img src="/assets/images/illustrations/landing-2.jpg" alt="Typing on laptop" class="size-full aspect-square object-cover rounded-3xl">
    </div>
  </div>
</template>
