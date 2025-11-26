<template>
  <div class="container py-16">
    <div class="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-6 glass p-6 border border-accent rounded-4xl overflow-hidden">
      <Radial class="absolute -bottom-2/3 left-1/2 -translate-x-1/2 size-[960px] -z-10" />
      <div class="p-6 text-center lg:text-left">
        <h1 class="mb-1 text-5xl text-primary font-semibold">
          {{ $t("landing.contact_us.title") }}
        </h1>
        <p class="mb-8 text-base text-tone">
          {{ $t("landing.contact_us.subtitle1") }}
          <br>
          <br>
          {{ $t("landing.contact_us.subtitle2") }}
        </p>
        <UButton
          size="lg"
          trailing-icon="i-material-symbols-arrow-right-alt-rounded"
          :to="$localePath('contact-us')"
        >
          {{ $t("landing.contact_us.cta") }}
        </UButton>
      </div>
      <img src="/assets/images/illustrations/landing-2.jpg" alt="Typing on laptop" class="sm:hidden lg:block size-full aspect-square object-cover rounded-3xl">
    </div>
  </div>
</template>
