<template>
  <div class="overflow-hidden">
    <div class="container">
      <section class="relative flex items-center -mt-16 lg:-mt-20">
        <Radial class="absolute -top-1/3 -left-1/4 size-[960px] -z-10" />
        <div class="absolute inset-0 border-b border-primary overflow-hidden -z-10">
          <Radial class="absolute bottom-0 left-1/2 translate-y-[55%] -translate-x-1/2 size-[960px] -z-10" />
        </div>
        <div class="not-lg:space-y-16 not-lg:mx-auto not-lg:text-center lg:grid lg:grid-cols-2 items-center gap-6 lg:gap-12 w-fit py-16 lg:py-32">
          <img
            src="/assets/images/illustrations/tree.jpg"
            alt="Tree"
            width="678"
            height="680"
            class="w-full not-lg:max-w-lg aspect-9/10 object-cover"
            loading="lazy"
          />
          <div class="shrink-0 space-y-6 max-w-lg text-tone">
            <p class="text-tone text-justify">
              {{ $t("about_us.section1.content") }}
            </p>
          </div>
        </div>
      </section>
      <section class="space-y-16 py-16 text-center">
        <h1 class="text-5xl text-tone font-semibold [&_span]:text-primary">
          “Do or Do Not <span>There Is No Try</span>.” — Yoda
        </h1>
        <div class="flex flex-wrap items-stretch justify-center gap-y-4">
          <div v-for="culture in cultures" class="w-full sm:w-1/2 md:w-1/3 px-2">
            <div class="space-y-1 glass h-full p-6 border border-accent rounded-xl">
              <UIcon :name="culture.icon" class="size-8 mx-auto text-primary" mode="svg" />
              <h5 class="text-lg text-primary font-semibold">
                {{ culture.title }}
              </h5>
              <p class="text-lg text-tone">
                {{ culture.description }}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="flex items-center min-h-dvh">
        <div class="space-y-32 py-32">
          <div class="shrink-0 space-y-6 text-tone text-center">
            <h1 class="text-5xl font-semibold [&_span]:text-primary" v-html="parseI18n($t('about_us.section3.title'))"></h1>
            <p class="text-tone">
              {{ $t("about_us.section3.content") }}
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
            <Image
              :src="brand.sm_icon"
              :alt="brand.sm_name"
              height="h-12"
            />
          </NuxtLink>
        </div>
      </section>
      <section class="relative space-y-16 py-16">
        <Radial class="absolute top-1/2 -left-[400px] -translate-y-1/2 size-[960px] -z-10" />
        <Radial class="absolute top-[300px] -right-[500px] size-[960px] -z-10" />
        <h1 class="text-5xl text-tone text-center font-semibold">
          {{ $t("about_us.section4.title") }}
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
          <h1 class="text-5xl text-tone font-semibold [&_span]:text-primary" v-html="parseI18n($t('about_us.section5.title'))"></h1>
          <p class="text-tone">
            {{ $t("about_us.section5.content") }}
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
      <section class="space-y-16 py-16">
        <h1 class="text-5xl text-tone text-center font-semibold [&_span]:text-primary" v-html="parseI18n($t('about_us.section6.title'))"></h1>
        <UStepper :items="timelines" class="w-full">
          <template #content="{ item }">
            <div class="flex justify-center pt-4">
              <UTimeline
                :default-value="item.items.length-1"
                :items="item.items"
                class="translate-x-[calc(50%-1rem)]"
                :ui="{
                  root: 'max-w-[calc(50%-44px)]',
                  item: 'even:flex-row-reverse even:-translate-x-[calc(100%-2rem)] even:text-right',
                }"
              />
            </div>
          </template>
        </UStepper>
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
const cultures = computed(() => {
  return [
    {
      icon: "i-material-symbols:workspace-premium",
      title: t("about_us.section2.culture1.title"),
      description: t("about_us.section2.culture1.description"),
    },
    {
      icon: "i-material-symbols:schedule-outline",
      title: t("about_us.section2.culture2.title"),
      description: t("about_us.section2.culture2.description"),
    },
    {
      icon: "i-material-symbols:verified-user-outline",
      title: t("about_us.section2.culture3.title"),
      description: t("about_us.section2.culture3.description"),
    },
    {
      icon: "i-material-symbols:forum-outline",
      title: t("about_us.section2.culture4.title"),
      description: t("about_us.section2.culture4.description"),
    },
    {
      icon: "i-material-symbols:psychology-alt-outline",
      title: t("about_us.section2.culture5.title"),
      description: t("about_us.section2.culture5.description"),
    },
    {
      icon: "i-material-symbols:record-voice-over-outline",
      title: t("about_us.section2.culture6.title"),
      description: t("about_us.section2.culture6.description"),
    },
    {
      icon: "i-material-symbols:autorenew",
      title: t("about_us.section2.culture7.title"),
      description: t("about_us.section2.culture7.description"),
    },
    {
      icon: "i-material-symbols:groups-2-outline",
      title: t("about_us.section2.culture8.title"),
      description: t("about_us.section2.culture8.description"),
    },
  ];
});
const businesses = computed(() => {
  return [
    {
      img: "pcb.jpg",
      title: t("about_us.section4.business1.title"),
      industries: [
        t("about_us.section4.business1.industry1"),
        t("about_us.section4.business1.industry2"),
        t("about_us.section4.business1.industry3"),
        t("about_us.section4.business1.industry4"),
        t("about_us.section4.business1.industry5"),
      ],
    },
    {
      img: "factory.jpg",
      title: t("about_us.section4.business2.title"),
      industries: [
        t("about_us.section4.business2.industry1"),
        t("about_us.section4.business2.industry2"),
        t("about_us.section4.business2.industry3"),
        t("about_us.section4.business2.industry4"),
        t("about_us.section4.business2.industry5"),
        t("about_us.section4.business2.industry6"),
      ],
    },
    {
      img: "handshake.jpg",
      title: t("about_us.section4.business3.title"),
      industries: [
        t("about_us.section4.business3.industry1"),
        t("about_us.section4.business3.industry2"),
        t("about_us.section4.business3.industry3"),
        t("about_us.section4.business3.industry4"),
        t("about_us.section4.business3.industry5"),
      ],
    },
  ];
});
const strategies = computed(() => {
  return [
    {
      icon: "i-material-symbols-devices-outline",
      content: t("about_us.section5.strategy1"),
    },
    {
      icon: "i-material-symbols-build-outline",
      content: t("about_us.section5.strategy2"),
    },
    {
      icon: "i-material-symbols-broadcast-on-personal-outline",
      content: t("about_us.section5.strategy3"),
    },
    {
      icon: "i-material-symbols-globe-asia",
      content: t("about_us.section5.strategy4"),
    },
    {
      icon: "i-material-symbols-phone-android-outline",
      content: t("about_us.section5.strategy5"),
    },
  ];
});
const timelines = computed(() => {
  return [
    {
      title: "2001 - 2012",
      icon: "i-material-symbols:flag-circle-outline",
      items: [
        { title: t("about_us.section6.timeline5.item1") },
        { title: t("about_us.section6.timeline5.item2") },
        { title: t("about_us.section6.timeline5.item3") },
        { title: t("about_us.section6.timeline5.item4") },
        { title: t("about_us.section6.timeline5.item5") },
        { title: t("about_us.section6.timeline5.item6") },
      ],
    },
    {
      title: "2015 - 2018",
      icon: "i-material-symbols:timeline",
      items: [
        { title: t("about_us.section6.timeline4.item1") },
        { title: t("about_us.section6.timeline4.item2") },
        { title: t("about_us.section6.timeline4.item3") },
        { title: t("about_us.section6.timeline4.item4") },
        { title: t("about_us.section6.timeline4.item5") },
        { title: t("about_us.section6.timeline4.item6") },
      ],
    },
    {
      title: "2019 - 2020",
      icon: "i-material-symbols:change-history-outline",
      items: [
        { title: t("about_us.section6.timeline3.item1") },
        { title: t("about_us.section6.timeline3.item2") },
        { title: t("about_us.section6.timeline3.item3") },
        { title: t("about_us.section6.timeline3.item4") },
        { title: t("about_us.section6.timeline3.item5") },
        { title: t("about_us.section6.timeline3.item6") },
      ],
    },
    {
      title: "2021 - 2022",
      icon: "i-material-symbols:donut-small-outline",
      items: [
        { title: t("about_us.section6.timeline2.item1") },
        { title: t("about_us.section6.timeline2.item2") },
        { title: t("about_us.section6.timeline2.item3") },
        { title: t("about_us.section6.timeline2.item4") },
        { title: t("about_us.section6.timeline2.item5") },
        { title: t("about_us.section6.timeline2.item6") },
        { title: t("about_us.section6.timeline2.item7") },
        { title: t("about_us.section6.timeline2.item8") },
        { title: t("about_us.section6.timeline2.item9") },
        { title: t("about_us.section6.timeline2.item10") },
        { title: t("about_us.section6.timeline2.item11") },
      ],
    },
    {
      title: "2023 - 2024",
      icon: "i-material-symbols:flag-outline",
      items: [
        { title: t("about_us.section6.timeline1.item1") },
        { title: t("about_us.section6.timeline1.item2") },
        { title: t("about_us.section6.timeline1.item3") },
        { title: t("about_us.section6.timeline1.item4") },
        { title: t("about_us.section6.timeline1.item5") },
        { title: t("about_us.section6.timeline1.item6") },
        { title: t("about_us.section6.timeline1.item7") },
      ],
    },
  ];
});
</script>
