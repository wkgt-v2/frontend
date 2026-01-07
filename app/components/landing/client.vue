<template>
  <!-- match #journey -->
  <section class="relative py-24 bg-[color:var(--bg-secondary,#0a0a12)] text-white">
    <div class="relative mx-auto w-[92%] max-w-[1200px]">
      <Radial class="absolute -top-1/5 left-1/2 -translate-x-1/2 size-[764px] -z-10" />

      <!-- match .section-title -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-semibold tracking-[2px] uppercase">
          {{ $t("landing.client.title") }}
        </h1>
        <div
          class="mx-auto mt-5 h-[3px] w-[60px]
                 bg-[color:var(--accent-blue,#00f7ff)]
                 shadow-[0_0_10px_rgba(0,247,255,0.75)]"
        />
      </div>

      <!-- match .journey-layout -->
      <div class="flex flex-col lg:flex-row gap-16 items-center">
        <!-- left: journey-text -->
        <div class="flex-1 text-left">
          <h3 class="text-2xl font-semibold tracking-[2px] uppercase mb-4">
            {{ $t("landing.client.title") }}
          </h3>

          <p class="text-[color:var(--text-gray,#b3b3b3)] mb-6 leading-relaxed">
            {{ $t("landing.client.subtitle") }}
          </p>

          <!-- optional: button vibe (kalau kamu mau, tinggal aktifkan)
          <UButton
            size="lg"
            class="px-10 py-4 font-bold tracking-wide uppercase
                   bg-transparent border-2
                   border-[color:var(--accent-blue,#00f7ff)]
                   text-[color:var(--accent-blue,#00f7ff)]
                   hover:bg-[color:var(--accent-blue,#00f7ff)]
                   hover:text-[color:var(--bg-main,#050505)]
                   hover:shadow-[0_0_30px_rgba(0,247,255,0.6)]"
          >
            Read Full Story
          </UButton>
          -->
        </div>

        <!-- right: clients-display -->
        <div class="flex-1 w-full grid grid-cols-2 gap-5">
          <NuxtLink
            v-for="client in clients"
            :key="client.sm_id"
            :to="client.sm_url"
            target="_blank"
            class="block"
          >
            <!-- match .client-box -->
            <div
              class="h-[100px] bg-white/5 flex items-center justify-center
                     font-bold text-[#555] border border-transparent
                     transition-all duration-300
                     hover:text-[color:var(--accent-blue,#00f7ff)]
                     hover:border-[color:var(--accent-blue,#00f7ff)]
                     hover:shadow-[inset_0_0_15px_rgba(0,247,255,0.2)]"
            >
              <Image
                :src="client.sm_icon"
                :alt="client.sm_name"
                height="h-[72px]"
                class="object-contain max-h-[72px] max-w-[180px]"
              />
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HttpSuccessWithPagination } from "~/types/http";
import type { Client } from "~/types/marketing";

const { data: clients } = await useFetch(
  `${useRuntimeConfig().public.apiBase}/social-medias?sm_type=client`,
  {
    transform: (value: HttpSuccessWithPagination<Client[]>) => {
      return value.data.data;
    },
  }
);
</script>
