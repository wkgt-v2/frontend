<template>
  <footer>
    <div class="w-full h-px bg-accent"></div>
    <div class="container flex flex-col md:flex-row justify-between gap-8 py-8">
      <div class="space-y-2 max-w-sm">
        <div class="space-y-1">
          <img src="/assets/images/logo.png" alt="Logo" class="h-8 dark:hidden">
          <img src="/assets/images/logo_dark-mode.png" alt="Logo" class="h-8 hidden dark:block">
          <div class="text-sm text-tone font-semibold">
            Solusi Perangkat Keras Komputer Untuk Bisnis Anda.
          </div>
        </div>
        <div class="text-sm text-tone leading-tight">
          Pusat Elektronika Harco Mangga Dua Block A Lt. III No. 155, Jalan Mangga Dua Raya - Jakarta Pusat.
        </div>
      </div>
      <div>
        <!-- social media here -->
      </div>
    </div>
    <div class="bg-inverted text-inverted">
      <div class="container flex flex-col md:flex-row-reverse items-start md:items-center justify-between gap-2 py-2">
        <div class="flex flex-col md:flex-row gap-2 md:gap-6">
          <UButton
            :to="$localePath('privacy-policy')"
            size="sm"
            variant="link"
            color="neutral"
            class="p-0 text-inverted hover:text-inverted"
          >
            Privacy Policy
          </UButton>
          <UButton
            size="sm"
            variant="link"
            color="neutral"
            class="p-0 text-inverted hover:text-inverted"
          >
            Terms of Service
          </UButton>
        </div>
        <div class="text-sm">Copyright © 2025 Wahana Komputer. All Right Reserved</div>
      </div>
    </div>
  </footer>
</template>
