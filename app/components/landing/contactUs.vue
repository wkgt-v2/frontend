<template>
  <!-- match overall theme (dark + cyber accent) -->
  <section class="relative py-24 bg-[color:var(--bg-main,#050505)] text-white">
    <div class="relative mx-auto w-[92%] max-w-[1200px]">
      <div
        class="relative grid grid-cols-1 lg:grid-cols-2 items-stretch gap-10
               bg-white/[0.03] border border-white/10 rounded-[32px]
               p-8 lg:p-12 overflow-hidden"
      >
        <!-- glow background -->
        <Radial class="absolute -bottom-2/3 left-1/2 -translate-x-1/2 size-[960px] -z-10" />

        <!-- subtle gradients -->
        <div class="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.02] via-transparent to-transparent" />
        <div class="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[rgba(0,247,255,0.08)] blur-3xl" />
        <div class="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[rgba(0,247,255,0.06)] blur-3xl" />

        <!-- LEFT -->
        <div class="relative flex flex-col justify-center text-center lg:text-left">
          <!-- section-title style -->
          <h1 class="text-5xl font-semibold tracking-[2px] uppercase">
            {{ $t("landing.contact_us.title") }}
          </h1>
          <div
            class="mx-auto lg:mx-0 mt-5 h-[3px] w-[60px]
                   bg-[color:var(--accent-blue,#00f7ff)]
                   shadow-[0_0_10px_rgba(0,247,255,0.75)]"
          />

          <p class="mt-6 text-base leading-relaxed text-[color:var(--text-gray,#b3b3b3)]">
            {{ $t("landing.contact_us.subtitle1") }}
            <br />
            <br />
            {{ $t("landing.contact_us.subtitle2") }}
          </p>

          <!-- mini highlights -->
          <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p class="text-xs tracking-[2px] uppercase text-[color:var(--accent-blue,#00f7ff)]">
                Response
              </p>
              <p class="text-sm text-white/90">Fast & friendly</p>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p class="text-xs tracking-[2px] uppercase text-[color:var(--accent-blue,#00f7ff)]">
                Consultation
              </p>
              <p class="text-sm text-white/90">Free initial call</p>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p class="text-xs tracking-[2px] uppercase text-[color:var(--accent-blue,#00f7ff)]">
                Support
              </p>
              <p class="text-sm text-white/90">After delivery</p>
            </div>
          </div>

          <!-- CTA like btn-cyber -->
          <div class="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-start">
            <UButton
              size="lg"
              trailing-icon="i-material-symbols-arrow-right-alt-rounded"
              :to="$localePath('contact-us')"
              class="px-10 py-4 font-bold tracking-wide uppercase
                     bg-transparent border-2
                     border-[color:var(--accent-blue,#00f7ff)]
                     text-[color:var(--accent-blue,#00f7ff)]
                     hover:bg-[color:var(--accent-blue,#00f7ff)]
                     hover:text-[color:var(--bg-main,#050505)]
                     hover:shadow-[0_0_30px_rgba(0,247,255,0.6)]"
            >
              {{ $t("landing.contact_us.cta") }}
            </UButton>

            <p class="text-xs text-[color:var(--text-gray,#b3b3b3)]">
              No spam. Just a quick reply.
            </p>
          </div>
        </div>

        <!-- RIGHT (image panel like portfolio/journey vibe) -->
        <div class="relative hidden lg:block">
          <div class="relative h-full w-full overflow-hidden rounded-[24px] border border-[#222]">
            <img
              src="/assets/images/illustrations/landing-2.jpg"
              alt="Typing on laptop"
              class="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <!-- dark overlay + cyan edge glow -->
            <div class="absolute inset-0 bg-black/35" />
            <div class="absolute inset-0 ring-1 ring-[rgba(0,247,255,0.18)]" />

            <!-- bottom info strip -->
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <div class="rounded-2xl bg-black/50 border border-white/10 backdrop-blur px-5 py-4">
                <p class="text-sm font-semibold text-white">
                  Let’s build something secure & scalable.
                </p>
                <p class="text-xs mt-1 text-[color:var(--text-gray,#b3b3b3)]">
                  Infrastructure • Cloud • Cyber Security • Custom Systems
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- MOBILE IMAGE (optional, so it still looks rich on phone) -->
        <div class="lg:hidden mt-8">
          <div class="relative overflow-hidden rounded-2xl border border-[#222]">
            <img
              src="/assets/images/illustrations/landing-2.jpg"
              alt="Typing on laptop"
              class="w-full h-[220px] object-cover"
            />
            <div class="absolute inset-0 bg-black/35" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
