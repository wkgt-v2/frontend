<template>
  <div class="relative container space-y-8 py-16 text-center">
    <Radial class="absolute -top-1/5 left-1/2 -translate-x-1/2 size-[764px] -z-10" />
    <div class="space-y-[30px] max-w-[835px] mx-auto">
      <h1 class="text-5xl text-primary font-semibold">
        {{ $t("landing.client.title") }}
      </h1>
      <p class="text-sm text-tone text-center">
        {{ $t("landing.client.subtitle") }}
      </p>
    </div>

    <div class="flex flex-wrap justify-center gap-16">
      <NuxtLink
        v-for="client in clients"
        :key="client.sm_id"
        :to="client.sm_url"
        target="_blank"
      >
        <Image :src="client.sm_icon" :alt="client.sm_name" height="h-[72px]" />
      </NuxtLink>
    </div>
  </div>
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
