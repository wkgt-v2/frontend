<template>
  <div class="relative container flex items-center -mt-16 min-h-dvh">
    <Radial class="absolute -top-1/3 -left-1/4 size-[960px] -z-10" />
    <Radial class="absolute -top-1/5 -right-1/5 size-[960px] -z-10" />
    <div class="absolute inset-0 border-b border-primary overflow-hidden -z-10">
      <Radial class="absolute bottom-0 left-1/2 translate-y-[55%] -translate-x-1/2 size-[960px] -z-10" />
    </div>
    <div class="not-lg:space-y-16 not-lg:mx-auto not-lg:text-center lg:grid lg:grid-cols-2 items-center gap-6 lg:gap-12 py-16 lg:py-32">
      <div class="shrink-0 space-y-6 max-w-lg text-tone">
        <h1 class="text-5xl font-semibold [&_span]:text-primary" v-html="parseI18n($t('landing.hero.title'))"></h1>
        <p class="text-tone">
          {{ $t("landing.hero.subtitle") }}
        </p>
      </div>
      <img
        src="/assets/images/illustrations/pc-parts.png"
        alt="PC Parts"
        width="678"
        height="680"
        class="w-full not-lg:max-w-lg"
        loading="lazy"
      />
    </div>
  </div>
</template>

