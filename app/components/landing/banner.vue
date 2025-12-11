<template>
  <div v-if="data?.length" class="container py-16">
    <UCarousel
      v-slot="{ item }"
      :items="data"
      :autoplay="{ delay: 5000 }"
      loop
      dots
      auto-height
      :ui="{ dots: 'bottom-4' }"
    >
      <NuxtLink :to="item.banner_url || undefined" target="_blank">
        <Image
          :src="item.banner_image"
          image-classes="max-h-[420px] mx-auto rounded-lg md:rounded-2xl"
        />
      </NuxtLink>
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
import type { HttpSuccess } from "~/types/http";
import type { Banner } from "~/types/marketing";

const { data } = await useFetch(
  `${useRuntimeConfig().public.apiBase}/banner-schedules/active`,
  {
    transform: (value: HttpSuccess<Banner[]>) => {
      return value.data;
    },
  }
);
</script>
