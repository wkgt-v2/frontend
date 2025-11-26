<template>
  <div class="overflow-hidden">
    <div class="container">
      <section class="flex items-center -mt-16 min-h-dvh">
        <div class="space-y-32 py-32">
          <div class="shrink-0 space-y-6 text-tone text-center">
            <h1 class="text-5xl font-semibold [&_span]:text-primary" v-html="parseI18n($t('about_us.section1.title'))"></h1>
            <p class="text-tone">
              {{ $t("about_us.section1.content") }}
            </p>
          </div>
          <div class="relative">
            <Radial class="absolute top-1/2 left-1/2 -translate-1/2 size-[960px] -z-10" />
            <img
              src="/assets/images/illustrations/pc-parts.png"
              alt="PC Parts"
              width="598"
              height="598"
              class="w-full max-w-[598px] mx-auto"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      <section class="py-16">
        <div class="flex flex-wrap justify-center gap-16">
          <NuxtLink
            v-for="brand in brands"
            :key="brand.sm_id"
            :to="brand.sm_url"
            target="_blank"
          >
            <img
              :src="brand.sm_icon"
              :alt="brand.sm_name"
              class="h-12"
              loading="lazy"
            />
          </NuxtLink>
        </div>
      </section>
      <section class="relative space-y-16 py-16">
        <Radial class="absolute top-1/2 -left-[400px] -translate-y-1/2 size-[960px] -z-10" />
        <Radial class="absolute top-[300px] -right-[500px] size-[960px] -z-10" />
        <h1 class="text-5xl text-tone text-center font-semibold">
          {{ $t("about_us.section2.title") }}
        </h1>
        <UCarousel
          v-slot="{ item }"
          :items="businesses"
          class="w-full not-sm:max-w-xs mx-auto lg:hidden"
          :ui="{ item: 'sm:basis-1/2' }"
          dots
        >
          <div class="w-full glass border border-accent rounded-xl">
            <img
              :src="`/assets/images/illustrations/${item.img}`"
              :alt="item.img"
              class="w-full object-cover aspect-square rounded-t-xl" loading="lazy"
            />
            <div class="space-y-1 p-6">
              <h4 class="text-xl text-primary font-semibold">
                {{ item.title }}
              </h4>
              <p class="text-tone">
                <template v-for="industry in item.industries">
                  {{ industry }}<br />
                </template>
              </p>
            </div>
          </div>
        </UCarousel>
        <div class="not-lg:hidden grid grid-cols-3 gap-6">
          <div
            v-for="business in businesses"
            class="w-full glass border border-accent rounded-xl"
          >
            <img
              :src="`/assets/images/illustrations/${business.img}`"
              :alt="business.img"
              class="w-full object-cover aspect-square rounded-t-xl" loading="lazy"
            />
            <div class="space-y-1 p-6">
              <h4 class="text-xl text-primary font-semibold">
                {{ business.title }}
              </h4>
              <p class="text-tone">
                <template v-for="industry in business.industries">
                  {{ industry }}<br />
                </template>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="space-y-16 py-16 text-center">
        <div class="space-y-8">
          <h1 class="text-5xl text-tone font-semibold [&_span]:text-primary" v-html="parseI18n($t('about_us.section3.title'))"></h1>
          <p class="text-tone">
            {{ $t("about_us.section3.content") }}
          </p>
        </div>
        <UCarousel
          v-slot="{ item }"
          :items="strategies"
          class="w-full"
          :ui="{ item: 'sm:basis-1/2 lg:basis-1/3 h-full' }"
          dots
          autoplay
        >
          <div class="space-y-1 glass p-6 border border-accent rounded-xl">
            <UIcon :name="item.icon" class="size-8 mx-auto text-primary" mode="svg" />
            <p class="text-lg text-tone">
              {{ item.content }}
            </p>
          </div>
        </UCarousel>
      </section>
      <section class="space-y-16 py-16 text-center">
        <h1 class="text-5xl text-tone font-semibold [&_span]:text-primary" v-html="parseI18n($t('about_us.section4.title'))"></h1>
        <UCarousel
          v-slot="{ item }"
          :items="timelines"
          :ui="{
            container: 'transition-[height]',
          }"
          class="w-full max-w-2xl mx-auto"
          auto-height
          dots
        >
          <div class="w-full glass border border-accent rounded-xl">
            <div class="space-y-1 p-6">
              <h4 class="text-xl text-primary font-semibold">
                {{ item.date }}
              </h4>
              <UTimeline :default-value="item.items.length-1" :items="item.items" class="w-full" :ui="{ title: 'text-left' }" />
            </div>
          </div>
        </UCarousel>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HttpSuccessWithPagination } from "~/types/http";
import type { Brand } from "~/types/marketing";

const { t } = useI18n();

useHead({
  title: t("nav.about_us"),
});

const { data: brands } = await useFetch(
  `${useRuntimeConfig().public.apiBase}/social-medias?sm_type=brand`,
  {
    transform: (value: HttpSuccessWithPagination<Brand[]>) => {
      return value.data.data;
    },
  }
);
const businesses = computed(() => {
  return [
    {
      img: "pcb.jpg",
      title: t("about_us.section2.business1.title"),
      industries: [
        t("about_us.section2.business1.industry1"),
        t("about_us.section2.business1.industry2"),
        t("about_us.section2.business1.industry3"),
        t("about_us.section2.business1.industry4"),
        t("about_us.section2.business1.industry5"),
      ],
    },
    {
      img: "factory.jpg",
      title: t("about_us.section2.business2.title"),
      industries: [
        t("about_us.section2.business2.industry1"),
        t("about_us.section2.business2.industry2"),
        t("about_us.section2.business2.industry3"),
        t("about_us.section2.business2.industry4"),
        t("about_us.section2.business2.industry5"),
        t("about_us.section2.business2.industry6"),
      ],
    },
    {
      img: "handshake.jpg",
      title: t("about_us.section2.business3.title"),
      industries: [
        t("about_us.section2.business3.industry1"),
        t("about_us.section2.business3.industry2"),
        t("about_us.section2.business3.industry3"),
        t("about_us.section2.business3.industry4"),
        t("about_us.section2.business3.industry5"),
      ],
    },
  ];
});
const strategies = computed(() => {
  return [
    {
      icon: "i-material-symbols-devices-outline",
      content: t("about_us.section3.strategy1"),
    },
    {
      icon: "i-material-symbols-build-outline",
      content: t("about_us.section3.strategy2"),
    },
    {
      icon: "i-material-symbols-broadcast-on-personal-outline",
      content: t("about_us.section3.strategy3"),
    },
    {
      icon: "i-material-symbols-globe-asia",
      content: t("about_us.section3.strategy4"),
    },
    {
      icon: "i-material-symbols-phone-android-outline",
      content: t("about_us.section3.strategy5"),
    },
  ];
});
const timelines = computed(() => {
  return [
    {
      date: "2023 - 2024",
      items: [
        { title: t("about_us.section4.timeline1.item1") },
        { title: t("about_us.section4.timeline1.item2") },
        { title: t("about_us.section4.timeline1.item3") },
        { title: t("about_us.section4.timeline1.item4") },
        { title: t("about_us.section4.timeline1.item5") },
        { title: t("about_us.section4.timeline1.item6") },
        { title: t("about_us.section4.timeline1.item7") },
      ],
    },
    {
      date: "2021 - 2022",
      items: [
        { title: t("about_us.section4.timeline2.item1") },
        { title: t("about_us.section4.timeline2.item2") },
        { title: t("about_us.section4.timeline2.item3") },
        { title: t("about_us.section4.timeline2.item4") },
        { title: t("about_us.section4.timeline2.item5") },
        { title: t("about_us.section4.timeline2.item6") },
        { title: t("about_us.section4.timeline2.item7") },
        { title: t("about_us.section4.timeline2.item8") },
        { title: t("about_us.section4.timeline2.item9") },
        { title: t("about_us.section4.timeline2.item10") },
        { title: t("about_us.section4.timeline2.item11") },
      ],
    },
    {
      date: "2019 - 2020",
      items: [
        { title: t("about_us.section4.timeline3.item1") },
        { title: t("about_us.section4.timeline3.item2") },
        { title: t("about_us.section4.timeline3.item3") },
        { title: t("about_us.section4.timeline3.item4") },
        { title: t("about_us.section4.timeline3.item5") },
        { title: t("about_us.section4.timeline3.item6") },
      ],
    },
    {
      date: "2015 - 2018",
      items: [
        { title: t("about_us.section4.timeline4.item1") },
        { title: t("about_us.section4.timeline4.item2") },
        { title: t("about_us.section4.timeline4.item3") },
        { title: t("about_us.section4.timeline4.item4") },
        { title: t("about_us.section4.timeline4.item5") },
        { title: t("about_us.section4.timeline4.item6") },
      ],
    },
    {
      date: "2001 - 2012",
      items: [
        { title: t("about_us.section4.timeline5.item1") },
        { title: t("about_us.section4.timeline5.item2") },
        { title: t("about_us.section4.timeline5.item3") },
        { title: t("about_us.section4.timeline5.item4") },
        { title: t("about_us.section4.timeline5.item5") },
        { title: t("about_us.section4.timeline5.item6") },
      ],
    },
  ];
});
</script>
